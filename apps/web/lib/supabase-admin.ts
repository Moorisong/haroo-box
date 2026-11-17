import { SubService, UNIFIED_SERVICES } from './unified-auth-constants';

interface EnsureSupabaseUserParams {
  service: SubService;
  serviceUserId: string;
  provider: 'kakao' | 'google';
  providerId: string;
  name?: string | null;
  image?: string | null;
}

function getSupabaseAdminConfig(service: SubService): { url: string; serviceRoleKey: string } | null {
  if (service === UNIFIED_SERVICES.DUMPIT) {
    const url = process.env.DUMPIT_SUPABASE_URL;
    const serviceRoleKey = process.env.DUMPIT_SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceRoleKey) return { url, serviceRoleKey };
  }
  if (service === UNIFIED_SERVICES.ADVENT) {
    const url = process.env.ADVENT_SUPABASE_URL;
    const serviceRoleKey = process.env.ADVENT_SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceRoleKey) return { url, serviceRoleKey };
  }
  return null;
}

/**
 * 미가입 유저가 SSO로 서브 서비스에 처음 진입할 때
 * 해당 서비스의 Supabase auth.users에 실제 UUID 레코드를 JIT 생성합니다.
 * Service Role Key가 미설정된 환경에서도 Custom JWT 발급은 정상 진행되도록 Fail-Safe로 동작합니다.
 */
export async function ensureSupabaseUser(params: EnsureSupabaseUserParams): Promise<boolean> {
  const config = getSupabaseAdminConfig(params.service);
  if (!config) return false;

  const endpoint = `${config.url.replace(/\/$/, '')}/auth/v1/admin/users`;
  const syntheticEmail = `${params.service}.${params.provider}.${params.providerId.replace(/[^a-zA-Z0-9_-]/g, '_')}@unified.harooo.co.kr`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
      body: JSON.stringify({
        id: params.serviceUserId,
        email: syntheticEmail,
        email_confirm: true,
        user_metadata: {
          name: params.name || '',
          nickname: params.name || '',
          avatar_url: params.image || '',
          unified_provider: params.provider,
          unified_provider_id: params.providerId,
        },
        app_metadata: {
          provider: 'haroo_unified',
          providers: ['haroo_unified'],
        },
      }),
    });

    if (res.ok || res.status === 422) {
      // 200/201 생성 성공 또는 422(이미 존재하는 유저/이메일) 모두 정상 처리
      return true;
    }

    const errText = await res.text().catch(() => '');
    console.warn(`[SupabaseAdmin] Failed to provision user (${res.status}):`, errText);
    return false;
  } catch (err) {
    console.warn('[SupabaseAdmin] Provision request error (Fail-Safe):', err);
    return false;
  }
}

