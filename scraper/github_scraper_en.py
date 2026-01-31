#!/usr/bin/env python
"""
GitHub Trending Scraper - English only version
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

sys.path.insert(0, str(Path(__file__).parent))
from config.github_topics import (
    GITHUB_TOPICS, EXCLUDED_TOPICS, PER_PAGE, REQUEST_DELAY, MIN_STARS
)

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "github_data.json"
GITHUB_API_BASE = "https://api.github.com"
HEADERS = {"Accept": "application/vnd.github.v3+json", "User-Agent": "AI-Tools-Scraper/1.0"}
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"token {GITHUB_TOKEN}"


def make_request(url, retries=3):
    for attempt in range(retries):
        try:
            req = Request(url, headers=HEADERS)
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            with urlopen(req, timeout=30, context=ctx) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception as e:
            print(f"Request failed ({attempt + 1}/{retries}): {e}")
            time.sleep(REQUEST_DELAY * 2)
    return None


def search_repositories(query):
    url = f"{GITHUB_API_BASE}/search/repositories?{urlencode({
        'q': f'{query} stars:>={MIN_STARS}',
        'sort': 'stars', 'order': 'desc', 'per_page': PER_PAGE
    })}"
    data = make_request(url)
    return data["items"] if data and "items" in data else []


def get_repository_details(full_name):
    return make_request(f"{GITHUB_API_BASE}/repos/{full_name}")


def categorize_tool(topics, language):
    topic_str = " ".join(topics).lower()
    if any(t in topic_str for t in ["llm", "large-language-model", "gpt", "transformer",
        "machine-learning", "deep-learning", "pytorch", "tensorflow"]):
        return "dev"
    if any(t in topic_str for t in ["stable-diffusion", "image-generation", "computer-vision"]):
        return "image"
    if any(t in topic_str for t in ["nlp", "natural-language-processing", "text-generation"]):
        return "writing"
    if any(t in topic_str for t in ["video-generation"]):
        return "video"
    if any(t in topic_str for t in ["speech-recognition", "text-to-speech"]):
        return "audio"
    if any(t in topic_str for t in ["agent", "langchain"]):
        return "agents"
    return "dev" if language in ["Python", "JavaScript", "TypeScript"] else "dev"


def parse_description(description):
    if not description:
        return ""
    return re.sub(r'[^\w\s\-\.\,\(\)]', '', description).strip()[:500]


def scrape_category(category, topics):
    print(f"\n[SEARCH] Category: {category}")
    category_tools = []
    
    for topic in topics[:5]:
        print(f"  [TOPIC] {topic}")
        repos = search_repositories(topic)
        print(f"    Found {len(repos)} repos")
        
        for repo in repos[:10]:
            full_name = repo.get("full_name", "")
            print(f"    Processing: {full_name}")
            
            details = get_repository_details(full_name)
            if not details:
                time.sleep(REQUEST_DELAY)
                continue
            
            topics_list = details.get("topics", [])
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
                "visits": str(details.get("stargazers_count", 0)),
                "logo": owner.get("avatar_url", "") if owner else "",
                "stars": details.get("stargazers_count", 0),
                "forks": details.get("forks_count", 0),
                "language": language,
                "updated_at": details.get("updated_at", "")[:10]
            }
            
            if tool["id"] not in [t.get("id") for t in category_tools]:
                category_tools.append(tool)
                print(f"      [OK] {tool['name']} ({tool['stars']} stars)")
            
            time.sleep(REQUEST_DELAY)
        
        time.sleep(REQUEST_DELAY * 2)
    
    return category_tools


def run():
    print("=" * 60)
    print("GitHub AI Tools Scraper")
    print("=" * 60)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    all_tools = []
    
    for category, topics in GITHUB_TOPICS.items():
        tools = scrape_category(category, topics)
        all_tools.extend(tools)
        print(f"  [STATS] {category}: {len(tools)} tools")
    
    # Deduplicate
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
        "sources": ["github_topics"],
        "tools": unique_tools
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    
    print()
    print("=" * 60)
    print("[COMPLETE] Scraper finished!")
    print(f"Total: {len(unique_tools)} tools")
    print(f"Saved: {OUTPUT_FILE}")
    print("=" * 60)


if __name__ == "__main__":
    run()
