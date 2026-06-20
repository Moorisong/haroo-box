# HTSM Backend Agent Reference

## 📝 1. 연동 기획 명세
- 자아탐험(HTSM) 백엔드 API 명세에 따름 (`/api/htsm`).
- `joharitests`, `joharianswers`, `htsmstats` 컬렉션 연동.

## 🤖 2. 목적 및 개발 지침
### 🎯 목적
- HTSM 조하리의 창 데이터 CRUD 연산 최적화.
### 🛠️ 개발 지침
- 익명 사용자를 위한 단방향 Fingerprint 해싱 로직 적용.
- MongoDB TTL 인덱스를 통해 30일 만료 정책 관리.

## 🚨 3. 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 코드는 300줄 초과 금지.
- **[보안 검증]:** 중복 응답 방지를 위한 지문 해시 검증 필수.
