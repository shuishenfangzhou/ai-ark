"""
AI方舟 API 配置管理
使用 Pydantic Settings 管理环境变量
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置类"""
    
    # 应用信息
    APP_NAME: str = "AI方舟 API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "AI工具推荐与API代理服务"
    
    # API 配置
    API_PREFIX: str = "/api"
    API_V1_STR: str = "/api/v1"
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS 配置
    CORS_ORIGINS: list[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]
    
    # Google Gemini API 配置
    GOOGLE_API_KEY: str = ""
    GEMINI_EMBEDDING_MODEL: str = "text-embedding-004"
    GEMINI_CHAT_MODEL: str = "gemini-2.0-flash-exp"
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    
    # 数据配置
    TOOLS_DATA_PATH: str = "../public/toolsData.json"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """获取配置实例（缓存）"""
    return Settings()


# 导出配置实例
settings = get_settings()
