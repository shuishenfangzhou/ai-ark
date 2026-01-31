"""
AI方舟 - 完整数据库模型定义

包含：用户、工具、分类、收藏、搜索历史
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, 
    ForeignKey, UniqueConstraint, Index, Float
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """用户表"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # 关系
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    search_history = relationship("SearchHistory", back_populates="user", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "avatar": self.avatar,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Category(Base):
    """分类表"""
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50), nullable=True)  # 图标 emoji 或 CSS 类
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # 关系
    tools = relationship("Tool", back_populates="category", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "description": self.description,
            "sort_order": self.sort_order,
        }


class Tool(Base):
    """AI工具表"""
    __tablename__ = "tools"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    url = Column(String(2048), nullable=False)
    logo = Column(String(512), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    pricing = Column(String(50), default="Unknown", nullable=False)  # Free, Paid, Freemium
    rating = Column(Float, default=3.0, nullable=False)
    visits = Column(String(50), default="0", nullable=False)  # 存储字符串如 "100K+"
    source = Column(String(100), default="manual", nullable=False)  # 来源: ai-bot.cn, github.com, manual
    
    # GitHub 特有字段
    github_url = Column(String(2048), nullable=True)
    github_stars = Column(Integer, default=0, nullable=False)
    github_forks = Column(Integer, default=0, nullable=False)
    github_language = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # 关系
    category = relationship("Category", back_populates="tools")
    favorited_by = relationship("Favorite", back_populates="tool", cascade="all, delete-orphan")
    
    # 索引
    __table_args__ = (
        Index("ix_tools_category_name", "category_id", "name"),
        Index("ix_tools_pricing", "pricing"),
        Index("ix_tools_source", "source"),
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "logo": self.logo,
            "category_id": self.category_id,
            "pricing": self.pricing,
            "rating": self.rating,
            "visits": self.visits,
            "source": self.source,
            "github_url": self.github_url,
            "github_stars": self.github_stars,
        }
    
    def to_json(self):
        """兼容前端格式"""
        return {
            "id": self.id,
            "name": self.name,
            "desc": self.description,
            "url": self.url,
            "logo": self.logo,
            "category": self.category.name if self.category else "General",
            "pricing": self.pricing,
            "rating": self.rating,
            "visits": self.visits,
            "source": self.source,
        }


class Favorite(Base):
    """收藏表"""
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tool_id = Column(Integer, ForeignKey("tools.id", ondelete="CASCADE"), nullable=False, index=True)
    note = Column(String(500), nullable=True)  # 用户备注
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # 唯一约束
    __table_args__ = (
        UniqueConstraint("user_id", "tool_id", name="uq_user_tool"),
    )
    
    # 关系
    user = relationship("User", back_populates="favorites")
    tool = relationship("Tool", back_populates="favorited_by")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tool_id": self.tool_id,
            "note": self.note,
            "tool": self.tool.to_dict() if self.tool else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class SearchHistory(Base):
    """搜索历史表"""
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    query = Column(String(500), nullable=False)
    results_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # 关系
    user = relationship("User", back_populates="search_history")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "query": self.query,
            "results_count": self.results_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
