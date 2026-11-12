'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import Header from '@/components/puzzle/header';
import PuzzleLanguageToggle from '@/components/puzzle/language-toggle';
import Footer from '@/components/puzzle/footer';
import SNSBrowserFallback from '@/components/puzzle/sns-browser-fallback';
import { useExternalBrowser } from '@/lib/hooks/use-external-browser';
import '@/styles/puzzle-theme.css';
import { PUZZLE_TRANSLATION_ERROR_COPY } from '@/lib/i18n/puzzle-error-copy';

export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isReady, language, hasTranslationError, retryTranslations } = useLanguage();
  const isPlayPage = pathname?.includes('/play/') ?? false;
  const errorCopy = PUZZLE_TRANSLATION_ERROR_COPY[language === 'ko' ? 'ko' : 'en'];
  const { isSnsBrowser } = useExternalBrowser();

  // Do not render Korean UI for one frame while restoring the saved English locale.
  if (hasTranslationError) {
    return (
      <div className="puzzle-page min-h-screen flex items-center justify-center p-6" role="alert">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold">{errorCopy.title}</h1>
          <p className="text-sm opacity-75">{errorCopy.description}</p>
          <button type="button" onClick={retryTranslations} className="rounded-xl px-5 py-3 font-semibold bg-blue-500 text-white">{errorCopy.retry}</button>
        </div>
      </div>
    );
  }
  if (!isReady) return <div className="puzzle-page min-h-screen" aria-busy="true" />;

  if (isSnsBrowser) {
    return <div className="puzzle-page"><div className="flex justify-end px-3 py-2 relative z-50"><PuzzleLanguageToggle /></div><SNSBrowserFallback /></div>;
  }

  if (isPlayPage) {
    return (
      <div className="puzzle-page h-screen h-[100dvh] overflow-y-auto overflow-x-hidden landscape:overflow-hidden flex flex-col overscroll-contain">
        <div className="flex-none flex justify-end items-center px-3 py-1.5 border-b relative z-50" style={{ backgroundColor: "var(--puzzle-background)", borderColor: "var(--puzzle-border)" }}><PuzzleLanguageToggle /></div>
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      </div>
    );
  }

  return (
    <div className="puzzle-page">
      <Header />
      <div style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</div>
      <Footer />
    </div>
  );
}
