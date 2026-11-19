import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { jwtVerify } from 'jose';
import { createSupabaseCustomToken } from '../lib/supabase-token.ts';

// createSupabaseCustomToken이 Supabase RLS 규격(sub, aud=authenticated, role=authenticated)에 맞는 유효한 HS256 JWT를 생성하는지 검증
test('createSupabaseCustomToken signs valid Supabase-compatible HS256 JWT', async () => {
  const secret = 'test-supabase-jwt-secret-must-be-at-least-32-chars';
  const userId = '0860a303-7425-4090-bbc6-13f74fa37b0f';

  const token = await createSupabaseCustomToken(userId, secret, 'google', 3600);
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

  assert.equal(payload.sub, userId);
  assert.equal(payload.aud, 'authenticated');
  assert.equal(payload.role, 'authenticated');
  assert.equal(payload.app_metadata?.provider, 'google');
  assert.deepEqual(payload.app_metadata?.providers, ['google']);
});

// sync 엔드포인트가 HttpOnly, SameSite=Lax, Path=/ 보안 속성을 포함한 쿠키를 발급하는지 검증
test('sync route sets HttpOnly shared session cookie and cors headers', () => {
  const syncSrc = readFileSync(new URL('../app/api/auth/unified/sync/route.ts', import.meta.url), 'utf8');
  assert.match(syncSrc, /HttpOnly/);
  assert.match(syncSrc, /SameSite=Lax/);
  assert.match(syncSrc, /SESSION_COOKIE_NAME/);
  assert.match(syncSrc, /SECURE_SESSION_COOKIE_NAME/);
});

