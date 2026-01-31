# AI方舟项目 - 学习记录

## 项目概述
- **项目名称**: AI方舟 (AI Tools Dashboard)
- **目标**: 打造AI工具导航平台，具备语义搜索和智能推荐功能
- **技术栈**: FastAPI + Vite + Docker + Gemini API
- **完成度**: 74% (14/19 任务完成)

---

## 最终成果

### 数据统计

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 工具数量 | 1400 | 1495 | ✅ 超额 107% |
| 分类覆盖 | 15 | 16 | ✅ 100% |
| 后端接口 | 5+ | 5+ | ✅ 完整 |
| 文档 | 2份 | 3份 | ✅ 超额 |

### 工具分布

| 分类 | 数量 | 占比 |
|------|------|------|
| AI图像 | 184 | 12.3% |
| AI写作 | 100 | 6.7% |
| AI视频 | 100 | 6.7% |
| AI编程 | 84 | 5.6% |
| AI设计 | 87 | 5.8% |
| AI音频 | 84 | 5.6% |
| AI聊天 | 75 | 5.0% |
| AI开发 | 70 | 4.7% |
| 其他 | 711 | 47.6% |
| **总计** | **1495** | **100%** |

---

## 项目文件清单

### 核心文件

| 文件 | 描述 | 状态 |
|------|------|------|
| `backend/app/main.py` | FastAPI 入口 | ✅ |
| `backend/app/config.py` | 配置管理 | ✅ |
| `backend/app/api/recommend.py` | AI 推荐接口 | ✅ |
| `backend/app/api/proxy.py` | API 代理接口 | ✅ |
| `backend/app/services/gemini.py` | Gemini 服务 | ✅ |
| `backend/requirements.txt` | Python 依赖 | ✅ |
| `scraper/aibot_scraper.py` | 数据爬虫 | ✅ |
| `public/toolsData.json` | 工具数据 (1495) | ✅ |
| `docker/Dockerfile.backend` | 后端镜像 | ✅ |
| `docker/Dockerfile.frontend` | 前端镜像 | ✅ |
| `docker/nginx.conf` | Nginx 配置 | ✅ |
| `docker-compose.yml` | 服务编排 | ✅ |
| `DEPLOYMENT.md` | 部署指南 | ✅ |
| `README.md` | 项目说明 | ✅ |
| `.env.example` | 环境变量模板 | ✅ |

---

## 待用户操作

### 1. 申请 Google API Key

**操作**: https://aistudio.google.com/

### 2. 配置环境变量

```bash
cd D:\AI工具箱
copy .env.example .env
notepad .env
# 填入 GOOGLE_API_KEY=your_key
```

### 3. Docker 部署 (在服务器)

```bash
git clone <repo>
cd ai-ark
docker-compose up -d --build
```

---

## 技术决策记录

### 1. 后端架构选择

**决策**: FastAPI

**原因**:
- 异步支持 (async/await)
- 自动生成 API 文档
- 类型安全 (Pydantic)
- 性能优异

### 2. 语义搜索方案

**决策**: Gemini Embedding + 余弦相似度

**原因**:
- Google 官方支持
- 768 维高质量向量
- 支持中文语义
- 免费额度充足

### 3. 数据爬取策略

**决策**: BeautifulSoup 静态爬取

**原因**:
- ai-bot.cn 为服务端渲染
- 静态爬取速度更快
- 依赖更少
- 资源占用低

---

## 遇到的问题与解决方案

### 1. 编码问题

**问题**: Windows GBK 编码错误

**解决方案**:
```python
import sys
import io
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
```

### 2. 依赖导入

**问题**: Playwright 未安装

**解决方案**:
```python
try:
    from playwright.async_api import async_playwright
    USE_PLAYWRIGHT = True
except ImportError:
    USE_PLAYWRIGHT = False
    from bs4 import BeautifulSoup
```

---

## 部署清单

### 生产环境要求

- Docker Engine 20.10+
- Docker Compose 2.0+
- 1GB RAM 最小
- 端口: 80, 443

### 环境变量

```bash
GOOGLE_API_KEY=xxx      # 必需
LOG_LEVEL=INFO          # 可选
```

### 验证步骤

```bash
# 健康检查
curl http://localhost/health

# API 测试
curl -X POST http://localhost/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "AI写作工具", "max_results": 3}'
```

---

*最后更新: 2026-01-31*
