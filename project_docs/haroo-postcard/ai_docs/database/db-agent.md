# Haroo Postcard DB Agent Reference

## 📝 1. 연동 기획 명세 (postcard-database.md)
- MongoDB 및 Mongoose ORM을 사용한 하루엽서 데이터 저장소 모델 정의.
- URL 공유에 특화된 10자리 고유 식별자(`_id`) 지정.
- TTL 관리를 위한 만료 시각(`expires_at`) 속성 설계 및 인덱싱.

---

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- Mongoose 스키마 검증 필터링 및 데이터 무결성 보장.
- 대량 조회와 만료 검사에 특화된 인덱스 설계 및 효율적인 데이터 조작.

### 📦 패키지 및 타깃 클래스 경로 구조
- 모델 경로: `apps/server/src/models/Postcard.ts`
- 타입 정의: `apps/server/src/types/postcard.ts`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **Mongoose 스키마 모델 설계**:
   - `_id`는 자동 UUID 대신, 가독성 높은 10자리 nanoid 문자열을 주입받아 저장하도록 선언.
   - `image_path`는 서버의 업로드 물리 파일 절대/상대 경로로서 필수(`required`) 문자열 설정.
   - `filter_type`은 Enum 제약 조건(`'vintage' | 'monotone' | 'film-grain' | 'none'`) 설정.
   - `message`는 글자수 최대 150자 제한 검증(`maxlength: 150`) 설정.
   - `font_family`는 Enum 제약 조건(`'font-1' | 'font-2' | 'font-3' | 'font-4' | 'font-5'`) 설정.
   - `youtube_id`는 11자리 비디오 ID 검증 정규식 또는 기본 trim 옵션 제공.
   - `created_at`은 `Date.now`를 기본값으로 갖는 Date 타입 지정.
   - `expires_at`은 생성 시점(`created_at`)을 기준으로 3일(72시간)이 유동적으로 계산되어 삽입되도록 함수형 기본값(`default`) 바인딩.
2. **인덱스 설정**:
   - `expires_at`에 오름차순 단일 인덱스(`expires_at: 1`)를 생성하여 만료 엽서 삭제 쿼리 시 풀스캔을 방지하도록 최적화.

---

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]**: Mongoose 스키마 설정 코드는 타입 정의 파일과 독립적으로 분리하고, 단일 파일 300줄 한계를 절대 엄수할 것.
- **[플랫폼 락]**: Node.js 백엔드 Mongoose ORM 환경 준수.
- **[하드코딩 금지]**: 스키마 구조 내의 Enum 필터 및 폰트 목록은 공통 타입/상수 파일에서 읽어와 공유할 수 있도록 모듈화.

---

## 🧪 4. 필수 테스트 케이스 및 검증 시나리오
- **[자가 진단 테스트 발굴]**: 메시지 필드가 150글자를 초과하여 `save()`를 시도할 때, Mongoose validation error가 정상적으로 검출되는지 검증.
- **[가짜 구현 방지]**: 테스트 데이터베이스 연동 및 롤백 테스트 수행 시, mock 객체의 유효성 스키마를 온전히 검증하도록 설계.
- **[분기 및 예외 케이스 검증]**:
  - `filter_type`이나 `font_family`에 스키마에 정의되지 않은 잘못된 문자열을 강제 삽입하여 `save()` 시 에러를 뿜는지 검증.
  - `expires_at` 날짜 계산이 정상적으로 3일 뒤 시점으로 타임스탬프 계산이 반영되는지 로직 유닛 테스트 작성.
- **[설명 주석 및 승인 강제]**: 스키마 내부 유효성 검사 함수 및 인덱스 배치 명세 상단에 가독성 높은 주석 표기 및 사용자 승인 적용.
