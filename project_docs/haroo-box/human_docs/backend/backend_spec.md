# 공통 백엔드 아키텍처 및 미들웨어 명세 (`backend_spec.md`)

## 1. 백엔드 아키텍처 개요
하루상자 백엔드는 **Node.js, Express(TypeScript)**를 기반으로 개발된 계층형 아키텍처(Layered Architecture) 구조를 띠고 있습니다.
서버는 보안이 적용된 API 제공과 DB 연동을 담당하며, 요청 흐름에 유연한 처리를 지원하기 위해 컨트롤러, 라우터, 서비스, 모델 레이어로 깔끔히 분리되어 있습니다.

```text
Request ──> Express Router ──> Middleware (CORS/Rate-limit/Auth) ──> Controller ──> Service ──> MongoDB/Mongoose
```

## 2. 보안 및 미들웨어 (Middlewares)

* **Helmet**: HTTP 헤더 보안 설정을 자동 적용하여 취약점을 방어합니다.
* **CORS (Cross-Origin Resource Sharing)**:
  * 허용 도메인: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`, `https://box.haroo.site` 및 `.env` 파일의 `CLIENT_URL`.
  * 인증 정보(`credentials: true`)를 수용하도록 수동 설정하여 프론트엔드의 세션 쿠키를 안정적으로 처리합니다.
* **인증 미들웨어 (`puzzleAuth`)**:
  * NextAuth의 인증 정보(Header의 Authorization Bearer 토큰 또는 세션 쿠키)를 서버 자체에서 복호화 및 검증하여 요청 유저(`req.user`)의 신원을 파악합니다.
