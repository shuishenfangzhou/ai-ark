# AI方舟 - 完整功能部署指南

## 📋 目录

- [简介](#简介)
- [快速部署](#快速部署)
- [手动部署](#手动部署)
- [环境配置](#环境配置)
- [功能测试](#功能测试)
- [故障排除](#故障排除)

---

## 简介

AI方舟已升级为完整动态 Web 应用，包含：

| 功能 | 状态 | 说明 |
|------|------|------|
| 用户注册/登录 | ✅ | JWT 认证 |
| 工具浏览 | ✅ | 动态加载、分页 |
| 工具搜索 | ✅ | 关键词搜索 |
| 分类筛选 | ✅ | 动态分类 |
| 收藏功能 | ✅ | 登录用户专享 |
| AI 推荐 | ✅ | Gemini API (可选) |
| 数据自动更新 | ✅ | GitHub Actions 兼容 |

---

## 快速部署

### 1. 克隆并进入目录

```bash
git clone https://github.com/shuishenfangzhou/ai-ark.git
cd ai-ark
```

### 2. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置
nano .env

# 至少配置以下项:
# MYSQL_ROOT_PASSWORD=your_secure_password
# GOOGLE_API_KEY=your_gemini_api_key (可选)
```

### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f
```

### 4. 访问应用

- **前端**: http://localhost:8080
- **API 文档**: http://localhost:8080/docs
- **健康检查**: http://localhost:8080/health

---

## 手动部署

### 前置条件

- Docker Engine 20.10+
- Docker Compose 2.0+
- 1GB RAM 最小

### 步骤 1: 准备环境

```bash
# 安装 Docker (如果未安装)
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo apt-get install docker-compose
```

### 步骤 2: 配置环境变量

创建 `.env` 文件:

```bash
# 数据库密码 (必需)
MYSQL_ROOT_PASSWORD=your_secure_password

# Gemini API Key (可选，不配置则使用简化模式)
GOOGLE_API_KEY=your_gemini_api_key

# 其他配置
LOG_LEVEL=INFO
```

### 步骤 3: 启动服务

```bash
# 后台启动
docker-compose up -d

# 检查状态
docker-compose ps

# 查看日志
docker-compose logs -f nginx
```

### 步骤 4: 初始化数据库

首次启动后，MySQL 会自动初始化数据库表。

---

## 环境配置

### 必需配置

| 变量 | 说明 | 示例 |
|------|------|------|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | `MySecurePass123` |

### 可选配置

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `GOOGLE_API_KEY` | Gemini API Key | 无 (简化模式) |
| `LOG_LEVEL` | 日志级别 | `INFO` |
| `HOST` | 服务监听地址 | `0.0.0.0` |
| `PORT` | 服务端口 | `8000` |

### 获取 Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建 API Key
3. 填入 `.env` 文件

---

## 功能测试

### 1. 健康检查

```bash
curl http://localhost:8080/health
```

响应示例:
```json
{"status": "healthy", "timestamp": "2026-01-31T12:00:00"}
```

### 2. API 文档

访问: http://localhost:8080/docs

### 3. 测试用户认证

```bash
# 注册用户
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# 登录
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### 4. 测试工具列表

```bash
# 获取工具列表
curl http://localhost:8080/api/v1/tools?page=1&page_size=10

# 搜索工具
curl http://localhost:8080/api/v1/tools?q=ChatGPT

# 获取分类
curl http://localhost:8080/api/v1/categories
```

### 5. 测试收藏功能

```bash
# 获取收藏列表 (需要 Token)
curl http://localhost:8080/api/v1/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"

# 添加收藏
curl -X POST http://localhost:8080/api/v1/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"tool_id": 1}'
```

### 6. 测试 AI 推荐

```bash
curl -X POST http://localhost:8080/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "好用的AI写作工具",
    "category": "writing",
    "max_results": 5
  }'
```

---

## 故障排除

### 问题 1: 端口冲突

```
Error: Ports are already in use
```

解决方案:
```bash
# 查看占用端口的进程
lsof -i :8080

# 修改端口或停止占用进程
```

### 问题 2: MySQL 连接失败

```
ERROR: Could not connect to MySQL
```

解决方案:
```bash
# 检查 MySQL 状态
docker-compose ps

# 查看 MySQL 日志
docker-compose logs db

# 等待 MySQL 完全启动 (约30秒)
```

### 问题 3: 前端无法连接 API

```
Failed to fetch tools
```

解决方案:
```bash
# 检查后端服务状态
docker-compose logs backend

# 检查 API 是否正常
curl http://localhost:8000/health

# 重启服务
docker-compose restart
```

### 问题 4: Gemini API 不工作

```
⚠️ Gemini 服务调用失败
```

解决方案:
1. 检查 `GOOGLE_API_KEY` 是否正确配置
2. 确认 API Key 有访问权限
3. 查看后端日志: `docker-compose logs backend`
4. 服务会自动回退到简化模式，不影响基本功能

### 问题 5: 数据不更新

```
Tools count: 0
```

解决方案:
```bash
# 检查数据文件
ls -la dist/toolsData.json

# 重新构建前端
npm run build
cp dist/* public/

# 重启服务
docker-compose restart
```

---

## Docker 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| nginx | 8080 | 反向代理 + 静态资源 |
| backend | 8000 | FastAPI 后端 |
| db | 3306 | MySQL 数据库 |

### 管理命令

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启单个服务
docker-compose restart backend

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps

# 进入容器
docker-compose exec backend bash
```

---

## 1Panel 部署

### 方式 1: Docker Compose 部署

1. 上传项目到服务器
2. 配置 `.env` 文件
3. 执行:
   ```bash
   docker-compose up -d --build
   ```

### 方式 2: 1Panel 应用商店

1. 在 1Panel 中创建应用
2. 选择「Docker Compose」模板
3. 粘贴 `docker-compose.yml` 内容
4. 配置环境变量
5. 部署

---

## 监控与维护

### 日志查看

```bash
# 所有服务日志
docker-compose logs

# 单个服务日志
docker-compose logs backend
docker-compose logs nginx
docker-compose logs db
```

### 数据备份

```bash
# 备份数据库
docker-compose exec db mysqldump -u root -p ai_ark_db > backup.sql

# 备份工具数据
cp dist/toolsData.json backup_toolsData.json
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 清理旧镜像
docker image prune -f
```

---

## 性能优化

### 建议配置

| 资源 | 最低 | 推荐 |
|------|------|------|
| CPU | 1 核 | 2 核 |
| 内存 | 1GB | 2GB |
| 磁盘 | 10GB | 20GB |

### Nginx 优化

在 `nginx/default.conf` 中可以调整:

```nginx
# Gzip 压缩 (已有)
gzip on;

# 静态资源缓存 (已有)
expires 1y;
```

---

**文档版本**: 2.0.0  
**最后更新**: 2026-01-31
