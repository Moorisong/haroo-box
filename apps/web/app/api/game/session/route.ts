import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { generateSessionToken } from '@/lib/game-session';

// 세션 만료 시간 (10분)
const SESSION_EXPIRY_MS = 10 * 60 * 1000;

/**
 * POST /api/game/session
 * 게임 시작 시 호출하여 세션 토큰을 발급받음
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const kakaoId = session?.user?.kakaoId || 'guest';

    // 로그인 확인 로직 제거 (게스트 플레이 지원)
    // if (!session?.user?.kakaoId) { ... }


    const startTime = new Date();
    const expiresAt = new Date(startTime.getTime() + SESSION_EXPIRY_MS);

    // 세션 토큰 생성
    const sessionToken = generateSessionToken(kakaoId, startTime.getTime());

    const db = await getDatabase();
    const sessions = db.collection('game_sessions');

    // 만료된 세션 정리 (옵션: 주기적으로 실행)
    await sessions.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    // 새 세션 저장
    await sessions.insertOne({
      token: sessionToken,
      kakaoId,
      startTime,
      expiresAt,
      used: false,
      createdAt: new Date()
    });

    // TTL 인덱스 생성 (세션 자동 만료용 - 한 번만 실행됨)
    try {
      await sessions.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      );
    } catch {
      // 인덱스가 이미 존재하면 무시
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionToken,
        startTime: startTime.getTime(),
        expiresAt: expiresAt.getTime()
      }
    });
  } catch (error) {
    console.error('게임 세션 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
