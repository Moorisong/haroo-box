# 하루퍼즐 프론트엔드 아키텍처 명세 (`frontend_spec.md`)

## 1. 아키텍처 개요
* 하루상자 메인 웹 어플리케이션(`apps/web`)의 일부로 동작합니다.
* `components/puzzle/`: 퍼즐 전용 UI 위젯 컴포넌트가 존재합니다.

## 2. 상태 관리 (State Management)

Zustand를 활용하여 불필요한 리렌더링을 방지하고 가볍고 직관적인 글로벌 상태관리를 구현하였습니다.

### 1) `puzzleStore` (`apps/web/lib/stores/puzzle-store.ts`)
* **역할**: 퍼즐 판 설정, 퍼즐 조각들의 위치 정보(Canvas 좌표 및 SVG Path 데이터), 드래그 상태, 맞춤 검증 로직, 시간 경과 상태 관리.
* **비즈니스 로직**:
  * 조각 맞춤 이벤트 시 조각들의 거리를 계산해 임계값 내에 있을 때 자석 효과로 고정.
  * 모든 조각의 정렬 완료를 감지하여 게임 성공 상태 트리거.

### 2) `rankingStore` (`apps/web/lib/stores/ranking-store.ts`)
* **역할**: 퍼즐 순위표 정보 저장, 난이도별/모드별 랭킹 데이터 캐싱 및 조회 속도 개선.
