# tama-social-api Agent Reference

## 📝 1. 연동 기획 명세 (tama-plaza.md)
다마고치 광장의 사용자 매칭 로직(접속/최근 활동 기준), 오늘의 외치기(Shout) CRUD 및 자정 데이터 초기화 시스템, 전체 알림함 관리 백엔드 로직입니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
과도한 DB 부하를 막기 위해 최적화된 광장 매칭 알고리즘을 구현하고, '오늘의 외치기'처럼 일시적 소셜 데이터를 안정적으로 스케줄링(삭제)하여 관리합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/server/src/controllers/tamaSocialController.ts`
- `apps/server/src/services/tamaSocialService.ts`
- `apps/server/src/jobs/tamaShoutCleanupJob.ts`
- `apps/server/src/repositories/shoutRepository.ts`

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **광장 다마고치 매칭 조회:**
   - 클라이언트 요청 시 10마리 랜덤 조회.
   - 로직: 
     - 1순위: 현재 접속 중인 다마고치(Redis 세션 또는 `lastAccessedAt` < 5분) 최대 5명.
     - 2순위: 최근 활동(`lastAccessedAt` < 7일) 풀에서 남은 자리 랜덤 채움.
     - 3순위: 전체에서 보충.
   - DB에 풀 스캔(Full Scan)이 걸리지 않도록 Indexed 컬럼 기반의 샘플링 쿼리 전략 수립.
2. **오늘의 외치기 피드 처리:**
   - 단일 개체당 하루 1개 글쓰기 제한 로직 검사.
   - 페이지네이션 (Cursor 또는 Offset 기반) 피드 조회.
3. **자정 초기화 스케줄러 (`tamaShoutCleanupJob.ts`):**
   - 매일 밤 00:00:00 실행.
   - `Shout` 테이블의 모든 게시글과 관련 댓글, 좋아요 연관 데이터를 초기화(Truncate 또는 일괄 Delete).

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄. 매칭 알고리즘 쿼리 빌더와 스케줄러를 분리 설계.
- **[플랫폼 락]:** Node.js/Express (또는 Next.js API Routes) 서버 환경.
- **[하드코딩 금지]:** 데이터 삭제 스케줄러는 서버가 여러 대일 경우 중복 실행되지 않도록 분산 락(Redis Lock 등) 혹은 멱등성을 보장하는 방식(Cron Job 서버 분리)으로 구현 설계할 것.
