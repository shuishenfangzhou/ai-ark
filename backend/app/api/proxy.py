"""
API 代理接口
用于代理外部 API 请求，保护 API Key
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter()


class ChatRequest(BaseModel):
    """聊天请求"""
    message: str
    model: str = "gemini-2.0-flash-exp"
    temperature: float = 0.7


class ChatResponse(BaseModel):
    """聊天响应"""
    response: str
    model: str


@router.post("/chat")
async def proxy_chat(request: ChatRequest):
    """
    代理 Gemini API 聊天请求
    保护 API Key 不被前端暴露
    """
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="API Key 未配置"
            )
        
        # 构建 Gemini API 请求
        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{request.model}:generateContent"
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": request.message}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": request.temperature
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{gemini_url}?key={api_key}",
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Gemini API 错误: {response.text}"
                )
            
            data = response.json()
            
            # 提取生成的文本
            generated_text = ""
            if "candidates" in data and len(data["candidates"]) > 0:
                candidate = data["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    for part in candidate["content"]["parts"]:
                        if "text" in part:
                            generated_text += part["text"]
            
            return ChatResponse(
                response=generated_text,
                model=request.model
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"代理请求错误: {str(e)}"
        )


@router.post("/embed")
async def proxy_embedding(text: str):
    """
    代理 Gemini Embedding API
    生成文本向量
    """
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="API Key 未配置"
            )
        
        embedding_url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent"
        
        payload = {
            "content": {
                "parts": [{"text": text}]
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{embedding_url}?key={api_key}",
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Embedding API 错误: {response.text}"
                )
            
            return response.json()
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Embedding 请求错误: {str(e)}"
        )
