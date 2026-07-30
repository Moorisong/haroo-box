# Haroo Postcard Create Agent Reference

## 📝 1. 연동 기획 명세 (postcard-frontend.md, postcard-database.md)
- `/create` (또는 `/postcard/create`) 경로에서 실행되는 엽서 제작 모듈.
- 반응형 2-Column (PC/태블릿) / 1-Column (모바일) 구조로 반응형 최적 배치.
- 이미지 파일 업로드 및 8종 감성 필터(Vintage, Monotone, Film Grain, Warm, Cool, Dramatic, Pastel) 적용 및 프로그레스 바 필터 강도(0~100%) 조절.
- 8종 신규 감성 배경 이펙트(햇살, 별빛, 포근한 눈, 빗방울, 벚꽃 흩날림, 반딧불이, 비눗방울, 유성우) 실시간 미리보기 및 뷰어 오버레이 연동.
- 실시간 미리보기 카드에서 마우스/터치 드래그로 사진 상하 구도(object-position) 맞추기 기능.
- 8가지 감성 폰트(고딕 계열 4종 + 명조 계열 4종) 실시간 미리보기 및 메인 페이지 고딕 서체(`'Nanum Gothic', sans-serif`) 통합.
- 150자 문구 유효성 검증 및 유튜브 오디오 썸네일 미리보기.
- `PostcardPreview` 컴포넌트를 통한 완성 엽서 실시간 3D 패럴랙스/필터/문구 감상 기능.
- 최종 제출 시 백엔드 API 서버(`POST /api/postcards`)로 상태 전송 및 공유 브릿지 이동.

---

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- PC, 태블릿, 모바일 해상도별 반응형 최적 배치 및 영역 구분(Card UI) 명확화.
- 메인 페이지와 동일한 고딕 서체 적용으로 일관된 비주얼 감성 유지.
- Zustand를 사용한 제작 상태(Form State)의 완전 격리 및 이관 보장.

### 📦 패키지 및 타깃 클래스 경로 구조
- 라우팅 페이지: `apps/web/app/postcard/create/page.tsx`
- Zustand 스토어: `apps/web/store/usePostcardFormStore.ts`
- 컴포넌트 구조:
  - `apps/web/components/postcard/create/PostcardStepper.tsx` (반응형 12컬럼 그리드 컨테이너)
  - `apps/web/components/postcard/create/PostcardPreview.tsx` (실시간 완성 엽서 3D/필터 미리보기)
  - `apps/web/components/postcard/create/PostcardPreview.tsx` (실시간 완성 엽서 필터/문구 미리보기)
  - `apps/web/components/postcard/create/StepUpload.tsx` (Card UI - 사진 및 필터 효과)
  - `apps/web/components/postcard/create/StepMessage.tsx` (Card UI - 문구 및 폰트)
  - `apps/web/components/postcard/create/StepMusic.tsx` (Card UI - BGM 오디오)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **Zustand 스토어 정의**: 이미지 데이터, 문구, 폰트 선택값, 유튜브 링크 상태 저장 함수 설계.
2. **실시간 완성 엽서 미리보기**:
   - `PostcardPreview` 컴포넌트를 통한 완성 엽서 실시간 필터/문구 감상 기능.
   - 업로드 사진 + 선택 필터 + 입력 문구 + 선택 폰트 실시간 동기화.
3. **Step 1 (사진 및 필터)**:
   - 파일 유효성 검사 (JPEG, PNG, WEBP 지원 여부 및 최대 5MB 크기 제한).
   - Card UI 래퍼 적용 및 CSS 필터 실시간 바인딩.
4. **Step 2 (문구 및 폰트)**:
   - 텍스트 입력 핸들러에 글자수 검증(`length <= 150`) 로직 구현.
   - 고딕 폰트 기반 서체 라인업 칩 렌더링.
5. **Step 3 (BGM 등록)**:
   - 유튜브 공유 링크 정규식 파싱 후 `youtube_id` 추출 및 썸네일 노출.
6. **API 제출**: FormData 객체를 생성하여 멀티파트 전송 후 `/ad-gate/:id`로 라우팅.
7. **광고 영역 노출**: 좌측 프리뷰 카드 하단 영역에 `KakaoAdfit` 컴포넌트(`320x100` 배너)를 배치하여, 데스크톱/태블릿에서는 프리뷰 하단에 노출되고 모바일에서는 프리뷰와 폼 패널 사이에 자연스럽게 정렬되도록 구성.

---

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]**: Stepper 컨테이너와 개별 Step/Preview 컴포넌트는 무조건 개별 파일로 분리하여 300줄 상한선 엄수.
- **[서체 통일]**: 메인 페이지와 동일한 고딕 서체(`'Nanum Gothic', sans-serif`)로 전 영역 UI 서체 일치.
- **[플랫폼 락]**: React 19 / TypeScript 및 Next.js App Router 웹 전용 규격 엄수.

---

## 🧪 4. 필수 테스트 케이스 및 검증 시나리오
- **[반응형 Layout 검증]**:
  - PC/태블릿 (`lg: 1024px+`): 좌측 Sticky `PostcardPreview` + 우측 Step 카드 패널 정상 렌더링.
  - 모바일 (`< 768px`): 상단 `PostcardPreview` + 하단 Step 카드 순차적 나열.
- **[서체 및 카드 명확성 검증]**: 헤더, Step 뱃지, 입력 폼, 미리보기 카드 폰트가 고딕 서체로 통일되었는지 검증.
