'use client';

import { useEffect } from 'react';

/**
 * 카카오톡, 인스타그램, 라인 등 모바일 앱 내부(인앱 브라우저)에서 진입 시
 * 자동으로 시스템 외부 기본 브라우저(Safari / Chrome)로 튕겨서 열어주는 자동 리다이렉트 훅
 */
export function useInAppBrowserRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent || '';
    const targetUrl = window.location.href;

    // 1. 카카오톡 인앱 브라우저 감지 시 -> 카카오톡 공식 외부 브라우저 이탈 딥링크
    if (/KAKAOTALK/i.test(userAgent)) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`;
      return;
    }

    // 2. 안드로이드 기반 기타 인앱 브라우저 (인스타그램, 페이스북, 라인 등) -> Android Chrome Intent 오픈
    if (/Android/i.test(userAgent) && /Instagram|FB_IAB|FB4A|FB_MD|Line|NAVER/i.test(userAgent)) {
      const cleanUrl = targetUrl.replace(/^https?:\/\//, '');
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }
  }, []);
}
