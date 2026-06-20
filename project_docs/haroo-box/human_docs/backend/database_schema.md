# 공통 데이터베이스 정의서 (`database_schema.md`)

## 1. 개요 및 DB 커넥션 설정
하루상자는 **MongoDB**를 기본 데이터베이스 시스템으로 사용하며, Mongoose ORM을 사용하여 스키마 구조를 관리합니다.
단일 MongoDB 클러스터 내에서 서비스 독립성과 자원 정리를 효율적으로 처리하기 위해 다음과 같이 4개의 데이터베이스로 논리적 분리를 적용하였습니다.

1. **`haroo-box` (메인 DB)**: 유저 프로필 공통 자원 저장
2. **`htsm` (자아탐험 DB)**: 조하리의 창 성향 정보 전용 저장 (30일 TTL 정책)
3. **`uknow` (너잘알 DB)**: 관계형 퀴즈 정보 전용 저장 (자체 만료 정책)
4. **`puzzle` (하루퍼즐 DB)**: 매주 퍼즐 상태, 실시간 진행률, 랭킹 결과 저장

## 2. 컬렉션(테이블) 상세 명세

### 메인 데이터베이스 (`haroo-box`)

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
