import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { getSharedCookieDomain } from '@/lib/cookie-domain';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const db = await getDatabase();
    const service = req.nextUrl.searchParams.get('service'); // 'dumpit' | 'advent'

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

    return NextResponse.json({
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
  } catch (error) {
    console.error('Unified session check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  const cookieDomain = getSharedCookieDomain();
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  const expired = 'max-age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const domainPart = cookieDomain ? `; domain=${cookieDomain}` : '';

  response.headers.append('Set-Cookie', `next-auth.session-token=; ${expired}${domainPart}`);
  response.headers.append('Set-Cookie', `__Secure-next-auth.session-token=; ${expired}${domainPart}; Secure`);
  response.headers.append('Set-Cookie', `next-auth.csrf-token=; ${expired}${domainPart}`);
  response.headers.append('Set-Cookie', `__Host-next-auth.csrf-token=; ${expired}`);

  return response;
}
