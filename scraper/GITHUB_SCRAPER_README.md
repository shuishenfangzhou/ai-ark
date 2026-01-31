# GitHub 数据抓取使用说明

## 快速开始

### 1. 安装依赖

```bash
# 主依赖（用于异步抓取，推荐）
pip install aiohttp

# 或使用简单版本（无需额外依赖）
# python scraper/github_trending_simple.py
```

### 2. 配置 GitHub Token（可选但推荐）

设置环境变量以提高 API 限流：

```bash
# Linux/Mac
export GITHUB_TOKEN=your_github_token_here

# Windows
set GITHUB_TOKEN=your_github_token_here
```

获取 Token: https://github.com/settings/tokens

### 3. 运行抓取

```bash
# 异步版本（推荐，速度快）
python scraper/github_trending_scraper.py

# 或简单版本（无 aiohttp 依赖）
python scraper/github_trending_simple.py
```

### 4. 合并数据

```bash
python scraper/merge_github_data.py
```

---

## 输出文件

```
scraper/
├── output/
│   ├── github_data.json       # GitHub 抓取数据
│   ├── github_raw.json        # 原始抓取数据
│   └── github_cache.json      # 缓存数据（避免重复请求）
├── config/
│   └── github_topics.py       # 主题配置
├── github_trending_scraper.py # 异步抓取（推荐）
├── github_trending_simple.py  # 简单抓取
└── merge_github_data.py       # 数据合并
```

---

## 数据格式

抓取的 GitHub 数据包含以下字段：

```json
{
  "id": -123456789,
  "name": "llama.cpp",
  "category": "dev",
  "subcategory": "GitHub Topics",
  "desc": "Port of Facebook's LLaMA model in C++",
  "url": "https://github.com/ggerganov/llama.cpp",
  "tags": ["ai", "llm", "cpp"],
  "pricing": "Free",
  "rating": 4.9,
  "visits": "52340",
  "logo": "https://avatars.githubusercontent.com/u/...",
  "source": "github",
  "github_url": "https://github.com/ggerganov/llama.cpp",
  "github_stars": 52340,
  "github_forks": 6789,
  "github_language": "C++",
  "github_updated": "2026-01-30"
}
```

---

## 分类映射

| GitHub Topic | 映射分类 |
|-------------|---------|
| llm, gpt, transformer | dev (AI开发) |
| machine-learning, pytorch | dev |
| stable-diffusion, image-generation | image (AI图像) |
| nlp, text-generation | writing (AI写作) |
| video-generation | video (AI视频) |
| speech-recognition | audio (AI音频) |
| agent, langchain | agents (AI智能体) |

---

## 定时更新

添加定时任务自动更新数据：

```bash
# 每天凌晨 2 点更新
0 2 * * * cd /path/to/ai-ark && python scraper/github_trending_scraper.py && python scraper/merge_github_data.py
```

---

## 注意事项

1. **API 限流**: 未配置 Token 时，每小时最多 60 次请求
2. **抓取速度**: 建议设置 `REQUEST_DELAY` 避免被封
3. **数据去重**: 合并时会自动根据 URL 去重
4. **缓存机制**: 使用缓存避免重复请求相同数据
