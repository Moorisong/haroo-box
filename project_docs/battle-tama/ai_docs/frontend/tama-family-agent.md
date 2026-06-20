# tama-family Agent Reference

## 📝 1. 연동 기획 명세 (tama-family.md, tama-core.md)
가문 생성, 결혼, 후계자 맞이(알 부화), 은퇴 다마고치 관리 및 가문 묘지를 아우르는 가문 시스템의 클라이언트 UI 연출을 담당합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
가문의 영구적인 기록(조상, 묘지, 가문 칭호)을 조회하고, 결혼 및 알 부화를 통한 세대 교체 트랜잭션을 트리거합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/app/tama/family/page.tsx`
- `apps/web/src/app/tama/grave/page.tsx`
- `apps/web/src/app/tama/hatch/page.tsx`
- `apps/web/src/components/tama/Family/`
  - `FamilyDashboard.tsx` (가문 요약 정보)
  - `AncestorList.tsx` (은퇴/사망 조상 렌더링)
- `apps/web/src/components/tama/Grave/`
  - `GraveStoneList.tsx` (묘비 렌더링)
- `apps/web/src/components/tama/Hatch/`
  - `HatchRitualView.tsx` (알 부화 3번 터치 연출)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **가문 대시보드 (`FamilyDashboard`):**
   - 가문명, 시조, 세대 수 등 서버 정보 바인딩.
   - 현재 육성 중인 개체가 후계자 탄생 조건을 충족(예: 기혼 상태)할 경우 `[후계자 맞이]` 버튼 활성화.
2. **묘지 뷰 (`GraveStoneList`):**
   - 사망 원인별 텍스트, 향년, 획득 칭호를 비석 아이콘과 함께 무겁고 엄숙한 CSS 테마로 렌더링.
3. **알 부화 연출 (`HatchRitualView`):**
   - 신규 유저 또는 후계자 탄생 시 접근.
   - 알 이미지를 렌더링하고, 클릭 시 로컬 state `clickCount`를 증가시킴.
   - 3회 클릭 달성 시 알 깨짐 CSS 애니메이션 재생 후 알 부화 결과 API(종족, 색상, 모자 랜덤 부여) 호출 및 탄생 모달 출력.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 300줄 초과 절대 금지. 묘지 뷰와 가문 뷰, 부화 뷰를 각각의 Page 단위를 명확히 쪼갤 것.
- **[플랫폼 락]:** React/Next.js 웹 환경 전용 구현.
- **[하드코딩 금지]:** 알 부화 연출 시 CSS 애니메이션 키프레임은 Tailwind 테마나 별도 스타일 시트에 선언.
