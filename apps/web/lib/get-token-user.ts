import { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';
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
  // 1. NextAuth 표준 getServerSession 시도
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id || session?.user?.providerId) {
      return {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
        provider: session.user.provider,
        providerId: session.user.providerId,
      };
    }
  } catch (err) {
    console.warn('getServerSession check failed, falling back to direct cookie decoding:', err);
  }

  // 2. Cross-subdomain 요청에서 쿠키를 직접 추출하여 JWT 디코딩
  const cookieHeader = req.headers.get('cookie') || '';
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
    return null;
  }

  try {
    const decoded = await decode({
      token: tokenValue,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded) return null;

    return {
      id: (decoded.userId as string) || undefined,
      name: (decoded.name as string) || null,
      image: (decoded.picture as string) || (decoded.image as string) || null,
      provider: (decoded.provider as 'kakao' | 'google') || undefined,
      providerId: (decoded.providerId as string) || undefined,
    };
  } catch (decodeErr) {
    console.error('Failed to decode NextAuth session token from cookie:', decodeErr);
    return null;
  }
}
