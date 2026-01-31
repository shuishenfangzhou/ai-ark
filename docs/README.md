# AI方舟 (AI Tools Dashboard)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](DEPLOYMENT.md)

一个功能完整的 AI 工具导航平台，具备语义搜索和智能推荐功能。

## ✨ 功能特性

### 核心功能
- 📚 **AI 工具导航**: 1495+ 精选 AI 工具，16 个分类
- 🔍 **智能搜索**: 基于语义的智能推荐和搜索
- 🤖 **AI 推荐**: 基于 Gemini 的智能工具推荐
- ⭐ **收藏管理**: 收藏和对比功能
- 🌓 **主题切换**: 明暗主题支持

### 技术特性
- ⚡ **快速响应**: Vite + 原生 JS 构建
- 🔒 **安全 API**: 后端代理保护 API Key
- 🐳 **容器化**: Docker 一键部署
- 📱 **响应式**: 完美支持移动端

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd ai-ark

# 前端开发
npm install
npm run dev

# 后端开发 (新终端)
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

访问: http://localhost:5173

### Docker 部署

```bash
# 配置环境变量
cp .env.example .env
# 编辑 .env，填入 GOOGLE_API_KEY

# 构建并启动
docker-compose up -d --build

# 访问
# 前端: http://localhost
# API: http://localhost/api
# 文档: http://localhost/docs
```

## 📁 项目结构

```
ai-ark/
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── main.py          # 应用入口
│   │   ├── config.py        # 配置管理
│   │   ├── api/             # API 路由
│   │   ├── services/        # 业务逻辑
│   │   └── models/          # 数据模型
│   └── requirements.txt     # Python 依赖
│
├── scraper/                  # 数据爬虫
│   ├── aibot_scraper.py     # ai-bot.cn 爬虫
│   └── output/              # 输出数据
│
├── docker/                   # Docker 配置
│   ├── Dockerfile.backend   # 后端镜像
│   ├── Dockerfile.frontend  # 前端镜像
│   ├── nginx.conf           # Nginx 配置
│   └── docker-compose.yml   # 服务编排
│
├── public/                   # 前端静态资源
│   └── toolsData.json       # 工具数据 (1495 工具)
│
├── src/                      # 前端源码
│   ├── main.js              # 主逻辑
│   └── style.css            # 样式
│
├── DEPLOYMENT.md            # 部署指南
└── README.md                # 本文件
```

## 📊 数据统计

| 指标 | 数值 |
|------|------|
| 工具总数 | 1495 |
| 分类数量 | 16 |
| 数据更新 | 2026-01-31 |
| 覆盖领域 | AI写作、图像、视频、办公等 |

## 🛠️ 技术栈

### 前端
- **构建工具**: Vite
- **框架**: 原生 JavaScript
- **样式**: Tailwind CSS
- **图标**: Font Awesome

### 后端
- **框架**: FastAPI
- **AI**: Google Gemini API
- **认证**: JWT (可选)

### 部署
- **容器**: Docker
- **编排**: Docker Compose
- **代理**: Nginx

## 📡 API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/recommend` | POST | AI 语义搜索推荐 |
| `/api/chat` | POST | Gemini API 代理 |
| `/api/tools` | GET | 获取工具列表 |
| `/api/categories` | GET | 获取分类列表 |
| `/health` | GET | 健康检查 |

### 请求示例

```bash
# AI 推荐
curl -X POST http://localhost/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI写作工具",
    "category": "writing",
    "max_results": 5
  }'
```

## 🔧 配置说明

### 环境变量

| 变量 | 必填 | 描述 |
|------|------|------|
| `GOOGLE_API_KEY` | 是 | Gemini API Key |
| `LOG_LEVEL` | 否 | 日志级别 (INFO/DEBUG) |
| `CORS_ORIGINS` | 否 | CORS 允许的域名 |

### 开发配置

```bash
# .env
GOOGLE_API_KEY=your_api_key_here
LOG_LEVEL=INFO
```

## 📝 开发指南

### 添加新功能

1. **后端**: 在 `backend/app/api/` 添加路由
2. **前端**: 在 `src/main.js` 添加逻辑
3. **数据**: 运行 `scraper/aibot_scraper.py` 更新数据

### 数据更新

```bash
# 重新爬取数据
cd scraper
python aibot_scraper.py

# 数据将自动保存到 public/toolsData.json
```

## 🚀 部署

详细部署指南: [DEPLOYMENT.md](DEPLOYMENT.md)

### 生产环境要求

- Docker Engine 20.10+
- 1GB RAM 最小
- 端口 80/443

### SSL 配置

使用 Let's Encrypt 免费证书:

```bash
sudo certbot --nginx -d your-domain.com
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

**Built with ❤️ using FastAPI + Vite + Docker**
