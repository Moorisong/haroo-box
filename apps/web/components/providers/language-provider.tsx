'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';

type Language = 'ko' | 'en';
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (ko: string, en: string) => string };
const LanguageContext = createContext<LanguageContextValue>({
  language: 'ko',
  setLanguage: () => {},
  t: (ko) => ko,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>('ko');
  const [messages, setMessages] = useState<Record<string, string>>({});
  useEffect(() => {
    const saved = window.localStorage.getItem('haroo-language');
    const next: Language = saved === 'ko' || saved === 'en'
      ? saved
      : navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
    updateLanguage(next);
    document.documentElement.lang = next;
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setMessages({});
    fetch(`${API_BASE_URL}/api/puzzle/translations?lang=${language}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Translation request failed')))
      .then((result) => { if (result.success && result.locale === language && result.data) setMessages(result.data); })
      .catch((error) => { if (error?.name !== 'AbortError') console.error('Puzzle translations unavailable', error); });
    return () => controller.abort();
  }, [language]);
  const setLanguage = (next: Language) => {
    updateLanguage(next);
    window.localStorage.setItem('haroo-language', next);
    document.documentElement.lang = next;
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: (ko, en) => messages[`${ko}␟${en}`] ?? (language === 'en' ? en : ko) }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
