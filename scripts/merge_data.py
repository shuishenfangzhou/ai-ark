#!/usr/bin/env python3
"""
AI工具数据合并脚本
功能: 合并ai-bot.cn抓取的数据与现有数据，保留评分和热度
"""

import json
import os
from typing import List, Dict
from datetime import datetime


def load_json(filepath: str) -> Dict:
    """加载JSON文件"""
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"tools": []}


def save_json(filepath: str, data: Dict):
    """保存JSON文件"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def generate_id(name: str) -> str:
    """根据名称生成ID"""
    import hashlib
    name_lower = name.lower().strip()
    hash_suffix = hashlib.md5(name_lower.encode()).hexdigest()[:8]
    return f"ai-{name_lower.replace(' ', '-').replace('_', '-')}-{hash_suffix}"


def normalize_category(category: str) -> str:
    """标准化分类名称"""
    category_map = {
        'AI写作': 'AI写作',
        'AI图像': 'AI绘画',
        'AI视频': 'AI视频',
        'AI办公': 'AI办公',
        'AI编程': 'AI编程',
        'AI对话': 'AI对话',
        'AI聊天': 'AI对话',
        'AI智能体': 'AI智能体',
        'AI设计': 'AI设计',
        'AI音频': 'AI音频',
        'AI搜索': 'AI搜索',
        'AI开发': 'AI开发',
        'AI学习': 'AI学习',
        'AI模型': 'AI模型',
        'AI检测': 'AI内容检测',
    }
    
    for key, value in category_map.items():
        if key in category:
            return value
    
    return category if category.startswith('AI') else f'AI{category}'


def merge_tools(existing_tools: List[Dict], new_tools: List[Dict]) -> List[Dict]:
    """智能合并新旧数据"""
    
    # 创建现有工具的索引（根据名称和URL）
    existing_by_name = {}
    existing_by_url = {}
    
    for tool in existing_tools:
        name = tool.get('name', '').strip().lower()
        url = tool.get('url', '').strip().lower()
        
        # 清理URL
        url = url.rstrip('/') if url else ''
        
        if name:
            existing_by_name[name] = tool
        if url:
            existing_by_url[url] = tool
    
    print(f"  现有工具索引: {len(existing_by_name)} 个名称, {len(existing_by_url)} 个URL")
    
    merged = []
    merged_names = set()
    merged_urls = set()
    
    for new_tool in new_tools:
        name = new_tool.get('name', '').strip()
        url = new_tool.get('url', '').strip().lower().rstrip('/') if new_tool.get('url') else ''
        
        if not name:
            continue
        
        name_lower = name.lower()
        
        # 尝试通过URL匹配（更准确）
        matched = None
        if url and url in existing_by_url:
            matched = existing_by_url[url]
            print(f"    匹配成功 (URL): {name}")
        
        # 尝试通过名称匹配
        if not matched and name_lower in existing_by_name:
            matched = existing_by_name[name_lower]
            print(f"    匹配成功 (名称): {name}")
        
        if matched:
            # 保留现有字段
            merged_tool = {**new_tool}
            
            # 保留评分和热度
            if matched.get('rating') is not None:
                merged_tool['rating'] = matched['rating']
            if matched.get('popularity') is not None:
                merged_tool['popularity'] = matched['popularity']
            if matched.get('review_count') is not None:
                merged_tool['review_count'] = matched['review_count']
            
            # 保留原始ID
            if matched.get('id'):
                merged_tool['id'] = matched['id']
            else:
                merged_tool['id'] = generate_id(name)
        else:
            # 新工具
            merged_tool = {**new_tool}
            merged_tool['id'] = generate_id(name)
            merged_tool['rating'] = None
            merged_tool['popularity'] = None
        
        # 确保有分类
        if not merged_tool.get('category'):
            merged_tool['category'] = 'AI工具'
        else:
            merged_tool['category'] = normalize_category(merged_tool['category'])
        
        merged.append(merged_tool)
        merged_names.add(name_lower)
        if url:
            merged_urls.add(url)
    
    # 添加现有工具中未被匹配到的
    unmatched = 0
    for tool in existing_tools:
        name = tool.get('name', '').strip().lower()
        url = tool.get('url', '').strip().lower().rstrip('/') if tool.get('url') else ''
        
        if name not in merged_names and url not in merged_urls:
            merged.append(tool)
            unmatched += 1
            if name:
                merged_names.add(name)
            if url:
                merged_urls.add(url)
    
    print(f"  未匹配到的现有工具: {unmatched}")
    
    return merged


def merge_data(
    existing_file: str = "data/tools.json",
    new_file: str = "data/tools_aibot.json",
    output_file: str = "data/tools.json",
    backup: bool = True
):
    """合并数据"""
    
    print("=" * 60)
    print("AI工具数据合并")
    print("=" * 60)
    
    # 备份现有数据
    if backup and os.path.exists(existing_file):
        backup_file = f"{existing_file}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.rename(existing_file, backup_file)
        print(f"已备份现有数据到: {backup_file}")
    
    # 加载现有数据
    print(f"\n加载现有数据: {existing_file}")
    existing_data = load_json(existing_file)
    existing_tools = existing_data.get('tools', [])
    print(f"  现有工具数量: {len(existing_tools)}")
    
    # 加载新数据
    print(f"\n加载新数据: {new_file}")
    new_data = load_json(new_file)
    new_tools = new_data.get('tools', [])
    print(f"  新工具数量: {len(new_tools)}")
    
    # 合并数据
    print("\n合并数据...")
    merged_tools = merge_tools(existing_tools, new_tools)
    
    # 保存结果
    result_data = {
        "version": "3.0",
        "last_updated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "total_count": len(merged_tools),
        "tools": merged_tools
    }
    
    print(f"\n保存合并结果: {output_file}")
    save_json(output_file, result_data)
    
    # 统计信息
    print("\n" + "=" * 60)
    print("合并统计")
    print("=" * 60)
    print(f"  现有工具: {len(existing_tools)}")
    print(f"  新工具: {len(new_tools)}")
    print(f"  合并后: {len(merged_tools)}")
    
    # 统计有logo的工具
    with_logo = sum(1 for t in merged_tools if t.get('logo'))
    print(f"  有logo的工具: {with_logo} ({100*with_logo/len(merged_tools):.1f}%)")
    
    # 统计有评分的工具
    with_rating = sum(1 for t in merged_tools if t.get('rating') is not None)
    print(f"  有评分的工具: {with_rating}")
    
    # 统计分类分布
    categories = {}
    for tool in merged_tools:
        cat = tool.get('category', '未知')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"\n  分类分布:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"    {cat}: {count}")
    
    print("\n" + "=" * 60)
    print("合并完成!")
    print("=" * 60)
    
    return result_data


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='AI工具数据合并')
    parser.add_argument('--existing', type=str, default='data/tools.json', help='现有数据文件')
    parser.add_argument('--new', type=str, default='data/tools_aibot.json', help='新数据文件')
    parser.add_argument('--output', type=str, default='data/tools.json', help='输出文件')
    parser.add_argument('--no-backup', action='store_true', help='不备份现有数据')
    
    args = parser.parse_args()
    
    merge_data(
        existing_file=args.existing,
        new_file=args.new,
        output_file=args.output,
        backup=not args.no_backup
    )


if __name__ == "__main__":
    main()
