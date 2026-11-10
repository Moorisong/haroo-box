'use client';
import { useLanguage } from '@/components/providers/language-provider';
import React from 'react';
import { Award } from 'lucide-react';

interface AchievementBadgesProps {
  statistics: any;
  completedHistoryLength: number;
}

export function AchievementBadges({ statistics, completedHistoryLength }: AchievementBadgesProps) {
  const { t } = useLanguage();
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: 'var(--puzzle-glass-bg)',
        backdropFilter: 'var(--puzzle-glass-blur)',
        borderColor: 'var(--puzzle-border)',
        boxShadow: 'var(--puzzle-shadow-sm)',
      }}
    >
      <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--puzzle-card-foreground)' }}>
        <Award size={15} style={{ color: 'var(--puzzle-primary)' }} />
        {t('달성 업적 배지', 'Achievements')}
      </p>
      <div className="flex flex-wrap gap-2">
        {statistics?.totalCompleted >= 1 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('🏆 첫 완주 달성', '🏆 First puzzle completed')}
          </span>
        )}
        {statistics?.bestTimeBeginner && statistics.bestTimeBeginner < 600 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('⚡ 스피드 챌린저', '⚡ Speed challenger')}
          </span>
        )}
        {statistics?.totalCompleted >= 5 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('🌟 연속 퍼즐러', '🌟 Puzzle streak')}
          </span>
        )}
        {statistics?.bestRank && statistics.bestRank <= 10 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('💎 TOP 10 랭커', '💎 Top 10 ranker')}
          </span>
        )}
        {completedHistoryLength === 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
            {t('아직 획득한 훈장이 없습니다. 퍼즐을 풀고 첫 훈장을 획득하세요!', 'No badges yet. Finish a puzzle to earn your first!')}
          </span>
        )}
      </div>
    </div>
  );
}
