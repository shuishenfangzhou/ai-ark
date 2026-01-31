---
description: (user - Skill) Web scraping and data extraction from websites. Extract text from web pages, crawl and follow links, or download documentation from online sources. Features concurrent URL processing, automatic deduplication, content filtering, domain restrictions, and proper directory hierarchy based on URL structure. Use for documentation gathering, content extraction, web archival, or research data collection.
triggers:
  - 爬取网站
  - 抓取网页内容
  - 批量抓取
  - 数据爬取
  - 网页数据提取
  - 工具数据爬取
  - 导航站爬虫
---

# Web Scraping Skill

## 概述
此技能用于从网站爬取数据和提取内容，特别是从导航站（如 ai-bot.cn）抓取 AI 工具信息。

## 适用场景
- 网站数据爬取
- 导航站工具信息提取
- 批量页面抓取
- 文档下载和归档
- 研究数据收集

## 核心能力
- ✅ 并发 URL 处理（提高效率）
- ✅ 自动去重（避免重复）
- ✅ 内容过滤（按类型、关键词）
- ✅ 域名限制（限制爬取范围）
- ✅ 基于 URL 结构的目录层次
- ✅ 反爬虫策略（延迟、随机 User-Agent）
- ✅ 错误重试机制
- ✅ 数据格式标准化

## 推荐工具
- **Playwright**: 动态页面渲染（必需）
- **BeautifulSoup4**: HTML 解析
- **Pandas**: 数据清洗和导出
- **Pydantic**: 数据验证

## 典型工作流

### 1. AI-bot.cn 爬虫
```python
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio
import json

# 分类 URL 列表
CATEGORIES = [
    "/favorites/ai-writing-tools/",
    "/favorites/ai-image-tools/",
    "/favorites/ai-video-tools/",
    # ... 更多分类
]

async def scrape_category(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(f"https://ai-bot.cn{url}")
        
        # 滚动加载更多
        for _ in range(5):
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(1)
        
        # 解析页面
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        cards = soup.find_all('div', class_='url-card')
        
        tools = []
        for card in cards:
            tool = {
                "name": card.find('strong').text,
                "desc": card.find('p', class_='overflowClip_1').text,
                "url": card.find('a')['href'],
                "logo": card.find('img')['src'],
                "category": "writing"  # 根据 URL 映射
            }
            tools.append(tool)
        
        await browser.close()
        return tools
```

### 2. 数据清洗和标准化
```python
from pydantic import BaseModel
from typing import List, Optional

class Tool(BaseModel):
    id: int
    name: str
    desc: str
    category: str
    url: str
    logo: str
    tags: List[str] = []
    pricing: str = "Freemium"
    rating: float = 4.5

# 验证数据
tool = Tool(**raw_data)
```

### 3. 反爬虫策略
```python
import random
import time

# 随机延迟
def human_delay(min_sec=0.5, max_sec=2.0):
    time.sleep(random.uniform(min_sec, max_sec))

# 随机 User-Agent
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    # ... 更多
]

page = await browser.new_page(
    user_agent=random.choice(USER_AGENTS)
)
```

## 分类映射

| ai-bot.cn URL | 本地分类 ID |
|---------------|--------------|
| /favorites/ai-writing-tools/ | writing |
| /favorites/ai-image-tools/ | image |
| /favorites/ai-video-tools/ | video |
| /favorites/ai-office-tools/ | office |
| /favorites/ai-agent/ | agents |
| /favorites/ai-chatbots/ | chat |
| /favorites/ai-programming-tools/ | code |
| /favorites/ai-design-tools/ | design |
| /favorites/ai-audio-tools/ | audio |
| /favorites/ai-search-engines/ | search |
| /favorites/ai-frameworks/ | dev |
| /favorites/websites-to-learn-ai/ | learning |
| /favorites/ai-models/ | models |
| /favorites/ai-content-detection/ | detection |

## 输出格式

爬取的数据应转换为 toolsData.json 格式：
```json
{
  "tools": [
    {
      "id": 1,
      "name": "ChatGPT",
      "desc": "OpenAI 推出的 AI 对话助手",
      "category": "chat",
      "url": "https://chat.openai.com",
      "logo": "https://...",
      "tags": ["AI", "对话"],
      "pricing": "Freemium",
      "rating": 4.8,
      "visits": "100M+"
    }
  ],
  "categories": [...]
}
```

## 最佳实践

1. **尊重网站**: 添加延迟，避免过快请求
2. **错误处理**: 捕获异常并记录，继续处理其他页面
3. **数据验证**: 使用 Pydantic 确保格式正确
4. **增量更新**: 不要重复抓取已有数据
5. **日志记录**: 记录进度和错误
6. **批量处理**: 使用 asyncio 并发处理多个分类

## 常见问题

**Q: 如何处理动态加载内容？**
A: 使用 Playwright 的 `wait_for_load_state` 和滚动加载更多内容

**Q: 如何避免被反爬？**
A: 添加随机延迟、使用真实 User-Agent、限制请求频率

**Q: 如何处理缺失字段？**
A: 提供默认值：rating: 4.5, pricing: "Freemium", visits: "N/A"

**Q: 如何去重？**
A: 使用工具 URL 作为唯一标识，已存在的跳过

## 相关文件

- `scraper/aibot_scraper.py` - 主要爬虫实现
- `scraper/data_processor.py` - 数据清洗
- `tools_manager.py` - 工具数据库
