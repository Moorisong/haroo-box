'use client';
import { useLanguage } from '@/components/providers/language-provider';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Folder, Eye } from 'lucide-react';
import PieceCell from './piece-cell';
import { DrawerBasketTabs } from './drawer-basket-tabs';

export const basketMetadata: Record<string, { color: string }> = {
  basket1: { color: '#ef4444' },
  basket2: { color: '#3b82f6' },
  basket3: { color: '#22c55e' },
  basket4: { color: '#eab308' },
  basket5: { color: '#a855f7' },
};

interface PieceDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOrganizeMode: boolean;
  setIsOrganizeMode: (val: boolean) => void;
  onGuideClick?: () => void;
  selectedPieceId: number | null;
  onTrayClick?: () => void;
  onPieceClick: (pieceId: number) => void;
  activeBasket: string;
  setActiveBasket: (basket: string) => void;
  baskets: Record<string, number[]>;
  hoveredBasket: string | null;
  movePieceToBasket: (pieceId: number, targetBasket: string) => void;
  activeBasketPieces: number[];
  image: string;
  gridSize: number;
  drawerCellSize: number;
  draggedPiece: any;
  startDrag: (e: React.PointerEvent, pieceId: number) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent, pieceId: number) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
  handleTouchStart: (e: React.TouchEvent, pieceId: number) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent, pieceId: number) => void;
  handleTouchCancel: () => void;
  ignoreNextClickRef: React.MutableRefObject<boolean>;
}

