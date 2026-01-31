"""
DeepSeek API 服务 - 语义搜索与工具推荐
使用 DeepSeek Embedding 实现基于向量相似度的智能推荐
与 OpenAI API 兼容
"""

import os
import json
import numpy as np
from typing import List, Dict, Optional
from datetime import datetime

# 尝试导入 OpenAI SDK (DeepSeek 兼容)
try:
    from openai import OpenAI
    OPENAI_SDK_AVAILABLE = True
except ImportError:
    OPENAI_SDK_AVAILABLE = False
    print("⚠️ openai SDK 未安装，将使用模拟模式")


class DeepSeekService:
    """DeepSeek API 服务类 - 提供语义搜索和智能推荐功能"""
    
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY", "")
        self.embedding_model = os.getenv("DEEPSEEK_EMBEDDING_MODEL", "deepseek-embed")
        self.chat_model = os.getenv("DEEPSEEK_CHAT_MODEL", "deepseek-chat")
        self.base_url = "https://api.deepseek.com"
        self.embedding_cache = {}
        
        # 初始化客户端
        if self.api_key and OPENAI_SDK_AVAILABLE:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
            print("✅ DeepSeek API 客户端已初始化")
        else:
            self.client = None
            if not self.api_key:
                print("⚠️ DEEPSEEK_API_KEY 未配置，将使用模拟模式")
            if not OPENAI_SDK_AVAILABLE:
                print("⚠️ openai SDK 未安装，将使用模拟模式")
        
        # 加载工具数据
        self.tools_data = self._load_tools()
    
    def _load_tools(self) -> List[Dict]:
        """加载工具数据"""
        tools_path = os.path.join(
            os.path.dirname(__file__),
            "..", "..", "public", "toolsData.json"
        )
        
        try:
            with open(tools_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get("tools", [])
        except Exception as e:
            print(f"⚠️ 加载工具数据失败: {e}")
            return []
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        生成文本的向量嵌入
        
        Args:
            text: 输入文本 (工具名称 + 描述)
        
        Returns:
            1024 维向量 (DeepSeek embedding)
        """
        # 检查缓存
        cache_key = hash(text)
        if cache_key in self.embedding_cache:
            return self.embedding_cache[cache_key]
        
        if self.client and OPENAI_SDK_AVAILABLE:
            try:
                response = self.client.embeddings.create(
                    model=self.embedding_model,
                    input=text
                )
                embedding = response.data[0].embedding
                
                # 缓存结果
                self.embedding_cache[cache_key] = embedding
                return embedding
                
            except Exception as e:
                print(f"⚠️ DeepSeek Embedding API 错误: {e}")
                # 回退到模拟模式
                return self._mock_embedding(text)
        else:
            # 模拟模式
            return self._mock_embedding(text)
    
    def _mock_embedding(self, text: str) -> List[float]:
        """
        生成模拟嵌入向量 (用于测试)
        基于文本的 hash 生成确定性向量
        """
        np.random.seed(hash(text) % 2**32)
        embedding = np.random.randn(1024).tolist()
        
        # 归一化
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = [x / norm for x in embedding]
        
        # 缓存
        cache_key = hash(text)
        self.embedding_cache[cache_key] = embedding
        
        return embedding
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """计算两个向量的余弦相似度"""
        v1 = np.array(vec1)
        v2 = np.array(vec2)
        
        dot_product = np.dot(v1, v2)
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        
        if norm_v1 == 0 or norm_v2 == 0:
            return 0.0
        
        return float(dot_product / (norm_v1 * norm_v2))
    
    async def semantic_search(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 5,
        min_score: float = 0.3
    ) -> List[Dict]:
        """
        语义搜索工具
        
        Args:
            query: 用户查询
            category: 可选的分类筛选
            top_k: 返回结果数量
            min_score: 最小相似度阈值
        
        Returns:
            排序后的工具列表，包含相似度分数
        """
        if not self.tools_data:
            return []
        
        print(f"🔍 语义搜索: '{query}' (分类: {category or '全部'})")
        
        # 生成查询向量
        query_embedding = await self.generate_embedding(query)
        
        # 计算相似度
        scored_tools = []
        for tool in self.tools_data:
            # 分类筛选
            if category and tool.get("category") != category:
                continue
            
            # 构建工具文本
            tool_text = f"{tool.get('name', '')} {tool.get('desc', '')}"
            if tool.get("tags"):
                tool_text += f" {' '.join(tool['tags'])}"
            
            # 生成工具向量
            tool_embedding = await self.generate_embedding(tool_text)
            
            # 计算相似度
            similarity = self.cosine_similarity(query_embedding, tool_embedding)
            
            if similarity >= min_score:
                scored_tools.append({
                    **tool,
                    "score": round(similarity, 4),
                    "match_reason": self._generate_match_reason(query, tool, similarity)
                })
        
        # 按相似度排序
        scored_tools.sort(key=lambda x: x["score"], reverse=True)
        
        # 返回 top_k
        results = scored_tools[:top_k]
        
        print(f"✅ 找到 {len(results)} 个相关工具")
        
        return results
    
    def _generate_match_reason(self, query: str, tool: Dict, score: float) -> str:
        """生成匹配原因说明"""
        score_percent = int(score * 100)
        
        if score >= 0.7:
            strength = "高度相关"
        elif score >= 0.5:
            strength = "较强相关"
        else:
            strength = "一般相关"
        
        return f"与「{query}」{strength} (匹配度: {score_percent}%)"
    
    async def get_recommendations(
        self,
        user_query: str,
        user_context: Optional[Dict] = None,
        max_recommendations: int = 5
    ) -> Dict:
        """
        获取智能推荐
        
        Args:
            user_query: 用户查询或需求描述
            user_context: 用户上下文 (当前分类、偏好等)
            max_recommendations: 最大推荐数量
        
        Returns:
            推荐结果，包含工具列表和推荐理由
        """
        category = user_context.get("category") if user_context else None
        
        # 执行语义搜索
        recommendations = await self.semantic_search(
            query=user_query,
            category=category,
            top_k=max_recommendations,
            min_score=0.3
        )
        
        # 生成总体推荐理由
        if recommendations:
            top_tool = recommendations[0]
            recommendation_summary = (
                f"基于您的需求「{user_query}」，"
                f"为您推荐以下 {len(recommendations)} 款AI工具，"
                f"第一款「{top_tool['name']}」匹配度高达 {int(top_tool['score'] * 100)}%。"
            )
        else:
            recommendation_summary = (
                f"抱歉，未找到与「{user_query}」高度匹配的工具。"
                "请尝试其他关键词或浏览分类。"
            )
        
        return {
            "query": user_query,
            "recommendations": recommendations,
            "summary": recommendation_summary,
            "total_found": len(recommendations),
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_categories(self) -> List[Dict]:
        """获取分类列表"""
        tools_path = os.path.join(
            os.path.dirname(__file__),
            "..", "..", "public", "toolsData.json"
        )
        
        try:
            with open(tools_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get("categories", [])
        except Exception:
            return []
    
    async def get_tools_by_category(self, category_id: str, limit: int = 50) -> List[Dict]:
        """按分类获取工具"""
        tools = [t for t in self.tools_data if t.get("category") == category_id]
        return tools[:limit]


# 单例实例
_deepseek_service = None

def get_deepseek_service() -> DeepSeekService:
    """获取 DeepSeek 服务单例"""
    global _deepseek_service
    if _deepseek_service is None:
        _deepseek_service = DeepSeekService()
    return _deepseek_service
