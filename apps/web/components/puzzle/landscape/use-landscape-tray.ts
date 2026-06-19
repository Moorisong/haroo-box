import { useState, useEffect, useRef } from 'react';

interface UseLandscapeTrayProps {
  trayPieces: number[];
  selectedPieceId: number | null;
  onTrayClick?: () => void;
  isPlayMode: boolean;
}

export function useLandscapeTray({
  trayPieces,
  selectedPieceId,
  onTrayClick,
  isPlayMode,
}: UseLandscapeTrayProps) {
  const [activeBasket, setActiveBasket] = useState<string>('basket1');
  const [isOrganizeMode, setIsOrganizeMode] = useState(false);
  const [hoveredBasket, setHoveredBasket] = useState<string | null>(null);
  const [baskets, setBaskets] = useState<Record<string, number[]>>({
    basket1: [],
    basket2: [],
    basket3: [],
    basket4: [],
    basket5: [],
  });

  // 드래그 상태
  const [draggedPiece, setDraggedPiece] = useState<{
    id: number;
    x: number;
    y: number;
  } | null>(null);
  const dragActiveRef = useRef(false);
  const startCoords = useRef<{ x: number; y: number } | null>(null);
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const globalMoveRef = useRef<any>(null);
  const globalUpRef = useRef<any>(null);
  const globalCancelRef = useRef<any>(null);

  // 꾹 누르기(롱프레스) 및 모바일 스크롤 충돌 방지용 Refs
  const longPressTimeout = useRef<any>(null);
  const hasMovedRef = useRef<boolean>(false);

  // 스크롤 감지 및 드래그/클릭 방지용 Ref
  const scrolledRecentlyRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ignoreNextClickRef = useRef<boolean>(false);

  // 언마운트 시 글로벌 리스너 및 타이머 정리
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
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    };
  }, []);

  // 로컬스토리지 바구니 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `puzzle-baskets-landscape-${window.location.pathname}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setBaskets(parsed);
      } catch (e) {}
    }
  }, []);

  // trayPieces 동기화
  useEffect(() => {
    setBaskets((prev) => {
      const allPiecesInBaskets = new Set(Object.values(prev).flat());
      const traySet = new Set(trayPieces);

      const nextBaskets = { ...prev };
      for (const key in nextBaskets) {
        nextBaskets[key] = nextBaskets[key].filter((id) => traySet.has(id));
      }

      const newPieces = trayPieces.filter((id) => !allPiecesInBaskets.has(id));
      if (newPieces.length > 0) {
        const target = activeBasket || 'basket1';
        nextBaskets[target] = [...(nextBaskets[target] || []), ...newPieces];
      }

      if (typeof window !== 'undefined') {
        const key = `puzzle-baskets-landscape-${window.location.pathname}`;
        localStorage.setItem(key, JSON.stringify(nextBaskets));
      }

      return nextBaskets;
    });
  }, [trayPieces, activeBasket]);

  const movePieceToBasket = (pieceId: number, targetBasket: string) => {
    if (selectedPieceId === pieceId) {
      onTrayClick?.();
    }
    setBaskets((prev) => {
      const next = { ...prev };
      for (const key in next) {
        next[key] = next[key].filter((id) => id !== pieceId);
      }
      next[targetBasket] = [...(next[targetBasket] || []), pieceId];

      if (typeof window !== 'undefined') {
        const key = `puzzle-baskets-landscape-${window.location.pathname}`;
        localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  };

  // 드래그 시작 (마우스 및 가상 포인터용)
  const startDrag = (e: React.PointerEvent, pieceId: number) => {
    if (e.pointerType === 'touch') return;
    if (!isPlayMode) return;
    if (e.button !== 0) return;
    if (scrolledRecentlyRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    const pointerId = e.pointerId;
    const target = e.currentTarget as HTMLElement;

    startCoords.current = { x: clientX, y: clientY };
    dragActiveRef.current = false;

    try { target.setPointerCapture(pointerId); } catch (err) {}

    const onMove = (ev: PointerEvent) => {
      if (!startCoords.current) return;
      const dx = ev.clientX - startCoords.current.x;
      const dy = ev.clientY - startCoords.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!dragActiveRef.current) {
        if (dist > 5) {
          dragActiveRef.current = true;
          setDraggedPiece({ id: pieceId, x: ev.clientX, y: ev.clientY });
        }
      } else {
        setDraggedPiece({ id: pieceId, x: ev.clientX, y: ev.clientY });
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        const basketTab = el?.closest('[data-basket-id]');
        setHoveredBasket(basketTab?.getAttribute('data-basket-id') || null);
      }
    };

    const onUp = (ev: PointerEvent) => {
      cleanup();
      const wasDragging = dragActiveRef.current;
      dragActiveRef.current = false;
      startCoords.current = null;

      if (wasDragging) {
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        const basketTab = el?.closest('[data-basket-id]');
        const targetBasket = basketTab?.getAttribute('data-basket-id');
        if (targetBasket) movePieceToBasket(pieceId, targetBasket);
        setDraggedPiece(null);
        setHoveredBasket(null);
        ignoreNextClickRef.current = true;
      } else {
        ignoreNextClickRef.current = false;
      }
    };

    const onCancel = () => {
      cleanup();
      dragActiveRef.current = false;
      startCoords.current = null;
      setDraggedPiece(null);
      setHoveredBasket(null);
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      globalMoveRef.current = null;
      globalUpRef.current = null;
      globalCancelRef.current = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onCancel, { passive: true });
    globalMoveRef.current = onMove;
    globalUpRef.current = onUp;
    globalCancelRef.current = onCancel;
  };

  // 모바일 터치 드래그 시작 (롱프레스 220ms 후 스크롤 차단 및 드래그 모드 진입)
  const handleTouchStart = (e: React.TouchEvent, pieceId: number) => {
    if (!isPlayMode) return;
    const touch = e.touches[0];
    if (!touch) return;

    const clientX = touch.clientX;
    const clientY = touch.clientY;

    startCoords.current = { x: clientX, y: clientY };
    lastCoords.current = { x: clientX, y: clientY };
    dragActiveRef.current = false;
    hasMovedRef.current = false;

    longPressTimeout.current = setTimeout(() => {
      dragActiveRef.current = true;
      setDraggedPiece({ id: pieceId, x: clientX, y: clientY });

      const onTouchMove = (event: TouchEvent) => {
        if (event.cancelable) {
          event.preventDefault(); // 드래그 중 브라우저 스크롤 완벽 차단
        }
        const t = event.touches[0];
        if (t) {
          setDraggedPiece({ id: pieceId, x: t.clientX, y: t.clientY });
          lastCoords.current = { x: t.clientX, y: t.clientY };

          const dropElement = document.elementFromPoint(t.clientX, t.clientY);
          const basketTab = dropElement?.closest('[data-basket-id]');
          setHoveredBasket(basketTab?.getAttribute('data-basket-id') || null);
        }
      };

      const onTouchEnd = (event: TouchEvent) => {
        cleanupTouch();
        dragActiveRef.current = false;
        startCoords.current = null;

        const t = event.changedTouches[0];
        const endX = t ? t.clientX : lastCoords.current.x;
        const endY = t ? t.clientY : lastCoords.current.y;

        const dropElement = document.elementFromPoint(endX, endY);
        const basketTab = dropElement?.closest('[data-basket-id]');
        const targetBasket = basketTab?.getAttribute('data-basket-id');
        if (targetBasket) {
          movePieceToBasket(pieceId, targetBasket);
        }

        setDraggedPiece(null);
        setHoveredBasket(null);
        ignoreNextClickRef.current = true;
      };

      const onTouchCancel = () => {
        cleanupTouch();
        dragActiveRef.current = false;
        startCoords.current = null;
        setDraggedPiece(null);
        setHoveredBasket(null);
      };

      const cleanupTouch = () => {
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchCancel);
        globalMoveRef.current = null;
        globalUpRef.current = null;
        globalCancelRef.current = null;
      };

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchCancel);
      globalMoveRef.current = onTouchMove;
      globalUpRef.current = onTouchEnd;
      globalCancelRef.current = onTouchCancel;
    }, 180);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startCoords.current) return;
    if (dragActiveRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const dx = touch.clientX - startCoords.current.x;
    const dy = touch.clientY - startCoords.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 4) {
      hasMovedRef.current = true;
    }

    if (distance > 6) {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
      startCoords.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, pieceId: number) => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }

    const wasDragging = dragActiveRef.current;
    dragActiveRef.current = false;
    startCoords.current = null;

    if (wasDragging || hasMovedRef.current) {
      ignoreNextClickRef.current = true;
    } else {
      ignoreNextClickRef.current = false;
    }
    hasMovedRef.current = false;
  };

  const handleScroll = () => {
    scrolledRecentlyRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      scrolledRecentlyRef.current = false;
    }, 150);
  };

  return {
    activeBasket,
    setActiveBasket,
    isOrganizeMode,
    setIsOrganizeMode,
    hoveredBasket,
    setHoveredBasket,
    baskets,
    draggedPiece,
    ignoreNextClickRef,
    scrolledRecentlyRef,
    movePieceToBasket,
    startDrag,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
  };
}
