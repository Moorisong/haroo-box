# Toby Frontend Agent Reference

## 📝 1. 연동 기획 명세
- TOBY 교사 지원 툴 (`apps/toby`). Vite + React + React Router DOM 기반.
- 자리 바꾸기, 숫자 뽑기, 랜덤 공 뽑기 도구 제공.

## 🤖 2. 목적 및 개발 지침
### 🎯 목적
- 부드러운 애니메이션과 즉각적인 Canvas 렌더링 중심 SPA 컴포넌트 개발.
### 🛠️ 개발 지침
- HTML-to-image 등 브라우저 기반 다운로드 기능 구현.

## 📢 3. 광고 배너 연동 명세 (Kakao AdFit)
- **컴포넌트:** `KakaoAdFit` (`src/components/KakaoAdFit.tsx`)
- **단위 ID (TOBY):** `DAN-YLUgqW52t1oDIAmF`
- **배너 규격:** 320x100 (`ADFIT_SIZES.BANNER_320x100`)
- **렌더링 방식:** SPA 환경 스크립트 충돌 방지를 위한 iframe 샌드박스 인라인 주입
- **적용 화면:** 메인 홈 및 도구 전체 5개 페이지 하단
  - `Home` (`/`)
  - `NumberPicker` (`/number`)
  - `BallPicker` (`/ball`)
  - `SeatRandom` (`/seat`)
  - `SeatSettings` (`/seat/settings`)
- **참고:** 기존 묘록(Myorok) 자체 배너는 전면 제거 완료됨.

## 🚨 4. 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 코드는 300줄 초과 금지.
- **[순수 클라이언트]:** 서버 의존성을 최소화하고 로컬 브라우저 기능을 적극 활용.
- **[타입 임포트 준수]:** `verbatimModuleSyntax: true` 환경이므로 타입 참조 시 반드시 `import type` 구문 준수.

