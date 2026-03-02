FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装所有依赖（包括 devDependencies，build 需要）
RUN npm install

# 复制源代码
COPY . .

# 构建（编译 TypeScript + Admin UI）
RUN npm run build

# ---- 生产镜像 ----
FROM node:20-alpine AS runner

WORKDIR /app

# 复制构建产物和依赖
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts

# 复制启动脚本
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["./entrypoint.sh"]
