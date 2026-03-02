#!/bin/sh
set -e

echo ">>> 运行数据库迁移..."
npx medusa db:migrate

echo ">>> 启动 Medusa 服务..."
exec npm run start
