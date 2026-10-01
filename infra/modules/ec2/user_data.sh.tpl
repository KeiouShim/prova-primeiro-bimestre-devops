#!/bin/bash
set -euxo pipefail
dnf install -y docker git
systemctl enable --now docker

git clone ${repo_url} /opt/reservas
cd /opt/reservas/app
docker build -t reservas-api .

docker run -d --name reservas-api --restart unless-stopped -p 3000:3000 \
  -e DB_HOST=${db_host} \
  -e DB_PORT=5432 \
  -e DB_NAME=${db_name} \
  -e DB_USER=${db_username} \
  -e DB_PASSWORD="${db_password}" \
  -e DB_SSL=true \
  reservas-api
