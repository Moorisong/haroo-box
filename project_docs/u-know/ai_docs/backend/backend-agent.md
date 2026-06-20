# U-Know Backend Agent Reference

## 📝 1. 연동 기획 명세
- 너잘알(U-Know) 백엔드 API 명세에 따름 (`/api/u-know`).
- `uknowtests`, `uknowresponses` 컬렉션 연동.

## 🤖 2. 목적 및 개발 지침
### 🎯 목적
- 퀴즈 출제 및 정답 대조 친밀도 점수 계산 로직 처리.
### 🛠️ 개발 지침
- 데이터 자체 만료 기간 설정에 따른 TTL 정책 준수.

## 🚨 3. 제약 조건
- **[300줄 분리 규칙]:** 단일 파일 코드는 300줄 초과 금지.
- **[보안]:** 악성 스팸 방지를 위한 IP 기반 Rate Limiter 적용.
