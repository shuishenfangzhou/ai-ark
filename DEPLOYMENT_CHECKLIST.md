# AI方舟 - 部署检查清单

## ✅ 部署前检查

### 1. 文件完整性

```bash
# 检查必要文件
ls -la docker-compose.yml           # ✅ Docker Compose 配置
ls -la docker-compose.1panel.yml    # ✅ 1Panel 专用配置
ls -la docker/Dockerfile.backend    # ✅ 后端 Dockerfile
ls -la docker/Dockerfile.frontend   # ✅ 前端 Dockerfile
ls -la backend/app/services/deepseek.py  # ✅ DeepSeek 服务
ls -la backend/app/api/recommend.py      # ✅ API 路由
ls -la backend/requirements.txt     # ✅ Python 依赖
ls -la dist/                        # ✅ 前端构建产物
ls -la public/toolsData.json        # ✅ 工具数据 (783KB)
ls -la .env                         # ✅ 环境变量
ls -la deploy.sh                    # ✅ 部署脚本
ls -la 1PANEL_DEPLOYMENT.md         # ✅ 1Panel 部署指南
```

### 2. 环境变量配置

```bash
# 检查 .env 文件
cat .env

# 预期输出应包含:
# DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
```

### 3. Docker 镜像构建状态

```bash
# 检查是否已构建
docker images | grep ai-ark

# 如未构建，需要执行:
cd /var/www/ai-ark
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./
```

---

## 🚀 1Panel 部署步骤

### 步骤 1: 上传项目文件

**方式 A: 使用 SFTP 上传**

1. 打包项目:
   ```bash
   cd /var/www/ai-ark
   tar -czvf /tmp/ai-ark-deploy.tar.gz .
   ```

2. 通过 SFTP 上传到服务器 `/var/www/ai-ark/`

3. 解压:
   ```bash
   cd /var/www/ai-ark
   tar -xzvf /tmp/ai-ark-deploy.tar.gz
   ```

**方式 B: 使用 Git**

```bash
cd /var/www
git clone https://github.com/your-repo/ai-ark.git
cd ai-ark
git checkout deploy
```

### 步骤 2: 配置环境变量

```bash
cd /var/www/ai-ark

# 创建 .env 文件
cat > .env << 'EOF'
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
EOF

chmod 600 .env
```

### 步骤 3: 1Panel 配置

1. **进入 1Panel**
   - 访问: `https://your-server-ip:9999`
   - 登录管理面板

2. **创建容器编排**
   - 应用商店 → 容器 → 容器编排
   - 创建新编排，使用 `docker-compose.1panel.yml`

3. **设置环境变量**
   - DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
   - LOG_LEVEL=INFO

4. **构建镜像**
   - 后端: `docker/Dockerfile.backend` → `ai-ark-backend:latest`
   - 前端: `docker/Dockerfile.frontend` → `ai-ark-frontend:latest`

5. **启动容器**

### 步骤 4: 验证部署

```bash
# 检查容器状态
docker ps | grep ai-ark

# 健康检查
curl http://localhost:8000/health
# 预期: {"status":"healthy","version":"1.0.0","service":"ai-ark-api"}

# 检查 API 推荐接口
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"AI写作工具","max_results":5}'
```

---

## 🔧 常用操作命令

### 服务管理

```bash
# 启动服务
cd /var/www/ai-ark
docker-compose -f docker-compose.1panel.yml up -d

# 停止服务
docker-compose -f docker-compose.1panel.yml down

# 重启服务
docker-compose -f docker-compose.1panel.yml restart

# 查看日志
docker logs -f ai-ark-backend
docker logs -f ai-ark-frontend
```

### 更新部署

```bash
cd /var/www/ai-ark

# 备份
./deploy.sh backup

# 更新代码
git pull origin main

# 重新构建
./deploy.sh build

# 重启服务
./deploy.sh restart
```

### 故障排查

```bash
# 查看详细日志
docker logs --tail 100 ai-ark-backend

# 检查容器资源使用
docker stats ai-ark-backend ai-ark-frontend

# 检查网络连接
docker exec ai-ark-backend ping api.deepseek.com

# 进入容器调试
docker exec -it ai-ark-backend /bin/bash
```

---

## 📊 服务状态检查

### 健康检查端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 服务健康状态 |
| `/api/recommend` | POST | AI 工具推荐 |
| `/api/tools` | GET | 获取工具列表 |
| `/api/categories` | GET | 获取分类列表 |

### 预期响应

```bash
# 健康检查
curl http://localhost:8000/health
# {"status":"healthy","version":"1.0.0","service":"ai-ark-api"}

# 推荐接口
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"AI写作工具","max_results":5}'
```

---

## ⚠️ 常见问题

### Q1: 容器启动失败

```bash
# 检查日志
docker logs ai-ark-backend

# 常见原因:
# 1. 端口已被占用 → 修改 docker-compose.yml 中的端口映射
# 2. API Key 无效 → 检查 .env 文件
# 3. 工具数据文件缺失 → 检查 public/toolsData.json
```

### Q2: API 返回 500 错误

```bash
# 检查后端日志
docker logs ai-ark-backend

# 可能原因:
# 1. DeepSeek API Key 配置错误
# 2. 网络连接问题
# 3. 数据文件格式错误
```

### Q3: 前端页面空白

```bash
# 检查前端容器
docker logs ai-ark-frontend

# 可能原因:
# 1. dist 文件夹为空 → 重新构建前端
# 2. Nginx 配置错误 → 检查 docker/nginx.conf
```

---

## 📞 联系信息

如遇到问题，请提供:

1. 操作系统版本: `cat /etc/os-release`
2. Docker 版本: `docker --version`
3. 错误日志: `docker logs ai-ark-backend`
4. API Key 状态: 是否已正确配置

---

**部署时间**: 2026-01-31  
**API 版本**: DeepSeek  
**维护者**: AI方舟团队
