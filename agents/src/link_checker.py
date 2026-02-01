"""
Dead Link Checker
定期检测 tools.json 中的链接是否有效
"""
import os
import json
import asyncio
import httpx
from typing import List, Dict, Set, Tuple
from datetime import datetime, timedelta
from pathlib import Path


class LinkChecker:
    """死链检测器"""
    
    def __init__(self, timeout: float = 10.0, max_concurrent: int = 10):
        self.timeout = timeout
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.client = httpx.AsyncClient(timeout=timeout, follow_redirects=True)
        
        # 统计信息
        self.stats = {
            "total": 0,
            "alive": 0,
            "dead": 0,
            "redirects": 0,
            "errors": 0,
        }
    
    async def close(self):
        """关闭 HTTP 客户端"""
        await self.client.aclose()
    
    async def check_single(self, url: str, tool_id: str) -> Dict:
        """检测单个链接"""
        async with self.semaphore:
            try:
                response = await self.client.head(url, allow_redirects=True)
                status = response.status_code
                
                if status < 400:
                    # 正常
                    self.stats["alive"] += 1
                    return {
                        "tool_id": tool_id,
                        "url": url,
                        "status": status,
                        "alive": True,
                        "message": "OK",
                    }
                elif 400 <= status < 500:
                    # 客户端错误（404等）
                    self.stats["dead"] += 1
                    return {
                        "tool_id": tool_id,
                        "url": url,
                        "status": status,
                        "alive": False,
                        "message": f"Client Error ({status})",
                    }
                elif 500 <= status < 600:
                    # 服务器错误
                    self.stats["dead"] += 1
                    return {
                        "tool_id": tool_id,
                        "url": url,
                        "status": status,
                        "alive": False,
                        "message": f"Server Error ({status})",
                    }
                else:
                    # 其他
                    self.stats["redirects"] += 1
                    return {
                        "tool_id": tool_id,
                        "url": url,
                        "status": status,
                        "alive": True,
                        "message": f"Redirect/Other ({status})",
                    }
                    
            except httpx.TimeoutException:
                self.stats["dead"] += 1
                return {
                    "tool_id": tool_id,
                    "url": url,
                    "status": None,
                    "alive": False,
                    "message": "Timeout",
                }
            except httpx.TooManyRedirects:
                self.stats["errors"] += 1
                return {
                    "tool_id": tool_id,
                    "url": url,
                    "status": None,
                    "alive": False,
                    "message": "Too Many Redirects",
                }
            except Exception as e:
                self.stats["errors"] += 1
                return {
                    "tool_id": tool_id,
                    "url": url,
                    "status": None,
                    "alive": False,
                    "message": str(e)[:100],
                }
    
    async def check_all(self, tools: List[Dict]) -> Tuple[List[Dict], Dict]:
        """检测所有工具链接
        
        Returns:
            Tuple: (dead_links_list, stats)
        """
        print(f"\n🔍 开始死链检测 ({len(tools)} 个工具)...")
        self.stats["total"] = len(tools)
        
        # 创建任务
        tasks = []
        for tool in tools:
            url = tool.get("url")
            tool_id = tool.get("id")
            if url and tool_id:
                tasks.append(self.check_single(url, tool_id))
        
        # 并发执行
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 整理结果
        dead_links = []
        for result in results:
            if isinstance(result, dict) and not result.get("alive"):
                dead_links.append(result)
        
        print(f"✓ 检测完成: 存活 {self.stats['alive']}, 死亡 {self.stats['dead']}, 错误 {self.stats['errors']}")
        
        return dead_links, self.stats.copy()
    
    def generate_report(self, dead_links: List[Dict], stats: Dict) -> str:
        """生成检测报告"""
        report = []
        report.append("=" * 60)
        report.append("🔗 死链检测报告")
        report.append(f"📅 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("=" * 60)
        report.append("")
        report.append("📊 统计信息")
        report.append(f"  总链接数: {stats['total']}")
        report.append(f"  存活链接: {stats['alive']}")
        report.append(f"  死亡链接: {stats['dead']}")
        report.append(f"  重定向: {stats['redirects']}")
        report.append(f"  错误: {stats['errors']}")
        report.append("")
        
        if dead_links:
            report.append("⚠️ 死亡链接列表")
            report.append("-" * 60)
            for link in dead_links:
                report.append(f"  • {link['tool_id']}")
                report.append(f"    URL: {link['url']}")
                report.append(f"    原因: {link['message']}")
                report.append("")
        else:
            report.append("✅ 没有发现死亡链接！")
        
        report.append("=" * 60)
        
        return "\n".join(report)


async def check_dead_links_main():
    """主函数 - 测试死链检测"""
    # 加载工具数据
    data_file = Path(__file__).parent.parent.parent / 'data' / 'tools.json'
    
    if not data_file.exists():
        print("❌ tools.json 不存在")
        return
    
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    tools = data.get('tools', [])
    
    # 执行检测
    checker = LinkChecker(timeout=10.0, max_concurrent=10)
    dead_links, stats = await checker.check_all(tools)
    await checker.close()
    
    # 生成报告
    report = checker.generate_report(dead_links, stats)
    print(report)
    
    # 保存报告
    report_file = Path(__file__).parent.parent.parent / 'data' / 'link_check_report.txt'
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n📄 报告已保存到: {report_file}")


if __name__ == "__main__":
    asyncio.run(check_dead_links_main())
