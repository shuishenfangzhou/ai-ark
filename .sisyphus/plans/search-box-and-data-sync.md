# 搜索框优化与ai-bot.cn数据同步计划

## TL;DR

> **快速摘要**: 改造搜索框UI（放大镜按钮替代Ctrl+K），使用Python爬虫抓取ai-bot.cn的1400+工具数据，通过CDN加速logo图片访问，智能合并现有数据。

> **交付物**: 
> - 改造后的Header组件
> - Python数据抓取脚本
> - 更新后的tools.json（包含真实logo）
> - Logo图片CDN配置文件

> **预计工作量**: 2-3小时
> **并行执行**: 是（UI改造+爬虫开发可并行）

---

## Context

### 原始请求
用户希望：
1. 将搜索框的Ctrl+K快捷键替换为放大镜图标按钮，模仿ai-bot.cn的搜索框格式
2. 获取ai-bot.cn的所有工具数据（约1400+工具）和对应的logo图片
3. 使用CDN加速图片访问
4. 智能合并现有数据（保留rating、popularity等字段）

### 分析结论
- **搜索框改造**: 纯前端修改，工作量小，约30分钟
- **数据抓取**: 需要开发Python爬虫，约1-2小时
- **CDN配置**: 配置imgproxy或jsDelivr，约15分钟
- **数据合并**: 编写合并脚本，约30分钟

---

## Work Objectives

### 核心目标
1. 搜索框UI与ai-bot.cn保持一致（放大镜按钮）
2. 抓取ai-bot.cn全部工具数据（名称、描述、分类、标签、官网、logo）
3. 通过CDN加速logo图片访问
4. 智能合并新旧数据，保留现有评分和热度信息

### 具体交付物
- [ ] `src/components/Header.astro` - 改造后的搜索框组件
- [ ] `scripts/scrape_ai_bot.py` - Python数据抓取脚本
- [ ] `data/tools.json` - 更新后的工具数据（包含真实logo）
- [ ] `scripts/merge_data.py` - 数据合并脚本
- [ ] `public/logos/` - 工具logo本地缓存目录

### 完成定义
- [ ] 搜索框有放大镜按钮，点击可触发搜索
- [ ] 工具数量从216增加到1000+
- [ ] 80%以上的工具有真实logo图片
- [ ] Logo图片通过CDN加速访问
- [ ] 现有数据的rating和popularity字段保留

### 必须有
- 搜索功能正常工作
- 数据抓取不触发对方网站的反爬机制
- Logo CDN访问速度快

### 不能有
- 搜索框不显示Ctrl+K提示
- 不直接存储ai-bot.cn的原始logo文件到仓库

---

## Verification Strategy

### 测试决策
- **基础设施存在**: 是（Bun + Vite）
- **自动化测试**: 无（前端改动简单，爬虫单独测试）
- **Agent-Executed QA**: 是（手动验证关键功能）

### Agent-Executed QA Scenarios

**Scenario: 搜索框UI验证**
1. 导航到本地开发服务器 `http://localhost:4321`
2. 定位搜索框元素 `#global-search`
3. 验证右侧有放大镜按钮 `<i class="fa-solid fa-magnifying-glass">`
4. 验证没有 "Ctrl+K" 文字
5. 输入关键词 "ChatGPT"
6. 点击放大镜按钮
7. 验证搜索结果下拉框显示
8. 截图保存: `.sisyphus/evidence/search-box-ui.png`

**Scenario: 搜索功能验证**
1. 在搜索框输入 "图像"
2. 验证结果显示包含 "AI绘画" 相关的工具
3. 验证结果数量 > 0
4. 点击第一个结果
5. 验证页面正常跳转或打开详情

**Scenario: 数据完整性验证**
1. 检查 `data/tools.json` 文件
2. 验证工具数量 > 1000
3. 随机抽取10个工具
4. 验证每个工具都有 `logo` 字段（非null）
5. 验证logo URL可访问（HTTP 200）

