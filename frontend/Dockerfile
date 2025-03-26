# 基于 Node.js 镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 将代码复制到容器中
COPY . .

EXPOSE 3001

# 安装依赖
RUN npm install

# 构建前端
RUN npm run build

# 使用 serve 提供静态资源
CMD ["npx", "serve", "-s", "build", "-l", "3001"]
