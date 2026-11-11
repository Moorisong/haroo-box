import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { createSupabaseCustomToken } from '@/lib/supabase-token';
import { randomUUID } from 'crypto';
import { handleCors } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return handleCors(req, res);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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
    const memberships = db.collection('unifiedservicememberships');

    let membership = await memberships.findOne({
      service,
      originalUserId: session.user.id,
    });

    if (!membership && session.user.providerId) {
      membership = await memberships.findOne({
        service,
        providerId: session.user.providerId,
      });
    }

    let serviceUserId = membership?.serviceUserId;

    if (!serviceUserId) {
      serviceUserId = randomUUID();
      await memberships.insertOne({
        service,
        serviceUserId,
        originalUserId: session.user.id,
        provider: session.user.provider,
        providerId: session.user.providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const token = await createSupabaseCustomToken(serviceUserId, jwtSecret);

    const res = NextResponse.json({
      success: true,
      service,
      serviceUserId,
      token,
      user: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
    });
    return handleCors(req, res);
  } catch (error) {
    console.error('Unified token generation error:', error);
    const res = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return handleCors(req, res);
  }
}
