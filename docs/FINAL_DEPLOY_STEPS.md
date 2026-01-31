# 🚀 AI方舟 - 部署步骤清单
## 服务器: 120.26.35.49

---

## ✅ 部署准备已完成

| 项目 | 状态 |
|------|------|
| 部署指南 | ✅ COMPLETE_DEPLOY.md |
| 验证脚本 | ✅ verify.sh |
| Docker 编排 | ✅ docker-compose.1panel.yml |
| DeepSeek 服务 | ✅ backend/app/services/deepseek.py |
| 监控脚本 | ✅ monitor.sh, backup.sh |

---

## 📋 你需要执行的步骤

### ⏱️ 预计时间: 15 分钟

---

### 步骤 1: SSH 连接 (2分钟)

```bash
ssh root@120.26.35.49 -p 22
# 密码: 210981040436Fhz
```

---

### 步骤 2: 上传文件 (5分钟)

**使用 SFTP 工具 (FileZilla/WinSCP)**:

```
主机: 120.26.35.49
端口: 22
用户名: root
密码: 210981040436Fhz
远程目录: /var/www/ai-ark/

需要上传的文件:
├── docker-compose.1panel.yml
├── docker/Dockerfile.backend
├── docker/Dockerfile.frontend
├── backend/app/main.py
├── backend/app/services/deepseek.py
├── backend/app/api/recommend.py
├── backend/requirements.txt
├── public/toolsData.json
├── dist/index.html
├── dist/assets/
├── .env (我会给你内容)
├── deploy.sh
├── monitor.sh
├── backup.sh
└── verify.sh
```

---

### 步骤 3: 执行部署命令 (8分钟)

在服务器终端执行:

```bash
# 1. 进入目录
cd /var/www/ai-ark

# 2. 创建环境变量
cat > .env << 'EOF'
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
EOF
chmod 600 .env

# 3. 构建后端 (3-5分钟)
echo "构建后端镜像..."
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend

# 4. 构建前端 (1-2分钟)
echo "构建前端镜像..."
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./

# 5. 启动服务
echo "启动服务..."
docker-compose -f docker-compose.1panel.yml up -d

# 6. 等待启动
sleep 10

echo "✅ 部署完成!"
```

---

### 步骤 4: 验证部署 (1分钟)

```bash
# 一键验证
bash verify.sh

# 或手动验证
curl http://localhost:8000/health
```

**预期结果**: `{"status":"healthy","version":"1.0.0","service":"ai-ark-api"}`

---

### 步骤 5: 访问测试

本地浏览器打开:

- **前端**: http://120.26.35.49:3000
- **API**: http://120.26.35.49:8000/health

---

## 🔧 常用命令速查

| 操作 | 命令 |
|------|------|
| 查看状态 | `docker ps | grep ai-ark` |
| 后端日志 | `docker logs -f ai-ark-backend` |
| 前端日志 | `docker logs -f ai-ark-frontend` |
| 重启服务 | `cd /var/www/ai-ark && docker-compose restart` |
| 停止服务 | `cd /var/www/ai-ark && docker-compose down` |
| 一键验证 | `bash verify.sh` |

---

## ❓ 遇到问题?

### 问题: 端口被占用

```bash
# 检查端口
netstat -tlnp | grep -E ":3000|:8000"

# 解决方案: 修改 docker-compose.1panel.yml 中的端口
```

### 问题: Docker 构建失败

```bash
# 查看错误
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend --no-cache
```

### 问题: 容器启动后停止

```bash
# 查看日志
docker logs ai-ark-backend

# 检查 .env
cat /var/www/ai-ark/.env
```

---

## ✅ 部署成功标志

1. **容器运行**: `docker ps` 显示 ai-ark-backend 和 ai-ark-frontend 状态为 Up
2. **API 健康**: `curl http://localhost:8000/health` 返回 healthy
3. **前端可访问**: 浏览器打开 http://120.26.35.49:3000 显示页面
4. **推荐功能**: `curl -X POST http://localhost:8000/api/recommend` 返回工具列表

---

## 📞 完成部署后

告诉我:
1. ✅ "部署完成" - 我帮你做最终验证
2. ❌ "遇到问题 [描述]" - 我帮你解决

---

**开始部署吧！** 🚀
