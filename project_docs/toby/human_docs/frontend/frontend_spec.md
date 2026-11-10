# TOBY 교사 지원 툴 프론트엔드 아키텍처 명세 (`frontend_spec.md`)

## 1. 아키텍처 개요

### TOBY 교사 지원 툴 (`apps/toby`)
* **프레임워크**: Vite + React
* **구조**: 단일 페이지 어플리케이션(SPA)으로, 클라이언트 사이드 라우팅(`react-router-dom`)을 채택하여 가볍고 빠른 화면 전환 및 상호작용 제공.
* **렌더링 전략**: Canvas API 및 CSS 3D/물리 시뮬레이션을 사용하여 부드러운 애니메이션과 즉각적인 렌더링에 초점.
* **광고 배너 연동 (Kakao AdFit)**:
  * SPA 환경의 스크립트 충돌 방지를 위해 `KakaoAdFit` 컴포넌트(`src/components/KakaoAdFit.tsx`) 내에 iframe 샌드박스 인라인 주입 방식으로 구현.
  * 규격: 320x100 (`DAN-YLUgqW52t1oDIAmF`), 전체 5개 페이지(홈, 자리바꾸기 2종, 숫자뽑기, 공뽑기) 하단에 배치.
* **빌드 및 호스팅 연동**:
  * 단독 실행 및 Vercel 배포 외에도, `apps/web/deploy-frontend.sh`를 통해 Vite 빌드 후 `apps/web/public/toby`로 동기화되어 메인 웹의 `/toby` 경로로 통합 서빙됨.
