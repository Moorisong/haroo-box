import { useState, useEffect, useCallback } from 'react';
import { SHARE_MESSAGES } from '@/constants/postcard';

/**
 * 엽서 만료 시간까지 남은 시간을 계산하고 1분 주기로 갱신하는 훅
 */
export function useShareTimer(expiresAt: string) {
  const getTimeRemaining = useCallback(() => {
    const expireTime = new Date(expiresAt).getTime();
    const diff = expireTime - Date.now();
    if (diff <= 0) return SHARE_MESSAGES.EXPIRED;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}${SHARE_MESSAGES.HOURS} ${minutes}${SHARE_MESSAGES.MINUTES_LEFT}`;
  }, [expiresAt]);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => setTimeRemaining(getTimeRemaining()), 60_000);
    return () => clearInterval(timer);
  }, [getTimeRemaining]);

  return timeRemaining;
}
