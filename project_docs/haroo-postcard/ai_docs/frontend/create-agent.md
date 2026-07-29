# Haroo Postcard Create Agent Reference

## 📝 1. 연동 기획 명세 (postcard-frontend.md, postcard-database.md)
- `/create` (또는 `/postcard/create`) 경로에서 실행되는 엽서 제작 모듈.
- Stepper 기반 싱글 페이지 구조로 구현하여 사용자 이탈 방지.
- 이미지 파일 업로드 및 Vintage/Monotone/Film Grain 필터 적용.
- 5가지 감성 폰트 실시간 프리뷰와 글자수 150자 유효성 검증.
- 유튜브 오디오 링크 추출 및 썸네일 미리보기 렌더링.
- 최종 제출 시 백엔드 API 서버(`POST /api/postcards`)로 상태 전송 및 공유 브릿지 이동.

---

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- 유연하고 직관적인 Stepper 흐름 제공 및 업로드 이미지에 대한 클라이언트 사이드 즉시 필터 렌더링.
- Zustand를 사용한 제작 상태(Form State)의 완전 격리 및 이관 보장.

### 📦 패키지 및 타깃 클래스 경로 구조
- 라우팅 페이지: `apps/web/app/postcard/create/page.tsx`
- Zustand 스토어: `apps/web/store/usePostcardFormStore.ts`
- 컴포넌트 구조:
  - `apps/web/components/postcard/create/PostcardStepper.tsx`
  - `apps/web/components/postcard/create/StepUpload.tsx`
  - `apps/web/components/postcard/create/StepMessage.tsx`
  - `apps/web/components/postcard/create/StepMusic.tsx`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **Zustand 스토어 정의**: 이미지 데이터, 문구, 폰트 선택값, 유튜브 링크 상태 저장 함수 설계.
2. **Step 1 (사진 및 필터)**:
   - 파일 유효성 검사 (JPEG, PNG, WEBP 지원 여부 및 최대 5MB 크기 제한).
   - HTML5 Canvas 혹은 CSS 필터(`filter: sepia(0.8) contrast(1.2)` 등)를 통한 Vintage, Monotone, Film Grain 실시간 미리보기 필터 제공.
3. **Step 2 (문구 및 폰트)**:
   - 텍스트 입력 핸들러에 글자수 검증(`length <= 150`) 로직 구현.
   - 폰트 5종 버튼 클릭 시, 엽서 미리보기 컴포넌트의 폰트 클래스가 동적으로 바인딩되도록 CSS 변수 연동.
4. **Step 3 (BGM 등록)**:
   - 유튜브 공유 링크(`youtu.be/...`, `youtube.com/watch?v=...`) 정규식 파싱 후 `youtube_id` 추출.
   - `youtube_id` 존재 시 `https://img.youtube.com/vi/${id}/mqdefault.jpg` 형식으로 이미지 로드하여 썸네일 노출.
5. **API 제출**: FormData 객체를 생성하여 멀티파트 전송 후, 발급받은 ID를 통해 `/ad-gate/:id`로 라우팅.

---

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]**: Stepper 컨테이너와 개별 Step 컴포넌트(`StepUpload`, `StepMessage`, `StepMusic`)는 무조건 서로 다른 개별 파일로 분리하여 300줄 상한선 엄수.
- **[플랫폼 락]**: React 19 / TypeScript 및 Next.js App Router 웹 전용 규격 엄수.
- **[하드코딩 금지]**: 필터 상수 리스트 및 폰트 매핑 메타데이터는 외부 상수 파일(`constants/postcard.ts`)로 이관.

---

## 🧪 4. 필수 테스트 케이스 및 검증 시나리오
- **[자가 진단 테스트 발굴]**: 잘못된 형식의 유튜브 링크 입력 시 에러 유효성 메시지가 즉시 노출되는지 검증.
- **[가짜 구현 방지]**: 목 데이터 전달 시 단순 고정값이 아니라 파일 크기 범위별, 폰트 스왑별로 동적 동작 여부 검사.
- **[환경 및 반응형 검증]**:
  - 모바일 가상 키보드가 활성화될 때 입력창 및 하단 고정 CTA 버튼이 화면 위로 밀려나 찌그러지거나 잘리는 현상 방지 (`min-h-screen` 및 스크롤 영역 설계 확인).
- **[상태 격리 및 사이드 이펙트 방어]**: 엽서 제작 중 뒤로 가기 또는 취소 클릭 시 Zustand 스토어 상태가 초기화 상태로 격리되는지 검증.
