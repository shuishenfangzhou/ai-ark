# AI方舟 - 部署指南

## 新架构概览 (全栈化重构)

**2026-01 更新**: 项目已从静态网站升级为全栈架构!

| 组件 | 技术栈 | 说明 |
|------|--------|------|
| 前端 | 静态 HTML/JS | dist/ 目录 |
| 后端 | FastAPI + SQLAlchemy | API 服务 |
| 数据库 | MySQL 8.0 | 数据存储 |
| 反向代理 | Nginx | 静态服务 + API 代理 |
| 部署 | Docker Compose | 一键部署 |

---

## 快速部署

### 方式一：标准 Docker Compose

```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env，设置 MYSQL_ROOT_PASSWORD

# 2. 构建并启动
docker-compose up -d --build

# 3. 初始化数据库（首次部署）
docker-compose exec backend python init_db.py

# 4. 访问应用
# 前端: http://localhost:8080
# API文档: http://localhost:8080/docs
```

### 方式二：1Panel 部署

```bash
# 1. 上传文件到服务器
scp -r . user@server:/opt/ai-ark-pro/

# 2. 登录服务器
ssh user@server

# 3. 配置环境变量
cd /opt/ai-ark-pro
cp .env.example .env
# 编辑 .env

# 4. 启动服务
docker-compose -f docker-compose.1panel.yml up -d --build

# 5. 初始化数据库
docker-compose -f docker-compose.1panel.yml exec backend python init_db.py
```

## 目录结构

```
ai-ark/
├── docker-compose.yml           # 标准部署配置
├── docker-compose.1panel.yml    # 1Panel部署配置
├── init_db.py                   # 数据库初始化脚本
├── backend/                     # FastAPI后端
│   ├── Dockerfile
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── nginx/                       # Nginx配置
│   └── default.conf
└── dist/                        # 前端静态资源
    ├── index.html
    └── toolsData.json
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/tools` | GET | 获取工具列表 |
| `/api/tools?keyword=xxx` | GET | 搜索工具 |
| `/api/tools?category=xxx` | GET | 按分类筛选 |
| `/api/categories` | GET | 获取分类列表 |
| `/health` | GET | 健康检查 |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MYSQL_ROOT_PASSWORD` | password | MySQL root密码 |
| `DATABASE_URL` | 自动生成 | 数据库连接字符串 |
| `LOG_LEVEL` | INFO | 日志级别 |

## 数据迁移

如果需要重新导入数据：

```bash
# 清空数据库
docker-compose exec db mysql -uroot -ppassword -e 'DELETE FROM ai_ark_db.tools;'

# 重新导入
docker-compose exec backend python init_db.py
```

---

## 目录

1. [环境要求](#环境要求)
2. [本地开发](#本地开发)
3. [Docker 部署](#docker-部署)
4. [生产环境](#生产环境)
5. [常见问题](#常见问题)

---

## 环境要求

### 最小配置

| 组件 | 最低要求 |
|------|----------|
| CPU | 1 核 |
| RAM | 1 GB |
| 磁盘 | 2 GB |
| Docker | 20.10+ |
| Docker Compose | 2.0+ |

### 推荐配置

| 组件 | 推荐配置 |
|------|----------|
| CPU | 2 核 |
| RAM | 2 GB |
| 磁盘 | 10 GB |
| Docker | 24.0+ |
| Docker Compose | 2.20+ |

---

## 本地开发

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd ai-ark
```

### 2. 后端开发

```bash
# 创建虚拟环境
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 运行开发服务器
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. 前端开发

```bash
# 新终端
cd ai-ark
npm install
npm run dev
```

### 4. 访问应用

- 前端: http://localhost:5173
- API: http://localhost:8000
- API 文档: http://localhost:8000/docs

---

## Docker 部署

### 1. 前置准备

```bash
# 确保 Docker 运行
docker --version
docker-compose --version

# 克隆项目
git clone <your-repo-url>
cd ai-ark
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置
notepad .env  # Windows
# 或 nano .env  # Linux/Mac
```

**重要**: 配置 `GOOGLE_API_KEY`

```env
# .env 文件
GOOGLE_API_KEY=your_google_api_key_here
LOG_LEVEL=INFO
```

### 3. 构建并启动

```bash
# 构建所有服务
docker-compose up -d --build

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 验证部署

```bash
# 健康检查
curl http://localhost/health

# 预期响应
{"status":"healthy","version":"1.0.0","service":"ai-ark-api"}

# 测试 API
curl -X POST http://localhost/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "AI写作工具", "max_results": 3}'
```

### 5. 常用命令

