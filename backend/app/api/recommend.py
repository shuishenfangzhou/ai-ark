"""
AI推荐接口
提供基于语义的工具推荐服务 (DeepSeek 版本)
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import RecommendRequest, RecommendResponse
from app.services.deepseek import DeepSeekService

router = APIRouter()

# 初始化 DeepSeek 服务
deepseek_service = DeepSeekService()


@router.post("/recommend", response_model=RecommendResponse)
async def recommend_tools(request: RecommendRequest):
    """
    基于语义理解的工具推荐
    
    - **query**: 用户查询描述
    - **category**: 可选的分类筛选
    - **max_results**: 返回结果数量 (1-20)
    """
    try:
        # 调用 DeepSeek 服务进行语义搜索
        results = await deepseek_service.semantic_search(
            query=request.query,
            category=request.category,
            top_k=request.max_results
        )
        
        return RecommendResponse(
            recommendations=results,
            based_on=request.query,
            total_found=len(results)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"推荐服务错误: {str(e)}"
        )


@router.get("/tools")
async def get_tools(category: str = None, limit: int = 50):
    """
    获取工具列表
    
    - **category**: 按分类筛选
    - **limit**: 返回数量限制
    """
    try:
        if category:
            tools = await deepseek_service.get_tools_by_category(
                category_id=category,
                limit=limit
            )
        else:
            tools = deepseek_service.tools_data[:limit]
        return {
            "tools": tools,
            "total": len(tools),
            "category": category
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取工具列表错误: {str(e)}"
        )


@router.get("/categories")
async def get_categories():
    """获取所有可用分类"""
    try:
        categories = await deepseek_service.get_categories()
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取分类错误: {str(e)}"
        )
