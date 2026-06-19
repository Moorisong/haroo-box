import { Page } from '@playwright/test';

// 1. 공통 Mock API 정의 함수
export async function setupBaseMocks(page: Page) {
  // 현재 활성 퍼즐 Mock
  await page.route('**/api/puzzle/current', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          _id: 'puzzle-mock-id-001',
          title: '아름다운 우주 성운',
          imageUrl: '/sample/puzzle.png',
          participantCount: 125,
          startDate: '2026-06-01T00:00:00Z',
          endDate: '2026-06-30T00:00:00Z',
          archived: false,
        },
      }),
    });
  });

  // 아카이브 퍼즐 목록 Mock
  await page.route('**/api/puzzle/archive', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            _id: 'puzzle-mock-id-001',
            title: '아름다운 우주 성운',
            imageUrl: '/sample/puzzle.png',
            participantCount: 125,
            startDate: '2026-06-01T00:00:00Z',
            endDate: '2026-06-30T00:00:00Z',
            archived: false,
          },
          {
            _id: 'puzzle-archive-002',
            title: '고요한 가을 숲',
            imageUrl: '/sample/forest.png',
            participantCount: 89,
            startDate: '2026-05-15T00:00:00Z',
            endDate: '2026-05-22T00:00:00Z',
            archived: true,
          },
        ],
      }),
    });
  });

  // 서비스 전체 통계 Mock
  await page.route('**/api/puzzle/stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          totalPlayCount: 1250,
          completionRate: '78.5%',
        },
      }),
    });
  });

  // 랭킹 목록 Mock
  await page.route('**/api/puzzle/rankings/current*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          { nickname: '스피드킹', completionTime: 125, savedAt: '2026-06-05T00:00:00Z' },
          { nickname: '퍼즐마스터', completionTime: 180, savedAt: '2026-06-06T00:00:00Z' },
          { nickname: '느긋한거북이', completionTime: 320, savedAt: '2026-06-07T00:00:00Z' },
        ],
      }),
    });
  });

  // 챌린지 시작 토큰 Mock
  await page.route('**/api/puzzle/challenge/start', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          challengeToken: 'mock-challenge-token-xyz123',
        },
      }),
    });
  });
}

// 모바일 세로 모드 진입 시 가로 권장 팝업을 닫아주기 위한 헬퍼
export async function dismissOrientationSuggestion(page: Page) {
  const dismissBtn = page.locator('text=세로 모드로 계속 진행하기');
  try {
    await dismissBtn.waitFor({ state: 'visible', timeout: 2000 });
    await dismissBtn.click({ force: true });
  } catch (e) {
    // 팝업이 노출되지 않는 환경(PC 크롬 등)이면 예외 무시하고 넘어감
  }
}
