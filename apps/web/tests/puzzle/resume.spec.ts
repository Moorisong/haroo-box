import { test, expect } from '@playwright/test';
import { setupBaseMocks, dismissOrientationSuggestion } from './mocks';

test.describe('하루퍼즐 (Haroo Puzzle) Resume E2E 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await setupBaseMocks(page);
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

  // ----------------------------------------------------
  // 8. 퍼즐 완주 후, 완주 시점 이후에 새로 시작한 임시 저장 진행 정보가 있을 때 이어하기 노출 검증 (재도전 이어하기)
  // ----------------------------------------------------
  test('8. 퍼즐 완주 후, 완주 시점 이후에 새로 시작한 임시 저장 진행 정보가 있을 때 이어하기 노출 검증', async ({ page }) => {
    const now = Date.now();
    const completionTime = new Date(now - 60000).toISOString(); // 1분 전 완주
    const saveTime = new Date(now).toISOString(); // 방금 임시 저장

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

    // 1. 진행 상황 조회 API Mocking (완주 시점 이후에 저장된 novice 40% 진행 기록)
    await page.route('**/api/puzzle/progress?puzzleId=puzzle-mock-id-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            progress: 40,
            lastPlayedAt: saveTime,
            detailState: {
              difficulty: 'novice',
              mode: 'ranked',
              timerSeconds: 30,
              board: Array(36).fill(null),
              trayPieces: Array.from({ length: 20 }, (_, i) => i),
              startedAt: new Date(now - 30000).toISOString(),
              updatedAt: saveTime,
            }
          }
        }),
      });
    });

    // 2. 내 프로필 API Mocking (과거 완주 이력)
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
                savedAt: completionTime
              }
            ]
          }
        }),
      });
    });

    // 3. 메인 홈 진입
    await page.goto('/puzzle');
    await dismissOrientationSuggestion(page);

    // 4. 완주 이력이 있지만 완주 이후의 임시 저장이므로 "이어하기 (40%)"가 보여야 함
    const resumeButton = page.locator('button:has-text("이어하기 (40%)")').first();
    await expect(resumeButton).toBeVisible();
  });

  // ----------------------------------------------------
  // 9. 아카이브 페이지에서 완주 후 새로운 난이도 재도전 시 경고 모달 오작동 방지 검증
  // ----------------------------------------------------
  test('9. 아카이브 페이지에서 완주 후 새로운 난이도 재도전 시 경고 모달 오작동 방지 검증', async ({ page }) => {
    const now = Date.now();
    const completionTime = new Date(now - 60000).toISOString(); // 1분 전 novice 완주
    const saveTime = new Date(now).toISOString(); // 방금 expert 임시 저장

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

    // 1. 내 프로필 API Mocking (novice 완주 기록 및 expert 진행 중 기록 반환)
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
                savedAt: completionTime
              },
              {
                puzzleId: 'puzzle-mock-id-001',
                difficulty: 'expert',
                mode: 'ranked',
                completionTime: 0,
                completed: false,
                savedAt: saveTime,
                progress: 60
              }
            ]
          }
        }),
      });
    });

    // 2. 아카이브 페이지 진입
    await page.goto('/puzzle/archive');

    // 3. active progress가 있으므로 카드가 "도전 중" 상태여야 하며, "이어서 하기" 버튼이 노출되어야 함
    await expect(page.locator('text=도전 중').first()).toBeVisible();
    await expect(page.locator('text=이어서 하기').first()).toBeVisible();

    // 4. "새로 시작" 버튼을 클릭하여 모달을 띄웠을 때
    const startNewButton = page.locator('button:has-text("새로 시작")').first();
    await expect(startNewButton).toBeVisible();
    await startNewButton.click({ force: true });

    // 5. 모달이 열리면 기본으로 진행 중인 난이도인 '고수'가 선택되어야 함
    const modalHeader = page.locator('text=플레이 옵션 설정');
    await expect(modalHeader).toBeVisible();

    // 6. '고수' 버튼이 활성화(배경색 등으로 선택 상태 표시)되어 있는지 확인하고, 고수를 선택했을 때 이미 저장되어 있던 난이도이므로 초기화 경고창(새로 시작할 경우...)이 노출되지 않아야 함
    const resetWarning = page.locator('text=새로 시작할 경우 기존에 기록 중이던 퍼즐판 진행 데이터가 완전히 초기화됩니다');
    
    // 만약 고수를 클릭하면, 기존 진행 난이도(expert)와 동일하므로 경고가 떠선 안됨
    const expertTab = page.locator('button:has-text("고수")');
    await expertTab.click({ force: true });
    
    // resetWarning은 보이지 않고, 버튼 텍스트가 '이어서 하기'로 표시되어야 함
    await expect(resetWarning).toBeHidden();
    const launchButton = page.locator('button:has-text("이어서 하기")').first();
    await expect(launchButton).toBeVisible();
  });

});
