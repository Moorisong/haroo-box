import { NextRequest, NextResponse } from 'next/server';
import { handleCors } from '@/lib/cors';
import { getAuthenticatedUser } from '@/lib/get-token-user';

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return handleCors(req, res);
}

/**
 * 패밀리 서비스 공통 인증 상태 확인 API
 * GET /api/auth/unified/me
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user || !user.id) {
      const res = NextResponse.json({ authenticated: false, user: null }, { status: 200 });
      return handleCors(req, res);
    }

    const res = NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          name: user.name || null,
          image: user.image || null,
          provider: user.provider || 'unknown',
        },
      },
      { status: 200 }
    );
    return handleCors(req, res);
  } catch (error) {
    console.error('[UnifiedMe] Auth check error:', error);
    const res = NextResponse.json({ authenticated: false, error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
