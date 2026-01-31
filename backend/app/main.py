"""
AI方舟 API - FastAPI 应用入口
提供 AI 工具推荐与 API 代理服务
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 创建 FastAPI 应用实例
app = FastAPI(
    title="AI方舟 API",
    description="AI工具推荐与API代理服务",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 配置 - 允许所有来源（生产环境应限制）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 健康检查端点
@app.get("/health")
async def health_check():
    """服务健康检查"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "ai-ark-api"
    }

# 根路径
@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "欢迎使用 AI方舟 API",
        "docs": "/docs",
        "health": "/health"
    }

# 注册 API 路由
from app.api import recommend, proxy

app.include_router(recommend.router, prefix="/api")
app.include_router(proxy.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
