"""
AI方舟 API - Pydantic 模型定义
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Tool(BaseModel):
    """AI工具数据模型"""
    id: int = Field(..., description="工具唯一标识")
    name: str = Field(..., description="工具名称")
    desc: str = Field(..., description="工具描述")
    category: str = Field(..., description="工具分类")
    subcategory: Optional[str] = Field(None, description="子分类")
    url: str = Field(..., description="工具官网链接")
    logo: str = Field(..., description="工具Logo URL")
    tags: List[str] = Field(default=[], description="工具标签")
    pricing: str = Field(default="Freemium", description="定价模式")
    pricing_type: Optional[str] = Field(None, description="价格类型: free/freemium/paid")
    rating: float = Field(default=4.5, ge=0, le=5, description="评分")
    visits: str = Field(default="N/A", description="访问量")
    chinese_support: bool = Field(default=False, description="是否支持中文")
    features: Optional[List[str]] = Field(default=[], description="核心功能")
    use_cases: Optional[List[str]] = Field(default=[], description="适用场景")
    last_updated: Optional[str] = Field(None, description="最后更新日期")
    popularity_score: Optional[float] = Field(None, description="热度评分")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "ChatGPT",
                "desc": "OpenAI推出的AI对话助手",
                "category": "chat",
                "url": "https://chat.openai.com",
                "logo": "https://example.com/logo.png",
                "tags": ["AI", "对话", "写作"],
                "pricing": "Freemium",
                "rating": 4.8,
                "visits": "100M+"
            }
        }


class RecommendRequest(BaseModel):
    """AI推荐请求模型"""
    query: str = Field(..., min_length=1, max_length=500, description="用户查询")
    category: Optional[str] = Field(None, description="分类筛选")
    max_results: int = Field(default=5, ge=1, le=20, description="返回结果数量")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "AI写作工具",
                "category": "writing",
                "max_results": 5
            }
        }


class RecommendResponse(BaseModel):
    """AI推荐响应模型"""
    recommendations: List[dict] = Field(..., description="推荐工具列表")
    based_on: str = Field(..., description="基于的查询")
    total_found: int = Field(default=0, description="找到的工具总数")
    
    class Config:
        json_schema_extra = {
            "example": {
                "recommendations": [],
                "based_on": "AI写作工具",
                "total_found": 10
            }
        }


class HealthResponse(BaseModel):
    """健康检查响应"""
    status: str = Field(..., description="服务状态")
    version: str = Field(..., description="API版本")
    service: str = Field(..., description="服务名称")
    timestamp: Optional[str] = Field(None, description="检查时间")


class ErrorResponse(BaseModel):
    """错误响应模型"""
    error: str = Field(..., description="错误信息")
    detail: Optional[str] = Field(None, description="详细错误")
    status_code: int = Field(..., description="HTTP状态码")
