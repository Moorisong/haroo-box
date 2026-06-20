# tama-home Agent Reference

## 📝 1. 연동 기획 명세 (tama-core.md)
다마고치 핵심 스탯(행복도, 배고픔, 청결도, 용기)의 실시간 상태 변화와 메인 홈(`/tama`) 화면의 기본 상호작용(쓰다듬기, 박수, 책 읽기, 간식)을 렌더링하고 처리하는 로직을 담당합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
메인 홈 화면 진입 시 서버(또는 로컬 상태)로부터 현재 다마고치의 최신 스탯과 남은 행동 횟수를 동기화하고, 상태에 따른 표정과 대사를 동적으로 렌더링합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/app/tama/page.tsx` (메인 홈 라우트)
- `apps/web/src/components/tama/Home/`
  - `TamaStatusHeader.tsx` (알림 및 스탯 바)
  - `TamaCharacterView.tsx` (캐릭터, 대사, 칭호)
  - `TamaActionPanel.tsx` (기본 행동 버튼 및 남은 횟수)
- `apps/web/src/hooks/tama/useTamaCore.ts` (스탯 계산 및 API 뮤테이션 로직)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **상태 동기화 로직 (`useTamaCore.ts`):** 
   - 컴포넌트 마운트 시 `lastAccessedAt`을 기준으로 오프라인 동안 감소한 스탯(1시간당 행복-5, 배고픔-4, 청결-4)을 클라이언트에서 선계산하여 렌더링 후, 백엔드와 동기화 API를 호출한다.
2. **상태 기반 대사 및 표정 산출 (`TamaCharacterView`):**
   - 위급 상태(`행복==0 && 배고픔==0 && 청결==0`) 확인.
   - 각 스탯(특히 배고픔 구간: 70이상, 40이상, 20이상, 20미만)에 따라 다마고치의 표정(Happy, Normal, Sad, Hungry, Emergency)과 대사를 매핑하여 출력.
3. **액션 패널 제어 (`TamaActionPanel`):**
   - 각 액션(쓰다듬기, 박수, 책읽기, 간식)의 시간당 남은 횟수를 표시.
   - 버튼 클릭 시 확률 처리(박수 30%, 책읽기 50% 등) 후 로컬 상태를 선반영(Optimistic Update)하고 비동기 API 요청.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 본 모듈의 실제 구현 소스 코드는 단일 파일 기준 **300줄**을 절대 초과할 수 없다. 구현 중 한계 도달 시 즉시 sub-module이나 utils로 함수를 분리 구조 분해할 것.
- **[플랫폼 락]:** iOS/Android 네이티브 명세 진입 절대 금지, 오직 **React/Next.js 웹 환경 전용** 구현. TailwindCSS 등 프로젝트 표준 스타일링 적용.
- **[하드코딩 금지]:** 확장형 데이터 구조 설계(API Data 연동 필수) 준수. 대사 목록이나 스탯 증감치, 확률은 상수(Constants) 파일로 분리 관리할 것.
