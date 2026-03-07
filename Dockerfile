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

# ⭐️ 必须保留 ARG 声明，否则 Coolify 配置的环境变量可能无法正确传递到运行时的 Medusa 中
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
ARG STRIPE_API_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG RESEND_API_KEY
ARG RESEND_FROM

WORKDIR /app/.medusa/server

# 拷贝构造成出的后端代码
COPY --from=builder /app/.medusa/server .

# ⭐️ 关键修复：除了 package.json，必须也拷贝 yarn.lock 才能在生产环境下正确安装依赖
COPY --from=builder /app/package.json /app/yarn.lock* /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn

# 生产环境只需安装运行时依赖
ENV NODE_ENV=production

# ⭐️ Yarn 4.x 的生产安装命令应使用 workspaces focus
RUN yarn workspaces focus --all --production || yarn install

COPY --from=builder /app/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/app/entrypoint.sh"]