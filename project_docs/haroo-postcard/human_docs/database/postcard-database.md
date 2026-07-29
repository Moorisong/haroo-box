# 🗄️ 하루엽서 데이터베이스 설계 명세서 (postcard-database.md)

본 문서는 하루엽서 서비스의 데이터 저장소 구축을 위한 MongoDB 및 Mongoose ORM 사양 명세입니다.

---

## 🎯 1. 데이터 저장소 선정 및 설계 원칙
- **DBMS**: MongoDB (프로젝트의 공통 데이터베이스 런타임 환경 연동)
- **ORM**: Mongoose (Node.js 환경 내 데이터 모델 검증 및 관계 정의)
- **TTL 데이터 관리**: Document 단위에 만료 일시(`expires_at`)를 지정하여 보관하고, 주기적 배치 삭제와 쿼리 필터링을 병행하여 자원 소모 방지.

---

## 📊 2. 데이터베이스 스키마 정의 (Schema & Validation)

### Collection: `postcards`

| 필드명 (Field) | 타입 (Mongoose Type) | 필수 여부 | 기본값 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `String` | **필수** | (자동생성) | 10자리 난독화 고유 문자열 (URL에 사용, nanoid(10)) |
| `image_path` | `String` | **필수** | 없음 | 물리 이미지 서버 내 상대 경로 (`uploads/postcards/파일명`) |
| `filter_type` | `String` | **필수** | `'none'` | 엽서 필터 구분 (`vintage` \| `monotone` \| `film-grain` \| `none`) |
| `message` | `String` | **필수** | 없음 | 사용자가 작성한 문구 (최대 150자 제한 검증) |
| `font_family` | `String` | **필수** | `'font-1'` | 선택된 폰트 타입 식별자 (`font-1` ~ `font-5`) |
| `youtube_id` | `String` | 옵션 | `null` | 유튜브 비디오 고유 11자리 ID |
| `created_at` | `Date` | **필수** | `Date.now` | 엽서 최초 생성 시각 |
| `expires_at` | `Date` | **필수** | `created_at` + 2일 | 엽서 파기 만료 예정 시각 (48시간) |

---

## 🛠️ 3. Mongoose 스키마 코드 스니펫 예시
```javascript
const mongoose = require('mongoose');

const PostcardSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  image_path: {
    type: String,
    required: true,
    trim: true
  },
  filter_type: {
    type: String,
    required: true,
    enum: ['vintage', 'monotone', 'film-grain', 'none'],
    default: 'none'
  },
  message: {
    type: String,
    required: true,
    maxlength: 150
  },
  font_family: {
    type: String,
    required: true,
    enum: ['font-1', 'font-2', 'font-3', 'font-4', 'font-5'],
    default: 'font-1'
  },
  youtube_id: {
    type: String,
    default: null,
    trim: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  expires_at: {
    type: Date,
    required: true,
    // 생성 시점 기준 72시간 계산 후 주입
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) 
  }
});

// 조회 최적화를 위한 인덱스 설정
PostcardSchema.index({ expires_at: 1 });

module.exports = mongoose.models.Postcard || mongoose.model('Postcard', PostcardSchema);
```

---

## 🔍 4. 쿼리 최적화 및 인덱스 전략
- **조회 인덱스**: `expires_at`에 단일 필드 인덱스를 추가하여 만료 데이터를 찾는 쿼리 속도를 향상시킵니다.
- **클린업 쿼리**:
  - `deleteMany({ expires_at: { $lt: new Date() } })` 쿼리를 매일 배치 주기적으로 작동시킵니다.
