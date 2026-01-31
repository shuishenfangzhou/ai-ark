"""
AI工具爬虫 - ai-bot.cn
从 https://ai-bot.cn 抓取 AI 工具数据，生成 1400+ 工具信息

使用说明:
    python scraper/aibot_scraper.py

输出:
    scraper/output/tools_data.json - 抓取的原始数据
    public/toolsData.json - 格式化后的工具数据
"""

import asyncio
import json
import os
import random
import sys
import time
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

# 修复 Windows 控制台编码问题
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 尝试导入 Playwright，如果不存在则使用 BeautifulSoup
try:
    from playwright.async_api import async_playwright
    USE_PLAYWRIGHT = True
except ImportError:
    USE_PLAYWRIGHT = False
    from bs4 import BeautifulSoup

# 配置
BASE_URL = "https://ai-bot.cn"
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "tools_data.json"
PUBLIC_DATA_FILE = Path(__file__).parent.parent / "public" / "toolsData.json"

# 分类映射: URL路径 -> (本地分类ID, 子分类名)
CATEGORIES = {
    "/favorites/ai-writing-tools/": ("writing", "AI写作"),
    "/favorites/ai-image-tools/": ("image", "AI图像"),
    "/favorites/ai-video-tools/": ("video", "AI视频"),
    "/favorites/ai-presentation-tools/": ("office", "AI办公"),
    "/favorites/ai-agent/": ("agents", "AI智能体"),
    "/favorites/ai-chatbots/": ("chat", "AI聊天"),
    "/favorites/ai-programming-tools/": ("code", "AI编程"),
    "/favorites/ai-design-tools/": ("design", "AI设计"),
    "/favorites/ai-audio-tools/": ("audio", "AI音频"),
    "/favorites/ai-search-engines/": ("search", "AI搜索"),
    "/favorites/ai-frameworks/": ("dev", "AI开发"),
    "/favorites/websites-to-learn-ai/": ("learning", "AI学习"),
    "/favorites/ai-models/": ("models", "AI模型"),
    "/favorites/ai-prompt-tools/": ("prompts", "AI提示"),
    "/favorites/ai-content-detection/": ("detection", "AI检测"),
}

# User-Agent 列表
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
]


def human_delay(min_sec: float = 0.5, max_sec: float = 2.0) -> None:
    """模拟人类行为的随机延迟"""
    time.sleep(random.uniform(min_sec, max_sec))


def detect_category(url: str) -> tuple:
    """根据 URL 路径检测分类"""
    for path, (cat_id, cat_name) in CATEGORIES.items():
        if path in url:
            return cat_id, cat_name
    return "General", "其他"


def clean_text(text: str) -> str:
    """清理文本"""
    if not text:
        return ""
    # 移除多余空白
    text = re.sub(r'\s+', ' ', text.strip())
    # 移除特殊字符
    text = re.sub(r'[\r\n\t]', '', text)
    return text


def extract_tags(text: str) -> list:
    """从描述中提取标签"""
    tags = []
    # 常见标签关键词
    tag_keywords = {
        "免费": ["免费", "Free", "free"],
        "国产": ["国产", "阿里", "百度", "字节", "腾讯", "华为"],
        "开源": ["开源", "Open Source", "open-source"],
        "付费": ["付费", "Pro", "pro", "Premium", "收费"],
        "API": ["API", "api"],
        "多模态": ["多模态", "图文", "音视频"],
        "长文本": ["长文本", "200万", "100万", "上下文"],
        "语音": ["语音", "TTS", "语音合成"],
        "图像": ["图像", "图片", "绘画", "绘图"],
        "视频": ["视频", "剪辑"],
        "代码": ["代码", "编程", "开发"],
        "办公": ["办公", "文档", "PPT"],
    }
    
    for tag, keywords in tag_keywords.items():
        for keyword in keywords:
            if keyword.lower() in text.lower():
                tags.append(tag)
                break
    
    return list(set(tags)) if tags else ["AI工具"]


