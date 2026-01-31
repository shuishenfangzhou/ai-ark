#!/usr/bin/env python3
"""
快速生成工具数据文件（跳过logo下载）
"""
import json
import random

# 读取 tools_manager.py 中的 tools_db
# 这里直接复制数据（简化版）

# 生成数据文件
tools_data = []

# 从 tools_manager.py 导入数据
import sys
sys.path.insert(0, '.')
from tools_manager import tools_db

for i, tool in enumerate(tools_db):
    # 确定定价
    pricing = "免费/付费"
    for t in tool['tags']:
        if t in ["免费", "付费", "开源", "免费试用", "待定"]:
            pricing = t
            break
    
    # 生成工具条目
    tool_entry = {
        "id": i + 1,
        "name": tool['name'],
        "category": tool['cat'],
        "desc": tool['desc'],
        "url": tool['url'],
        "tags": tool['tags'],
        "pricing": pricing,
        "visits": f"{random.randint(10, 500)}M+" if tool['name'] in ['ChatGPT', 'Midjourney'] else f"{random.randint(1, 99)}M+",
        "rating": round(random.uniform(4.5, 5.0), 1),
        "logo": f"https://ui-avatars.com/api/?name={tool['name']}&background=random&color=fff&size=128"
    }
    tools_data.append(tool_entry)

# 写入文件
js_content = f"""// ==========================================
// 自动生成的数据文件 - 请勿手动修改
// 生成时间: 2026-01-30
// 工具总数: {len(tools_data)}
// ==========================================
const aiToolsData = {json.dumps(tools_data, indent=4, ensure_ascii=False)};
"""

with open('js/tools_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"[SUCCESS] Generated js/tools_data.js with {len(tools_data)} tools")
