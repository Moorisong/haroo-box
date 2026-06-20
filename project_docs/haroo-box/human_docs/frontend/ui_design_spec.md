# 공통 UI 디자인 시스템 및 기본 라우팅 구조 (`ui_design_spec.md`)

## 1. 디자인 시스템 요소

### 1) 색상 (Colors)
* **Primary (주조색)**: `#6C5CE7` (Medium Slate Blue)
* **Secondary (보조색)**: `#A29BFE` (Light Slate Blue)
* **Accent (강조색)**: `#FD79A8` (Pink / Rose)
* **Background (배경색)**: `#F1F5F9` (Slate 100 - 연한 회색)
* **Surface (카드/모달 배경)**: `#FFFFFF`
* **Text (기본 텍스트)**: `#1E293B` (Slate 800)
* **Text Muted (부차 텍스트)**: `#64748B` (Slate 500)
* **상태 색상**:
  * Success: `#10B981` (Green)
  * Warning: `#F59E0B` (Amber)
  * Error: `#EF4444` (Red)

### 2) 그라데이션 (Gradients)
* **Primary Gradient**: `linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)`
* **Accent Gradient**: `linear-gradient(135deg, #FD79A8 0%, #FDCB6E 100%)`
* **Light Gradient**: `linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)`

### 3) 폰트 (Typography)
* `Geist Sans` 및 `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`를 상속하여 고해상도 모던 산세리프 형태를 지향합니다.

## 2. 기본 서비스 라우팅 구조

### 하루상자 메인 웹 앱 (`apps/web`) 공통 경로
Next.js App Router 기반의 디렉토리 라우팅 구조를 따릅니다.

* **`/` (홈/메인 페이지)**:
  * 주요 기능: 서비스 소개 및 각 미니 게임(너잘알, 하루퍼즐, 자아탐험 등)의 바로가기 진입로 제공.
* **`/login` (로그인 페이지)**:
  * 주요 기능: NextAuth 기반 카카오 계정 간편 로그인 버튼 제공.
* **`/mypage` (마이페이지)**:
  * 주요 기능: 로그인 사용자의 플레이 기록(하루퍼즐 랭킹 기록, 작성한 테스트, 받은 설문 정보 등) 통합 요약.
* **`/terms` (이용약관) & `/privacy` (개인정보처리방침)**:
  * 서비스 제공을 위한 약관 정의 화면.
