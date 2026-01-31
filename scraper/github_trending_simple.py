"""
GitHub Trending 抓取脚本 - 备用版本（无 aiohttp）

使用 requests 库，适用于没有安装 aiohttp 的环境

使用说明:
    python scraper/github_trending_simple.py

输出:
    scraper/output/github_data.json - GitHub 工具数据
"""

import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlencode
import ssl
import re

# 添加当前目录到路径
sys.path.insert(0, str(Path(__file__).parent))
from config.github_topics import (
    GITHUB_TOPICS,
    EXCLUDED_TOPICS,
    PER_PAGE,
    REQUEST_DELAY,
    MIN_STARS
)

# 配置
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "github_data.json"

# GitHub API
GITHUB_API_BASE = "https://api.github.com"

# 请求头
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "AI-Tools-Scraper/1.0"
}

# GitHub Token
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"token {GITHUB_TOKEN}"


def make_request(url, retries=3):
    """发送 HTTP 请求"""
    for attempt in range(retries):
        try:
            req = Request(url, headers=HEADERS)
            
            # SSL 上下文
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            with urlopen(req, timeout=30, context=ctx) as response:
                data = response.read().decode('utf-8')
                return json.loads(data)
                
        except Exception as e:
            print(f"  请求失败 ({attempt + 1}/{retries}): {e}")
            time.sleep(REQUEST_DELAY * 2)
    
    return None


def search_repositories(query):
    """搜索仓库"""
    url = f"{GITHUB_API_BASE}/search/repositories?{urlencode({
        'q': f'{query} stars:>={MIN_STARS}',
        'sort': 'stars',
        'order': 'desc',
        'per_page': PER_PAGE
    })}"
    
    data = make_request(url)
    if data and "items" in data:
        return data["items"]
    return []


def get_repository_details(full_name):
    """获取仓库详细信息"""
    url = f"{GITHUB_API_BASE}/repos/{full_name}"
    return make_request(url)


def categorize_tool(topics, language):
    """分类工具"""
    topic_str = " ".join(topics).lower()
    
    if any(t in topic_str for t in ["llm", "large-language-model", "gpt", "transformer"]):
        return "dev"
    if any(t in topic_str for t in ["machine-learning", "deep-learning"]):
        return "dev"
    if any(t in topic_str for t in ["stable-diffusion", "image-generation"]):
        return "image"
    if any(t in topic_str for t in ["nlp", "natural-language-processing"]):
        return "writing"
    if any(t in topic_str for t in ["video-generation"]):
        return "video"
    if any(t in topic_str for t in ["speech-recognition", "text-to-speech"]):
        return "audio"
    if any(t in topic_str for t in ["agent", "langchain"]):
        return "agents"
    
    return "dev"


def parse_description(description):
    """清理描述"""
    if not description:
        return ""
    description = re.sub(r'[^\w\s\-\.\,\(\)]', '', description)
    return description.strip()[:500]


def scrape_category(category, topics):
    """抓取单个分类"""
    print(f"\n🔍 抓取分类: {category}")
    category_tools = []
    
    for topic in topics[:5]:
        print(f"  📌 主题: {topic}")
        
        repos = search_repositories(topic)
        print(f"    找到 {len(repos)} 个仓库")
        
        for repo in repos[:10]:
            full_name = repo.get("full_name", "")
            print(f"    处理: {full_name}")
            
            # 获取详细信息
            details = get_repository_details(full_name)
            if not details:
                time.sleep(REQUEST_DELAY)
                continue
            
            topics_list = details.get("topics", [])
            
            # 跳过排除的
            for excluded in EXCLUDED_TOPICS:
                if excluded in topics_list:
                    continue
            
            language = details.get("language", "")
            tool_category = categorize_tool(topics_list, language)
            
            owner = details.get("owner", {})
            
            tool = {
                "id": details.get("id", 0),
                "name": details.get("name", ""),
                "category": tool_category,
                "subcategory": category,
                "desc": parse_description(details.get("description", "")),
                "url": details.get("html_url", ""),
                "github_url": details.get("html_url", ""),
                "tags": topics_list[:10],
                "pricing": "Free",
                "rating": min(5.0, 3.0 + (details.get("stargazers_count", 0) / 100000)),
                "visits": f"{details.get('stargazers_count', 0)}",
                "logo": owner.get("avatar_url", "") if owner else "",
                "stars": details.get("stargazers_count", 0),
                "forks": details.get("forks_count", 0),
                "language": language,
                "updated_at": details.get("updated_at", "")[:10]
            }
            
            if tool["id"] not in [t.get("id") for t in category_tools]:
                category_tools.append(tool)
                print(f"      ✅ {tool['name']} ({tool['stars']} ⭐)")
            
            time.sleep(REQUEST_DELAY)
        
        time.sleep(REQUEST_DELAY * 2)
    
    return category_tools


def run():
    """运行抓取"""
    print("=" * 60)
    print("🚀 GitHub AI 工具抓取脚本（简单版）")
    print("=" * 60)
    print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    all_tools = []
    
    # 抓取各分类
    for category, topics in GITHUB_TOPICS.items():
        tools = scrape_category(category, topics)
        all_tools.extend(tools)
        print(f"  📊 {category}: {len(tools)} 个工具")
    
    # 去重
    seen_ids = set()
    unique_tools = []
    for tool in all_tools:
        if tool["id"] not in seen_ids:
            seen_ids.add(tool["id"])
            unique_tools.append(tool)
    
    # 排序
    unique_tools.sort(key=lambda x: x.get("stars", 0), reverse=True)
    
    # 保存
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    final_data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d"),
        "total_tools": len(unique_tools),
        "sources": ["github_topics"],
        "tools": unique_tools
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    
    print()
    print("=" * 60)
    print("✅ 抓取完成!")
    print(f"📊 总计: {len(unique_tools)} 个工具")
    print(f"💾 保存到: {OUTPUT_FILE}")
    print("=" * 60)


if __name__ == "__main__":
    run()
