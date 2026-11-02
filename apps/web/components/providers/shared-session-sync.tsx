'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  getSharedSessionStatus,
  setSharedSessionCookie,
} from '@/lib/shared-session-cookie';

/**
 * 하루상자 <-> 감쓰 간 실시간 싱글 로그아웃(SLO) 동기화 컴포넌트
 * 다른 서브도메인에서 로그아웃 시(쿠키 haroo_session_active=false),
 * 현재 탭에서도 자동으로 세션을 종료한다.
 */
export default function SharedSessionSync() {
  const { status } = useSession();
  const isSigningOutRef = useRef(false);

  useEffect(() => {
    // 로그인 상태가 확인되면 서브도메인 공용 쿠키를 'true'로 즉시 보장
    if (status === 'authenticated') {
      setSharedSessionCookie(true);
    }

    // 다른 서브도메인(예: 감쓰) 탭에서 로그아웃하고 돌아왔을 때(focus)만 동기화
    const handleFocus = () => {
      if (status === 'authenticated') {
        const sharedStatus = getSharedSessionStatus();
        // 쿠키가 명시적으로 false이거나, 공용 활성 쿠키가 아예 사라졌을 때 로그아웃 동기화
        if (sharedStatus === 'false' && !isSigningOutRef.current) {
          isSigningOutRef.current = true;
          setSharedSessionCookie(false);
          signOut({ callbackUrl: window.location.pathname });
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [status]);

  return null;
}
