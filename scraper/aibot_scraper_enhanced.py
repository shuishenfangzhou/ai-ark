"""
AI方舟 - 增强版 ai-bot.cn 数据爬虫
爬取所有工具、分类、评分、评论数等详细信息
"""

import asyncio
import aiohttp
import json
import re
import os
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import motor.motor_asyncio
from pymongo import MongoClient

# 配置
AIBOT_BASE_URL = "https://ai-bot.cn"
OUTPUT_FILE = Path(__file__).parent / "output" / "tools_data_enhanced.json"
CATEGORIES_FILE = Path(__file__).parent / "output" / "categories.json"

# MongoDB 配置 (可选，用于存储原始数据)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = "ai_ark_db"


class AIBotScraper:
    """ai-bot.cn 增强版爬虫"""
    
    def __init__(self):
        self.session = None
        self.tools = []
        self.categories = []
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }
        
        # 分类映射 (ai-bot.cn 的分类 -> 我们的分类)
        self.category_mapping = {
            "写作": "writing",
            "图像": "image",
            "视频": "video",
            "音频": "audio",
            "编程": "dev",
            "办公": "office",
            "设计": "design",
            "聊天": "chat",
            "搜索": "search",
            "学习": "learning",
            "模型": "models",
            "Agents": "agents",
            "提示词": "prompt",
            "检测": "detect",
            "其他": "General",
        }
    
    async def create_session(self):
        """创建异步 HTTP 会话"""
        timeout = aiohttp.ClientTimeout(total=30, connect=10)
        connector = aiohttp.TCPConnector(limit=10, limit_per_host=2)
        self.session = aiohttp.ClientSession(
            headers=self.headers,
            timeout=timeout,
            connector=connector
        )
    
    async def close_session(self):
        """关闭会话"""
        if self.session:
            await self.session.close()
    
    async def fetch_page(self, url):
        """获取页面内容"""
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    print(f"Request failed: {url} - Status: {response.status}")
                    return None
        except Exception as e:
            print(f"Request error: {url} - {e}")
            return None
    
    async def fetch_tools_list(self, page=1):
        """获取工具列表页"""
        if page == 1:
            url = f"{AIBOT_BASE_URL}/tools"
        else:
            url = f"{AIBOT_BASE_URL}/tools/page/{page}"
        
        html = await self.fetch_page(url)
        if not html:
            return []
        
        soup = BeautifulSoup(html, 'html.parser')
        tools = []
        
        # 查找工具卡片
        tool_cards = soup.select('div.tool-card, div.tool-item, div.card')
        
        for card in tool_cards:
            try:
                tool = self.parse_tool_card(card)
                if tool:
                    tools.append(tool)
            except Exception as e:
                print(f"⚠️  解析工具卡片失败: {e}")
                continue
        
        return tools
    
    def parse_tool_card(self, card):
        """解析工具卡片"""
        tool = {
            "id": None,
            "name": "",
            "description": "",
            "url": "",
            "logo": "",
            "category": "General",
            "tags": [],
            "pricing": "Unknown",
            "rating": 0.0,
            "visits": "0",
            "source": "ai-bot.cn",
            "created_at": datetime.now().isoformat(),
        }
        
        # Extract name
        name_elem = card.select_one('h3, .title, .name, [class*="title"]')
        if name_elem:
            tool["name"] = name_elem.get_text(strip=True)
        
        # Extract link
        link_elem = card.find('a')
        if link_elem:
            href = link_elem.get('href', '')
            if href:
                tool["url"] = urljoin(AIBOT_BASE_URL, href)
                # Extract ID
                match = re.search(r'/tools/(\d+)', href)
                if match:
                    tool["id"] = int(match.group(1))
        
        # Extract logo
        img_elem = card.find('img')
        if img_elem:
            tool["logo"] = img_elem.get('src', '') or img_elem.get('data-src', '')
        
        # Extract description
        desc_elem = card.select_one('p, .desc, .description, [class*="desc"]')
        if desc_elem:
            tool["description"] = desc_elem.get_text(strip=True)
        
        # Extract category
        cat_elem = card.select_one('[class*="cat"], [class*="tag"]')
        if cat_elem:
            cat_text = cat_elem.get_text(strip=True)
            tool["category"] = self.category_mapping.get(cat_text, "General")
        
        # Extract rating
        rating_elem = card.select_one('[class*="star"], [class*="rating"]')
        if rating_elem:
            rating_text = rating_elem.get_text(strip=True)
            match = re.search(r'(\d+\.?\d*)', rating_text)
            if match:
                tool["rating"] = float(match.group(1))
        
        # Extract visits
        visits_elem = card.select_one('[class*="visit"], [class*="view"]')
        if visits_elem:
            visits_text = visits_elem.get_text(strip=True)
            tool["visits"] = self.parse_visits(visits_text)
        
        return tool if tool["name"] and tool["url"] else None
    
    def parse_visits(self, visits_text):
        """解析访问量文本"""
        if not visits_text:
            return "0"
        
        # 提取数字
        match = re.search(r'([\d.]+)([KM]?)', visits_text.upper())
        if match:
            num = float(match.group(1))
            unit = match.group(2)
            
            if unit == 'K':
                return f"{int(num * 1000)}+"
            elif unit == 'M':
                return f"{int(num * 1000000)}+"
            else:
                return f"{int(num)}+"
        
        return "0"
    
    async def fetch_all_tools(self, max_pages=50):
        """获取所有工具"""
        print("=== Starting to scrape ai-bot.cn ===")
        all_tools = []
        page = 1
        
        while page <= max_pages:
            print(f"Fetching page {page}...")
            
            try:
                tools = await self.fetch_tools_list(page)
                if not tools:
                    print(f"Page {page} is empty, done.")
                    break
                
                all_tools.extend(tools)
                print(f"   Got {len(tools)} tools")
                
                # 延迟避免被封
                await asyncio.sleep(2)
                page += 1
                
            except Exception as e:
                print(f"Failed to fetch page {page}: {e}")
                break
        
        # 去重
        unique_tools = self.deduplicate_tools(all_tools)
        print(f"Done! Total unique tools: {len(unique_tools)}")
        
        return unique_tools
    
    def deduplicate_tools(self, tools):
        """工具去重"""
        seen = set()
        unique = []
        for tool in tools:
            key = (tool["name"], tool["url"])
            if key not in seen:
                seen.add(key)
                unique.append(tool)
        return unique
    
    async def fetch_categories(self):
        """获取分类列表"""
        print("Fetching categories...")
        url = AIBOT_BASE_URL
        
        html = await self.fetch_page(url)
        if not html:
            return []
        
        soup = BeautifulSoup(html, 'html.parser')
        categories = []
        
        # 查找分类元素
        cat_elements = soup.select('[class*="cat"], [class*="category"], nav a')
        
        for elem in cat_elements:
            try:
                name = elem.get_text(strip=True)
                href = elem.get('href', '')
                
                if name and href and '/category/' in href:
                    # 获取该分类的工具数量
                    count = self.extract_category_count(elem)
                    
                    category = {
                        "id": self.category_mapping.get(name, name.lower()),
                        "name": name,
                        "count": count,
                        "icon": self.get_category_icon(name),
                    }
                    categories.append(category)
            except Exception:
                continue
        
        return categories
    
    def extract_category_count(self, elem):
        """提取分类工具数量"""
        text = elem.get_text(strip=True)
        match = re.search(r'(\d+)', text)
        return int(match.group(1)) if match else 0
    
    def get_category_icon(self, name):
        """获取分类图标"""
        icons = {
            "写作": "✍️",
            "图像": "🎨",
            "视频": "🎬",
            "音频": "🎵",
            "编程": "💻",
            "办公": "📊",
            "设计": "🎯",
            "聊天": "💬",
            "搜索": "🔍",
            "学习": "📚",
            "模型": "🧠",
            "Agents": "🤖",
            "提示词": "💡",
            "检测": "🔎",
            "其他": "📦",
        }
        return icons.get(name, "📁")
    
    async def save_data(self):
        """保存数据"""
        # 保存工具数据
        OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
        
        data = {
            "last_updated": datetime.now().isoformat(),
            "source": "ai-bot.cn",
            "total_tools": len(self.tools),
            "total_categories": len(self.categories),
            "tools": self.tools,
            "categories": self.categories,
        }
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Data saved: {OUTPUT_FILE}")
        
        # 保存分类数据
        with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.categories, f, ensure_ascii=False, indent=2)
        
        print(f"Categories saved: {CATEGORIES_FILE}")
    
    async def run(self):
        """运行爬虫"""
        await self.create_session()
        
        try:
            # 获取分类
            self.categories = await self.fetch_categories()
            print(f"Categories fetched: {len(self.categories)}")
            
            # 获取工具
            self.tools = await self.fetch_all_tools(max_pages=100)
            
            # 保存数据
            await self.save_data()
            
            print(f"\n=== Complete! ===")
            print(f"   Categories: {len(self.categories)}")
            print(f"   Tools: {len(self.tools)}")
            
        finally:
            await self.close_session()


async def main():
    """主函数"""
    scraper = AIBotScraper()
    await scraper.run()


if __name__ == "__main__":
    asyncio.run(main())
