import { SignJWT } from 'jose';

/**
 * Supabase JWT 생성기
 * - Supabase RLS는 JWT payload의 `sub`를 auth.uid()로 인식합니다.
 * - `role: 'authenticated'` 필수
 */
export async function createSupabaseCustomToken(
  supabaseUserId: string,
  jwtSecret: string,
  expiresInSeconds: number = 3600 * 24 // 24시간
): Promise<string> {
  const secret = new TextEncoder().encode(jwtSecret);

  const token = await new SignJWT({
    aud: 'authenticated',
    role: 'authenticated',
    sub: supabaseUserId,
    app_metadata: {
      provider: 'haroo_unified',
      providers: ['haroo_unified'],
    },
    user_metadata: {},
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds);

  return token.sign(secret);
}
