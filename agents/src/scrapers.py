"""
Data Scrapers
从不同来源抓取 AI 工具数据
"""
import os
import json
import re
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from abc import ABC, abstractmethod


class BaseScraper(ABC):
    """抓取器基类"""
    
    def __init__(self, name: str):
        self.name = name
        self.client = httpx.AsyncClient(timeout=30.0)
    
    @abstractmethod
    async def fetch(self, **kwargs) -> List[Dict[str, Any]]:
        """获取数据（子类必须实现）"""
        pass
    
    async def close(self):
        """关闭 HTTP 客户端"""
        await self.client.aclose()
    
    def _clean_text(self, text: str) -> str:
        """清理文本"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text).strip()
    
    def _extract_stars(self, text: str) -> int:
        """提取 star 数量"""
        if not text:
            return 0
        match = re.search(r'([\d,]+)\s*stars?', text, re.I)
        if match:
            return int(match.group(1).replace(',', ''))
        return 0


class GitHubTrendingScraper(BaseScraper):
    """GitHub Trending 抓取器"""
    
    def __init__(self):
        super().__init__("GitHub Trending")
        self.base_url = "https://github.com"
    
    async def fetch(self, language: str = "python", 
                    time_range: str = "daily") -> List[Dict[str, Any]]:
        """抓取 GitHub Trending"""
        url = f"{self.base_url}/trending/{language}"
        if time_range != "daily":
            url += f"?since={time_range}"
        
        try:
            response = await self.client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'lxml')
            repos = []
            
            # 解析仓库列表
            for article in soup.select('article.box-border'):
                try:
                    repo_data = self._parse_repo(article)
                    if repo_data:
                        repos.append(repo_data)
                except Exception as e:
                    print(f"解析仓库失败: {e}")
                    continue
            
            return repos
        except Exception as e:
            print(f"GitHub Trending 抓取失败: {e}")
            return []
    
    def _parse_repo(self, article) -> Dict[str, Any]:
        """解析单个仓库信息"""
        # 获取仓库名称
        title_elem = article.select_one('h2 a')
        if not title_elem:
            return None
        
        full_name = self._clean_text(title_elem.get('href', '')).strip('/')
        name = full_name.split('/')[-1]
        
        # 获取描述
        desc_elem = article.select_one('p')
        description = self._clean_text(desc_elem.get_text()) if desc_elem else ""
        
        # 获取语言和星标
        lang_elem = article.select_one('[itemprop="programmingLanguage"]')
        language = self._clean_text(lang_elem.get_text()) if lang_elem else ""
        
        stars_text = article.select_one('a[href$="stargazers"]')
        stars = self._extract_stars(stars_text.get_text()) if stars_text else 0
        
        # 构建结果
        return {
            "id": f"github-{full_name.replace('/', '-')}",
            "name": name,
            "name_en": name,
            "description": description,
            "url": f"{self.base_url}/{full_name}",
            "category": "AI编程" if "ai" in language.lower() else "AI工具",
            "tags": ["GitHub", "开源", language] if language else ["GitHub", "开源"],
            "pricing": "opensource",
            "rating": min(5.0, stars / 1000 * 3) if stars > 0 else 3.0,
            "popularity": stars,
            "source": "github",
        }


class ProductHuntScraper(BaseScraper):
    """Product Hunt 抓取器"""
    
    def __init__(self):
        super().__init__("Product Hunt")
        self.base_url = "https://www.producthunt.com"
    
    async def fetch(self, category: str = "ai") -> List[Dict[str, Any]]:
        """抓取 Product Hunt"""
        # Product Hunt 有 API，但这里使用网页抓取作为备选
        url = f"{self.base_url}/categories/{category}"
        
        try:
            response = await self.client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'lxml')
            products = []
            
            for post in soup.select('[data-test="category-post-item"]'):
                try:
                    product_data = self._parse_product(post)
                    if product_data:
                        products.append(product_data)
                except Exception as e:
                    print(f"解析产品失败: {e}")
                    continue
            
            return products
        except Exception as e:
            print(f"Product Hunt 抓取失败: {e}")
            return []
    
    def _parse_product(self, post) -> Dict[str, Any]:
        """解析单个产品信息"""
        # 产品名称
        name_elem = post.select_one('h3')
        name = self._clean_text(name_elem.get_text()) if name_elem else ""
        
        # 标语
        tagline_elem = post.select_one('[data-test="post-tagline"]')
        tagline = self._clean_text(tagline_elem.get_text()) if tagline_elem else ""
        
        # 链接
        link_elem = post.select_one('a[href^="/posts/"]')
        slug = link_elem.get('href', '').split('/')[-1] if link_elem else ""
        
        # Vote 数量
        vote_elem = post.select_one('[data-test="vote-count"]')
        votes = 0
        if vote_elem:
            vote_text = self._clean_text(vote_elem.get_text())
            votes = int(vote_text.replace(',', '')) if vote_text.isdigit() else 0
        
        return {
            "id": f"ph-{slug}",
            "name": name,
            "description": tagline,
            "url": f"{self.base_url}/posts/{slug}",
            "category": "AI产品",
            "tags": ["Product Hunt", "新品"],
            "pricing": "freemium",
            "rating": min(5.0, votes / 100) if votes > 0 else 3.0,
            "popularity": votes,
            "source": "producthunt",
        }


class AIToolsDirScraper(BaseScraper):
    """AI Tools Directory 抓取器（聚合多个源）"""
    
    def __init__(self):
        super().__init__("AI Tools Directory")
        self.sources = [
            "https://theresanaiforthat.com",
            "https://www.futurepedia.io",
            "https://www.aitools.fyi",
        ]
    
    async def fetch(self, limit: int = 50) -> List[Dict[str, Any]]:
        """从多个 AI 目录抓取"""
        all_tools = []
        
        for source_url in self.sources:
            try:
                tools = await self._fetch_from_source(source_url)
                all_tools.extend(tools)
                print(f"✓ 从 {source_url} 抓取到 {len(tools)} 个工具")
            except Exception as e:
                print(f"✗ 从 {source_url} 抓取失败: {e}")
        
        return all_tools[:limit]
    
    async def _fetch_from_source(self, url: str) -> List[Dict[str, Any]]:
        """从单个源抓取"""
        response = await self.client.get(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        response.raise_for_status()
        
        # 简化处理：返回空列表（实际项目中需要针对每个网站定制解析逻辑）
        return []


async def main():
    """主函数 - 测试抓取器"""
    scrapers = [
        GitHubTrendingScraper(),
        ProductHuntScraper(),
        #AIToolsDirScraper(),
    ]
    
    results = {}
    
    for scraper in scrapers:
        print(f"\n🔍 正在抓取: {scraper.name}")
        tools = await scraper.fetch()
        results[scraper.name] = tools
        print(f"✓ 获取到 {len(tools)} 个工具")
    
    # 保存结果
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'scraped_tools.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 数据已保存到: {output_file}")
    
    # 关闭所有客户端
    for scraper in scrapers:
        await scraper.close()


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
