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
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: TranslationVariables) => string;
};
const LanguageContext = createContext<LanguageContextValue>({
  language: 'ko',
  isReady: false,
  hasTranslationError: false,
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
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = window.localStorage.getItem('haroo-language');
    const next: Language = saved === 'ko' || saved === 'en'
      ? saved
      : navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
    updateLanguage(next);
    document.documentElement.lang = next;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !inPuzzle) return;
    const controller = new AbortController();
    setLoadedLanguage(null);
    setHasTranslationError(false);
    setMessages({});
    fetch(`${API_BASE_URL}/api/puzzle/translations?lang=${language}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Translations request failed')))
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
        setHasTranslationError(true);
      });
    return () => controller.abort();
  }, [hydrated, inPuzzle, language]);

  const setLanguage = (next: Language) => {
    updateLanguage(next);
    window.localStorage.setItem('haroo-language', next);
    document.documentElement.lang = next;
  };

  const t = (key: string, variables?: TranslationVariables) => {
    const translated = messages[key];
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
      hasTranslationError, setLanguage, t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
