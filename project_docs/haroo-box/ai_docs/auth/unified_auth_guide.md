# 하루상자 통합 인증 & 회원 연동 AI 가이드 (Auth Integration Guide)

이 문서는 AI 에이전트가 하루상자 생태계(내부 앱 또는 외부 별도 프로젝트)에서 **로그인을 구현하거나 연동할 때 반드시 준수해야 하는 가이드라인**이다.

---

## 1. 인증 아키텍처 개요

하루상자는 전체 서비스군(`*.harooo.co.kr`)의 **중앙 Identity & Analytics 허브** 역할을 담당한다.

```
                    [ 사용자 (Client) ]
                     /       │       \
                    /        │        \
  [ 하루상자 내부 앱 ]   [ 감쓰 (Dumpit) ]   [ 어드벤트 (Advent) ]
 (box.harooo.co.kr/..)  (dumpit-web...)     (advent-calendar...)
          │                  │                    │
          │                  ▼                    ▼
          │         [자체 Supabase DB]   [자체 Supabase DB]
          │                  │                    │
          │                  └──────────┬─────────┘
          │                             │ (백그라운드 동기화)
          ▼                             ▼
   [ NextAuth 세션 ] ───► [ 하루상자 MongoDB 허브 (users & memberships) ]
```

### 핵심 데이터 모델 차이
1. **`users` (MongoDB)**:
   - **사람(Unique Person) 1명당 1개 문서**.
   - 소셜 로그인 고유 식별자(`providerId`: 카카오 고유번호 또는 구글 고유ID) 기준.
   - 전체 생태계의 '순수 가입자 수'를 집계하는 기준 테이블.
2. **`unifiedservicememberships` (MongoDB)**:
   - **서비스별 가입/활동 증명(Membership)**.
   - 복합 키: `(service, serviceUserId)`.
   - 각 서비스의 로컬 유저 식별자(`serviceUserId`)와 본체(`originalUserId` -> `users._id`)를 연결.
   - `name`, `profileImage`, `updatedAt`을 포함하여 각 서비스별 사용자 수 및 명단을 집계.

---

## 2. 시나리오 A: 하루상자 내부에 새 앱을 추가할 때

하루상자 모노레포(`apps/web`) 내에 새 서비스(예: `apps/web/app/new-service`)를 추가하는 경우.

### 동작 원리
- 하루상자 도메인(`box.harooo.co.kr`)을 직접 공유하므로 **NextAuth 기본 세션을 그대로 활용**한다.

### 구현 방법
1. **클라이언트 컴포넌트**:
   ```tsx
   'use client';
   import { useSession, signIn, signOut } from 'next-auth/react';

   export function MyComponent() {
     const { data: session, status } = useSession();

     if (status === 'loading') return <div>로딩 중...</div>;
     if (!session) {
       return <button onClick={() => signIn('kakao')}>카카오 로그인</button>;
     }

     return <div>환영합니다, {session.user.name}님!</div>;
   }
   ```
2. **서버 컴포넌트 / API Route**:
   ```ts
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/lib/auth';

   export async function GET() {
     const session = await getServerSession(authOptions);
     if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
     const userId = session.user.id;
     // 비즈니스 로직 수행
   }
   ```
3. **멤버십 자동 등록**:
   - 내부 앱이 별도의 서비스 구분이 필요하다면, 로그인 완료 후 또는 서비스 첫 진입 시 MongoDB `unifiedservicememberships`에 `{ service: 'new-service', serviceUserId: session.user.id, originalUserId: ObjectId(session.user.id) }`를 upsert 처리한다.

---

## 3. 시나리오 B: 별도 프로젝트로 생성하여 하루상자와 연동할 때

하루상자와 다른 별도 저장소/스택(예: Vite + Supabase, Cloudflare Workers, Next.js 독립 배포 등)으로 개발하고 `*.harooo.co.kr` 서브도메인에 배포하는 경우.

### 권장 아키텍처 (하이브리드 동기화 모델)
- **자체 DB/Auth 유지**: 서비스 고유 데이터(게시글, 댓글, 파일 등)와 RLS는 해당 프로젝트의 자체 DB(예: Supabase Auth)로 처리하여 장애를 격리하고 독립성을 보장한다.
- **하루상자 중앙 허브 백그라운드 동기화**: 로그인 성공 즉시 하루상자 동기화 엔드포인트로 유저 메타데이터를 전송한다.

### 구현 단계 (AI 구현 체크리스트)

#### 1단계: 로그인 성공 후 중앙 허브 동기화 모듈 작성 (`unified-sync.js`)
로그인 성공 시 백그라운드로 `https://box.harooo.co.kr/api/auth/unified/sync`를 호출한다.
```js
const CENTRAL_SYNC_URL = 'https://box.harooo.co.kr/api/auth/unified/sync';

export async function syncToCentralHub({ serviceUserId, provider, providerId, name = '', profileImage = '' }) {
  try {
    await fetch(CENTRAL_SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // .harooo.co.kr 공통 세션 쿠키 공유용
      body: JSON.stringify({
        service: '내서비스명', // e.g., 'dumpit', 'advent', 'my-new-app'
        serviceUserId: String(serviceUserId),
        provider: provider, // 'kakao' | 'google'
        providerId: String(providerId), // 카카오 회원번호 또는 구글 sub
        name: name,
        profileImage: profileImage,
      }),
    });
  } catch (err) {
    // 중앙 허브 장애가 서비스 자체 로그인을 막지 않도록 비동기 처리
    console.warn('Central sync deferred:', err);
  }
}
```

#### 2단계: 인증 완료 핸들러에 부착
- OAuth 콜백 완료 시점 및 세션 복원 시점에 호출:
```js
// Supabase OAuth 예시
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  const provider = user.app_metadata?.provider || 'kakao';
  const providerId = user.user_metadata?.sub || user.identities?.[0]?.id || user.id;
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.nickname || '';
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

  syncToCentralHub({
    serviceUserId: user.id,
    provider,
    providerId,
    name,
    avatar,
  });
}
```

#### 3단계: (선택) 하루상자 중앙 세션 감지 (SSO)
사용자가 이미 하루상자에서 로그인한 상태인지 확인하고 싶을 때는 하루상자 세션 확인 엔드포인트를 호출한다:
- 엔드포인트: `GET https://box.harooo.co.kr/api/auth/unified/me`
- 옵션: `credentials: 'include'` 필수
- 응답:
  ```json
  {
    "authenticated": true,
    "user": {
      "id": "6af32440db1f16bdd074713c",
      "name": "김송현",
      "provider": "kakao",
      "providerId": "5136613479"
    }
  }
  ```

---

## 4. 주의사항 및 금지 규칙 (AI 준수 사항)

1. **소셜 키 분리 주의**:
   - 카카오 앱 ID가 서로 다른 프로젝트 간에는 카카오 유저 번호(`providerId`)가 다르게 발급된다.
   - 단일 사용자로 통합 식별하려면 동일한 카카오 비즈니스 계정/앱을 공유하거나, 구글(동일 이메일/sub)을 기준으로 매핑해야 한다.
2. **Fail-Safe 보장**:
   - 중앙 허브 동기화(`syncToCentralHub`) 실패로 인해 서비스 본래의 로그인 기능이 중단(Throw)되어서는 안 된다 (`catch` 처리 필수).
3. **CORS 설정**:
   - 하루상자 허브(`apps/web/lib/cors.ts`)의 허용 오리진 목록(`ALLOWED_ORIGINS`)에 새 프로젝트 도메인이 등록되어 있는지 확인한다.

