"""
AI方舟 - FastAPI 后端主程序

完整 API 包括：
- 用户认证（注册、登录、JWT）
- 工具管理（CRUD、搜索、分页）
- 分类管理
- 收藏功能
- AI 推荐
"""

import math
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import EmailStr

# 本地导入
from database import get_db, engine, Base
from models import User, Tool, Category, Favorite, SearchHistory
from schemas import (
    UserCreate, UserLogin, Token, UserResponse,
    ToolResponse, ToolListResponse, ToolQuery,
    CategoryResponse, FavoriteCreate, FavoriteResponse,
    RecommendRequest, RecommendResponse,
    MessageResponse, ErrorResponse
)

# ============ 配置 ============

# JWT 配置
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# 密码加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 安全方案
security = HTTPBearer()

# 创建数据库表
Base.metadata.create_all(bind=engine)

# ============ 工具函数 ============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建 JWT Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """解码 JWT Token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """获取当前登录用户"""
    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id: int = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


# ============ FastAPI 应用 ============

app = FastAPI(
    title="AI方舟 API",
    description="AI工具导航平台后端 API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ 认证接口 ============

@app.post("/api/v1/auth/register", response_model=Token, summary="用户注册")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查用户名是否存在
    existing_user = db.query(User).filter(
        or_(User.username == user_data.username, User.email == user_data.email)
    ).first()
    if existing_user:
        if existing_user.username == user_data.username:
            raise HTTPException(status_code=400, detail="Username already registered")
        else:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # 创建用户
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 生成 Token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_DAYS * 86400
    }


@app.post("/api/v1/auth/login", response_model=Token, summary="用户登录")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """用户登录"""
    # 查找用户
    user = db.query(User).filter(
        or_(User.username == credentials.username, User.email == credentials.username)
    ).first()
    
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is disabled")
    
    # 生成 Token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_DAYS * 86400
    }


@app.get("/api/v1/auth/me", response_model=UserResponse, summary="获取当前用户")
def get_me(current_user: User = Depends(get_current_user)):
    """获取当前登录用户信息"""
    return current_user


@app.post("/api/v1/auth/refresh", response_model=Token, summary="刷新 Token")
def refresh_token(current_user: User = Depends(get_current_user)):
    """刷新访问 Token"""
    access_token = create_access_token(data={"sub": current_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_DAYS * 86400
    }


# ============ 工具接口 ============

@app.get("/api/v1/tools", response_model=ToolListResponse, summary="获取工具列表")
def get_tools(
    q: Optional[str] = Query(None, description="搜索关键词"),
    category: Optional[str] = Query(None, description="分类筛选"),
    pricing: Optional[str] = Query(None, description="定价筛选"),
    sort_by: str = Query("rating", description="排序字段"),
    sort_order: str = Query("desc", description="排序方向: asc/desc"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """获取工具列表（支持搜索、分页、筛选）"""
    # 构建查询
    query = db.query(Tool)
    
    # 搜索
    if q:
        query = query.filter(
            or_(
                Tool.name.contains(q),
                Tool.description.contains(q),
                Tool.tags.contains(q) if hasattr(Tool, 'tags') else False
            )
        )
    
    # 分类筛选
    if category:
        query = query.filter(Tool.category.has(name=category))
    
    # 定价筛选
    if pricing:
        query = query.filter(Tool.pricing == pricing)
    
    # 排序
    if sort_order == "desc":
        query = query.order_by(getattr(Tool, sort_by).desc())
    else:
        query = query.order_by(getattr(Tool, sort_by).asc())
    
    # 总数
    total = query.count()
    
    # 分页
    offset = (page - 1) * page_size
    tools = query.offset(offset).limit(page_size).all()
    
    # 记录搜索历史（如果已登录）
    if current_user and q:
        search_history = SearchHistory(
            user_id=current_user.id,
            query=q,
            results_count=len(tools)
        )
        db.add(search_history)
        db.commit()
    
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    
    return {
        "tools": tools,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@app.get("/api/v1/tools/{tool_id}", response_model=ToolResponse, summary="获取工具详情")
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    """获取单个工具详情"""
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool


@app.get("/api/v1/categories", response_model=List[CategoryResponse], summary="获取分类列表")
def get_categories(db: Session = Depends(get_db)):
    """获取所有分类"""
    categories = db.query(Category).order_by(Category.sort_order).all()
    
    # 添加工具数量
    result = []
    for cat in categories:
        count = db.query(Tool).filter(Tool.category_id == cat.id).count()
        cat_dict = cat.to_dict()
        cat_dict["count"] = count
        result.append(cat_dict)
    
    return result


# ============ 收藏接口 ============

@app.get("/api/v1/favorites", response_model=List[FavoriteResponse], summary="获取我的收藏")
def get_favorites(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取当前用户的收藏列表"""
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).order_by(Favorite.created_at.desc()).all()
    
    return favorites


@app.post("/api/v1/favorites", response_model=MessageResponse, summary="添加收藏")
def add_favorite(
    fav_data: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """添加工具到收藏"""
    # 检查工具是否存在
    tool = db.query(Tool).filter(Tool.id == fav_data.tool_id).first()
    if tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    # 检查是否已收藏
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.tool_id == fav_data.tool_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tool already in favorites")
    
    # 创建收藏
    favorite = Favorite(
        user_id=current_user.id,
        tool_id=fav_data.tool_id,
        note=fav_data.note
    )
    db.add(favorite)
    db.commit()
    
    return {"message": "Favorite added successfully", "success": True}


@app.delete("/api/v1/favorites/{favorite_id}", response_model=MessageResponse, summary="取消收藏")
def remove_favorite(
    favorite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取消收藏"""
    favorite = db.query(Favorite).filter(
        Favorite.id == favorite_id,
        Favorite.user_id == current_user.id
    ).first()
    
    if favorite is None:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Favorite removed successfully", "success": True}


# ============ AI 推荐接口 ============

@app.post("/api/v1/recommend", response_model=RecommendResponse, summary="AI 工具推荐")
def recommend_tools(
    request: RecommendRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """基于用户需求推荐 AI 工具（简化版，后续可接入 Gemini）"""
    # 简化实现：基于关键词匹配
    # 后续可替换为真正的 AI 推荐（Gemini API）
    
    query = db.query(Tool)
    
    # 简单的关键词匹配
    if request.query:
        search_terms = request.query.lower().split()
        for term in search_terms:
            query = query.filter(
                or_(
                    Tool.name.contains(term),
                    Tool.description.contains(term)
                )
            )
    
    # 分类筛选
    if request.category:
        query = query.filter(Tool.category.has(name=request.category))
    
    # 按评分排序
    tools = query.order_by(Tool.rating.desc()).limit(request.max_results).all()
    
    if not tools:
        # 如果没有匹配，返回热门工具
        tools = db.query(Tool).order_by(Tool.rating.desc()).limit(request.max_results).all()
    
    explanation = f"根据您的需求「{request.query}」，为您推荐以下 {len(tools)} 个 AI 工具："
    
    return {
        "recommendations": tools,
        "explanation": explanation
    }


# ============ 健康检查 ============

@app.get("/health", summary="健康检查")
def health_check():
    """服务健康检查"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/", summary="API 根路径")
def root():
    """API 根路径"""
    return {
        "name": "AI方舟 API",
        "version": "2.0.0",
        "docs": "/docs"
    }


# ============ 启动入口 ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