**Scenario: Logo CDN访问验证**
1. 从tools.json中抽取5个logo URL
2. 使用curl检查每个URL
3. 验证HTTP状态码为200
4. 验证响应内容为图片（Content-Type: image/*）

### Evidence
- 搜索框UI截图: `.sisyphus/evidence/search-box-ui.png`
- 搜索结果截图: `.sisyphus/evidence/search-results.png`
- 数据统计报告: `.sisyphus/evidence/data-stats.json`
- Logo测试报告: `.sisyphus/evidence/logo-test-report.json`

---

## Execution Strategy

### 并行执行波次

**Wave 1 (立即开始)**:
- 任务1: 搜索框UI改造（纯前端）
- 任务2: 搭建Python爬虫框架（数据）

**Wave 2 (在Wave 1之后)**:
- 任务3: 实现工具详情页抓取
- 任务4: 实现logo下载和CDN配置

**Wave 3 (在Wave 2之后)**:
- 任务5: 数据合并和验证
- 任务6: 最终测试和修复

### 依赖矩阵
| 任务 | 依赖 | 阻塞 | 并行 |
|------|------|------|------|
| 1. 搜索框UI | 无 | 2,3,4 | 无 |
| 2. Python爬虫框架 | 无 | 3,4 | 1 |
| 3. 工具详情抓取 | 2 | 5 | 1 |
| 4. Logo CDN配置 | 2 | 5 | 1,3 |
| 5. 数据合并 | 3,4 | 6 | 无 |
| 6. 最终测试 | 5 | 无 | 无 |

### Agent调度摘要
| 波次 | 任务 | 推荐Agent |
|------|------|----------|
| 1 | 1,2 | quick (UI简单) + deep (爬虫逻辑) |
| 2 | 3,4 | deep (复杂逻辑) |
| 3 | 5,6 | quick (验证为主) |

---

## TODOs

### 任务1: 搜索框UI改造

**要做**:
1. 打开 `src/components/Header.astro`
2. 定位搜索框HTML部分（约第26-46行）
3. 移除 `<span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Ctrl K</span>` 元素
4. 在 `<input>` 元素后添加放大镜按钮:
   ```html
   <button 
       type="button"
       id="search-btn"
       class="absolute inset-y-1 right-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
   >
       <i class="fa-solid fa-magnifying-glass text-sm"></i>
   </button>
   ```
5. 修改input的 `pr-4` 为 `pr-14` 留出按钮空间
6. 更新搜索脚本，支持按钮点击触发搜索

**不能做**:
- 不修改搜索逻辑，只改UI
- 不删除搜索功能

**推荐Agent Profile**:
- **Category**: quick
  - Reason: 纯前端CSS/HTML改动，逻辑简单明确
- **Skills**: 无需特殊技能
- **Skills Evaluated but Omitted**:
  - 无

**并行**:
- **可以并行**: 是（与任务2并行）
- **并行组**: Wave 1（与任务2）
- **阻塞**: 任务3,4,5,6
- **阻塞方**: 无（可立即开始）

**References**:

**Pattern References** (现有代码模式):
- `src/components/Header.astro:26-46` - 当前搜索框实现

**API/Type References** (API契约):
- 无（纯UI改动）

**Test References** (测试模式):
- 无

**Documentation References** (文档):
- 无

**External References** (外部资料):
- FontAwesome图标: `https://fontawesome.com/icons/magnifying-glass`

**WHY Each Reference Matters**:
- 当前搜索框实现作为修改基础

**Acceptance Criteria**:

- [ ] 测试文件: 无需测试文件
- [ ] 验证命令: 打开浏览器手动验证
- [ ] UI检查清单:
  - [ ] 搜索框右侧有蓝色放大镜按钮
  - [ ] 按钮悬停时变为深蓝色
  - [ ] 没有 "Ctrl+K" 文字
  - [ ] 点击按钮可触发搜索

**Agent-Executed QA Scenarios**:

```
Scenario: 搜索框UI和功能验证
  Tool: Playwright (playwright skill)
  Preconditions: dev server running on localhost:4321
  Steps:
    1. Navigate to: http://localhost:4321
    2. Wait for: #global-search visible (timeout: 5s)
    3. Assert: No "Ctrl+K" text on page (grep page content)
    4. Assert: #search-btn exists and contains magnifying glass icon
    5. Assert: #search-btn has class "bg-blue-500"
    6. Fill: #global-search → "ChatGPT"
    7. Click: #search-btn
    8. Wait for: #search-results visible (timeout: 3s)
    9. Assert: Search results dropdown appears
    10. Screenshot: .sisyphus/evidence/task-1-search-ui.png
  Expected Result: Search works, no Ctrl+K text, button exists
  Evidence: .sisyphus/evidence/task-1-search-ui.png
```

**Commit**: YES
- Message: `feat(search): replace Ctrl+K with magnifying glass button`
- Files: `src/components/Header.astro`

---

### 任务2: Python爬虫框架搭建

**要做**:
1. 创建 `scripts/scrape_ai_bot.py` 文件
2. 实现以下功能:
   - 爬虫基础类（requests + BeautifulSoup）
   - 反爬处理（User-Agent轮换、延迟请求）
   - 分类页面解析
   - 工具列表页解析
   - 工具详情页解析
   - Logo下载功能
   - JSON导出功能

3. 基础代码结构:
```python
#!/usr/bin/env python3
"""
AI工具数据爬虫
目标网站: https://ai-bot.cn/
功能: 抓取所有AI工具数据和logo图片
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
from urllib.parse import urljoin
from typing import List, Dict, Optional
import re

class AIBotScraper:
    """ai-bot.cn 爬虫类"""
    
    def __init__(self):
        self.base_url = "https://ai-bot.cn/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.tools: List[Dict] = []
        
    def get_page(self, url: str, retry: int = 3) -> Optional[str]:
        """获取页面内容，支持重试"""
        for attempt in range(retry):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response.text
            except Exception as e:
                print(f"请求失败 ({attempt+1}/{retry}): {url} - {e}")
                time.sleep(5)
        return None
    
    def get_categories(self) -> List[Dict]:
        """获取所有分类"""
        pass
    
    def get_tools_from_category(self, category_url: str) -> List[Dict]:
        """从分类页面获取工具列表"""
        pass
    
    def get_tool_detail(self, tool_url: str) -> Optional[Dict]:
        """获取工具详情"""
        pass
    
    def download_logo(self, logo_url: str, tool_id: str) -> str:
        """下载logo图片"""
        pass
    
    def run(self):
        """执行爬取"""
        pass

if __name__ == "__main__":
    scraper = AIBotScraper()
    scraper.run()
```

**不能做**:
- 不使用Selenium/Puppeteer（保持轻量）
- 不抓取需要登录的内容
- 不违反网站的robots.txt

**推荐Agent Profile**:
- **Category**: deep
  - Reason: 需要处理复杂页面解析逻辑和反爬策略
- **Skills**: 无需特殊技能
- **Skills Evaluated but Omitted**:
  - 无

**并行**:
- **可以并行**: 是（与任务1并行）
- **并行组**: Wave 1（与任务1）
- **阻塞**: 任务3,4,5,6
- **阻塞方**: 无（可立即开始）

**References**:

**Pattern References** (现有代码模式):
- 无（新建文件）

**API/Type References** (API契约):
- 无

**Test References** (测试模式):
- 无

**Documentation References** (文档):
- BeautifulSoup文档: `https://beautiful-soup-4.readthedocs.io/`
- requests文档: `https://docs.python-requests.org/`

**External References** (外部资料):
- ai-bot.cn网站结构分析（见Context）

**WHY Each Reference Matters**:
- BeautifulSoup用于HTML解析
- requests用于HTTP请求

**Acceptance Criteria**:

- [ ] 测试文件: scripts/test_scrape.py
- [ ] 命令: python scripts/test_scrape.py (输出测试结果)

**Agent-Executed QA Scenarios**:

```
Scenario: 爬虫框架基本功能测试
  Tool: Bash (curl)
  Preconditions: Python 3.8+ installed
  Steps:
    1. Run: python scripts/scrape_ai_bot.py --help
    2. Assert: Help message displayed
    3. Run: python scripts/test_scrape.py
    4. Assert: Test passed (exit code 0)
    5. Capture output to: .sisyphus/evidence/task-2-scrape-test.txt
  Expected Result: Scrape framework works
  Evidence: .sisyphus/evidence/task-2-scrape-test.txt
```

**Commit**: YES
- Message: `feat(data): add AI tools scraper for ai-bot.cn`
- Files: `scripts/scrape_ai_bot.py`, `scripts/test_scrape.py`

---

### 任务3: 工具详情页抓取实现

**要做**:
1. 完善 `AIBotScraper` 类的以下方法:
   - `get_categories()`: 解析分类页面，获取所有分类链接
   - `parse_tool_card(card_html)`: 解析工具卡片HTML
   - `get_tool_detail(url)`: 获取工具详情页
   - `extract_tool_info(detail_html)`: 提取工具详细信息

2. 工具详情页解析目标字段:
   - id: 工具唯一标识
   - name: 工具名称
   - description: 简短描述
   - description_full: 完整描述
   - url: 官网链接
   - logo: Logo URL
   - category: 分类
   - tags: 标签列表
   - pricing: 价格（free/freemium/paid）
   - features: 功能列表

3. 处理子分类页面（如 https://ai-bot.cn/favorites/ai-writing-tools/）

4. 添加请求延迟（每页1-2秒）

**不能做**:
- 不抓取详情页中的用户评论
- 不修改已有工具的ratingpopularity字段

**推荐Agent Profile**:
- **Category**: deep
  - Reason: 需要深入分析HTML结构，处理嵌套页面
- **Skills**: 无需特殊技能
- **Skills Evaluated but Omitted**:
  - 无

**并行**:
- **可以并行**: 否
- **并行组**: 无
- **阻塞**: 任务5,6
- **阻塞方**: 任务2

**References**:

**Pattern References** (现有代码模式):
- `data/tools.json` - 目标数据格式

**API/Type References** (API契约):
- 无

**Test References** (测试模式):
- 无

**External References** (外部资料):
- ai-bot.cn分类页: https://ai-bot.cn/favorites/ai-writing-tools/
- ai-bot.cn工具详情页: https://ai-bot.cn/sites/4189.html

**WHY Each Reference Matters**:
- 目标数据格式确保爬取字段正确
- 参考页面用于分析HTML结构

**Acceptance Criteria**:

- [ ] 测试文件: scripts/test_detail_parser.py
- [ ] 命令: python scripts/test_detail_parser.py (解析10个工具详情页)
- [ ] 验证: 字段完整度 > 90%

**Agent-Executed QA Scenarios**:

```
Scenario: 工具详情页解析测试
  Tool: Bash (curl + python)
  Preconditions: Python script ready
  Steps:
    1. Create test_urls.txt with 5 sample tool URLs
    2. Run: python scripts/test_detail_parser.py test_urls.txt
    3. Assert: Each tool has id, name, description, url, logo, category
    4. Count: Parse 5 tools successfully
    5. Save results: .sisyphus/evidence/task-3-detail-parse.json
  Expected Result: >90% field completeness
  Evidence: .sisyphus/evidence/task-3-detail-parse.json
```

**Commit**: YES
- Message: `feat(data): implement tool detail scraping`
- Files: `scripts/scrape_ai_bot.py`

---

### 任务4: Logo下载和CDN配置

**要做**:
1. 在 `AIBotScraper` 中实现 `download_logo()` 方法
2. 下载logo到 `public/logos/{tool_id}.png`
3. 配置imgproxy或使用jsDelivr CDN
4. 生成logo URL映射表

5. Logo下载逻辑:
```python
def download_logo(self, logo_url: str, tool_id: str) -> str:
    """下载logo到本地，返回CDN URL"""
    # 下载图片
    logo_path = f"public/logos/{tool_id}.png"
    response = self.session.get(logo_url, timeout=30)
    
    # 保存本地
    with open(logo_path, 'wb') as f:
        f.write(response.content)
    
    # 返回CDN URL
    return f"https://cdn.jsdelivr.net/gh/yourusername/ai-ark@main/public/logos/{tool_id}.png"
```

6. 创建 `scripts/upload_to_cdn.py` 脚本（用于GitHub Actions自动上传）

7. 配置GitHub Actions工作流（push时自动同步logo到CDN）

**不能做**:
- 不使用付费CDN服务
- 不修改CDN配置后不测试

**推荐Agent Profile**:
- **Category**: deep
  - Reason: 需要处理图片下载、CDN配置、GitHub Actions
- **Skills**: 无需特殊技能
- **Skills Evaluated but Omitted**:
  - 无

**并行**:
- **可以并行**: 否
- **并行组**: 无
- **阻塞**: 任务5,6
- **阻塞方**: 任务2

**References**:

**Pattern References** (现有代码模式):
- 无

**API/Type References** (API契约):
- jsDelivr: `https://www.jsdelivr.com/`
- GitHub Pages: `https://docs.github.com/en/pages`

**Test References** (测试模式):
- 无

**External References** (外部资料):
- jsDelivr CDN: `https://www.jsdelivr.com/`
- GitHub Actions: `https://docs.github.com/en/actions`

**WHY Each Reference Matters**:
- jsDelivr提供免费CDN加速
- GitHub Actions实现自动化

**Acceptance Criteria**:

- [ ] 测试文件: scripts/test_logo_cdn.py
- [ ] 命令: python scripts/test_logo_cdn.py (下载5个logo并测试CDN)
- [ ] 验证: CDN访问速度 < 500ms

**Agent-Executed QA Scenarios**:

```
Scenario: Logo下载和CDN访问测试
  Tool: Bash (curl)
  Preconditions: Logo download script ready
  Steps:
    1. Create test_logos.txt with 5 logo URLs
    2. Run: python scripts/test_logo_cdn.py
    3. Assert: All 5 logos downloaded successfully
    4. Assert: Each CDN URL returns HTTP 200
    5. Assert: Response time < 500ms (curl -w "%{time_total}")
    6. Save results: .sisyphus/evidence/task-4-logo-test.json
  Expected Result: All logos accessible via CDN < 500ms
  Evidence: .sisyphus/evidence/task-4-logo-test.json
```

**Commit**: YES
- Message: `feat(data): add logo download and CDN support`
- Files: `scripts/scrape_ai_bot.py`, `.github/workflows/cdn-sync.yml`

---

### 任务5: 数据合并和验证

**要做**:
1. 创建 `scripts/merge_data.py` 脚本
2. 实现智能合并逻辑:
   - 根据name和url匹配现有工具
   - 保留现有ratingpopularity字段
   - 更新描述、logo、分类等字段
   - 标记新增工具

3. 合并算法:
```python
def merge_tools(existing: List[Dict], new: List[Dict]) -> List[Dict]:
    """智能合并新旧数据"""
    existing_dict = {t['name']: t for t in existing}
    merged = []
    
    for new_tool in new:
        if new_tool['name'] in existing_dict:
            # 保留现有字段
            existing_tool = existing_dict[new_tool['name']]
            merged_tool = {**new_tool}  # 复制新工具
            
            # 保留评分和热度
            if 'rating' in existing_tool:
                merged_tool['rating'] = existing_tool['rating']
            if 'popularity' in existing_tool:
                merged_tool['popularity'] = existing_tool['popularity']
            
            merged.append(merged_tool)
        else:
            # 新工具，直接添加
            merged.append(new_tool)
    
    return merged
```

4. 验证合并结果:
   - 工具数量统计
   - 字段完整度检查
   - Logo覆盖率统计

5. 输出报告 `data/merge_report.md`

**不能做**:
- 不验证数据完整性就保存
- 不备份原始数据

**推荐Agent Profile**:
- **Category**: quick
  - Reason: 数据处理逻辑明确，无复杂算法
- **Skills**: 无需特殊技能
- **Skills Evaluated but Omitted**:
  - 无

**并行**:
- **可以并行**: 否
- **并行组**: 无
- **阻塞**: 任务6
- **阻塞方**: 任务3,4

**References**:

**Pattern References** (现有代码模式):
- `data/tools.json` - 数据格式参考

**API/Type References** (API契约):
- 无

**Test References** (测试模式):
- 无

**External References** (外部资料):
- 无

**WHY Each Reference Matters**:
- 现有数据格式确保合并正确

**Acceptance Criteria**:

- [ ] 测试文件: scripts/test_merge.py
- [ ] 命令: python scripts/merge_data.py (生成合并后的tools.json)
- [ ] 验证:
  - 工具数量 > 1000
  - Logo覆盖率 > 80%
  - 保留所有rating字段

**Agent-Executed QA Scenarios**:

```
Scenario: 数据合并和完整性验证
  Tool: Bash (python + jq)
  Preconditions: Merge script ready
  Steps:
    1. Run: python scripts/merge_data.py
    2. Assert: data/merged_tools.json created
    3. Run: jq '. | length' data/merged_tools.json
    4. Assert: Tool count > 1000
    5. Run: jq '[.[] | select(.logo != null)] | length' data/merged_tools.json
    6. Assert: Tools with logo > 800 (80% of 1000)
    7. Run: jq '[.[] | select(.rating != null)] | length' data/merged_tools.json
    8. Assert: Tools with rating > 200 (all original tools)
    9. Save stats: .sisyphus/evidence/task-5-merge-stats.json
  Expected Result: >1000 tools, >80% logo coverage, ratings preserved
  Evidence: .sisyphus/evidence/task-5-merge-stats.json
```

**Commit**: YES
- Message: `feat(data): merge AI tools data from ai-bot.cn`
- Files: `scripts/merge_data.py`, `data/tools.json`

---

### 任务6: 最终测试和修复

**要做**:
1. 运行完整测试流程:
   - 搜索框功能测试
   - 搜索结果展示测试
   - 工具数量统计
   - Logo显示测试

2. 修复发现的问题:
   - 搜索框样式问题
   - 数据缺失字段
   - Logo加载失败

3. 更新文档:
   - README.md添加数据更新说明
   - CONTRIBUTING.md添加爬虫使用说明

**不能做**:
- 不做回归测试就提交
- 不修复严重问题就结束

**推荐Agent Profile**:
- **Category**: quick
  - Reason: 测试和修复为主
- **Skills**: 无需特殊技能
- **Skills Evaluated but Omitted**:
  - 无

**并行**:
- **可以并行**: 否
- **并行组**: 无
- **阻塞**: 无
- **阻塞方**: 任务5

**References**:

**Pattern References** (现有代码模式):
- `src/components/ToolList.tsx` - 工具卡片渲染
- `src/components/Header.astro` - 搜索组件

**API/Type References** (API契约):
- 无

**Test References** (测试模式):
- 无

**External References** (外部资料):
- 无

**WHY Each Reference Matters**:
- 确保修改不破坏现有功能

**Acceptance Criteria**:

- [ ] 测试文件: scripts/final_test.py
- [ ] 命令: npm run build && npm run preview
- [ ] 验证:
  - 构建成功
  - 搜索功能正常
  - 工具卡片显示正确
  - Logo图片加载成功

**Agent-Executed QA Scenarios**:

```
Scenario: 完整功能回归测试
  Tool: Playwright (playwright skill)
  Preconditions: Build successful, preview server running
  Steps:
    1. Navigate to: http://localhost:4321
    2. Check: Tool count displayed (grep page for "个工具")
    3. Assert: Count > 1000
    4. Find: First tool card with real logo (not fallback icon)
    5. Assert: Logo image loads successfully
    6. Click: #global-search
    7. Fill: "AI绘画"
    8. Click: #search-btn
    9. Wait: Search results appear
    10. Assert: Results contain "AI绘画" related tools
    11. Screenshot: .sisyphus/evidence/task-6-final-test.png
  Expected Result: All features work correctly
  Evidence: .sisyphus/evidence/task-6-final-test.png
```

**Commit**: YES
- Message: `chore: sync data from ai-bot.cn and fix search UI`
- Files: `data/tools.json`, `README.md`, `CONTRIBUTING.md`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(search): replace Ctrl+K with magnifying glass button` | src/components/Header.astro | npm run build |
| 2 | `feat(data): add AI tools scraper for ai-bot.cn` | scripts/scrape_ai_bot.py | python test_scrape.py |
| 3 | `feat(data): implement tool detail scraping` | scripts/scrape_ai_bot.py | python test_detail_parser.py |
| 4 | `feat(data): add logo download and CDN support` | scripts/scrape_ai_bot.py, .github/workflows/ | python test_logo_cdn.py |
| 5 | `feat(data): merge AI tools data from ai-bot.cn` | data/tools.json, scripts/merge_data.py | python test_merge.py |
| 6 | `chore: sync data from ai-bot.cn and fix search UI` | data/tools.json, README.md | npm run build && preview |

---

## Success Criteria

### 验证命令
```bash
# 1. 构建项目
npm run build

# 2. 运行爬虫测试
python scripts/test_scrape.py
python scripts/test_detail_parser.py
python scripts/test_logo_cdn.py
python scripts/merge_data.py

# 3. 检查数据
jq '. | length' data/tools.json  # 应 > 1000
jq '[.[] | select(.logo != null)] | length' data/tools.json  # 应 > 800
jq '[.[] | select(.rating != null)] | length' data/tools.json  # 应 > 200

# 4. 预览测试
npm run preview
```

### 最终检查清单
- [ ] 搜索框右侧有放大镜按钮
- [ ] 搜索框没有Ctrl+K文字
- [ ] 点击放大镜按钮可触发搜索
- [ ] 工具数量从216增加到1000+
- [ ] 80%以上的工具有真实logo
- [ ] Logo通过CDN加速访问
- [ ] 保留所有现有工具的rating字段
- [ ] 项目构建成功
- [ ] 预览页面正常显示
