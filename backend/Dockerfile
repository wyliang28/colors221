# 使用 Python 3.9 基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将代码复制到容器中
COPY . .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

# 运行 Flask 服务
CMD ["python", "app.py"]
