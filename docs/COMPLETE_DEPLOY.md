# AI方舟 - 完整部署指南
## 服务器: 120.26.35.49

---

## 部署信息

| 项目 | 值 |
|------|-----|
| 服务器 IP | 120.26.35.49 |
| SSH 端口 | 22 |
| 用户名 | root |
| 密码 | 210981040436Fhz |
| 项目目录 | /var/www/ai-ark |
| DeepSeek API Key | sk-abf3975bd37a4e18b06959c0a91d9099 |

---

## 第一步: 连接服务器

在本地打开终端 (Windows PowerShell 或 CMD):

```bash
ssh root@120.26.35.49 -p 22
# 输入密码: 210981040436Fhz
```

连接成功后，你将看到服务器提示符。

---

## 第二步: 创建项目目录

```bash
mkdir -p /var/www/ai-ark
cd /var/www/ai-ark
pwd  # 确认当前目录是 /var/www/ai-ark
```

---

## 第三步: 上传文件

**方式 A: 使用 SCP 命令 (在本地执行)**

```bash
# 打包本地文件
cd D:\AI工具箱
tar -czvf ai-ark-deploy.tar.gz .

# 上传到服务器
scp -P 22 ai-ark-deploy.tar.gz root@120.26.35.49:/var/www/ai-ark/

# 在服务器上解压
ssh root@120.26.35.49 -p 22 "cd /var/www/ai-ark && tar -xzvf ai-ark-deploy.tar.gz && rm ai-ark-deploy.tar.gz"
```

**方式 B: 使用 SFTP 工具 (推荐)**

使用 FileZilla 或 WinSCP:

```
主机: 120.26.35.49
端口: 22
用户名: root
密码: 210981040436Fhz

本地目录: D:\AI工具箱\
远程目录: /var/www/ai-ark/

需要上传的文件:
├── docker-compose.1panel.yml
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   └── models/
│   └── requirements.txt
├── public/
│   └── toolsData.json
├── dist/
│   ├── index.html
│   └── assets/
├── deploy.sh
├── monitor.sh
└── backup.sh
```

---

## 第四步: 配置环境

在服务器上执行:

```bash
cd /var/www/ai-ark

# 创建 .env 文件
cat > .env << 'EOF'
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
EOF

# 设置权限
chmod 600 .env

# 验证文件内容
cat .env
```

预期输出:
```
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
```

---

## 第五步: 构建 Docker 镜像

在服务器上执行:

```bash
cd /var/www/ai-ark

echo "🚀 开始构建后端镜像..."
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend

echo "🚀 开始构建前端镜像..."
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./

echo "✅ 镜像构建完成!"
```

**预计耗时**: 5-10 分钟

---

## 第六步: 启动服务

在服务器上执行:

```bash
cd /var/www/ai-ark

# 停止现有容器 (如果有)
docker-compose -f docker-compose.1panel.yml down 2>/dev/null || true

# 启动服务
docker-compose -f docker-compose.1panel.yml up -d

echo "⏳ 等待服务启动..."
sleep 10

echo "✅ 服务启动完成!"
```

---

## 第七步: 验证部署

在服务器上执行:

```bash
echo "📊 检查容器状态..."
docker ps --filter "name=ai-ark" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔍 健康检查..."
curl -s http://localhost:8000/health

echo ""
echo ""
echo "🧪 测试推荐接口..."
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"AI写作工具","max_results":3}'
```

**预期结果**:
- 容器状态: Up
- 健康检查: `{"status":"healthy","version":"1.0.0","service":"ai-ark-api"}`
- 推荐接口: 返回 JSON 格式的工具列表

---

## 第八步: 本地访问测试

在本地浏览器打开:

| 服务 | 地址 |
|------|------|
| 前端页面 | http://120.26.35.49:3000 |
| API 健康 | http://120.26.35.49:8000/health |

---

## 常用管理命令

```bash
# 进入项目目录
cd /var/www/ai-ark

# 查看状态
docker ps | grep ai-ark

# 查看日志
docker logs -f ai-ark-backend    # 后端日志
docker logs -f ai-ark-frontend   # 前端日志

# 重启服务
docker-compose -f docker-compose.1panel.yml restart

# 停止服务
docker-compose -f docker-compose.1panel.yml down

# 备份数据
cp /var/www/ai-ark/public/toolsData.json /backup/
```

---

## 常见问题解决

### 问题 1: 端口被占用

```bash
# 检查端口占用
netstat -tlnp | grep -E ":3000|:8000"

# 如果端口被占用，修改 docker-compose.1panel.yml 中的端口映射
# 将 "3000:80" 改为 "3001:80"
# 将 "8000:8000" 改为 "8001:8000"
```

### 问题 2: Docker 镜像构建失败

```bash
# 查看详细错误
docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend --no-cache

# 常见原因:
# 1. 网络问题 → 检查服务器网络
# 2. 磁盘空间不足 → df -h
# 3. Docker 服务异常 → systemctl restart docker
```

### 问题 3: 容器启动后停止

```bash
# 查看容器日志
docker logs ai-ark-backend

# 常见原因:
# 1. .env 文件缺失 → 检查 .env 文件
# 2. API Key 无效 → 检查 DEEPSEEK_API_KEY
```

### 问题 4: API 返回 500 错误

```bash
# 查看后端日志
docker logs ai-ark-backend

# 测试 DeepSeek API 连通性
docker exec ai-ark-backend curl -s https://api.deepseek.com
```

---

## 部署完成确认清单

请逐项检查:

- [ ] SSH 连接成功
- [ ] 项目目录 /var/www/ai-ark 创建成功
- [ ] 所有文件已上传
- [ ] .env 文件创建并包含正确 API Key
- [ ] 后端镜像构建成功 (ai-ark-backend:latest)
- [ ] 前端镜像构建成功 (ai-ark-frontend:latest)
- [ ] 容器启动成功 (docker ps 显示 Up)
- [ ] API 健康检查通过 (curl 返回 healthy)
- [ ] 本地浏览器可访问前端页面

---

## 下一步操作

1. **SSH 连接**: `ssh root@120.26.35.49 -p 22`
2. **创建目录**: `mkdir -p /var/www/ai-ark && cd /var/www/ai-ark`
3. **上传文件**: 使用 SFTP 工具上传所有文件
4. **配置环境**: 创建 .env 文件
5. **构建镜像**: 执行 docker build 命令
6. **启动服务**: 执行 docker-compose up -d
7. **验证部署**: 执行 curl 健康检查

---

**部署时间预估**: 15-20 分钟

**完成部署后告诉我，我帮你验证！** ✅
