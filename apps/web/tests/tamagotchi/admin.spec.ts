import { test, expect } from '@playwright/test';

test.describe('다마고치 운영자(어드민) 권한 및 로그인 가드 테스트', () => {
  const adminId = '4708331286';
  const normalUserId = 'mock-user-12345';

  // 다마고치 정보 API 모킹 헬퍼
  const mockTamaMeApi = async (page) => {
    await page.route('**/api/tamagotchi/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            tamagotchi: {
              _id: 'mock-tama-id-123',
              name: '몽이',
              species: 'cutie',
              colorPalette: 2,
              hat: 'frog',
              generation: 1,
              representativeTitle: '초보 여행자',
              stats: {
                happiness: 50,
                hunger: 50,
                cleanliness: 100,
                courage: 10,
              },
            },
            family: null,
          },
        }),
      });
    });
  };

  test('비로그인 사용자가 메인 홈에 접속하면 로그인 가드에 의해 루트(/)로 리다이렉트되어야 한다', async ({ page }) => {
    // 세션 없음 모킹
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await mockTamaMeApi(page);

    await page.goto('/tamagotchi');

    // 비로그인이므로 루트 / 로 리다이렉트 되는지 확인
    await expect(page).toHaveURL(/\/$/);
  });

  test('비로그인 사용자가 하루상자 메인 홈에서 전투 다마고치 카드를 누르면 로그인 페이지(/login)로 이동해야 한다', async ({ page }) => {
    // 세션 없음 모킹
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const tamagotchiCard = page.locator('a[class*="card"]:has-text("전투 다마고치")');
    await expect(tamagotchiCard).toBeVisible();
    
    // 카드 클릭
    await tamagotchiCard.click();

    // 로그인 페이지로 이동하는지 확인
    await expect(page).toHaveURL(/\/login\?callbackUrl=\/tamagotchi$/);
  });

  test('일반 유저 로그인 시 외형 테스트 버튼이 보이지 않아야 하고 직접 접근 시 튕겨야 한다', async ({ page }) => {
    // 일반 유저 세션 모킹
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            name: '일반유저',
            email: 'user@example.com',
            kakaoId: normalUserId,
          },
        }),
      });
    });

    await mockTamaMeApi(page);

    // 1. 메인 홈 진입 시 버튼 미노출 확인
    await page.goto('/tamagotchi');
    const testButton = page.locator('a:has-text("외형 테스트")');
    await expect(testButton).not.toBeVisible();

    // 2. 쇼케이스 페이지 직접 접근 시 리다이렉트 검증
    await page.goto('/tamagotchi/test-showcase');
    await expect(page).toHaveURL(/\/tamagotchi$/);
  });

  test('운영자 유저 로그인 시 외형 테스트 버튼이 노출되어야 하고 쇼케이스 페이지가 열려야 한다', async ({ page }) => {
    // 운영자 세션 모킹
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            name: '운영자',
            email: 'admin@example.com',
            kakaoId: adminId,
          },
        }),
      });
    });

    await mockTamaMeApi(page);

    // 1. 메인 홈 진입 시 버튼 노출 확인
    await page.goto('/tamagotchi');
    const testButton = page.locator('a:has-text("외형 테스트")');
    await expect(testButton).toBeVisible();

    // 2. 버튼 클릭을 통한 페이지 이동 검증
    await testButton.click();
    await expect(page).toHaveURL(/\/tamagotchi\/test-showcase$/);

    // 3. 쇼케이스 페이지 콘텐츠 정상 노출 확인
    const headerTitle = page.locator('h1:has-text("종족별 외형 조합 쇼케이스")');
    await expect(headerTitle).toBeVisible();
  });
});