export default function PieceDrawerModal({
  isOpen,
  onClose,
  isOrganizeMode,
  setIsOrganizeMode,
  onGuideClick,
  selectedPieceId,
  onTrayClick,
  onPieceClick,
  activeBasket,
  setActiveBasket,
  baskets,
  hoveredBasket,
  movePieceToBasket,
  activeBasketPieces,
  image,
  gridSize,
  drawerCellSize,
  draggedPiece,
  startDrag,
  handlePointerMove,
  handlePointerUp,
  handlePointerCancel,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleTouchCancel,
  ignoreNextClickRef,
}: PieceDrawerModalProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerDragStart = useRef<{ y: number; time: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const handleDrawerDragStart = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const target = e.currentTarget as HTMLElement;
    try { target.setPointerCapture(e.pointerId); } catch (err) {}
    drawerDragStart.current = { y: e.clientY, time: Date.now() };
    if (drawerRef.current) drawerRef.current.style.transition = 'none';
  };

  const handleDrawerDragMove = (e: React.PointerEvent) => {
    if (!drawerDragStart.current || !drawerRef.current) return;
    const deltaY = e.clientY - drawerDragStart.current.y;
    if (deltaY > 0) drawerRef.current.style.transform = `translateY(${deltaY}px)`;
    else drawerRef.current.style.transform = 'translateY(0px)';
  };

  const handleDrawerDragEnd = (e: React.PointerEvent) => {
    if (!drawerDragStart.current) return;
    const target = e.currentTarget as HTMLElement;
    try { target.releasePointerCapture(e.pointerId); } catch (err) {}

    const deltaY = e.clientY - drawerDragStart.current.y;
    const deltaTime = Date.now() - drawerDragStart.current.time;
    drawerDragStart.current = null;

    if (!drawerRef.current) return;

    drawerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    const velocity = deltaY / Math.max(deltaTime, 1);
    const isFlick = deltaY > 50 && velocity > 0.5;

    if (deltaY > 120 || isFlick) {
      drawerRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => onClose(), 250);
    } else {
      drawerRef.current.style.transform = 'translateY(0px)';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9990] flex flex-col justify-end select-none">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
        onPointerDown={onClose}
      />
      <div
        ref={drawerRef}
        className="relative w-full h-[min(85dvh,900px)] min-w-0 flex flex-col rounded-t-[2rem] border-t shadow-2xl transition-all duration-300 puzzle-animate-slide-up pb-[max(16px,env(safe-area-inset-bottom))] overflow-hidden"
        style={{ backgroundColor: '#1f2937', borderColor: 'var(--puzzle-border)', color: '#f8fafc' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full flex flex-col items-center cursor-ns-resize select-none touch-none py-3"
          onPointerDown={handleDrawerDragStart}
          onPointerMove={handleDrawerDragMove}
          onPointerUp={handleDrawerDragEnd}
          onPointerCancel={handleDrawerDragEnd}
        >
          <div className="w-12 h-1 bg-slate-500/40 rounded-full" />
        </div>

        <div className="px-4 sm:px-5 pb-3 border-b select-none min-w-0" style={{ borderColor: 'var(--puzzle-border)' }}>
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div
              className="flex min-w-0 flex-1 items-center gap-2 cursor-ns-resize touch-none py-1"
              onPointerDown={handleDrawerDragStart}
              onPointerMove={handleDrawerDragMove}
              onPointerUp={handleDrawerDragEnd}
              onPointerCancel={handleDrawerDragEnd}
            >
              <Folder size={17} className="shrink-0 text-blue-400" />
              <h3 className="min-w-0 text-sm sm:text-base font-black leading-snug" style={{ color: '#f8fafc' }}>
                {t('puzzle.components.puzzle.piece.drawer.modal.001')}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 p-2 rounded-xl transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="min-w-0 flex-1">
              {isOrganizeMode ? (
                <p className="text-[11px] font-semibold text-blue-300">
                  {t('puzzle.components.puzzle.piece.drawer.modal.002')}
                </p>
              ) : (
                <p className="text-[11px] font-medium leading-snug text-slate-400">
                  {t('puzzle.components.puzzle.piece.drawer.modal.004')}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOrganizeMode(!isOrganizeMode); }}
                aria-pressed={isOrganizeMode}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border"
                style={{
                  backgroundColor: isOrganizeMode ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.06)',
                  borderColor: isOrganizeMode ? '#60a5fa' : 'rgba(255,255,255,0.12)',
                  color: isOrganizeMode ? '#93c5fd' : '#cbd5e1',
                }}
              >
                {t('puzzle.components.puzzle.piece.drawer.modal.005')} · {isOrganizeMode ? 'ON' : 'OFF'}
              </button>
              {onGuideClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPieceId !== null) onTrayClick?.();
                    onGuideClick();
                  }}
                  className="p-2 rounded-xl transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }}
                  title={t('puzzle.components.puzzle.piece.drawer.modal.006')}
                  aria-label={t('puzzle.components.puzzle.piece.drawer.modal.006')}
                >
                  <Eye size={17} />
                </button>
              )}
            </div>
          </div>
        </div>

        <DrawerBasketTabs
          activeBasket={activeBasket}
          setActiveBasket={setActiveBasket}
          baskets={baskets}
          hoveredBasket={hoveredBasket}
          movePieceToBasket={movePieceToBasket}
          isOrganizeMode={isOrganizeMode}
          selectedPieceId={selectedPieceId}
        />

        <div className={`flex-1 min-h-0 p-3 sm:p-4 pb-16 overscroll-contain ${draggedPiece ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {activeBasketPieces.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
              <span className="text-sm font-black mb-1">{t('puzzle.components.puzzle.piece.drawer.modal.007')}</span>
              <span className="text-xs text-slate-500">{t('puzzle.components.puzzle.piece.drawer.modal.008')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(46px,1fr))] gap-2 sm:gap-2.5 justify-items-center">
              {activeBasketPieces.map((pieceId) => {
                const isSelected = selectedPieceId === pieceId;
                return (
                  <div
                    key={pieceId}
                    data-drawer-piece="true"
                    data-piece-id={pieceId}
                    data-selected={isSelected ? "true" : "false"}
                    onPointerDown={(e) => startDrag(e, pieceId)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(e) => handlePointerUp(e, pieceId)}
                    onPointerCancel={handlePointerCancel}
                    onTouchStart={(e) => handleTouchStart(e, pieceId)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, pieceId)}
                      onTouchCancel={handleTouchCancel}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (ignoreNextClickRef.current) { ignoreNextClickRef.current = false; return; }
                      if (isOrganizeMode) {
                        if (selectedPieceId === pieceId) onTrayClick?.();
                        else onPieceClick(pieceId);
                      } else {
                        onPieceClick(pieceId);
                        setTimeout(() => onClose(), 60);
                      }
                    }}
                    className="relative cursor-pointer transition-all duration-200 select-none touch-pan-y"
                    style={{
                      transform: isSelected && draggedPiece?.id !== pieceId ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isSelected && draggedPiece?.id !== pieceId ? '0 0 0 3px var(--puzzle-primary)' : 'none',
                      opacity: draggedPiece?.id === pieceId ? 0.25 : 1,
                      borderRadius: '6px',
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'pan-y',
                    }}
                  >
                    <PieceCell pieceIdx={pieceId} image={image} size={drawerCellSize} gridSize={gridSize} small />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
