# 选择基础镜像为 Alpine 3.19 版本上的 Node.js 20.10.0
FROM node:20.10.0-alpine3.19 AS base

# 选择基础镜像为最新版的 Nginx
FROM nginx:latest AS nginx

# 使用前面定义的 base 镜像作为构建阶段的基础镜像
FROM base AS builder
# 替换默认的软件源为阿里云镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装依赖包 libc6-compat，用于兼容性支持
RUN apk add --no-cache libc6-compat

# 更新 Alpine 包管理器的软件包索引
RUN apk update

# 设置工作目录为 /app
WORKDIR /app

# 全局安装 pnpm 包管理器
RUN npm i -g pnpm

# 全局安装 turbo 构建工具
RUN npm install turbo --global

# 复制当前目录下的所有文件到容器的 /app 目录
COPY . .

# 使用 turbo 删除不需要的文件和依赖，加速构建过程
RUN turbo prune admin --docker


# 使用前面定义的 base 镜像作为安装阶段的基础镜像
FROM base AS installer

# 替换默认的软件源为阿里云镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装依赖包 libc6-compat，用于兼容性支持
RUN apk add --no-cache libc6-compat

# 更新 Alpine 包管理器的软件包索引
RUN apk update

# 设置工作目录为 /app
WORKDIR /app

# 全局安装 pnpm 包管理器
RUN npm i -g pnpm

# 复制 .gitignore 文件到容器的根目录
COPY .gitignore .gitignore

# 从构建阶段的容器中复制 /app/out/json/ 目录到当前容器的根目录
COPY --from=builder /app/out/json/ .

# 从构建阶段的容器中复制 /app/out/pnpm-lock.yaml 文件到当前容器的根目录，并重命名为 pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 使用 pnpm 安装项目依赖
RUN pnpm install

# 从构建阶段的容器中复制 /app/out/full/ 目录到当前容器的根目录
COPY --from=builder /app/out/full/ .

# 复制 turbo.json 文件到容器的根目录
COPY turbo.json turbo.json

# 使用 pnpm 和 turbo 进行构建，根据过滤条件构建项目
RUN pnpm turbo build --filter=admin...


# 使用前面定义的 nginx 镜像作为运行阶段的基础镜像
FROM nginx AS runner

# 设置工作目录为 /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# 创建系统用户组 admin，并指定组ID为1001
RUN addgroup --system --gid 1001 admin

# 创建系统用户 admin，并指定用户ID为1001
RUN adduser --system --uid 1001 admin

# 切换用户为 admin 用户
USER admin

# 从安装阶段的容器中复制 /app/apps/admin/dist 目录到当前容器的工作目录
COPY --from=installer /app/apps/admin/dist .

# 注意：以上代码块中的注释仅供参考，并非实际执行的命令或操作
