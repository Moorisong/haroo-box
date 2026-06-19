import React from 'react';

export interface DragContext {
  dragActiveRef: React.MutableRefObject<boolean>;
  startCoords: React.MutableRefObject<{ x: number; y: number } | null>;
  lastCoords: React.MutableRefObject<{ x: number; y: number }>;
  hasMovedRef: React.MutableRefObject<boolean>;
  ignoreNextClickRef: React.MutableRefObject<boolean>;
  longPressTimeout: React.MutableRefObject<any>;
  globalMoveRef: React.MutableRefObject<any>;
  globalUpRef: React.MutableRefObject<any>;
  globalCancelRef: React.MutableRefObject<any>;
  setDraggedPiece: (piece: any) => void;
  setHoveredBasket: (basket: string | null) => void;
  movePieceToBasket: (pieceId: number, targetBasket: string) => void;
  setIsDrawerOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
}

export function usePieceTouchDrag(ctx: DragContext) {
  const handleTouchStart = (e: React.TouchEvent, pieceId: number) => {
    const touch = e.touches[0];
    if (!touch) return;

    const clientX = touch.clientX;
    const clientY = touch.clientY;

    ctx.startCoords.current = { x: clientX, y: clientY };
    ctx.lastCoords.current = { x: clientX, y: clientY };
    ctx.dragActiveRef.current = false;
    ctx.hasMovedRef.current = false;

    ctx.longPressTimeout.current = setTimeout(() => {
      ctx.dragActiveRef.current = true;
      ctx.setDraggedPiece({
        id: pieceId,
        x: clientX,
        y: clientY,
        startX: clientX,
        startY: clientY,
        pointerId: 0,
      });

      const onGlobalTouchMove = (event: TouchEvent) => {
        if (event.cancelable) {
          event.preventDefault();
        }
        const t = event.touches[0];
        if (t) {
          ctx.setDraggedPiece({
            id: pieceId,
            x: t.clientX,
            y: t.clientY,
            startX: clientX,
            startY: clientY,
            pointerId: 0,
          });
          ctx.lastCoords.current = { x: t.clientX, y: t.clientY };

          const dropElement = document.elementFromPoint(t.clientX, t.clientY);
          const basketTab = dropElement?.closest('[data-basket-id]');
          const targetBasket = basketTab?.getAttribute('data-basket-id') || null;
          ctx.setHoveredBasket(targetBasket);
        }
      };

      const onGlobalTouchEnd = (event: TouchEvent) => {
        cleanupTouchListeners();
        ctx.dragActiveRef.current = false;
        ctx.startCoords.current = null;

        const t = event.changedTouches[0];
        const endX = t ? t.clientX : ctx.lastCoords.current.x;
        const endY = t ? t.clientY : ctx.lastCoords.current.y;

        const dropElement = document.elementFromPoint(endX, endY);
        const basketTab = dropElement?.closest('[data-basket-id]');
        const targetBasket = basketTab?.getAttribute('data-basket-id');
        
        if (targetBasket) {
          ctx.movePieceToBasket(pieceId, targetBasket);
        }

        ctx.setDraggedPiece(null);
        ctx.setHoveredBasket(null);
        ctx.ignoreNextClickRef.current = true;
      };

      const onGlobalTouchCancel = () => {
        cleanupTouchListeners();
        ctx.dragActiveRef.current = false;
        ctx.startCoords.current = null;
        ctx.setDraggedPiece(null);
        ctx.setHoveredBasket(null);
      };

      const cleanupTouchListeners = () => {
        window.removeEventListener('touchmove', onGlobalTouchMove);
        window.removeEventListener('touchend', onGlobalTouchEnd);
        window.removeEventListener('touchcancel', onGlobalTouchCancel);
        ctx.globalMoveRef.current = null;
        ctx.globalUpRef.current = null;
        ctx.globalCancelRef.current = null;
      };

      window.addEventListener('touchmove', onGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', onGlobalTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onGlobalTouchCancel);

      ctx.globalMoveRef.current = onGlobalTouchMove;
      ctx.globalUpRef.current = onGlobalTouchEnd;
      ctx.globalCancelRef.current = onGlobalTouchCancel;

    }, 200);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!ctx.dragActiveRef.current && ctx.startCoords.current) {
      const touch = e.touches[0];
      if (touch) {
        const dx = touch.clientX - ctx.startCoords.current.x;
        const dy = touch.clientY - ctx.startCoords.current.y;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          ctx.hasMovedRef.current = true;
          if (ctx.longPressTimeout.current) {
            clearTimeout(ctx.longPressTimeout.current);
            ctx.longPressTimeout.current = null;
          }
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, pieceId: number) => {
    if (ctx.longPressTimeout.current) {
      clearTimeout(ctx.longPressTimeout.current);
      ctx.longPressTimeout.current = null;
    }
    if (!ctx.dragActiveRef.current) {
      ctx.ignoreNextClickRef.current = false;
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
