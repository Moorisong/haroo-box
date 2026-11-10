'use client';
import { useLanguage } from '@/components/providers/language-provider';

interface StatsCardProps {
  participantCount: number;
  totalPlayCount: number;
  totalPuzzles: number;
  completionRate: string;
}

export default function StatsCard({ 
  participantCount, 
  totalPlayCount, 
  totalPuzzles, 
  completionRate 
}: StatsCardProps) {
  const { t } = useLanguage();
  const stats = [
    { label: t('주간 퍼즐 완성', 'Weekly completions'), value: `${participantCount.toLocaleString()} ${t('명', 'players')}` },
    { label: t('누적 플레이 수', 'Total plays'), value: `${totalPlayCount.toLocaleString()} ${t('회', 'plays')}` },
    { label: t('아카이브 퍼즐', 'Archived puzzles'), value: `${totalPuzzles} ${t('개', 'puzzles')}` },
    { label: t('평균 퍼즐 완성률', 'Average completion rate'), value: completionRate },
  ];

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--puzzle-glass-bg)',
        backdropFilter: 'var(--puzzle-glass-blur)',
        borderColor: 'var(--puzzle-border)',
        boxShadow: 'var(--puzzle-shadow-sm)',
      }}
    >
      <p className="text-xs font-bold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
        {t('서비스 현황', 'Service overview')}
      </p>

      <div className="flex flex-col gap-1.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between py-2 border-b last:border-0"
            style={{ borderColor: 'var(--puzzle-border)' }}
          >
            <span className="text-sm font-semibold animate-fade-in-up" style={{ color: 'var(--puzzle-muted-foreground)' }}>
              {stat.label}
            </span>
            <span
              className="text-sm font-extrabold"
              style={{ color: 'var(--puzzle-card-foreground)' }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
