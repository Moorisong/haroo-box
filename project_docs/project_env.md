# 프로젝트 환경 및 세팅 구성 (`project_env.md`)

## 1. 런타임 및 개발 도구
* **런타임 환경**: Node.js v20 (서버 배포 셸 스크립트 기준)
* **패키지 매니저**: `npm` (프로젝트별 `package-lock.json` 기반 관리)
* **주요 언어**: TypeScript (프론트엔드/백엔드 공통 채택)

---

## 2. 모노레포 구조 및 핵심 의존성

본 프로젝트는 `apps/` 폴더 하위에 프론트엔드 및 백엔드가 결합된 모노레포 구조로 되어 있습니다.

### 1) 프론트엔드 웹 앱 (`apps/web`)
* **프레임워크**: Next.js 16.1.3 (App Router 사용)
* **핵심 라이브러리**:
  * `react` / `react-dom` (v19.2.3)
  * `zustand` (v5.0.10) - 글로벌 상태 관리
  * `next-auth` (v4.24.13) - 카카오 간편 로그인 등 인증 처리
  * `three` / `@react-three/fiber` / `@react-three/drei` / `cannon-es` / `@react-three/cannon` - 3D 렌더링 및 물리 엔진 (하루퍼즐 등)
  * `@fingerprintjs/fingerprintjs` - 비로그인 유저 식별용 브라우저 지문 수집
  * `crypto-js` - 데이터 암호화/해싱
* **스타일링**: Tailwind CSS v3 & PostCSS (README 상에는 Vanilla CSS 중심이나 패키지에 포함됨)
* **테스트 도구**: Playwright (E2E 테스트)

### 2) 백엔드 API 서버 (`apps/server`)
* **프레임워크**: Express v5.2.1
* **핵심 라이브러리**:
  * `mongoose` (v9.1.4) - MongoDB ORM
  * `helmet` (v8.1.0) - HTTP 보안 헤더 설정
  * `cors` (v2.8.5) - 교차 출처 리소스 공유 허용
  * `express-rate-limit` / `rate-limit-mongo` - 디도스 방지 및 요청 제한
  * `nanoid` (v3.3.11) - 고유 토큰/식별자 생성
* **개발 도구**: `ts-node` (v10.9.2), `nodemon` (v3.1.11)

### 3) 교사 지원 툴 (`apps/toby`)
* **프레임워크**: Vite v7.2.4 + React v19.2.0
* **핵심 라이브러리**:
  * `react-router-dom` (v7.11.0) - 싱글 페이지 앱 라우팅
  * `html-to-image` (v1.11.13) - 화면 캡처 및 이미지 다운로드 지원

---

## 3. 환경 변수(`.env`) 구성 명세

### 1) `apps/web/.env` (프론트엔드 설정)
| 변수명 | 설명 | 예시값/플레이스홀더 |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | 백엔드 API 서버 주소 | `http://localhost:3000` (개발용) 또는 운영 서버 주소 |
| `MONGODB_URI` | 메인 데이터베이스 연결 URI | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>` |
| `NEXTAUTH_URL` | NextAuth 서비스 도메인 기본 경로 | `http://localhost:3001` (개발용) 또는 운영 사이트 주소 |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 비밀키 | 임의의 무작위 생성 비밀키 문자열 |
| `KAKAO_CLIENT_ID` | 카카오 개발자 앱의 REST API 키 | 카카오 디벨로퍼스 앱 REST API 키 값 |
| `KAKAO_CLIENT_SECRET` | 카카오 개발자 앱의 Client Secret | 카카오 디벨로퍼스 앱 보안 비밀키 값 |
| `NEXT_PUBLIC_KAKAO_API_KEY` | 카카오 공유 SDK 전용 JavaScript 키 | 카카오 디벨로퍼스 앱 JavaScript 키 값 |
| `NEXT_PUBLIC_SIGNATURE_SECRET` | API 응답 위변조 방지용 서명 비밀키 | 임의의 무작위 생성 비밀키 문자열 |
| `GAME_SESSION_SECRET` | 게임 내 비로그인 세션 토큰 생성용 키 | 임의의 무작위 생성 비밀키 문자열 |
| `NEXT_PUBLIC_ADMIN_KAKAO_ID` | 관리자 로그인용 카카오 사용자 고유 ID | 관리자 카카오 계정 고유 회원번호 |

### 2) `apps/server/.env` (백엔드 설정)
| 변수명 | 설명 | 예시값/플레이스홀더 |
| :--- | :--- | :--- |
| `PORT` | 백엔드 포트 | `3000` |
| `JWT_SECRET` | 백엔드 자체 토큰 인증용 JWT 시크릿 키 | 임의의 무작위 생성 비밀키 문자열 |
| `MONGODB_URI` | 메인 DB 연결 URI (haroo-box) | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/haroo-box` |
| `HTSM_MONGODB_URI` | 자아탐험(HTSM) 전용 DB 연결 URI | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/htsm` |
| `SIGNATURE_SECRET` | 프론트엔드와 공유하는 서명 비밀키 | `NEXT_PUBLIC_SIGNATURE_SECRET`과 동일한 값 |
| `CLIENT_URL` | CORS 허용할 프론트엔드 클라이언트 주소 | `http://localhost:3001` (개발용) 또는 운영 프론트엔드 도메인 |

---

## 4. 로컬 빌드 및 실행 가이드

### 1) 의존성 설치 (전체 공통)
모노레포의 각 디렉토리로 이동하여 의존성을 설치합니다.
```bash
# 백엔드 서버
cd apps/server && npm install

# 프론트엔드 웹 앱
cd ../web && npm install

# 토비 교사 지원 도구
cd ../toby && npm install
```

### 2) 로컬 개발 서버 실행
```bash
# 백엔드 서버 실행 (Port 3000)
cd apps/server
npm run dev

# 프론트엔드 실행 (Port 3001 및 Toby dev 연동)
# concurrently를 통해 next dev와 toby dev를 동시에 띄웁니다.
cd apps/web
npm run dev
```

### 3) 빌드 및 배포본 실행
```bash
# 백엔드 빌드 및 실행
cd apps/server
npm run build
npm start

# 프론트엔드 빌드 및 실행
cd apps/web
npm run build
npm start
```
