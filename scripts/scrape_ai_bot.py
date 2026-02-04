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
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Optional
import re
import hashlib


class AIBotScraper:
    """ai-bot.cn 爬虫类"""
    
    def __init__(self, output_dir: str = "data", logos_dir: str = "public/logos"):
        self.base_url = "https://ai-bot.cn/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        })
        self.tools: List[Dict] = []
        self.output_dir = output_dir
        self.logos_dir = logos_dir
        
        # 创建目录
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(logos_dir, exist_ok=True)
        
    def get_page(self, url: str, retry: int = 3, delay: float = 1.0) -> Optional[str]:
        """获取页面内容，支持重试和延迟"""
        time.sleep(delay)
        
        for attempt in range(retry):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                response.encoding = 'utf-8'
                return response.text
            except Exception as e:
                print(f"请求失败 ({attempt+1}/{retry}): {url} - {e}")
                if attempt < retry - 1:
                    time.sleep(5 * (attempt + 1))
        return None
    
    def get_categories(self) -> List[Dict]:
        """获取所有分类"""
        print("正在获取分类列表...")
        
        categories = [
            {"name": "AI写作工具", "url": "https://ai-bot.cn/favorites/ai-writing-tools/"},
            {"name": "AI图像工具", "url": "https://ai-bot.cn/favorites/ai-image-tools/"},
            {"name": "AI视频工具", "url": "https://ai-bot.cn/favorites/ai-video-tools/"},
            {"name": "AI办公工具", "url": "https://ai-bot.cn/favorites/ai-office-tools/"},
            {"name": "AI智能体", "url": "https://ai-bot.cn/favorites/ai-agent/"},
            {"name": "AI聊天助手", "url": "https://ai-bot.cn/favorites/ai-chatbots/"},
            {"name": "AI编程工具", "url": "https://ai-bot.cn/favorites/ai-programming-tools/"},
            {"name": "AI设计工具", "url": "https://ai-bot.cn/favorites/ai-design-tools/"},
            {"name": "AI音频工具", "url": "https://ai-bot.cn/favorites/ai-audio-tools/"},
            {"name": "AI搜索引擎", "url": "https://ai-bot.cn/favorites/ai-search-engines/"},
            {"name": "AI开发平台", "url": "https://ai-bot.cn/favorites/ai-frameworks/"},
            {"name": "AI学习网站", "url": "https://ai-bot.cn/favorites/websites-to-learn-ai/"},
            {"name": "AI训练模型", "url": "https://ai-bot.cn/favorites/ai-models/"},
            {"name": "AI内容检测", "url": "https://ai-bot.cn/favorites/ai-content-detection-and-optimization-tools/"},
            {"name": "AI提示指令", "url": "https://ai-bot.cn/favorites/ai-prompt-tools/"},
        ]
        
        print(f"找到 {len(categories)} 个分类")
        return categories
    
    def parse_tool_card(self, card_html, category: str) -> Optional[Dict]:
        """解析工具卡片HTML"""
        try:
            # 获取logo
            logo = None
            img_tag = card_html.find('img')
            if img_tag and img_tag.get('src'):
                logo = img_tag.get('src')
            elif img_tag and img_tag.get('data-src'):
                logo = img_tag.get('data-src')
            
            # 获取标题
            title_tag = card_html.find('h3') or card_html.find('strong')
            name = title_tag.get_text(strip=True) if title_tag else None
            
            # 获取描述
            desc_tag = card_html.find('p')
            description = desc_tag.get_text(strip=True) if desc_tag else ""
            
            # 获取链接
            link = None
            link_tag = card_html.find('a', href=True)
            if link_tag:
                link = link_tag.get('href')
            
            # 生成ID
            if name:
                name_hash = hashlib.md5(name.encode()).hexdigest()[:8]
                tool_id = f"aibot-{name_hash}"
            else:
                return None
            
            return {
                "id": tool_id,
                "name": name,
                "description": description,
                "description_full": description,
                "url": link if link else "",
                "logo": logo,
                "category": category,
                "tags": [category.replace("AI", "").replace("工具", "")],
                "pricing": "unknown",
                "features": [],
                "rating": None,
                "popularity": None,
                "source": "ai-bot.cn",
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S")
            }
        except Exception as e:
            print(f"解析工具卡片失败: {e}")
            return None
    
    def get_tools_from_category(self, category: Dict, max_pages: int = 10) -> List[Dict]:
        """从分类页面获取工具列表"""
        print(f"正在抓取分类: {category['name']}...")
        tools = []
        
        page = 1
        while page <= max_pages:
            if page == 1:
                url = category['url']
            else:
                url = f"{category['url']}page/{page}/"
            
            html = self.get_page(url, delay=1.5)
            if not html:
                break
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # 查找工具卡片
            # ai-bot.cn 使用sites/{id}.html格式的链接
            cards = soup.find_all('a', href=re.compile(r'/sites/\d+\.html'))
            
            if not cards:
                print(f"  第{page}页没有找到工具，停止翻页")
                break
            
            print(f"  第{page}页找到 {len(cards)} 个工具链接")
            
            seen_urls = set()
            for card in cards:
                href = card.get('href', '')
                if href in seen_urls:
                    continue
                seen_urls.add(href)
                
                # 尝试获取工具详情页获取真实logo
                tool = self.parse_tool_detail_page(href, category['name'])
                if tool:
                    tools.append(tool)
            
            page += 1
            time.sleep(1)
        
        print(f"  {category['name']} 共获取 {len(tools)} 个工具")
        return tools
    
    def parse_tool_detail_page(self, tool_url: str, default_category: str) -> Optional[Dict]:
        """从工具详情页解析信息"""
        if not tool_url:
            return None
        
        html = self.get_page(tool_url, delay=0.5)
        if not html:
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        try:
            # 提取工具ID
            tool_id_match = re.search(r'/sites/(\d+)\.html', tool_url)
            tool_id = f"aibot-{tool_id_match.group(1)}" if tool_id_match else None
            
            # 提取名称
            title_tag = soup.find('h1') or soup.find('title')
            name = ""
            if title_tag:
                name = title_tag.get_text(strip=True)
                # 清理标题中的站点名称
                name = re.sub(r'[|_]-.*AI.*$', '', name).strip()
            
            if not name:
                return None
            
            # 提取logo - 尝试多种方式
            logo = None
            
            # 方式1: 查找meta og:image
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                logo = og_image['content']
            
            # 方式2: 查找页面中的logo图片
            if not logo:
                logo_img = soup.find('img', class_='site-logo') or \
                          soup.find('div', class_='site-logo') and soup.find('img')
                if logo_img and logo_img.get('src'):
                    logo = logo_img['src']
            
            # 方式3: 查找favicon
            if not logo:
                favicon = soup.find('link', rel='icon') or soup.find('link', rel='shortcut icon')
                if favicon and favicon.get('href'):
                    logo = favicon['href']
            
            # 清理logo URL
            if logo:
                logo = str(logo)
                if logo.startswith('//'):
                    logo = 'https:' + logo
                elif logo.startswith('/'):
                    logo = 'https://ai-bot.cn' + logo
            
            # 提取描述
            description = ""
            meta_desc = soup.find('meta', property='og:description')
            if meta_desc and meta_desc.get('content'):
                description = meta_desc['content']
            
            # 如果没有描述，尝试从页面文本获取
            if not description:
                desc_tag = soup.find('p', class_='site-description')
                if desc_tag:
                    description = desc_tag.get_text(strip=True)[:200]
            
            # 提取官网链接
            url = ""
            link_div = soup.find('div', class_='site-link') or \
                      soup.find('a', class_='site-link-btn') or \
                      soup.find('a', text=re.compile(r'官网|访问|前往'))
            if link_div:
                if link_div.name == 'a':
                    url = link_div.get('href', '')
                else:
                    link = link_div.find('a')
                    if link:
                        url = link.get('href', '')
            
            # 提取标签
            tags = [default_category.replace("AI", "").replace("工具", "")]
            tag_elements = soup.find_all('a', class_=re.compile(r'tag|label'))
            for tag in tag_elements[:5]:
                tag_text = tag.get_text(strip=True)
                if tag_text and len(tag_text) < 20:
                    if tag_text not in tags:
                        tags.append(tag_text)
            
            return {
                "id": tool_id or f"aibot-{hash(name) % 100000}",
                "name": name,
                "description": description[:200] if description else f"{name} - {default_category}工具",
                "description_full": description,
                "url": url,
                "logo": logo,
                "category": default_category,
                "tags": tags[:5],
                "pricing": "unknown",
                "features": [],
                "rating": None,
                "popularity": None,
                "source": "ai-bot.cn",
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S")
            }
        except Exception as e:
            print(f"  解析详情页失败: {tool_url} - {e}")
            return None
    
    def get_tool_detail(self, tool_url: str) -> Optional[Dict]:
        """获取工具详情页"""
        html = self.get_page(tool_url, delay=1.0)
        if not html:
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # 解析详情页
        # 这里可以提取更多信息，如完整描述、功能特点等
        
        return None
    
    def download_logo(self, logo_url: str, tool_id: str) -> Optional[str]:
        """下载logo图片"""
        if not logo_url:
            return None
        
        # 使用远程URL作为logo（通过CDN访问）
        if logo_url.startswith('//'):
            logo_url = 'https:' + logo_url
        
        # 生成CDN URL
        if 'ai-bot.cn' in logo_url:
            # 返回原始URL，后续通过代理访问
            return logo_url
        
        return logo_url
    
    def save_tools(self, filename: str = "tools_aibot.json"):
        """保存工具数据"""
        output_path = os.path.join(self.output_dir, filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                "version": "3.0",
                "last_updated": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "total_count": len(self.tools),
                "tools": self.tools
            }, f, ensure_ascii=False, indent=2)
        print(f"已保存 {len(self.tools)} 个工具到 {output_path}")
        return output_path
    
    def run(self, max_pages_per_category: int = 5):
        """执行爬取"""
        print("=" * 50)
        print("AI工具数据爬虫 - ai-bot.cn")
        print("=" * 50)
        
        categories = self.get_categories()
        
        for i, category in enumerate(categories):
            print(f"\n[{i+1}/{len(categories)}] 处理分类: {category['name']}")
            tools = self.get_tools_from_category(category, max_pages=max_pages_per_category)
            self.tools.extend(tools)
        
        # 保存数据
        self.save_tools()
        
        print("\n" + "=" * 50)
        print(f"爬取完成! 共获取 {len(self.tools)} 个工具")
        print("=" * 50)
        
        return self.tools
    
    def run_detailed(self, max_tools: int = 500) -> List[Dict]:
        """执行爬取（详情页模式，获取真实logo）"""
        print("=" * 50)
        print("AI工具数据爬虫 - 详情页模式")
        print("=" * 50)
        
        categories = self.get_categories()
        
        # 获取每个分类的工具链接
        all_tool_urls = []
        
        for i, category in enumerate(categories):  # 处理所有分类
            print(f"\n[{i+1}/{len(categories)}] 扫描分类: {category['name']}")
            
            html = self.get_page(category['url'], delay=0.5)
            if not html:
                continue
            
            soup = BeautifulSoup(html, 'html.parser')
            cards = soup.find_all('a', href=re.compile(r'/sites/\d+\.html'))
            
            seen = set()
            for card in cards[:50]:  # 每个分类取50个
                href = card.get('href', '')
                if href and href not in seen:
                    seen.add(href)
                    all_tool_urls.append((href, category['name']))
            
            print(f"  发现 {len(seen)} 个工具")
            time.sleep(0.3)
            
            if len(all_tool_urls) >= max_tools:
                print(f"  已达到上限 {max_tools}，停止扫描")
                break
        
        # 去重：只保留未抓取过的URL
        existing_urls = {t.get('source_url') for t in self.tools if t.get('source_url')}
        unique_urls = [(url, cat) for url, cat in all_tool_urls if url not in existing_urls]
        
        print(f"\n总工具URL: {len(all_tool_urls)}")
        print(f"新工具URL: {len(unique_urls)}")
        
        if not unique_urls:
            print("\n没有新工具需要抓取！")
            return self.tools
        
        # 解析详情页获取真实logo
        limit = min(len(unique_urls), max_tools)
        print(f"\n开始解析 {limit} 个新详情页...")
        
        for i, (url, category) in enumerate(unique_urls[:limit]):
            print(f"  [{i+1}/{limit}] ", end="", flush=True)
            tool = self.parse_tool_detail_page(url, category)
            if tool:
                try:
                    print(f"[OK] {tool.get('name', 'Unknown')}")
                except UnicodeEncodeError:
                    print(f"[OK] (Unicode name)")
                self.tools.append(tool)
            else:
                print("[FAIL]")
            time.sleep(0.2)
        
        # 保存
        self.save_tools()
        
        print("\n" + "=" * 50)
        print(f"详情页模式完成! 获取 {len(self.tools)} 个工具")
        print("=" * 50)
        
        return self.tools


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='AI工具数据爬虫 - ai-bot.cn')
    parser.add_argument('--pages', type=int, default=5, help='每个分类最大爬取页数')
    parser.add_argument('--output', type=str, default='data', help='输出目录')
    parser.add_argument('--test', action='store_true', help='测试模式（只爬取1页）')
    parser.add_argument('--detail', action='store_true', help='从详情页获取真实logo')
    
    args = parser.parse_args()
    
    max_pages = 1 if args.test else args.pages
    
    print("=" * 50)
    if args.detail:
        print("AI工具数据爬虫 - 详情页模式 (获取真实logo)")
    else:
        print("AI工具数据爬虫 - 快速模式 (不使用详情页)")
    print("=" * 50)
    
    scraper = AIBotScraper(output_dir=args.output)
    
    if args.detail:
        # 详情页模式：爬取更多工具获取真实logo
        print("\n使用详情页模式获取真实logo...")
        tools = scraper.run_detailed(max_tools=max_pages * 30)  # 每页约30个工具
    else:
        # 快速模式
        tools = scraper.run(max_pages_per_category=max_pages)
    
    print(f"\n爬取完成! 获取 {len(tools)} 个工具")


if __name__ == "__main__":
    main()
