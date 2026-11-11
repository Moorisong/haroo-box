import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { handleCors } from '@/lib/cors';
import { getSharedCookieDomain } from '@/lib/cookie-domain';
import { encode } from 'next-auth/jwt';

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return handleCors(req, res);
}

interface SyncRequestBody {
  service: 'dumpit' | 'advent';
  serviceUserId: string;
  provider: 'kakao' | 'google';
  providerId: string;
  name?: string;
  profileImage?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SyncRequestBody = await req.json();
    const { service, serviceUserId, provider, providerId, name, profileImage } = body;

    if (!service || !serviceUserId || !provider || !providerId) {
      const res = NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      return handleCors(req, res);
    }

    const db = await getDatabase();
    const users = db.collection('users');
    const memberships = db.collection('unifiedservicememberships');

    const providerIdKey =
      provider === 'google' && !providerId.startsWith('google:')
        ? `google:${providerId}`
        : providerId;

    const userResult = await users.findOneAndUpdate(
      { providerId: providerIdKey },
      {
        $set: {
          providerId: providerIdKey,
          provider,
          name: name || undefined,
          profileImage: profileImage || undefined,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const unifiedUser = userResult || (await users.findOne({ providerId: providerIdKey }));
    const unifiedUserId = unifiedUser?._id?.toString();

    await memberships.updateOne(
      { service, serviceUserId },
      {
        $set: {
          service,
          serviceUserId,
          originalUserId: unifiedUserId,
          provider,
          providerId: providerIdKey,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const token = await encode({
      token: {
        userId: unifiedUserId,
        provider,
        providerId: providerIdKey,
        kakaoId: provider === 'kakao' ? providerId : undefined,
        name: unifiedUser?.name || name || null,
        image: unifiedUser?.profileImage || profileImage || null,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 30 * 24 * 60 * 60,
    });

    const cookieDomain = getSharedCookieDomain();
    const domainPart = cookieDomain ? `; Domain=${cookieDomain}` : '';
    const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookieMaxAge = '; Max-Age=2592000; Path=/; SameSite=Lax';

    const res = NextResponse.json({
      success: true,
      unifiedUserId,
      serviceUserId,
    });

    res.headers.append(
      'Set-Cookie',
      `next-auth.session-token=${token}${cookieMaxAge}${domainPart}${securePart}`
    );
    if (process.env.NODE_ENV === 'production') {
      res.headers.append(
        'Set-Cookie',
        `__Secure-next-auth.session-token=${token}${cookieMaxAge}${domainPart}; Secure`
      );
    }

    return handleCors(req, res);
  } catch (error) {
    console.error('Unified user sync error:', error);
    const res = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
