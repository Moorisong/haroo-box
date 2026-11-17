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
export async function ensureSupabaseUser(params: EnsureSupabaseUserParams & { existing?: boolean }): Promise<boolean> {
  const config = getSupabaseAdminConfig(params.service);
  if (!config) return false;

  const endpoint = `${config.url.replace(/\/$/, '')}/auth/v1/admin/users`;
  const syntheticEmail = `${params.service}.${params.provider}.${params.providerId.replace(/[^a-zA-Z0-9_-]/g, '_')}@unified.harooo.co.kr`;

  const appMetadata = {
    provider: params.provider,
    providers: [params.provider],
  };
  const userMetadata = {
    name: params.name || '',
    nickname: params.name || '',
    avatar_url: params.image || '',
    unified_provider: params.provider,
    unified_provider_id: params.providerId,
  };
  const headers = {
    'Content-Type': 'application/json',
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
  };
  const updateExisting = async () => {
    const res = await fetch(`${endpoint}/${encodeURIComponent(params.serviceUserId)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        app_metadata: appMetadata,
        user_metadata: userMetadata,
      }),
    });
    if (!res.ok) {
      console.warn(`[SupabaseAdmin] Provider metadata update failed (${res.status}):`, await res.text().catch(() => ''));
    }
    return res.ok;
  };

  try {
    // Existing service users must be repaired as well; creating only on first login
    // would leave previously issued haroo_unified metadata untouched forever.
    if (params.existing) return await updateExisting();

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: params.serviceUserId,
        email: syntheticEmail,
        email_confirm: true,
        user_metadata: userMetadata,
        app_metadata: appMetadata,
      }),
    });

    if (res.ok) return true;
    if (res.status === 422) {
      // Duplicate provisioned users keep their original Supabase UUID.
      return await updateExisting();
    }

    console.warn(`[SupabaseAdmin] Failed to provision user (${res.status}):`, await res.text().catch(() => ''));
    return false;
  } catch (err) {
    console.warn('[SupabaseAdmin] Provision request error (Fail-Safe):', err);
    return false;
  }
}

