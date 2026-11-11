import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getSharedCookieDomain } from '@/lib/cookie-domain';
import { handleCors } from '@/lib/cors';
import { getAuthenticatedUser } from '@/lib/get-token-user';

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return handleCors(req, res);
}

export async function GET(req: NextRequest) {
  try {
    const service = req.nextUrl.searchParams.get('service');
    console.log(`[UnifiedSessionEndpoint] 📥 GET session check from service=${service}`);
    const user = await getAuthenticatedUser(req);

    if (!user) {
      console.log(`[UnifiedSessionEndpoint] ❌ Unauthenticated check for service=${service}`);
      const res = NextResponse.json({ authenticated: false, user: null }, { status: 200 });
      return handleCors(req, res);
    }

    const db = await getDatabase();

    let membership = null;
    if (service && user.id) {
      membership = await db.collection('unifiedservicememberships').findOne({
        service,
        originalUserId: user.id,
      });
      if (!membership && user.providerId) {
        membership = await db.collection('unifiedservicememberships').findOne({
          service,
          providerId: user.providerId,
        });
      }
    }

    console.log(`[UnifiedSessionEndpoint] ✅ Authenticated user=${user.id}, serviceUserId=${membership?.serviceUserId || 'none'}`);
    const res = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        provider: user.provider,
        providerId: user.providerId,
        serviceUserId: membership?.serviceUserId || null,
      },
    });
    return handleCors(req, res);
  } catch (error) {
    console.error('Unified session check error:', error);
    const res = NextResponse.json({ authenticated: false, error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}

export async function POST(req: NextRequest) {
  const cookieDomain = getSharedCookieDomain();
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });

  const expired = 'max-age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const domainPart = cookieDomain ? `; domain=${cookieDomain}` : '';

  res.headers.append('Set-Cookie', `next-auth.session-token=; ${expired}${domainPart}`);
  res.headers.append('Set-Cookie', `__Secure-next-auth.session-token=; ${expired}${domainPart}; Secure`);
  res.headers.append('Set-Cookie', `next-auth.csrf-token=; ${expired}${domainPart}`);
  res.headers.append('Set-Cookie', `__Host-next-auth.csrf-token=; ${expired}`);

  return handleCors(req, res);
}
