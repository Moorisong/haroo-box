# Haroo Postcard Server Agent Reference

## 📝 1. 연동 기획 명세 (postcard-backend.md, postcard-database.md)
- Express 백엔드 API 서비스와 로컬 파일 시스템 리소스 관리 모듈.
- 신규 엽서 생성(`POST /api/postcards`) 및 단일 조회(`GET /api/postcards/:id`) 라우팅 구현.
- 매일 새벽 4시, 72시간이 만료된 DB 레코드 및 로컬 저장소 파일을 일괄적으로 삭제 처리하는 Cron CleanUp 스크립트 구축.

---

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- 이미지 유효성(크기, 포맷) 검사 및 파일의 난독화 저장을 지원하는 무중단 백엔드 API 구축.
- 메모리 누수 없는 청소 스크립트를 구현하여 스토리지 자원 확보 및 희소성 제어.

### 📦 패키지 및 타깃 클래스 경로 구조
- 라우팅 모듈: `apps/server/src/routes/postcard.ts`
- 컨트롤러 모듈: `apps/server/src/controllers/postcardController.ts`
- 파일 미들웨어: `apps/server/src/middleware/uploadPostcard.ts` (multer 연동)
- 배치 스크립트: `apps/server/src/cron/cleanupPostcards.ts`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **Multer 업로드 및 미들웨어 설계**:
   - `multer`를 이용하여 `apps/server/uploads/postcards/` 목적지 설정.
   - 최대 파일 사이즈 5MB, 허용 확장자 필터링(`image/jpeg`, `image/png`, `image/webp`).
   - 저장 시 중복되지 않는 파일명 생성 (`nanoid` + 타임스탬프).
2. **컨트롤러 구현**:
   - `createPostcard`: FormData 수신 및 Mongoose 모델 인스턴스 생성/저장.
   - `getPostcard`: 10자리 고유 ID 조회 후 만료 여부(`expires_at < new Date()`)에 따라 410 Gone 또는 200 OK 응답 처리.
3. **배치 삭제 스크립트(Cron)**:
   - `node-cron` 패키지를 설치 및 세팅하여 매일 새벽 4시(`0 4 * * *`)에 동작 예약.
   - **배치 알고리즘**:
     - `expires_at < NOW` 에 부합하는 삭제 대상 DB 도큐먼트 전체 로딩.
     - 로딩된 각 도큐먼트의 `image_path` 값을 기준으로 `fs.promises.unlink`를 수행하여 디스크 물리 파일 삭제.
     - 물리 파일이 성공적으로 삭제되었거나 이미 존재하지 않는 상태라면 DB에서 `deleteMany` 처리.
     - 트랜잭션 예외 처리를 철저히 하여 스크립트 정지 방지.

---

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]**: 컨트롤러 및 Cron 배치 모듈은 별도 파일로 완전히 분할하고, 각각 300줄 한계를 절대 초과하지 말 것.
- **[플랫폼 락]**: Node.js Express 및 TypeScript 기반 웹 API 환경 전용 빌드 준수.
- **[하드코딩 금지]**: 업로드 대상 절대/상대 디렉토리 경로 및 Cron 주기 문자열은 `apps/server/.env` 또는 설정 구조체를 통해서만 접근.

---

## 🧪 4. 필수 테스트 케이스 및 검증 시나리오
- **[자가 진단 테스트 발굴]**: 지원하지 않는 이미지 포맷(GIF 등)이나 5MB를 초과하는 파일을 업로드할 때, 업로드 디렉토리에 임시 파일이 남지 않고 API가 `400 Bad Request` 에러를 안정적으로 반환하는지 테스트.
- **[분기 및 예외 케이스 검증]**:
  - 만료된 엽서 ID로 조회 요청 시, DB 레코드는 살아있더라도 쿼리 단계에서 `410 Gone`이 반환되는지 확인.
  - 디스크 파일 삭제 중 에러(예: 권한 문제, 파일 유실 등)가 발생해도 다음 만료 레코드 삭제 루프가 정상적으로 지속되는지 예외 처리 테스트.
- **[설명 주석 및 승인 강제]**: Cron 스크립트의 작동 트리거 및 예외 회복 로직 상단에 개발자가 읽기 쉬운 주석 부착 및 사전 승인 준수.
