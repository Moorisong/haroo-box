import { NextRequest } from 'next/server';
import { decode, getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export interface TokenUser {
  id?: string;
  name?: string | null;
  image?: string | null;
  provider?: 'kakao' | 'google';
  providerId?: string;
}

export async function getAuthenticatedUser(req: NextRequest): Promise<TokenUser | null> {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookieKeys = cookieHeader
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter(Boolean);

  console.log(`[UnifiedAuthServer] 🔎 Auth check: cookies=[${cookieKeys.join(', ')}]`);

  // 1. NextAuth 공식 getToken 시도 (NextRequest 자동 지원 및 청킹 쿠키 자동 병합)
  try {
    const rawToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
    });
    if (rawToken) {
      console.log(`[UnifiedAuthServer] ✅ getToken 성공: userId=${rawToken.userId || rawToken.sub}`);
      return {
        id: (rawToken.userId as string) || (rawToken.sub as string) || undefined,
        name: (rawToken.name as string) || null,
        image: (rawToken.picture as string) || (rawToken.image as string) || null,
        provider: (rawToken.provider as 'kakao' | 'google') || undefined,
        providerId: (rawToken.providerId as string) || undefined,
      };
    }
  } catch (err) {
    console.warn('[UnifiedAuthServer] getToken check warning:', err);
  }

  // 2. NextAuth 표준 getServerSession 시도
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id || session?.user?.providerId) {
      console.log(`[UnifiedAuthServer] ✅ getServerSession 성공: userId=${session.user.id}`);
      return {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
        provider: session.user.provider,
        providerId: session.user.providerId,
      };
    }
  } catch (err) {
    console.warn('[UnifiedAuthServer] getServerSession check warning:', err);
  }

  // 3. Fallback: 쿠키 헤더 직접 파싱 디코딩
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((part) => {
      const [key, ...vals] = part.trim().split('=');
      return [key, vals.join('=')];
    })
  );

  const tokenValue =
    cookies['__Secure-next-auth.session-token'] ||
    cookies['next-auth.session-token'];

  if (!tokenValue) {
    console.log('[UnifiedAuthServer] ❌ No session token cookie found');
    return null;
  }

  try {
    const decoded = await decode({
      token: tokenValue,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded) {
      console.log('[UnifiedAuthServer] ❌ Direct decode returned null');
      return null;
    }

    console.log(`[UnifiedAuthServer] ✅ Direct decode 성공: userId=${decoded.userId || decoded.sub}`);
    return {
      id: (decoded.userId as string) || (decoded.sub as string) || undefined,
      name: (decoded.name as string) || null,
      image: (decoded.picture as string) || (decoded.image as string) || null,
      provider: (decoded.provider as 'kakao' | 'google') || undefined,
      providerId: (decoded.providerId as string) || undefined,
    };
  } catch (decodeErr) {
    console.error('[UnifiedAuthServer] Failed to decode session token cookie:', decodeErr);
    return null;
  }
}
