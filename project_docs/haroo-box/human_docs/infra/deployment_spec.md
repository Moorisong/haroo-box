# 홈서버 및 배포 인프라 명세 (`deployment_spec.md`)

## 1. 배포 아키텍처 개요
본 서비스는 별도의 클라우드 상용 서비스 대신 개인이 운영하는 **홈서버 환경**에 메인 웹 앱(프론트엔드)과 API 서버(백엔드)를 배포하고, 정적 도구(TOBY)는 Vercel을 통해 분할 배포하는 하이브리드 아키텍처를 채택하고 있습니다.
서버 관리와 무중단 서비스를 보장하기 위해 프로세스 매니저(PM2)와 자동화 셸 스크립트를 사용하여 구축되었습니다.

---

## 2. 홈서버 배포 상세 스펙

### 1) 네트워크 자동 감지 배포 자동화
배포 작업을 로컬 개발 장비에서 홈서버로 전송할 때, 개발 장비의 현재 네트워크 상태(사내/집 LAN 환경 또는 외부 망)를 자동 감지하는 지능형 스크립트를 작성하여 사용하고 있습니다.
* **파일**:
  * 프론트엔드 배포: `deploy-frontend.sh`
  * 백엔드 배포: `deploy-backend.sh`
* **감지 알고리즘**:
  * 집 LAN 대역 IP(`192.168.0.6`)에 ping을 2초간 시도.
  * 응답 성공 시: 로컬 포트 `22`로 연결하여 고속 rsync 전송.
  * 응답 실패 시: 외부 포트 `2222` (WAN 공인 IP `125.190.25.48`)로 포트포워딩 경로를 우회하여 SSH 접속.
* **동기화 제외 목록**: `node_modules`, `.git`, `.env`, `.next` (프론트엔드), `dist` (백엔드)

---

### 2) 백엔드 프로세스 제어 (`box-be`)
* **프로세스 매니저**: PM2
* **설정 파일**: `apps/server/ecosystem.config.js`
* **구동 방식**: production 환경 모드로 `npm start` 실행 (실제 내부 entrypoint: `node dist/index.js`).
* **환경 정보 릴로드**: 배포 스크립트를 통해 파일 전송 후 `pm2 reload box-be --update-env` 명령을 내려 무중단 서비스 리로딩 구현.

### 3) 프론트엔드 프로세스 제어 (`box-fe`)
* **프로세스 매니저**: PM2
* **설정 파일**: `apps/web/ecosystem.config.js`
* **구동 방식**: 내부 포트 `3002`, 루프백 IP `127.0.0.1`로 고정하여 `npm start -- -p 3002 -H 127.0.0.1` 명령 실행.
* **환경 정보 릴로드**: `pm2 restart box-fe --update-env` 실행.

---

## 3. 네트워크 및 Nginx 프록시 설정 (추정)

배포 포트 및 도메인 설정을 기반으로 한 네트워크 포트 맵입니다.

* **도메인 맵**:
  * 프론트엔드 도메인: `https://box.haroo.site` (포트 `3002` 프록시)
  * 백엔드 API 도메인: `https://box-api.haroo.site` (포트 `3000` 프록시)
  * 롤링페이퍼 연동 도메인: `https://r-paper-web.haroo.site`
* **프록시 패스 설정**:
  * 외부 SSL 통신(Port 443) 수신 후, Nginx 등 리버스 프록시 장비가 SSL Offloading을 수행하여 홈서버의 각 내부 포트로 트래픽을 토스합니다.

---

## 4. TOBY 교사 지원 툴 배포 (`apps/toby`)

TOBY 웹 도구는 정적 파일(Static Web Asset)로 빌드되므로 **Vercel**을 통해 배포되고 있습니다.
* **설정 파일**: `apps/toby/vercel.json`
* **빌드 설정**:
  * 빌드 명령어: `npm run build` (Vite 빌드, 결과물 `dist/` 폴더 저장)
  * 빌드 프레임워크: `vite`
* **라우팅 처리**:
  * SPA의 특성상 React Router DOM을 사용하기 때문에 모든 URL 경로로의 접근을 `index.html`로 프록시 포워딩하는 rewrite 규칙 설정.
  ```json
  "rewrites": [
      {
          "source": "/(.*)",
          "destination": "/index.html"
      }
  ]
  ```
