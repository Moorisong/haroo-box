import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { createSupabaseCustomToken } from '@/lib/supabase-token';
import { randomUUID } from 'crypto';
import { handleCors } from '@/lib/cors';
import { getAuthenticatedUser } from '@/lib/get-token-user';
import { ensureSupabaseUser } from '@/lib/supabase-admin';
import { UNIFIED_SERVICES } from '@/lib/unified-auth-constants';

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
    const users = db.collection('users');

    let targetUser = null;
    if (user.id) {
      const userObjId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;
      targetUser = await users.findOne({
        service,
        ...(userObjId ? { _id: userObjId } : { providerId: user.providerId }),
      });
    }

    if (!targetUser && user.providerId) {
      targetUser = await users.findOne({
        service,
        providerId: user.providerId,
      });
    }

    let serviceUserId = targetUser?.serviceUserId;

    if (!serviceUserId) {
      serviceUserId = randomUUID();
      if (user.providerId) {
        await ensureSupabaseUser({
          service,
          serviceUserId,
          provider: user.provider,
          providerId: user.providerId,
          name: user.name,
          image: user.image,
        });
        await users.updateOne(
          { service, providerId: user.providerId },
          {
            $set: {
              service,
              providerId: user.providerId,
              provider: user.provider,
              serviceUserId,
              name: user.name || undefined,
              profileImage: user.image || undefined,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
    }

    // Repair existing Supabase auth.users metadata on subsequent cross-service logins.
    if (targetUser?.serviceUserId) {
      await ensureSupabaseUser({
        service,
        serviceUserId,
        provider: user.provider,
        providerId: user.providerId,
        name: user.name,
        image: user.image,
        existing: true,
      });
    }

    // Also correct any old MongoDB service record without changing the identity.
    await users.updateOne(
      { service, providerId: user.providerId },
      { $set: { provider: user.provider, updatedAt: new Date() } }
    );

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
