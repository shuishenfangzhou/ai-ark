import os
import json
import time
import random
import urllib.request
import ssl
from urllib.parse import urlparse

# --- 配置 ---
DATA_FILE = "js/tools_data.js"
ASSETS_DIR = "assets/logos"
# 模拟的数据源（在真实场景中，这里会是爬虫逻辑）
# 为了演示，我们将生成大量模拟数据，混合真实数据
MOCK_COUNT = 1000 

# 忽略 SSL
ssl._create_default_https_context = ssl._create_unverified_context

# 基础真实数据 (作为种子)
SEED_TOOLS = [
    {"name": "Jasper", "cat": "text", "desc": "专为营销人员设计的AI写作助手。", "url": "https://www.jasper.ai", "tags": ["营销", "付费"]},
    {"name": "Copy.ai", "cat": "text", "desc": "快速生成高质量营销文案。", "url": "https://www.copy.ai", "tags": ["文案", "免费试用"]},
    {"name": "Firefly", "cat": "image", "desc": "Adobe推出的创意生成式AI模型。", "url": "https://firefly.adobe.com", "tags": ["设计", "Adobe"]},
    {"name": "Synthesia", "cat": "video", "desc": "AI视频生成平台，只需输入文本。", "url": "https://www.synthesia.io", "tags": ["数字人", "付费"]},
    {"name": "Murf.ai", "cat": "audio", "desc": "将文本转换为逼真的语音旁白。", "url": "https://murf.ai", "tags": ["配音", "专业"]},
    {"name": "Otter.ai", "cat": "audio", "desc": "AI会议记录与转录工具。", "url": "https://otter.ai", "tags": ["会议", "效率"]},
    {"name": "Beautiful.ai", "cat": "office", "desc": "几分钟内制作精美的演示文稿。", "url": "https://www.beautiful.ai", "tags": ["PPT", "设计"]},
    {"name": "Tome", "cat": "office", "desc": "AI驱动的叙事格式，重塑PPT。", "url": "https://tome.app", "tags": ["PPT", "创新"]},
    {"name": "Tabnine", "cat": "code", "desc": "AI代码补全助手，支持所有IDE。", "url": "https://www.tabnine.com", "tags": ["编程", "补全"]},
    {"name": "Replit Ghostwriter", "cat": "code", "desc": "集成在Replit中的AI编程搭档。", "url": "https://replit.com", "tags": ["云端", "IDE"]},
]

CATEGORIES = ["text", "image", "video", "audio", "code", "office", "search", "agent", "dev", "learn"]
PRICING = ["免费", "付费", "免费试用", "开源"]

def generate_large_dataset():
    print(f"🚀 开始生成 {MOCK_COUNT} 条模拟数据...")
    
    # 1. 读取现有的 tools_data.js 中的数据 (如果有)
    existing_data = []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            content = f.read()
            # 这是一个非常粗糙的解析，假设格式是标准的 `const aiToolsData = [...];`
            start = content.find("[")
            end = content.rfind("]") + 1
            if start != -1 and end != -1:
                existing_data = json.loads(content[start:end])
                print(f"📦 读取到现有数据: {len(existing_data)} 条")
    except Exception as e:
        print(f"⚠️ 无法读取现有数据 (可能是首次运行): {e}")

    final_data = existing_data.copy()
    current_count = len(final_data)
    
    # 2. 生成模拟数据填补剩余空缺
    seed_idx = 0
    while current_count < MOCK_COUNT:
        seed = SEED_TOOLS[seed_idx % len(SEED_TOOLS)]
        
        # 变异生成
        new_id = current_count + 1
        suffix = f" {random.randint(100, 999)}"
        new_name = seed["name"] + suffix
        new_cat = seed["cat"]
        # 随机分配类别以丰富数据
        if random.random() > 0.7:
            new_cat = random.choice(CATEGORIES)
            
        tool_entry = {
            "id": new_id,
            "name": new_name,
            "category": new_cat,
            "desc": seed["desc"] + f" (模拟数据 #{new_id})",
            "url": seed["url"],
            "tags": seed["tags"] + [random.choice(["热门", "新", "推荐"])],
            "pricing": random.choice(PRICING),
            "visits": f"{random.randint(1, 500)}K+",
            "rating": round(random.uniform(3.5, 5.0), 1),
            # 使用 UI Avatars 生成随机颜色头像，避免下载大量图片
            "logo": f"https://ui-avatars.com/api/?name={new_name}&background=random&color=fff&size=128"
        }
        
        final_data.append(tool_entry)
        current_count += 1
        seed_idx += 1

    # 3. 写入文件
    js_content = f"""
// ==========================================
// 自动生成的数据文件 - 包含爬虫抓取/模拟数据
// 生成时间: {time.strftime("%Y-%m-%d %H:%M:%S")}
// 工具总数: {len(final_data)}
// ==========================================
const aiToolsData = {json.dumps(final_data, indent=4, ensure_ascii=False)};
"""
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    print(f"\n✨ 数据生成完毕！已写入 {DATA_FILE}")
    print(f"📊 总计工具: {len(final_data)} 个")

if __name__ == "__main__":
    generate_large_dataset()
