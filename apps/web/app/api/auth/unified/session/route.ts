import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getSharedCookieDomain } from '@/lib/cookie-domain';
import { handleCors } from '@/lib/cors';
import { getAuthenticatedUser } from '@/lib/get-token-user';
import {
  CSRF_COOKIE_NAME,
  HOST_CSRF_COOKIE_NAME,
  SECURE_SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  UNIFIED_SERVICES,
} from '@/lib/unified-auth-constants';

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

    let targetUser = null;
    if (service && user.id) {
      const userObjId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;
      targetUser = await db.collection('users').findOne({
        service,
        ...(userObjId ? { _id: userObjId } : { providerId: user.providerId }),
      });
      if (!targetUser && user.providerId) {
        targetUser = await db.collection('users').findOne({
          service,
          providerId: user.providerId,
        });
      }
    }

    console.log(`[UnifiedSessionEndpoint] ✅ Authenticated user=${user.id}, serviceUserId=${targetUser?.serviceUserId || 'none'}`);
    const res = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        provider: user.provider,
        providerId: user.providerId,
        serviceUserId: targetUser?.serviceUserId || null,
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

  const expired = 'max-age=0; path=/; HttpOnly; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const domainPart = cookieDomain ? `; domain=${cookieDomain}` : '';

  res.headers.append('Set-Cookie', `${SESSION_COOKIE_NAME}=; ${expired}${domainPart}`);
  res.headers.append('Set-Cookie', `${SECURE_SESSION_COOKIE_NAME}=; ${expired}${domainPart}; Secure`);
  res.headers.append('Set-Cookie', `${CSRF_COOKIE_NAME}=; ${expired}${domainPart}`);
  res.headers.append('Set-Cookie', `${HOST_CSRF_COOKIE_NAME}=; ${expired}`);
  const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.headers.append(
    'Set-Cookie',
    `haroo_session_active=false; Max-Age=2592000; Path=/; SameSite=Lax${domainPart}${securePart}`
  );

  return handleCors(req, res);
}

/**
 * 서브 서비스 스코프 회원 탈퇴 (케이스 4)
 * DELETE /api/auth/unified/session?service=dumpit|advent
 * 해당 서비스의 MongoDB 레코드만 삭제하고 타 서비스(box 등) 계정은 보존합니다.
 */
export async function DELETE(req: NextRequest) {
  try {
    const service = req.nextUrl.searchParams.get('service');
    if (!service || (service !== UNIFIED_SERVICES.DUMPIT && service !== UNIFIED_SERVICES.ADVENT)) {
      const res = NextResponse.json({ error: 'Invalid service' }, { status: 400 });
      return handleCors(req, res);
    }

    const user = await getAuthenticatedUser(req);
    if (!user?.providerId) {
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return handleCors(req, res);
    }

    const db = await getDatabase();
    const deleteResult = await db.collection('users').deleteOne({
      service,
      providerId: user.providerId,
    });

    const res = NextResponse.json({
      success: true,
      service,
      deletedCount: deleteResult.deletedCount,
    });
    return handleCors(req, res);
  } catch (error) {
    console.error('Scoped withdrawal error:', error);
    const res = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
