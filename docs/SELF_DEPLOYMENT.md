# AI方舟 - 用户自助部署检查清单

本文档帮助用户自行完成 AI方舟 的部署，无需等待他人协助。

---

## 一、部署前检查 (5分钟)

### 1.1 服务器要求检查

在服务器上执行以下命令，确认环境符合要求：

```bash
# 检查操作系统
cat /etc/os-release

# 预期输出示例:
# NAME="Ubuntu"
# VERSION="22.04 LTS (Jammy Jellyfish)"
# ID=ubuntu
# ID_LIKE=debian
# PRETTY_NAME="Ubuntu 22.04.3 LTS"
# VERSION_ID="22.04"

# 检查 Docker
docker --version
# 预期: Docker version 20.10.x 或更高

# 检查 Docker Compose
docker-compose --version
# 预期: Docker Compose version v2.x.x 或 docker compose v2

# 检查内存
free -h
# 预期: 至少 1GB 可用内存

# 检查磁盘空间
df -h
# 预期: 至少 5GB 可用空间
```

### 1.2 环境要求

| 项目 | 最低要求 | 检查命令 |
|------|----------|----------|
| 操作系统 | Ubuntu 18.04+ / CentOS 7+ | `cat /etc/os-release` |
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.0+ | `docker-compose --version` |
| 内存 | 1GB | `free -m` |
| 磁盘 | 5GB | `df -h` |
| 带宽 | 1Mbps+ | - |

### 1.3 端口检查

确认以下端口未被占用：

```bash
# 检查 80, 443, 8000, 3000 端口
netstat -tlnp | grep -E ":80|:443|:8000|:3000"

# 如果端口被占用，需要修改 docker-compose.yml 中的端口映射
```

---

## 二、文件准备 (10分钟)

### 2.1 下载项目文件

选择以下任一方式：

**方式 A: Git 克隆 (推荐)**

```bash
cd /var/www
git clone https://github.com/your-username/ai-ark.git
cd ai-ark
```

**方式 B: 下载压缩包**

```bash
cd /var/www
mkdir -p ai-ark
cd ai-ark
curl -L https://github.com/your-username/ai-ark/archive/main.tar.gz | tar xz
mv ai-ark-main/* .
rm -rf ai-ark-main
```

**方式 C: 本地上传**

```bash
# 本地打包
cd D:\AI工具箱
tar -czvf ai-ark-deploy.tar.gz .

# 使用 SFTP 上传到服务器 /var/www/ai-ark/
# 解压
cd /var/www/ai-ark
tar -xzvf /path/to/ai-ark-deploy.tar.gz
```

### 2.2 验证文件完整性

```bash
cd /var/www/ai-ark

# 检查必要文件
ls -la docker-compose.1panel.yml
ls -la docker/Dockerfile.backend
ls -la docker/Dockerfile.frontend
ls -la dist/index.html
ls -la public/toolsData.json
ls -la backend/app/services/deepseek.py

# 预期: 所有文件都应该存在
```

### 2.3 文件结构确认

```
/var/www/ai-ark/
├── docker-compose.1panel.yml  ✅
├── docker/
│   ├── Dockerfile.backend     ✅
│   ├── Dockerfile.frontend    ✅
│   └── nginx.conf             ✅
├── backend/                   ✅
│   └── app/services/deepseek.py ✅
├── dist/                      ✅
│   └── index.html             ✅
├── public/                    ✅
│   └── toolsData.json         ✅
├── deploy.sh                  ✅
├── monitor.sh                 ✅
└── backup.sh                  ✅
```

---

## 三、配置环境变量 (2分钟)

### 3.1 创建 .env 文件

```bash
cd /var/www/ai-ark

# 方法 1: 使用 nano 编辑
nano .env

# 方法 2: 一键创建
cat > .env << 'EOF'
# AI方舟 - 环境变量配置
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
EOF

# 设置权限
chmod 600 .env
```

### 3.2 验证环境变量

```bash
# 检查文件内容
cat .env

# 预期输出应包含:
# DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
# LOG_LEVEL=INFO
```

---

## 四、构建 Docker 镜像 (5-10分钟)

### 4.1 构建后端镜像

```bash
cd /var/www/ai-ark

echo "开始构建后端镜像..."
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend

# 预计耗时 3-5 分钟
# 看到 "Successfully built xxx" 表示成功
```

### 4.2 构建前端镜像

```bash
echo "开始构建前端镜像..."
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./

# 预计耗时 1-2 分钟
```

### 4.3 验证镜像构建

```bash
# 检查镜像
docker images | grep ai-ark

# 预期输出:
# REPOSITORY          TAG       IMAGE ID       CREATED        SIZE
# ai-ark-backend      latest    xxx            xxx            xxxMB
# ai-ark-frontend     latest    xxx            xxx            xxxMB
```

---

## 五、启动服务 (2分钟)

### 5.1 启动容器

```bash
cd /var/www/ai-ark

# 停止现有容器 (如果有)
docker-compose -f docker-compose.1panel.yml down 2>/dev/null || true

# 启动服务
docker-compose -f docker-compose.1panel.yml up -d

# 等待启动
echo "等待服务启动..."
sleep 10
```

