"""
AI方舟 - Pydantic 数据模式

用于请求/响应验证
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum


# ============ 认证相关 ============

class UserCreate(BaseModel):
    """用户注册请求"""
    username: str = Field(..., min_length=3, max_length=100, description="用户名")
    email: EmailStr = Field(..., description="邮箱")
    password: str = Field(..., min_length=6, max_length=100, description="密码")


class UserLogin(BaseModel):
    """用户登录请求"""
    username: str = Field(..., description="用户名或邮箱")
    password: str = Field(..., description="密码")


class Token(BaseModel):
    """Token 响应"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 604800  # 7天


class UserResponse(BaseModel):
    """用户信息响应"""
    id: int
    username: str
    email: str
    avatar: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ 工具相关 ============

class ToolCategory(str, Enum):
    """工具分类枚举"""
    GENERAL = "General"
    WRITING = "writing"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    OFFICE = "office"
    AGENTS = "agents"
    CHAT = "chat"
    SEARCH = "search"
    DESIGN = "design"
    LEARNING = "learning"
    MODELS = "models"
    DEV = "dev"


class Pricing(str, Enum):
    """定价类型枚举"""
    FREE = "Free"
    PAID = "Paid"
    FREEMIUM = "Freemium"
    UNKNOWN = "Unknown"


class ToolBase(BaseModel):
    """工具基础信息"""
    name: str = Field(..., max_length=255, description="工具名称")
    description: Optional[str] = None
    url: str = Field(..., max_length=2048, description="官网链接")
    logo: Optional[str] = None
    category: str = Field(default="General", description="分类")
    pricing: Pricing = Field(default=Pricing.UNKNOWN, description="定价类型")
    rating: float = Field(default=3.0, ge=0, le=5, description="评分")
    visits: str = Field(default="0", description="访问量")
    tags: List[str] = Field(default_factory=list, description="标签")


class ToolResponse(ToolBase):
    """工具详情响应"""
    id: int
    source: str
    github_url: Optional[str] = None
    github_stars: int = 0
    
    class Config:
        from_attributes = True


class ToolListResponse(BaseModel):
    """工具列表响应（分页）"""
    tools: List[ToolResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ToolQuery(BaseModel):
    """工具查询参数"""
    q: Optional[str] = Field(None, description="搜索关键词")
    category: Optional[str] = Field(None, description="分类筛选")
    pricing: Optional[str] = Field(None, description="定价筛选")
    sort_by: str = Field(default="rating", description="排序字段")
    sort_order: str = Field(default="desc", description="排序方向")
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


# ============ 分类相关 ============

class CategoryResponse(BaseModel):
    """分类响应"""
    id: int
    name: str
    icon: Optional[str] = None
    description: Optional[str] = None
    count: int = 0  # 该分类下的工具数量
    
    class Config:
        from_attributes = True


# ============ 收藏相关 ============

class FavoriteCreate(BaseModel):
    """添加收藏请求"""
    tool_id: int = Field(..., description="工具ID")
    note: Optional[str] = Field(None, max_length=500, description="备注")


class FavoriteResponse(BaseModel):
    """收藏响应"""
    id: int
    tool_id: int
    note: Optional[str] = None
    created_at: datetime
    tool: Optional[ToolResponse] = None
    
    class Config:
        from_attributes = True


# ============ AI 推荐相关 ============

class RecommendRequest(BaseModel):
    """AI 推荐请求"""
    query: str = Field(..., min_length=2, max_length=500, description="需求描述")
    category: Optional[str] = Field(None, description="偏好分类")
    max_results: int = Field(default=5, ge=1, le=20, description="推荐数量")


class RecommendResponse(BaseModel):
    """AI 推荐响应"""
    recommendations: List[ToolResponse]
    explanation: str = Field(..., description="推荐理由")


# ============ 通用响应 ============

class MessageResponse(BaseModel):
    """通用消息响应"""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """错误响应"""
    detail: str
    error_code: Optional[str] = None
