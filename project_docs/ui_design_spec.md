# 페이지별 UI 구조 및 비즈니스 로직 (`ui_design_spec.md`)

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

---

## 2. 서비스 사이트맵 및 라우팅 구조

### 1) 하루상자 메인 웹 앱 (`apps/web`)

Next.js App Router 기반의 디렉토리 라우팅 구조를 따릅니다.

* **`/` (홈/메인 페이지)**:
  * 주요 기능: 서비스 소개 및 각 미니 게임(너잘알, 하루퍼즐, 자아탐험 등)의 바로가기 진입로 제공.
* **`/login` (로그인 페이지)**:
  * 주요 기능: NextAuth 기반 카카오 계정 간편 로그인 버튼 제공.
* **`/mypage` (마이페이지)**:
  * 주요 기능: 로그인 사용자의 플레이 기록(하루퍼즐 랭킹 기록, 작성한 테스트, 받은 설문 정보 등) 통합 요약.
* **`/htsm` (자아탐험 - 조하리의 창)**:
  * `/htsm`: 자아탐험 메인 소개.
  * `/htsm/start`: 내 스스로의 성향 3~5가지 키워드 선택 및 테스트 생성.
  * `/htsm/share`: 생성 완료 후 고유 링크(`shareId` 기반) 발급 및 카카오톡 공유 유도.
  * `/htsm/answer/[shareId]`: 친구들이 보는 익명 성향 제보 화면 (피제보자에 대해 3~5가지 성향 키워드 선택).
  * `/htsm/result/[shareId]`: 수집된 데이터를 바탕으로 개방된 영역, 보이지 않는 영역, 숨겨진 영역, 미지의 영역 4가지 구역으로 분석해 주는 통계/시각화 화면.
* **`/puzzle` (하루퍼즐)**:
  * `/puzzle`: 이번 주 퍼즐 정보 확인 및 난이도별(Novice, Beginner, Expert) 플레이 시작 진입로.
  * `/puzzle/play`: 실제 Canvas API 및 3D/물리 효과가 가미된 실시간 퍼즐 드래그 앤 드롭 조작 플레이 화면.
  * `/puzzle/ranking`: 이번 주 퍼즐 완료 시간 기준 랭킹 보드.
  * `/puzzle/archive`: 지난 주차들의 종료된 퍼즐 모음집.
  * `/puzzle/mypage`: 퍼즐 전용 개인 성적 및 과거 완료 시간 목록.
* **`/u-know` (너잘알 - 관계형 퀴즈)**:
  * `/u-know`: 너잘알 퀴즈 시작 메인 소개.
  * `/u-know/create`: 출제자가 자신이 좋아하는 것, 성향 등에 대한 퀴즈 1~10문항 생성 및 정답 입력.
  * `/u-know/share`: 퀴즈 출제 완료 후 링크 발급 및 공유.
  * `/u-know/play/[token]`: 친구들이 해당 토큰을 타고 들어와 출제자의 예상 답변을 선택하는 퀴즈 풀이 화면.
  * `/u-know/result/[token]`: 출제자의 답변과 참여자의 답변을 대조하여 친밀도 점수 및 오답 리스트를 차트로 시각화.
* **`/terms` (이용약관) & `/privacy` (개인정보처리방침)**:
  * 서비스 제공을 위한 약관 정의 화면.

---

### 2) TOBY 교사 지원 툴 (`apps/toby`)

Vite + React Router DOM 기반 Single Page Application(SPA) 구조입니다.

* **`/` (홈 화면)**:
  * 주요 기능: 학급 관리에 유용한 3가지 도구(자리 바꾸기, 숫자 뽑기, 랜덤 공 뽑기) 선택 카드 대시보드.
* **자리 바꾸기 (`/seat-settings` & `/seat-random`)**:
  * **설정 (`/seat-settings`)**: 반 학생 명단을 입력 및 수정하고, 교실 구조(줄/칸 수, 칠판 위치, 고정석/공석 설정)를 시각적인 그리드로 배치.
  * **추첨 실행 (`/seat-random`)**: 화려한 스핀 애니메이션과 효과를 통해 학생들의 자리를 랜덤하게 배치하고, 최종 자리 배치도를 다운로드(html-to-image)할 수 있는 화면.
* **숫자 뽑기 (`/number-picker`)**:
  * 주요 기능: 최솟값과 최댓값을 지정한 뒤, 룰렛/슬롯머신 형태의 애니메이션 효과와 함께 랜덤한 숫자를 추첨해 주는 화면.
* **공 뽑기 (`/ball-picker`)**:
  * 주요 기능: 학생들의 이름을 적은 가상 공들이 Canvas 위에서 물리 충돌을 일으키며 튕기다가, 스페이스바를 누르거나 마우스로 선택 시 당첨 공이 튀어나오는 시뮬레이터 화면.
