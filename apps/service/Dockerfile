# 第一阶段，使用 alpine3.19 版本的 Node.js 基础镜像作为基础构建环境
FROM node:20.10.0-alpine3.19 AS base

# 第二阶段，安装依赖库，并使用 Turbo 工具清理冗余文件（service 目录）并生成 Docker 镜像
FROM base AS builder

# 安装 libc6-compat 库，使得系统能够兼容 glibc 的二进制文件
RUN apk add --no-cache libc6-compat
RUN apk update

# 设置工作目录
WORKDIR /app

# 全局安装 pnpm 和 turbo
RUN npm i -g pnpm
RUN npm install turbo --global

# 复制项目代码到容器中
COPY . .

# 使用 Turbo 工具清理冗余文件（service 目录），并生成 Docker 镜像
RUN turbo prune service --docker


# 第三阶段，安装依赖库，并将编译后的代码和配置文件复制到容器中，使用 Turbo 工具构建项目
FROM base AS installer

# 安装 libc6-compat 库，使得系统能够兼容 glibc 的二进制文件
RUN apk add --no-cache libc6-compat
RUN apk update

# 设置工作目录
WORKDIR /app

# 全局安装 pnpm
RUN npm i -g pnpm

# 复制项目代码和配置文件到容器中
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 使用 pnpm 安装依赖
RUN pnpm install

# 复制编译后的代码到容器中
COPY --from=builder /app/out/full/ .

# 复制 Turbo 配置文件到容器中
COPY turbo.json turbo.json

# 使用 Turbo 工具构建项目
RUN pnpm turbo build --filter=service...


# 第四阶段，创建 nestjs 用户和组，并切换到 nestjs 用户。然后将安装器镜像中的代码复制到运行时镜像中，并设置容器启动命令为运行 `node apps/service/dist/main.js`
FROM base AS runner

# 设置工作目录
WORKDIR /app

# 创建 nestjs 用户和组
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# 切换用户到 nestjs
USER nestjs

# 复制安装器镜像中的代码到运行时镜像中
COPY --from=installer /app .

# 设置容器启动命令
CMD node apps/service/dist/main.js
