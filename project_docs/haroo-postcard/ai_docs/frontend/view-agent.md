# Haroo Postcard View Agent Reference

## 📝 1. 연동 기획 명세 (postcard-frontend.md, postcard-database.md)
- `/view/:id` (또는 `/postcard/view/:id`) 경로에서 수신자에게 노출되는 페이지.
- **만료 처리 분기**: 만료일시 경과 시 빈티지 티켓 모티브의 만료 안내창 제공.
- **유효 엽서 로드 시**:
  - **1단계 (감성 모달)**: 화면 블러 및 오디오 권한 승인 팝업 (`[ 🎧 음악과 함께 ]`, `[ 🤫 조용히 볼래요 ]`).
  - **2단계 (메인 뷰어)**: Three.js 기반 3D 입체 엽서 렌더링 (자이로스코프/터치 기울기, 빛 반사 효과).
  - 하단 유튜브 백그라운드 오디오 미니바 구성 및 바이럴 버튼 배치.

---

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- 모바일 브라우저의 오디오 자동재생 제한 정책(Autoplay Policy)을 우회하기 위한 UX 모달 설계 및 연동.
- Three.js / `@react-three/fiber`를 사용한 자연스러운 3D 엽서 기울임 인터랙션 구현.

### 📦 패키지 및 타깃 클래스 경로 구조
- 라우팅 페이지: `apps/web/app/postcard/view/[id]/page.tsx`
- 컴포넌트 구조:
  - `apps/web/components/postcard/view/ViewContainer.tsx` (컨테이너 및 만료/정상 분기)
  - `apps/web/components/postcard/view/AudioConsentModal.tsx` (오디오 허용 모달)
  - `apps/web/components/postcard/view/Postcard3DCanvas.tsx` (Three.js 캔버스)
  - `apps/web/components/postcard/view/AudioPlayerBar.tsx` (오디오 플레이어 바)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **서버사이드 데이터 페칭 및 만료 검증**:
   - `fetch` API를 이용해 `/api/postcards/${id}` 데이터 획득.
   - 만료 응답(410) 수신 시 즉시 `<ExpiredCard />` 컴포넌트 렌더링.
2. **오디오 권한 승인 모달**:
   - 사용자가 `[ 🎧 음악과 함께 ]`를 클릭하면 유튜브 플레이어 API 인스턴스에 `playVideo()`를 전달하고, 메인 3D 화면을 페이드인 처리.
3. **Three.js 3D 엽서 구현**:
   - `@react-three/fiber` 및 `@react-three/drei` 활용.
   - 엽서 텍스트와 이미지를 3D Plane Mesh 텍스처로 매핑.
   - `useFrame` 훅 내에서 마우스 좌표(데스크톱) 또는 `deviceorientation` API(모바일 자이로) 값을 부드럽게 감쇄(`lerp`) 적용하여 회전값(`rotation.y`, `rotation.x`) 변경.
4. **유튜브 백그라운드 오디오 연동**:
   - `react-youtube` 또는 `youtube-iframe-api`를 활용하여 보이지 않는 1x1 픽셀 플레이어 생성 및 오디오 트랙 제어.

---

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]**: 3D Canvas 로직(`Postcard3DCanvas`), 오디오 플레이어(`AudioPlayerBar`)는 무조건 독립된 파일로 파편화하여 단일 파일 300줄 한계 준수.
- **[플랫폼 락]**: Next.js App Router 기반 Client/Server Component 혼합 설계 활용.
- **[하드코딩 금지]**: Three.js의 조명 세팅값(라이트 강도, 그림자 바이어스 등)과 3D 카메라 앵글 값은 설정 객체 형태로 분리.

---

## 🧪 4. 필수 테스트 케이스 및 검증 시나리오
- **[자가 진단 테스트 발굴]**: 모바일 브라우저에서 '조용히 볼래요' 선택 시 음악 없이 엽서가 정상적으로 페이드인 동작하는지 확인.
- **[환경 및 반응형 검증]**:
  - 모바일 자이로(기기 기울기) 권한 요청 차단 시 터치 드래그로 대체 제어(Fallback)가 안정적으로 작동하는지 검증.
  - 가로/세로 화면 회전(Orientation) 전환 시 Three.js 캔버스의 Aspect Ratio가 자동 갱신(`camera.updateProjectionMatrix()`)되는지 검증.
- **[설명 주석 및 승인 강제]**: 모바일 자이로 이벤트 핸들러 및 Three.js 애니메이션 프레임 함수 상단에 친절한 주석 표기 및 목록 승인 완료.
