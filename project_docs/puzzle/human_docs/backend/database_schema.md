# 하루퍼즐 데이터베이스 정의서 (`database_schema.md`)

## 1. 컬렉션(테이블) 상세 명세

### 하루퍼즐 데이터베이스 (`puzzle`)

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
