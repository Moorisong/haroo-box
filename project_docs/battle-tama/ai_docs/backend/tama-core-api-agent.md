# tama-core-api Agent Reference

## 📝 1. 연동 기획 명세 (tama-core.md, tama-activities.md)
다마고치의 스탯(행복도, 배고픔, 청결도, 용기) 변화 트랜잭션, 접속에 따른 오프라인 시간 경과분 계산, 시간당 행동 횟수 검증, 위급/사망 판정 비즈니스 로직을 제공합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
다마고치 상태의 무결성을 보장하고 클라이언트 요청(쓰다듬기, 산책 등)의 어뷰징을 방지하며, 시간에 따른 생명 주기(위급/사망)를 서버 측에서 관리합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/server/src/controllers/tamaCoreController.ts`
- `apps/server/src/services/tamaCoreService.ts`
- `apps/server/src/repositories/tamaRepository.ts`
- `apps/server/src/jobs/tamaCronJobs.ts`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **오프라인 스탯 선계산 로직 (`syncTamaStatus`):**
   - 클라이언트가 접속(동기화 API 호출) 시 `lastAccessedAt`과 현재 서버 시간의 차이를 계산.
   - 시간당 감소분(행복-5, 배고픔-4, 청결-4)을 적용하여 DB 업데이트 및 반환.
2. **행동 제한 검증 (Rate Limit):**
   - `interactions` 배열에 각 액션(쓰다듬기 10회/h, 간식 1회/h 등)의 타임스탬프를 기록하여 호출 허용 여부 판별.
   - 미니게임 확률 엔진 구현: 서버에서 `Math.random()`으로 산책 이벤트(꽃 5% 등) 결정 후 결과 반환.
3. **위급 상태 및 사망 처리 (`tamaCronJobs.ts`):**
   - 주기적 스케줄러를 통해 모든 다마고치 검사: 행복도, 배고픔, 청결도 모두 0일 시 상태를 `EMERGENCY`로 변경하고 72시간 만료 타이머 등록.
   - 72시간 경과 후에도 복구되지 않으면 `DEAD` 처리.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄 하드 리밋. 로직 비대 시 헬퍼 함수(`calculateStatReduction` 등)로 완전 분리.
- **[플랫폼 락]:** Node.js/Express (또는 Next.js API Routes) 서버 환경.
- **[하드코딩 금지]:** 모든 스탯 차감률과 제한 횟수는 서버 환경 변수 또는 중앙 설정 파일(`tamaConfig.ts`)에서 관리.
