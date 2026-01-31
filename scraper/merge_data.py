"""
简化版数据合并脚本
将 ai-bot 数据（必需）和 GitHub 数据（可选）合并

使用说明:
    python scraper/merge_data.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# 路径配置
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent

AIBOT_DATA_FILE = PROJECT_DIR / "scraper" / "output" / "tools_data.json"
GITHUB_DATA_FILE = PROJECT_DIR / "scraper" / "output" / "github_data.json"
PUBLIC_DATA_FILE = PROJECT_DIR / "public" / "toolsData.json"
DIST_DATA_FILE = PROJECT_DIR / "dist" / "toolsData.json"


def load_aibot_data():
    """加载 ai-bot 数据（必需）"""
    print("Loading ai-bot data...")

    if not AIBOT_DATA_FILE.exists():
        print(f"ERROR: ai-bot data file not found: {AIBOT_DATA_FILE}")
        return None

    with open(AIBOT_DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 兼容不同格式
    if isinstance(data, list):
        tools = data
    elif isinstance(data, dict):
        tools = data.get("tools", data.get("items", []))
    else:
        tools = []

    print(f"  Loaded {len(tools)} ai-bot tools")
    return tools


def load_github_data():
    """加载 GitHub 数据（可选）"""
    print("Loading GitHub data...")

    if not GITHUB_DATA_FILE.exists():
        print("  No GitHub data file found, skipping")
        return []

    with open(GITHUB_DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    tools = data.get("tools", [])
    print(f"  Loaded {len(tools)} GitHub projects")
    return tools


def convert_to_standard_format(tool, index, source):
    """转换为标准格式"""
    if source == "ai-bot":
        return {
            "id": tool.get("id", index + 1),
            "name": tool.get("name", ""),
            "category": tool.get("category", "General"),
            "subcategory": tool.get("subcategory", ""),
            "desc": tool.get("desc", "")[:500],
            "url": tool.get("url", ""),
            "tags": tool.get("tags", [])[:10],
            "pricing": tool.get("pricing", "Unknown"),
            "rating": tool.get("rating", 3.0),
            "visits": tool.get("visits", "0"),
            "logo": tool.get("logo", ""),
            "source": "ai-bot.cn"
        }
    else:  # github
        return {
            "id": -(index + 1),
            "name": tool.get("name", ""),
            "category": tool.get("category", "dev"),
            "subcategory": "GitHub Trending",
            "desc": tool.get("desc", "")[:500],
            "url": tool.get("url", tool.get("github_url", "")),
            "tags": tool.get("tags", [])[:10],
            "pricing": "Free",
            "rating": min(5.0, 3.0 + (tool.get("stars", 0) / 100000)),
            "visits": str(tool.get("stars", 0)),
            "logo": tool.get("logo", tool.get("owner", {}).get("avatar_url", "")),
            "source": "github.com",
            "github_url": tool.get("github_url", ""),
            "github_stars": tool.get("stars", 0)
        }


def merge_and_deduplicate(aibot_tools, github_tools):
    """合并并去重"""
    print("Merging and deduplicating...")

    all_tools = []

    # 添加 ai-bot 工具
    for i, tool in enumerate(aibot_tools):
        converted = convert_to_standard_format(tool, i, "ai-bot")
        all_tools.append(converted)

    # 添加 GitHub 工具
    for i, tool in enumerate(github_tools):
        converted = convert_to_standard_format(tool, i, "github")
        all_tools.append(converted)

    # 按 URL 去重
    seen_urls = set()
    unique_tools = []
    for tool in all_tools:
        url = tool.get("url", "").lower()
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_tools.append(tool)

    print(f"  Total unique tools: {len(unique_tools)}")
    return unique_tools


def build_categories(tools):
    """构建分类"""
    print("Building categories...")

    category_map = {}
    for tool in tools:
        cat_id = tool.get("category", "General")
        if cat_id not in category_map:
            category_map[cat_id] = {
                "id": cat_id,
                "name": get_category_name(cat_id),
                "icon": get_category_icon(cat_id),
                "count": 0
            }
        category_map[cat_id]["count"] += 1

    categories = list(category_map.values())
    categories.sort(key=lambda x: x["count"], reverse=True)

    print(f"  Categories: {len(categories)}")
    return categories


def get_category_name(cat_id):
    """分类名称映射"""
    names = {
        "dev": "AI Development",
        "image": "AI Image",
        "video": "AI Video",
        "writing": "AI Writing",
        "audio": "AI Audio",
        "office": "AI Office",
        "agents": "AI Agents",
        "chat": "AI Chat",
        "search": "AI Search",
        "design": "AI Design",
        "learning": "AI Learning",
        "models": "AI Models",
        "General": "General"
    }
    return names.get(cat_id, cat_id.title())


def get_category_icon(cat_id):
    """分类图标映射"""
    icons = {
        "dev": "💻",
        "image": "🎨",
        "video": "🎬",
        "writing": "✍️",
        "audio": "🎵",
        "office": "📊",
        "agents": "🤖",
        "chat": "💬",
        "search": "🔍",
        "design": "🎯",
        "learning": "📚",
        "models": "🧠",
        "General": "📦"
    }
    return icons.get(cat_id, "📁")


def save_data(tools, categories, aibot_count, github_count):
    """保存数据"""
    print("Saving data...")

    final_data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d"),
        "total_tools": len(tools),
        "total_categories": len(categories),
        "sources": {
            "ai-bot.cn": aibot_count,
            "github.com": github_count
        },
        "categories": categories,
        "tools": tools
    }

    # 保存到 public
    PUBLIC_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PUBLIC_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    print(f"  Saved: {PUBLIC_DATA_FILE}")

    # 保存到 dist
    DIST_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DIST_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    print(f"  Saved: {DIST_DATA_FILE}")

    return final_data


def main():
    """主函数"""
    print("=" * 50)
    print("Data Merge Script")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    print()

    # 加载数据
    aibot_tools = load_aibot_data()
    if aibot_tools is None:
        print("ERROR: Failed to load ai-bot data")
        sys.exit(1)

    github_tools = load_github_data()

    # 合并
    unique_tools = merge_and_deduplicate(aibot_tools, github_tools)

    # 构建分类
    categories = build_categories(unique_tools)

    # 保存
    save_data(unique_tools, categories, len(aibot_tools), len(github_tools))

    print()
    print("=" * 50)
    print("SUCCESS!")
    print(f"Total tools: {len(unique_tools)}")
    print(f"Categories: {len(categories)}")
    print("=" * 50)


if __name__ == "__main__":
    main()
