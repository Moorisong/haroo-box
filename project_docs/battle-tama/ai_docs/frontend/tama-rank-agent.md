# tama-rank Agent Reference

## 📝 1. 연동 기획 명세 (tama-plaza.md, tama-family.md)
최강 전사, 겁쟁이, 행복왕, 칭호왕의 4가지 부문별 랭킹 보드(`/tama/rank`)와 획득/미획득 칭호의 수집률을 보여주는 칭호 도감(`/tama/title`)을 구현합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
주기적으로 갱신되는 랭킹 데이터를 카테고리별로 표시하고, 수집욕을 자극하는 칭호(개체/가문) 도감을 리스트업합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/app/tama/rank/page.tsx`
- `apps/web/src/app/tama/title/page.tsx`
- `apps/web/src/components/tama/Rank/`
  - `RankTabs.tsx`
  - `RankList.tsx`
  - `RankItem.tsx` (메달 아이콘 및 상세)
- `apps/web/src/components/tama/TitleBook/`
  - `TitleTabs.tsx`
  - `TitleCard.tsx` (활성/비활성 처리 및 진행률 표기)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **랭킹 보드 렌더링 (`RankList.tsx`):**
   - 탭 선택에 따라 4가지 랭킹 기준에 맞는 데이터 배열을 API에서 받아 렌더링.
   - `index`가 0, 1, 2일 경우 각각 금, 은, 동 메달 아이콘을 매핑.
2. **칭호 도감 (`TitleBook`):**
   - 서버에서 사용자가 획득한 칭호 ID 목록과 전체 칭호 사전 데이터를 수신.
   - 칭호 목록을 순회하며 획득 여부(`isAcquired`)에 따라 활성화/블러 처리.
   - 특정 미달성 칭호의 경우 진행도(예: `7/10`)를 오버레이로 렌더링.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄 초과 방지를 위해 랭킹 카드와 칭호 카드는 별도 컴포넌트로 분리.
- **[플랫폼 락]:** React/Next.js 웹 환경 전용 구현.
- **[하드코딩 금지]:** 칭호 데이터는 프론트엔드 코드 내부가 아닌, 중앙화된 상수/DB 파일에서 가져와 렌더링할 것.
