# 🎨 프론트엔드 UI/UX 및 퍼즐엔진 전담 에이전트 (Frontend Agent) 작업 안내서

이 문서는 "하루퍼즐(Haru Puzzle)"의 프론트엔드 설계, Zustand 상태 관리, CSS Grid 슬롯 기반 퍼즐 엔진 개발, IndexedDB 로컬 동기화 및 카카오 연동을 담당하는 에이전트를 위한 최종 개발 명세서입니다.

---

## 1. 기술 스택 및 디렉터리 구성

### 기술 스택
- **Framework & Routing**: Next.js 16.1.3 (App Router)
- **State Management**: Zustand
- **Database (Client)**: IndexedDB (`haruPuzzleDB`)
- **Rendering & Interaction**: React, CSS Grid Slots, CSS Modules, HSL Color Palette
- **Authentication**: NextAuth.js / Kakao OAuth
- **Styling**: Vanilla CSS, CSS Modules (글래스모피즘, 다크모드 대응)

### 프론트엔드 컴포넌트 디렉터리 구조 (apps/web)
```
apps/web
├─ app
│   └─ puzzle
│       ├─ page.tsx                # 하루퍼즐 메인 페이지
│       ├─ layout.tsx              # 하루퍼즐 공통 레이아웃
│       ├─ archive                 # 지난 아카이브 퍼즐 목록 페이지
│       ├─ mypage                  # 내 정보, 프로필, 완주 히스토리 페이지
│       ├─ ranking                 # 주간 랭킹 페이지 (난이도별 Top 100)
│       └─ play
│           └─ [puzzleId]          # 퍼즐 플레이어 페이지 (세로/가로 분기 렌더링)
│
├─ components
│   └─ puzzle
│       ├─ header.tsx              # 플레이어 상단 헤더
│       ├─ puzzle-board.tsx        # CSS Grid 슬롯 기반 퍼즐 보드
│       ├─ piece-tray.tsx          # 하단 조각 보관함 (피스 트레이)
│       ├─ piece-cell.tsx          # 개별 퍼즐 조각 컴포넌트
│       ├─ floating-toolbar.tsx    # 타이머, 줌, 섞기, 원본 가이드 조작 툴바
│       ├─ completion-modal.tsx    # 완료 시 축하 및 기록 등록/공유 모달
│       ├─ sync-choice-modal.tsx   # 로그인 시 서버-로컬 데이터 동기화 선택 모달
│       ├─ portrait
│       │   └─ portrait-puzzle-layout.tsx   # 세로모드 레이아웃
│       └─ landscape
│           ├─ landscape-puzzle-layout.tsx  # 가로모드 전체 레이아웃
│           ├─ guide-image-panel.tsx        # 좌측 원본 가이드 패널 (드래그, 리사이즈 지원)
│           ├─ puzzle-panel-wrapper.tsx     # 중앙 퍼즐 보드 패널 (드래그, 줌 지원)
│           ├─ landscape-tray-panel.tsx     # 우측 고정 세로 스크롤 보관함 패널
│           └─ landscape-toolbar.tsx        # 가로모드 전용 툴바 (플레이/이동 모드 전환)
│
└─ lib
    ├─ puzzle-db.ts                # IndexedDB 인터페이스 (haruPuzzleDB)
    └─ stores
        └─ puzzle-store.ts         # 퍼즐 조작, 섞기, 타이머 상태 관리 Zustand 스토어
```

---

## 2. Zustand 글로벌 상태 관리 상세 명세 (`puzzle-store.ts`)

퍼즐 보드 데이터, 타이머 작동 및 기록 데이터 유효성을 관리합니다.

### 상태 (State) 및 액션 (Actions)
```typescript
export interface PuzzlePiece {
  id: number;
  correctIndex: number;
}

export interface PuzzleState {
  activePuzzleId: string | null;
  activePuzzleImage: string | null;
  difficulty: 'novice' | 'beginner' | 'expert';
  mode: 'ranked' | 'solo';
  totalPieces: number;
  board: (number | null)[];
  trayPieces: number[];
  selectedTrayPiece: number | null;
  timerSeconds: number;
  isTimerRunning: boolean;
  isCompleted: boolean;
  startedAt: string | null;
  challengeToken: string | null;

  initializePuzzle: (puzzleId: string, imgUrl: string, diff: 'novice' | 'beginner' | 'expert', mode: 'ranked' | 'solo', customStartedAt?: string) => void;
  resumePuzzle: (state: {
    difficulty: 'novice' | 'beginner' | 'expert';
    mode: 'ranked' | 'solo';
    timerSeconds: number;
    board: (number | null)[];
    trayPieces: number[];
    startedAt: string;
    completed: boolean;
  }) => void;
  selectTrayPiece: (pieceId: number | null) => void;
  placePiece: (slotIndex: number, pieceId: number) => void;
  removePiece: (slotIndex: number) => void;
  swapPieces: (slotIndex: number, pieceId: number) => void;
  pickUpPiece: (slotIndex: number) => void;
  shufflePieces: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  setCompleted: (completed: boolean) => void;
  setChallengeToken: (token: string | null) => void;
  resetPuzzle: () => void;
}
```

