# tama-plaza Agent Reference

## 📝 1. 연동 기획 명세 (tama-plaza.md)
다마고치 광장에서 접속 중이거나 최근 활동한 다른 유저들의 다마고치 리스트를 매칭하고, '오늘의 외치기'를 통한 소셜 상호작용 및 알림함을 렌더링합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
비동기 방식의 광장 뷰를 구현하여 타겟 유저 검색, 매칭된 10마리의 다마고치 렌더링, 오늘의 외치기 타임라인을 제공합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/app/tama/plaza/page.tsx`
- `apps/web/src/components/tama/Plaza/`
  - `PlazaUserList.tsx` (매칭된 다마고치 10마리 카드 리스트)
  - `PlazaSearchBar.tsx` (정확한 이름 검색 폼)
  - `DailyShoutFeed.tsx` (오늘의 외치기 타임라인 피드)
  - `ShoutInputModal.tsx` (글쓰기 모달)
- `apps/web/src/components/tama/Notification/`
  - `NotificationDrawer.tsx` (전투, 결혼 등 알림 리스트)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **광장 조회 로직:**
   - 페이지 진입 시 백엔드의 `/api/tama/plaza/match` 엔드포인트를 호출하여 조건에 맞는 최대 10명의 다마고치 배열을 수신 및 렌더링.
   - 이름 검색 시 단건 조회 API를 호출하여 결과 카드 모달 렌더링.
2. **오늘의 외치기 피드:**
   - 무한 스크롤(또는 더보기) 기반의 리스트 뷰 구현.
   - 각 글 아이템에 [좋아요] 낙관적 업데이트(Optimistic Update) 적용.
   - 하루 1회 글쓰기 제한은 로컬 및 서버 에러 핸들링으로 방어.
3. **알림함 (`NotificationDrawer`):**
   - 헤더 영역의 종 아이콘 클릭 시 드로어 오픈.
   - 수락/거절 액션이 필요한 알림(전투, 결혼)의 경우 해당 액션 버튼 포함 렌더링 및 콜백 처리.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄 제한. 피드 컴포넌트와 유저 카드 컴포넌트를 분리.
- **[플랫폼 락]:** React/Next.js 웹 환경 전용. UI 레이아웃은 모바일/데스크탑 반응형(Tailwind)으로 작성.
- **[하드코딩 금지]:** 데이터 패칭은 SWR 또는 React Query를 활용하여 상태 기반(DataStore)으로 관리할 것.
