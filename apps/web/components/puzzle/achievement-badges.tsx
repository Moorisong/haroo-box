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
        {t('puzzle.components.puzzle.achievement.badges.001')}
      </p>
      <div className="flex flex-wrap gap-2">
        {statistics?.totalCompleted >= 1 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('puzzle.components.puzzle.achievement.badges.002')}
          </span>
        )}
        {statistics?.bestTimeBeginner && statistics.bestTimeBeginner < 600 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('puzzle.components.puzzle.achievement.badges.003')}
          </span>
        )}
        {statistics?.totalCompleted >= 5 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('puzzle.components.puzzle.achievement.badges.004')}
          </span>
        )}
        {statistics?.bestRank && statistics.bestRank <= 10 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            {t('puzzle.components.puzzle.achievement.badges.005')}
          </span>
        )}
        {completedHistoryLength === 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
            {t('puzzle.components.puzzle.achievement.badges.006')}
          </span>
        )}
      </div>
    </div>
  );
}
