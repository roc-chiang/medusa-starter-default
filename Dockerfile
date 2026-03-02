FROM node:20 AS builder

WORKDIR /app

COPY . .
RUN npm install --loglevel=error
RUN npm run build

# ---- 生产镜像 ----
FROM node:20-slim AS runner

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

WORKDIR /app/.medusa/server

COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/.medusa/server/package.json ./package.json

RUN npm install --production --loglevel=error

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/app/entrypoint.sh"]
