# AI方舟 - 部署总览

## 部署就绪状态

| 组件 | 状态 | 文件大小 |
|------|------|----------|
| 后端代码 (FastAPI + DeepSeek) | ✅ 就绪 | backend/ |
| 前端构建产物 | ✅ 就绪 | dist/ (25KB) |
| 工具数据 | ✅ 就绪 | public/toolsData.json (783KB) |
| Docker 编排 | ✅ 就绪 | docker-compose.1panel.yml |
| 部署脚本 | ✅ 就绪 | deploy.sh, server-deploy.sh |
| 文档 | ✅ 就绪 | QUICK_DEPLOY.md, 1PANEL_DEPLOYMENT.md |
| 环境变量 | ✅ 已配置 | .env |

---

## 快速部署 (二选一)

### 选项 A: 本地开发测试

```bash
cd D:\AI工具箱

# 启动后端 (需要 Python 环境)
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# 新终端 - 启动前端
npm run dev

# 访问: http://localhost:5173
```

### 选项 B: 服务器 Docker 部署

需要提供服务器 SSH 信息：

```
服务器IP: xxx.xxx.xxx.xxx
SSH端口: 22
用户名: root
密码: xxxxxx
```

---

## 服务器部署步骤

### 第一步: 上传项目

**方式 1: 打包上传**

```bash
# 本地打包
cd D:\AI工具箱
tar -czvf ai-ark-deploy.tar.gz \
    backend/ docker/ public/ src/ dist/ \
    docker-compose.yml docker-compose.1panel.yml \
    .env.example package.json \
    deploy.sh server-deploy.sh \
    QUICK_DEPLOY.md 1PANEL_DEPLOYMENT.md

# 上传 ai-ark-deploy.tar.gz 到服务器 /var/www/
```

**方式 2: Git 克隆**

```bash
# 服务器上执行
cd /var/www
git clone https://github.com/your-repo/ai-ark.git
cd ai-ark
```

### 第二步: 执行部署

```bash
# SSH 连接服务器
ssh root@your-server-ip

# 进入项目目录
cd /var/www/ai-ark

# 创建环境变量
cat > .env << 'EOF'
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
EOF
chmod 600 .env

# 构建并启动
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./
docker-compose -f docker-compose.1panel.yml up -d
```

### 第三步: 验证

```bash
# 检查容器
docker ps | grep ai-ark

# 健康检查
curl http://localhost:8000/health

# 预期响应
# {"status":"healthy","version":"1.0.0","service":"ai-ark-api"}
```

---

## Docker 服务配置

### 端口映射

| 容器 | 端口 | 说明 |
|------|------|------|
| ai-ark-backend | 8000 | FastAPI API |
| ai-ark-frontend | 3000 | Vite 静态前端 |

### 环境变量

```bash
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
```

---

## 访问地址

| 服务 | 开发环境 | 生产环境 |
|------|----------|----------|
| 前端 | http://localhost:5173 | http://your-server-ip:3000 |
| 后端 API | http://localhost:8000 | http://your-server-ip:8000 |
| 健康检查 | http://localhost:8000/health | http://your-server-ip:8000/health |

---

## 常用命令

```bash
# 开发环境
npm run dev          # 前端开发
python main.py       # 后端开发

# Docker
docker-compose up -d         # 启动
docker-compose down          # 停止
docker-compose restart       # 重启
docker logs -f ai-ark-backend # 查看日志

# 1Panel
bash deploy.sh deploy        # 一键部署
bash deploy.sh logs          # 查看日志
bash deploy.sh restart       # 重启服务
```

---

## 文件结构

```
ai-ark/
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── main.py          # 应用入口
│   │   ├── api/recommend.py # API 路由
│   │   ├── services/deepseek.py # DeepSeek 服务
│   │   └── models/schemas.py    # 数据模型
│   └── requirements.txt     # Python 依赖
│
├── docker/                   # Docker 配置
│   ├── Dockerfile.backend   # 后端镜像
│   ├── Dockerfile.frontend  # 前端镜像
│   └── nginx.conf           # Nginx 配置
│
├── public/                   # 静态资源
│   └── toolsData.json       # 1495 AI 工具数据
│
├── dist/                     # 前端构建产物
│   ├── index.html
│   └── assets/
│
├── docker-compose.yml        # 完整编排
├── docker-compose.1panel.yml # 1Panel 专用
│
├── deploy.sh                 # 部署脚本
├── server-deploy.sh          # 服务器部署脚本
├── .env                      # 环境变量 (已配置)
│
└── QUICK_DEPLOY.md           # 快速部署指南
```

---

## 故障排查

### 后端启动失败

```bash
docker logs ai-ark-backend

# 常见原因:
# 1. 端口占用: 修改 docker-compose.yml 端口映射
# 2. API Key 错误: 检查 .env 文件
# 3. 数据文件缺失: 检查 public/toolsData.json
```

### 前端页面空白

```bash
# 检查前端容器
docker logs ai-ark-frontend

# 解决方案:
# 1. 确保 dist/ 目录有内容
# 2. 检查 Nginx 配置
```

### API 返回错误

```bash
# 测试 API 连通性
curl http://localhost:8000/health

# 检查 DeepSeek API
docker exec ai-ark-backend curl https://api.deepseek.com
```

---

## 下一步

**需要服务器 SSH 信息才能继续部署：**

```
服务器IP: _______________
SSH端口: 22
用户名: root 或 ubuntu
密码: _______________
```

收到信息后，我将：
1. ✅ SSH 连接服务器
2. ✅ 上传所有文件
3. ✅ 配置环境变量
4. ✅ 构建 Docker 镜像
5. ✅ 启动服务
6. ✅ 验证部署成功

---

**部署时间**: 约 3-5 分钟
**维护**: 后续更新使用 `git pull` + `docker-compose restart`
