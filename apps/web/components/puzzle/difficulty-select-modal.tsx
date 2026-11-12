'use client';
import { useLanguage } from '@/components/providers/language-provider';

import { Play, Layers, Trophy, X, Flame, AlertTriangle } from 'lucide-react';
import { PUZZLE_DIFFICULTY, PUZZLE_PIECE_COUNT } from '@/constants/puzzle';

interface DifficultySelectModalProps {
  onClose: () => void;
  onLaunch: () => void;
  selectedDiff: 'novice' | 'beginner' | 'expert';
  setSelectedDiff: (diff: 'novice' | 'beginner' | 'expert') => void;
  completedDifficulties?: ('novice' | 'beginner' | 'expert')[];
  isLoggedIn?: boolean;
  showRankedInfo?: boolean;
  showResetWarning?: boolean;
  launchText?: string;
}

export default function DifficultySelectModal({
  onClose,
  onLaunch,
  selectedDiff,
  setSelectedDiff,
  completedDifficulties = [],
  isLoggedIn = true,
  showRankedInfo = false,
  showResetWarning = false,
  launchText,
}: DifficultySelectModalProps) {
  const { t } = useLanguage();
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain px-3 py-[max(16px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))] sm:p-4 animate-fade-in puzzle-page"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', minHeight: '100dvh' }}
    >
      <style>{`
        @media (max-height: 620px) {
          .landscape-short-hide {
            display: none !important;
          }
          .landscape-short-space {
            margin-bottom: 0.75rem !important;
          }
          .landscape-short-padding {
            padding: 1.25rem !important;
          }
        }
        @media (hover: hover) {
          .hover-scale-effect:hover {
            transform: scale(1.01) !important;
          }
        }
        .active-scale-effect-95:active {
          transform: scale(0.95) !important;
        }
        .active-scale-effect-98:active {
          transform: scale(0.98) !important;
        }
      `}</style>
      <div 
        className="relative my-auto w-full max-w-lg min-w-0 shrink-0 rounded-3xl border px-4 py-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(100dvh-64px)] sm:max-h-[calc(100dvh-48px)] overscroll-contain landscape-short-padding"
        style={{
          backgroundColor: 'var(--puzzle-background)',
          borderColor: 'var(--puzzle-border)',
          boxShadow: 'var(--puzzle-shadow-lg)',
          animation: 'puzzle-modal-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6 landscape-short-space">
          <div>
            <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-left whitespace-nowrap" style={{ color: 'var(--puzzle-card-foreground)' }}>
              <Play size={22} className="text-emerald-500 fill-emerald-500/20" />
              {t('puzzle.components.puzzle.difficulty.select.modal.001')}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 shrink-0 rounded-xl transition-colors hover:bg-zinc-100"
            style={{ color: 'var(--puzzle-muted-foreground)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-5 sm:mb-6 landscape-short-space">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-3 flex items-center gap-1.5 landscape-short-space" style={{ color: 'var(--puzzle-muted-foreground)' }}>
            <Layers size={14} style={{ color: 'var(--puzzle-primary)' }} />
            {t('puzzle.components.puzzle.difficulty.select.modal.002')}
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 min-w-0">
            {/* Novice Card */}
            <button
              onClick={() => setSelectedDiff(PUZZLE_DIFFICULTY.NOVICE)}
              className="flex flex-col justify-center items-center text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-200 hover-scale-effect active-scale-effect-95 min-w-0 min-h-[78px] sm:min-h-[88px]"
              style={{
                backgroundColor: selectedDiff === PUZZLE_DIFFICULTY.NOVICE ? 'var(--puzzle-secondary)' : 'var(--puzzle-glass-bg)',
                borderColor: selectedDiff === PUZZLE_DIFFICULTY.NOVICE ? 'var(--puzzle-primary)' : 'var(--puzzle-border)',
              }}
            >
              <div className="flex flex-col items-center justify-center w-full gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-black whitespace-nowrap leading-tight" style={{ color: selectedDiff === PUZZLE_DIFFICULTY.NOVICE ? 'var(--puzzle-primary)' : 'var(--puzzle-card-foreground)' }}>
                  {t('puzzle.components.puzzle.difficulty.select.modal.003')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-1 rounded-full bg-blue-500/10 text-blue-600 inline-flex justify-center items-center whitespace-nowrap max-w-full">
                  <span>{PUZZLE_PIECE_COUNT[PUZZLE_DIFFICULTY.NOVICE]} {t('puzzle.components.puzzle.difficulty.select.modal.004')}</span>
                </span>
              </div>
            </button>

            {/* Beginner Card */}
            <button
              onClick={() => setSelectedDiff(PUZZLE_DIFFICULTY.BEGINNER)}
              className="flex flex-col justify-center items-center text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-200 hover-scale-effect active-scale-effect-95 min-w-0 min-h-[78px] sm:min-h-[88px]"
              style={{
                backgroundColor: selectedDiff === PUZZLE_DIFFICULTY.BEGINNER ? 'var(--puzzle-secondary)' : 'var(--puzzle-glass-bg)',
                borderColor: selectedDiff === PUZZLE_DIFFICULTY.BEGINNER ? 'var(--puzzle-primary)' : 'var(--puzzle-border)',
              }}
            >
              <div className="flex flex-col items-center justify-center w-full gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-black whitespace-nowrap leading-tight" style={{ color: selectedDiff === PUZZLE_DIFFICULTY.BEGINNER ? 'var(--puzzle-primary)' : 'var(--puzzle-card-foreground)' }}>
                  {t('puzzle.components.puzzle.difficulty.select.modal.005')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 inline-flex justify-center items-center whitespace-nowrap max-w-full">
                  <span>{PUZZLE_PIECE_COUNT[PUZZLE_DIFFICULTY.BEGINNER]} {t('puzzle.components.puzzle.difficulty.select.modal.006')}</span>
                </span>
              </div>
            </button>

            {/* Expert Card */}
            <button
              onClick={() => setSelectedDiff(PUZZLE_DIFFICULTY.EXPERT)}
              className="flex flex-col justify-center items-center text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-200 hover-scale-effect active-scale-effect-95 min-w-0 min-h-[78px] sm:min-h-[88px]"
              style={{
                backgroundColor: selectedDiff === PUZZLE_DIFFICULTY.EXPERT ? 'var(--puzzle-secondary)' : 'var(--puzzle-glass-bg)',
                borderColor: selectedDiff === PUZZLE_DIFFICULTY.EXPERT ? 'var(--puzzle-primary)' : 'var(--puzzle-border)',
              }}
            >
              <div className="flex flex-col items-center justify-center w-full gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-black whitespace-nowrap leading-tight" style={{ color: selectedDiff === PUZZLE_DIFFICULTY.EXPERT ? 'var(--puzzle-primary)' : 'var(--puzzle-card-foreground)' }}>
                  {t('puzzle.components.puzzle.difficulty.select.modal.007')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 inline-flex justify-center items-center whitespace-nowrap max-w-full">
                  <span>{PUZZLE_PIECE_COUNT[PUZZLE_DIFFICULTY.EXPERT]} {t('puzzle.components.puzzle.difficulty.select.modal.008')}</span>
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Ranked Mode Info (Hero Section) */}
        {showRankedInfo && (
          <div className="mb-5 sm:mb-6 flex items-start gap-3 p-3 sm:p-4 rounded-2xl border landscape-short-hide landscape-short-space" style={{ backgroundColor: 'var(--puzzle-secondary)', borderColor: 'var(--puzzle-primary)' }}>
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--puzzle-primary)', color: '#fff' }}
            >
              <Trophy size={18} />
            </div>
            <div className="flex-1 min-w-0">
              {completedDifficulties.includes(selectedDiff) ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black leading-snug" style={{ color: 'var(--puzzle-card-foreground)' }}>
                      {t('puzzle.components.puzzle.difficulty.select.modal.009')}
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-1 leading-relaxed break-words" style={{ color: 'var(--puzzle-muted-foreground)' }}>
                    {t('puzzle.components.puzzle.difficulty.select.modal.010')}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black leading-snug" style={{ color: 'var(--puzzle-card-foreground)' }}>
                      {t('puzzle.components.puzzle.difficulty.select.modal.011')}
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-1 leading-relaxed break-words" style={{ color: 'var(--puzzle-muted-foreground)' }}>
                    {t('puzzle.components.puzzle.difficulty.select.modal.012')}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Warning for unauthenticated user */}
        {showRankedInfo && !isLoggedIn && (
          <div 
            className="mb-6 px-4 py-3 rounded-2xl text-xs font-bold leading-relaxed border flex items-start gap-2 landscape-short-space"
            style={{ backgroundColor: 'var(--puzzle-destructive-bg, #FEF2F2)', borderColor: 'var(--puzzle-destructive, #FEE2E2)', color: '#DC2626' }}
          >
            <Flame size={16} className="flex-shrink-0 mt-0.5" />
            <span>
              {t('puzzle.components.puzzle.difficulty.select.modal.013')}
            </span>
          </div>
        )}

        {/* Warning for Reset Game (Archive Card) */}
        {showResetWarning && (
          <div 
            className="mb-6 px-4 py-3 rounded-2xl text-xs font-bold text-left leading-relaxed border flex items-start gap-2"
            style={{ backgroundColor: 'var(--puzzle-destructive-bg, #FEF2F2)', borderColor: 'var(--puzzle-destructive, #FEE2E2)', color: '#DC2626' }}
          >
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span>
              {t('puzzle.components.puzzle.difficulty.select.modal.014')}
            </span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full order-1 py-3 rounded-xl border font-bold text-xs sm:text-sm whitespace-nowrap transition-colors hover:bg-zinc-50 active:bg-zinc-100"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--puzzle-foreground)',
              borderColor: 'var(--puzzle-border)',
            }}
          >
            {t('puzzle.components.puzzle.difficulty.select.modal.015')}
          </button>
          <button
            onClick={onLaunch}
            className="w-full order-2 py-3 rounded-xl text-white font-black text-xs sm:text-sm whitespace-nowrap transition-all duration-200 hover-scale-effect active-scale-effect-98"
            style={{
              backgroundColor: 'var(--puzzle-primary)',
              boxShadow: 'var(--puzzle-shadow-md)',
            }}
          >
            {launchText ?? t('puzzle.components.puzzle.difficulty.select.modal.016')}
          </button>
        </div>
      </div>
    </div>
  );
}
