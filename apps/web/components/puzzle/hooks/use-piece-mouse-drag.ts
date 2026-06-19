import React from 'react';
import { DragContext } from './use-piece-touch-drag';

export function usePieceMouseDrag(ctx: DragContext) {
  const startDrag = (e: React.PointerEvent, pieceId: number) => {
    if (e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    const pointerId = e.pointerId;
    const currentTarget = e.currentTarget as HTMLElement;

    ctx.startCoords.current = { x: clientX, y: clientY };
    ctx.lastCoords.current = { x: clientX, y: clientY };
    ctx.dragActiveRef.current = false;
    ctx.hasMovedRef.current = false;

    try {
      currentTarget.setPointerCapture(pointerId);
    } catch (err) {}

    const onGlobalMove = (event: PointerEvent) => {
      if (!ctx.startCoords.current) return;
      
      const dx = event.clientX - ctx.startCoords.current.x;
      const dy = event.clientY - ctx.startCoords.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (!ctx.dragActiveRef.current) {
        if (distance > 5) {
          ctx.dragActiveRef.current = true;
          ctx.setDraggedPiece({
            id: pieceId,
            x: event.clientX,
            y: event.clientY,
            startX: clientX,
            startY: clientY,
            pointerId: pointerId,
          });
        }
      } else {
        ctx.setDraggedPiece({
          id: pieceId,
          x: event.clientX,
          y: event.clientY,
          startX: clientX,
          startY: clientY,
          pointerId: pointerId,
        });
        ctx.lastCoords.current = { x: event.clientX, y: event.clientY };
        
        const dropElement = document.elementFromPoint(event.clientX, event.clientY);
        const basketTab = dropElement?.closest('[data-basket-id]');
        const targetBasket = basketTab?.getAttribute('data-basket-id') || null;
        ctx.setHoveredBasket(targetBasket);
      }
    };

    const onGlobalUp = (event: PointerEvent) => {
      cleanupListeners();

      const wasDragging = ctx.dragActiveRef.current;
      ctx.dragActiveRef.current = false;
      ctx.startCoords.current = null;

      if (wasDragging) {
        const endX = event.clientX || ctx.lastCoords.current.x;
        const endY = event.clientY || ctx.lastCoords.current.y;

        const dropElement = document.elementFromPoint(endX, endY);
        const basketTab = dropElement?.closest('[data-basket-id]');
        const targetBasket = basketTab?.getAttribute('data-basket-id');
        
        if (targetBasket) {
          ctx.movePieceToBasket(pieceId, targetBasket);
        }

        ctx.setDraggedPiece(null);
        ctx.setHoveredBasket(null);
        ctx.ignoreNextClickRef.current = true;
      } else {
        ctx.ignoreNextClickRef.current = false;
        if (ctx.isDrawerOpen) {
          setTimeout(() => {
            ctx.setIsDrawerOpen(false);
          }, 60);
        }
      }
    };

    const onGlobalCancel = () => {
      cleanupListeners();
      ctx.dragActiveRef.current = false;
      ctx.startCoords.current = null;
      ctx.setDraggedPiece(null);
      ctx.setHoveredBasket(null);
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointermove', onGlobalMove);
      window.removeEventListener('pointerup', onGlobalUp);
      window.removeEventListener('pointercancel', onGlobalCancel);

      ctx.globalMoveRef.current = null;
      ctx.globalUpRef.current = null;
      ctx.globalCancelRef.current = null;
    };

    window.addEventListener('pointermove', onGlobalMove, { passive: true });
    window.addEventListener('pointerup', onGlobalUp, { passive: true });
    window.addEventListener('pointercancel', onGlobalCancel);

    ctx.globalMoveRef.current = onGlobalMove;
    ctx.globalUpRef.current = onGlobalUp;
    ctx.globalCancelRef.current = onGlobalCancel;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ctx.dragActiveRef.current && ctx.startCoords.current) {
      const dx = e.clientX - ctx.startCoords.current.x;
      const dy = e.clientY - ctx.startCoords.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        ctx.hasMovedRef.current = true;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent, pieceId: number) => {
    if (!ctx.dragActiveRef.current) {
      ctx.ignoreNextClickRef.current = false;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (!ctx.dragActiveRef.current) {
      ctx.startCoords.current = null;
    }
  };

  return { startDrag, handlePointerMove, handlePointerUp, handlePointerCancel };
}
