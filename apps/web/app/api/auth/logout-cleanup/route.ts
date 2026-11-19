import { NextRequest, NextResponse } from 'next/server';
import { getSharedCookieDomain } from '@/lib/cookie-domain';

// NextAuth's normal signOut clears the configured shared-domain cookie.
// Older host-only cookies (or chunked tokens) can still shadow it on mobile.
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const sharedDomain = getSharedCookieDomain();
  const names = request.cookies.getAll()
    .map(cookie => cookie.name)
    .filter(name =>
      /^(?:__Secure-|__Host-)?next-auth\.session-token(?:\.\d+)?$/.test(name) ||
      /^(?:__Secure-|__Host-)?authjs\.session-token(?:\.\d+)?$/.test(name)
    );

  for (const name of new Set([
    ...names,
    '__Secure-next-auth.session-token',
    'next-auth.session-token',
    '__Secure-authjs.session-token',
    'authjs.session-token',
  ])) {
    const secure = name.startsWith('__Secure-') || name.startsWith('__Host-');
    // Clear host-only and shared-domain variants separately.
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure,
      sameSite: 'lax',
    });
    if (sharedDomain && !name.startsWith('__Host-')) {
      response.cookies.set({
        name,
        value: '',
        path: '/',
        domain: sharedDomain,
        maxAge: 0,
        httpOnly: true,
        secure,
        sameSite: 'lax',
      });
    }
  }
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
