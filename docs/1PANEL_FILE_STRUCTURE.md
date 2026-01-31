# AI方舟 - 1Panel 文件结构指南
## 服务器: 120.26.35.49

---

## 📁 目标目录结构

在 1Panel 文件管理器中，进入：
```
/opt/1panel/apps/
```

**新建文件夹**: `ai-ark`

最终结构：
```
/opt/1panel/apps/ai-ark/
├── frontend/          # 前端静态资源 (25KB)
│   ├── index.html     # ⭐ 主页面
│   ├── assets/        # JS/CSS 资源
│   ├── robots.txt
│   └── sitemap.xml
│
├── backend/           # 后端服务
│   ├── app/
│   │   ├── main.py              # FastAPI 入口
│   │   ├── api/
│   │   │   └── recommend.py     # 推荐 API
│   │   ├── services/
│   │   │   └── deepseek.py      # DeepSeek 服务
│   │   └── models/
│   │       └── schemas.py       # 数据模型
│   ├── requirements.txt         # Python 依赖
│   └── public/
│       └── toolsData.json       # 1495 工具数据 (783KB)
│
├── docker/            # Docker 配置
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
└── config/            # 配置
    └── .env           # 环境变量
```

---

## 📤 上传步骤

### 方式 1: 1Panel 文件管理器

访问: http://120.26.35.49:22379/hosts/files

1. **进入目录**: `/opt/1panel/apps/`
2. **新建文件夹**: `ai-ark`
3. **上传文件**: 逐个上传或拖拽

### 方式 2: SFTP 上传

```bash
# 连接
sftp root@120.26.35.49 -p 22

# 上传目录结构
put -r dist/* /opt/1panel/apps/ai-ark/frontend/
put -r backend/* /opt/1panel/apps/ai-ark/backend/
```

---

## 📦 文件大小

| 文件/目录 | 大小 | 说明 |
|-----------|------|------|
| frontend/index.html | 25KB | ⭐ 主页面 |
| frontend/assets/ | 260KB | JS/CSS 资源 |
| backend/public/toolsData.json | 783KB | 工具数据 |
| 总计 | ~1MB | 全部文件 |

---

## 🔧 1Panel 配置步骤

### 步骤 1: 创建网站

1. 进入 1Panel → **网站** → **创建网站**
2. 选择 **反向代理**
3. 填写:
   ```
   主域名: 120.26.35.49
   代理地址: http://127.0.0.1:8000
   ```

### 步骤 2: 配置静态资源

1. 网站 **设置** → **静态资源**
2. **网站根目录**: `/opt/1panel/apps/ai-ark/frontend`
3. **默认索引**: `index.html`

### 步骤 3: 创建应用 (后端)

1. 进入 1Panel → **应用商店** → **创建应用**
2. 选择 **自定义**
3. 配置:
   ```
   名称: ai-ark-backend
   路径: /opt/1panel/apps/ai-ark/backend
   启动命令: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   环境变量: DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
   ```

### 步骤 4: 配置反向代理

编辑网站配置文件:

```nginx
# 静态资源
location / {
    root /opt/1panel/apps/ai-ark/frontend;
    index index.html;
    try_files $uri $uri/ /index.html;
}

# API 代理
location /api/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 🔐 环境变量配置

在 1Panel 中设置或创建 `/opt/1panel/apps/ai-ark/config/.env`:

```
# AI方舟 - 环境变量
DEEPSEEK_API_KEY=sk-abf3975bd37a4e18b06959c0a91d9099
LOG_LEVEL=INFO
```

---

## ✅ 验证步骤

### 1. 检查文件
```bash
ls -lh /opt/1panel/apps/ai-ark/frontend/
ls -lh /opt/1panel/apps/ai-ark/backend/public/
```

### 2. 测试 API
```bash
curl http://127.0.0.1:8000/health
```

### 3. 访问前端
浏览器打开: http://120.26.35.49

---

## 📞 需要帮助?

如果在1Panel中操作遇到问题，请告诉我具体步骤，我可以提供更详细的指导。

---

**文件准备完成度**: 100%  
**等待上传**: 需要通过1Panel文件管理器上传
