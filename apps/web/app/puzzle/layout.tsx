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
  const { isReady } = useLanguage();
  const isPlayPage = pathname?.includes('/play/') ?? false;
  const { isSnsBrowser } = useExternalBrowser();

  // Do not render Korean UI for one frame while restoring the saved English locale.
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
