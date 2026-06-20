# 데이터베이스 정의서 (`database_schema.md`)

## 1. 개요 및 DB 커넥션 설정
하루상자는 **MongoDB**를 기본 데이터베이스 시스템으로 사용하며, Mongoose ORM을 사용하여 스키마 구조를 관리합니다.
단일 MongoDB 클러스터 내에서 서비스 독립성과 자원 정리를 효율적으로 처리하기 위해 다음과 같이 4개의 데이터베이스로 논리적 분리를 적용하였습니다.

1. **`haroo-box` (메인 DB)**: 유저 프로필 공통 자원 저장
2. **`htsm` (자아탐험 DB)**: 조하리의 창 성향 정보 전용 저장 (30일 TTL 정책)
3. **`uknow` (너잘알 DB)**: 관계형 퀴즈 정보 전용 저장 (자체 만료 정책)
4. **`puzzle` (하루퍼즐 DB)**: 매주 퍼즐 상태, 실시간 진행률, 랭킹 결과 저장

---

## 2. 컬렉션(테이블) 상세 명세

### 1) 메인 데이터베이스 (`haroo-box`)

#### ① `users` 컬렉션
서비스 전체 공통 회원 정보 테이블입니다.
* **Fields**:
  * `_id` (ObjectId): 고유 시스템 PK.
  * `providerId` (String, 필수, Unique): OAuth 제공업체 측의 사용자 고유 ID (카카오 회원 ID 등).
  * `provider` (String, 필수): 가입 경로 (`'kakao' \| 'google' \| 'guest' \| 'test'`).
  * `name` (String): 제공업체에서 수집된 사용자 실제 이름.
  * `nickname` (String): 사용자가 지정한 고유 활동명.
  * `nicknameUpdatedAt` (Date): 닉네임 수정 제한 검증용 변경 일시.
  * `profileImage` (String): 프로필 이미지 URL.
  * `createdAt` (Date) / `updatedAt` (Date): 생성/수정 타임스탬프.
* **Indexes**:
  * `{ providerId: 1 }` (Unique)

---

### 2) 자아탐험 데이터베이스 (`htsm`)

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

---

### 3) 너잘알 데이터베이스 (`uknow`)

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

---

### 4) 하루퍼즐 데이터베이스 (`puzzle`)

#### ① `puzzles` 컬렉션
매주 출제되는 이미지 직소 퍼즐 마스터 테이블입니다.
* **Fields**:
  * `week` (Number, 필수, Unique): 퍼즐 출제 주차 (예: 12회차).
  * `title` (String, 필수): 퍼즐 제목.
  * `imageUrl` (String, 필수): 퍼즐 완성 이미지 주소.
  * `startDate` (Date, 필수) / `endDate` (Date, 필수): 노출 및 플레이 가능 기간.
  * `participantCount` (Number): 랭킹전에 정상 완료 등록한 참가 인원수.
  * `playCount` (Number): 전체 시도 횟수.
  * `archived` (Boolean, 기본값 false): 기간 만료로 아카이브에 수록되었는지 여부.
* **Indexes**:
  * `{ week: 1 }` (Unique)
  * `{ archived: 1 }`

#### ② `puzzleprogresses` 컬렉션
사용자별 진행 중인 퍼즐 상태를 자동 저장(Autosave)하는 테이블입니다.
* **Fields**:
  * `userId` (ObjectId, 필수): `users` 참조 FK.
  * `puzzleId` (ObjectId, 필수): `puzzles` 참조 FK.
  * `progress` (Number, 필수): 진행률 (0~100%).
  * `lastPlayedAt` (Date): 마지막 플레이 시각.
  * `detailState` (Mixed): 개별 조각들의 회전율 및 배치 좌표 정보를 통째로 직렬화하여 담는 유연한 상태 필드.
* **Indexes**:
  * `{ userId: 1, puzzleId: 1 }` (Unique - 유저/퍼즐당 하나만 보존)

#### ③ `puzzleresults` 컬렉션
퍼즐 플레이를 완료한 최종 기록 정보 테이블입니다.
* **Fields**:
  * `userId` (ObjectId, 필수): `users` 참조 FK.
  * `puzzleId` (ObjectId, 필수): `puzzles` 참조 FK.
  * `mode` (String, 필수): `'solo'` (일반 연습) 또는 `'ranked'` (랭킹전).
  * `difficulty` (String, 필수): `'novice' \| 'beginner' \| 'expert'`.
  * `completionTime` (Number, 필수): 완성하는 데 걸린 시간 (밀리초 또는 초).
  * `challengeToken` (String, 필수): 챌린지 무결성 검사용 발행 토큰.
  * `startedAt` / `completedAt` (Date, 필수): 시작 및 완료 시각.
  * `savedAt` (Date): DB 저장 시각.
  * `completed` (Boolean, 기본값 true): 성공 완료 플래그.
* **Indexes**:
  * `{ puzzleId: 1, completionTime: 1, savedAt: 1 }` (초고속 랭킹 보드 정렬)
  * `{ puzzleId: 1, userId: 1 }` (사용자 참여 여부 조회 최적화)

#### ④ `challengetokens` 컬렉션
랭킹전 시작 시 발급되어 비정상적 시간 변조 완료(핵)를 사전 차단하기 위한 1회성 토큰 정보입니다.
* **Fields**:
  * `userId` / `puzzleId` (ObjectId, 필수): 유저 및 퍼즐 참조 FK.
  * `token` (String, 필수, Unique): 고유 챌린지 난수.
  * `issuedAt` (Date): 발급 시각.
  * `expiresAt` (Date, 필수): 토큰 자동 만료 일시.
  * `used` (Boolean, 기본값 false): 사용 완료 여부.
* **Indexes**:
  * `{ token: 1 }` (Unique)
  * `{ expiresAt: 1 }` (TTL: expiresAt 시점 자동 삭제)
