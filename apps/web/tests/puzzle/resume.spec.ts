import { test, expect } from '@playwright/test';
import { dismissOrientationSuggestion } from './mocks';

test.describe('하루퍼즐 (Haroo Puzzle) Resume E2E 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.innerHTML = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      });
    });
  });

  // ----------------------------------------------------
  // 7. 퍼즐 진행 상황 임시 저장 후 메인 홈 이동 시 이어하기 활성화 검증
  // ----------------------------------------------------
  test('6. 퍼즐 진행 상황 저장 후 메인 홈 이동 시 이어하기 버튼 활성화 검증 (0% 진행 포함)', async ({ page }) => {
    // 0. NextAuth Session Mocking
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            name: '테스터',
            email: 'test@example.com',
            kakaoId: 'mock-kakao-id-123456',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // 1. 진행 상황 조회 API Mocking (진행도 0% 이지만 detailState 존재 상태)
    await page.route('**/api/puzzle/progress?puzzleId=puzzle-mock-id-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            progress: 0,
            lastPlayedAt: new Date().toISOString(),
            detailState: {
              difficulty: 'novice',
              mode: 'ranked',
              timerSeconds: 15,
              board: Array(36).fill(null),
              trayPieces: Array.from({ length: 36 }, (_, i) => i),
              startedAt: new Date(Date.now() - 15000).toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        }),
      });
    });

    // 2. 내 프로필 API Mocking (완주 내역 없음)
    await page.route('**/api/puzzle/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            profile: { nickname: '테스터', createdAt: new Date().toISOString() },
            statistics: { totalCompleted: 0, bestTimeBeginner: null, bestRank: null },
            history: []
          }
        }),
      });
    });

    // 3. 메인 홈 진입
    await page.goto('/puzzle');
    await dismissOrientationSuggestion(page);

    // 4. "이어하기 (0%)" 버튼이 노출되는지 검증
    const resumeButton = page.locator('button:has-text("이어하기 (0%)")').first();
    await expect(resumeButton).toBeVisible();
  });

  // ----------------------------------------------------
  // 7. 퍼즐 완주 후 메인 홈 이동 시 이어하기 버튼 비활성화(숨김) 검증
  // ----------------------------------------------------
  test('7. 퍼즐 완주 후 메인 홈 이동 시 이어하기 버튼 비활성화(숨김) 검증', async ({ page }) => {
    // 0. NextAuth Session Mocking
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            name: '테스터',
            email: 'test@example.com',
            kakaoId: 'mock-kakao-id-123456',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // 1. 진행 상황 조회 API Mocking (진행도 50%의 novice 저장 기록이 있는 상황)
    await page.route('**/api/puzzle/progress?puzzleId=puzzle-mock-id-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            progress: 50,
            lastPlayedAt: new Date().toISOString(),
            detailState: {
              difficulty: 'novice',
              mode: 'ranked',
              timerSeconds: 45,
              board: Array(36).fill(null),
              trayPieces: Array.from({ length: 18 }, (_, i) => i),
              startedAt: new Date(Date.now() - 45000).toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        }),
      });
    });

    // 2. 내 프로필 API Mocking (novice 난이도 완주 이력 존재)
    await page.route('**/api/puzzle/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            profile: { nickname: '테스터', createdAt: new Date().toISOString() },
            statistics: { totalCompleted: 1, bestTimeBeginner: null, bestRank: null },
            history: [
              {
                puzzleId: 'puzzle-mock-id-001',
                difficulty: 'novice',
                mode: 'ranked',
                completionTime: 120,
                completed: true,
                savedAt: new Date().toISOString()
              }
            ]
          }
        }),
      });
    });

    // 3. 메인 홈 진입
    await page.goto('/puzzle');
    await dismissOrientationSuggestion(page);

    // 4. 완주한 난이도와 동일하므로 "이어하기" 버튼이 노출되지 않아야 함
    const resumeButton = page.locator('button:has-text("이어하기")').first();
    await expect(resumeButton).toBeHidden();

    // 5. 대신 완주함 배지 및 결과/랭킹 보기와 다시 도전하기 버튼이 노출되어야 함
    await expect(page.locator('text=완료함 (초보)')).toBeVisible();
    await expect(page.locator('text=결과 및 랭킹 보기')).toBeVisible();
    await expect(page.locator('text=다시 도전하기')).toBeVisible();
  });

});
