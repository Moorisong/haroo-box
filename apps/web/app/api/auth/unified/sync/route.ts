import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { handleCors } from '@/lib/cors';
import { getSharedCookieDomain } from '@/lib/cookie-domain';
import { encode } from 'next-auth/jwt';
import {
  SECURE_SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/unified-auth-constants';

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

    if ((service !== 'dumpit' && service !== 'advent') || !serviceUserId || (provider !== 'google' && provider !== 'kakao') || !providerId) {
      const res = NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      return handleCors(req, res);
    }

    // 모의/테스트용 더미 계정(owner-123, friend-456 등)은 DB에 영구 저장하지 않고 통과 처리
    const isMockAccount =
      /^(owner-|friend-|timezone-|mock-|test-)/i.test(serviceUserId) ||
      /^(owner-|friend-|timezone-|mock-|test-)/i.test(providerId);

    if (isMockAccount) {
      const res = NextResponse.json({
        success: true,
        unifiedUserId: 'mock-temp-user',
        serviceUserId,
      });
      return handleCors(req, res);
    }

    const db = await getDatabase();
    const users = db.collection('users');

    const providerIdKey =
      provider === 'google' && !providerId.startsWith('google:')
        ? `google:${providerId}`
        : providerId;

    const userResult = await users.findOneAndUpdate(
      { service, providerId: providerIdKey },
      {
        $set: {
          providerId: providerIdKey,
          provider,
          service,
          serviceUserId,
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

    const unifiedUser = userResult || (await users.findOne({ service, providerId: providerIdKey }));
    const unifiedUserObjId = unifiedUser?._id;
    const unifiedUserId = unifiedUserObjId?.toString();

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
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    const cookieDomain = getSharedCookieDomain();
    const domainPart = cookieDomain ? `; Domain=${cookieDomain}` : '';
    const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookieAttrs = `; Max-Age=${SESSION_MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax`;

    const res = NextResponse.json({
      success: true,
      unifiedUserId,
      serviceUserId,
    });

    res.headers.append(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=${token}${cookieAttrs}${domainPart}${securePart}`
    );
    if (process.env.NODE_ENV === 'production') {
      res.headers.append(
        'Set-Cookie',
        `${SECURE_SESSION_COOKIE_NAME}=${token}${cookieAttrs}${domainPart}; Secure`
      );
    }
    res.headers.append(
      'Set-Cookie',
      `haroo_session_active=true; Max-Age=${SESSION_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${domainPart}${securePart}`
    );

    return handleCors(req, res);
  } catch (error) {
    console.error('Unified user sync error:', error);
    const res = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
