import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePuzzleStore } from '@/lib/stores/puzzle-store';
import { useOrientation } from '@/lib/hooks/use-orientation';
import { usePuzzleSetup } from '../../hooks/use-puzzle-setup';
import { usePuzzleAutoSave } from '../../hooks/use-puzzle-autosave';
import { usePuzzleSubmit } from '../../hooks/use-puzzle-submit';

export function usePlayPage(puzzleId: string) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user?.kakaoId;

  const {
    activePuzzleId,
    difficulty,
    mode,
    totalPieces,
    board,
    trayPieces,
    selectedTrayPiece,
    timerSeconds,
    isTimerRunning,
    isCompleted,
    startedAt,
    selectTrayPiece,
    placePiece,
    pickUpPiece,
    swapPieces,
    shufflePieces,
    tickTimer,
  } = usePuzzleStore();

  const [zoom, setZoom] = useState(1.0);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    setZoom(1.0);
  }, [difficulty, puzzleId]);

  const { puzzle, isPageLoading, syncChoiceData, setSyncChoiceData, initializePuzzle, resumePuzzle } = usePuzzleSetup(puzzleId, token, status);

  usePuzzleAutoSave(
    puzzleId,
    token,
    board,
    trayPieces,
    timerSeconds,
    difficulty,
    mode,
    isCompleted,
    startedAt,
    isPageLoading,
    totalPieces
  );

  const {
    isSubmitting,
    isSaved,
    manualSaveStatus,
    submitError,
    myRanking,
    handleSaveManual,
    handleSaveRecord,
  } = usePuzzleSubmit(
    puzzleId,
    token,
    board,
    trayPieces,
    timerSeconds,
    difficulty,
    mode,
    isCompleted,
    startedAt,
    totalPieces,
    puzzle
  );

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  const gridSize = difficulty === 'novice' ? 6 : difficulty === 'beginner' ? 10 : 16;
  const correctCount = board.filter((cell, idx) => cell === idx).length;
  const progressPercent = Math.round((correctCount / totalPieces) * 100);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleCellClick = (slotIdx: number) => {
    if (isCompleted) return;

    const cellVal = board[slotIdx];
    if (cellVal !== null && cellVal === slotIdx) {
      return;
    }

    if (cellVal !== null) {
      if (selectedTrayPiece !== null) {
        swapPieces(slotIdx, selectedTrayPiece);
      } else {
        pickUpPiece(slotIdx);
      }
    } else if (selectedTrayPiece !== null) {
      placePiece(slotIdx, selectedTrayPiece);
    }
  };

  const handlePieceSelect = (pieceId: number) => {
    selectTrayPiece(pieceId);
  };

  const handleShuffle = () => {
    if (window.confirm('정말로 판을 엎고 처음부터 다시 시작하시겠습니까?')) {
      shufflePieces();
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const Kakao = (window as any).Kakao;
      if (Kakao) {
        if (Kakao.isInitialized && !Kakao.isInitialized()) {
          Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
        }
        if (Kakao.isInitialized && Kakao.isInitialized() && puzzle) {
          const absImgUrl = puzzle.imageUrl.startsWith('http') 
            ? puzzle.imageUrl 
            : window.location.origin + puzzle.imageUrl;
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: `[하루퍼즐] 멋지게 완주 성공! 🎉`,
              description: `대박🌟 ${formatTime(timerSeconds)} 만에 성공했네요!`,
              imageUrl: absImgUrl,
              link: {
                mobileWebUrl: window.location.origin + '/puzzle',
                webUrl: window.location.origin + '/puzzle',
              },
            },
            buttons: [
              {
                title: '기록 도전하러 가기',
                link: {
                  mobileWebUrl: window.location.origin + '/puzzle',
                  webUrl: window.location.origin + '/puzzle',
                },
              },
            ],
          });
          return;
        }
      }
      navigator.clipboard.writeText(window.location.origin + '/puzzle');
      alert('공유용 하루퍼즐 링크가 클립보드에 복사되었습니다!');
    }
  };

  const handleGoHome = () => {
    router.push('/puzzle');
  };

  const handleChooseKeepCurrent = async () => {
    if (!syncChoiceData || !token) return;
    const { localState } = syncChoiceData;
    const total = localState.difficulty === 'novice' ? 36 : localState.difficulty === 'expert' ? 256 : 100;

    initializePuzzle(puzzleId, puzzle!.imageUrl, localState.difficulty, localState.mode || 'ranked');
    resumePuzzle({
      difficulty: localState.difficulty,
      mode: localState.mode || 'ranked',
      timerSeconds: localState.timerSeconds,
      board: localState.board || Array(total).fill(null),
      trayPieces: localState.trayPieces || localState.pieces.map((p: any) => p.id),
      startedAt: new Date(Date.now() - localState.timerSeconds * 1000).toISOString(),
      completed: localState.completed,
    });

    setSyncChoiceData(null);
  };

  const handleChooseLoadServer = async () => {
    if (!syncChoiceData || !token) return;
    const { serverState } = syncChoiceData;
    const total = serverState.difficulty === 'novice' ? 36 : serverState.difficulty === 'expert' ? 256 : 100;
    const piecesData = serverState.board.map((pieceId: any, idx: number) => ({
      id: pieceId !== null ? pieceId : idx,
      correctX: 0,
      correctY: 0,
      currentX: 0,
      currentY: 0,
      width: 0,
      height: 0,
      locked: pieceId === idx,
    }));

    initializePuzzle(puzzleId, puzzle!.imageUrl, serverState.difficulty, serverState.mode || 'ranked');
    resumePuzzle({
      difficulty: serverState.difficulty,
      mode: serverState.mode || 'ranked',
      timerSeconds: serverState.timerSeconds,
      board: serverState.board || Array(total).fill(null),
      trayPieces: serverState.trayPieces || piecesData.map((p: any) => p.id),
      startedAt: new Date(Date.now() - serverState.timerSeconds * 1000).toISOString(),
      completed: false,
    });

    setSyncChoiceData(null);
  };

  const { isLandscape, isLargeScreen } = useOrientation();

  return {
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
  };
}
