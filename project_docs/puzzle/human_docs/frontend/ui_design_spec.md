# 하루퍼즐 서비스 사이트맵 및 라우팅 구조 (`ui_design_spec.md`)

## 1. 서비스 사이트맵 및 라우팅 구조

### 하루상자 메인 웹 앱 (`apps/web`) 하위
Next.js App Router 기반의 디렉토리 라우팅 구조를 따릅니다.

* **`/puzzle` (하루퍼즐)**:
  * `/puzzle`: 이번 주 퍼즐 정보 확인 및 난이도별(Novice, Beginner, Expert) 플레이 시작 진입로.
  * `/puzzle/play`: 실제 Canvas API 및 3D/물리 효과가 가미된 실시간 퍼즐 드래그 앤 드롭 조작 플레이 화면.
  * `/puzzle/ranking`: 이번 주 퍼즐 완료 시간 기준 랭킹 보드.
  * `/puzzle/archive`: 지난 주차들의 종료된 퍼즐 모음집.
  * `/puzzle/mypage`: 퍼즐 전용 개인 성적 및 과거 완료 시간 목록.
