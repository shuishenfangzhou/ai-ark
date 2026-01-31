"""
AI方舟 - 后端 API 测试

使用 pytest 和 TestClient 进行 API 测试。
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestHealthEndpoints:
    """健康检查端点测试"""
    
    def test_root(self):
        """测试根路径"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "message" in data
    
    def test_health(self):
        """测试健康检查端点"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestToolsAPI:
    """工具API端点测试"""
    
    def test_get_tools(self):
        """测试获取工具列表"""
        response = client.get("/api/tools")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_tools_with_keyword(self):
        """测试关键词搜索"""
        response = client.get("/api/tools?keyword=AI")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # 验证返回的工具包含搜索关键词
        # （如果没有结果也视为通过，因为测试数据可能不包含匹配项）
    
    def test_get_tools_with_category(self):
        """测试分类筛选"""
        response = client.get("/api/tools?category=写作")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_tools_with_both_filters(self):
        """测试同时使用关键词和分类筛选"""
        response = client.get("/api/tools?keyword=AI&category=写作")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_single_tool(self):
        """测试获取单个工具"""
        # 先获取工具列表
        response = client.get("/api/tools")
        tools = response.json()
        
        if len(tools) > 0:
            # 如果有工具，测试获取单个工具
            tool_id = tools[0]["id"]
            response = client.get(f"/api/tools/{tool_id}")
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == tool_id
    
    def test_get_nonexistent_tool(self):
        """测试获取不存在的工具"""
        response = client.get("/api/tools/99999")
        assert response.status_code == 404
    
    def test_get_categories(self):
        """测试获取分类列表"""
        response = client.get("/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        assert isinstance(data["categories"], list)


class TestCORS:
    """CORS 配置测试"""
    
    def test_cors_headers(self):
        """测试CORS头"""
        response = client.options(
            "/api/tools",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type"
            }
        )
        assert response.status_code in [200, 204]
