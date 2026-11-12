'use client';
import { useLanguage } from '@/components/providers/language-provider';
export default function PuzzleLanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const switchLabel = language === 'ko' ? t('puzzle.ui.switchToEnglish') : t('puzzle.ui.switchToKorean');
  return (
    <button type="button" aria-label={switchLabel} title={switchLabel}
      onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
      style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 42, height: 32, padding: '0 9px', border: '1px solid #a8bce6', borderRadius: 9, background: '#fff', color: '#24469d', fontSize: 12, fontWeight: 850, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,.08)' }}>
      {language === 'ko' ? 'EN' : 'KO'}
    </button>
  );
}
