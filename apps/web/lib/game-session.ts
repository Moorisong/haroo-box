import { getDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

// 최소 게임 플레이 시간 (3초)
export const MIN_GAME_DURATION_MS = 3000;

// 서버 전용 시크릿 (환경 변수에서 가져옴 - 필수)
export function getSessionSecret(): string {
  const secret = process.env.GAME_SESSION_SECRET;
  if (!secret) {
    throw new Error('GAME_SESSION_SECRET 환경변수가 설정되지 않았습니다.');
  }
  return secret;
}

/**
 * 게임 세션 토큰 생성
 * 서버에서만 생성 가능한 암호화된 토큰
 */
export function generateSessionToken(kakaoId: string, startTime: number): string {
  const payload = `${kakaoId}:${startTime}:${crypto.randomBytes(16).toString('hex')}`;
  const secret = getSessionSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  // Base64로 인코딩하여 전송
  const token = Buffer.from(`${payload}:${signature}`).toString('base64');
  return token;
}

/**
 * 게임 세션 토큰 검증 (DB에서 조회)
 */
export async function verifySessionToken(token: string): Promise<{
  valid: boolean;
  kakaoId?: string;
  startTime?: number;
  error?: string;
}> {
  try {
    const db = await getDatabase();
    const sessions = db.collection('game_sessions');

    const session = await sessions.findOne({ token });

    if (!session) {
      return { valid: false, error: '유효하지 않은 게임 세션입니다.' };
    }

    if (session.used) {
      return { valid: false, error: '이미 사용된 게임 세션입니다.' };
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      // 만료된 세션 삭제
      await sessions.deleteOne({ token });
      return { valid: false, error: '만료된 게임 세션입니다.' };
    }

    const gameDuration = Date.now() - new Date(session.startTime).getTime();
    if (gameDuration < MIN_GAME_DURATION_MS) {
      return {
        valid: false,
        error: `게임 시간이 너무 짧습니다. (${Math.floor(gameDuration)}ms < ${MIN_GAME_DURATION_MS}ms)`
      };
    }

    return {
      valid: true,
      kakaoId: session.kakaoId,
      startTime: new Date(session.startTime).getTime()
    };
  } catch (error) {
    console.error('세션 검증 오류:', error);
    return { valid: false, error: '세션 검증 중 오류가 발생했습니다.' };
  }
}

/**
 * 게임 세션 사용 처리 (1회용)
 */
export async function consumeSession(token: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const sessions = db.collection('game_sessions');

    const result = await sessions.updateOne(
      { token, used: false },
      { $set: { used: true, usedAt: new Date() } }
    );

    return result.modifiedCount === 1;
  } catch (error) {
    console.error('세션 소비 오류:', error);
    return false;
  }
}
