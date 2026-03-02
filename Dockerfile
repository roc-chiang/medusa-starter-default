FROM node:20-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# ---- 生产镜像 ----
FROM node:20-alpine AS runner

# 声明 Build Args（Coolify 需要在 build 阶段注入这些变量）
ARG DATABASE_URL
ARG REDIS_URL
ARG COOKIE_SECRET
ARG JWT_SECRET
ARG STORE_CORS
ARG ADMIN_CORS
ARG AUTH_CORS
ARG DISABLE_ADMIN
ARG WORKER_MODE
ARG PORT
ARG BACKEND_URL

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.medusa ./.medusa

WORKDIR /app/.medusa/server

# 只安装生产依赖
RUN npm install --production

# 复制启动脚本
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/app/entrypoint.sh"]
