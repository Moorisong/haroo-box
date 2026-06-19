import { useState, useRef, useEffect } from 'react';
import { usePieceTouchDrag } from './use-piece-touch-drag';
import { usePieceMouseDrag } from './use-piece-mouse-drag';
import { DragContext } from './use-piece-touch-drag';

interface UsePieceDragProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  movePieceToBasket: (pieceId: number, targetBasket: string) => void;
  setHoveredBasket: (basket: string | null) => void;
}

export function usePieceDrag({
  isDrawerOpen,
  setIsDrawerOpen,
  movePieceToBasket,
  setHoveredBasket,
}: UsePieceDragProps) {
  const [draggedPiece, setDraggedPiece] = useState<{
    id: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
    pointerId: number;
  } | null>(null);

  const dragActiveRef = useRef<boolean>(false);
  const startCoords = useRef<{ x: number; y: number } | null>(null);
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const ignoreNextClickRef = useRef<boolean>(false);
  const longPressTimeout = useRef<any>(null);
  
  const globalMoveRef = useRef<any>(null);
  const globalUpRef = useRef<any>(null);
  const globalCancelRef = useRef<any>(null);

  const ctx: DragContext = {
    dragActiveRef,
    startCoords,
    lastCoords,
    hasMovedRef,
    ignoreNextClickRef,
    longPressTimeout,
    globalMoveRef,
    globalUpRef,
    globalCancelRef,
    setDraggedPiece,
    setHoveredBasket,
    movePieceToBasket,
    setIsDrawerOpen,
    isDrawerOpen,
  };

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = usePieceTouchDrag(ctx);
  const { startDrag, handlePointerMove, handlePointerUp, handlePointerCancel } = usePieceMouseDrag(ctx);

  useEffect(() => {
    return () => {
      if (globalMoveRef.current) {
        window.removeEventListener('pointermove', globalMoveRef.current);
        window.removeEventListener('touchmove', globalMoveRef.current);
      }
      if (globalUpRef.current) {
        window.removeEventListener('pointerup', globalUpRef.current);
        window.removeEventListener('touchend', globalUpRef.current);
      }
      if (globalCancelRef.current) {
        window.removeEventListener('pointercancel', globalCancelRef.current);
        window.removeEventListener('touchcancel', globalCancelRef.current);
      }
    };
  }, []);

  return {
    draggedPiece,
    startDrag,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    ignoreNextClickRef,
  };
}
