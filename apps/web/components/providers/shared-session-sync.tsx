'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  consumeSharedLoginStarted,
  getSharedSessionStatus,
  setSharedSessionCookie,
} from '@/lib/shared-session-cookie';

/**
 * NextAuth와 Supabase는 서로 다른 세션이다.
 * 공유 쿠키는 로그아웃 신호일 뿐이며, 실제 NextAuth 세션도 종료해야 한다.
 */
export default function SharedSessionSync() {
  const { status } = useSession();
  const isSigningOutRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const checkRemoteLogout = () => {
      if (isSigningOutRef.current || getSharedSessionStatus() !== 'false') return;
      isSigningOutRef.current = true;
      void signOut({ callbackUrl: window.location.pathname + window.location.search })
        .catch(error => {
          console.error('다른 서비스 로그아웃 동기화 실패:', error);
          isSigningOutRef.current = false;
        });
    };

    // A fresh OAuth login may legitimately supersede an earlier logout marker.
    // Existing sessions must NOT overwrite it on mount or when returning to a tab.
    if (consumeSharedLoginStarted()) {
      setSharedSessionCookie(true);
    } else {
      checkRemoteLogout();
      if (!isSigningOutRef.current && getSharedSessionStatus() === null) {
        // Initial rollout / pre-existing session without a shared flag.
        setSharedSessionCookie(true);
      }
    }

    const handleVisibility = () => {
      if (!document.hidden) checkRemoteLogout();
    };
    const handlePageShow = () => checkRemoteLogout();
    window.addEventListener('focus', checkRemoteLogout);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('focus', checkRemoteLogout);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [status]);

  return null;
}
