#!/bin/bash
ssh -p 22 ksh@192.168.0.6 << 'REMOTE_SCRIPT'
set -e
echo "=== 4. Frontend .env 변경 및 빌드 ==="
sed -i 's/claw-addict-server/box-api/g' ~/srv/box/.env
cd ~/srv/box
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

# Run build
npm run build

# Restart PM2
pm2 restart box-fe --update-env

echo "=== 배포 완료 ==="
REMOTE_SCRIPT
