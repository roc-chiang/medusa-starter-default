#!/bin/sh
set -e

echo ">>> 运行数据库迁移..."
node_modules/.bin/medusa db:migrate

echo ">>> 启动 Medusa 服务..."
exec node_modules/.bin/medusa start
