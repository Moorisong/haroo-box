import { test, expect } from '@playwright/test';

test.describe('다마고치 부화 및 메인 화면 연동 테스트', () => {
  const uniqueName = `감자몬_${Date.now().toString().slice(-6)}`;

  test.beforeEach(async ({ page }) => {
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

    // 1. hatch API Mocking
    await page.route('**/api/tamagotchi/hatch', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              _id: 'mock-tama-id-123',
              userId: 'mock-user-id-456',
              name: uniqueName,
              species: 'cutie',
              colorPalette: 2, // 오렌지색 팔레트
              hat: 'frog',      // 개구리 모자
              generation: 1,
            },
            message: '다마고치가 성공적으로 부화했습니다!',
          }),
        });
      }
    });

    // 2. me API Mocking
    await page.route('**/api/tamagotchi/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            tamagotchi: {
              _id: 'mock-tama-id-123',
              name: uniqueName,
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
  });

  test('부화 과정을 거쳐 다마고치가 성공적으로 생성되고 메인 화면에 반영되어야 한다', async ({ page }) => {
    // 1. 부화 페이지 접속
    await page.goto('/tamagotchi/hatch');
    
    // 시작 버튼이 보이는지 확인하고 클릭
    const startButton = page.locator('button:has-text("새로운 알 부화하기")');
    await expect(startButton).toBeVisible();
    await startButton.click();

    // 2. 종족 선택 단계 (Step 1)
    const speciesButton = page.locator('button:has-text("귀염상")');
    await expect(speciesButton).toBeVisible();
    await speciesButton.click();

    const selectDoneButton = page.locator('button:has-text("선택 완료")');
    await selectDoneButton.click();

    // 3. 이름 입력 단계 (Step 2)
    const nameInput = page.locator('input[placeholder="예: 감자몬, 뚜비"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(uniqueName);

    const nextStepButton = page.locator('button:has-text("다음 단계로")');
    await nextStepButton.click();

    // 4. 알 깨기 단계 (Step 3)
    const eggButton = page.locator('svg >> ellipse >> xpath=..');
    await expect(eggButton).toBeVisible();
    
    for (let i = 0; i < 4; i++) {
      await eggButton.click();
      await page.waitForTimeout(100);
    }

    // 5. 부화 성공 단계 (Step 4)
    await expect(page.locator('h2:has-text("부화에 성공했어요!")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=안녕, 나는 ${uniqueName}야! 반가워!`)).toBeVisible();

    // 부화된 다마고치의 PixelCharacter 렌더링 확인 (SVG 내부에 캐릭터가 렌더링됨)
    const pixelChar = page.locator('svg');
    await expect(pixelChar.first()).toBeVisible();

    // 6. 메인 화면으로 이동
    const startAdventureButton = page.locator('button:has-text("함께 모험 시작하기")');
    await startAdventureButton.click();

    // 메인 홈 화면으로 정상 리다이렉트 확인
    await expect(page).toHaveURL(/\/tamagotchi$/);
    
    // 메인 홈 화면에 부화시킨 다마고치의 이름이 올바르게 나타나는지 검증
    const mainTitle = page.locator(`h1:has-text("${uniqueName}")`);
    await expect(mainTitle).toBeVisible({ timeout: 5000 });
  });
});
