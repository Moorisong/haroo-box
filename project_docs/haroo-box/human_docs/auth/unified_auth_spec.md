# 하루상자 통합 회원·인증 시스템 명세 (Unified Auth Specification)

## 1. 개요
하루상자(Haroo Box)를 중앙 회원·인증 허브로 지정하고, 서브도메인 관계에 있는 서비스(감쓰, 어드벤트 등)가 동일한 회원 체계와 로그인 상태(SSO)를 공유합니다.

- **기본 도메인**: `*.harooo.co.kr` (서브도메인 기반 세션 쿠키 공유)
- **제공 소셜 로그인**: 카카오, Google (2종으로 통일)
- **중앙 회원 DB**: MongoDB (`users`, `unifiedservicememberships`)
- **서비스 데이터베이스 보존**: 감쓰 및 어드벤트의 Supabase Auth UUID와 콘텐츠 소유권(RLS)을 100% 보존

---

## 2. 세션 및 아키텍처 흐름
1. 사용자가 임의의 서비스(예: `dumpit-web.harooo.co.kr`, `advent-calendar.harooo.co.kr`)에서 로그인 시도 시 중앙 하루상자 로그인 화면(`box.harooo.co.kr/login`)으로 이동.
2. 카카오 또는 Google 로그인 완료 시, NextAuth를 통해 `domain: .harooo.co.kr` 속성을 가진 보안 세션 쿠키 발급.
3. 각 서비스로 복귀 시, 서비스의 `unified-session` 모듈이 중앙 세션을 조회하고 서비스 전용 Supabase JWT를 발급받아 RLS와 콘텐츠를 안전하게 연결.
4. 전역 로그아웃 시 공통 도메인 쿠키가 파기되어 모든 서비스에서 일괄 로그아웃 상태 반영.

---

## 3. 핵심 엔드포인트 명세
- `GET /api/auth/unified/session?service=[dumpit|advent]`
  - 현재 중앙 로그인 상태 및 대상 서비스의 매핑 UUID(`serviceUserId`) 반환
- `GET /api/auth/unified/token?service=[dumpit|advent]`
  - 서명된 Supabase Custom Access Token(JWT) 발급
- `POST /api/auth/unified/session`
  - 전역 로그아웃 처리 및 서브도메인 쿠키 무효화
