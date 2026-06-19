import { useState, useEffect, useRef } from 'react';
import { InteractionMode } from './landscape-toolbar';

interface Position {
  x: number;
  y: number;
}

export interface LandscapeState {
  guidePosition: Position;
  guideSize: number;
  boardPosition: Position;
  boardSize: number;
  interactionMode: InteractionMode;
}

const LANDSCAPE_STATE_KEY = 'puzzle-landscape-state-v2-';

function loadLandscapeState(puzzleId: string): Partial<LandscapeState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LANDSCAPE_STATE_KEY + puzzleId);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return null;
}

function saveLandscapeState(puzzleId: string, state: LandscapeState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANDSCAPE_STATE_KEY + puzzleId, JSON.stringify(state));
  } catch (e) { }
}

export function useLandscapeLayoutState(puzzleId: string, isLarge: boolean) {
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // ── 가로모드 레이아웃 상태 ──
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('play');
  const [guidePosition, setGuidePosition] = useState<Position>({ x: 0, y: 0 });
  const [guideSize, setGuideSize] = useState<number>(320);
  const [boardPosition, setBoardPosition] = useState<Position>({ x: 0, y: 0 });
  const [boardSize, setBoardSize] = useState<number>(320);

  // 캔버스 영역 크기 → Guide / Puzzle 초기 크기 계산
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // 초기 배치 계산 여부
  const initializedRef = useRef(false);

  // ── 캔버스 영역 크기 측정 ──
  useEffect(() => {
    const measure = () => {
      if (!canvasAreaRef.current) return;
      const rect = canvasAreaRef.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (canvasAreaRef.current) observer.observe(canvasAreaRef.current);
    return () => observer.disconnect();
  }, []);

  // ── 태블릿/모바일 상하 바운스 및 스크롤 차단 ──
  useEffect(() => {
    const preventTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;

      // 1. 이동 모드일 때 퍼즐판이나 가이드 드래그 시 스크롤 격리
      if (interactionMode === 'move') {
        const isPanel = target.closest('#landscape-puzzle-panel') || target.closest('#landscape-guide-panel');
        if (isPanel) {
          if (e.cancelable) {
            e.preventDefault();
          }
          return;
        }
      }

      // 2. 보관함 내부 스크롤 동작 시 body 스크롤 체이닝 방지
      const scrollableDiv = target.closest('#landscape-tray-panel div.overflow-y-auto');
      if (scrollableDiv) {
        e.stopPropagation();
      }
    };

    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [interactionMode]);

  // ── LocalStorage에서 이전 landscapeState 복원 ──
  useEffect(() => {
    if (initializedRef.current || canvasSize.width === 0) return;
    const saved = loadLandscapeState(puzzleId);

    if (saved && saved.guidePosition && (saved.guidePosition.x !== 0 || saved.guidePosition.y !== 0)) {
      if (saved.guidePosition) setGuidePosition(saved.guidePosition);
      if (saved.guideSize !== undefined) setGuideSize(saved.guideSize);
      if (saved.boardPosition) setBoardPosition(saved.boardPosition);
      if (saved.boardSize !== undefined) setBoardSize(saved.boardSize);
      if (saved.interactionMode) setInteractionMode(saved.interactionMode);
    } else {
      // 초기 배치: Guide와 Puzzle을 나란히 배치 (크기 일치 & 세로 정렬)
      const trayWidth = isLarge ? 360 : 250; 
      const availableWidth = canvasSize.width - trayWidth;
      const panelGap = 32; 

      // 세로 높이 한계치 측정 
      const maxAllowedHeight = Math.max(160, canvasSize.height - 80);

      const widthBasedSize = Math.floor((availableWidth - panelGap * 3) / 2);
      const defaultPanelSize = Math.max(160, Math.min(400, widthBasedSize, maxAllowedHeight));
      const topY = Math.max(20, Math.floor((canvasSize.height - defaultPanelSize) / 2));

      const guideX = Math.floor((availableWidth - (defaultPanelSize * 2 + panelGap)) / 2) - 16;
      const boardX = guideX + defaultPanelSize + panelGap + 32;

      const newGuidePos = { x: Math.max(16, guideX), y: topY };
      const newBoardPos = { x: Math.max(16 + defaultPanelSize + panelGap, boardX), y: topY };

      setGuidePosition(newGuidePos);
      setGuideSize(defaultPanelSize);
      setBoardPosition(newBoardPos);
      setBoardSize(defaultPanelSize);
    }
    setTimeout(() => {
      initializedRef.current = true;
    }, 100);
  }, [canvasSize, puzzleId, isLarge]);

  // ── landscapeState 저장 (변경 시마다) ──
  useEffect(() => {
    if (!initializedRef.current) return;
    if (guidePosition.x === 0 && guidePosition.y === 0) return;
    saveLandscapeState(puzzleId, {
      guidePosition,
      guideSize,
      boardPosition,
      boardSize,
      interactionMode,
    });
  }, [guidePosition, guideSize, boardPosition, boardSize, interactionMode, puzzleId]);

  return {
    canvasAreaRef,
    interactionMode,
    setInteractionMode,
    guidePosition,
    setGuidePosition,
    guideSize,
    setGuideSize,
    boardPosition,
    setBoardPosition,
    boardSize,
    setBoardSize,
    canvasSize,
  };
}
