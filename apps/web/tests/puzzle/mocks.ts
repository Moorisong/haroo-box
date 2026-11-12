import { Page } from '@playwright/test';
import locale01 from '../../../server/src/data/puzzle-ui-translations-01.json';
import locale02 from '../../../server/src/data/puzzle-ui-translations-02.json';
import locale03 from '../../../server/src/data/puzzle-ui-translations-03.json';
import locale04 from '../../../server/src/data/puzzle-ui-translations-04.json';
import locale05 from '../../../server/src/data/puzzle-ui-translations-05.json';
import locale06 from '../../../server/src/data/puzzle-ui-translations-06.json';

const puzzleUiTranslations = [...locale01, ...locale02, ...locale03, ...locale04, ...locale05, ...locale06];

// 1. 공통 Mock API 정의 함수
export async function setupBaseMocks(page: Page) {
  await page.addInitScript(() => window.localStorage.setItem('haroo-language', 'ko'));
  await page.route('**/api/puzzle/translations?lang=*', async (route) => {
    const lang = new URL(route.request().url()).searchParams.get('lang') === 'en' ? 'en' : 'ko';
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, locale: lang, data: Object.fromEntries(puzzleUiTranslations.map(row => [row.key, row[lang]])) }) });
  });
  await page.route('**/api/puzzle/puzzle-mock-id-001', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          _id: 'puzzle-mock-id-001',
          title: '아름다운 우주 성운',
          title_en: 'Beautiful Cosmic Nebula',
          week: 24,
          imageUrl: '/sample/puzzle.png',
          participantCount: 125,
          startDate: '2026-06-01T00:00:00Z',
          endDate: '2026-06-30T00:00:00Z',
          archived: false,
        },
      }),
    });
  });
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
          title_en: 'Beautiful Cosmic Nebula',
          week: 24,
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
            title_en: 'Beautiful Cosmic Nebula',
            week: 24,
            imageUrl: '/sample/puzzle.png',
            participantCount: 125,
            startDate: '2026-06-01T00:00:00Z',
            endDate: '2026-06-30T00:00:00Z',
            archived: false,
          },
          {
            _id: 'puzzle-archive-002',
            title: '고요한 가을 숲',
            title_en: 'Quiet Autumn Forest',
            week: 23,
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
