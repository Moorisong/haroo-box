import React from 'react';
import { Award } from 'lucide-react';

interface AchievementBadgesProps {
  statistics: any;
  completedHistoryLength: number;
}

export function AchievementBadges({ statistics, completedHistoryLength }: AchievementBadgesProps) {
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
        달성 업적 배지
      </p>
      <div className="flex flex-wrap gap-2">
        {statistics?.totalCompleted >= 1 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            🏆 첫 완주 달성
          </span>
        )}
        {statistics?.bestTimeBeginner && statistics.bestTimeBeginner < 600 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            ⚡ 스피드 챌린저
          </span>
        )}
        {statistics?.totalCompleted >= 5 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            🌟 연속 퍼즐러
          </span>
        )}
        {statistics?.bestRank && statistics.bestRank <= 10 && (
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold" style={{ backgroundColor: 'var(--puzzle-secondary)', color: 'var(--puzzle-primary)' }}>
            💎 TOP 10 랭커
          </span>
        )}
        {completedHistoryLength === 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
            아직 획득한 훈장이 없습니다. 퍼즐을 풀고 첫 훈장을 획득하세요!
          </span>
        )}
      </div>
    </div>
  );
}
