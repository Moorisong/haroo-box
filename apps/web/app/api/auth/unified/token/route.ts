import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { createSupabaseCustomToken } from '@/lib/supabase-token';
import { handleCors } from '@/lib/cors';
import { getAuthenticatedUser } from '@/lib/get-token-user';
import { ensureSupabaseUser } from '@/lib/supabase-admin';
import { UNIFIED_SERVICES } from '@/lib/unified-auth-constants';
import { upsertUnifiedServiceUser } from '@/lib/unified-service-user';

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return handleCors(req, res);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return handleCors(req, res);
    }

    if (!user.providerId || (user.provider !== 'google' && user.provider !== 'kakao')) {
      const res = NextResponse.json({ error: 'Verified social login provider required' }, { status: 401 });
      return handleCors(req, res);
    }

    const service = req.nextUrl.searchParams.get('service');
    if (!service || (service !== UNIFIED_SERVICES.DUMPIT && service !== UNIFIED_SERVICES.ADVENT)) {
      const res = NextResponse.json({ error: 'Invalid service' }, { status: 400 });
      return handleCors(req, res);
    }

    const jwtSecret =
      service === 'dumpit'
        ? process.env.DUMPIT_SUPABASE_JWT_SECRET
        : process.env.ADVENT_SUPABASE_JWT_SECRET;

    if (!jwtSecret) {
      const res = NextResponse.json(
        { error: `JWT Secret for ${service} is not configured` },
        { status: 503 }
      );
      return handleCors(req, res);
    }

    const db = await getDatabase();
    // One atomic, uniquely indexed upsert for every SSO entry. Concurrent
    // /token and /sync calls must resolve to the same MongoDB user.
    const { serviceUserId } = await upsertUnifiedServiceUser(db, {
      service,
      provider: user.provider,
      providerId: user.providerId,
      name: user.name,
      image: user.image,
    });

    // The MongoDB identity is committed before Supabase provisioning. Reuse
    // the stable UUID on every login, never generate a second one on retry.
    await ensureSupabaseUser({
      service,
      serviceUserId,
      provider: user.provider,
      providerId: user.providerId,
      name: user.name,
      image: user.image,
    });

    const token = await createSupabaseCustomToken(serviceUserId, jwtSecret, user.provider);

    const res = NextResponse.json({
      success: true,
      service,
      serviceUserId,
      token,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        provider: user.provider || null,
        providerId: user.providerId || null,
      },
    });
    return handleCors(req, res);
  } catch (error) {
    console.error('Unified token generation error:', error);
    const res = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
