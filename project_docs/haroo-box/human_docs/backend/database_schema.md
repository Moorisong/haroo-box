# 공통 데이터베이스 정의서 (`database_schema.md`)

## 1. 개요 및 DB 커넥션 설정
하루상자는 **MongoDB**를 기본 데이터베이스 시스템으로 사용하며, Mongoose ORM 및 네이티브 MongoDB 드라이버를 통해 스키마 구조를 관리합니다.
단일 MongoDB 클러스터 내에서 서비스 독립성과 자원 정리를 효율적으로 처리하기 위해 다음과 같이 4개의 데이터베이스로 논리적 분리를 적용하였습니다.

1. **`haroo-box` (메인 DB)**: 유저 프로필 및 서비스 간 통합 회원 자원 저장
2. **`htsm` (자아탐험 DB)**: 조하리의 창 성향 정보 전용 저장 (30일 TTL 정책)
3. **`uknow` (너잘알 DB)**: 관계형 퀴즈 정보 전용 저장 (자체 만료 정책)
4. **`puzzle` (하루퍼즐 DB)**: 매주 퍼즐 상태, 실시간 진행률, 랭킹 결과 및 다국어 사전 저장

---

## 2. 컬렉션(테이블) 상세 명세

### 메인 데이터베이스 (`haroo-box`)

#### ① `users` 컬렉션
서비스 전체 공통 회원 본체(Unique Person) 테이블입니다.
* **Fields**:
  * `_id` (ObjectId): 고유 시스템 PK.
  * `providerId` (String, 필수, Unique): OAuth 제공업체 측의 사용자 고유 ID (카카오 회원 ID, `google:sub` 등).
  * `provider` (String, 필수): 가입 경로 (`'kakao' | 'google' | 'guest' | 'test'`).
  * `name` (String): 제공업체에서 수집된 사용자 실제 이름/닉네임.
  * `nickname` (String): 사용자가 지정한 고유 활동명.
  * `nicknameUpdatedAt` (Date): 닉네임 수정 제한 검증용 변경 일시.
  * `profileImage` (String): 프로필 이미지 URL.
  * `createdAt` (Date) / `updatedAt` (Date): 생성/수정 타임스탬프.
* **Indexes**:
  * `{ providerId: 1 }` (Unique)

#### ② `unifiedservicememberships` 컬렉션
하루상자 생태계 내 각 서브 서비스(감쓰, 어드벤트, 신규 서비스 등)별 회원 가입 및 활동 증명 테이블입니다.
* **Fields**:
  * `_id` (ObjectId): 고유 PK.
  * `service` (String, 필수): 서비스 식별자 (`'dumpit' | 'advent' | ...`).
  * `serviceUserId` (String, 필수): 해당 서브 서비스 로컬 DB(Supabase Auth 등)의 사용자 고유 ID (UUID).
  * `originalUserId` (ObjectId, 필수): 중앙 `users` 컬렉션 문서의 `_id`.
  * `provider` (String, 필수): 소셜 인증 제공자 (`'kakao' | 'google'`).
  * `providerId` (String, 필수): 소셜 인증 제공자 식별자.
  * `name` (String): 해당 서비스에서 동기화된 유저 표시 이름.
  * `profileImage` (String): 유저 프로필 사진 URL.
  * `createdAt` (Date) / `updatedAt` (Date): 최초 등록 및 최근 동기화 시각.
* **Indexes**:
  * `{ service: 1, serviceUserId: 1 }` (Unique)
  * `{ originalUserId: 1 }`
  * `{ service: 1 }`
