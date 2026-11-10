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
