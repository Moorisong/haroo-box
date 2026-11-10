'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

import { ROUTES } from '@/constants';
import { setSharedSessionCookie } from '@/lib/shared-session-cookie';

import styles from './nav-bar.module.css';

interface NavLinkItem {
  label: string;
  href: string;
  newTab?: boolean;
}

// The single ordered source for both desktop and mobile content menus.
// Match the homepage cards exactly, including the external 감쓰.exe link.
const CONTENT_MENU_LINKS: readonly NavLinkItem[] = [
  { label: '어드벤트 초콜릿', href: ROUTES.ADVENT, newTab: true },
  { label: '감쓰.exe', href: ROUTES.GAMSS, newTab: true },
  { label: '하루퍼즐', href: ROUTES.PUZZLE, newTab: true },
  { label: '롤링페이퍼', href: ROUTES.ROLLING_PAPER, newTab: true },
  { label: 'TOBY', href: ROUTES.TOBY, newTab: true },
  { label: '너잘알', href: ROUTES.U_KNOW },
  { label: '자아탐험', href: ROUTES.HTSM },
] as const;

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isContentsActive = CONTENT_MENU_LINKS.some(link => pathname === link.href);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    closeMenu();
    try {
      const { clearAllPuzzleState } = await import('@/lib/puzzle-db');
      await clearAllPuzzleState();
    } catch (e) {
      console.error('Failed to clear puzzle state on signout:', e);
    }
    // 자아탐험 관련 페이지에서 로그아웃 시 자아탐험 랜딩 페이지로 이동
    const redirectUrl = pathname.startsWith('/htsm') ? '/htsm' : pathname;
    try {
      await signOut({ redirect: false, callbackUrl: redirectUrl });
      setSharedSessionCookie(false);
      window.location.assign(redirectUrl);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // Toby 및 puzzle 서비스에서는 헤더를 보이지 않게 처리
  if (pathname.startsWith('/toby') || pathname.startsWith('/puzzle')) {
    return null;
  }

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <img src="/logo.png" alt="Logo" className={styles.logoIcon} />
            <span className={styles.logoText}>하루상자</span>
          </Link>

          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="메뉴 열기"
            aria-expanded={isMenuOpen}
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`} />
          </button>

          <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
            {/* PC: Dropdown Menu */}
            <li
              className={`${styles.dropdownContainer} ${styles.desktopOnly}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`${styles.navLink} ${styles.dropdownToggle} ${isContentsActive ? styles.active : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                콘텐츠 <span className={`${styles.arrow} ${isDropdownOpen ? styles.arrowRotate : ''}`}>▾</span>
              </button>
              <ul className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                {CONTENT_MENU_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.dropdownItem} ${pathname === link.href ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        closeMenu();
                        setIsDropdownOpen(false);
                      }}
                      {...(link.newTab || link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Mobile: Linear List */}
            {CONTENT_MENU_LINKS.map((link) => (
              <li key={link.href} className={styles.mobileOnly}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                  onClick={closeMenu}
                  {...(link.newTab || link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className={styles.authItem}>
              {status === 'loading' ? (
                <span className={styles.authLoading}>...</span>
              ) : session ? (
                <div className={styles.userMenu}>
                  <button onClick={handleSignOut} className={styles.logoutButton}>
                    로그아웃
                  </button>
                </div>

              ) : (
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                  className={styles.loginButton}
                  onClick={closeMenu}
                >
                  로그인
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}


