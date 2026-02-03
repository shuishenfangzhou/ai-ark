"""
AI方舟 自动体检医生
自动检查网站功能、JavaScript 错误、数据加载情况
"""

import time
import os
import sys
import json
import subprocess
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException

# 配置
LOCAL_URL = "http://localhost:8000"
DATA_FILE = os.path.join("data", "tools.json")


def print_pass(msg):
    print(f"✅ [通过] {msg}")


def print_fail(msg):
    print(f"❌ [失败] {msg}")


def print_warn(msg):
    print(f"⚠️ [警告] {msg}")


def print_info(msg):
    print(f"ℹ️ [信息] {msg}")


def check_file_structure():
    print("\n" + "=" * 60)
    print("--- 1. 检查项目文件结构 ---")
    print("=" * 60)

    required_files = [
        "package.json",
        "astro.config.mjs",
        "src/pages/index.astro",
        "src/layouts/Layout.astro",
        "src/components/Sidebar.astro",
        "src/scripts/main.js",
        "src/styles/global.css",
        "data/tools.json"
    ]

    all_exist = True
    for f in required_files:
        if os.path.exists(f):
            size = os.path.getsize(f)
            print_pass(f"✓ {f} ({size:,} bytes)")
        else:
            print_fail(f"✗ {f} [缺失!]")
            all_exist = False

    return all_exist


def check_data_health():
    print("\n" + "=" * 60)
    print("--- 2. 检查数据健康状况 ---")
    print("=" * 60)

    if not os.path.exists(DATA_FILE):
        print_fail(f"数据文件不存在: {DATA_FILE}")
        return False

    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)

        total = data.get('total_count', 0)
        tools = data.get('tools', [])

        print(f"总工具数: {total}")
        print(f"实际工具数: {len(tools)}")

        if total == 0:
            print_fail("数据为空！需要抓取更多工具数据")
            return False
        elif total < 10:
            print_warn(f"数据量较少 ({total} 条)，建议补充到 100+ 条")
        else:
            print_pass(f"数据量充足 ({total} 条)")

        # 检查数据质量
        if len(tools) > 0:
            sample = tools[0]
            required_fields = ['name', 'description', 'url', 'category']
            missing_fields = [field for field in required_fields if field not in sample]

            if missing_fields:
                print_warn(f"示例数据缺少字段: {missing_fields}")
            else:
                print_pass("数据字段完整")

        return True

    except json.JSONDecodeError as e:
        print_fail(f"JSON 格式错误: {e}")
        return False
    except Exception as e:
        print_fail(f"读取数据失败: {e}")
        return False


def check_server():
    print("\n" + "=" * 60)
    print("--- 3. 检查本地服务器 ---")
    print("=" * 60)

    try:
        response = requests.get(LOCAL_URL, timeout=5)
        print_pass(f"服务器运行正常 (HTTP {response.status_code})")
        return True
    except requests.exceptions.ConnectionError:
        print_fail(f"无法连接到 {LOCAL_URL}")
        print_info("请在另一个终端运行: cd D:\\AI工具箱 && npx astro dev")
        return False
    except Exception as e:
        print_fail(f"服务器检查失败: {e}")
        return False


