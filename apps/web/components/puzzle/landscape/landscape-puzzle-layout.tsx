'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import PuzzleBoard from '../puzzle-board';
import CompletionModal from '../completion-modal';
import CursorFollower from '../cursor-follower';

import LandscapeToolbar from './landscape-toolbar';
import GuideImagePanel from './guide-image-panel';
import PuzzlePanelWrapper from './puzzle-panel-wrapper';
import LandscapeTrayPanel from './landscape-tray-panel';

import { Puzzle, MyRanking } from '@/types/puzzle';
import { useLandscapeLayoutState } from './use-landscape-layout-state';

interface LandscapePuzzleLayoutProps {
  puzzle: Puzzle;
  puzzleId: string;
  difficulty: 'novice' | 'beginner' | 'expert';
  board: (number | null)[];
  trayPieces: number[];
  selectedTrayPiece: number | null;
  timerSeconds: number;
  isCompleted: boolean;
  progressPercent: number;
  myRanking: MyRanking | null;
  isLoggedIn: boolean;
  isSubmitting: boolean;
  isSaved: boolean;
  submitError: string | null;
  manualSaveStatus: 'idle' | 'saving' | 'saved';
  zoom: number;
  isLarge: boolean;
  formatTime: (s: number) => string;
  onCellClick: (slotIdx: number) => void;
  onPieceSelect: (pieceId: number) => void;
  onTrayClick: () => void;
  onShuffle: () => void;
  onSaveManual: () => void;
  onSaveRecord: () => void;
  onShare: () => void;
  onGoHome: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  selectTrayPiece: (id: number | null) => void;
}

export default function LandscapePuzzleLayout({
  puzzle,
  puzzleId,
  difficulty,
  board,
  trayPieces,
  selectedTrayPiece,
  timerSeconds,
  isCompleted,
  progressPercent,
  myRanking,
  isLoggedIn,
  isSubmitting,
  isSaved,
  submitError,
  manualSaveStatus,
  zoom,
  isLarge,
  formatTime,
  onCellClick,
  onPieceSelect,
  onTrayClick,
  onShuffle,
  onSaveManual,
  onSaveRecord,
  onShare,
  onGoHome,
  onZoomIn,
  onZoomOut,
  selectTrayPiece,
}: LandscapePuzzleLayoutProps) {
  const router = useRouter();

  const {
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
  } = useLandscapeLayoutState(puzzleId, isLarge);

  // ── 보드 클릭 ──
  const handleCellClickGuarded = useCallback(
    (slotIdx: number) => {
      if (interactionMode !== 'play') return;
      onCellClick(slotIdx);
    },
    [onCellClick, interactionMode]
  );

  // ── 조각 선택 ──
  const handlePieceSelectGuarded = useCallback(
    (pieceId: number) => {
      if (interactionMode !== 'play') return;
      onPieceSelect(pieceId);
    },
    [onPieceSelect, interactionMode]
  );

  const difficultyLabel =
    difficulty === 'novice' ? '초보 (36조각)' : difficulty === 'beginner' ? '일반 (100조각)' : '고수 (256조각)';
  const gridSize = difficulty === 'novice' ? 6 : difficulty === 'beginner' ? 10 : 16;

  const calculatedZoom = zoom;

  return (
    <div
      className="flex flex-col min-h-screen min-h-[100dvh] overflow-hidden w-full select-none"
      style={{ backgroundColor: '#f3f4f6' }}
      onClick={() => {
        if (selectedTrayPiece !== null) {
          selectTrayPiece(null);
        }
      }}
    >
      <LandscapeToolbar
        interactionMode={interactionMode}
        onModeChange={setInteractionMode}
        zoom={calculatedZoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onShuffle={onShuffle}
        onSave={onSaveManual}
        saveStatus={manualSaveStatus}
        timerFormatted={formatTime(timerSeconds)}
        progressPercent={progressPercent}
        puzzleTitle={puzzle.title}
        difficulty={difficultyLabel}
      />

      <div
        className="flex items-center px-4 py-1.5 border-b flex-shrink-0"
        style={{
          borderColor: 'rgba(0, 0, 0, 0.08)',
          backgroundColor: '#e5e7eb',
        }}
      >
        <Link
          href="/puzzle"
          className="flex items-center gap-1 text-xs font-semibold transition-colors text-black/60 hover:text-black"
        >
          <ArrowLeft size={13} strokeWidth={2.5} />
          <span>뒤로가기</span>
        </Link>

        <span
          className="ml-3 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-gray-500/10 text-gray-600"
        >
          {interactionMode === 'play' 
            ? "조각 클릭 후 퍼즐판의 빈 칸을 터치" 
            : "퍼즐판이나 가이드를 드래그로 이동 / 우하단 핸들로 크기를 조절"}
        </span>
      </div>

      <div className="flex flex-1 min-h-0 relative z-10">
        <div
          ref={canvasAreaRef}
          className="relative flex-1 min-w-0 select-none"
          style={{ touchAction: 'pan-y', zIndex: 30 }}
          onClick={(e) => {
            if (selectedTrayPiece !== null) {
              selectTrayPiece(null);
            }
          }}
        >
          {canvasSize.width > 0 && (
            <>
              <GuideImagePanel
                imageUrl={puzzle.imageUrl}
                initialSize={boardSize}
                isDraggable={interactionMode === 'move'}
                defaultPosition={guidePosition}
                defaultSize={guideSize}
                onPositionChange={setGuidePosition}
                onSizeChange={setGuideSize}
              />

              <PuzzlePanelWrapper
                isDraggable={interactionMode === 'move'}
                position={boardPosition}
                onPositionChange={setBoardPosition}
                size={boardSize}
                onSizeChange={setBoardSize}
              >
                <div
                  className={`w-full h-full flex items-center justify-center p-2 scrollbar-hide ${
                    interactionMode === 'move' ? 'overflow-hidden' : 'overflow-auto'
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  <PuzzleBoard
                    board={board}
                    image={puzzle.imageUrl}
                    gridSize={gridSize}
                    zoom={calculatedZoom}
                    onCellClick={handleCellClickGuarded}
                    selectedPieceId={selectedTrayPiece}
                    difficulty={difficulty}
                    isPlayMode={interactionMode === 'play'}
                  />
                </div>
              </PuzzlePanelWrapper>
            </>
          )}
        </div>

        <LandscapeTrayPanel
          trayPieces={trayPieces}
          image={puzzle.imageUrl}
          gridSize={gridSize}
          selectedPieceId={selectedTrayPiece}
          onPieceClick={handlePieceSelectGuarded}
          onTrayClick={onTrayClick}
          isLarge={isLarge}
          isPlayMode={interactionMode === 'play'}
        />
      </div>

      {isCompleted && (
        <CompletionModal
          onClose={onGoHome}
          onGoHome={onGoHome}
          onSaveRecord={onSaveRecord}
          onShare={onShare}
          completionTimeFormatted={formatTime(timerSeconds)}
          myRanking={myRanking}
          isLoggedIn={isLoggedIn}
          isSaving={isSubmitting}
          isSaved={isSaved}
          errorMessage={submitError}
        />
      )}

      {interactionMode === 'play' && (
        <CursorFollower
          selectedPieceId={selectedTrayPiece}
          image={puzzle.imageUrl}
          gridSize={gridSize}
        />
      )}
    </div>
  );
}
