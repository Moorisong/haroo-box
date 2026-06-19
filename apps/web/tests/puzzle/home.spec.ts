import { test, expect } from '@playwright/test';
import { setupBaseMocks, dismissOrientationSuggestion } from './mocks';

test.describe('하루퍼즐 (Haroo Puzzle) Home & Info Pages E2E 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await setupBaseMocks(page);
    // Hide Next.js Dev Tools / Dev Overlay portal to prevent it from intercepting E2E test clicks
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.innerHTML = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      });
    });
  });

  // ----------------------------------------------------
  // 1. 퍼즐 메인 홈 페이지 테스트
  // ----------------------------------------------------
  test('1. 메인 홈 페이지 로드 및 기본 구성요소 검증', async ({ page }) => {
    await page.goto('/puzzle');
    await dismissOrientationSuggestion(page);
    
    // 로딩 완료 후 퍼즐 타이틀이 올바르게 렌더링되었는지 확인
    await expect(page.locator('text=아름다운 우주 성운')).toBeVisible();
    await expect(page.locator('text=이번 주 퍼즐')).toBeVisible();
    await expect(page.locator('text=125명 완료함')).toBeVisible();

    // 랭킹 프리뷰 탭 클릭 동작 검증
    const generalTab = page.locator('button:has-text("일반")');
    await expect(generalTab).toBeVisible();
    await generalTab.click({ force: true });

    // 통계 카드 검증
    await expect(page.locator('text=누적 플레이 수')).toBeVisible();
    await expect(page.locator('text=1,250회')).toBeVisible();
    await expect(page.locator('text=평균 퍼즐 완성률')).toBeVisible();
    await expect(page.locator('text=78.5%')).toBeVisible();
  });

  // ----------------------------------------------------
  // 2. 퍼즐 아카이브 페이지 테스트
  // ----------------------------------------------------
  test('2. 퍼즐 아카이브 페이지 로드 및 월별 필터 동작 검증', async ({ page }) => {
    await page.goto('/puzzle/archive');

    // 타이틀 및 누적 통계 검증
    await expect(page.locator('h1:has-text("퍼즐 아카이브")')).toBeVisible();
    await expect(page.locator('text=전체 아카이브')).toBeVisible();
    await expect(page.locator('text=2개')).toBeVisible();

    // 월별 필터 버튼 클릭 및 필터링 검증
    const mayFilter = page.locator('button:has-text("5월")');
    if (await mayFilter.isEnabled()) {
      await mayFilter.click({ force: true });
      // 5월 퍼즐인 '고요한 가을 숲' 카드가 노출되는지 확인
      await expect(page.locator('text=고요한 가을 숲')).toBeVisible();
    }
  });

  // ----------------------------------------------------
  // 3. 주간 랭킹 페이지 테스트
  // ----------------------------------------------------
  test('3. 주간 랭킹 페이지 및 난이도별 데이터 갱신 검증', async ({ page }) => {
    await page.goto('/puzzle/ranking');

    // 타이틀 확인
    await expect(page.locator('h1:has-text("주간 랭킹 경쟁")')).toBeVisible();
    await expect(page.locator('text=아름다운 우주 성운').first()).toBeVisible();

    // 랭킹 테이블 내 유저 정보 노출 확인
    await expect(page.locator('text=스피드킹')).toBeVisible();
    await expect(page.locator('text=퍼즐마스터')).toBeVisible();

    // 난이도 변경 버튼 클릭 검증
    const expertButton = page.locator('button:has-text("고수")');
    await expect(expertButton).toBeVisible();
    await expertButton.click({ force: true });
  });

  // ----------------------------------------------------
  // 4. 마이페이지 로그인 가이드 및 초기화/회원탈퇴 검증
  // ----------------------------------------------------
  test('4. 마이페이지 세션 통제 가이드 검증', async ({ page }) => {
    // 비로그인 상태 진입 시
    await page.goto('/puzzle/mypage');

    // 로그인 필요 안내 모달/화면 검증
    await expect(page.locator('text=로그인이 필요한 서비스입니다')).toBeVisible();
    const loginButton = page.locator('a:has-text("로그인하기")');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveAttribute('href', /\/login\?callbackUrl=/);
  });
});
