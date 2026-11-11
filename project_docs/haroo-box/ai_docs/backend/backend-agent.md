# Haroo-box Backend Agent Reference

## 📝 1. 연동 기획 명세
- 하루상자의 공통 백엔드 및 통합 인증 API:
  - Express 백엔드 API (`apps/server`): 게임/서비스별 RESTful 엔드포인트 및 관리자 로직.
  - Next.js App Router API (`apps/web/app/api/auth/unified/*`): 서브도메인 통합 인증 및 동기화 허브.
- Node.js, Express(TypeScript), Next.js, MongoDB(Mongoose 및 원시 드라이버) 기반.
- 공통 보안: Helmet, Strict CORS Allowlist, Rate Limiter 및 NextAuth 기반 세션/JWT 토큰 발급.

## 🤖 2. 목적 및 개발 지침
### 🎯 목적
- 공통 백엔드 보안, 통합 회원(`users` 단일 컬렉션) 파이프라인 개발 및 유지 보수.
### 🛠️ 개발 지침
- 컨트롤러, 라우터, 서비스, 모델 레이어로 책임 분리 적용.
- 통합 인증 API는 `*.harooo.co.kr` 서브도메인 간 CORS 및 `credentials: 'include'` 환경을 전제로 구현.
- 모든 서비스(`box`, `dumpit`, `advent`) 회원은 `users` 컬렉션에서 `(service, providerId)` 복합 유니크 키로 구분해 저장하고, 필요 시 `serviceUserId`를 함께 기록한다.

## 🚨 3. 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 코드는 300줄 초과 금지. 초과 시 서비스 로직 분리.
- **[하드코딩 금지]:** 환경 변수는 `.env`에서 불러와 사용 (`process.env`).
- **[보안]:** 모든 외부 요청에 대해 Rate Limiter와 CORS 정책 엄격 적용.
