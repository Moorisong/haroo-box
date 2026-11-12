'use client';
import { useLanguage } from '@/components/providers/language-provider';
import { puzzleTitle } from '@/lib/puzzle-i18n';

import { Puzzle as PuzzleIcon, Trophy } from 'lucide-react';

interface HistoryEntry {
  puzzleId: string;
  title: string;
  title_en?: string;
  week?: number;
  imageUrl: string;
  difficulty: 'novice' | 'beginner' | 'expert';
  completionTime: number;
  savedAt: string;
  completed: boolean;
  myRank?: number;
}

interface HistoryListProps {
  history: HistoryEntry[];
}

export default function HistoryList({ history }: HistoryListProps) {
  const { language, t } = useLanguage();
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {history.length === 0 ? (
        <div 
          className="rounded-2xl border p-8 text-center font-bold text-sm"
          style={{
            backgroundColor: 'var(--puzzle-glass-bg)',
            borderColor: 'var(--puzzle-border)',
            color: 'var(--puzzle-muted-foreground)'
          }}
        >
          {t('puzzle.components.puzzle.history.list.001')}
        </div>
      ) : (
        history.map((item, idx) => {
          const isRanked = !!item.myRank;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200"
              style={{
                backgroundColor: 'var(--puzzle-glass-bg)',
                borderColor: 'var(--puzzle-border)',
                boxShadow: 'var(--puzzle-shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--puzzle-primary)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = 'var(--puzzle-shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--puzzle-border)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'var(--puzzle-shadow-sm)';
              }}
            >
              {/* Thumbnail */}
              <img
                src={item.imageUrl}
                alt={puzzleTitle({ title: item.title, title_en: item.title_en, week: item.week ?? 0 }, language, t('puzzle.metadata.untranslated_title'))}
                className="w-16 h-12 object-cover rounded-xl flex-shrink-0 border"
                style={{ borderColor: 'var(--puzzle-border)' }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold truncate mb-1" style={{ color: 'var(--puzzle-card-foreground)' }}>
                  {puzzleTitle({ title: item.title, title_en: item.title_en, week: item.week ?? 0 }, language, t('puzzle.metadata.untranslated_title'))}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--puzzle-muted-foreground)' }}>
                  <span>{formatDate(item.savedAt)}</span>
                  <span className="flex items-center gap-1">
                    <PuzzleIcon size={11} /> {item.difficulty === 'novice' ? `${t('puzzle.components.puzzle.history.list.002')} (36 ${t('puzzle.components.puzzle.history.list.003')})` : item.difficulty === 'beginner' ? `${t('puzzle.components.puzzle.history.list.004')} (100 ${t('puzzle.components.puzzle.history.list.005')})` : `${t('puzzle.components.puzzle.history.list.006')} (256 ${t('puzzle.components.puzzle.history.list.007')})`}
                  </span>
                </div>
              </div>

              {/* Record */}
              <div className="flex-shrink-0 text-right">
                <p className="tabular-nums text-sm font-black mb-1" style={{ color: 'var(--puzzle-card-foreground)' }}>
                  {formatDuration(item.completionTime)}
                </p>
                {isRanked ? (
                  <div
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: item.myRank! <= 10 ? '#E8F5E9' : 'var(--puzzle-muted)',
                      color: item.myRank! <= 10 ? '#22C55E' : 'var(--puzzle-muted-foreground)',
                    }}
                  >
                    <Trophy size={9} />
                    <span>{t('puzzle.components.puzzle.history.list.008')} {item.myRank}</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--puzzle-muted)', color: 'var(--puzzle-muted-foreground)' }}>
                    {t('puzzle.components.puzzle.history.list.009')}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
