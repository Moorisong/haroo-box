'use client';

import { use } from 'react';
import SyncChoiceModal from '@/components/puzzle/sync-choice-modal';
import LandscapePuzzleLayout from '@/components/puzzle/landscape/landscape-puzzle-layout';
import PortraitPuzzleLayout from '@/components/puzzle/portrait/portrait-puzzle-layout';
import { usePlayPage } from './use-play-page';

interface PlayPageProps {
  params: Promise<{ puzzleId: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { puzzleId } = use(params);
  
  const {
    puzzle,
    difficulty,
    board,
    trayPieces,
    selectedTrayPiece,
    timerSeconds,
    isCompleted,
    progressPercent,
    myRanking,
    token,
    isSubmitting,
    isSaved,
    submitError,
    manualSaveStatus,
    zoom,
    setZoom,
    isLargeScreen,
    formatTime,
    handleCellClick,
    handlePieceSelect,
    selectTrayPiece,
    handleShuffle,
    handleSaveManual,
    handleSaveRecord,
    handleShare,
    handleGoHome,
    isPageLoading,
    activePuzzleId,
    syncChoiceData,
    handleChooseKeepCurrent,
    handleChooseLoadServer,
    isLandscape,
    showOriginal,
    setShowOriginal,
    gridSize,
  } = usePlayPage(puzzleId);

  if (isPageLoading || !puzzle || activePuzzleId === null) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-3 font-semibold select-none">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--puzzle-primary) var(--puzzle-primary) var(--puzzle-primary) transparent' }} />
        <span style={{ color: 'var(--puzzle-muted-foreground)' }}>캔버스 조각판을 세팅하는 중...</span>

        {syncChoiceData && (
          <SyncChoiceModal
            localProgress={syncChoiceData.localState.progress}
            localTimeFormatted={formatTime(syncChoiceData.localState.timerSeconds)}
            serverProgress={syncChoiceData.serverState.progress}
            serverTimeFormatted={formatTime(syncChoiceData.serverState.timerSeconds)}
            onChooseKeepCurrent={handleChooseKeepCurrent}
            onChooseLoadServer={handleChooseLoadServer}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {syncChoiceData && (
        <SyncChoiceModal
          localProgress={syncChoiceData.localState.progress}
          localTimeFormatted={formatTime(syncChoiceData.localState.timerSeconds)}
          serverProgress={syncChoiceData.serverState.progress}
          serverTimeFormatted={formatTime(syncChoiceData.serverState.timerSeconds)}
          onChooseKeepCurrent={handleChooseKeepCurrent}
          onChooseLoadServer={handleChooseLoadServer}
        />
      )}

      {isLandscape ? (
        <LandscapePuzzleLayout
          puzzle={puzzle}
          puzzleId={puzzleId}
          difficulty={difficulty}
          board={board}
          trayPieces={trayPieces}
          selectedTrayPiece={selectedTrayPiece}
          timerSeconds={timerSeconds}
          isCompleted={isCompleted}
          progressPercent={progressPercent}
          myRanking={myRanking}
          isLoggedIn={!!token}
          isSubmitting={isSubmitting}
          isSaved={isSaved}
          submitError={submitError}
          manualSaveStatus={manualSaveStatus}
          zoom={zoom}
          isLarge={isLargeScreen}
          formatTime={formatTime}
          onCellClick={handleCellClick}
          onPieceSelect={handlePieceSelect}
          onTrayClick={() => selectTrayPiece(null)}
          onShuffle={handleShuffle}
          onSaveManual={handleSaveManual}
          onSaveRecord={handleSaveRecord}
          onShare={handleShare}
          onGoHome={handleGoHome}
          onZoomIn={() => setZoom((z) => Math.min(2.2, z + 0.2))}
          onZoomOut={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          selectTrayPiece={selectTrayPiece}
        />
      ) : (
        <PortraitPuzzleLayout
          puzzle={puzzle}
          difficulty={difficulty}
          timerSeconds={timerSeconds}
          progressPercent={progressPercent}
          formatTime={formatTime}
          showOriginal={showOriginal}
          setShowOriginal={setShowOriginal}
          board={board}
          gridSize={gridSize}
          zoom={zoom}
          setZoom={setZoom}
          handleCellClick={handleCellClick}
          selectedTrayPiece={selectedTrayPiece}
          selectTrayPiece={selectTrayPiece}
          handleShuffle={handleShuffle}
          handleSaveManual={handleSaveManual}
          manualSaveStatus={manualSaveStatus}
          trayPieces={trayPieces}
          handlePieceSelect={handlePieceSelect}
          isCompleted={isCompleted}
          handleGoHome={handleGoHome}
          handleSaveRecord={handleSaveRecord}
          handleShare={handleShare}
          myRanking={myRanking}
          isLoggedIn={!!token}
          isSubmitting={isSubmitting}
          isSaved={isSaved}
          submitError={submitError}
        />
      )}
    </>
  );
}