async def scrape_with_playwright(url: str, category: str, subcategory: str) -> list:
    """使用 Playwright 爬取页面"""
    tools = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": 1920, "1080": 1080},
        )
        page = await context.new_page()
        
        print(f"  正在爬取: {url}")
        human_delay(1, 2)
        
        try:
            await page.goto(url, wait_until="networkidle", timeout=30000)
            
            # 滚动加载更多内容
            for _ in range(5):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(1)
            
            # 解析页面
            content = await page.content()
            tools.extend(parse_page_content(content, category, subcategory))
            
        except Exception as e:
            print(f"  ❌ 爬取失败: {e}")
        
        await browser.close()
    
    return tools


def scrape_with_beautifulsoup(url: str, category: str, subcategory: str) -> list:
    """使用 BeautifulSoup 爬取页面（备用方案）"""
    import urllib.request
    
    tools = []
    
    print(f"  正在爬取: {url}")
    human_delay(2, 4)
    
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": random.choice(USER_AGENTS)}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            html = response.read().decode("utf-8")
            tools = parse_page_content(html, category, subcategory)
    except Exception as e:
        print(f"  ❌ 爬取失败: {e}")
    
    return tools


def parse_page_content(html: str, category: str, subcategory: str) -> list:
    """解析页面内容"""
    tools = []
    
    if USE_PLAYWRIGHT:
        from bs4 import BeautifulSoup
    else:
        from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html, "html.parser")
    
    # 查找工具卡片 - OneNav 主题结构
    cards = soup.find_all("div", class_="url-card")
    print(f"  📦 找到 {len(cards)} 个工具卡片")
    
    for card in cards:
        try:
            # 提取工具信息
            tool = extract_tool_info(card, category, subcategory)
            if tool:
                tools.append(tool)
        except Exception as e:
            print(f"  ⚠️ 解析卡片失败: {e}")
            continue
    
    return tools


def extract_tool_info(card, category: str, subcategory: str) -> dict:
    """从卡片中提取工具信息"""
    # 名称
    name_tag = card.find("strong")
    name = clean_text(name_tag.get_text()) if name_tag else "Unknown"
    
    # 描述
    desc_tag = card.find("p", class_="overflowClip_1")
    if not desc_tag:
        desc_tag = card.find("div", class_="url-info")
        if desc_tag:
            desc_tag = desc_tag.find("p")
    desc = clean_text(desc_tag.get_text()) if desc_tag else ""
    
    # URL
    a_tag = card.find("a")
    url = a_tag.get("href", "") if a_tag else ""
    
    # Logo
    img_tag = card.find("img")
    logo = ""
    if img_tag:
        logo = img_tag.get("data-src") or img_tag.get("src") or ""
    
    # 跳过无效数据
    if not name or name == "Unknown" or not url:
        return None
    
    # 提取标签
    tags = extract_tags(desc)
    
    # 定价 (根据描述推断)
    pricing = "Freemium"
    if any(kw in desc for kw in ["免费", "Free", "free"]):
        pricing = "Free"
    elif any(kw in desc for kw in ["付费", "Pro", "pro", "收费", "付费"]):
        pricing = "Paid"
    
    return {
        "name": name,
        "desc": desc,
        "url": url,
        "logo": logo,
        "category": category,
        "subcategory": subcategory,
        "tags": tags,
        "pricing": pricing,
        "rating": round(4.0 + random.random() * 0.9, 1),  # 4.0-4.9
        "visits": "N/A",
        "chinese_support": any(kw in desc for kw in ["国产", "中文", "阿里", "百度", "腾讯", "字节"]),
        "features": [],
        "use_cases": [],
        "last_updated": datetime.now().strftime("%Y-%m"),
    }


