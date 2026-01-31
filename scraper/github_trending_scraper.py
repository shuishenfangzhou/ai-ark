"""
GitHub Trending Scraper
Fetch AI-related open source projects from GitHub

Usage:
    python scraper/github_trending_scraper.py

Output:
    scraper/output/github_data.json - GitHub tools data
"""

import asyncio
import json
import os
import sys
import time
import aiohttp
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlencode
import re

sys.path.insert(0, str(Path(__file__).parent))
from config.github_topics import (
    GITHUB_TOPICS,
    EXCLUDED_TOPICS,
    PER_PAGE,
    MAX_RETRIES,
    REQUEST_DELAY,
    MIN_STARS
)

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "github_data.json"
RAW_FILE = OUTPUT_DIR / "github_raw.json"
CACHE_FILE = OUTPUT_DIR / "github_cache.json"

GITHUB_API_BASE = "https://api.github.com"
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "AI-Tools-Scraper/1.0"
}
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"token {GITHUB_TOKEN}"


class GitHubTrendingScraper:
    def __init__(self):
        self.session = None
        self.results = []
        self.raw_data = []
        self.cache = self.load_cache()
        
        if GITHUB_TOKEN:
            print("[OK] GitHub Token configured")
        else:
            print("[WARNING] No GitHub Token - using public rate limit")
    
    def load_cache(self):
        if CACHE_FILE.exists():
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def save_cache(self):
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.cache, f, ensure_ascii=False, indent=2)
    
    async def create_session(self):
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(
            timeout=timeout,
            headers=HEADERS
        )
    
    async def close_session(self):
        if self.session:
            await self.session.close()
    
    async def fetch(self, url, params=None):
        for attempt in range(MAX_RETRIES):
            try:
                async with self.session.get(url, params=params) as response:
                    if response.status == 200:
                        return await response.json()
                    elif response.status == 403:
                        print(f"[RATE LIMIT] Waiting 60s...")
                        await asyncio.sleep(60)
                    else:
                        print(f"[ERROR] Request failed: {response.status}")
                        return None
            except aiohttp.ClientError as e:
                print(f"[ERROR] Request exception: {e}")
                await asyncio.sleep(REQUEST_DELAY * 2)
            
            await asyncio.sleep(REQUEST_DELAY)
        return None
    
    async def search_repositories(self, query, category):
        url = f"{GITHUB_API_BASE}/search/repositories"
        params = {
            "q": f"{query} stars:>={MIN_STARS}",
            "sort": "stars",
            "order": "desc",
            "per_page": PER_PAGE
        }
        data = await self.fetch(url, params)
        if data and "items" in data:
            return data["items"]
        return []
    
    async def get_repository_details(self, repo_url):
        cache_key = repo_url
        if cache_key in self.cache:
            cached_time = datetime.fromisoformat(self.cache[cache_key]["cached_at"])
            if datetime.now() - cached_time < timedelta(days=1):
                print(f"  [CACHE] {repo_url}")
                return self.cache[cache_key]["data"]
        
        url = f"{GITHUB_API_BASE}/repos/{repo_url}"
        data = await self.fetch(url)
        
        if data:
            self.cache[cache_key] = {
                "cached_at": datetime.now().isoformat(),
                "data": data
            }
        return data
    
    def categorize_tool(self, topics, language):
        topic_str = " ".join(topics).lower()
        
        if any(t in topic_str for t in ["llm", "large-language-model", "gpt", "transformer"]):
            return "dev"
        if any(t in topic_str for t in ["machine-learning", "deep-learning", "neural-network"]):
            return "dev"
        if any(t in topic_str for t in ["pytorch", "tensorflow", "keras"]):
            return "dev"
        if any(t in topic_str for t in ["stable-diffusion", "image-generation", "diffusion"]):
            return "image"
        if any(t in topic_str for t in ["computer-vision", "gan"]):
            return "image"
        if any(t in topic_str for t in ["video-generation", "video-editing"]):
            return "video"
        if any(t in topic_str for t in ["nlp", "natural-language-processing"]):
            return "writing"
        if any(t in topic_str for t in ["text-generation", "language-model"]):
            return "writing"
        if any(t in topic_str for t in ["speech-recognition", "text-to-speech", "whisper"]):
            return "audio"
        if any(t in topic_str for t in ["agent", "langchain", "autonomous"]):
            return "agents"
        
        if language in ["Python", "Jupyter Notebook", "JavaScript", "TypeScript"]:
            return "dev"
        return "dev"
    
    def parse_description(self, description):
        if not description:
            return ""
        description = re.sub(r'[^\w\s\-\.\,\(\)]', '', description)
        return description.strip()[:500]
    
    async def process_repository(self, repo, category):
        try:
            full_name = repo.get("full_name", "")
            owner = repo.get("owner", {})
            
            details = await self.get_repository_details(full_name)
            if not details:
                return None
            
            topics = details.get("topics", []) or []
            
            for excluded in EXCLUDED_TOPICS:
                if excluded in topics:
                    return None
            
            language = details.get("language", "")
            tool_category = self.categorize_tool(topics, language)
            
            tool = {
                "id": details.get("id", 0),
                "name": details.get("name", ""),
                "full_name": full_name,
                "category": tool_category,
                "subcategory": category,
                "desc": self.parse_description(details.get("description", "")),
                "url": details.get("html_url", ""),
                "github_url": details.get("html_url", ""),
                "tags": topics[:10],
                "pricing": "Free",
                "rating": min(5.0, 3.0 + (details.get("stargazers_count", 0) / 100000)),
                "visits": f"{details.get('stargazers_count', 0)}",
                "logo": owner.get("avatar_url", "") if owner else "",
                "stars": details.get("stargazers_count", 0),
                "forks": details.get("forks_count", 0),
                "language": language,
                "open_issues": details.get("open_issues_count", 0),
                "subscribers": details.get("subscribers_count", 0),
                "created_at": details.get("created_at", "")[:10],
                "updated_at": details.get("updated_at", "")[:10],
                "pushed_at": details.get("pushed_at", "")[:10],
                "homepage": details.get("homepage", ""),
                "license": details.get("license", {}).get("spdx_id", "") if details.get("license") else ""
            }
            return tool
        except Exception as e:
            print(f"  [ERROR] Processing failed: {e}")
            return None
    
    async def scrape_category(self, category, topics):
        print(f"\n[SEARCH] Category: {category}")
        category_tools = []
        
        for topic in topics[:5]:
            print(f"  [TOPIC] {topic}")
            repos = await self.search_repositories(topic, category)
            print(f"    Found {len(repos)} repos")
            
            for repo in repos[:10]:
                tool = await self.process_repository(repo, category)
                if tool and tool["id"] not in [t.get("id") for t in category_tools]:
                    category_tools.append(tool)
                    print(f"    [OK] {tool['name']} ({tool['stars']} stars)")
                await asyncio.sleep(REQUEST_DELAY)
            await asyncio.sleep(REQUEST_DELAY * 2)
        
        return category_tools
    
    async def run(self):
        print("=" * 60)
        print("GitHub AI Tools Scraper")
        print("=" * 60)
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Output: {OUTPUT_FILE}")
        
        await self.create_session()
        
        try:
            all_tools = []
            
            for category, topics in GITHUB_TOPICS.items():
                tools = await self.scrape_category(category, topics)
                all_tools.extend(tools)
                print(f"  [STATS] {category}: {len(tools)} tools")
            
            seen_ids = set()
            unique_tools = []
            for tool in all_tools:
                if tool["id"] not in seen_ids:
                    seen_ids.add(tool["id"])
                    unique_tools.append(tool)
            
            unique_tools.sort(key=lambda x: x.get("stars", 0), reverse=True)
            
            OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            
            final_data = {
                "last_updated": datetime.now().strftime("%Y-%m-%d"),
                "total_tools": len(unique_tools),
                "sources": ["github_trending", "github_topics"],
                "tools": unique_tools
            }
            
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(final_data, f, ensure_ascii=False, indent=2)
            
            self.raw_data.append({
                "timestamp": datetime.now().isoformat(),
                "data": final_data
            })
            with open(RAW_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.raw_data, f, ensure_ascii=False, indent=2)
            
            self.save_cache()
            
            print()
            print("=" * 60)
            print("[COMPLETE] Scraper finished!")
            print(f"Total: {len(unique_tools)} tools")
            print(f"Saved: {OUTPUT_FILE}")
            print("=" * 60)
        finally:
            await self.close_session()


async def main():
    scraper = GitHubTrendingScraper()
    await scraper.run()


if __name__ == "__main__":
    asyncio.run(main())
