import React from 'react';
import { Check, Layers, Trophy } from 'lucide-react';

interface HeroFloatingStatsProps {
  hasCompleted: boolean;
  hasSavedGame: boolean;
  savedDifficulty?: 'novice' | 'beginner' | 'expert' | null;
  completedDifficulty?: 'novice' | 'beginner' | 'expert' | null;
  isSavedDifficultyCompleted: boolean;
  matchedPieces: number;
  totalPieces: number;
}

export function HeroFloatingStats({
  hasCompleted,
  hasSavedGame,
  savedDifficulty,
  completedDifficulty,
  isSavedDifficultyCompleted,
  matchedPieces,
  totalPieces,
}: HeroFloatingStatsProps) {
  return (
    <div 
      className="absolute -top-3 -right-3 px-4 py-3 rounded-xl border border-border hidden sm:block"
      style={{
        backgroundColor: 'var(--puzzle-glass-bg)',
        backdropFilter: 'var(--puzzle-glass-blur)',
        border: '1px solid var(--puzzle-glass-border)',
        boxShadow: 'var(--puzzle-shadow-md)',
      }}
    >
      {hasCompleted ? (
        <>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <Check size={13} strokeWidth={3} />
            <span>완료됨 ({completedDifficulty === 'novice' ? '초보' : completedDifficulty === 'expert' ? '고수' : '일반'})</span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold text-emerald-700">
            랭킹 등록 완료! 🏅
          </p>
        </>
      ) : hasSavedGame && savedDifficulty && !isSavedDifficultyCompleted ? (
        <>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--puzzle-primary)' }}>
            <Layers size={13} />
            <span>진행 중 ({savedDifficulty === 'novice' ? '초보' : savedDifficulty === 'expert' ? '고수' : '일반'})</span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold" style={{ color: 'var(--puzzle-card-foreground)' }}>
            {matchedPieces} / {totalPieces} 조각
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--puzzle-primary)' }}>
            <Trophy size={13} />
            <span>실시간 랭킹 도전</span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold" style={{ color: 'var(--puzzle-card-foreground)' }}>
            망설임은 순위만 늦출 뿐! ⚡
          </p>
        </>
      )}
    </div>
  );
}
