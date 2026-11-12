import { test, expect } from '@playwright/test';
import { setupBaseMocks } from './mocks';

test.beforeEach(async ({ page }) => {
  await setupBaseMocks(page);
  // Override the shared KO default used by existing Korean tests.
  await page.addInitScript(() => window.localStorage.setItem('haroo-language', 'en'));
});

test('leaderboard reads English puzzle title and localizes all prominent labels', async ({ page }) => {
  await page.goto('/puzzle/ranking');
  await expect(page.getByRole('heading', { name: 'Weekly leaderboard' })).toBeVisible();
  await expect(page.getByText('Beautiful Cosmic Nebula').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Easy/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Normal/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Expert/ }).first()).toBeVisible();
  await expect(page.getByText('My best time').first()).toBeVisible();
  await expect(page.getByText('주간 랭킹 경쟁')).toHaveCount(0);
  await expect(page.getByText('초보', { exact: true })).toHaveCount(0);
  await expect(page.getByText('일반', { exact: true })).toHaveCount(0);
});

test('archive displays DB English title and localized navigation', async ({ page }) => {
  await page.goto('/puzzle/archive');
  await expect(page.getByRole('heading', { name: 'Puzzle Archive' })).toBeVisible();
  await expect(page.getByText('Beautiful Cosmic Nebula').first()).toBeVisible();
  await expect(page.getByText('Quiet Autumn Forest').first()).toBeVisible();
  await expect(page.getByText('퍼즐 아카이브', { exact: true })).toHaveCount(0);
  await expect(page.getByText('전체', { exact: true })).toHaveCount(0);
});

test('home page uses English branding and DB puzzle metadata', async ({ page }) => {
  await page.goto('/puzzle');
  await expect(page.getByText('Haroo Puzzle').first()).toBeVisible();
  await expect(page.getByText('Beautiful Cosmic Nebula').first()).toBeVisible();
  await expect(page.getByText('Puzzle of the week').first()).toBeVisible();
  await expect(page.getByText('하루퍼즐', { exact: true })).toHaveCount(0);
});

test('signed-out profile and gameplay keep English locale', async ({ page }) => {
  await page.goto('/puzzle/mypage');
  await expect(page.getByText('Sign in required')).toBeVisible();
  await page.goto('/puzzle/play/puzzle-mock-id-001?diff=novice');
  await expect(page.getByRole('button', { name: /Switch to Korean/ })).toBeVisible();
  await expect(page.getByText('Beautiful Cosmic Nebula').first()).toBeVisible({ timeout: 15000 });
});

test('mobile English difficulty modal keeps labels and piece counts inside cards', async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 667 });
    await page.goto('/puzzle');
    await page.getByRole('button', { name: 'Start puzzle' }).click();
    const modal = page.locator('.max-w-lg').filter({ has: page.getByRole('heading', { name: 'Play options' }) });
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('button', { name: /Start challenge/ })).toBeVisible();
    const result = await modal.evaluate(el => {
      const cards = [...el.querySelectorAll('button')].filter(b => /(?:36|100|256) pieces/.test(b.textContent ?? ''));
      const badgesFit = cards.every(b => {
        const badge = [...b.querySelectorAll('span')].find(s => /(?:36|100|256) pieces/.test(s.textContent ?? ''));
        return badge && getComputedStyle(badge).whiteSpace === 'nowrap' && badge.scrollWidth <= badge.clientWidth + 2;
      });
      const rect = el.getBoundingClientRect();
      return { count: cards.length, badgesFit, fitsViewport: rect.left >= -1 && rect.right <= window.innerWidth + 1 };
    });
    expect(result, `modal at ${width}px`).toEqual({ count: 3, badgesFit: true, fitsViewport: true });
  }
});

test('actual mobile touch swipe scrolls the piece tray without activating drag', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mobile = await context.newPage();
  try {
    await setupBaseMocks(mobile);
    await mobile.addInitScript(() => {
      window.localStorage.setItem('haroo-language', 'en');
      window.sessionStorage.setItem('orientation-suggestion-dismissed', 'true');
    });
    await mobile.goto('/puzzle/play/puzzle-mock-id-001?diff=novice');
    const tray = mobile.getByTestId('puzzle-piece-tray-scroll');
    await expect(tray.locator('[data-tray-piece]')).toHaveCount(36, { timeout: 15000 });
    await tray.scrollIntoViewIfNeeded();
    const initial = await tray.evaluate(el => ({
      maxScroll: el.scrollHeight - el.clientHeight,
      touchAction: getComputedStyle(el.firstElementChild as Element).touchAction,
    }));
    expect(initial.maxScroll).toBeGreaterThan(30);
    expect(initial.touchAction).toContain('pan-y');

    const rect = await tray.boundingBox();
    expect(rect).not.toBeNull();
    const x = rect!.x + Math.min(rect!.width / 2, 80);
    const startY = rect!.y + rect!.height - 24;
    const client = await context.newCDPSession(mobile);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: startY }] });
    for (const offset of [12, 32, 60, 96, 130, 155]) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: startY - offset }] });
      await mobile.waitForTimeout(25);
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => tray.evaluate(el => el.scrollTop)).toBeGreaterThan(5);
    await expect(mobile.locator('.pointer-events-none.fixed.z-\\[9999\\]')).toHaveCount(0);
  } finally {
    await context.close();
  }
});