### 5.2 验证容器状态

```bash
# 检查容器运行状态
docker ps --filter "name=ai-ark"

# 预期输出:
# CONTAINER ID   IMAGE                  COMMAND                  CREATED         STATUS         PORTS                    NAMES
# xxx            ai-ark-backend:latest  "uvicorn app.main:ap…"   xxx             Up xxx seconds 0.0.0.0:8000->8000/tcp   ai-ark-backend
# xxx            ai-ark-frontend:latest "/docker-entrypoint.…"   xxx             Up xxx seconds 0.0.0.0:3000->80/tcp    ai-ark-frontend
```

---

## 六、验证部署 (2分钟)

### 6.1 API 健康检查

```bash
# 健康检查
curl http://localhost:8000/health

# 预期响应:
# {"status":"healthy","version":"1.0.0","service":"ai-ark-api"}

# 如果失败，查看日志
docker logs ai-ark-backend --tail 50
```

### 6.2 测试推荐接口

```bash
# 测试 AI 推荐功能
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"AI写作工具","max_results":5}'

# 预期: 返回 JSON 格式的推荐工具列表
```

### 6.3 前端访问测试

```bash
# 测试前端页面
curl -I http://localhost:3000

# 预期: HTTP/1.1 200 OK
```

---

## 七、部署完成检查清单

请逐项确认：

```bash
# 1. 容器运行正常
docker ps | grep ai-ark | grep "Up"

# 2. API 健康检查通过
curl -sf http://localhost:8000/health > /dev/null && echo "✅ API 健康"

# 3. 前端可访问
curl -sf http://localhost:3000 > /dev/null && echo "✅ 前端可访问"

# 4. 工具数据已加载
docker exec ai-ark-backend ls -la /app/public/toolsData.json && echo "✅ 数据文件存在"

# 5. DeepSeek API 可达
docker exec ai-ark-backend curl -sf https://api.deepseek.com > /dev/null && echo "✅ DeepSeek API 可达"
```

---

## 八、常见问题快速解决

### 问题 1: 端口被占用

```bash
# 查看占用端口的进程
netstat -tlnp | grep :8000

# 解决方案: 修改 docker-compose.1panel.yml 中的端口映射
# 将 "8000:8000" 改为 "8001:8000"
```

### 问题 2: Docker 镜像构建失败

```bash
# 查看详细错误
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend --no-cache

# 常见原因:
# 1. 网络问题 → 检查服务器网络连接
# 2. 磁盘空间不足 → df -h
# 3. Docker daemon 问题 → systemctl restart docker
```

### 问题 3: 容器启动后立即停止

```bash
# 查看容器日志
docker logs ai-ark-backend

# 常见原因:
# 1. .env 文件缺失 → 检查 .env 文件
# 2. API Key 无效 → 检查 DEEPSEEK_API_KEY
# 3. 数据文件缺失 → 检查 public/toolsData.json
```

### 问题 4: API 返回 500 错误

```bash
# 查看后端日志
docker logs -f ai-ark-backend

# 常见原因:
# 1. DeepSeek API Key 配置错误
# 2. 网络无法访问 api.deepseek.com
# 3. 数据文件格式错误
```

### 问题 5: 前端页面显示空白

```bash
# 检查前端容器日志
docker logs ai-ark-frontend

# 解决方案:
# 1. 确保 dist/ 目录有内容
# 2. 检查 Nginx 配置是否正确
# 3. 重新构建前端: docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./
```

---

## 九、后续运维

### 常用命令速查

| 操作 | 命令 |
|------|------|
| 查看状态 | `./monitor.sh status` |
| 查看日志 | `./monitor.sh logs` |
| 重启服务 | `./monitor.sh restart` |
| 健康检查 | `./monitor.sh health` |
| 备份数据 | `./backup.sh backup daily` |
| 查看备份 | `./backup.sh list` |

### 开机自启 (可选)

```bash
# 创建 systemd 服务
sudo nano /etc/systemd/system/ai-ark.service

# 添加内容:
# [Unit]
# Description=AI方舟服务
# After=docker.service
# Requires=docker.service
#
# [Service]
# Type=oneshot
# WorkingDirectory=/var/www/ai-ark
# ExecStart=/usr/bin/docker-compose -f docker-compose.1panel.yml up -d
# ExecStop=/usr/bin/docker-compose -f docker-compose.1panel.yml down
# RemainAfterExit=yes
#
# [Install]
# WantedBy=multi-user.target

# 启用服务
sudo systemctl enable ai-ark
sudo systemctl start ai-ark
```

---

## 十、联系方式

部署遇到问题？

1. 查看本文档的「常见问题」部分
2. 查看日志: `docker logs ai-ark-backend`
3. 健康检查: `./monitor.sh health`

提供以下信息以便快速定位问题：

```bash
# 操作系统
cat /etc/os-release

# Docker 版本
docker --version

# 错误日志
docker logs ai-ark-backend --tail 100
```

---

**部署成功！享受你的 AI方舟吧！** 🎉

---

*文档版本: 2026-01-31*  
*项目: AI方舟 (AI Tools Dashboard)*  
*API: DeepSeek*
