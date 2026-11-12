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
  * 주요 기능: 서비스 소개 및 각 미니 게임(어드벤트 초콜릿, 감쓰.exe, 하루퍼즐, 롤링페이퍼, TOBY, 너잘알, 자아탐험) 바로가기 카드 제공.
* **`/puzzle` (하루퍼즐)**:
  * 주요 기능: 일일/주간 직소 퍼즐 플레이 및 랭킹 대시보드.
* **`/htsm` (자아탐험 - 조하리의 창)**:
  * 주요 기능: 나를 돌아보고 지인들의 평가를 받는 조하리의 창 성향 분석 툴.
* **`/u-know` (너잘알 - 친구 퀴즈)**:
  * 주요 기능: 퀴즈 출제 및 친구들과의 정답 맞히기 단톡방 소통 게임.
* **`/login` (로그인 페이지)**:
  * 주요 기능: NextAuth 기반 카카오 계정 간편 로그인 버튼 제공.
* **`/mypage` (마이페이지)**:
  * 주요 기능: 로그인 사용자의 플레이 기록(하루퍼즐 랭킹 기록, 작성한 테스트, 받은 설문 정보 등) 통합 요약.
* **`/terms` (이용약관) & `/privacy` (개인정보처리방침)**:
  * 서비스 제공을 위한 약관 정의 화면.
* **외부 및 서브도메인 연계 서비스**:
  * `https://advent-calendar.harooo.co.kr`: 어드벤트 초콜릿 (초콜릿 캘린더 및 친구 비밀 메시지 이벤트).
  * `https://dumpit-web.harooo.co.kr`: 감쓰.exe (감정 배출 유틸리티, `?from=haroo-box` 파라미터 및 카카오 무음 로그인 세션 동기화 연동).
  * `https://r-paper-web.harooo.co.kr`: 온라인 롤링페이퍼 서비스.
  * `/toby`: TOBY 교사 지원 툴 정적 웹 앱 연동 (Next.js rewrite 및 정적 빌드 서빙).
