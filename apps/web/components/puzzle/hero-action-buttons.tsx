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
          {t('이어하기', 'Resume')} ({progress}%)
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
          {t('결과 및 랭킹 보기', 'Results & rankings')}
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
          {t('새로 도전하기', 'Try again')}
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
          {t('결과 및 랭킹 보기', 'Results & rankings')}
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
          {t('다시 도전하기', 'Try again')}
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
          {t('이어하기', 'Resume')} ({progress}%)
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
          {t('새로 시작하기', 'Start over')}
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
      {t('퍼즐 시작하기', 'Start puzzle')}
    </button>
  );
}
