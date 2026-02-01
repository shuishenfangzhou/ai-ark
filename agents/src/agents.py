"""
CrewAI Agent Configuration
配置 AI Agent 的角色和能力
"""
import os
from typing import List
from crewai import Agent, Task, Crew, Process
from dotenv import load_dotenv

load_dotenv()


class AIAgents:
    """AI Agent 集合"""
    
    def __init__(self):
        self.llm_config = {
            "model": "deepseek-chat",
            "api_key": os.getenv("DEEPSEEK_API_KEY"),
            "base_url": os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1"),
        }
    
    def create_researcher(self) -> Agent:
        """创建研究员 Agent - 负责数据抓取"""
        return Agent(
            role="AI Tools Researcher",
            goal="从多个来源发现和收集最新的 AI 工具信息",
            backstory="""你是一个专业的 AI 工具研究员，拥有丰富的技术背景和敏锐的洞察力。
你的工作是在 GitHub Trending、Product Hunt 和各种 AI 目录中发现最新的 AI 工具，
并收集它们的详细信息。你对 AI 领域有深入的了解，能够快速判断一个工具的价值和潜力。""",
            llm_config=self.llm_config,
            verbose=True,
            allow_delegation=False,
        )
    
    def create_analyst(self) -> Agent:
        """创建分析员 Agent - 负责数据处理"""
        return Agent(
            role="AI Tools Analyst",
            goal="分析和丰富工具信息，确保数据质量",
            backstory="""你是一个专业的 AI 工具分析师，擅长从海量信息中提取关键特征。
你会为每个工具生成简洁有力的描述、选择合适的标签、判断定价模式，
并给出专业的评价。你的分析让用户能够快速了解每个工具的价值。""",
            llm_config=self.llm_config,
            verbose=True,
            allow_delegation=False,
        )
    
    def create_writer(self) -> Agent:
        """创建写作 Agent - 负责内容输出"""
        return Agent(
            role="AI Tools Writer",
            goal="将分析结果整理成用户友好的格式",
            backstory="""你是一个专业的技术写手，擅长将复杂的技术信息转化为易懂的文字。
你的任务是确保每个工具的描述清晰、准确、有吸引力，
帮助用户快速做出选择。""",
            llm_config=self.llm_config,
            verbose=True,
            allow_delegation=False,
        )
    
    def create_curator(self) -> Agent:
        """创建策展人 Agent - 负责质量控制"""
        return Agent(
            role="AI Tools Curator",
            goal="确保数据质量和一致性",
            backstory="""你是一个严格的质量控制专家，负责审核所有收集的数据。
你会检查数据的完整性、一致性和准确性，确保只有高质量的工具才会被收录。
你的标准很高，但也公平公正。""",
            llm_config=self.llm_config,
            verbose=True,
            allow_delegation=False,
        )
    
    def research_github_trending(self, language: str = "python", 
                                  time_range: str = "daily") -> Task:
        """创建 GitHub Trending 抓取任务"""
        researcher = self.create_researcher()
        
        return Task(
            description=f"""从 GitHub Trending 抓取最新的 AI 相关项目。

要求：
1. 语言: {language}
2. 时间范围: {time_range}
3. 筛选条件: 至少 100 stars, 近期有更新
4. 输出: 项目名称、描述、URL、star 数、作者

请返回 JSON 格式的数据列表。""",
            agent=researcher,
            expected_output="JSON 格式的项目列表",
        )
    
    def research_product_hunt(self, category: str = "ai") -> Task:
        """创建 Product Hunt 抓取任务"""
        researcher = self.create_researcher()
        
        return Task(
            description=f"""从 Product Hunt 抓取最新的 {category} 类产品。

要求：
1. 筛选近期发布的产品
2. 收集产品名称、标语、描述、URL
3. 记录 upvote 数量
4. 输出: 产品名称、标语、描述、URL、 upvote 数

请返回 JSON 格式的数据列表。""",
            agent=researcher,
            expected_output="JSON 格式的产品列表",
        )
    
    def analyze_new_tools(self, tools_data: str) -> Task:
        """创建工具分析任务"""
        analyst = self.create_analyst()
        
        return Task(
            description=f"""分析并丰富以下 AI 工具信息：

{tools_data}

对于每个工具，请提供：
1. 简短的描述（50字以内）
2. 3-5个核心功能标签
3. 定价模式判断
4. 主要分类判断
5. 质量评分 (1-5)

请返回 JSON 格式的丰富后数据。""",
            agent=analyst,
            expected_output="JSON 格式的丰富后数据",
        )
    
    def curate_tools(self, tools_data: str) -> Task:
        """创建质量控制任务"""
        curator = self.create_curator()
        
        return Task(
            description=f"""审核以下工具数据，确保质量：

{tools_data}

检查项目：
1. 数据完整性（必填字段是否齐全）
2. 格式正确性（URL、标签等格式）
3. 去重处理（移除重复项）
4. 质量筛选（移除低质量或无效项）

请返回审核后的工具列表，以及被移除的原因。""",
            agent=curator,
            expected_output="审核后的工具列表和移除原因",
        )
    
    def run_research_crew(self, sources: List[str] = None) -> str:
        """运行研究团队工作流"""
        if sources is None:
            sources = ["github", "producthunt"]
        
        crew = Crew(
            agents=[
                self.create_researcher(),
                self.create_analyst(),
                self.create_curator(),
            ],
            tasks=[],
            process=Process.sequential,
            verbose=True,
        )
        
        # 根据来源创建相应任务
        tasks = []
        if "github" in sources:
            tasks.append(self.research_github_trending())
        if "producthunt" in sources:
            tasks.append(self.research_product_hunt())
        
        # 运行工作流
        result = crew.kickoff(tasks=tasks)
        return result


# 测试代码
if __name__ == "__main__":
    agents = AIAgents()
    
    # 测试创建 Agent
    researcher = agents.create_researcher()
    print(f"✓ 研究员创建成功: {researcher.role}")
    
    analyst = agents.create_analyst()
    print(f"✓ 分析员创建成功: {analyst.role}")
    
    # 测试创建任务
    task = agents.research_github_trending()
    print(f"✓ 研究任务创建成功")
    
    print("\n🤖 AI Agents 配置完成！")