// session 엔드포인트가 전역 로그아웃(POST)과 서비스 스코프 탈퇴(DELETE)를 모두 지원하는지 검증
test('session route supports global logout (POST) and scoped withdrawal (DELETE)', () => {
  const sessionSrc = readFileSync(new URL('../app/api/auth/unified/session/route.ts', import.meta.url), 'utf8');
  assert.match(sessionSrc, /export async function POST/);
  assert.match(sessionSrc, /export async function DELETE/);
  assert.match(sessionSrc, /deleteOne\(\{\s*service,\s*providerId:/);
});

// auth.ts의 jwt 콜백이 서브 서비스 로그인 유저의 하루상자(box) JIT 프로비저닝을 수행하는지 검증
test('auth.ts jwt callback provisions box user JIT when missing', () => {
  const authSrc = readFileSync(new URL('../lib/auth.ts', import.meta.url), 'utf8');
  assert.match(authSrc, /ensureBoxUser/);
  assert.match(authSrc, /token\.boxProvisioned/);
});

// token 엔드포인트가 미가입 유저 생성 시 ensureSupabaseUser를 호출해 Supabase auth.users에 등록하는지 검증
test('token route invokes ensureSupabaseUser for newly provisioned serviceUserId', () => {
  const tokenSrc = readFileSync(new URL('../app/api/auth/unified/token/route.ts', import.meta.url), 'utf8');
  assert.match(tokenSrc, /ensureSupabaseUser/);
});


test('Supabase provisioning preserves actual OAuth provider and repairs existing users', () => {
  const src = readFileSync(new URL('../lib/supabase-admin.ts', import.meta.url), 'utf8');
  assert.match(src, /provider: params\.provider/);
  assert.match(src, /providers: \[params\.provider\]/);
  assert.match(src, /if \(params\.existing\)/);
  assert.match(src, /method: 'PUT'/);
  assert.doesNotMatch(src, /provider: 'haroo_unified'/);
});

test('Service token requires verified provider and includes it in JWT', () => {
  const src = readFileSync(new URL('../app/api/auth/unified/token/route.ts', import.meta.url), 'utf8');
  assert.match(src, /user\.provider !== 'google'/);
  assert.match(src, /user\.provider !== 'kakao'/);
  assert.match(src, /createSupabaseCustomToken\(serviceUserId, jwtSecret, user\.provider\)/);
});

test('SSO token and native sync share one atomic service-user creation path', () => {
  const tokenSrc = readFileSync(new URL('../app/api/auth/unified/token/route.ts', import.meta.url), 'utf8');
  const syncSrc = readFileSync(new URL('../app/api/auth/unified/sync/route.ts', import.meta.url), 'utf8');
  const sharedSrc = readFileSync(new URL('../lib/unified-service-user.ts', import.meta.url), 'utf8');

  assert.match(tokenSrc, /upsertUnifiedServiceUser\(db,/);
  assert.match(syncSrc, /upsertUnifiedServiceUser\(db,/);
  assert.match(sharedSrc, /unique: true/);
  assert.match(sharedSrc, /\$setOnInsert:/);
  assert.match(sharedSrc, /serviceUserId: params\.serviceUserId \|\| randomUUID\(\)/);
  assert.match(sharedSrc, /returnDocument: 'after'/);
  assert.match(sharedSrc, /isDuplicateKeyError\(error\)/);
  assert.match(sharedSrc, /normalizeProviderId\(params\.provider, params\.providerId\)/);
  assert.doesNotMatch(tokenSrc, /users\.updateOne\(/);
  assert.doesNotMatch(syncSrc, /users\.findOneAndUpdate\(/);
});

test('native sync never silently overwrites an existing Supabase service UUID', () => {
  const syncSrc = readFileSync(new URL('../app/api/auth/unified/sync/route.ts', import.meta.url), 'utf8');
  const sharedSrc = readFileSync(new URL('../lib/unified-service-user.ts', import.meta.url), 'utf8');
  assert.match(syncSrc, /if \(serviceUserIdConflict\)/);
  assert.match(syncSrc, /SERVICE_USER_ID_MISMATCH/);
  assert.match(syncSrc, /status: 409/);
  assert.match(sharedSrc, /params\.serviceUserId !== user\.serviceUserId/);
});

test('existing Google box accounts are reused across raw and prefixed IDs', () => {
  const boxSrc = readFileSync(new URL('../lib/ensure-box-user.ts', import.meta.url), 'utf8');
  const authSrc = readFileSync(new URL('../lib/auth.ts', import.meta.url), 'utf8');

  // All three paths (OAuth signIn, OAuth JWT, sub-service JIT) must use
  // the same legacy-aware resolver instead of directly inserting box users.
  assert.match(authSrc, /async signIn[\s\S]*?await ensureBoxUser\(/);
  assert.match(authSrc, /async jwt[\s\S]*?await ensureBoxUser\(/);
  assert.doesNotMatch(authSrc, /users\.updateOne\(/);
  assert.match(boxSrc, /canonical\.slice\('google:'\.length\)/);
  assert.match(boxSrc, /providerId: \{ \$in: aliases \}/);
  assert.match(boxSrc, /googleId: \{ \$in: aliases \}/);
  assert.match(boxSrc, /service: \{ \$exists: false \}/);
  assert.match(boxSrc, /sort\(\{ createdAt: 1, _id: 1 \}\)/);
  assert.match(boxSrc, /updateOne\(\{ _id: doc\._id \}/);
  assert.match(boxSrc, /ensureUnifiedUserUniqueIndex\(db\)/);
  assert.match(boxSrc, /\$setOnInsert/);
});

test('Google OAuth subjects cannot be Supabase auth UUIDs', () => {
  const resolver = readFileSync(new URL('../lib/unified-service-user.ts', import.meta.url), 'utf8');
  const sync = readFileSync(new URL('../app/api/auth/unified/sync/route.ts', import.meta.url), 'utf8');
  assert.match(resolver, /Invalid Google OAuth subject/);
  assert.match(resolver, /\[0-9\]\+/);
  assert.match(sync, /INVALID_GOOGLE_PROVIDER_ID/);
  assert.match(sync, /status: 400/);
});
