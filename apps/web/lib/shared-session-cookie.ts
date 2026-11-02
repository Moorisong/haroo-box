/**
 * 서브도메인 간(하루상자 <-> 감쓰.exe) 로그인/로그아웃 상태 동기화용 신호 쿠키
 * 민감한 토큰/개인정보는 절대 포함하지 않고 오직 boolean 플래그('true' | 'false')만 관리
 */

export function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;
  if (hostname.endsWith('harooo.co.kr')) {
    return '; Domain=.harooo.co.kr';
  }
  if (hostname.endsWith('haroo.site')) {
    return '; Domain=.haroo.site';
  }
  return '';
}

export function setSharedSessionCookie(active: boolean): void {
  if (typeof document === 'undefined') return;
  const domain = getCookieDomain();
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  if (active) {
    document.cookie = `haroo_session_active=true; Path=/; SameSite=Lax${domain}${secure}; max-age=2592000`;
  } else {
    // 로그아웃 시 공용 세션 쿠키 즉시 삭제 (과거 'false' 쿠키 잔여물도 제거)
    document.cookie = `haroo_session_active=; Path=/; SameSite=Lax${domain}${secure}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    // 도메인 없이 생성되었을 수 있는 로컬 호스트 쿠키도 함께 삭제
    document.cookie = `haroo_session_active=; Path=/; SameSite=Lax${secure}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function getSharedSessionStatus(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)haroo_session_active=([^;]+)/);
  return match ? match[1] : null;
}
