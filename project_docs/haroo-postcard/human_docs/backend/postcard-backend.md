# ⚙️ 하루엽서 백엔드 및 인프라 기획 명세서 (postcard-backend.md)

본 문서는 하루상자 모노레포(`apps/server`) 환경 내에 통합 구현되는 백엔드 API 서비스 및 TTL(Time-To-Live) 관리를 위한 서버 명세입니다.

---

## 🎯 1. 서비스 목적 및 기능 범위
- **엽서 데이터 관리**: 이미지 경로, 필터 유형, 메시지, 폰트, 유튜브 오디오 링크 정보를 저장 및 제공.
- **로컬 스토리지 업로드**: 사용자가 업로드한 이미지를 안전하게 서버 로컬 디스크에 저장.
- **TTL(Time-To-Live) 청소**: 엽서 생성 시점 기준 48시간(2일) 후 데이터베이스 기록과 물리적 파일을 모두 삭제하여 서버 자원 최적화 및 희소성 보장.

---

## 💻 2. API 엔드포인트 사양 (Router)

### 1) `POST /api/postcards` (엽서 생성)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `image`: File (엽서 배경 이미지)
  - `filter_type`: String (`vintage` | `monotone` | `film-grain` | `none`)
  - `message`: String (최대 150자)
  - `font_family`: String (`font-1` ~ `font-5`)
  - `youtube_url`: String (유튜브 비디오 링크)
- **Response**:
  - `201 Created`: `{ success: true, id: "nanoid-id", expires_at: "ISOString" }`
  - `400 Bad Request`: 필수 인자 누락 또는 파일 형식 미지원

### 2) `GET /api/postcards/:id` (엽서 단일 조회)
- **Request Params**: `id` (10자리 고유 ID)
- **Response**:
  - `200 OK`: 엽서 상세 데이터
  - `410 Gone`: 72시간이 만료되어 파기된 경우 (만료 응답 반환)
  - `404 Not Found`: 존재하지 않는 엽서 ID

---

## 📂 3. 파일 및 리소스 스토리지 아키텍처
- **저장 위치**: `apps/server/uploads/postcards/` 디렉토리에 원본 이미지 저장.
- **파일명 규칙**: 충돌 및 인젝션 방지를 위해 `UUID-timestamp.ext` 또는 `nanoid-timestamp.ext` 구조로 난독화하여 저장.
- **지원 포맷**: `image/jpeg`, `image/png`, `image/webp` (최대 파일 크기 5MB 제한).

---

## ⏱️ 4. TTL(Time-To-Live) 자동 삭제 (Cleanup) 전략
- **조회 시점 검증**: `GET /api/postcards/:id` 요청 처리 시, `expires_at < NOW()`인 경우 DB 쿼리 전 또는 쿼리 후 결과 처리에서 즉시 만료된 것으로 판단하여 410 상태 코드를 반환하고, 화면상으로 만료 안내 페이지를 보여주도록 처리.
- **배치 클린업 작업 (Cron Job)**:
  - 매일 새벽 4시(서버 최소 트래픽 시간대)에 주기적 배치 삭제 스크립트 가동.
  - **작업 내용**:
    1. DB에서 `expires_at`이 현재 시간보다 이전인 엽서 레코드 일괄 검색 및 데이터 삭제.
    2. 삭제된 레코드와 매핑되는 물리 이미지 파일(`image_path`)을 로컬 파일시스템(`uploads/postcards/`)에서 삭제.

---

## 🛡️ 5. 인프라 및 보안 설정
- **Nginx Reverse Proxy**:
  - 프론트엔드 및 백엔드 라우팅 제어.
  - `/api/postcards` 멀티파트 업로드 크기 제한 (`client_max_body_size 5M`) 설정.
- **SSL (Let's Encrypt)**:
  - HTTPS 강제 리다이렉트 적용.
  - 모바일 브라우저의 YouTube Autoplay 정책상, 보안 연결(`https://`) 하에서만 YouTube API 연동 및 오디오 활성화가 안정적으로 유동하므로 SSL 설정 필수 준수.
- **PM2 프로세스 제어**:
  - `box-be` 백엔드 노드 앱 모니터링 및 프로세스 오토 재시작 설정.
