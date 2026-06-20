# Web App Agent Reference

## 📝 1. 연동 기획 명세 (`frontend_spec.md`, `ui_design_spec.md`)
- 하루상자의 메인 플랫폼으로 Next.js App Router 기반의 웹 어플리케이션 (`apps/web`).
- 미니게임(자아탐험, 너잘알, 하루퍼즐 등), 퍼즐 랭킹, 사용자 마이페이지, 카카오 로그인을 포함한 클라이언트 상호작용 및 데이터 시각화 담당.

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
- `apps/web` 디렉토리 내의 Next.js 프론트엔드 기능 개발, 구조화 및 유지 보수.
- Zustand 기반 상태 관리 (`puzzleStore`, `rankingStore` 등)와 NextAuth 세션 흐름 관리.
- Tailwind CSS 및 자체 디자인 시스템을 활용한 반응형/모던 웹 UI 컴포넌트 개발.

### 📦 패키지 및 타깃 클래스 경로 구조
- 라우팅/페이지: `apps/web/app/` (Next.js App Router 디렉토리)
- UI 컴포넌트: `apps/web/components/` (`common/`, `layout/`, `modals/`, `puzzle/` 등 도메인별 분리)
- 상태 및 코어 로직: `apps/web/lib/` (`stores/`, `auth.ts`, `game-session.ts` 등)

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **서버/클라이언트 분리 설계**: 마케팅 및 정적 안내 페이지는 Server Components로 작성하여 정적 생성(SSG) 최적화를 유도하고, 상태 변화와 렌더링 루프가 필요한 게임/인터랙션은 `"use client"`를 선언한 Client Components로 작성한다.
2. **UI 컴포넌트 조립**: `components/` 하위에 재사용 가능한 최소 단위(Atomic) 수준 혹은 도메인 기능 수준으로 컴포넌트를 분리 개발한다.
3. **글로벌 상태 연동**: Zustand 스토어를 이용해 불필요한 리렌더링을 방지하며 상태를 구독한다.
4. **보안 API 통신 구성**: 백엔드 API 연동 시 `GAME_SESSION_SECRET` 및 단방향 해싱 등을 이용한 챌린지 토큰 등 무결성 서명 구조를 엄격히 따른다.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 단일 컴포넌트나 파일의 코드는 **300줄**을 절대 초과할 수 없다. 코드가 길어질 조짐이 보이면 즉시 Sub-component로 쪼개거나 비즈니스/상태 로직을 Custom Hook(`hooks/` 또는 `lib/`)으로 분리한다.
- **[Client Component 최소화]:** Vercel React Best Practices를 따라 최상단부터 클라이언트 컴포넌트를 쓰지 말고, 상태가 필요한 하위 트리(Leaf Node)에서만 선언하여 SSR 이점을 극대화한다.
- **[하드코딩 금지]:** API 주소, 주요 키 값 등은 반드시 `.env` 환경변수를 통해 주입받아 사용해야 한다.