def start_browser_test():
    print("\n" + "=" * 60)
    print("--- 4. 启动浏览器功能测试 ---")
    print("=" * 60)

    driver = None
    try:
        # 启动 Chrome (无头模式)
        options = webdriver.ChromeOptions()
        options.add_argument('--headless=new')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')

        print("启动 Chrome 浏览器...")
        driver = webdriver.Chrome(options=options)

        # 设置超时
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(10)

        print(f"访问 {LOCAL_URL}...")
        driver.get(LOCAL_URL)
        time.sleep(3)  # 等待页面完全加载

        # 测试 A: 页面标题
        title = driver.title
        if "AI方舟" in title or "AI" in title:
            print_pass(f"页面标题正常: {title}")
        else:
            print_warn(f"页面标题: {title}")

        # 测试 B: 核心元素存在
        elements_to_check = [
            ('header', 'Header'),
            ('sidebar-container', '侧边栏'),
            ('tools-grid', '工具网格'),
            ('page-title', '页面标题'),
            ('global-search', '搜索框'),
        ]

        for selector, name in elements_to_check:
            try:
                if selector.startswith('#'):
                    element = driver.find_element(By.CSS_SELECTOR, selector)
                else:
                    element = driver.find_element(By.ID, selector)
                print_pass(f"{name} ✓")
            except:
                print_fail(f"{name} ✗ (可能影响功能)")

        # 测试 C: 工具卡片加载
        try:
            # 尝试多种选择器
            cards = []
            for selector in ['.tool-card', '[class*="tool-card"]', '.tool-item']:
                try:
                    cards = driver.find_elements(By.CSS_SELECTOR, selector)
                    if cards:
                        break
                except:
                    continue

            if cards:
                print_pass(f"工具卡片加载成功: {len(cards)} 个")
            else:
                print_warn("未找到工具卡片 (可能是数据为空或 CSS 选择器不匹配)")
        except Exception as e:
            print_warn(f"卡片检查异常: {e}")

        # 测试 D: 侧边栏分类按钮
        try:
            categories = driver.find_elements(By.CSS_SELECTOR, '.category-item, #category-nav button')
            print(f"检测到 {len(categories)} 个分类按钮")

            if categories:
                # 点击第一个分类按钮测试
                first_btn = categories[0]
                btn_text = first_btn.text[:20] if first_btn.text else "按钮"
                first_btn.click()
                time.sleep(0.5)
                print_pass(f"点击分类按钮 [{btn_text}...] 正常")
        except Exception as e:
            print_fail(f"分类按钮测试失败: {e}")

        # 测试 E: JavaScript 错误
        console_logs = driver.get_log('browser')
        js_errors = [log for log in console_logs if log.get('level') == 'SEVERE']

        if js_errors:
            print_warn(f"发现 {len(js_errors)} 个 JavaScript 错误:")
            for i, error in enumerate(js_errors[:3], 1):  # 只显示前3个
                msg = error.get('message', 'Unknown error')
                print(f"  {i}. {msg[:100]}...")
        else:
            print_pass("无 JavaScript 严重错误")

        # 测试 F: 图片资源
        try:
            imgs = driver.find_elements(By.TAG_NAME, 'img')
            broken_imgs = []

            for img in imgs[:10]:  # 检查前10张
                src = img.get_attribute('src') or ''
                # 检查图片是否加载成功
                is_broken = driver.execute_script("""
                    var img = arguments[0];
                    return !img.complete || img.naturalWidth === 0;
                """, img)

                if is_broken and src:
                    broken_imgs.append(src.split('/')[-1] if '/' in src else src)

            if broken_imgs:
                print_warn(f"发现 {len(broken_imgs)} 张损坏图片: {broken_imgs[:3]}")
            else:
                print_pass("图片资源正常")
        except Exception as e:
            print_warn(f"图片检查跳过: {e}")

        print("\n" + "=" * 60)
        print("测试完成!")
        print("=" * 60)

        # 返回测试结果摘要
        return True

    except WebDriverException as e:
        print_fail(f"浏览器测试失败: {e}")
        print_info("建议安装 Chrome: https://www.google.com/chrome/")
        return False
    except Exception as e:
        print_fail(f"测试过程出错: {e}")
        return False
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass


def generate_health_report(results):
    print("\n" + "=" * 60)
    print("--- 健康报告 ---")
    print("=" * 60)

    score = 0
    max_score = 5

    if results.get('files'): score += 1
    if results.get('data'): score += 1
    if results.get('server'): score += 1
    if results.get('browser'): score += 1

    print(f"健康评分: {score}/{max_score}")

    if score >= 4:
        print_pass("🎉 网站状态优秀!")
    elif score >= 3:
        print_warn("⚠️ 网站有小问题，需要修复")
    else:
        print_fail("🔧 网站需要大修")

    print("\n建议操作:")
    if not results.get('data'):
        print("  1. 运行 get_real_data.py 补充工具数据")
    if not results.get('server'):
        print("  2. 启动本地服务器: npx astro dev")
    if not results.get('browser'):
        print("  3. 安装 Selenium: pip install selenium")
    if score >= 4:
        print("  ✓ 网站已就绪，可以正常使用!")


if __name__ == "__main__":
    print("🚀 AI方舟 自动体检医生 v1.0")
    print("=" * 60)

    results = {
        'files': check_file_structure(),
        'data': check_data_health(),
        'server': check_server(),
        'browser': False
    }

    if results['files'] and results['server']:
        results['browser'] = start_browser_test()

    generate_health_report(results)
