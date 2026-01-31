"""
GitHub 数据合并脚本
将 GitHub 数据合并到主工具数据集中

使用说明:
    python scraper/merge_github_data.py

输出:
    public/toolsData.json - 合并后的工具数据
    dist/toolsData.json - 合并后的工具数据（前端使用）
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

# 添加当前目录到路径
sys.path.insert(0, str(Path(__file__).parent))

# 路径配置
SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR / "output"
GITHUB_DATA_FILE = OUTPUT_DIR / "github_data.json"
AIBOT_DATA_FILE = SCRIPT_DIR.parent / "scraper" / "output" / "tools_data.json"
PUBLIC_DATA_FILE = SCRIPT_DIR.parent / "public" / "toolsData.json"
DIST_DATA_FILE = SCRIPT_DIR.parent / "dist" / "toolsData.json"


class DataMerger:
    """数据合并器"""
    
    def __init__(self):
        self.github_tools = []
        self.aibot_tools = []
        self.merged_tools = []
        self.categories = []
    
    def load_github_data(self):
        """加载 GitHub 数据"""
        print("📥 加载 GitHub 数据...")
        
        if not GITHUB_DATA_FILE.exists():
            print(f"⚠️  GitHub 数据文件不存在: {GITHUB_DATA_FILE}")
            print("   请先运行: python scraper/github_trending_scraper.py")
            return False
        
        with open(GITHUB_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self.github_tools = data.get("tools", [])
        
        print(f"   加载了 {len(self.github_tools)} 个 GitHub 项目")
        return True
    
    def load_aibot_data(self):
        """加载 ai-bot 数据"""
        print("📥 加载 ai-bot 数据...")
        
        if not AIBOT_DATA_FILE.exists():
            print(f"⚠️  ai-bot 数据文件不存在: {AIBOT_DATA_FILE}")
            return False
        
        with open(AIBOT_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # 兼容不同格式
            if isinstance(data, list):
                self.aibot_tools = data
            elif isinstance(data, dict):
                self.aibot_tools = data.get("tools", data.get("items", []))
        
        print(f"   加载了 {len(self.aibot_tools)} 个 ai-bot 工具")
        return True
    
    def convert_github_to_standard_format(self, tool):
        """将 GitHub 工具转换为标准格式"""
        # 生成唯一 ID（使用负数避免与现有数据冲突）
        github_id = tool.get("id", 0)
        tool_id = -abs(github_id) if github_id else -(len(self.merged_tools) + 1)
        
        # 处理 logo
        logo = tool.get("logo", "")
        if not logo and tool.get("owner"):
            logo = tool.get("owner", {}).get("avatar_url", "")
        
        # 构建标准格式
        converted = {
            "id": tool_id,
            "name": tool.get("name", ""),
            "category": tool.get("category", "dev"),
            "subcategory": tool.get("subcategory", "GitHub Trending"),
            "desc": tool.get("desc", "")[:500],
            "url": tool.get("url", tool.get("github_url", "")),
            "tags": tool.get("tags", [])[:10],
            "pricing": "Free",
            "rating": min(5.0, 3.0 + (tool.get("stars", 0) / 100000)),
            "visits": f"{tool.get('stars', 0)}",
            "logo": logo,
            # GitHub 特有字段
            "source": "github",
            "github_url": tool.get("github_url", ""),
            "github_stars": tool.get("stars", 0),
            "github_forks": tool.get("forks", 0),
            "github_language": tool.get("language", ""),
            "github_updated": tool.get("updated_at", "")[:10]
        }
        
        return converted
    
    def convert_aibot_to_standard_format(self, tool, index):
        """将 ai-bot 工具转换为标准格式"""
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
            # 来源标记
            "source": "ai-bot.cn"
        }
    
    def merge_data(self):
        """合并数据"""
        print("\n🔄 合并数据...")
        
        # 合并工具
        all_tools = []
        
        # 添加 ai-bot 工具
        for i, tool in enumerate(self.aibot_tools):
            converted = self.convert_aibot_to_standard_format(tool, i)
            all_tools.append(converted)
        
        # 添加 GitHub 工具
        for tool in self.github_tools:
            converted = self.convert_github_to_standard_format(tool)
            all_tools.append(converted)
        
        # 去重（根据 URL）
        seen_urls = set()
        unique_tools = []
        for tool in all_tools:
            url = tool.get("url", "").lower()
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_tools.append(tool)
        
        # 按 stars/visits 排序
        unique_tools.sort(
            key=lambda x: int(x.get("visits", "0").replace("M+", "000000").replace("K+", "000").replace("+", "")),
            reverse=True
        )
        
        self.merged_tools = unique_tools
        print(f"   合并后总计: {len(unique_tools)} 个工具")
        
        return unique_tools
    
    def build_categories(self):
        """构建分类列表"""
        print("\n📂 构建分类列表...")
        
        category_map = {}
        for tool in self.merged_tools:
            cat_id = tool.get("category", "General")
            if cat_id not in category_map:
                category_map[cat_id] = {
                    "id": cat_id,
                    "name": self.get_category_name(cat_id),
                    "icon": self.get_category_icon(cat_id),
                    "count": 0
                }
            category_map[cat_id]["count"] += 1
        
        # 按数量排序
        categories = list(category_map.values())
        categories.sort(key=lambda x: x["count"], reverse=True)
        
        self.categories = categories
        print(f"   分类数: {len(categories)}")
        
        return categories
    
    def get_category_name(self, cat_id):
        """获取分类名称"""
        names = {
            "dev": "AI 开发",
            "image": "AI 图像",
            "video": "AI 视频",
            "writing": "AI 写作",
            "audio": "AI 音频",
            "office": "AI 办公",
            "agents": "AI 智能体",
            "chat": "AI 对话",
            "search": "AI 搜索",
            "design": "AI 设计",
            "learning": "AI 学习",
            "models": "AI 模型",
            "General": "其他工具"
        }
        return names.get(cat_id, cat_id.title())
    
    def get_category_icon(self, cat_id):
        """获取分类图标"""
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
    
    def save_data(self):
        """保存合并后的数据"""
        print("\n💾 保存数据...")
        
        # 构建最终数据
        final_data = {
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "total_tools": len(self.merged_tools),
            "total_categories": len(self.categories),
            "sources": {
                "ai-bot.cn": len(self.aibot_tools),
                "github.com": len(self.github_tools)
            },
            "categories": self.categories,
            "tools": self.merged_tools
        }
        
        # 保存到 public 目录
        PUBLIC_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(PUBLIC_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        print(f"   ✅ 保存到: {PUBLIC_DATA_FILE}")
        
        # 保存到 dist 目录
        DIST_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(DIST_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        print(f"   ✅ 保存到: {DIST_DATA_FILE}")
        
        return final_data
    
    def run(self):
        """运行合并任务"""
        print("=" * 60)
        print("🚀 GitHub 数据合并脚本")
        print("=" * 60)
        print(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # 加载数据
        if not self.load_github_data():
            return None
        
        self.load_aibot_data()
        
        # 合并数据
        self.merge_data()
        
        # 构建分类
        self.build_categories()
        
        # 保存数据
        final_data = self.save_data()
        
        print()
        print("=" * 60)
        print("✅ 合并完成!")
        print(f"📊 总工具数: {len(self.merged_tools)}")
        print(f"📂 分类数: {len(self.categories)}")
        print("=" * 60)
        
        return final_data


def main():
    """主函数"""
    merger = DataMerger()
    merger.run()


if __name__ == "__main__":
    main()
