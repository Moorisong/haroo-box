# Haroo-box Backend Agent Reference

## 📝 1. 연동 기획 명세
- 하루상자의 공통 백엔드 API (`apps/server`).
- Node.js, Express(TypeScript), MongoDB(Mongoose) 기반.
- 공통 미들웨어(Helmet, CORS, Rate Limiter) 및 NextAuth 기반 인증 처리 담당.

## 🤖 2. 목적 및 개발 지침
### 🎯 목적
- 공통 백엔드 보안 및 인증 아키텍처 개발/유지 보수.
### 🛠️ 개발 지침
- 컨트롤러, 라우터, 서비스, 모델 레이어로 책임 분리 적용.
- API 엔드포인트 설계 시 RESTful 원칙 준수.

## 🚨 3. 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 코드는 300줄 초과 금지. 초과 시 서비스 로직 분리.
- **[하드코딩 금지]:** 환경 변수는 `.env`에서 불러와 사용 (`process.env`).
- **[보안]:** 모든 외부 요청에 대해 Rate Limiter와 CORS 정책 엄격 적용.
