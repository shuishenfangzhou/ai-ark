# AI方舟 - 快速部署指南

## 一键部署命令

在服务器上执行以下命令即可完成部署：

```bash
# 方法 1: 使用安装脚本
bash <(curl -sL https://raw.githubusercontent.com/your-repo/ai-ark/main/server-deploy.sh)

# 方法 2: 手动部署
cd /var/www/ai-ark
bash server-deploy.sh one-click
```

## 手动分步部署

### 步骤 1: 安装依赖

```bash
# 确保 Docker 已安装
docker --version
docker-compose --version
```

### 步骤 2: 下载项目

```bash
# 方式 A: Git
cd /var/www
git clone https://github.com/your-username/ai-ark.git
cd ai-ark

# 方式 B: 下载压缩包
cd /var/www
mkdir -p ai-ark
cd ai-ark
curl -L https://github.com/your-username/ai-ark/archive/main.tar.gz | tar xz
mv ai-ark-main/* .
rm -rf ai-ark-main
```

### 步骤 3: 配置环境

```bash
cd /var/www/ai-ark

# 创建 .env 文件
cat > .env << 'EOF'
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
EOF

chmod 600 .env
```

### 步骤 4: 构建与运行

```bash
cd /var/www/ai-ark

# 构建后端镜像
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend

# 构建前端镜像
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./

# 启动服务
docker-compose -f docker-compose.1panel.yml up -d
```

### 步骤 5: 验证

```bash
# 检查容器
docker ps | grep ai-ark

# 健康检查
curl http://localhost:8000/health
```

## Docker Compose 配置

### 1Panel 专用 (docker-compose.1panel.yml)

```yaml
version: '3.8'

services:
  backend:
    image: ai-ark-backend:latest
    container_name: ai-ark-backend
    environment:
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - LOG_LEVEL=INFO
    ports:
      - "8000:8000"
    volumes:
      - ./public/toolsData.json:/app/public/toolsData.json:ro
    restart: unless-stopped

  frontend:
    image: ai-ark-frontend:latest
    container_name: ai-ark-frontend
    ports:
      - "3000:80"
    restart: unless-stopped
```

## 服务管理

| 操作 | 命令 |
|------|------|
| 启动 | `docker-compose -f docker-compose.1panel.yml up -d` |
| 停止 | `docker-compose -f docker-compose.1panel.yml down` |
| 重启 | `docker-compose -f docker-compose.1panel.yml restart` |
| 日志 | `docker logs -f ai-ark-backend` |
| 进入容器 | `docker exec -it ai-ark-backend /bin/bash` |

## 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://your-server-ip:3000 |
| API | http://your-server-ip:8000 |
| 健康检查 | http://your-server-ip:8000/health |

## 端口说明

| 端口 | 服务 | 说明 |
|------|------|------|
| 3000 | 前端 | Vite 构建的静态页面 |
| 8000 | 后端 | FastAPI REST API |

## Nginx 反向代理配置 (1Panel)

如需使用 80 端口，在 1Panel 网站配置中添加：

```nginx
# 前端
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# API
location /api/ {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 故障排查

```bash
# 1. 检查容器状态
docker ps -a | grep ai-ark

# 2. 查看错误日志
docker logs ai-ark-backend --tail 100

# 3. 检查端口占用
netstat -tlnp | grep -E "3000|8000"

# 4. 测试 API 连通性
curl -v http://localhost:8000/health

# 5. 检查 DeepSeek API
docker exec ai-ark-backend curl -s https://api.deepseek.com
```

## 更新部署

```bash
cd /var/www/ai-ark

# 备份
cp -r public/toolsData.json /backup/toolsData.json.$(date +%Y%m%d)

# 更新代码
git pull

# 重新构建
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./

# 重启
docker-compose -f docker-compose.1panel.yml down
docker-compose -f docker-compose.1panel.yml up -d
```

## 数据备份

```bash
# 备份工具数据
cp /var/www/ai-ark/public/toolsData.json /backup/

# 备份 Docker 镜像
docker save ai-ark-backend ai-ark-frontend > /backup/ai-ark-images.tar
```
