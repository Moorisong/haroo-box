# 하루상자 통합 회원·인증 시스템 명세 (Unified Auth Specification)

## 1. 개요
하루상자(Haroo Box)를 중앙 회원·인증 허브로 지정하고, 서브도메인 관계에 있는 서비스(감쓰, 어드벤트 등)가 동일한 회원 체계와 로그인 상태(SSO)를 공유합니다.

- **기본 도메인**: `*.harooo.co.kr` (서브도메인 기반 세션 쿠키 공유)
- **제공 소셜 로그인**: 카카오, Google (2종으로 통일)
- **중앙 회원 DB**: MongoDB (`users` 단일 컬렉션, `{ service, providerId }` 복합 유니크 키)
- **서비스 데이터베이스 보존**: 감쓰 및 어드벤트의 Supabase Auth UUID와 콘텐츠 소유권(RLS)을 100% 보존
- **독립 Fail-Safe**: 중앙 허브 지연이나 장애 발생 시에도 각 서브 서비스의 자체 로그인 기능은 정상 유지

---

## 2. 세션 및 아키텍처 흐름
1. **직접 로그인 및 동기화**:
   - 사용자가 서브 서비스(감쓰, 어드벤트)에서 네이티브 소셜 로그인(카카오/구글)을 완료하면 각 서비스 로컬 DB 세션이 발급됩니다.
   - 프론트엔드가 백그라운드로 `POST /api/auth/unified/sync`를 호출하여 중앙 MongoDB(`users` 단일 컬렉션)에 `(service, providerId)` 기준으로 서비스별 유저 식별자(`serviceUserId`) 및 프로필 정보(`name`, `profileImage`)를 최신화하고 `.harooo.co.kr` 도메인의 공유 세션 쿠키를 수령합니다.
2. **중앙 허브 통한 SSO 감지**:
   - 서브 서비스 접속 시 `GET /api/auth/unified/me`를 호출하여 이미 하루상자 또는 타 서비스에서 로그인된 활성 세션이 있는지 즉시 판별할 수 있습니다.
3. **전역 로그아웃**:
   - `POST /api/auth/unified/session` 호출 시 공통 도메인 세션 쿠키가 파기되어 모든 서비스에서 일괄 로그아웃 상태가 반영됩니다.

---

## 3. 핵심 엔드포인트 명세

### 1) `GET /api/auth/unified/me`
- **목적**: 현재 도메인 공유 세션 로그인 상태 및 유저 프로필 간이 확인.
- **Header/Options**: `credentials: 'include'`
- **응답**:
  ```json
  {
    "authenticated": true,
    "user": {
      "id": "6af32440db1f16bdd074713c",
      "name": "홍길동",
      "provider": "kakao",
      "providerId": "5136613479"
    }
  }
  ```

### 2) `POST /api/auth/unified/sync`
- **목적**: 서브 서비스 로그인 직후 중앙 허브에 회원 정보를 동기화하고 멤버십 등록.
- **Request Body**:
  ```json
  {
    "service": "dumpit",
    "serviceUserId": "0860a303-7425-4090-bbc6-13f74fa37b0f",
    "provider": "kakao",
    "providerId": "5136613479",
    "name": "홍길동",
    "profileImage": "https://..."
  }
  ```
- **처리 내용**:
  - `users` 컬렉션: `(service, providerId)` 기준 upsert (`provider`, `serviceUserId`, `name`, `profileImage`, `updatedAt` 갱신)

### 3) `GET /api/auth/unified/session?service=[dumpit|advent]`
- **목적**: 현재 중앙 로그인 상태 및 대상 서비스의 매핑 UUID(`serviceUserId`) 반환.

### 4) `GET /api/auth/unified/token?service=[dumpit|advent]`
- **목적**: 중앙 세션을 기반으로 서브 서비스 Supabase에 즉시 접속 가능한 서명된 Supabase Custom Access Token(JWT) 발급. 미가입 유저의 경우 신규 UUID 생성 및 Supabase Admin API를 통한 JIT 계정 프로비저닝 수행.

### 5) `POST /api/auth/unified/session`
- **목적**: 전역 로그아웃 처리 및 서브도메인 쿠키 무효화.

### 6) `DELETE /api/auth/unified/session?service=[dumpit|advent]`
- **목적**: 특정 서브 서비스 회원 탈퇴 시 중앙 MongoDB에서 해당 서비스의 레코드만 삭제하고 타 서비스(`box` 등) 계정은 보존.

---

## 4. 계정 충돌 및 예외 처리 정책
- **로컬 세션 보호 & 계정 전환 띠 배너**: 서브 서비스에 이미 로그인된 로컬 세션이 있고 중앙 세션의 계정이 다를 경우, 로컬 세션을 강제 덮어쓰지 않고 상단 띠 배너(`"이미 [구글|카카오](이름)로 로그인한 이력이 있어요. 해당 계정으로 전환할까요?"`)를 통해 사용자 선택에 따라 전환합니다.
- **하루상자 JIT 자동 프로비저닝**: 어드벤트/감쓰에서 로그인 후 하루상자에 처음 진입 시 `service: 'box'` 레코드를 자동 생성합니다.
