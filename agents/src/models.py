"""
AI Tool Data Models
使用 Pydantic 定义数据结构，确保数据一致性
"""
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PricingType(str, Enum):
    FREE = "free"
    PAID = "paid"
    FREEMIUM = "freemium"
    OPENSOURCE = "opensource"


class CategoryType(str, Enum):
    AI_WRITING = "AI写作"
    AI_IMAGE = "AI绘画"
    AI_VIDEO = "AI视频"
    AI_AUDIO = "AI音频"
    AI_OFFICE = "AI办公"
    AI_CODE = "AI编程"
    AI_CHAT = "AI对话"
    AI_SEARCH = "AI搜索"
    AI_AGENT = "AI代理"
    AI_DESIGN = "AI设计"
    AI_LEARNING = "AI学习"
    AI_MODEL = "AI模型"


class AITool(BaseModel):
    """AI工具数据模型"""
    id: str  # 唯一标识符
    name: str  # 工具名称
    name_en: Optional[str] = None  # 英文名称
    description: str  # 简短描述
    description_full: Optional[str] = None  # 完整描述
    url: HttpUrl  # 官方链接
    logo: Optional[HttpUrl] = None  # Logo URL
    
    # 分类和标签
    category: CategoryType  # 主分类
    tags: List[str] = []  # 标签列表
    
    # 定价信息
    pricing: PricingType = PricingType.FREE
    price_monthly: Optional[float] = None  # 月付价格
    price_yearly: Optional[float] = None  # 年付价格
    
    # 功能特性
    features: List[str] = []  # 核心功能列表
    languages: List[str] = []  # 支持语言
    
    # 质量指标
    rating: float = 0.0  # 评分 (0-5)
    review_count: int = 0  # 评论数
    popularity: int = 0  # 人气值
    
    # 元数据
    source: str  # 数据来源 (github, producthunt, etc.)
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    
    # 额外信息
    screenshot_urls: List[HttpUrl] = []  # 截图
    api_docs_url: Optional[HttpUrl] = None  # API文档
    discord_url: Optional[HttpUrl] = None  # Discord社区
    
    class Config:
        use_enum_values = True


class ToolsCollection(BaseModel):
    """工具集合容器"""
    version: str = "2.0"
    last_updated: datetime = datetime.now()
    total_count: int = 0
    tools: List[AITool] = []
    
    def add_tool(self, tool: AITool):
        """添加工具，自动去重"""
        existing_ids = [t.id for t in self.tools]
        if tool.id not in existing_ids:
            self.tools.append(tool)
            self.total_count = len(self.tools)
            self.last_updated = datetime.now()
    
    def remove_tool(self, tool_id: str):
        """移除工具"""
        self.tools = [t for t in self.tools if t.id != tool_id]
        self.total_count = len(self.tools)
        self.last_updated = datetime.now()
    
    def get_by_category(self, category: CategoryType) -> List[AITool]:
        """按分类获取工具"""
        return [t for t in self.tools if t.category == category]
    
    def get_top_rated(self, limit: int = 10) -> List[AITool]:
        """获取评分最高的工具"""
        return sorted(self.tools, key=lambda x: x.rating, reverse=True)[:limit]
