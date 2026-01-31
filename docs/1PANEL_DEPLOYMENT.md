# AI方舟 - 1Panel 部署指南

本文档详细说明如何使用 1Panel 在 Linux 服务器上部署 AI方舟 (AI Tools Dashboard)。

## 📋 目录

- [前提条件](#前提条件)
- [步骤 1: 上传项目](#步骤-1-上传项目)
- [步骤 2: 在 1Panel 中创建应用](#步骤-2-在-1panel-中创建应用)
- [步骤 3: 配置环境变量](#步骤-3-配置环境变量)
- [步骤 4: 部署完成](#步骤-4-部署完成)
- [常见问题](#常见问题)

---

## 前提条件

### 服务器要求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| CPU | 1 核 | 2 核 |
| 内存 | 1 GB | 2 GB |
| 磁盘 | 5 GB | 20 GB |
| 带宽 | 1 Mbps | 5 Mbps |
| 系统 | CentOS 7+/Ubuntu 18+/Debian 10+ | 同左 |

### 1Panel 要求

- 1Panel 已安装并运行
- 已安装 Docker 插件
- 已安装 Nginx 插件 (或使用 1Panel 的网站功能)

---

## 步骤 1: 上传项目

### 方式 A: 使用 SFTP 上传

1. 打包项目文件:
   ```bash
   cd /path/to/ai-ark
   tar -czvf ai-ark-deploy.tar.gz \
       backend/ \
       docker/ \
       public/ \
       src/ \
       dist/ \
       docker-compose.yml \
       .env.example \
       package.json
   ```

2. 通过 SFTP 上传 `ai-ark-deploy.tar.gz` 到服务器 `/tmp/` 目录

3. SSH 连接服务器，解压:
   ```bash
   ssh root@your-server-ip
   cd /var/www
   mkdir -p ai-ark
   cd ai-ark
   tar -xzvf /tmp/ai-ark-deploy.tar.gz
   ```

### 方式 B: 使用 Git (推荐)

```bash
# SSH 连接服务器
ssh root@your-server-ip

# 进入网站目录
cd /var/www
git clone https://github.com/your-username/ai-ark.git
cd ai-ark

# 切换到部署分支 (如果有)
git checkout deploy
```

---

## 步骤 2: 在 1Panel 中创建应用

### 2.1 打开 1Panel

1. 浏览器访问: `https://your-server-ip:9999`
2. 登录 1Panel 管理面板

### 2.2 创建 Docker 容器编排

1. 进入 **「应用商店」** → **「容器」** → **「容器编排」**
2. 点击 **「创建」**

### 2.3 填写编排配置

#### 基础信息

```
名称: ai-ark
描述: AI工具导航平台
```

#### 编排模板

复制以下内容到 **「编排配置」** 标签页:

```yaml
version: '3.8'

services:
  # 后端 API 服务
  backend:
    image: ai-ark-backend:latest
    container_name: ai-ark-backend
    environment:
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=8000
    volumes:
      - ./public/toolsData.json:/app/public/toolsData.json:ro
    networks:
      - ai-ark-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=5)"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  # 前端静态服务
  frontend:
    image: ai-ark-frontend:latest
    container_name: ai-ark-frontend
    depends_on:
      - backend
    networks:
      - ai-ark-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: ai-ark-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./dist:/usr/share/nginx/html:ro
    depends_on:
      - frontend
      - backend
    networks:
      - ai-ark-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

networks:
  ai-ark-network:
    driver: bridge
```

#### 网络配置

```
网络名称: ai-ark-network
子网: 172.28.0.0/16
网关: 172.28.0.1
```

### 2.4 构建镜像

在 1Panel 容器编排界面中:

1. 点击 **「构建镜像」**
2. 选择 **「本地构建」**
3. 设置构建参数:
   ```
   构建目录: /var/www/ai-ark
   Dockerfile 路径: ./docker/Dockerfile.backend
   镜像名称: ai-ark-backend
   标签: latest
   ```
4. 点击 **「开始构建」**

5. 同样构建前端镜像:
   ```
   Dockerfile 路径: ./docker/Dockerfile.frontend
   镜像名称: ai-ark-frontend
   标签: latest
   ```

### 2.5 启动编排

1. 返回容器编排页面
2. 找到 **「ai-ark」** 应用
3. 点击 **「启动」**

---

## 步骤 3: 配置环境变量

### 3.1 创建 .env 文件

在服务器上创建 `.env` 文件:

```bash
cd /var/www/ai-ark
nano .env
```

填写以下内容:

```bash
# AI方舟 - 环境变量配置
# DeepSeek API 版本 (2026-01-31)

# DeepSeek API Key
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099

# 应用配置
APP_NAME=AI方舟 API
APP_VERSION=1.0.0
LOG_LEVEL=INFO

# 服务器配置
HOST=0.0.0.0
PORT=8000

# CORS 配置 (生产环境应限制域名)
CORS_ORIGINS=["*"]

# DeepSeek 模型配置
DEEPSEEK_EMBEDDING_MODEL=deepseek-embed
DEEPSEEK_CHAT_MODEL=deepseek-chat
```

### 3.2 在 1Panel 中设置环境变量

1. 进入 1Panel **「应用商店」** → **「容器」** → **「容器编排」**
2. 找到 **「ai-ark」** → 点击 **「配置」**
3. 在 **「环境变量」** 部分添加:
   ```
   DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
   LOG_LEVEL=INFO
   ```
4. 点击 **「保存」** → **「重启」**

---

## 步骤 4: 部署完成

### 4.1 验证服务

```bash
# 检查容器状态
docker-compose -f /var/www/ai-ark/docker-compose.yml ps

# 查看日志
docker logs ai-ark-backend
docker logs ai-ark-nginx
```

### 4.2 测试 API

```bash
# 健康检查
curl http://localhost/health

# 预期响应:
# {"status":"healthy","version":"1.0.0","service":"ai-ark-api"}
```

### 4.3 访问应用

| 服务 | 地址 | 描述 |
|------|------|------|
| 前端 | http://your-server-ip | AI 工具导航界面 |
| API | http://your-server-ip/api/recommend | 推荐接口 |
| API 文档 | http://your-server-ip/docs | Swagger 文档 |

---

## 步骤 5: 配置域名 (可选但推荐)

### 5.1 在 1Panel 中添加网站

1. 进入 1Panel **「网站」** → **「创建网站」**
2. 填写:
   ```
   域名: ai-ark.yourdomain.com
   根目录: /var/www/ai-ark/dist
   ```
3. 点击 **「创建」**

### 5.2 配置 SSL 证书

1. 进入 **「SSL」** → **「申请证书」**
2. 选择 Let's Encrypt 免费证书
3. 自动配置 HTTPS

### 5.3 配置反向代理

如果需要通过域名直接访问 API:

1. 网站 **「配置文件」**
2. 添加反向代理:

```nginx
location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /docs {
    proxy_pass http://backend:8000/docs;
}
```

---

## 常见问题

### Q1: 容器启动失败，提示 "端口已被占用"

**解决方法:**
```bash
# 查看端口占用
netstat -tlnp | grep 80
netstat -tlnp | grep 443

# 修改 docker-compose.yml 中的端口映射
nginx:
  ports:
    - "8080:80"  # 改为 8080:80
    - "8443:443" # 改为 8443:443
```

### Q2: 后端连接 DeepSeek API 失败

**解决方法:**
1. 检查 API Key 是否正确
2. 检查服务器是否能访问 `api.deepseek.com`
3. 查看后端日志:
   ```bash
   docker logs ai-ark-backend
   ```

### Q3: 前端页面显示空白

**解决方法:**
1. 检查是否已构建前端:
   ```bash
   ls -la dist/
   ```
2. 重新构建:
   ```bash
   npm run build
   ```

### Q4: 如何更新应用

```bash
cd /var/www/ai-ark

# 拉取最新代码
git pull origin main

# 重新构建镜像
docker build -t ai-ark-backend:latest ./backend
docker build -t ai-ark-frontend:latest .

# 重启容器
docker-compose down
docker-compose up -d
```

### Q5: 如何备份数据

```bash
# 备份工具数据
cp /var/www/ai-ark/public/toolsData.json /backup/toolsData.json.backup

# 备份 Docker 镜像
docker save ai-ark-backend ai-ark-frontend > /backup/ai-ark-images.tar
```

---

## 📞 技术支持

如遇到问题，请提供以下信息:

1. 操作系统版本: `cat /etc/os-release`
2. Docker 版本: `docker --version`
3. 1Panel 版本: 在 1Panel 面板底部查看
4. 错误日志: `docker logs ai-ark-backend`

---

**🎉 恭喜！AI方舟已成功部署到 1Panel！**
