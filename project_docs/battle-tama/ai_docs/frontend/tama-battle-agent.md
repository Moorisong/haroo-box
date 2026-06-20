# tama-battle Agent Reference

## 📝 1. 연동 기획 명세 (tama-battle.md)
비동기 방식의 PvP 전투 대결 신청, 10분간의 병맛 전투 텍스트 로그 연출, 도망가기 이벤트 처리 및 최종 전투 결과를 렌더링하는 클라이언트 시스템입니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
유저 간 전투 스킬 선택 폼을 제공하고, 전투 시작 시 10분 동안 주기적으로 업데이트되는 병맛 텍스트 로그 연출을 통해 지루함을 방지합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/app/tama/battle/page.tsx`
- `apps/web/src/components/tama/Battle/`
  - `BattleMainView.tsx` (남은 전투 횟수, 랭킹 요약)
  - `BattleRequestModal.tsx` (상대 정보 대치 UI 및 스킬 선택)
  - `BattleInProgressView.tsx` (10분 전투 락 및 로그 연출)
  - `BattleResultView.tsx` (전투 결과 및 도망가기 연출)
- `apps/web/src/hooks/tama/useBattle.ts` (전투 상태 폴링 및 데이터 페칭)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **대결 신청 및 수락 (`BattleRequestModal`):**
   - 대치 화면을 렌더링하고, 스킬 리스트(라디오 버튼) 선택 후 API 호출.
2. **진행 중 연출 (`BattleInProgressView`):**
   - API로부터 현재 진행 중인 전투 데이터 수신.
   - `requestAnimationFrame` 또는 `setInterval`을 이용해 10분 타이머를 UI에 표시 (MM:SS).
   - 서버에서 제공된(혹은 로컬에서 시간에 따라 배열을 순회하는) 병맛 전투 로그를 1분 단위로 화면 하단에 추가(Typewriter 효과 등 적용).
3. **결과 처리 (`BattleResultView`):**
   - 10분 경과 후 결과 API 호출. 도망 성공 여부(`isFled`)가 true일 경우 도망 전용 연출 모달 렌더링, 아닐 경우 승패에 따른 스탯 변화량 요약 모달 렌더링.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄 제한. 복잡한 연출(타이머, 로그 렌더링)은 커스텀 훅(`useBattleLog.ts` 등)으로 완전 분리할 것.
- **[플랫폼 락]:** React/Next.js 웹 환경 전용 구현.
- **[하드코딩 금지]:** 스킬 목록, 로그 템플릿은 프론트엔드 상수 리스트에 하드코딩하지 않고 가능하면 데이터 구조화 처리(Constants 파일 분리) 준수.
