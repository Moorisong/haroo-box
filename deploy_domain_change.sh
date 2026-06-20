#!/bin/bash
ssh -p 22 ksh@192.168.0.6 << 'REMOTE_SCRIPT'
set -e

echo "=== 1. Nginx 설정 변경 ==="
sudo sed -i 's/claw-addict-server.haroo.site/box-api.haroo.site/g' /etc/nginx/sites-available/claw-addict
sudo mv /etc/nginx/sites-available/claw-addict /etc/nginx/sites-available/box-api
sudo rm -f /etc/nginx/sites-enabled/claw-addict
sudo ln -sf /etc/nginx/sites-available/box-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "=== 2. SSL 인증서 발급 ==="
sudo certbot --nginx -d box-api.haroo.site --non-interactive || sudo certbot --nginx -d box-api.haroo.site --non-interactive --register-unsafely-without-email --agree-tos

echo "=== 3. Frontend .env 변경 ==="
sed -i 's/claw-addict-server/box-api/g' ~/srv/box/.env
cat ~/srv/box/.env | grep NEXT_PUBLIC_API_URL

echo "=== 4. Frontend 빌드 및 재시작 ==="
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
