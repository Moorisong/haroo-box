'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ko' | 'en';
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (ko: string, en: string) => string };
const LanguageContext = createContext<LanguageContextValue>({
  language: 'ko',
  setLanguage: () => {},
  t: (ko) => ko,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>('ko');
  useEffect(() => {
    const saved = window.localStorage.getItem('haroo-language');
    const next: Language = saved === 'ko' || saved === 'en'
      ? saved
      : navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
    updateLanguage(next);
    document.documentElement.lang = next;
  }, []);
  const setLanguage = (next: Language) => {
    updateLanguage(next);
    window.localStorage.setItem('haroo-language', next);
    document.documentElement.lang = next;
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: (ko, en) => language === 'en' ? en : ko }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