---

## 3. CSS Grid 슬롯 기반 퍼즐 엔진 상세 설계

### (1) 난이도별 그리드 규격
- **Novice (초보)**: 가로 6열 × 세로 6행 = 총 36조각
- **Beginner (일반)**: 가로 10열 × 세로 10행 = 총 100조각
- **Expert (고수)**: 가로 16열 × 세로 16행 = 총 256조각
- 각 슬롯의 배경 이미지는 CSS `background-image`와 `background-position`을 사용하여 전체 원본 이미지 중 각 조각 인덱스에 상응하는 특정 오프셋 구역을 표시하도록 구현합니다.

### (2) 핵심 엔진 인터랙션 및 조작 로직
1. **탭/클릭 선택 및 이동 (Tap & Click Interaction)**:
   - 드래그 앤 드롭 대신 모바일/PC 모두 터치 및 클릭이 편리한 **슬롯 기반 매칭 방식**을 사용합니다.
   - **조각 선택 (Pick up / Select)**: 하단 피스 트레이에서 조각을 탭하여 `selectedTrayPiece`로 설정합니다. 또는 보드에 이미 배치된 조각을 다시 탭하면 보드에서 들어 올려 선택한 상태가 됩니다.
   - **조각 배치 (Place)**: 조각이 선택된 상태에서 보드의 빈 슬롯을 선택하면 해당 슬롯에 조각이 배치(`placePiece`)되고 트레이에서 해당 조각이 제거됩니다.
   - **조각 교환 (Swap)**: 조각이 선택된 상태에서 이미 다른 조각이 들어있는 슬롯을 탭하면, 기존 조각을 트레이/선택 상태로 돌려보내고 새 조각이 슬롯에 배치됩니다(`swapPieces`).
2. **완성 감지 및 축하 세레머니**:
   - 보드의 모든 슬롯에 들어있는 조각 ID가 해당 슬롯의 인덱스와 완전히 일치할 때 완성으로 판정합니다 (`board.every((val, idx) => val === idx)`).
   - 100% 완료 판정 시 타이머를 즉시 정지하고, 파티클 폭죽 세레머니(Canvas Confetti 등)와 함께 완성 결과 모달(`completion-modal`)을 노출합니다.

---

## 4. IndexedDB 자동 저장 및 오프라인 상태 복원 명세

### (1) 데이터 스토어 규격
- **DB명**: `haruPuzzleDB`
- **Store명**: `puzzleState` (KeyPath: `puzzleId`)
- **자동 저장 주기**: 조각이 배치/스왑/회수되는 모든 시점에IndexedDB 저장을 예약하되, 쓰기 부하를 방지하기 위해 **2초 디바운스(Debounce)**를 적용합니다. 단, 페이지 이탈/언마운트 시점에는 플러시 함수를 즉시 호출하여 진행 데이터를 최종 강제 백업합니다.

### (2) 복원(Resume) 시나리오
- 사용자가 `/puzzle/play/[puzzleId]` 진입 시 IndexedDB 내역을 먼저 확인합니다.
- 진행 중인 비완성 기록이 존재하면 이어하기 여부를 확인하는 모달(`sync-choice-modal` 또는 이어하기 팝업)을 띄우고, 수락 시 이전의 보드 배치 상태, 트레이 상태, 타이머 경과 시간을 그대로 복구합니다.

---

## 5. 비회원(Guest First) 및 회원 로그인 분기 시나리오

1. **비로그인 유저 (Guest)**:
   - 로그인 없이 자유롭게 퍼즐 목록을 열람하고, 로컬 IndexedDB 기반으로 이어하기 플레이가 가능합니다.
   - 단, 퍼즐 완성 후 기록을 서버의 주간 랭킹에 등록하려면 카카오 로그인이 필수로 필요하며 완성 결과 모달에서 로그인을 유도합니다.
2. **로그인 유저**:
   - 플레이 시작 시 자동으로 백엔드 API `/api/puzzle/challenge/start`를 호출하여 1회성 검증 토큰 `challengeToken`을 발급받아 스토어에 보존합니다.
   - 조각 조작 시 로컬 IndexedDB 백업과 동시에 서버 API `/api/puzzle/progress`에 2초 디바운스로 진행 상황을 전송하여 클라우드 백업을 진행합니다.
   - 완주 시 `challengeToken`과 경과 시간 정보를 동반하여 `/api/puzzle/results` API를 호출하고 주간 랭킹 기록을 갱신합니다.
