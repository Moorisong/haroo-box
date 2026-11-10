'use client';
import { useLanguage } from '@/components/providers/language-provider';
import React from 'react';
import Link from 'next/link';
import { Play, Trophy } from 'lucide-react';

interface HeroActionButtonsProps {
  hasCompleted: boolean;
  showResume: boolean;
  onResume?: () => void;
  progress: number;
  handleOpenModal: () => void;
}

export function HeroActionButtons({
  hasCompleted,
  showResume,
  onResume,
  progress,
  handleOpenModal,
}: HeroActionButtonsProps) {
  const { t } = useLanguage();
  if (hasCompleted && showResume) {
    return (
      <>
        <button
          onClick={onResume}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 text-white puzzle-animate-pulse-glow"
          style={{
            backgroundColor: 'var(--puzzle-primary)',
            fontSize: '15px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <Play size={16} strokeWidth={2.5} />
          {t('puzzle.components.puzzle.hero.action.buttons.001')} ({progress}%)
        </button>

        <Link
          href="/puzzle/ranking"
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center hover:!text-[var(--puzzle-foreground)]"
          style={{
            backgroundColor: 'var(--puzzle-glass-bg)',
            color: 'var(--puzzle-foreground)',
            border: '1px solid var(--puzzle-border)',
            fontSize: '15px',
            fontWeight: 650,
            whiteSpace: 'nowrap',
          }}
        >
          <Trophy size={16} className="inline mr-1" strokeWidth={2.5} />
          {t('puzzle.components.puzzle.hero.action.buttons.002')}
        </Link>

        <button
          onClick={handleOpenModal}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{
            backgroundColor: 'var(--puzzle-glass-bg)',
            color: 'var(--puzzle-foreground)',
            border: '1px solid var(--puzzle-border)',
            fontSize: '15px',
            fontWeight: 650,
            whiteSpace: 'nowrap',
          }}
        >
          {t('puzzle.components.puzzle.hero.action.buttons.003')}
        </button>
      </>
    );
  }

  if (hasCompleted) {
    return (
      <>
        <Link
          href="/puzzle/ranking"
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 text-white hover:!text-white puzzle-animate-pulse-glow"
          style={{
            backgroundColor: 'var(--puzzle-primary)',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          <Trophy size={16} strokeWidth={2.5} />
          {t('puzzle.components.puzzle.hero.action.buttons.004')}
        </Link>

        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{
            backgroundColor: 'var(--puzzle-glass-bg)',
            color: 'var(--puzzle-foreground)',
            border: '1px solid var(--puzzle-border)',
            fontSize: '15px',
            fontWeight: 650,
          }}
        >
          {t('puzzle.components.puzzle.hero.action.buttons.005')}
        </button>
      </>
    );
  }

  if (showResume) {
    return (
      <>
        <button
          onClick={onResume}
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 text-white puzzle-animate-pulse-glow"
          style={{
            backgroundColor: 'var(--puzzle-primary)',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          <Play size={16} strokeWidth={2.5} />
          {t('puzzle.components.puzzle.hero.action.buttons.006')} ({progress}%)
        </button>

        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{
            backgroundColor: 'var(--puzzle-glass-bg)',
            color: 'var(--puzzle-foreground)',
            border: '1px solid var(--puzzle-border)',
            fontSize: '15px',
            fontWeight: 650,
          }}
        >
          {t('puzzle.components.puzzle.hero.action.buttons.007')}
        </button>
      </>
    );
  }

  return (
    <button
      onClick={handleOpenModal}
      className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 text-white puzzle-animate-pulse-glow"
      style={{
        backgroundColor: 'var(--puzzle-primary)',
        fontSize: '15px',
        fontWeight: 700,
      }}
    >
      <Play size={16} strokeWidth={2.5} />
      {t('puzzle.components.puzzle.hero.action.buttons.008')}
    </button>
  );
}
