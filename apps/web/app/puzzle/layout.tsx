'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import Header from '@/components/puzzle/header';
import PuzzleLanguageToggle from '@/components/puzzle/language-toggle';
import Footer from '@/components/puzzle/footer';
import SNSBrowserFallback from '@/components/puzzle/sns-browser-fallback';
import { useExternalBrowser } from '@/lib/hooks/use-external-browser';
import '@/styles/puzzle-theme.css';

export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isReady, language, hasTranslationError, translationErrorDetail, retryTranslations } = useLanguage();
  const isPlayPage = pathname?.includes('/play/') ?? false;
  const { isSnsBrowser } = useExternalBrowser();

  // Do not render Korean UI for one frame while restoring the saved English locale.
  if (hasTranslationError) {
    return (
      <div className="puzzle-page min-h-screen flex items-center justify-center p-6" role="alert">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold">{language === 'ko' ? '퍼즐 번역을 불러오지 못했어요' : 'Puzzle translations are unavailable'}</h1>
          <p className="text-sm opacity-75">{language === 'ko' ? '잠시 후 다시 시도해 주세요. 문제가 계속되면 서버 상태를 확인해 주세요.' : 'Please try again. If the problem continues, check the API server.'}</p>
          <p className="text-xs opacity-60 break-all" aria-label="Technical details">{translationErrorDetail}</p>
          <button type="button" onClick={retryTranslations} className="rounded-xl px-5 py-3 font-semibold bg-blue-500 text-white">{language === 'ko' ? '다시 시도' : 'Retry'}</button>
        </div>
      </div>
    );
  }
  if (!isReady) return <div className="puzzle-page min-h-screen" aria-busy="true" />;

  if (isSnsBrowser) {
    return <div className="puzzle-page"><div style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000 }}><PuzzleLanguageToggle /></div><SNSBrowserFallback /></div>;
  }

  if (isPlayPage) {
    return (
      <div className="puzzle-page h-screen h-[100dvh] overflow-hidden flex flex-col">
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000 }}><PuzzleLanguageToggle /></div>
        {children}
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
