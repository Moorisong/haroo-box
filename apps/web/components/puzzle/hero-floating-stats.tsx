'use client';
import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
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
  const { t } = useLanguage();
  const difficulty = (value?: string | null) => value === 'novice' ? t('puzzle.components.puzzle.hero.floating.stats.001') : value === 'expert' ? t('puzzle.components.puzzle.hero.floating.stats.002') : t('puzzle.components.puzzle.hero.floating.stats.003');
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
            <span>{t('puzzle.components.puzzle.hero.floating.stats.004')} ({difficulty(completedDifficulty)})</span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold text-emerald-700">
            {t('puzzle.components.puzzle.hero.floating.stats.005')}
          </p>
        </>
      ) : hasSavedGame && savedDifficulty && !isSavedDifficultyCompleted ? (
        <>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--puzzle-primary)' }}>
            <Layers size={13} />
            <span>{t('puzzle.components.puzzle.hero.floating.stats.006')} ({difficulty(savedDifficulty)})</span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold" style={{ color: 'var(--puzzle-card-foreground)' }}>
            {matchedPieces} / {totalPieces} {t('puzzle.components.puzzle.hero.floating.stats.007')}
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--puzzle-primary)' }}>
            <Trophy size={13} />
            <span>{t('puzzle.components.puzzle.hero.floating.stats.008')}</span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold" style={{ color: 'var(--puzzle-card-foreground)' }}>
            {t('puzzle.components.puzzle.hero.floating.stats.009')}
          </p>
        </>
      )}
    </div>
  );
}
