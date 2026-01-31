"""
AI方舟 - 数据库模型定义

定义 Tool 表结构，对应 AI工具数据。
"""

from sqlalchemy import Column, Integer, String, Text
from database import Base


class Tool(Base):
    """
    AI工具表模型
    
    字段说明:
        - id: 工具唯一标识
        - name: 工具名称
        - description: 工具简介
        - url: 官网链接
        - category: 分类
        - logo_path: 图片路径
        - tags: 标签（逗号分隔）
    """
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    url = Column(String(2048), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    logo_path = Column(String(512), nullable=True)
    tags = Column(String(512), nullable=True)  # 逗号分隔的标签

    def to_dict(self):
        """转换为字典格式"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "category": self.category,
            "logo_path": self.logo_path,
            "tags": self.tags.split(",") if self.tags else []
        }

    def to_json(self):
        """转换为JSON格式（兼容前端）"""
        return {
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "category": self.category,
            "image": self.logo_path,
            "tags": self.tags.split(",") if self.tags else []
        }
