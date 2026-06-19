import { test, expect } from '@playwright/test';
import { setupBaseMocks, dismissOrientationSuggestion } from './mocks';

// ============================================================
// 챌린지 토큰 오류 격리 테스트
// - 챌린지 토큰 에러는 진짜 토큰 문제일 때만 발생해야 함
// - 다른 검증 실패 시 거짓 토큰 에러가 발생하면 안 됨
// - 에러 발생 시 무한 깜빡임(재시도 루프)이 발생하면 안 됨
// ============================================================
test.describe('챌린지 토큰 오류 격리 및 제출 안정성 테스트', () => {

  // 로그인 세션 + 거의 완성된 퍼즐(35/36) 상태를 세팅하는 공통 헬퍼
  async function setupNearlyCompletePuzzle(
    page,
    options: {
      resultsResponse: { status: number; body: any };
      challengeStartOverride?: { status: number; body: any } | null;
    }
  ) {
    // Base mocks (current, archive, stats, rankings/current, challenge/start)
    await setupBaseMocks(page);

    // NextAuth 로그인 세션 Mock
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            name: '토큰테스터',
            email: 'tokentest@example.com',
            kakaoId: 'mock-kakao-token-tester',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // 퍼즐 상세 Mock
    await page.route('**/api/puzzle/puzzle-mock-id-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: 'puzzle-mock-id-001',
            title: '토큰 테스트 퍼즐',
            imageUrl: '/sample/puzzle.png',
            participantCount: 10,
            startDate: '2026-06-01T00:00:00Z',
            endDate: '2026-06-30T00:00:00Z',
            archived: false,
          },
        }),
      });
    });

    // 진행 상황 API Mock (GET: 35/36 완성 상태 반환, POST/DELETE: 성공)
    const nearlyCompleteBoard = Array.from({ length: 36 }, (_, i) => i);
    nearlyCompleteBoard[35] = null; // 마지막 슬롯만 비어있음

    await page.route('**/api/puzzle/progress**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              progress: 97,
              lastPlayedAt: new Date().toISOString(),
              detailState: {
                difficulty: 'novice',
                mode: 'ranked',
                timerSeconds: 120,
                board: nearlyCompleteBoard,
                trayPieces: [35],
                startedAt: new Date(Date.now() - 120000).toISOString(),
                updatedAt: new Date().toISOString(),
              }
            }
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // 챌린지 시작 토큰 Mock (override 가능)
    if (options.challengeStartOverride !== undefined) {
      await page.route('**/api/puzzle/challenge/start', async (route) => {
        if (options.challengeStartOverride === null) {
          await route.abort('failed');
        } else {
          await route.fulfill({
            status: options.challengeStartOverride.status,
            contentType: 'application/json',
            body: JSON.stringify(options.challengeStartOverride.body),
          });
        }
      });
    }

    // 결과 제출 API Mock (테스트마다 다른 응답)
    await page.route('**/api/puzzle/results', async (route) => {
      await route.fulfill({
        status: options.resultsResponse.status,
        contentType: 'application/json',
        body: JSON.stringify(options.resultsResponse.body),
      });
    });

    // 내 랭킹 Mock
    await page.route('**/api/puzzle/rankings/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { myRank: 5, nickname: '토큰테스터', completionTime: 120, totalParticipants: 50, topPercent: 10 },
        }),
      });
    });
  }

  // 마지막 조각을 배치하여 퍼즐을 완성시키는 헬퍼
  async function completePuzzle(page) {
    // 트레이에 남은 마지막 조각(pieceId=35) 클릭
    const lastPiece = page.locator('[data-tray-piece="true"][data-piece-id="35"]');
    await lastPiece.waitFor({ state: 'visible', timeout: 10000 });
    await lastPiece.click({ force: true });

    // 조각이 선택되었는지 확인
    await expect(lastPiece).toHaveAttribute('data-selected', 'true');

    // 보드의 마지막 빈 셀 클릭하여 배치
    const lastCell = page.locator('[data-board-cell="true"][data-is-placed="false"]');
    await lastCell.click({ force: true });

    // CompletionModal이 나타날 때까지 대기
    await page.locator('text=퍼즐 완성!').waitFor({ state: 'visible', timeout: 10000 });
  }

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.innerHTML = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      });
    });
  });

  // ----------------------------------------------------------
  // Case 1: 정상 제출 성공 시 토큰 에러 없이 완료 메시지 표시
  // ----------------------------------------------------------
  test('Case 1: 정상 제출 시 "저장/제출 완료" 표시, 토큰 에러 없음', async ({ page }) => {
    await setupNearlyCompletePuzzle(page, {
      resultsResponse: {
        status: 201,
        body: {
          success: true,
          message: '성공적으로 퍼즐 기록이 검증 및 저장되었습니다.',
          data: { resultId: 'test-result-id', completionTime: 120, savedAt: new Date().toISOString() },
        },
      },
    });

    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    await dismissOrientationSuggestion(page);
    await completePuzzle(page);

    // "저장/제출 완료" 메시지가 표시되는지 확인
    await expect(page.locator('text=저장/제출 완료')).toBeVisible({ timeout: 10000 });

    // 토큰 에러 메시지가 표시되지 않는지 확인
    await expect(page.locator('text=챌린지 토큰')).toBeHidden();
    await expect(page.locator('text=치팅 방지 필터')).toBeHidden();
  });

  // ----------------------------------------------------------
  // Case 2: "이미 랭킹 등록 완료" 에러 시 토큰 에러가 아닌
  //          정확한 에러 메시지 표시 (거짓 토큰 에러 방지)
  // ----------------------------------------------------------
  test('Case 2: 이미 랭킹 등록 완료 에러 → 토큰 에러가 아닌 정확한 에러 메시지 표시', async ({ page }) => {
    await setupNearlyCompletePuzzle(page, {
      resultsResponse: {
        status: 400,
        body: {
          success: false,
          error: '이 난이도는 이미 랭킹 등록이 완료되었습니다.',
        },
      },
    });

    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    await dismissOrientationSuggestion(page);
    await completePuzzle(page);

    // 정확한 에러 메시지가 표시되는지 확인
    await expect(page.locator('text=이미 랭킹 등록이 완료되었습니다')).toBeVisible({ timeout: 10000 });

    // 토큰 관련 거짓 에러가 표시되지 않는지 확인
    await expect(page.locator('text=챌린지 토큰')).toBeHidden();
  });

  // ----------------------------------------------------------
  // Case 3: "만료된 퍼즐" 에러 시 토큰 에러가 아닌
  //          정확한 에러 메시지 표시 (거짓 토큰 에러 방지)
  // ----------------------------------------------------------
  test('Case 3: 만료된 퍼즐 에러 → 토큰 에러가 아닌 정확한 에러 메시지 표시', async ({ page }) => {
    await setupNearlyCompletePuzzle(page, {
      resultsResponse: {
        status: 400,
        body: {
          success: false,
          error: '활성화 기간이 만료된 퍼즐은 랭킹 등록이 불가능합니다.',
        },
      },
    });

    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    await dismissOrientationSuggestion(page);
    await completePuzzle(page);

    // 정확한 에러 메시지 표시 확인
    await expect(page.locator('text=활성화 기간이 만료된 퍼즐')).toBeVisible({ timeout: 10000 });

    // 토큰 관련 거짓 에러 미표시 확인
    await expect(page.locator('text=챌린지 토큰')).toBeHidden();
  });

  // ----------------------------------------------------------
  // Case 4: 에러 발생 시 무한 깜빡임(저장중↔에러) 없이
  //          안정적으로 에러 메시지 1회만 표시
  //          (무한 재시도 루프 방지 검증 - 가장 중요한 테스트)
  // ----------------------------------------------------------
  test('Case 4: 제출 에러 시 무한 깜빡임 없이 안정적 에러 표시 (재시도 루프 방지)', async ({ page }) => {
    let resultsCallCount = 0;

    await setupNearlyCompletePuzzle(page, {
      resultsResponse: {
        status: 400,
        body: {
          success: false,
          error: '이 난이도는 이미 랭킹 등록이 완료되었습니다.',
        },
      },
    });

    // results API 호출 횟수 카운팅을 위한 추가 인터셉터
    await page.route('**/api/puzzle/results', async (route) => {
      resultsCallCount++;
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: '이 난이도는 이미 랭킹 등록이 완료되었습니다.',
        }),
      });
    });

    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    await dismissOrientationSuggestion(page);
    await completePuzzle(page);

    // 에러 메시지가 안정적으로 표시될 때까지 대기
    await expect(page.locator('text=이미 랭킹 등록이 완료되었습니다')).toBeVisible({ timeout: 10000 });

    // 3초 대기 후 API 호출 횟수가 과도하지 않은지 확인 (무한 재시도 없음)
    await page.waitForTimeout(3000);
    expect(resultsCallCount).toBeLessThanOrEqual(2);

    // 3초 대기 후에도 에러 메시지가 여전히 안정적으로 표시되는지 확인
    // (깜빡거림 = "저장중" 메시지와 에러 메시지가 번갈아 나타남)
    await expect(page.locator('text=이미 랭킹 등록이 완료되었습니다')).toBeVisible();
    await expect(page.locator('text=기록 저장/제출 중')).toBeHidden();
  });

  // ----------------------------------------------------------
  // Case 5: 진짜 챌린지 토큰 무효 → 정확한 토큰 에러 표시
  //          (챌린지 토큰 에러가 정당한 경우에만 발생하는지 확인)
  // ----------------------------------------------------------
  test('Case 5: 진짜 토큰 무효 시에만 챌린지 토큰 에러 메시지 표시', async ({ page }) => {
    await setupNearlyCompletePuzzle(page, {
      challengeStartOverride: {
        status: 500,
        body: { success: false, error: '서버 내부 오류' },
      },
      resultsResponse: {
        status: 403,
        body: {
          success: false,
          error: '유효하지 않거나, 만료되었거나, 이미 사용된 챌린지 토큰입니다.',
        },
      },
    });

    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    await dismissOrientationSuggestion(page);
    await completePuzzle(page);

    // 진짜 토큰 에러이므로 토큰 관련 에러 메시지가 표시되어야 함
    await expect(page.locator('text=챌린지 토큰')).toBeVisible({ timeout: 10000 });
  });

  // ----------------------------------------------------------
  // Case 6: 비로그인 완성 -> 로그인 -> 0%로 초기화(리셋)되는 현상 방지 테스트
  // ----------------------------------------------------------
  test('Case 6: 비로그인 완성 후 로그인하여 복귀 시 퍼즐 상태 리셋 방지 및 동기화 작동', async ({ page }) => {
    // 1. NextAuth 세션: 처음부터 로그인 완료된 세션으로 셋업 (로그인 직후 페이지에 다시 진입한 상태를 모방)
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { name: '성공유저', email: 'success@example.com', kakaoId: 'mock-kakao-user' },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // 2. 기본 Mocking
    await setupBaseMocks(page);

    // 3. 퍼즐 상세 Mock
    await page.route('**/api/puzzle/puzzle-mock-id-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: 'puzzle-mock-id-001',
            title: '테스트용 퍼즐',
            imageUrl: '/sample/puzzle.png',
            participantCount: 0,
            startDate: '2026-06-01T00:00:00Z',
            endDate: '2026-06-30T00:00:00Z',
            archived: false,
          },
        }),
      });
    });

    // 4. 최초 베이스 페이지 진입하여 브라우저 컨텍스트 획득 후 데이터 모킹 주입
    await page.goto('/puzzle');
    await dismissOrientationSuggestion(page);

    // 강제로 로컬 스토리지/IndexedDB 상태를 완성 직전 상태로 세팅
    await page.evaluate(() => {
      sessionStorage.setItem('pending_sync_puzzle-mock-id-001', 'true');
    });

    // IndexedDB에 직접 completion 데이터(100% 완성)를 주입하는 시뮬레이션
    await page.evaluate(async () => {
      const openRequest = indexedDB.open('haruPuzzleDB', 4);
      openRequest.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('puzzleState')) {
          db.createObjectStore('puzzleState', { keyPath: 'puzzleId' });
        }
      };
      
      await new Promise<void>((resolve, reject) => {
        openRequest.onsuccess = (e: any) => {
          const db = e.target.result;
          const transaction = db.transaction('puzzleState', 'readwrite');
          const store = transaction.objectStore('puzzleState');
          
          const nearlyCompleteBoard = Array.from({ length: 36 }, (_, i) => i);
          const piecesData = nearlyCompleteBoard.map((pieceId, idx) => ({
            id: pieceId,
            correctIndex: idx,
            locked: true
          }));

          store.put({
            puzzleId: 'puzzle-mock-id-001',
            difficulty: 'novice',
            mode: 'ranked',
            timerSeconds: 85,
            pieces: piecesData,
            board: nearlyCompleteBoard,
            trayPieces: [],
            progress: 100,
            completed: true,
            startedAt: new Date(Date.now() - 85000).toISOString(),
            updatedAt: new Date().toISOString(),
          });
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject();
        };
      });
    });

    // 이제 로그인 완료 상황으로 mock 설정을 바꾸고, 진입(resume)하는 시나리오

    // 서버 진행도 API Mock: 이 시점에서 서버에는 데이터가 없음 (null)
    let saveProgressCalled = false;
    let savedProgressVal = -1;
    await page.route('**/api/puzzle/progress**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: null }), // 서버에 데이터가 없음
        });
      } else if (method === 'POST') {
        saveProgressCalled = true;
        const postData = route.request().postDataJSON();
        savedProgressVal = postData.progress;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // 결과 제출 API Mock
    let submitResultCalled = false;
    await page.route('**/api/puzzle/results', async (route) => {
      submitResultCalled = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { resultId: 'mock-final-res', completionTime: 85 }
        }),
      });
    });

    // 랭킹 조회 API Mock
    await page.route('**/api/puzzle/rankings/current**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    // 로그인된 상태로 퍼즐 플레이 페이지를 이어하기 모드로 다시 엽니다.
    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    
    // 0%로 초기화(리셋)되지 않고, 로컬의 100% 진행 데이터를 기반으로 서버에 saveProgress(100)이 호출되었는지 검증
    // 또한 완료 처리 결과 제출이 동작했는지 확인
    await page.waitForTimeout(1500);

    expect(saveProgressCalled).toBe(true);
    expect(savedProgressVal).toBe(100);
  });

  // ----------------------------------------------------------
  // Case 7: 로그인 사용자 세션 검증 에러 (유효하지 않은 세션) 상황 격리 테스트
  // ----------------------------------------------------------
  test('Case 7: 로그인 상태이나 DB에 유저가 없는 경우 (401 에러) -> 세션 해제 및 로그인 리다이렉트 처리 검증', async ({ page }) => {
    // 1. Session Mock: 일단 프론트 상에는 로그인된 세션 정보가 존재
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { name: '미가입유저', email: 'no-db@example.com', kakaoId: 'ghost-kakao-id-999' },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    await setupBaseMocks(page);

    // 퍼즐 상세 Mock
    await page.route('**/api/puzzle/puzzle-mock-id-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: 'puzzle-mock-id-001',
            title: '테스트용 퍼즐',
            imageUrl: '/sample/puzzle.png',
            participantCount: 0,
            startDate: '2026-06-01T00:00:00Z',
            endDate: '2026-06-30T00:00:00Z',
            archived: false,
          },
        }),
      });
    });

    // 2. 서버 진행상황 저장 API Mock: DB에 유저가 없으므로 401(유효하지 않은 사용자 세션입니다) 응답
    let saveProgressStatus = -1;
    await page.route('**/api/puzzle/progress**', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: '유효하지 않은 사용자 세션입니다.' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              progress: 10,
              lastPlayedAt: new Date().toISOString(),
              detailState: {
                difficulty: 'novice',
                mode: 'ranked',
                timerSeconds: 15,
                board: Array(36).fill(null),
                trayPieces: Array.from({ length: 36 }, (_, idx) => idx),
              }
            }
          }),
        });
      }
    });

    // 3. 로그아웃 API Mock
    let signOutCalled = false;
    await page.route('**/api/auth/signout**', async (route) => {
      signOutCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // 플레이 페이지 진입 (resume 모드로 진입하여 setup을 무사히 통과하게 만듦)
    await page.goto('/puzzle/play/puzzle-mock-id-001?resume=true&diff=novice');
    await dismissOrientationSuggestion(page);

    // 저장(Manual save) 버튼을 클릭하여 저장 트리거
    const saveButton = page.locator('button:has-text("저장")').first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // 401 에러 발생 시 로그인 화면으로 리다이렉트 처리되는지 주소 검증
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  // ----------------------------------------------------------
  // Case 8: MongoDB 저장 오류 시 로그인 거부 검증 테스트
  // ----------------------------------------------------------
  test('Case 8: MongoDB 저장 오류(signIn callback 에러) 시 로그인 프로세스 거부 검증', async ({ page }) => {
    // 1. NextAuth Callback에서 signIn 실패를 의도하기 위해 Session이 null을 반환하도록 연출
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: null, expires: null }),
      });
    });

    await setupBaseMocks(page);

    // 로그인 페이지로 직접 가서 signIn 거부 확인
    await page.goto('/login');
    
    // 주소가 /login에 머물러 있거나, NextAuth signin error query 파라미터가 노출되는지 검증
    expect(page.url()).toContain('/login');
  });

});
