FROM node:20-slim AS builder

WORKDIR /app

# 安装编译原生模块需要的工具
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
# npm ci 比 npm install 快，严格按照 lock 文件安装
RUN npm ci

COPY . .
RUN npm run build

# ---- 生产镜像 ----
FROM node:20-slim AS runner

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

COPY --from=builder /app/.medusa/server .

# 生产环境只需安装生成依赖，npm install 够用了
RUN npm install --production

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/app/entrypoint.sh"]
