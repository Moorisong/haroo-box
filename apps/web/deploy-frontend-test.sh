#!/bin/bash
set -e

# --- 공통 설정 ---
REMOTE_USER="ksh"
LOCAL_HOST="192.168.0.6"     # 집 (LAN)
REMOTE_HOST="125.190.25.48"  # 외부 (WAN)
SSH_PORT_LOCAL="22"
SSH_PORT_WAN="2222"
REMOTE_DIR="~/srv/box-test"
LOCAL_SERVER_ROOT="."

# --- 네트워크 자동 감지 ---
if ping -c 1 -W 2 "$LOCAL_HOST" > /dev/null 2>&1; then
  REMOTE_HOST="$LOCAL_HOST"
  SSH_PORT="$SSH_PORT_LOCAL"
  SSH_OPT=""
  RSYNC_SSH="ssh"
  echo "🏠 집 네트워크 감지됨 → LAN($REMOTE_HOST) 테스트 서버 배포"
else
  SSH_PORT="$SSH_PORT_WAN"
  SSH_OPT="-p $SSH_PORT"
  RSYNC_SSH="ssh -p $SSH_PORT"
  echo "🌐 외부 네트워크 감지됨 → WAN($REMOTE_HOST:$SSH_PORT) 테스트 서버 배포"
fi

# 0. 서버에 디렉토리가 없으면 생성
ssh $SSH_OPT $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_DIR"

# 1. 로컬 프론트엔드 파일 서버로 동기화 (삭제된 파일도 서버에서 제거)
echo "📤 파일 동기화 중 (rsync)..."
rsync -avz --delete --progress -e "$RSYNC_SSH" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env' \
  $LOCAL_SERVER_ROOT/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# 2. 서버에서 빌드 및 실행 명령 전달
echo "🛠️ 서버에서 빌드 및 PM2 실행 중..."
ssh $SSH_OPT $REMOTE_USER@$REMOTE_HOST "
  export NVM_DIR=\"\$HOME/.nvm\"
  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
  
  if command -v nvm > /dev/null 2>&1; then
    nvm use 20
  fi
  
  echo \"사용중인 Node 버전: \$(node -v)\"
  
  cd $REMOTE_DIR && \
  npm install && \
  rm -rf .next && \
  npm run build && \
  pm2 restart box-fe-test --update-env || pm2 start ecosystem-test.config.js
"

echo "✅ 테스트 프론트엔드 배포 완료!"
