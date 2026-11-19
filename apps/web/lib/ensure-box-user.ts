import { getDatabase } from './mongodb';
import { UNIFIED_SERVICES } from './unified-auth-constants';
import { ensureUnifiedUserUniqueIndex } from './unified-service-user';

interface EnsureBoxUserParams {
  provider: 'kakao' | 'google';
  providerId: string;
  name?: string | null;
  image?: string | null;
}

/**
 * 서브 서비스(감쓰, 어드벤트)에서 소셜 로그인 후 하루상자에 처음 진입한 유저를 위해
 * MongoDB users 컬렉션에 { service: 'box', providerId } 문서를 JIT 자동 생성합니다.
 */
export async function ensureBoxUser({
  provider,
  providerId,
  name,
  image,
}: EnsureBoxUserParams): Promise<{ userId: string; nickname: string | null; nicknameUpdatedAt: string | null } | null> {
  if (!providerId) return null;

  const db = await getDatabase();
  await ensureUnifiedUserUniqueIndex(db);
  const users = db.collection('users');

  const existing = await users.findOne({ service: UNIFIED_SERVICES.BOX, providerId });
  if (existing) {
    return {
      userId: existing._id.toString(),
      nickname: existing.nickname || null,
      nicknameUpdatedAt: existing.nicknameUpdatedAt?.toISOString() || null,
    };
  }

  const now = new Date();
  const result = await users.findOneAndUpdate(
    { service: UNIFIED_SERVICES.BOX, providerId },
    {
      $setOnInsert: {
        service: UNIFIED_SERVICES.BOX,
        providerId,
        provider,
        name: name || null,
        profileImage: image || null,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  const doc = result || (await users.findOne({ service: UNIFIED_SERVICES.BOX, providerId }));
  if (!doc) return null;

  return {
    userId: doc._id.toString(),
    nickname: doc.nickname || null,
    nicknameUpdatedAt: doc.nicknameUpdatedAt?.toISOString() || null,
  };
}

