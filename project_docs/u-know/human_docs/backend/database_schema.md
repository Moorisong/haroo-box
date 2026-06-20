# 너잘알 데이터베이스 정의서 (`database_schema.md`)

## 1. 컬렉션(테이블) 상세 명세

### 너잘알 데이터베이스 (`uknow`)

#### ① `uknowtests` 컬렉션
너잘알 퀴즈 정보 테이블입니다.
* **Fields**:
  * `token` (String, 필수, Unique): 공유용 토큰 식별값.
  * `questions` (Array): 출제 문제 리스트. 개별 요소는 `{ question: String, predictedAnswer: String }` 형태.
  * `security` (Object): `{ fingerprintHash: String, ipHash: String }`.
  * `expiresAt` (Date, 필수): 만료 처리 일시.
* **Indexes**:
  * `{ token: 1 }` (Unique)
  * `{ expiresAt: 1 }` (TTL: `expiresAt` 시점에 문서 자동 삭제)

#### ② `uknowresponses` 컬렉션
친구가 출제자의 퀴즈를 풀고 기록된 응답 정보 테이블입니다.
* **Fields**:
  * `testId` (ObjectId, 필수): `uknowtests` 참조 FK.
  * `responderName` (String, 필수): 참가자가 입력한 닉네임.
  * `answers` (Array): 참가자가 제출한 정답 선택지 목록. `{ questionIndex: Number, actualAnswer: String }`.
  * `security` (Object): `{ fingerprintHash: String, ipHash: String }`.
  * `expiresAt` (Date, 필수): 만료 처리 일시.
* **Indexes**:
  * `{ testId: 1 }`
  * `{ expiresAt: 1 }` (TTL: `expiresAt` 시점에 문서 자동 삭제)
