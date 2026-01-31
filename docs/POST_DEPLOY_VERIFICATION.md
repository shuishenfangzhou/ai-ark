# AI方舟 - 部署验证清单
## 服务器: 120.26.35.49

---

## 📋 部署后验证步骤

部署完成后，请按以下步骤验证:

---

## 步骤 1: 检查容器状态

```bash
cd /var/www/ai-ark
docker ps --filter "name=ai-ark"
```

**预期结果**:
```
CONTAINER ID   IMAGE                  COMMAND                  STATUS         PORTS                    NAMES
abc123def456   ai-ark-backend:latest  "uvicorn app.main:ap…"   Up 10 seconds  0.0.0.0:8000->8000/tcp   ai-ark-backend
def456abc789   ai-ark-frontend:latest "/docker-entrypoint.…"   Up 10 seconds  0.0.0.0:3000->80/tcp    ai-ark-frontend
```

**✅ 通过条件**: 两个容器都显示 "Up" 状态

---

## 步骤 2: API 健康检查

```bash
curl http://localhost:8000/health
```

**预期结果**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "ai-ark-api"
}
```

**✅ 通过条件**: 返回 JSON，包含 `"status":"healthy"`

---

## 步骤 3: 测试推荐接口

```bash
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"AI写作工具","max_results":3}'
```

**预期结果**:
```json
{
  "recommendations": [
    {
      "name": "ChatGPT",
      "desc": "OpenAI 的对话 AI...",
      "category": "writing",
      "score": 0.85,
      "match_reason": "与「AI写作工具」高度相关 (匹配度: 85%)"
    },
    ...
  ],
  "based_on": "AI写作工具",
  "total_found": 3
}
```

**✅ 通过条件**: 返回推荐工具列表

---

## 步骤 4: 检查工具数据

```bash
# 检查数据文件
ls -lh /var/www/ai-ark/public/toolsData.json

# 检查工具数量
python3 -c "import json; print('工具数量:', len(json.load(open('/var/www/ai-ark/public/toolsData.json'))['tools']))"
```

**预期结果**:
```
-rw-r--r-- 1 root root 783K Jan 31 06:11 toolsData.json
工具数量: 1495
```

**✅ 通过条件**: 文件存在，且工具数量 > 1000

---

## 步骤 5: 前端访问测试

```bash
# 测试前端页面
curl -I http://localhost:3000

# 预期结果
HTTP/1.1 200 OK
Server: nginx/1.25.x
```

**✅ 通过条件**: 返回 HTTP 200

---

## 步骤 6: 查看后端日志

```bash
docker logs ai-ark-backend --tail 20
```

**预期结果** (最后几行):
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
✅ DeepSeek API 客户端已初始化
🔍 语义搜索: 'AI写作工具' (分类: 全部)
✅ 找到 3 个相关工具
```

**✅ 通过条件**: 无 ERROR 日志

---

## 步骤 7: 本地浏览器测试

在本地浏览器打开:

| 地址 | 预期结果 |
|------|----------|
| http://120.26.35.49:3000 | 显示 AI方舟首页 |
| http://120.26.35.49:8000/health | 显示健康状态 JSON |

**✅ 通过条件**: 页面正常显示，无报错

---

## 📊 验证结果记录

请记录验证结果:

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 容器运行 | ☐ 通过 / ☐ 失败 | |
| API 健康 | ☐ 通过 / ☐ 失败 | |
| 推荐功能 | ☐ 通过 / ☐ 失败 | |
| 数据加载 | ☐ 通过 / ☐ 失败 | |
| 前端访问 | ☐ 通过 / ☐ 失败 | |
| 日志正常 | ☐ 通过 / ☐ 失败 | |

**总体评估**: ☐ 全部通过 / ☐ 部分通过

---

## 🔧 常见问题处理

### 问题: 容器未运行

```bash
# 查看详细错误
docker-compose -f docker-compose.1panel.yml logs

# 常见原因
# 1. 端口被占用 → 修改端口映射
# 2. .env 缺失 → 创建 .env 文件
# 3. 镜像构建失败 → 重新构建
```

### 问题: API 返回 500

```bash
# 查看后端日志
docker logs ai-ark-backend

# 检查 API Key
cat /var/www/ai-ark/.env

# 测试 DeepSeek 连通性
docker exec ai-ark-backend curl -s https://api.deepseek.com
```

### 问题: 前端页面空白

```bash
# 检查前端容器
docker logs ai-ark-frontend

# 检查文件
docker exec ai-ark-frontend ls -la /usr/share/nginx/html/

# 重新构建
docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./
```

---

## 🎉 部署成功!

如果所有检查项都通过，恭喜你！AI方舟已成功部署！

**下一步**:
1. 配置域名 (可选)
2. 申请 SSL 证书 (可选)
3. 设置备份计划

---

## 📞 需要帮助?

如果验证过程中遇到问题，请提供:

1. **错误信息**: 复制完整的错误输出
2. **命令结果**: `docker ps` 输出
3. **日志**: `docker logs ai-ark-backend --tail 50`

---

**验证时间**: 2026-01-31  
**服务器**: 120.26.35.49
