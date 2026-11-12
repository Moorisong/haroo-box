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
    { label: t('puzzle.components.puzzle.stats.card.001'), value: `${participantCount.toLocaleString()} ${t('puzzle.components.puzzle.stats.card.002')}` },
    { label: t('puzzle.components.puzzle.stats.card.003'), value: `${totalPlayCount.toLocaleString()} ${t('puzzle.components.puzzle.stats.card.004')}` },
    { label: t('puzzle.components.puzzle.stats.card.005'), value: `${totalPuzzles} ${t('puzzle.components.puzzle.stats.card.006')}` },
    { label: t('puzzle.components.puzzle.stats.card.007'), value: completionRate },
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
        {t('puzzle.components.puzzle.stats.card.008')}
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
