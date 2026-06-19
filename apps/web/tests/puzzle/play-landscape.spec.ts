import { test, expect } from '@playwright/test';
import { setupBaseMocks } from './mocks';

test.describe('하루퍼즐 (Haroo Puzzle) Play Landscape E2E 테스트', () => {
  
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
  // 6. 퍼즐 플레이 페이지 가로 모드(Landscape) 검증
  // ----------------------------------------------------
  test('5-2. 플레이 페이지 가로 모드 전용 레이아웃 및 툴바 검증', async ({ page, isMobile }) => {
    // 가로 모드 뷰포트 설정
    await page.setViewportSize({ width: 812, height: 375 });

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

    // 가로 전용 트레이 패널 노출 검증 (클래스명 및 아이디)
    const trayPanel = page.locator('#landscape-tray-panel');
    await expect(trayPanel).toBeVisible();

    // 툴바 내 모드 선택 버튼 노출 검증
    await expect(page.locator('button:has-text("플레이 모드")')).toBeVisible();
    await expect(page.locator('button:has-text("이동 모드")')).toBeVisible();

    // [요구사항 1] 가로 모드 보관함 하단 조각들이 잘려 보이지 않는지 검증 (뷰포트 내 안착 여부)
    const trayBounding = await trayPanel.boundingBox();
    const viewport = page.viewportSize();
    if (trayBounding && viewport) {
      expect(trayBounding.y + trayBounding.height).toBeLessThanOrEqual(viewport.height);
    }

    // [요구사항 2] 가로 모드 조각 퍼즐판 배치 검증
    // 1. 트레이에서 첫 번째 조각 클릭
    const firstPiece = page.locator('#landscape-tray-panel [data-tray-piece="true"]').first();
    const pieceId = await firstPiece.getAttribute('data-piece-id');
    expect(pieceId).not.toBeNull();

    if (isMobile) {
      await firstPiece.tap({ force: true });
    } else {
      await firstPiece.click({ force: true });
    }

    // [추가 요구사항] 가로 모드에서 조각을 집는 순간 보관함 내에 "집었다" 텍스트가 생기지 않는지 검증
    await expect(trayPanel.locator('text=/집었/')).toBeHidden();

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

    // 퍼즐 조각 배치 및 바구니 상태 업데이트 대기
    await page.waitForTimeout(500);

    // [요구사항 3] 가로 모드 보관함에서 조각을 다른 바구니로 드래그해서 옮기기 검증
    const landscapeTargetBasket = page.locator('#landscape-tray-panel [data-basket-id="basket2"]').first();
    const basket2CountSpan = landscapeTargetBasket.locator('span.font-mono');
    const beforeCountText = await basket2CountSpan.innerText();
    const beforeCount = parseInt(beforeCountText, 10) || 0;

    // 현재 바구니에 남은 조각 중 첫 번째 선택
    const landscapePiece = page.locator('#landscape-tray-panel [data-tray-piece="true"]').first();
    
    // Playwright의 dragTo가 Chromium 환경(가로모드 좁은 뷰포트)에서 바인딩 이슈가 있을 수 있어 직접 dragTo 좌표 계산 이동 수행
    const sourceBounding = await landscapePiece.boundingBox();
    const targetBounding = await landscapeTargetBasket.boundingBox();
    if (sourceBounding && targetBounding) {
      await page.mouse.move(sourceBounding.x + sourceBounding.width / 2, sourceBounding.y + sourceBounding.height / 2);
      await page.mouse.down();
      await page.mouse.move(targetBounding.x + targetBounding.width / 2, targetBounding.y + targetBounding.height / 2, { steps: 10 });
      await page.mouse.up();
    } else {
      await landscapePiece.dragTo(landscapeTargetBasket, { force: true });
    }

    // 바구니 숫자가 1 증가했는지 검증
    await expect(basket2CountSpan).toHaveText((beforeCount + 1).toString());

    // [추가 테스트] 가로 모드 터치 드래그 앤 드롭 검증 (180ms 롱프레스 터치 드래그)
    const landscapeTouchBeforeCount = parseInt(await basket2CountSpan.innerText(), 10) || 0;
    
    await page.evaluate(async () => {
      const source = document.querySelector('#landscape-tray-panel [data-tray-piece="true"]');
      const target = document.querySelector('#landscape-tray-panel [data-basket-id="basket2"]');
      if (!source || !target) return;

      const rectSource = source.getBoundingClientRect();
      const rectTarget = target.getBoundingClientRect();

      const startX = rectSource.left + rectSource.width / 2;
      const startY = rectSource.top + rectSource.height / 2;
      const endX = rectTarget.left + rectTarget.width / 2;
      const endY = rectTarget.top + rectTarget.height / 2;

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

      await new Promise(resolve => setTimeout(resolve, 200));

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

      window.dispatchEvent(new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        touches: [],
        targetTouches: [],
        changedTouches: [touch2],
      }));
    });

    await expect(basket2CountSpan).toHaveText((landscapeTouchBeforeCount + 1).toString());
  });
});
