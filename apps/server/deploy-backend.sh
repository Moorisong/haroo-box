#!/bin/bash
set -e

# --- 공통 설정 ---
REMOTE_USER="ksh"
LOCAL_HOST="192.168.0.6"     # 집 (LAN)
REMOTE_HOST="125.190.25.48"  # 외부 (WAN)
SSH_PORT_LOCAL="22"
SSH_PORT_WAN="8193"
REMOTE_DIR="~/haroo-box/apps/server"
LOCAL_SERVER_ROOT="."

# --- 네트워크 자동 감지 ---
if ping -c 1 -W 2 "$LOCAL_HOST" > /dev/null 2>&1; then
  REMOTE_HOST="$LOCAL_HOST"
  SSH_PORT="$SSH_PORT_LOCAL"
  SSH_OPT=""
  RSYNC_SSH="ssh"
  echo "🏠 집 네트워크 감지됨 → LAN($REMOTE_HOST) 배포"
else
  SSH_PORT="$SSH_PORT_WAN"
  SSH_OPT="-p $SSH_PORT"
  RSYNC_SSH="ssh -p $SSH_PORT"
  echo "🌐 외부 네트워크 감지됨 → WAN($REMOTE_HOST:$SSH_PORT) 배포"
fi

# 안정적인 SSH 실행 함수 (일시적 WAN 연결 차단 대비 재시도)
run_ssh() {
  local max_retries=3
  local attempt=1
  while [ $attempt -le $max_retries ]; do
    if ssh $SSH_OPT $REMOTE_USER@$REMOTE_HOST "$@"; then
      return 0
    fi
    echo "⚠️ SSH 연결 재시도 중 ($attempt/$max_retries)..."
    sleep 2
    attempt=$((attempt + 1))
  done
  echo "❌ SSH 연결에 최종 실패했습니다." >&2
  return 1
}

# 1. 로컬 백엔드 파일 서버로 동기화 (삭제된 파일도 서버에서 제거)
echo "📤 파일 동기화 중 (rsync)..."
rsync -avz --delete --progress -e "$RSYNC_SSH" \
  --rsync-path="mkdir -p $REMOTE_DIR && rsync" \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude '.env' \
  $LOCAL_SERVER_ROOT/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

sleep 1

# 2. 서버에서 빌드 및 실행 명령 전달
echo "🛠️ 서버에서 빌드 및 PM2 실행 중..."
run_ssh "
  export NVM_DIR=\"\$HOME/.nvm\"
  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
  
  if command -v nvm > /dev/null 2>&1; then
    nvm use 20
  fi
  
  echo \"사용중인 Node 버전: \$(node -v)\"
  
  cd $REMOTE_DIR && \
  npm install && \
  npm run build && \
  pm2 reload box-be --update-env || pm2 start ecosystem.config.js
"

echo "✅ 배포 완료!"
