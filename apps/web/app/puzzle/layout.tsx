'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/puzzle/header';
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
  const isPlayPage = pathname?.includes('/play/') ?? false;
  const { isSnsBrowser } = useExternalBrowser();

  if (isSnsBrowser) {
    return <SNSBrowserFallback />;
  }

  if (isPlayPage) {
    return (
      <div className="puzzle-page h-screen h-[100dvh] overflow-hidden flex flex-col">
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
