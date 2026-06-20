# tama-family-api Agent Reference

## 📝 1. 연동 기획 명세 (tama-family.md)
가문 생성, 은퇴(세대 계승), 은퇴 조상들의 자연사/사고사 스케줄러 처리, 가문 묘지 데이터 관리 및 칭호 부여 조건 충족 시 칭호를 발급하는 백엔드 서버 로직입니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
다마고치의 생애 주기 전환(결혼->알 부화->은퇴->사망)을 DB 관점에서 무결하게 처리하고, 조상들의 데이터를 영구 보존하며 달성 조건에 맞는 칭호를 서버 스케줄러/트리거로 발급합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/server/src/controllers/tamaFamilyController.ts`
- `apps/server/src/services/tamaFamilyService.ts`
- `apps/server/src/jobs/tamaAncestorJobs.ts`
- `apps/server/src/services/tamaTitleService.ts`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **세대 계승 트랜잭션 (`hatchNewGeneration`):**
   - 클라이언트 알 부화 이벤트 시 호출됨.
   - 기존 다마고치의 상태를 `RETIRED`(은퇴)로 변경하고, 새로운 세대의 다마고치 레코드를 삽입하며 현재 육성 대상으로 포인터 업데이트. 원자적(Atomic) 트랜잭션 필수.
2. **조상 사망 판정 스케줄러 (`tamaAncestorJobs.ts`):**
   - 매일 지정된 시각에 은퇴 다마고치 목록을 순회.
   - 나이 구간별 자연사 확률(70대 2%, 120대 35% 등)과 사고사 확률 판정.
   - 사망 시 상태를 `DEAD`로 변경하고 묘지(Grave) 테이블에 사인, 향년, 묘비명을 생성하여 저장.
3. **칭호 발급 시스템 (`tamaTitleService.ts`):**
   - 다마고치 전투, 인터랙션 발생 시 이벤트 리스너를 통해 조건 검사 (예: 전투 승리 시 `victoryCount >= 100` 검사).
   - 조건 달성 시 해당 개체 또는 가문에 칭호 ID 부여 및 알림 발송.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄 한계. 트랜잭션 로직과 스케줄러 로직, 칭호 조건 검사 로직을 각각 독립 모듈로 철저히 분할.
- **[플랫폼 락]:** Node.js/Express (또는 Next.js API Routes) 서버 환경.
- **[하드코딩 금지]:** 자연사/사고사 확률표 테이블과 칭호 발급 조건(Threshold)은 별도 Config 모듈에 분리하여 변경에 유연하게 대처.
