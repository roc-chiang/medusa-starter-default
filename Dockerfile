FROM node:20-slim AS builder

WORKDIR /app

# 安装编译原生模块需要的工具
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# ⭐️ 关键修复：对于 Yarn 4.x 项目，必须拷贝 .yarn 目录和 .yarnrc.yml 才能正确读取配置和缓存安装状态！
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn ./.yarn

# 强制开发环境安装
ENV NODE_ENV=development
RUN yarn install

COPY . .

# 增加内存上限并运行 build
RUN NODE_OPTIONS="--max_old_space_size=4096" yarn build

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

# 在 runner 阶段也需要使用 yarn 安装，直接拷贝过去
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./

ENV NODE_ENV=production
RUN yarn install --production

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/app/entrypoint.sh"]
