import type { Document, WithId } from 'mongodb';
import { getDatabase } from './mongodb';
import { UNIFIED_SERVICES } from './unified-auth-constants';
import {
  ensureUnifiedUserUniqueIndex,
  normalizeProviderId,
  SocialProvider,
} from './unified-service-user';

interface EnsureBoxUserParams {
  provider: SocialProvider;
  providerId: string;
  name?: string | null;
  image?: string | null;
}

export function boxProviderIdAliases(provider: SocialProvider, providerId: string): string[] {
  const canonical = normalizeProviderId(provider, providerId);
  if (provider !== 'google') return [canonical];

  // Old Google box accounts may have been saved before the google: prefix
  // was introduced. Both forms must resolve to the same MongoDB _id.
  const raw = canonical.slice('google:'.length);
  return [...new Set([canonical, raw])];
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null &&
    'code' in error && error.code === 11000;
}

/**
 * Resolve a box account by verified social identity, including legacy Google
 * providerId formats and old box records without a service field.
 *
 * Existing records always win over insertion; their _id and nickname are kept.
 * When both legacy and new-format records exist, prefer the oldest rather than
 * silently switching accounts or deleting/moving user data.
 */
export async function ensureBoxUser({
  provider,
  providerId,
  name,
  image,
}: EnsureBoxUserParams): Promise<{ userId: string; nickname: string | null; nicknameUpdatedAt: string | null } | null> {
  if (!providerId?.trim()) return null;

  const db = await getDatabase();
  const users = db.collection('users');
  const canonical = normalizeProviderId(provider, providerId);
  const aliases = boxProviderIdAliases(provider, providerId);
  const identityFields = provider === 'google'
    ? [{ providerId: { $in: aliases } }, { googleId: { $in: aliases } }]
    : [{ providerId: { $in: aliases } }];
  const filter = {
    $and: [
      { $or: identityFields },
      { provider: { $in: [provider, null] } },
      {
        $or: [
          { service: UNIFIED_SERVICES.BOX },
          { service: { $exists: false } },
          { service: null },
        ],
      },
    ],
  };

  const findExisting = async () => users.find(filter)
    .sort({ createdAt: 1, _id: 1 })
    .limit(2)
    .toArray();

  let matches = await findExisting();
  let doc: WithId<Document> | null = matches[0] ?? null;

  if (!doc) {
    // New accounts need a unique index so simultaneous sign-in and JIT
    // callbacks cannot create two box records with the same canonical ID.
    await ensureUnifiedUserUniqueIndex(db);
    const now = new Date();
    try {
      doc = await users.findOneAndUpdate(
        { service: UNIFIED_SERVICES.BOX, providerId: canonical },
        {
          $setOnInsert: {
            service: UNIFIED_SERVICES.BOX,
            providerId: canonical,
            provider,
            name: name || null,
            profileImage: image || null,
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;
    }
    // Another request may have inserted the account while we were waiting.
    matches = await findExisting();
    doc = matches[0] ?? doc;
  }

  if (!doc) return null;
  if (matches.length > 1) {
    console.warn('[UnifiedAuth] Multiple legacy box records for one social identity; reusing oldest _id');
  }

  const updates: Record<string, unknown> = { provider, updatedAt: new Date() };
  if (name != null) updates.name = name;
  if (image != null) updates.profileImage = image;

  // Migrate a service-less legacy box document without changing its _id or
  // providerId. A conflicting newer record must never cause a second insert.
  if (doc.service == null) {
    try {
      await users.updateOne({ _id: doc._id }, {
        $set: { ...updates, service: UNIFIED_SERVICES.BOX },
      });
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;
      await users.updateOne({ _id: doc._id }, { $set: updates });
    }
  } else {
    await users.updateOne({ _id: doc._id }, { $set: updates });
  }

  return {
    userId: doc._id.toString(),
    nickname: doc.nickname || null,
    nicknameUpdatedAt: doc.nicknameUpdatedAt?.toISOString() || null,
  };
}
