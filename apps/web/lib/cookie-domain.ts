/**
 * 서브도메인 간 세션 공유를 위한 도메인 추출 유틸리티
 */
export function getSharedCookieDomain(): string | undefined {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.endsWith('.harooo.co.kr') || hostname === 'harooo.co.kr') {
      return '.harooo.co.kr';
    }
    if (hostname.endsWith('.haroo.site') || hostname === 'haroo.site') {
      return '.haroo.site';
    }
  }

  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  if (envUrl.includes('harooo.co.kr')) {
    return '.harooo.co.kr';
  }
  if (envUrl.includes('haroo.site')) {
    return '.haroo.site';
  }

  // 프로덕션 환경 기본값은 .harooo.co.kr
  if (process.env.NODE_ENV === 'production') {
    return '.harooo.co.kr';
  }

  return undefined;
}
