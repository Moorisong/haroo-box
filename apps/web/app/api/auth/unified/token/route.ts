import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { createSupabaseCustomToken } from '@/lib/supabase-token';
import { randomUUID } from 'crypto';
import { handleCors } from '@/lib/cors';
import { getAuthenticatedUser } from '@/lib/get-token-user';

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

    const service = req.nextUrl.searchParams.get('service');
    if (!service || (service !== 'dumpit' && service !== 'advent')) {
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
        await users.updateOne(
          { service, providerId: user.providerId },
          {
            $set: {
              service,
              providerId: user.providerId,
              provider: user.provider || 'kakao',
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

    const token = await createSupabaseCustomToken(serviceUserId, jwtSecret);

    const res = NextResponse.json({
      success: true,
      service,
      serviceUserId,
      token,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    });
    return handleCors(req, res);
  } catch (error) {
    console.error('Unified token generation error:', error);
    const res = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
