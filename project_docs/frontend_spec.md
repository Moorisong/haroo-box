# 프론트엔드 아키텍처 명세 (`frontend_spec.md`)

## 1. 아키텍처 개요

본 프로젝트의 프론트엔드는 서비스 제공 대상과 목적에 따라 **Next.js 기반 웹 플랫폼**과 **Vite 기반 교사용 SPA 도구** 두 개의 영역으로 나뉘어 설계되었습니다.

### 1) 하루상자 메인 웹 어플리케이션 (`apps/web`)
* **프레임워크**: Next.js App Router (React Server/Client Components 혼용)
* **렌더링 전략**:
  * 마케팅 및 정적 안내 페이지 (이용약관, 개인정보처리방침 등): 빌드 시 Static Generation을 유도하여 빠른 로딩 속도 유지.
  * 미니게임 및 콘텐츠 플레이 영역: 클라이언트 사이드 인터랙티브 컨트롤을 위해 `"use client"` 지시어가 포함된 Client Component 활용.
* **디렉토리 구조**:
  * `app/`: Next.js App Router 디렉토리 기반의 페이지 라우팅.
  * `components/`: UI 위젯 컴포넌트 (`common/` - 공통 UI, `layout/` - 헤더/푸터, `modals/` - 팝업 모달, `puzzle/` - 퍼즐 전용 등).
  * `lib/`: 인증(`auth.ts`), 비로그인 세션(`game-session.ts`), 상태 관리 스토어(`stores/`), 유틸리티 코드 수록.

### 2) TOBY 교사 지원 툴 (`apps/toby`)
* **프레임워크**: Vite + React
* **구조**: 단일 페이지 어플리케이션(SPA)으로, 클라이언트 사이드 라우팅(`react-router-dom`)을 채택하여 가볍고 빠른 화면 전환 및 상호작용 제공.
* **렌더링 전략**: Canvas API 및 CSS 3D/물리 시뮬레이션을 사용하여 부드러운 애니메이션과 즉각적인 렌더링에 초점.

---

## 2. 상태 관리 (State Management)

Zustand를 활용하여 불필요한 리렌더링을 방지하고 가볍고 직관적인 글로벌 상태관리를 구현하였습니다.

### 1) `puzzleStore` (`apps/web/lib/stores/puzzle-store.ts`)
* **역할**: 퍼즐 판 설정, 퍼즐 조각들의 위치 정보(Canvas 좌표 및 SVG Path 데이터), 드래그 상태, 맞춤 검증 로직, 시간 경과 상태 관리.
* **비즈니스 로직**:
  * 조각 맞춤 이벤트 시 조각들의 거리를 계산해 임계값 내에 있을 때 자석 효과로 고정.
  * 모든 조각의 정렬 완료를 감지하여 게임 성공 상태 트리거.

### 2) `rankingStore` (`apps/web/lib/stores/ranking-store.ts`)
* **역할**: 퍼즐 순위표 정보 저장, 난이도별/모드별 랭킹 데이터 캐싱 및 조회 속도 개선.

---

## 3. 인증 및 세션 흐름 (Authentication & Session Flow)

### 1) Guest Play First (선택적 로그인)
대부분의 미니게임을 로그인 과정 없이 시작하도록 설계하여 유저 유입 허들을 최소화합니다.

### 2) NextAuth.js 및 카카오 간편 로그인
* **경로**: `/login` -> Kakao OAuth Callback.
* **세션 유지**: JWT 전략(30일)을 활용하여 쿠키에 암호화 보관.
* **통합 DB 연동**: `signIn` Callback 실행 시 MongoDB `users` 컬렉션에 사용자 고유 식별자(`providerId`)를 기준으로 데이터가 동기화(Upsert)됩니다.

### 3) 게임 세션 검증 (보안 검증)
* **보안 이슈**: 비로그인 또는 로그인을 하더라도 프론트엔드 단에서 변조한 결과값 전송을 원천 차단하기 위해 단방향 서명 기술을 활용합니다.
* **구현**:
  * 게임 시작 시 서버에서 `GAME_SESSION_SECRET`를 기반으로 HMAC-SHA256 해시를 생성하여 1회용 챌린지 토큰(`challengeToken`) 발행.
  * 게임 종료 후 결과(예: 퍼즐 클리어 시간)를 전송할 때 해당 토큰을 동봉해야만 DB 기록이 수락됨.

---

## 4. 공통 UI 컴포넌트 및 에러 핸들링

### 1) 공통 UI
* **컴포넌트 리스트**:
  * Button, Modal, Card, Input 등은 `components/ui/`에 개별 컴포넌트로 모듈화.
  * 레이아웃 헤더 및 푸터는 `components/layout/`에 배치하여 전역 Layout(`app/layout.tsx`)에서 일괄 적용.

### 2) 글로벌 에러 핸들링
* Next.js의 `app/error.tsx` 파일을 전역 루트에 구성하여 데이터 로드 실패나 예기치 않은 JavaScript 런타임 에러 발생 시 사용자 친화적인 안내 화면과 복구 시도(Reload) 버튼 노출.
* 자아탐험(HTSM), 너잘알(U-Know) 등에서는 입력 폼 작성 시 유효성 검증(Validation)을 통과하지 못하면 폼 제출을 차단하고 툴팁이나 가이드 문구를 노출하는 클라이언트 단 유효성 보호기 설계.
