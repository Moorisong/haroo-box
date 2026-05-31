'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/puzzle/header';
import Footer from '@/components/puzzle/footer';
import '@/styles/puzzle-theme.css';

export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPlayPage = pathname.includes('/play/');

  return (
    <div className="puzzle-page">
      {!isPlayPage && <Header />}
      <div style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</div>
      {!isPlayPage && <Footer />}
    </div>
  );
}
