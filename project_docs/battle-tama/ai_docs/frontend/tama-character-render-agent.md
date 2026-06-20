# tama-character-render Agent Reference

## 📝 1. 연동 기획 명세 (tama-core.md)
다마고치의 픽셀 외형을 렌더링하는 핵심 모듈로, 본체, 색상, 표정, 장착한 꽃, 모자를 조합하여 30,000가지 이상의 개성을 표현합니다.

## 🤖 2. AI 개발 지침 및 설계 구조

### 🎯 목적
서버에서 받은 다마고치 외형 데이터(`species`, `bodyType`, `colorPalette`, `hat`, `flower`, `status`)를 바탕으로 동적인 픽셀 캐릭터 컴포넌트를 합성(Layering)하여 화면에 렌더링합니다.

### 📦 패키지 및 타깃 클래스 경로 구조
- `apps/web/src/components/tama/Renderer/`
  - `PixelTamaRenderer.tsx` (최상위 합성 컴포넌트)
  - `BodyLayer.tsx` (본체 및 색상 팔레트 적용)
  - `ExpressionLayer.tsx` (상태에 따른 표정 스프라이트)
  - `HatLayer.tsx` (고정 모자)
  - `FlowerLayer.tsx` (인벤토리 장착 꽃)
- `apps/web/src/utils/tama/colorPalette.ts` (색상 매핑 유틸)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **레이어 스태킹 (`PixelTamaRenderer.tsx`):**
   - CSS `position: absolute; z-index: n`을 활용하여 본체 -> 표정 -> 꽃 -> 모자 순으로 이미지를 겹쳐서 렌더링.
2. **색상 변이 적용 (`BodyLayer.tsx`):**
   - SVG 필터, CSS `hue-rotate`, 또는 동적 SVG/Canvas 렌더링 방식을 활용하여 원본 본체 픽셀 아트에 `colorPalette` 값을 적용.
3. **표정 동적 변화 (`ExpressionLayer.tsx`):**
   - 컴포넌트 Props로 전달받은 현재 상태(배고픔, 행복도, 청결, 위급 여부)를 기반으로 `Happy`, `Sad`, `Angry`, `Sleepy`, `Hungry` 표정 스프라이트를 매핑하여 렌더링.
4. **애니메이션 연출:**
   - 걷기, 울기, 졸기 등의 기본 애니메이션을 CSS Keyframes(`steps()` 타이밍 함수)를 이용하여 픽셀 아트 감성에 맞게 구현.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 기준 **300줄** 절대 초과 금지. 레이어별 컴포넌트는 완전히 독립된 파일로 분리.
- **[플랫폼 락]:** React/Next.js 웹 환경 전용 구현. WebGL이나 무거운 캔버스 라이브러리 사용은 지양하고 CSS/SVG 기반 경량 렌더링 채택.
- **[하드코딩 금지]:** 색상 매핑 테이블 및 이미지 경로 매핑은 별도 JSON이나 상수 파일로 분리.
