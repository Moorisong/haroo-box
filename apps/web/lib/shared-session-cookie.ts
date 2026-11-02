/**
 * 하루상자와 감쓰.exe가 같은 상위 도메인에서 공유하는 세션 상태 신호.
 * 인증 토큰이 아닌 상태 표시만 저장하며, 실제 인증은 각 서비스가 검증한다.
 */
const COOKIE_NAME = 'haroo_session_active';
const LOGIN_INTENT_KEY = 'haroo-box:shared-login-started';
const LOGIN_INTENT_TTL_MS = 15 * 60 * 1000;

export function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;
  if (hostname === 'harooo.co.kr' || hostname.endsWith('.harooo.co.kr')) {
    return '; Domain=.harooo.co.kr';
  }
  if (hostname === 'haroo.site' || hostname.endsWith('.haroo.site')) {
    return '; Domain=.haroo.site';
  }
  return '';
}

export function setSharedSessionCookie(active: boolean): void {
  if (typeof document === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const expired = 'Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Remove an older host-only cookie that could shadow the shared domain cookie.
  document.cookie = `${COOKIE_NAME}=; Path=/; SameSite=Lax${secure}; ${expired}`;
  // Do not delete on logout: other subdomains need a durable 'false' signal.
  document.cookie = `${COOKIE_NAME}=${active ? 'true' : 'false'}; Path=/; SameSite=Lax${domain}${secure}; Max-Age=2592000`;
}

export function getSharedSessionStatus(): 'true' | 'false' | null {
  if (typeof document === 'undefined') return null;
  const values = document.cookie.split(';').map(part => part.trim())
    .filter(part => part.startsWith(`${COOKIE_NAME}=`))
    .map(part => part.slice(COOKIE_NAME.length + 1));
  // Fail closed if a leftover cookie conflicts with an explicit logout.
  if (values.includes('false')) return 'false';
  if (values.includes('true')) return 'true';
  return null;
}

/** Register an explicit Kakao login, so a successful new login can replace a previous logout. */
export function markSharedLoginStarted(): void {
  try {
    sessionStorage.setItem(LOGIN_INTENT_KEY, String(Date.now()));
  } catch {
    // Session storage is optional; never block the actual OAuth login.
  }
}

export function consumeSharedLoginStarted(): boolean {
  try {
    const timestamp = sessionStorage.getItem(LOGIN_INTENT_KEY);
    sessionStorage.removeItem(LOGIN_INTENT_KEY);
    return timestamp !== null && Number.isFinite(Number(timestamp)) &&
      Date.now() - Number(timestamp) >= 0 &&
      Date.now() - Number(timestamp) <= LOGIN_INTENT_TTL_MS;
  } catch {
    return false;
  }
}
