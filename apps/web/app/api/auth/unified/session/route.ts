import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { getSharedCookieDomain } from '@/lib/cookie-domain';
import { handleCors } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return handleCors(req, res);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      const res = NextResponse.json({ authenticated: false, user: null }, { status: 200 });
      return handleCors(req, res);
    }

    const db = await getDatabase();
    const service = req.nextUrl.searchParams.get('service');

    let membership = null;
    if (service && session.user.id) {
      membership = await db.collection('unifiedservicememberships').findOne({
        service,
        originalUserId: session.user.id,
      });
      if (!membership && session.user.providerId) {
        membership = await db.collection('unifiedservicememberships').findOne({
          service,
          providerId: session.user.providerId,
        });
      }
    }

    const res = NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
        provider: session.user.provider,
        providerId: session.user.providerId,
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