```bash
# 停止服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f backend
docker-compose logs -f nginx

# 更新部署
git pull
docker-compose up -d --build
```

---

## 生产环境

### 1. 服务器准备

```bash
# 安装 Docker (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2. 域名与 SSL

#### 使用 Let's Encrypt (免费 SSL)

```bash
# 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com
```

#### Nginx 配置 SSL

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... 其他配置
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. 系统服务 (systemd)

创建服务文件 `/etc/systemd/system/ai-ark.service`:

```ini
[Unit]
Description=AI方舟 Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
WorkingDirectory=/path/to/ai-ark
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

启用服务:

```bash
sudo systemctl enable ai-ark
sudo systemctl start ai-ark
sudo systemctl status ai-ark
```

### 4. 监控与日志

#### 日志配置

```bash
# 查看所有日志
journalctl -u ai-ark -f

# 查看特定服务日志
docker-compose logs nginx
docker-compose logs backend
```

#### 健康监控

创建监控脚本 `monitor.sh`:

```bash
#!/bin/bash

# 检查健康状态
if curl -s http://localhost/health | grep -q "healthy"; then
    echo "[OK] 服务正常运行"
    exit 0
else
    echo "[ERROR] 服务异常"
    # 发送告警邮件或通知
    exit 1
fi
```

添加到 crontab:

```bash
# 每 5 分钟检查一次
*/5 * * * * /path/to/monitor.sh >> /var/log/ai-ark-monitor.log 2>&1
```

---

## 常见问题

### Q1: Docker 构建失败

**问题**: `docker-compose up -d` 报错

**解决方案**:
```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### Q2: 端口被占用

**问题**: `Port 80 is already in use`

**解决方案**:
```bash
# 查看占用端口的进程
sudo lsof -i :80

# 修改 docker-compose.yml 中的端口映射
ports:
  - "8080:80"  # 使用 8080 端口
```

### Q3: API 返回 500 错误

**问题**: `/api/recommend` 返回 500

**排查步骤**:
```bash
# 查看后端日志
docker-compose logs backend

# 常见原因:
# 1. GOOGLE_API_KEY 未配置
# 2. 工具数据文件不存在
# 3. 内存不足
```

### Q4: 前端加载缓慢

**问题**: 页面加载慢

**解决方案**:
1. 检查 CDN 是否正常
2. 启用 Gzip 压缩
3. 使用生产构建
```bash
npm run build
docker-compose up -d --build frontend
```

### Q5: 如何更新数据

**重新爬取数据**:
```bash
# 备份现有数据
cp public/toolsData.json public/toolsData.json.backup

# 重新运行爬虫
cd scraper
python aibot_scraper.py

# 重启后端加载新数据
docker-compose restart backend
```

### Q6: 如何添加新工具

**方法 1**: 重新运行爬虫
```bash
python scraper/aibot_scraper.py
```

**方法 2**: 手动添加
编辑 `public/toolsData.json`，在 `tools` 数组中添加:

```json
{
  "id": 1500,
  "name": "新工具名",
  "desc": "工具描述",
  "category": "writing",
  "url": "https://tool-url.com",
  "logo": "https://logo-url.com",
  "tags": ["标签1", "标签2"],
  "pricing": "Freemium",
  "rating": 4.5,
  "chinese_support": true
}
```

---

## 性能优化

### 1. Docker 内存优化

编辑 `docker-compose.yml`:

```yaml
backend:
  deploy:
    resources:
      limits:
        memory: 512M
      reservations:
        memory: 256M
```

### 2. 数据库缓存 (可选)

如需更强性能，可添加 Redis:

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

### 3. 静态资源 CDN

将 `dist` 目录部署到 CDN:
```yaml
# docker-compose.yml
frontend:
  # ...
  environment:
    - VITE_CDN_URL=https://your-cdn.com
```

---

## 备份与恢复

### 1. 数据备份

```bash
# 备份工具数据
cp public/toolsData.json backup/toolsData.json.$(date +%Y%m%d)

# 备份 Docker 卷
docker-compose down
docker volume ls | grep ai-ark
docker volume backup ai-ark_public_data > backup.tar
```

### 2. 数据恢复

```bash
# 恢复工具数据
cp backup/toolsData.json.20240101 public/toolsData.json

# 恢复 Docker 卷
docker volume restore ai-ark_public_data < backup.tar
```

---

## 联系与支持

- **文档**: 查看 `.sisyphus/plans/ai-ark-enhancement.md`
- **日志**: `docker-compose logs`
- **问题**: 提交 Issue

---

*最后更新: 2026-01-31*
