/**
 * API 경로 상수
 * 모든 API 엔드포인트는 여기서 관리
 */

export const API = {
} as const;


// 외부 API URL
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // 모바일 등에서 로컬 IP로 접속한 경우 (localhost가 아닌 경우)
    if (host !== 'localhost' && process.env.NODE_ENV === 'development') {
      return `http://${host}:3000`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();
