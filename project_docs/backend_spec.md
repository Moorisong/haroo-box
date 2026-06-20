# 백엔드 아키텍처 및 API 명세 (`backend_spec.md`)

## 1. 백엔드 아키텍처 개요
하루상자 백엔드는 **Node.js, Express(TypeScript)**를 기반으로 개발된 계층형 아키텍처(Layered Architecture) 구조를 띠고 있습니다.
서버는 보안이 적용된 API 제공과 DB 연동을 담당하며, 요청 흐름에 유연한 처리를 지원하기 위해 컨트롤러, 라우터, 서비스, 모델 레이어로 깔끔히 분리되어 있습니다.

```text
Request ──> Express Router ──> Middleware (CORS/Rate-limit/Auth) ──> Controller ──> Service ──> MongoDB/Mongoose
```

---

## 2. 보안 및 미들웨어 (Middlewares)

* **Helmet**: HTTP 헤더 보안 설정을 자동 적용하여 취약점을 방어합니다.
* **CORS (Cross-Origin Resource Sharing)**:
  * 허용 도메인: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`, `https://box.haroo.site` 및 `.env` 파일의 `CLIENT_URL`.
  * 인증 정보(`credentials: true`)를 수용하도록 수동 설정하여 프론트엔드의 세션 쿠키를 안정적으로 처리합니다.
* **Rate Limiter (요청 제안 미들웨어)**:
  * 무분별한 API 요청 및 크롤러, 스팸 방지를 위해 `express-rate-limit`와 `rate-limit-mongo`를 결합하여 IP 기반 스토리지 한도 제한을 수행합니다.
  * **자아탐험(HTSM)**: 테스트 생성은 IP당 2시간에 최대 5회, 시간당 최대 30회 제한. 응답 제보는 10초에 최대 5회, 특정 대상(ShareId)당 1분에 최대 3회 제한.
  * **너잘알(U-Know)**: 테스트 생성은 10분에 최대 5회, 시간당 최대 20회 제한. 답변 제출은 1분에 최대 15회 제한.
* **인증 미들웨어 (`puzzleAuth`)**:
  * NextAuth의 인증 정보(Header의 Authorization Bearer 토큰 또는 세션 쿠키)를 서버 자체에서 복호화 및 검증하여 요청 유저(`req.user`)의 신원을 파악합니다.
* **토큰 검증 미들웨어 (`verifyChallenge`)**:
  * 하루퍼즐 플레이 랭킹 등록 요청 시, 유저가 서버로부터 정당하게 챌린지 시작 토큰(`challengeToken`)을 발급받아 사용한 것이 맞는지 이중 검증합니다.

---

## 3. 엔드포인트(API) 명세 목록

### 1) 자아탐험 (HTSM API - `/api/htsm`)
* **`GET /proof-token`**:
  * 비로그인 사용자가 익명 피드백을 전달할 때 클라이언트를 식별하고 중복 응답을 검사하기 위해 단방향 Fingerprint 해싱용 토큰 발급.
* **`POST /tests`**:
  * 나만의 HTSM 테스트 카드 생성. 자신의 성향 키워드(3~5개)를 입력하여 고유 링크(`shareId`) 발행.
* **`POST /answers`**:
  * 친구의 HTSM 테스트 고유 링크에 접속해 친구의 키워드를 익명으로 제보 및 저장.
* **`GET /result/:shareId`**:
  * 수집된 답변 데이터를 조하리의 창(Johari Window) 기준으로 계산하여 분석 통계 정보 반환.
* **`GET /tests/:shareId`**:
  * 피제보자의 이름 및 공개 상태 정보 조회.
* **`GET /my-test/:userId`**:
  * 특정 유저가 생성했던 테스트 목록을 조회.

### 2) 너잘알 (U-Know API - `/api/u-know`)
* **`POST /create`**:
  * 출제자가 퀴즈 문항(1~10개)과 본인의 정답을 기재하여 고유한 링크 토큰 생성.
* **`POST /submit`**:
  * 친구가 퀴즈를 풀고 본인이 고른 선택지 답변 제출.
* **`GET /result/:token`**:
  * 출제자와 친구의 답변을 1:1 대조해 정확한 친밀도 백분율 점수를 계산하고 맞춘 문제와 틀린 문제 통계 정보 제공.

### 3) 하루퍼즐 (Puzzle API - `/api/puzzle`)
* **`GET /current`**:
  * 이번 주 신규 퍼즐 이미지, 차수 정보, 시작/종료 일시 조회.
* **`GET /archive`**:
  * 지난주에 종료된 모든 퍼즐의 이미지와 차수 목록 조회.
* **`GET /stats`**:
  * 누적 참여자 수 및 플레이 횟수 통계 반환.
* **`GET /rankings/current`**:
  * 이번 주 퍼즐 클리어 기록이 짧은 순서대로 랭킹 리스트 조회.
* **`POST /challenge/start`**:
  * 퍼즐 랭킹전 플레이 시작 시 유효성 검사용 1회성 챌린지 토큰(`challengeToken`) 발급.
* **`POST /results`**:
  * 클리어 성공 시 완료 기록(초 단위)과 챌린지 토큰을 함께 전달받아 무결성 통과 후 랭킹 등록.
* **`POST /progress` / `GET /progress`**:
  * 퍼즐 맞추는 중간 상태를 실시간(Autosave)으로 저장하고 나중에 이어서 맞출 수 있도록 진행률 및 세부 상태 보존/조회.
