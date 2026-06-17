import { test, expect } from '@playwright/test';

test.describe('다마고치 반응형/적응형 레이아웃 정합성 테스트', () => {
  test('모바일 뷰포트(375x667)에서 모바일 최적화 레이아웃이 노출되어야 한다', async ({ page }) => {
    // 뷰포트 변경
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 페이지 이동
    await page.goto('/tamagotchi');

    // 모바일 전용 컨테이너 데이터셋 테스트아이디 체크
    const mobileIndicator = page.locator('[data-testid="device-mobile-view"]');
    await expect(mobileIndicator).toBeVisible();

    // 태블릿/데스크톱 뷰는 보이지 않아야 함
    const tabletIndicator = page.locator('[data-testid="device-tablet-view"]');
    const desktopIndicator = page.locator('[data-testid="device-desktop-view"]');
    await expect(tabletIndicator).not.toBeVisible();
    await expect(desktopIndicator).not.toBeVisible();
  });

  test('태블릿 뷰포트(768x1024)에서 태블릿용 2단 분할 레이아웃이 노출되어야 한다', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/tamagotchi');

    const tabletIndicator = page.locator('[data-testid="device-tablet-view"]');
    await expect(tabletIndicator).toBeVisible();

    const mobileIndicator = page.locator('[data-testid="device-mobile-view"]');
    const desktopIndicator = page.locator('[data-testid="device-desktop-view"]');
    await expect(mobileIndicator).not.toBeVisible();
    await expect(desktopIndicator).not.toBeVisible();
  });

  test('데스크톱 뷰포트(1280x800)에서 와이드 데스크톱 대시보드가 노출되어야 한다', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tamagotchi');

    const desktopIndicator = page.locator('[data-testid="device-desktop-view"]');
    await expect(desktopIndicator).toBeVisible();

    const mobileIndicator = page.locator('[data-testid="device-mobile-view"]');
    const tabletIndicator = page.locator('[data-testid="device-tablet-view"]');
    await expect(mobileIndicator).not.toBeVisible();
    await expect(tabletIndicator).not.toBeVisible();
  });

  test('가로모드 뷰포트(667x375)에서 가로모드 전용 2단 분할 레이아웃이 노출되어야 한다', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/tamagotchi');

    const landscapeIndicator = page.locator('[data-testid="device-landscape-view"]');
    await expect(landscapeIndicator).toBeVisible();

    const mobileIndicator = page.locator('[data-testid="device-mobile-view"]');
    const tabletIndicator = page.locator('[data-testid="device-tablet-view"]');
    await expect(mobileIndicator).not.toBeVisible();
    await expect(tabletIndicator).not.toBeVisible();
  });
});
