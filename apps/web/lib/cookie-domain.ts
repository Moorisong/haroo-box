/**
 * 서브도메인 간 세션 공유를 위한 도메인 추출 유틸리티
 */
export function getSharedCookieDomain(): string | undefined {
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  if (envUrl.includes('harooo.co.kr')) {
    return '.harooo.co.kr';
  }
  if (envUrl.includes('haroo.site')) {
    return '.haroo.site';
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.endsWith('.harooo.co.kr') || hostname === 'harooo.co.kr') {
      return '.harooo.co.kr';
    }
    if (hostname.endsWith('.haroo.site') || hostname === 'haroo.site') {
      return '.haroo.site';
    }
  }
  return undefined; // 로컬 개발(localhost) 환경에서는 host-only
}
