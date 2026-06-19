'use client';

import { Puzzle } from '@/types/puzzle';
import ArchivePuzzleCard from './archive-puzzle-card';

interface ArchiveGridProps {
  puzzles: Puzzle[];
  myHistory: {
    puzzleId: string;
    completionTime: number;
    myRank?: number;
    completed: boolean;
    difficulty?: 'novice' | 'beginner' | 'expert';
    progress?: number;
  }[];
  isHistoryLoaded?: boolean;
}

export default function ArchiveGrid({ puzzles, myHistory, isHistoryLoaded }: ArchiveGridProps) {
  // 내 히스토리 맵 구성 (완성 및 진행 중 분리)
  const completedMap = new Map(myHistory.filter(h => h.completed).map((h) => [h.puzzleId, h]));
  const progressMap = new Map(myHistory.filter(h => !h.completed).map((h) => [h.puzzleId, h]));

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => {
        const completedRecord = completedMap.get(puzzle._id);
        const progressRecord = progressMap.get(puzzle._id);
        
        let status: 'current' | 'completed' | 'missed' = 'missed';
        if (completedRecord) {
          status = 'completed';
        }
        if (progressRecord) {
          status = 'current';
        }

        const myTime = completedRecord ? formatDuration(completedRecord.completionTime) : null;
        const myRank = completedRecord && completedRecord.myRank ? completedRecord.myRank : null;

        return (
          <ArchivePuzzleCard
            key={puzzle._id}
            puzzle={puzzle}
            status={status}
            myTime={myTime}
            myRank={myRank}
            isHistoryLoaded={isHistoryLoaded}
            serverProgress={progressRecord ? progressRecord.progress : undefined}
            serverDifficulty={progressRecord ? progressRecord.difficulty : undefined}
          />
        );
      })}
    </div>
  );
}
