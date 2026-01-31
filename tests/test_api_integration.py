"""
AI方舟 - 前端 API 集成测试

使用 Playwright 测试前端与API的集成。
"""

import pytest


@pytest.fixture(scope="module")
def browser_context(playwright):
    """创建浏览器上下文"""
    browser = playwright.chromium.launch()
    context = browser.new_context()
    yield context
    browser.close()


@pytest.fixture
def page(browser_context):
    """创建页面"""
    page = browser_context.new_page()
    yield page


class TestAPILoad:
    """API加载测试"""
    
    def test_api_response_format(self, page):
        """测试API返回正确的数据格式"""
        response = page.request.get("http://localhost:8080/api/tools")
        assert response.status == 200
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            tool = data[0]
            assert "id" in tool
            assert "name" in tool
            assert "description" in tool
            assert "url" in tool
            assert "category" in tool
    
    def test_search_filter(self, page):
        """测试搜索功能"""
        response = page.request.get(
            "http://localhost:8080/api/tools",
            params={"keyword": "AI"}
        )
        assert response.status == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_category_filter(self, page):
        """测试分类筛选功能"""
        response = page.request.get(
            "http://localhost:8080/api/tools",
            params={"category": "写作"}
        )
        assert response.status == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_health_endpoint(self, page):
        """测试健康检查端点"""
        response = page.request.get("http://localhost:8080/health")
        assert response.status == 200
        assert response.json()["status"] == "healthy"


class TestStaticFiles:
    """静态文件测试"""
    
    def test_index_loads(self, page):
        """测试首页加载"""
        response = page.goto("http://localhost:8080/")
        assert response.status == 200
    
    def test_images_accessible(self, page):
        """测试图片资源可访问"""
        # 假设有图片资源
        # 可以根据实际图片路径调整
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
