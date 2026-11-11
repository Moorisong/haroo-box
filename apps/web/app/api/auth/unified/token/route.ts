import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { createSupabaseCustomToken } from '@/lib/supabase-token';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = req.nextUrl.searchParams.get('service'); // 'dumpit' | 'advent'
    if (!service || (service !== 'dumpit' && service !== 'advent')) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    const jwtSecret =
      service === 'dumpit'
        ? process.env.DUMPIT_SUPABASE_JWT_SECRET
        : process.env.ADVENT_SUPABASE_JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        { error: `JWT Secret for ${service} is not configured` },
        { status: 503 }
      );
    }

    const db = await getDatabase();
    const memberships = db.collection('unifiedservicememberships');

    // 1. 기존 매핑 조회
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

    // 2. 신규 사용자일 경우 서비스 전용 UUID 자동 생성
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

    // 3. 서명된 Supabase JWT 토큰 발급
    const token = await createSupabaseCustomToken(serviceUserId, jwtSecret);

    return NextResponse.json({
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
  } catch (error) {
    console.error('Unified token generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
