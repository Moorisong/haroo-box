'use client';
import { useLanguage } from '@/components/providers/language-provider';
import PuzzleLanguageToggle from './language-toggle';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Trophy, Archive, User, LogIn, LogOut, Menu, X, Puzzle } from 'lucide-react';
import { setSharedSessionCookie } from '@/lib/shared-session-cookie';

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: t('랭킹', 'Rankings'), href: '/puzzle/ranking', icon: Trophy },
    { label: t('아카이브', 'Archive'), href: '/puzzle/archive', icon: Archive },
    { label: t('마이페이지', 'My Page'), href: '/puzzle/mypage', icon: User },
  ];

  const handleSignOut = async () => {
    setSharedSessionCookie(false);
    try {
      const { clearAllPuzzleState } = await import('@/lib/puzzle-db');
      await clearAllPuzzleState();
    } catch (e) {
      console.error('Failed to clear puzzle state on signout:', e);
    }
    signOut({ callbackUrl: '/puzzle' });
  };

  return (
    <header
      className="sticky top-0 z-50 h-16 border-b border-border"
      style={{ 
        backgroundColor: 'var(--puzzle-glass-bg)',
        backdropFilter: 'var(--puzzle-glass-blur)',
        WebkitBackdropFilter: 'var(--puzzle-glass-blur)',
        borderBottom: '1px solid var(--puzzle-border)',
        boxShadow: 'var(--puzzle-shadow-sm)'
      }}
    >
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo & Sub Link */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/puzzle" className="flex items-center gap-2 group min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--puzzle-primary)' }}
            >
              <Puzzle size={16} color="white" strokeWidth={2.5} />
            </div>
            <span
              className="text-base sm:text-lg tracking-tight font-extrabold whitespace-nowrap"
              style={{ color: 'var(--puzzle-card-foreground)' }}
            >
              {t('하루퍼즐', 'Haroo Puzzle')}
            </span>
          </Link>
          <div className="w-px h-3.5" style={{ backgroundColor: 'var(--puzzle-border)' }} />
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs font-semibold hover:text-[var(--puzzle-primary)] transition-colors flex items-center gap-0.5 whitespace-nowrap"
            style={{ color: 'var(--puzzle-muted-foreground)' }}
          >
            <span>{t('하루상자', 'Haroo Box')}</span>
            <span className="text-[10px] opacity-70">↗</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold"
                style={{
                  color: isActive ? 'var(--puzzle-primary)' : 'var(--puzzle-muted-foreground)',
                  backgroundColor: isActive ? 'var(--puzzle-secondary)' : 'transparent',
                }}
              >
                <Icon size={15} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            );
          })}

          <div
            className="w-px h-5 mx-2"
            style={{ backgroundColor: 'var(--puzzle-border)' }}
          />

          {status === 'loading' ? (
            <div className="w-20 h-8 rounded-lg bg-zinc-200 animate-pulse" />
          ) : session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-bold"
              style={{
                backgroundColor: 'var(--puzzle-muted)',
                color: 'var(--puzzle-foreground)',
              }}
            >
              <LogOut size={15} strokeWidth={2} />
              <span>{t('로그아웃', 'Log out')}</span>
            </button>
          ) : (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-bold"
              style={{
                backgroundColor: 'var(--puzzle-primary)',
                color: 'var(--puzzle-primary-foreground)',
              }}
            >
              <LogIn size={15} strokeWidth={2} />
              <span>{t('로그인', 'Log in')}</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2"><PuzzleLanguageToggle />
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--puzzle-foreground)' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button></div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 border-b border-border shadow-lg"
          style={{ 
            backgroundColor: 'var(--puzzle-background)',
            borderBottom: '1px solid var(--puzzle-border)'
          }}
        >
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-semibold"
                  style={{
                    color: isActive ? 'var(--puzzle-primary)' : 'var(--puzzle-foreground)',
                    backgroundColor: isActive ? 'var(--puzzle-secondary)' : 'transparent',
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{label}</span>
                </Link>
              );
            })}
            
            <div className="w-full h-px my-1" style={{ backgroundColor: 'var(--puzzle-border)' }} />

            {session ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left font-bold text-sm"
                style={{ backgroundColor: 'var(--puzzle-muted)', color: 'var(--puzzle-foreground)' }}
              >
                <LogOut size={18} strokeWidth={2} />
                <span>{t('로그아웃', 'Log out')}</span>
              </button>
            ) : (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full font-bold text-sm"
                style={{ backgroundColor: 'var(--puzzle-primary)', color: 'var(--puzzle-primary-foreground)' }}
              >
                <LogIn size={18} strokeWidth={2} />
                <span>{t('로그인', 'Log in')}</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
