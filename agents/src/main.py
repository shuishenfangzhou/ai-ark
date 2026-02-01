"""
AI Tools Auto-Updater - Main Entry Point
自动化 AI 工具更新系统
"""
import os
import sys
import json
import re  # 添加 re 模块导入
import asyncio
from datetime import datetime
from pathlib import Path

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import AITool, ToolsCollection
from deepseek import DeepSeekLLM
from scrapers import GitHubTrendingScraper, ProductHuntScraper


class AIToolsUpdater:
    """AI 工具自动更新器"""
    
    def __init__(self):
        self.llm = None
        self.collection = ToolsCollection()
        self.data_dir = self._get_data_dir()
    
    def _get_data_dir(self) -> Path:
        """获取数据目录"""
        # 从项目根目录查找 data 目录
        current_dir = Path(__file__).parent
        data_dir = current_dir.parent.parent / 'data'
        
        # 如果不存在，创建它
        data_dir.mkdir(exist_ok=True)
        return data_dir
    
    def _load_existing_data(self) -> ToolsCollection:
        """加载现有数据"""
        tools_file = self.data_dir / 'tools.json'
        
        if tools_file.exists():
            try:
                with open(tools_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return ToolsCollection(**data)
            except Exception as e:
                print(f"⚠️ 加载现有数据失败: {e}")
        
        return ToolsCollection()
    
    def _save_data(self, collection: ToolsCollection):
        """保存数据"""
        tools_file = self.data_dir / 'tools.json'
        
        with open(tools_file, 'w', encoding='utf-8') as f:
            json.dump(collection.model_dump(), f, ensure_ascii=False, indent=2)
        
        print(f"💾 数据已保存: {tools_file}")
    
    async def initialize_llm(self):
        """初始化 LLM"""
        try:
            self.llm = DeepSeekLLM()
            print("✓ DeepSeek LLM 初始化成功")
        except ValueError as e:
            print(f"⚠️ DeepSeek LLM 初始化失败: {e}")
            print("  将跳过 AI 分析步骤")
    
    async def fetch_all_sources(self) -> list:
        """从所有来源抓取数据"""
        print("\n📡 开始抓取数据...")
        
        all_tools = []
        
        # 1. GitHub Trending
        print("\n🔍 抓取 GitHub Trending...")
        github_scraper = GitHubTrendingScraper()
        github_tools = await github_scraper.fetch()
        await github_scraper.close()
        print(f"✓ GitHub: 获取到 {len(github_tools)} 个项目")
        all_tools.extend(github_tools)
        
        # 2. Product Hunt
        print("\n🔍 抓取 Product Hunt...")
        ph_scraper = ProductHuntScraper()
        ph_tools = await ph_scraper.fetch()
        await ph_scraper.close()
        print(f"✓ Product Hunt: 获取到 {len(ph_tools)} 个产品")
        all_tools.extend(ph_tools)
        
        return all_tools
    
    async def analyze_tools(self, tools: list) -> list:
        """使用 AI 分析工具"""
        if not self.llm:
            print("\n⚠️ 跳过 AI 分析（LLM 未初始化）")
            return tools
        
        print(f"\n🤖 开始 AI 分析 ({len(tools)} 个工具)...")
        
        analyzed_tools = []
        batch_size = 5
        
        for i in range(0, len(tools), batch_size):
            batch = tools[i:i + batch_size]
            
            for tool in batch:
                try:
                    enriched = await self._analyze_tool(tool)
                    analyzed_tools.append(enriched)
                    print(f"  ✓ {tool.get('name', 'Unknown')}")
                except Exception as e:
                    print(f"  ✗ 分析失败: {e}")
                    analyzed_tools.append(tool)
            
            # 避免 API 限流
            if i + batch_size < len(tools):
                await asyncio.sleep(1)
        
        return analyzed_tools
    
    async def _analyze_tool(self, tool: dict) -> dict:
        """分析单个工具"""
        if not self.llm:
            return tool
        
        try:
            result = self.llm.analyze_tool(tool)
            return result
        except Exception:
            return tool
    
    async def merge_and_deduplicate(self, new_tools: list, 
                                     existing: ToolsCollection) -> ToolsCollection:
        """合并并去重"""
        print("\n🔄 合并数据...")
        
        merged = existing
        
        for tool_data in new_tools:
            try:
                # 生成唯一 ID
                tool_id = self._generate_id(tool_data)
                
                # 检查是否已存在
                if any(t.id == tool_id for t in merged.tools):
                    continue
                
                # 创建工具对象
                tool = AITool(**tool_data)
                merged.add_tool(tool)
                
            except Exception as e:
                print(f"  ⚠️ 处理工具失败: {e}")
                continue
        
        print(f"✓ 合并完成: 共 {merged.total_count} 个工具")
        return merged
    
    def _generate_id(self, tool: dict) -> str:
        """生成唯一 ID"""
        url = tool.get('url', '')
        name = tool.get('name', 'unknown')
        
        # 从 URL 提取标识
        if 'github.com' in url:
            # GitHub: 使用仓库路径
            match = re.search(r'github\.com/([^/]+/[^/]+)', url)
            if match:
                return f"github-{match.group(1).replace('/', '-')}"
        
        elif 'producthunt.com' in url:
            # Product Hunt: 使用 slug
            match = re.search(r'producthunt\.com/posts/([^/]+)', url)
            if match:
                return f"ph-{match.group(1)}"
        
        # 默认: 使用名称
        return f"tool-{name.lower().replace(' ', '-').replace('_', '-')}"
    
    async def run(self):
        """运行更新流程"""
        print("=" * 60)
        print("🚀 AI Tools Auto-Updater v2.0")
        print("=" * 60)
        
        start_time = datetime.now()
        
        try:
            # 1. 加载现有数据
            print("\n📂 加载现有数据...")
            existing = self._load_existing_data()
            print(f"✓ 已加载 {existing.total_count} 个工具")
            
            # 2. 初始化 LLM
            await self.initialize_llm()
            
            # 3. 抓取新数据
            new_tools = await self.fetch_all_sources()
            
            if not new_tools:
                print("\n⚠️ 未获取到新数据")
                return
            
            # 4. AI 分析
            analyzed_tools = await self.analyze_tools(new_tools)
            
            # 5. 合并去重
            merged = await self.merge_and_deduplicate(analyzed_tools, existing)
            
            # 6. 保存结果
            self._save_data(merged)
            
            # 7. 生成统计报告
            elapsed = (datetime.now() - start_time).total_seconds()
            print("\n" + "=" * 60)
            print("📊 更新报告")
            print("=" * 60)
            print(f"  原有工具: {existing.total_count}")
            print(f"  新增工具: {len(new_tools)}")
            print(f"  最终数量: {merged.total_count}")
            print(f"  耗时: {elapsed:.1f} 秒")
            print("=" * 60)
        
        except KeyboardInterrupt:
            print("\n\n⚠️ 用户中断")
        except Exception as e:
            print(f"\n❌ 错误: {e}")
            raise


async def main():
    """主入口"""
    updater = AIToolsUpdater()
    await updater.run()


if __name__ == "__main__":
    asyncio.run(main())
