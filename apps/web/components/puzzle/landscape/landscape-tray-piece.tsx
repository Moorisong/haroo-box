import React from 'react';
import PieceCell from '../piece-cell';

interface LandscapeTrayPieceProps {
  pieceId: number;
  isSelected: boolean;
  isHold: boolean;
  isDragged: boolean;
  image: string;
  cellSize: number;
  gridSize: number;
  isOrganizeMode: boolean;
  ignoreNextClickRef: React.MutableRefObject<boolean>;
  scrolledRecentlyRef: React.MutableRefObject<boolean>;
  onTrayClick?: () => void;
  onPieceClick: (pieceId: number) => void;
  startDrag: (e: React.PointerEvent, pieceId: number) => void;
  handleTouchStart: (e: React.TouchEvent, pieceId: number) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent, pieceId: number) => void;
}

export function LandscapeTrayPiece({
  pieceId,
  isSelected,
  isHold,
  isDragged,
  image,
  cellSize,
  gridSize,
  isOrganizeMode,
  ignoreNextClickRef,
  scrolledRecentlyRef,
  onTrayClick,
  onPieceClick,
  startDrag,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}: LandscapeTrayPieceProps) {
  return (
    <div
      data-tray-piece="true"
      data-piece-id={pieceId}
      data-selected={isSelected ? "true" : "false"}
      onPointerDown={(e) => startDrag(e, pieceId)}
      onTouchStart={(e) => handleTouchStart(e, pieceId)}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => handleTouchEnd(e, pieceId)}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (ignoreNextClickRef.current) {
          ignoreNextClickRef.current = false;
          return;
        }
        if (!scrolledRecentlyRef.current) {
          if (isOrganizeMode && isSelected) {
            onTrayClick?.();
          } else {
            onPieceClick(pieceId);
          }
        }
      }}
      className="relative cursor-pointer transition-all duration-200 select-none"
      style={{
        transform: isSelected && !isDragged ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isSelected && !isDragged
          ? '0 0 0 3px var(--puzzle-primary)'
          : 'none',
        opacity: isDragged ? 0.25 : 1,
        borderRadius: '6px',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'pan-y',
      }}
    >
      <PieceCell
        pieceIdx={pieceId}
        image={image}
        size={cellSize}
        gridSize={gridSize}
        small
      />
      {isHold && (
        <span className="absolute -top-1.5 -right-1 px-0.5 py-0.5 bg-blue-500 text-white rounded text-[7px] font-black shadow-md pointer-events-none z-10">
          HOLD
        </span>
      )}
    </div>
  );
}
