export const UNIFIED_SERVICES = {
  BOX: 'box',
  DUMPIT: 'dumpit',
  ADVENT: 'advent',
} as const;

export type UnifiedService = (typeof UNIFIED_SERVICES)[keyof typeof UNIFIED_SERVICES];
export type SubService = typeof UNIFIED_SERVICES.DUMPIT | typeof UNIFIED_SERVICES.ADVENT;

export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30일
export const SUPABASE_JWT_TTL_SECONDS = 24 * 60 * 60; // 24시간

export const SESSION_COOKIE_NAME = 'next-auth.session-token';
export const SECURE_SESSION_COOKIE_NAME = '__Secure-next-auth.session-token';
export const CSRF_COOKIE_NAME = 'next-auth.csrf-token';
export const HOST_CSRF_COOKIE_NAME = '__Host-next-auth.csrf-token';

