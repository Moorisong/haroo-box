# 자아탐험 데이터베이스 정의서 (`database_schema.md`)

## 1. 컬렉션(테이블) 상세 명세

### 자아탐험 데이터베이스 (`htsm`)

#### ① `joharitests` 컬렉션
자아탐험 설문지(카드) 마스터 정보 테이블입니다.
* **Fields**:
  * `shareId` (String, 필수, Unique): 공유 링크에 활용되는 나노 아이디(NanoID).
  * `userId` (String): 로그인한 카카오 사용자의 고유 ID.
  * `name` (String): 카드 주인의 노출 이름.
  * `selfKeywords` (Array of String, 필수): 본인이 직접 선택한 본인의 성향 키워드 (최소 3개, 최대 5개 검증).
  * `answerCount` (Number, 기본값 0): 피드백 제보를 한 친구들의 참여수.
  * `isClosed` (Boolean, 기본값 false): 카드 제보 마감 여부.
  * `creatorFingerprint` (String): 비로그인 생성자의 식별 지문 해시.
  * `createdIp` (String) / `createdUserAgent` (String): 보안 감사용 기록.
* **Indexes**:
  * `{ shareId: 1 }` (Unique)
  * `{ userId: 1 }`
  * `{ creatorFingerprint: 1 }`
  * `{ createdAt: 1 }` (TTL: 30일 후 자동 파기)

#### ② `joharianswers` 컬렉션
타인들이 제보한 익명 성향 카드 상세 피드백 리스트입니다.
* **Fields**:
  * `testId` (ObjectId, 필수): `joharitests` 참조 FK.
  * `keywords` (Array of String, 필수): 친구가 관찰한 대상의 성향 키워드 (최소 3개, 최대 5개).
  * `fingerprintHash` (String, 필수): 제보자의 중복 참여 방지용 지문 해시.
  * `ip` (String) / `userAgent` (String): 악성 도배 필터링용 정보.
* **Indexes**:
  * `{ testId: 1, fingerprintHash: 1 }` (Unique - 중복 응답 완전 방어)
  * `{ createdAt: 1 }` (TTL: 30일 후 자동 파기)

#### ③ `htsmstats` 컬렉션
일별 누적 생성 및 제보 현황을 저장하는 통계 테이블입니다.
* **Fields**:
  * `date` (Date, 필수, Unique): 통계 대상 일자.
  * `newTests` / `newAnswers` (Number): 당일 추가된 테스트/제보 수.
  * `totalTests` / `totalAnswers` (Number): 당일 기준 전체 누적 수.
