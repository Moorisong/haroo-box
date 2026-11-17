'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut, getSession } from 'next-auth/react';
import {
  consumeSharedLoginStarted,
  getSharedSessionStatus,
  setSharedSessionCookie,
} from '@/lib/shared-session-cookie';

function notifyNextAuthSessionChanged() {
  const payload = {
    event: 'session',
    data: { trigger: 'getSession' },
    timestamp: Math.floor(Date.now() / 1000),
  };

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('next-auth');
      channel.postMessage(payload);
      channel.close();
    }
  } catch {
    // BroadcastChannel 미지원 환경 무시
  }

  try {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'nextauth.message',
        newValue: JSON.stringify(payload),
      })
    );
  } catch {
    // StorageEvent 생성 불가 환경 무시
  }
}

/**
 * NextAuth와 Supabase는 서로 다른 세션이다.
 * 창/탭 포커스 전환 시 서버 세션을 기준으로 새로고침 없이 즉시 NextAuth 세션과 UI를 동기화한다.
 */
export default function SharedSessionSync() {
  const { status, update } = useSession();
  const router = useRouter();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const syncOnFocus = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        const freshSession = await getSession();
        const hasServerUser = Boolean(freshSession?.user);

        if (status === 'unauthenticated' && hasServerUser) {
          setSharedSessionCookie(true);
          notifyNextAuthSessionChanged();
          await update();
          router.refresh();
        } else if (status === 'authenticated' && !hasServerUser) {
          setSharedSessionCookie(false);
          await signOut({ redirect: false });
          notifyNextAuthSessionChanged();
          router.refresh();
        } else if (status === 'authenticated' && hasServerUser && getSharedSessionStatus() === 'false') {
          // 로그아웃 쿠키가 남아있더라도 서버 세션이 유효하면(새 로그인 직후) 쿠키 상태를 복구
          setSharedSessionCookie(true);
        }
      } catch (error) {
        console.error('창 전환 세션 동기화 오류:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    const scheduleSync = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        void syncOnFocus();
      }, 150);
    };

    if (status === 'authenticated') {
      if (consumeSharedLoginStarted() || getSharedSessionStatus() !== 'true') {
        setSharedSessionCookie(true);
      }
    }

    const handleVisibility = () => {
      if (!document.hidden) scheduleSync();
    };

    window.addEventListener('focus', scheduleSync);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', scheduleSync);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('focus', scheduleSync);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', scheduleSync);
    };
  }, [status, update, router]);

  return null;
}
