'use client';

import { createPortal } from 'react-dom';
import { Folder, HelpCircle } from 'lucide-react';
import PieceCell from '../piece-cell';
import KakaoAdfit, { ADFIT_SIZES, ADFIT_UNITS } from '@/components/ads/kakao-adfit';
import { useLandscapeTray } from './use-landscape-tray';
import { basketMetadata } from './constants';
import { LandscapeTrayPiece } from './landscape-tray-piece';
import { TrayDisabledOverlay } from './tray-disabled-overlay';

interface LandscapeTrayPanelProps {
  trayPieces: number[];
  image: string;
  gridSize: number;
  selectedPieceId: number | null;
  onPieceClick: (pieceId: number) => void;
  onTrayClick?: () => void;
  /** Large Landscape 여부 (true=Large, false=Compact) */
  isLarge: boolean;
  isPlayMode?: boolean;
}

export default function LandscapeTrayPanel({
  trayPieces,
  image,
  gridSize,
  selectedPieceId,
  onPieceClick,
  onTrayClick,
  isLarge,
  isPlayMode = true,
}: LandscapeTrayPanelProps) {
  const cellSize = isLarge ? 54 : 40;

  const {
    activeBasket,
    setActiveBasket,
    isOrganizeMode,
    setIsOrganizeMode,
    hoveredBasket,
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
  } = useLandscapeTray({
    trayPieces,
    selectedPieceId,
    onTrayClick,
    isPlayMode,
  });

  const activeBasketPieces = baskets[activeBasket] || [];

  const displayPieces = [...activeBasketPieces];
  const holdPieceId = selectedPieceId !== null && !trayPieces.includes(selectedPieceId) ? selectedPieceId : null;
  if (holdPieceId !== null) {
    displayPieces.unshift(holdPieceId);
  }

  return (
    <div
      id="landscape-tray-panel"
      className="relative flex flex-col h-full min-h-0 border-l"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        minWidth: isLarge ? '320px' : '220px',
        maxWidth: isLarge ? '400px' : '300px',
        width: isLarge ? '25%' : '28%',
        flexShrink: 0,
        overscrollBehavior: 'none',
        zIndex: 10,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isPlayMode) return;
        if (selectedPieceId !== null) onTrayClick?.();
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0 gap-1"
        style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Folder size={14} className="text-blue-500 flex-shrink-0" />
          <span className="text-sm font-bold text-gray-800 truncate">보관함</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsOrganizeMode(!isOrganizeMode);
            }}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
            title="보관함 분류 모드"
          >
            <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
              분류
            </span>
            <div
              className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                isOrganizeMode ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform duration-200 ${
                  isOrganizeMode ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
          <span className="text-[10px] font-medium text-gray-500">
            대기: <span className="text-gray-800 font-mono font-semibold">{trayPieces.length}</span>
          </span>
        </div>
      </div>

      <div
        className="grid grid-cols-5 gap-1 p-2 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
      >
        {['basket1', 'basket2', 'basket3', 'basket4', 'basket5'].map((key) => {
          const isActive = activeBasket === key;
          const isHovered = hoveredBasket === key;
          const count = baskets[key]?.length || 0;
          const meta = basketMetadata[key];

          return (
            <div
              key={key}
              data-basket-id={key}
              onClick={(e) => {
                e.stopPropagation();
                if (!isPlayMode) return;
                if (isOrganizeMode && selectedPieceId !== null) {
                  movePieceToBasket(selectedPieceId, key);
                } else {
                  setActiveBasket(key);
                }
              }}
              className={`flex flex-row items-center justify-center rounded-lg border transition-all cursor-pointer gap-1.5 ${
                isLarge ? 'py-2.5 px-1.5' : 'p-1'
              } ${isOrganizeMode && selectedPieceId !== null ? 'animate-pulse' : ''}`}
              style={{
                borderColor: isHovered
                  ? 'rgba(79, 142, 247, 0.5)'
                  : isActive
                  ? 'rgba(0, 0, 0, 0.25)'
                  : isOrganizeMode && selectedPieceId !== null
                  ? 'rgba(59, 130, 246, 0.6)'
                  : 'rgba(0, 0, 0, 0.05)',
                backgroundColor: isHovered
                  ? 'rgba(79, 142, 247, 0.08)'
                  : isActive
                  ? 'rgba(0, 0, 0, 0.06)'
                  : isOrganizeMode && selectedPieceId !== null
                  ? 'rgba(59, 130, 246, 0.05)'
                  : 'rgba(0, 0, 0, 0.01)',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <span
                className={`rounded-full flex-shrink-0 ${isLarge ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
                style={{ backgroundColor: meta.color }}
              />
              <span
                className={`${isLarge ? 'text-sm' : 'text-xs'} font-semibold leading-none font-mono`}
                style={{ color: isActive || isHovered || (isOrganizeMode && selectedPieceId !== null) ? '#1f2937' : 'rgba(0, 0, 0, 0.4)' }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {isOrganizeMode ? (
        <div 
          className="px-3 py-1.5 border-b flex-shrink-0 bg-blue-50/50"
          style={{ borderColor: 'rgba(59, 130, 246, 0.15)' }}
        >
          <p className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
            <span>
              {selectedPieceId === null 
                ? "① 아래 조각을 눌러 선택해주세요." 
                : "② 위 바구니 탭을 눌러 조각을 옮기세요."}
            </span>
          </p>
        </div>
      ) : (
        isLarge && (
          <div className="px-4 py-1.5 border-b flex-shrink-0" style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}>
            <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
              <HelpCircle size={12} className="text-gray-400 flex-shrink-0" />
              <span>조각 목록 스크롤 가능</span>
            </p>
          </div>
        )
      )}

      <div 
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 scrollbar-hide"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        onScroll={handleScroll}
      >
        {trayPieces.length === 0 && selectedPieceId === null ? (
          <div className="flex flex-col items-center justify-center h-32 text-center text-slate-400">
            <span className="text-sm font-black mb-1">🎉</span>
            <span className="text-[10px] font-black">모든 조각 배치!</span>
          </div>
        ) : displayPieces.length === 0 && selectedPieceId === null ? (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <span className="text-[10px] font-bold text-slate-500">바구니가 비어 있습니다.</span>
          </div>
        ) : (
          <div
            className="grid gap-1.5 justify-items-center"
            style={{ gridTemplateColumns: isLarge ? 'repeat(auto-fill, minmax(54px, 1fr))' : 'repeat(auto-fill, minmax(40px, 1fr))' }}
          >
            {displayPieces.map((pieceId) => (
              <LandscapeTrayPiece
                key={pieceId}
                pieceId={pieceId}
                isSelected={selectedPieceId === pieceId}
                isHold={pieceId === holdPieceId}
                isDragged={draggedPiece?.id === pieceId}
                image={image}
                cellSize={cellSize}
                gridSize={gridSize}
                isOrganizeMode={isOrganizeMode}
                ignoreNextClickRef={ignoreNextClickRef}
                scrolledRecentlyRef={scrolledRecentlyRef}
                onTrayClick={onTrayClick}
                onPieceClick={onPieceClick}
                startDrag={startDrag}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
              />
            ))}
          </div>
        )}
      </div>

      {isLarge && (
        <div 
          className="flex-shrink-0 border-t py-2.5 flex justify-center bg-white" 
          style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
        >
          <KakaoAdfit unit={ADFIT_UNITS.MAIN_BANNER} {...ADFIT_SIZES.BANNER_320x100} />
        </div>
      )}

      {draggedPiece && typeof document !== 'undefined' && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] opacity-90 select-none"
          style={{
            left: `${draggedPiece.x - cellSize / 2}px`,
            top: `${draggedPiece.y - cellSize / 2}px`,
            width: cellSize,
            height: cellSize,
            transform: 'scale(1.15)',
            boxShadow: '0 0 0 3px var(--puzzle-primary), 0 10px 20px rgba(0,0,0,0.4)',
            borderRadius: '6px',
          }}
        >
          <PieceCell
            pieceIdx={draggedPiece.id}
            image={image}
            size={cellSize}
            gridSize={gridSize}
            small
          />
        </div>,
        document.body
      )}

      {!isPlayMode && <TrayDisabledOverlay />}
    </div>
  );
}