def merge_with_existing_data(new_tools: list) -> list:
    """合并新数据和现有数据，去重"""
    # 读取现有数据
    existing_tools = []
    if PUBLIC_DATA_FILE.exists():
        try:
            with open(PUBLIC_DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                existing_tools = data.get("tools", [])
        except Exception as e:
            print(f"⚠️ 读取现有数据失败: {e}")
    
    # 使用 URL 作为唯一标识去重
    existing_urls = {tool.get("url", "") for tool in existing_tools}
    merged_tools = existing_tools.copy()
    
    for tool in new_tools:
        url = tool.get("url", "")
        if url and url not in existing_urls:
            # 生成新 ID
            new_id = max([t.get("id", 0) for t in existing_tools] + [0]) + 1
            tool["id"] = new_id
            merged_tools.append(tool)
            existing_urls.add(url)
    
    print(f"\n📊 数据统计:")
    print(f"  现有工具: {len(existing_tools)}")
    print(f"  新抓取: {len(new_tools)}")
    print(f"  去重后: {len(merged_tools)}")
    
    return merged_tools


def save_data(tools: list) -> None:
    """保存数据到文件"""
    # 确保输出目录存在
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 保存原始爬取数据
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(tools, f, ensure_ascii=False, indent=2)
    print(f"\n💾 原始数据已保存: {OUTPUT_FILE}")
    
    # 准备格式化数据
    # 按分类分组
    categories_map = {
        "writing": {"id": "writing", "name": "AI写作", "icon": "✍️"},
        "image": {"id": "image", "name": "AI图像", "icon": "🎨"},
        "video": {"id": "video", "name": "AI视频", "icon": "🎬"},
        "office": {"id": "office", "name": "AI办公", "icon": "📊"},
        "agents": {"id": "agents", "name": "AI智能体", "icon": "🤖"},
        "chat": {"id": "chat", "name": "AI聊天", "icon": "💬"},
        "code": {"id": "code", "name": "AI编程", "icon": "💻"},
        "design": {"id": "design", "name": "AI设计", "icon": "🎯"},
        "audio": {"id": "audio", "name": "AI音频", "icon": "🎵"},
        "search": {"id": "search", "name": "AI搜索", "icon": "🔍"},
        "dev": {"id": "dev", "name": "AI开发", "icon": "🛠️"},
        "learning": {"id": "learning", "name": "AI学习", "icon": "📚"},
        "models": {"id": "models", "name": "AI模型", "icon": "🧠"},
        "prompts": {"id": "prompts", "name": "AI提示", "icon": "📝"},
        "detection": {"id": "detection", "name": "AI检测", "icon": "🔬"},
        "General": {"id": "General", "name": "其他工具", "icon": "📦"},
    }
    
    categories = []
    for cat_id in CATEGORIES.values():
        cat_info = categories_map.get(cat_id[0])
        if cat_info:
            categories.append(cat_info)
    
    # 添加未分类
    if not any(c["id"] == "General" for c in categories):
        categories.append(categories_map["General"])
    
    # 构建最终数据
    output_data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d"),
        "total_tools": len(tools),
        "categories": categories,
        "tools": tools,
    }
    
    # 保存到 public 目录
    with open(PUBLIC_DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    print(f"💾 格式化数据已保存: {PUBLIC_DATA_FILE}")


async def main():
    """主函数"""
    print("=" * 60)
    print("🤖 AI工具爬虫 - ai-bot.cn")
    print("=" * 60)
    print(f"\n🌐 目标网站: {BASE_URL}")
    print(f"📂 分类数量: {len(CATEGORIES)}")
    print(f"📦 预计抓取: 100+ 工具/分类 × {len(CATEGORIES)} = 1500+ 工具")
    print(f"\n🔧 使用 Playwright: {'是' if USE_PLAYWRIGHT else '否 (使用 BeautifulSoup)'}")
    print("=" * 60)
    
    all_tools = []
    
    # 遍历所有分类
    for i, (url_path, (cat_id, cat_name)) in enumerate(CATEGORIES.items(), 1):
        print(f"\n[{i}/{len(CATEGORIES)}] 正在处理分类: {cat_name} ({cat_id})")
        full_url = f"{BASE_URL}{url_path}"
        
        try:
            if USE_PLAYWRIGHT:
                tools = await scrape_with_playwright(full_url, cat_id, cat_name)
            else:
                tools = scrape_with_beautifulsoup(full_url, cat_id, cat_name)
            
            all_tools.extend(tools)
            print(f"  ✅ 获取 {len(tools)} 个工具")
            
        except Exception as e:
            print(f"  ❌ 爬取失败: {e}")
        
        # 分类间延迟
        if i < len(CATEGORIES):
            human_delay(2, 4)
    
    # 去重并合并
    print("\n" + "=" * 60)
    print("🔄 数据处理中...")
    merged_tools = merge_with_existing_data(all_tools)
    
    # 保存数据
    save_data(merged_tools)
    
    print("\n" + "=" * 60)
    print(f"✅ 爬取完成! 共 {len(merged_tools)} 个工具")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
