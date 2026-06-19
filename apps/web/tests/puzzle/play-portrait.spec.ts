import { test, expect } from '@playwright/test';
import { setupBaseMocks, dismissOrientationSuggestion } from './mocks';

test.describe('하루퍼즐 (Haroo Puzzle) Play Portrait E2E 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await setupBaseMocks(page);
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.innerHTML = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      });
    });
  });

  // ----------------------------------------------------
  // 5. 퍼즐 플레이 페이지 세로 모드(Portrait) 검증
  // ----------------------------------------------------
  test('5-1. 플레이 페이지 세로 모드 UI 및 상호작용 검증', async ({ page, isMobile }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    // 세로 모드 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 812 });

    // 특정 퍼즐 상세 API Mocking (id가 details이 아니라 constants 기준으로 직접 세팅된 것 복원)
    await page.route('**/api/puzzle/puzzle-mock-id-001', async (route) => {
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
            archived: false,
          },
        }),
      });
    });

    await page.goto('/puzzle/play/puzzle-mock-id-001?diff=novice&mode=ranked');
    await dismissOrientationSuggestion(page);

    // 헤더 타이틀 및 난이도 배지 확인 (엄격한 Strict 모드 에러 우회를 위해 first() 사용)
    await expect(page.locator('text=초보 (36조각)').first()).toBeVisible();
    
    // 타이머 및 진행률(%) 컴포넌트 렌더링 확인 (타이머 작동 시간이 경과되므로 정규식 포맷 검증)
    await expect(page.locator('.tabular-nums').first()).toHaveText(/\d{2}:\d{2}/);
    await expect(page.locator('text=0%')).toBeVisible();

    // [요구사항 1] 세로 모드 보관함 하단 조각들이 잘려 보이지 않는지 검증 (뷰포트 범위 내 안착 여부)
    const tray = page.locator('.overflow-x-auto').first();
    const trayBounding = await tray.boundingBox();
    const viewport = page.viewportSize();
    if (trayBounding && viewport) {
      expect(trayBounding.y + trayBounding.height).toBeLessThanOrEqual(viewport.height);
    }

    // [요구사항 2] 세로 모드 조각 퍼즐판 배치 검증
    // 1. 트레이에서 첫 번째 조각 클릭
    const firstPiece = page.locator('[data-tray-piece="true"]').first();
    const pieceId = await firstPiece.getAttribute('data-piece-id');
    expect(pieceId).not.toBeNull();

    if (isMobile) {
      await firstPiece.tap();
    } else {
      await firstPiece.click();
    }

    // [추가 요구사항] 세로 모드에서 조각을 집는 순간 보관함 내에 "집었다" 텍스트가 생기지 않는지 검증
    await expect(tray.locator('text=/집었/')).toBeHidden();

    // 조각이 선택되었는지 검증
    await expect(firstPiece).toHaveAttribute('data-selected', 'true');

    // 2. 보드판의 첫 번째 빈 셀 클릭
    const firstCell = page.locator('[data-board-cell="true"]').first();
    await expect(firstCell).toHaveAttribute('data-is-placed', 'false');

    if (isMobile) {
      await firstCell.tap({ force: true });
    } else {
      await firstCell.click({ force: true });
    }

    // 조각 배치 완료 검증
    await expect(firstCell).toHaveAttribute('data-is-placed', 'true');
    await expect(firstCell).toHaveAttribute('data-placed-piece-id', pieceId!);

    // [요구사항 3] 세로 모드 보관함에서 조각을 다른 바구니로 드래그하여 옮겨지는지 확인 (모아보기 서랍 내)
    const openDrawerBtn = page.locator('button:has-text("모아보기")');
    await openDrawerBtn.click({ force: true });
    
    // 모달 슬라이드 업 애니메이션(300ms)이 완료될 때까지 대기하여 드래그 대상의 뷰포트 아웃 에러 방지
    await page.waitForTimeout(500);
    
    // 어두운 배경(backdrop) 우회를 위해 .overflow-y-auto 하위의 조각 셀 선택
    const drawerPiece = page.locator('.z-\\[9990\\] .overflow-y-auto .cursor-pointer').first();
    const targetBasket = page.locator('.z-\\[9990\\] [data-basket-id="basket2"]').first();
    const portraitBasket2Count = targetBasket.locator('span:has-text("개")');
    const beforeCountTextPortrait = await portraitBasket2Count.innerText(); // 예: "(0개)"
    const beforeCountPortrait = parseInt(beforeCountTextPortrait.replace(/[^0-9]/g, ''), 10) || 0;

    await drawerPiece.dragTo(targetBasket, { force: true });

    // 바구니 숫자가 1 증가했는지 검증
    await expect(portraitBasket2Count).toHaveText(`(${beforeCountPortrait + 1}개)`);

    // [추가 테스트] 세로 모드 터치 드래그 앤 드롭 검증 (180ms 롱프레스 터치 드래그)
    const touchBeforeCountText = await portraitBasket2Count.innerText();
    const touchBeforeCount = parseInt(touchBeforeCountText.replace(/[^0-9]/g, ''), 10) || 0;
    
    await page.evaluate(async () => {
      const source = document.querySelector('.z-\\[9990\\] .overflow-y-auto .cursor-pointer');
      const target = document.querySelector('.z-\\[9990\\] [data-basket-id="basket2"]');
      if (!source || !target) return;

      const rectSource = source.getBoundingClientRect();
      const rectTarget = target.getBoundingClientRect();

      const startX = rectSource.left + rectSource.width / 2;
      const startY = rectSource.top + rectSource.height / 2;
      const endX = rectTarget.left + rectTarget.width / 2;
      const endY = rectTarget.top + rectTarget.height / 2;

      // touchstart
      const touch1 = new Touch({
        identifier: Date.now(),
        target: source,
        clientX: startX,
        clientY: startY,
        screenX: startX,
        screenY: startY,
        pageX: startX,
        pageY: startY,
      });

      source.dispatchEvent(new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        touches: [touch1],
        targetTouches: [touch1],
        changedTouches: [touch1],
      }));

      // 180ms 롱프레스 대기
      await new Promise(resolve => setTimeout(resolve, 200));

      // touchmove
      const touch2 = new Touch({
        identifier: touch1.identifier,
        target: source,
        clientX: endX,
        clientY: endY,
        screenX: endX,
        screenY: endY,
        pageX: endX,
        pageY: endY,
      });

      window.dispatchEvent(new TouchEvent('touchmove', {
        cancelable: true,
        bubbles: true,
        touches: [touch2],
        targetTouches: [touch2],
        changedTouches: [touch2],
      }));

      // touchend
      window.dispatchEvent(new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        touches: [],
        targetTouches: [],
        changedTouches: [touch2],
      }));
    });

    await expect(portraitBasket2Count).toHaveText(`(${touchBeforeCount + 1}개)`);

    // 셔플(다시 섞기) 컨펌 다이얼로그 모킹
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('정말로 판을 엎고 처음부터 다시 시작하시겠습니까?');
      await dialog.dismiss(); // 취소 선택
    });

    // 세로 툴바 영역 버튼 클릭 검증 (뒤로 가기 버튼)
    const backButton = page.locator('text=뒤로');
    await expect(backButton).toBeVisible();
  });
});
