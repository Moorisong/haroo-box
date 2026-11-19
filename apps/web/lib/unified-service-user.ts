import { randomUUID } from 'crypto';
import { Db, Document, WithId } from 'mongodb';
import { SubService } from './unified-auth-constants';

export type SocialProvider = 'google' | 'kakao';

export function normalizeProviderId(provider: SocialProvider, providerId: string): string {
  const trimmed = providerId.trim();
  if (!trimmed) throw new Error('Missing social provider ID');
  // A Supabase auth.users UUID must never become a Google OAuth subject.
  // Google account IDs are decimal strings, not UUIDs.
  if (provider === 'google') {
    if (!/^(?:google:)?[0-9]+$/.test(trimmed)) {
      throw new Error('Invalid Google OAuth subject');
    }
    return trimmed.startsWith('google:') ? trimmed : `google:${trimmed}`;
  }
  return trimmed;
}

// A unique database constraint, rather than a find-then-insert check, prevents
// simultaneous SSO token and native sync requests from inserting two users.
let uniqueIndexPromise: Promise<string> | undefined;

export async function ensureUnifiedUserUniqueIndex(db: Db): Promise<void> {
  if (!uniqueIndexPromise) {
    uniqueIndexPromise = (async () => {
      const users = db.collection('users');
      // Mongoose may already have created this unique compound index under
      // its default name. Reuse it instead of raising IndexOptionsConflict.
      const indexes = await users.listIndexes().toArray();
      const existing = indexes.find((index) =>
        index.unique === true &&
        index.key?.service === 1 &&
        index.key?.providerId === 1 &&
        Object.keys(index.key).length === 2
      );
      if (existing) return existing.name || 'service_1_providerId_1';

      return users.createIndex(
        { service: 1, providerId: 1 },
        {
          name: 'uniq_users_service_providerId',
          unique: true,
          // Legacy documents without either identity field must not all collide.
          partialFilterExpression: {
            service: { $type: 'string' },
            providerId: { $type: 'string' },
          },
        }
      );
    })().catch((error) => {
      uniqueIndexPromise = undefined;
      console.error(
        '[UnifiedAuth] Cannot enforce unique (service, providerId). ' +
        'Check existing duplicates before allowing new sign-ins.',
        error
      );
      throw error;
    });
  }
  await uniqueIndexPromise;
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null &&
    'code' in error && error.code === 11000;
}

interface UpsertServiceUserParams {
  service: SubService;
  provider: SocialProvider;
  providerId: string;
  // Native Supabase login supplies the real Auth UUID; SSO generates it once.
  serviceUserId?: string;
  name?: string | null;
  image?: string | null;
}

export interface UpsertServiceUserResult {
  user: WithId<Document>;
  serviceUserId: string;
  // Never silently replace a previously issued Supabase Auth UUID.
  serviceUserIdConflict: boolean;
}

/**
 * The only MongoDB creation path for sub-service users.
 * Both /unified/token and /unified/sync use the same canonical identity,
 * unique index and insert-only serviceUserId.
 */
export async function upsertUnifiedServiceUser(
  db: Db,
  params: UpsertServiceUserParams
): Promise<UpsertServiceUserResult> {
  await ensureUnifiedUserUniqueIndex(db);

  const users = db.collection('users');
  const providerId = normalizeProviderId(params.provider, params.providerId);
  const identity = { service: params.service, providerId };
  const now = new Date();
  const updates: Record<string, unknown> = {
    provider: params.provider,
    updatedAt: now,
  };
  if (params.name != null) updates.name = params.name;
  if (params.image != null) updates.profileImage = params.image;

  let user: WithId<Document> | null;
  try {
    user = await users.findOneAndUpdate(
      identity,
      {
        $set: updates,
        $setOnInsert: {
          ...identity,
          serviceUserId: params.serviceUserId || randomUUID(),
          createdAt: now,
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
  } catch (error) {
    // A second simultaneous upsert may lose the unique-index insert race.
    if (!isDuplicateKeyError(error)) throw error;
    user = await users.findOne(identity);
  }

  if (!user) throw new Error('Unable to resolve unified service user');

  // Recover old records missing serviceUserId without racing another request.
  if (!user.serviceUserId) {
    const assigned = await users.findOneAndUpdate(
      {
        _id: user._id,
        $or: [{ serviceUserId: { $exists: false } }, { serviceUserId: null }],
      },
      { $set: { serviceUserId: params.serviceUserId || randomUUID() } },
      { returnDocument: 'after' }
    );
    user = assigned || await users.findOne({ _id: user._id });
  }

  if (!user || typeof user.serviceUserId !== 'string' || !user.serviceUserId) {
    throw new Error('Unable to resolve service user ID');
  }

  return {
    user,
    serviceUserId: user.serviceUserId,
    serviceUserIdConflict: Boolean(
      params.serviceUserId && params.serviceUserId !== user.serviceUserId
    ),
  };
}
