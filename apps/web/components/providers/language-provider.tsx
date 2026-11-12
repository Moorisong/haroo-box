'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { API_BASE_URL } from '@/constants';

export type Language = 'ko' | 'en';
type TranslationVariables = Record<string, string | number>;
type LanguageContextValue = {
  language: Language;
  isReady: boolean;
  hasTranslationError: boolean;
  translationErrorDetail: string | null;
  retryTranslations: () => void;
  setLanguage: (language: Language) => void;
  t: (key: string, variablesOrEnglish?: TranslationVariables | string) => string;
};
const LanguageContext = createContext<LanguageContextValue>({
  language: 'ko',
  isReady: false,
  hasTranslationError: false,
  translationErrorDetail: null,
  retryTranslations: () => {},
  setLanguage: () => {},
  t: () => '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inPuzzle = pathname?.startsWith('/puzzle') ?? false;
  const [language, updateLanguage] = useState<Language>('ko');
  const [hydrated, setHydrated] = useState(false);
  const [loadedLanguage, setLoadedLanguage] = useState<Language | null>(null);
  const [hasTranslationError, setHasTranslationError] = useState(false);
  const [translationErrorDetail, setTranslationErrorDetail] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem('haroo-language'); } catch { /* Storage may be blocked. */ }
    const next: Language = saved === 'ko' || saved === 'en'
      ? saved
      : navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
    updateLanguage(next);
    document.documentElement.lang = next;
    document.cookie = `haroo-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !inPuzzle) return;
    const controller = new AbortController();
    setLoadedLanguage(null);
    setHasTranslationError(false);
    setTranslationErrorDetail(null);
    setMessages({});
    fetch(`${API_BASE_URL}/api/puzzle/translations?lang=${language}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`Translation API returned HTTP ${res.status}`)))
      .then(result => {
        if (!result.success || result.locale !== language || !result.data || Object.keys(result.data).length === 0) {
          throw new Error('Puzzle locale database is missing translations');
        }
        if (!controller.signal.aborted) {
          setMessages(result.data);
          setLoadedLanguage(language);
        }
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        console.error('Puzzle translations could not be loaded:', error);
        setTranslationErrorDetail(error instanceof Error ? error.message : 'Unknown translation error');
        setHasTranslationError(true);
      });
    return () => controller.abort();
  }, [hydrated, inPuzzle, language, retryCount]);

  const setLanguage = (next: Language) => {
    updateLanguage(next);
    try { window.localStorage.setItem('haroo-language', next); } catch { /* Cookie still preserves preference. */ }
    document.documentElement.lang = next;
    document.cookie = `haroo-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  const t = (key: string, variablesOrEnglish?: TranslationVariables | string) => {
    // Legacy Haroo Box pages outside /puzzle keep their own inline bilingual copy.
    if (!inPuzzle) return language === 'en' && typeof variablesOrEnglish === 'string' ? variablesOrEnglish : key;
    const variables = typeof variablesOrEnglish === 'object' ? variablesOrEnglish : undefined;
    const translated = Object.prototype.hasOwnProperty.call(messages, key) ? messages[key] : undefined;
    if (!translated) {
      if (loadedLanguage === language) console.error('Missing puzzle translation key:', key, language);
      return '';
    }
    return translated.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, name: string) =>
      variables?.[name] === undefined ? '' : String(variables[name])
    );
  };

  return (
    <LanguageContext.Provider value={{
      language, isReady: hydrated && (!inPuzzle || loadedLanguage === language),
      hasTranslationError, translationErrorDetail,
      retryTranslations: () => setRetryCount(count => count + 1), setLanguage, t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
