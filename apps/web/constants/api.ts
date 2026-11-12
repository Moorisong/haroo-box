/**
 * API 경로 상수
 * 모든 API 엔드포인트는 여기서 관리
 */

export const API = {
} as const;


// 외부 API URL
export const getApiBaseUrl = () => {
  // Local development must never silently call the production API.
  // NEXT_PUBLIC_API_URL can be set in deployed environments, but local
  // development always uses the local backend on port 3000.
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      return `http://${window.location.hostname}:3000`;
    }
    // Use IPv4 explicitly for Node.js SSR; localhost may resolve to ::1.
    return 'http://127.0.0.1:3000';
  }

  return process.env.NEXT_PUBLIC_API_URL || 'https://box-api.harooo.co.kr';
};

export const API_BASE_URL = getApiBaseUrl();
