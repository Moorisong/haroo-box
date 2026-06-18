# 하루상자 (Haroo Box)

하루상자는 바쁜 일상 속에서 사용자가 짧고 가볍게 즐길 수 있는 웹 미니게임, 심리 분석, 기록 콘텐츠를 제공하는 올인원 엔터테인먼트 플랫폼입니다.

단순히 콘텐츠를 나열하는 것에 그치지 않고, 사용자 경험의 허들을 낮추는 Guest Play First(선택적 로그인) 원칙과 카카오톡 공유 기반의 바이럴 루프를 고려하여 설계되었습니다.

---

## 1. 프로젝트 핵심 개발 및 설계 특징

* **모노레포(Monorepo) 아키텍처**: 프론트엔드와 백엔드 서비스를 하나의 저장소 내에서 효율적으로 관리하며 상호 의존성을 낮춘 독립적인 모듈 구조를 지향합니다.
* **사용자 친화적 UX (Guest Play First)**: 대다수의 미니 콘텐츠를 로그인 없이 즉시 체험할 수 있도록 초기 이탈률을 최소화하였으며, 누적 통계나 개인화 저장이 필요한 시점에만 NextAuth.js 기반의 카카오 간편 로그인을 제안합니다.
* **최적화된 스타일링**: Tailwind CSS 등의 프레임워크 도입 대신 Vanilla CSS(CSS Modules)를 채택하여 번들 크기를 최소화하고 브라우저 렌더링 성능을 개선했습니다.
* **도메인 중심의 확장형 설계**: 새로운 미니 게임이나 콘텐츠를 유연하게 탑재할 수 있도록 페이지 라우팅과 API 엔드포인트를 모듈화하여 설계했습니다.

---

## 2. 주요 콘텐츠 및 기술적 구현 사항

### 너잘알 (u-know)
* **서비스 개요**: 출제자가 자신의 성향에 관한 퀴즈를 직접 출제해 공유하면, 친구가 그 예상 답변을 맞추며 서로를 얼마나 잘 아는지 비교·분석하는 관계형 플레이 콘텐츠입니다.
* **기술적 주안점**: Dynamic Routing을 이용한 고유 퀴즈 링크 관리 및 카카오톡 공유 SDK 연동을 통한 바이럴 루프 구축, 퀴즈 대조 알고리즘 설계

### 하루퍼즐 (Haru Puzzle)
* **서비스 개요**: 매주 변경되는 새로운 고화질 이미지 퍼즐을 조각 수와 난이도에 맞추어 조립하며, 주간 랭킹 경쟁 및 힐링을 제공하는 직소퍼즐 콘텐츠입니다.
* **기술적 주안점**: Canvas API 또는 반응형 SVG/DOM 조작 기반 드래그 앤 드롭 조작계 최적화, 퍼즐 매칭 성공 판정 로직 설계 및 주간 랭킹 집계를 위한 대용량 쿼리 최적화

### 자아탐험 (htsm)
* **서비스 개요**: 조하리의 창(Johari Window) 성향 분류 기법을 기반으로, 친구들의 익명 피드백을 통해 자신도 몰랐던 스스로의 강점과 성향을 다각도로 발견하는 자아 발견 콘텐츠입니다.
* **기술적 주안점**: 익명 응답 유효성 검증 설계, 수집된 설문 데이터를 종합하여 객관적 분석 정보를 도출하는 알고리즘 구현 및 통계 정보 데이터 시각화

### TOBY (교사 지원 툴)
* **서비스 개요**: 초등학교/중학교 선생님들을 타깃으로 하여, 복잡한 설치 없이 학급 관리 및 수업 운영 과정에 활용할 수 있는 반응형 웹 도구 모음입니다.
* **기술적 주안점**: 컴포넌트 재사용성을 고려한 모듈형 UI 설계, 로컬 스토리지 및 API 통신 기반의 유연한 데이터 보존 구조

### 롤링페이퍼 (Rolling Paper)
* **서비스 개요**: 특별한 날 친구나 동료들이 모여 편안하게 따뜻한 추억을 공유할 수 있도록 지원하는 익명 롤링페이퍼 서비스입니다.
* **기술적 주안점**: CORS 설정 및 도메인 간의 유연한 사용자 이동 경로 지원 (외부 도메인 `https://r-paper-web.haroo.site` 연동 설계)

---

## 3. 기술 스택 (Tech Stack)

### Frontend
* **Framework**: Next.js (App Router, React 18)
* **State Management**: Zustand (가볍고 직관적인 글로벌 상태 관리)
* **Authentication**: NextAuth.js (Kakao OAuth)
* **Styling**: Vanilla CSS (CSS Modules)

### Backend
* **Environment**: Node.js, Express (TypeScript 기반 개발)
* **Database**: MongoDB, Mongoose (비관계형 데이터 저장 및 효율적인 스키마 관리)
* **Process Manager**: PM2 (서버 무중단 배포 및 모니터링 관리)

---

## 4. 프로젝트 구조

```text
├── apps
│   ├── web          # Next.js 기반 프론트엔드 어플리케이션
│   └── server       # Express 기반 백엔드 API 서버
├── docs
│   ├── conventions  # 코딩 컨벤션, 브랜치 전략, 커밋 룰 등 협업 문서
│   └── planning     # 각 피처 및 서비스 기획/설계 단계 아티팩트
└── README.md
```

---

## 5. 시작하기

### 1) 저장소 복제
```bash
git clone https://github.com/your-username/haroo-box.git
cd haroo-box
```

### 2) 백엔드 서버 설정 및 실행
```bash
cd apps/server
npm install
# .env 설정 (MONGODB_URI 등 지정 필요)
npm run dev
```

### 3) 프론트엔드 설정 및 실행
```bash
cd apps/web
npm install
# .env.local 설정 (NEXTAUTH_SECRET, KAKAO_CLIENT_ID 등 지정 필요)
npm run dev
```


