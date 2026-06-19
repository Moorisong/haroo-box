import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Timer, Eye } from 'lucide-react';
import PuzzleBoard from '@/components/puzzle/puzzle-board';
import PieceTray from '@/components/puzzle/piece-tray';
import FloatingToolbar from '@/components/puzzle/floating-toolbar';
import CompletionModal from '@/components/puzzle/completion-modal';
import CursorFollower from '@/components/puzzle/cursor-follower';
import KakaoAdfit, { ADFIT_SIZES, ADFIT_UNITS } from '@/components/ads/kakao-adfit';

interface PortraitPuzzleLayoutProps {
  puzzle: any;
  difficulty: string;
  timerSeconds: number;
  progressPercent: number;
  formatTime: (sec: number) => string;
  showOriginal: boolean;
  setShowOriginal: (v: boolean) => void;
  board: (number | null)[];
  gridSize: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  handleCellClick: (idx: number) => void;
  selectedTrayPiece: number | null;
  selectTrayPiece: (id: number | null) => void;
  handleShuffle: () => void;
  handleSaveManual: () => void;
  manualSaveStatus: any;
  trayPieces: number[];
  handlePieceSelect: (id: number) => void;
  isCompleted: boolean;
  handleGoHome: () => void;
  handleSaveRecord: () => void;
  handleShare: () => void;
  myRanking: any;
  isLoggedIn: boolean;
  isSubmitting: boolean;
  isSaved: boolean;
  submitError: string | null;
}

export default function PortraitPuzzleLayout({
  puzzle,
  difficulty,
  timerSeconds,
  progressPercent,
  formatTime,
  showOriginal,
  setShowOriginal,
  board,
  gridSize,
  zoom,
  setZoom,
  handleCellClick,
  selectedTrayPiece,
  selectTrayPiece,
  handleShuffle,
  handleSaveManual,
  manualSaveStatus,
  trayPieces,
  handlePieceSelect,
  isCompleted,
  handleGoHome,
  handleSaveRecord,
  handleShare,
  myRanking,
  isLoggedIn,
  isSubmitting,
  isSaved,
  submitError,
}: PortraitPuzzleLayoutProps) {
  return (
    <div
      className="flex flex-col min-h-screen select-none"
      style={{ backgroundColor: 'var(--puzzle-background)' }}
      onClick={() => {
        if (selectedTrayPiece !== null) {
          selectTrayPiece(null);
        }
      }}
    >
      <div 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ 
          backgroundColor: 'var(--puzzle-glass-bg)', 
          backdropFilter: 'var(--puzzle-glass-blur)',
          borderColor: 'var(--puzzle-border)' 
        }}
      >
        <Link
          href="/puzzle"
          className="flex items-center gap-1 text-sm font-bold transition-colors"
          style={{ color: 'var(--puzzle-muted-foreground)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--puzzle-foreground)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--puzzle-muted-foreground)'; }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>뒤로</span>
        </Link>

        <div className="flex flex-col items-center">
          <span className="text-sm font-black truncate max-w-[200px]" style={{ color: 'var(--puzzle-card-foreground)' }}>
            {puzzle.title}
          </span>
          <span className="text-[10px] font-bold" style={{ color: 'var(--puzzle-primary)' }}>
            {difficulty === 'novice' ? '초보 (36조각)' : difficulty === 'beginner' ? '일반 (100조각)' : '고수 (256조각)'} · 🏆 랭킹 도전
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--puzzle-card-foreground)' }}>
            <Timer size={14} style={{ color: 'var(--puzzle-primary)' }} />
            <span className="tabular-nums">{formatTime(timerSeconds)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--puzzle-primary)' }}>
            <span className="tabular-nums">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div 
        className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        onClick={() => {
          if (selectedTrayPiece !== null) {
            selectTrayPiece(null);
          }
        }}
      >
        {showOriginal && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8"
            onClick={(e) => {
              e.stopPropagation();
              setShowOriginal(false);
            }}
          >
            <div className="relative max-w-lg rounded-2xl overflow-hidden shadow-2xl">
              <img src={puzzle.imageUrl} alt="Original Guide" className="w-full h-auto object-contain max-h-[70vh]" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white font-bold text-xs flex items-center gap-1">
                <Eye size={12} />
                <span>가이드 탭하여 닫기</span>
              </div>
            </div>
          </div>
        )}

        <PuzzleBoard
          board={board}
          image={puzzle.imageUrl}
          gridSize={gridSize}
          zoom={zoom}
          onCellClick={handleCellClick}
          selectedPieceId={selectedTrayPiece}
          difficulty={difficulty}
        />
      </div>

      <div className="p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 mt-auto">
        <FloatingToolbar
          onOriginalToggle={() => setShowOriginal(!showOriginal)}
          onShuffle={handleShuffle}
          onZoomIn={() => setZoom((z) => Math.min(2.2, z + 0.2))}
          onZoomOut={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          onSave={handleSaveManual}
          showOriginal={showOriginal}
          zoom={zoom}
          saveStatus={manualSaveStatus}
        />

        <div className="flex justify-center my-0.5">
          <KakaoAdfit unit={ADFIT_UNITS.MAIN_BANNER} {...ADFIT_SIZES.BANNER_320x50} />
        </div>

        <PieceTray
          trayPieces={trayPieces}
          image={puzzle.imageUrl}
          gridSize={gridSize}
          selectedPieceId={selectedTrayPiece}
          onPieceClick={handlePieceSelect}
          onTrayClick={() => selectTrayPiece(null)}
          onGuideClick={() => setShowOriginal(true)}
        />
      </div>

      {isCompleted && (
        <CompletionModal
          onClose={handleGoHome}
          onGoHome={handleGoHome}
          onSaveRecord={handleSaveRecord}
          onShare={handleShare}
          completionTimeFormatted={formatTime(timerSeconds)}
          myRanking={myRanking}
          isLoggedIn={isLoggedIn}
          isSaving={isSubmitting}
          isSaved={isSaved}
          errorMessage={submitError}
        />
      )}

      <CursorFollower
        selectedPieceId={selectedTrayPiece}
        image={puzzle.imageUrl}
        gridSize={gridSize}
      />
    </div>
  );
}
