import { test, expect } from '@playwright/test';

test.describe('External Browser Redirection & Fallback', () => {
    test.describe('SNS In-App Browser (Instagram)', () => {
        // 인스타그램 User-Agent 모킹
        test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 302.0.0.13.111' });

        test('shows fallback UI asking to open in external browser', async ({ page }) => {
            await page.goto('/puzzle');
            
            // Fallback UI 노출 확인
            await expect(page.getByText('기본 브라우저로 이동해주세요!')).toBeVisible();
            await expect(page.getByRole('button', { name: '링크 복사하기' })).toBeVisible();
        });
    });

    test.describe('Normal Browser (Chrome/Safari)', () => {
        // 일반 데스크탑/모바일 브라우저 User-Agent 모킹
        test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1' });

        test('shows normal puzzle layout without fallback UI', async ({ page }) => {
            await page.goto('/puzzle');
            
            // Fallback UI가 없어야 함
            await expect(page.getByText('기본 브라우저로 이동해주세요!')).not.toBeVisible();
        });
    });
});
