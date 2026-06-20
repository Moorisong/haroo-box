# tama-minigame Agent Reference

## 📝 1. 연동 기획 명세 (tama-activities.md)
다마고치의 스탯에 큰 영향을 미치고 보상(꽃)을 얻을 수 있는 3가지 미니게임(산책, 목욕 비누 던지기, 장애물 달리기)의 UI 연출 및 클라이언트 상태 처리를 담당합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
재미 요소를 담당하는 가벼운 미니게임들을 별도 컴포넌트로 분리하고, 1분 이내의 짧은 애니메이션/상호작용 후 결과를 스탯에 반영하도록 구현합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/components/tama/Minigames/`
  - `WalkMinigame.tsx` (산책 모달 및 연출)
  - `BathChaseMinigame.tsx` (비누 던지기 로직)
  - `RunnerMinigame.tsx` (장애물 달리기 로직)
  - `MinigameResultModal.tsx` (공통 결과 모달)
- `apps/web/src/hooks/tama/useMinigame.ts` (타이머, 확률, 판정 로직)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **산책 연출 (`WalkMinigame.tsx`):**
   - 진입 시 걷기 애니메이션 노출 (2~3초 딜레이).
   - 종료 후 서버(혹은 로컬) 확률 엔진을 호출하여 결과(꽃 5%, 벌레 30%, 친구 39%, 꽝 26%) 반환 및 결과 모달 출력.
2. **비누 던지기 (`BathChaseMinigame.tsx`):**
   - 용기/청결도 <= 10 일 때 목욕 시도시 50% 확률로 본 미니게임 진입.
   - CSS Transform 또는 Framer Motion을 사용하여 다마고치를 화면 내 랜덤 위치로 이동.
   - 10초 카운트다운 타이머 실행. 클릭 이벤트 발생 시 적중 판정(+1). 5회 적중 시 성공 이벤트 `onSuccess` 호출, 타이머 종료 시 실패 `onFail` 호출.
3. **장애물 달리기 (`RunnerMinigame.tsx`):**
   - `requestAnimationFrame`을 사용하여 배경 스크롤 및 장애물 생성.
   - 클릭(터치) 시 점프 액션 처리 및 충돌 검사(AABB 등).
   - 충돌 시 경과 시간에 따른 보상 티어 산정 로직 적용.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 기준 **300줄** 초과 시 로직(`useMinigame.ts`)과 뷰(DOM)를 반드시 분리할 것.
- **[플랫폼 락]:** React/Next.js 웹 환경 전용.
- **[하드코딩 금지]:** 타이머 길이, 목표 적중 횟수, 장애물 생성 주기는 상수로 분리. DOM 조작 대신 React State 기반의 제어 구조(Declarative) 유지.
