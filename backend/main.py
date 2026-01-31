"""
AI方舟 - FastAPI 主程序

提供 AI工具列表 API，支持搜索和分类筛选。
"""

import os
import json
from typing import Optional, List
from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db, init_db
from models import Tool

app = FastAPI(
    title="AI方舟 API",
    description="AI工具导航平台后端API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """启动时初始化数据库表"""
    init_db()
    print("AI方舟 API 启动成功！")


@app.get("/")
async def root():
    """根路径健康检查"""
    return {
        "status": "ok",
        "message": "AI方舟 API 运行中",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """健康检查端点"""
    return {"status": "healthy"}


@app.get("/api/tools", response_model=List[dict])
async def get_tools(
    keyword: Optional[str] = Query(
        None,
        description="搜索关键词（模糊搜索名称和描述）",
        min_length=1
    ),
    category: Optional[str] = Query(
        None,
        description="精确筛选分类"
    ),
    db: Session = Depends(get_db)
):
    """
    获取 AI 工具列表
    
    支持两种筛选方式：
    - keyword: 模糊搜索工具名称和描述
    - category: 按分类精确筛选
    
    优先级：如果同时提供 keyword 和 category，先按 category 筛选，再在结果中搜索
    """
    try:
        # 基础查询
        query = db.query(Tool)
        
        # 分类筛选
        if category:
            query = query.filter(Tool.category == category)
        
        # 关键词搜索
        if keyword:
            search_term = f"%{keyword}%"
            query = query.filter(
                (Tool.name.like(search_term)) | 
                (Tool.description.like(search_term))
            )
        
        # 执行查询并限制结果数量
        tools = query.limit(100).all()
        
        # 转换为字典格式
        return [tool.to_dict() for tool in tools]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"数据库查询失败: {str(e)}"
        )


@app.get("/api/categories")
async def get_categories(db: Session = Depends(get_db)):
    """获取所有分类列表"""
    try:
        categories = db.query(Tool.category).distinct().all()
        return {
            "categories": [cat[0] for cat in categories if cat[0]]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取分类失败: {str(e)}"
        )


@app.get("/api/tools/{tool_id}")
async def get_tool(tool_id: int, db: Session = Depends(get_db)):
    """根据ID获取单个工具详情"""
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="工具不存在")
    return tool.to_dict()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
