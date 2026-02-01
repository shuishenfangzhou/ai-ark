"""
DeepSeek LLM Integration
使用 DeepSeek API 作为 Agent 的推理引擎
"""
import os
import json
from typing import Optional, List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class DeepSeekLLM:
    """DeepSeek 语言模型封装"""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "deepseek-chat"):
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY")
        self.model = model
        self.base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
        
        if not self.api_key:
            raise ValueError("DeepSeek API Key 未配置，请设置 DEEPSEEK_API_KEY 环境变量")
        
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )
    
    def chat(self, messages: List[Dict[str, str]], 
             temperature: float = 0.7,
             max_tokens: int = 2000) -> str:
        """
        发送对话请求
        
        Args:
            messages: 对话消息列表 [{role: "user", content: "..."}]
            temperature: 温度参数 (0-1)
            max_tokens: 最大输出 tokens
        
        Returns:
            AI 生成的文本内容
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"DeepSeek API 调用失败: {e}")
            return ""
    
    def analyze_tool(self, tool_info: Dict[str, Any], 
                     context: str = "") -> Dict[str, Any]:
        """
        分析并丰富工具信息
        
        Args:
            tool_info: 原始工具信息
            context: 额外的上下文信息
        
        Returns:
            丰富后的工具信息
        """
        prompt = f"""
你是一个专业的 AI 工具分析师。请分析以下工具信息，并将其整理成标准格式。

## 原始信息
{json.dumps(tool_info, ensure_ascii=False, indent=2)}

## 上下文
{context}

## 任务要求
1. 为工具生成一个简短有力的描述（50字以内）
2. 提取 3-5 个核心功能标签
3. 判断定价模式 (free/paid/freemium/opensource)
4. 判断主要分类 (AI写作/AI绘画/AI视频/AI音频/AI办公/AI编程/AI对话/AI搜索/AI代理/AI设计/AI学习/AI模型)
5. 评估功能完整性，给出 1-5 的评分

## 输出格式
请直接输出 JSON 格式，不要包含其他文字：
{{
  "description": "简短描述",
  "tags": ["标签1", "标签2", "标签3"],
  "pricing": "free/paid/freemium/opensource",
  "category": "主分类",
  "rating": 4.5
}}
"""
        
        response = self.chat([
            {"role": "system", "content": "你是一个专业的 AI 工具分析助手，擅长提取关键信息并结构化输出。"},
            {"role": "user", "content": prompt}
        ])
        
        try:
            # 尝试解析 JSON
            result = json.loads(response)
            return {
                **tool_info,
                "description": result.get("description", tool_info.get("description", "")),
                "tags": result.get("tags", []),
                "pricing": result.get("pricing", "free"),
                "category": result.get("category", "AI工具"),
                "rating": result.get("rating", 3.0),
            }
        except json.JSONDecodeError:
            # 解析失败，返回原始信息
            return tool_info
    
    def batch_analyze(self, tools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        批量分析工具
        
        Args:
            tools: 工具信息列表
        
        Returns:
            丰富后的工具信息列表
        """
        results = []
        for tool in tools:
            result = self.analyze_tool(tool)
            results.append(result)
            print(f"✓ 分析完成: {tool.get('name', 'Unknown')}")
        return results


# 测试代码
if __name__ == "__main__":
    try:
        llm = DeepSeekLLM()
        
        test_tool = {
            "name": "ChatGPT",
            "url": "https://chat.openai.com",
            "description": "OpenAI 开发的对话式 AI 助手"
        }
        
        result = llm.analyze_tool(test_tool, "这是一个知名的 AI 对话工具")
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except ValueError as e:
        print(f"配置错误: {e}")
        print("请设置 DEEPSEEK_API_KEY 环境变量")
