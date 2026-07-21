'use client';

import { useState, useEffect } from 'react';

const SNS_BROWSER_KEYWORDS = ['instagram', 'fbav', 'fban', 'twitter'];
const KAKAO_KEYWORD = 'kakaotalk';
const LINE_KEYWORD = 'line';
const LINE_EXTERNAL_PARAM = 'openExternalBrowser=1';

export function useExternalBrowser() {
  const [isSnsBrowser, setIsSnsBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const currentUrl = window.location.href;

    // 1. 카카오톡 강제 리다이렉트
    if (userAgent.includes(KAKAO_KEYWORD)) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
      return;
    }

    // 2. 라인 강제 리다이렉트
    if (userAgent.includes(LINE_KEYWORD)) {
      if (!currentUrl.includes(LINE_EXTERNAL_PARAM)) {
        window.location.href = currentUrl + (currentUrl.includes('?') ? '&' : '?') + LINE_EXTERNAL_PARAM;
      }
      return;
    }

    // 3. 인스타그램, 페이스북 등 자동 탈출 불가 SNS 감지
    const isSns = SNS_BROWSER_KEYWORDS.some((keyword) => userAgent.includes(keyword));
    if (isSns) {
      setIsSnsBrowser(true);
    }
  }, []);

  return { isSnsBrowser };
}
