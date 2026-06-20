# 자아탐험 백엔드 API 명세 (`backend_spec.md`)

## 1. 엔드포인트(API) 명세 목록

### 자아탐험 (HTSM API - `/api/htsm`)
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

## 2. Rate Limiter (요청 제안 미들웨어)
* 무분별한 API 요청 및 크롤러, 스팸 방지를 위해 `express-rate-limit`와 `rate-limit-mongo`를 결합하여 IP 기반 스토리지 한도 제한을 수행합니다.
* 테스트 생성은 IP당 2시간에 최대 5회, 시간당 최대 30회 제한. 응답 제보는 10초에 최대 5회, 특정 대상(ShareId)당 1분에 최대 3회 제한.
