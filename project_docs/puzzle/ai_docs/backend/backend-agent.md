# Puzzle Backend Agent Reference

## 📝 1. 연동 기획 명세
- 하루퍼즐(Puzzle) 백엔드 API 명세에 따름 (`/api/puzzle`).
- `puzzles`, `puzzleprogresses`, `puzzleresults`, `challengetokens` 컬렉션 연동.

## 🤖 2. 목적 및 개발 지침
### 🎯 목적
- 퍼즐 실시간 진행률(Autosave) 저장 및 초고속 랭킹 보드 계산.
### 🛠️ 개발 지침
- 챌린지 무결성 검증을 위한 1회성 토큰 발급 및 사용 완료 처리.

## 🚨 3. 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 코드는 300줄 초과 금지.
- **[어뷰징 방지]:** 토큰 이중 검증(`verifyChallenge`) 필수 적용.
