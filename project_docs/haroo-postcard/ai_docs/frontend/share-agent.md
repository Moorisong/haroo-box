# Haroo Postcard Share Agent Reference

## 📝 1. 연동 기획 명세 (postcard-frontend.md, project_env.md)
- `/share/:id` (또는 `/postcard/share/:id`) 경로에서 실행되는 공유 전용 화면.
- "링크가 생성되었습니다. (3일 뒤 사라집니다)" 안내 문구와 TTL 만료 예정 카운트다운 노출.
- 카카오톡 공유하기 (`next/public` 카카오 SDK 연동), 클립보드 링크 복사, html-to-image/Canvas 기반 이미지 다운로드 기능 연동.

---

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- 엽서 소유자가 외부 채널(카카오톡, SNS)로 안전하고 간편하게 엽서 링크를 확산할 수 있는 기능 완비.
- 이미지 파일화 시 한글 폰트(5종) 및 필터가 적용된 상태 그대로 로컬 다운로드되도록 보장.

### 📦 패키지 및 타깃 클래스 경로 구조
- 라우팅 페이지: `apps/web/app/postcard/share/[id]/page.tsx`
- 컴포넌트 경로: `apps/web/components/postcard/share/` 하위
  - `ShareContainer.tsx` (컨테이너/조립)
  - `AdLoadingModal.tsx` (광고 로딩 모달 및 세션 제어)
  - `ShareActionButtons.tsx` (공유 버튼 UI 그룹)
- 커스텀 훅: `apps/web/hooks/postcard/` 하위
  - `useShareTimer.ts` (만료 시간 카운트다운 로직)
  - `useShareActions.ts` (카카오톡, 복사, 다운로드 액션 로직)
- 유틸리티 파일: `apps/web/utils/kakaoShare.ts`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **카카오 SDK 로드**:
   - `useEffect` 내에서 `window.Kakao` 존재 확인 후 없으면 스크립트(`https://developers.kakao.com/sdk/js/kakao.min.js`) 주입 및 초기화.
   - `NEXT_PUBLIC_KAKAO_API_KEY`를 활용해 카카오 앱 초기화.
2. **카카오톡 공유 버튼 구성**:
   - `Kakao.Share.sendDefault`를 사용해 엽서 썸네일, 메시지 텍스트(요약본), 상세 보기 링크(`/view/:id`) 템플릿 연동.
3. **클립보드 링크 복사**:
   - `navigator.clipboard.writeText` API를 호출하고 성공 시 커스텀 토스트 알림 렌더링.
   - 대체 방안으로 임시 textarea 노드를 이용한 복사(fallback) 제공.
4. **이미지 로컬 다운로드**:
   - `html-to-image` 패키지의 `toPng` 혹은 `toJpeg` 함수를 활용해 프리뷰 DOM 객체 캡처.
   - CSS 필터 및 폰트가 레이어에 온전히 고정되어 파일 다운로드 파일명 `haroo-postcard-${id}.png` 형태로 내보내기.
5. **대기 모달 타이머 단축, 세션 스토리지 기반 노출 제어 및 외부 광고 배너 노출**:
   - 공유 브릿지 모달의 최초 대기 시간을 기존 10초에서 `5초`로 단축.
   - 엽서 카드를 한 번 감상(5초 대기 완료)한 이후에는 새로고침하거나 타 페이지 이동 후 돌아와도 모달이 다시 뜨지 않도록 `sessionStorage`(`viewed_postcards` 키)를 활용해 최초 1회만 모달을 띄우는 이력 제어 구현.
   - 모달 외부 영역 하단(액션 버튼들과 엽서 직접 보기 사이)에 `KakaoAdfit` 컴포넌트(`320x100` 배너) 추가 구성.

---

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]**: 공유 화면 컨테이너, 클립보드 유틸, 카카오 연동 유틸 등 기능별 모듈을 별도 파일로 쪼개어 단일 파일 300줄 한계 준수.
- **[플랫폼 락]**: Next.js App Router (Client Component `"use client"` 전제) 환경 내 구현.
- **[하드코딩 금지]**: 도메인 URL 및 카카오 템플릿 ID 등의 설정값은 `.env`에서 참조하여 동적으로 바인딩.

---

## 🧪 4. 필수 테스트 케이스 및 검증 시나리오
- **[자가 진단 테스트 발굴]**: 클립보드 복사 차단 정책 브라우저(일부 인앱 브라우저 등)에서 수동 복사 텍스트 필드를 제공하여 사용자 경로 차단 여부 검증.
- **[환경 및 반응형 검증]**:
  - 모바일 해상도 기기별 복사 성공 토스트 팝업의 위치(상단/하단 중앙)가 키보드에 가리지 않고 잘 보이는지 검증.
  - 카카오 SDK 초기화 중복 실행으로 인한 스크립트 충돌 예방 검증.
- **[상태 격리 및 사이드 이펙트 방어]**: 이미지 캡처 동작 시 DOM 복제로 인한 렌더링 화면 흔들림 및 깨짐 방지.
