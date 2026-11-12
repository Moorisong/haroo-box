'use client';
import { useLanguage } from '@/components/providers/language-provider';

interface ConfirmRestartModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmRestartModal({
  onClose,
  onConfirm,
}: ConfirmRestartModalProps) {
  const { t } = useLanguage();
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div 
        className="relative w-full max-w-sm min-w-0 max-h-[calc(100dvh-24px)] overflow-y-auto rounded-3xl border p-4 sm:p-6 md:p-8"
        style={{
          backgroundColor: 'var(--puzzle-background)',
          borderColor: 'var(--puzzle-border)',
          boxShadow: 'var(--puzzle-shadow-lg)',
          animation: 'puzzle-modal-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        <h3 className="text-lg sm:text-xl font-black mb-3 text-red-500 flex items-center gap-2 leading-tight">
          {t('puzzle.components.puzzle.confirm.restart.modal.001')}
        </h3>
        <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: 'var(--puzzle-muted-foreground)' }}>
          {t('puzzle.components.puzzle.confirm.restart.modal.002')} <strong className="text-red-500 font-bold">{t('puzzle.components.puzzle.confirm.restart.modal.003')}</strong>{t('puzzle.components.puzzle.confirm.restart.modal.004')}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="min-w-0 px-1 py-3 rounded-xl border font-bold text-xs sm:text-sm transition-colors hover:bg-zinc-50 active:bg-zinc-100"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--puzzle-foreground)',
              borderColor: 'var(--puzzle-border)',
            }}
          >
            {t('puzzle.components.puzzle.confirm.restart.modal.005')}
          </button>
          <button
            onClick={onConfirm}
            className="min-w-0 px-1 py-3 rounded-xl text-white font-black text-xs sm:text-sm bg-red-500 hover:bg-red-600 transition-colors"
            style={{
              boxShadow: 'var(--puzzle-shadow-md)',
            }}
          >
            {t('puzzle.components.puzzle.confirm.restart.modal.006')}
          </button>
        </div>
      </div>
    </div>
  );
}
