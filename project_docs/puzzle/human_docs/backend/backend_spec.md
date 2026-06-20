# 하루퍼즐 백엔드 API 명세 (`backend_spec.md`)

## 1. 엔드포인트(API) 명세 목록

### 하루퍼즐 (Puzzle API - `/api/puzzle`)
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

## 2. 토큰 검증 미들웨어 (`verifyChallenge`)
* 하루퍼즐 플레이 랭킹 등록 요청 시, 유저가 서버로부터 정당하게 챌린지 시작 토큰(`challengeToken`)을 발급받아 사용한 것이 맞는지 이중 검증합니다.
