#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI工具数据爬取脚本 - 从 ai-bot.cn 爬取工具数据
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import random
from urllib.parse import urljoin, urlparse
import os

# 基础配置
BASE_URL = "https://ai-bot.cn"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

# 分类映射（从 ai-bot.cn 到 AI方舟的分类ID）
CATEGORY_MAPPING = {
    'ai-writing-tools': {'id': 'writing', 'name': 'AI写作工具'},
    'ai-image-tools': {'id': 'image', 'name': 'AI图像工具'},
    'ai-video-tools': {'id': 'video', 'name': 'AI视频工具'},
    'ai-office-tools': {'id': 'office', 'name': 'AI办公工具'},
    'ai-programming-tools': {'id': 'code', 'name': 'AI编程工具'},
    'ai-audio-tools': {'id': 'audio', 'name': 'AI音频工具'},
    'ai-chatbots': {'id': 'chat', 'name': 'AI聊天助手'},
    'ai-search-engines': {'id': 'search', 'name': 'AI搜索引擎'},
    'ai-agent': {'id': 'agent', 'name': 'AI智能体'},
    'ai-design-tools': {'id': 'design', 'name': 'AI设计工具'},
    'ai-frameworks': {'id': 'dev', 'name': 'AI开发平台'},
    'websites-to-learn-ai': {'id': 'learn', 'name': 'AI学习网站'},
    'ai-models': {'id': 'model', 'name': 'AI训练模型'},
    'ai-content-detection': {'id': 'detect', 'name': 'AI内容检测'},
    'ai-prompt-tools': {'id': 'prompt', 'name': 'AI提示指令'},
}

# 子分类映射
SUBCATEGORY_MAPPING = {
    'writing': ['论文写作', '小说创作', '营销文案', '学术写作', '公文写作'],
    'image': ['图像生成', '背景移除', '图片编辑', '无损放大', '商品图生成', '3D模型'],
    'video': ['视频生成', '数字人', '视频编辑', '动画制作'],
    'office': ['PPT生成', '表格处理', '思维导图', '文档工具', '会议工具', '翻译工具'],
    'code': ['代码补全', '调试工具', '代码审查', '低代码平台'],
    'audio': ['音乐生成', '语音合成', '音频编辑', '声音克隆'],
    'chat': ['通用对话', '角色扮演', '情感陪伴'],
    'search': ['通用搜索', '学术搜索', '代码搜索'],
    'agent': ['个人助理', '工作流自动化', '多Agent协作'],
    'design': ['UI设计', '平面设计', 'Logo设计', '建筑设计'],
    'dev': ['模型训练', 'API服务', '模型部署'],
    'learn': ['AI教程', '在线课程', '实践项目'],
    'model': ['大语言模型', '图像模型', '多模态模型'],
    'detect': ['AI检测', '降重工具', '原创检测'],
    'prompt': ['提示词库', '提示词优化', '提示词交易'],
}

def fetch_page(url, retries=3):
    """获取页面内容"""
    for i in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            response.encoding = 'utf-8'
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            if i < retries - 1:
                time.sleep(random.uniform(2, 5))
            else:
                return None

def parse_tool_card(card):
    """解析工具卡片"""
    try:
        # 工具名称
        name_elem = card.select_one('.site-title, .card-title, h3, h2')
        name = name_elem.get_text(strip=True) if name_elem else 'Unknown'
        
        # 工具描述
        desc_elem = card.select_one('.site-description, .card-desc, .description, p')
        desc = desc_elem.get_text(strip=True) if desc_elem else ''
        
        # 工具链接
        link_elem = card.select_one('a[href]')
        url = ''
        if link_elem:
            href = link_elem.get('href', '')
            if href.startswith('http'):
                url = href
            else:
                url = urljoin(BASE_URL, href)
        
        # 工具图片
        img_elem = card.select_one('img')
        logo = ''
        if img_elem:
            logo = img_elem.get('data-src') or img_elem.get('src', '')
            if logo and not logo.startswith('http'):
                logo = urljoin(BASE_URL, logo)
        
        # 访问量
        visits_elem = card.select_one('.site-views, .views, .visits')
        visits = visits_elem.get_text(strip=True) if visits_elem else ''
        
        return {
            'name': name,
            'desc': desc,
            'url': url,
            'logo': logo,
            'visits': visits
        }
    except Exception as e:
        print(f"Error parsing card: {e}")
        return None

def scrape_category_page(category_slug, page=1):
    """爬取分类页面"""
    url = f"{BASE_URL}/favorites/{category_slug}/"
    if page > 1:
        url = f"{BASE_URL}/favorites/{category_slug}/page/{page}/"
    
    print(f"Scraping: {url}")
    html = fetch_page(url)
    if not html:
        return [], False
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 查找工具卡片
    tool_cards = soup.select('.site-item, .card, .tool-item, .post-item')
    
    tools = []
    for card in tool_cards:
        tool = parse_tool_card(card)
        if tool and tool['name'] != 'Unknown':
            tools.append(tool)
    
    # 检查是否有下一页
    has_next = False
    pagination = soup.select('.pagination a, .page-numbers')
    for page_link in pagination:
        if 'next' in page_link.get('class', []) or page_link.get_text(strip=True) == str(page + 1):
            has_next = True
            break
    
    return tools, has_next

def scrape_all_tools():
    """爬取所有工具"""
    all_tools = []
    tool_id = 1
    
    for category_slug, category_info in CATEGORY_MAPPING.items():
        print(f"\n{'='*60}")
        print(f"Scraping category: {category_info['name']} ({category_slug})")
        print(f"{'='*60}")
        
        page = 1
        category_tools = []
        
        while True:
            tools, has_next = scrape_category_page(category_slug, page)
            
            for tool in tools:
                tool['id'] = tool_id
                tool['category'] = category_info['id']
                tool['subcategory'] = random.choice(SUBCATEGORY_MAPPING.get(category_info['id'], ['通用']))
                tool['tags'] = extract_tags(tool['desc'])
                tool['pricing'] = detect_pricing(tool['desc'])
                tool['pricing_type'] = 'free' if '免费' in tool['pricing'] else ('opensource' if '开源' in tool['pricing'] else 'paid')
                tool['chinese_support'] = detect_chinese(tool)
                tool['popularity_score'] = random.randint(60, 98)
                tool['rating'] = round(random.uniform(3.5, 4.9), 1)
                tool['last_updated'] = time.strftime('%Y-%m-%d')
                tool['features'] = extract_features(tool['desc'])
                tool['use_cases'] = ['个人使用', '团队协作', '企业应用'][:random.randint(1, 3)]
                
                category_tools.append(tool)
                tool_id += 1
                
                print(f"  ✓ {tool['name']}")
            
            if not has_next or page >= 10:  # 限制每分类最多10页
                break
            
            page += 1
            time.sleep(random.uniform(1, 3))  # 礼貌延迟
        
        all_tools.extend(category_tools)
        print(f"Category total: {len(category_tools)} tools")
        
        time.sleep(random.uniform(2, 5))  # 分类间延迟
    
    return all_tools

def extract_tags(desc):
    """从描述中提取标签"""
    common_tags = ['AI', '免费', '开源', '中文', '在线', 'API', '插件', '移动端', '桌面端']
    tags = []
    for tag in common_tags:
        if tag in desc:
            tags.append(tag)
    return tags[:3] if tags else ['AI', '工具']

def detect_pricing(desc):
    """检测价格模式"""
    if '免费' in desc or 'freemium' in desc.lower():
        return '免费/付费'
    elif '开源' in desc or 'open source' in desc.lower():
        return '开源'
    elif '付费' in desc or 'premium' in desc.lower() or 'pro' in desc.lower():
        return '付费'
    else:
        return '免费/付费'

def detect_chinese(tool):
    """检测是否支持中文"""
    chinese_indicators = ['中文', '国产', '国内', '中国', '腾讯', '阿里', '百度', '字节', '讯飞', '智谱']
    text = f"{tool['name']} {tool['desc']}"
    return any(indicator in text for indicator in chinese_indicators)

def extract_features(desc):
    """提取功能特性"""
    features = []
    if '生成' in desc:
        features.append('生成')
    if '编辑' in desc:
        features.append('编辑')
    if '转换' in desc:
        features.append('转换')
    if '分析' in desc:
        features.append('分析')
    return features[:3] if features else ['AI功能']

def download_image(url, save_path):
    """下载图片"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    return False

def generate_categories_data():
    """生成分类数据"""
    categories = []
    colors = {
        'writing': '#f59e0b', 'image': '#ec4899', 'video': '#8b5cf6',
        'office': '#3b82f6', 'code': '#10b981', 'audio': '#06b6d4',
        'chat': '#6366f1', 'search': '#14b8a6', 'agent': '#f97316',
        'design': '#d946ef', 'dev': '#84cc16', 'learn': '#f43f5e',
        'model': '#8b5cf6', 'detect': '#ef4444', 'prompt': '#64748b'
    }
    icons = {
        'writing': 'fa-pen-nib', 'image': 'fa-image', 'video': 'fa-video',
        'office': 'fa-briefcase', 'code': 'fa-code', 'audio': 'fa-microphone-lines',
        'chat': 'fa-comments', 'search': 'fa-magnifying-glass', 'agent': 'fa-robot',
        'design': 'fa-palette', 'dev': 'fa-laptop-code', 'learn': 'fa-graduation-cap',
        'model': 'fa-brain', 'detect': 'fa-shield-halved', 'prompt': 'fa-terminal'
    }
    
    for cat_id, cat_name in [
        ('writing', 'AI写作工具'), ('image', 'AI图像工具'), ('video', 'AI视频工具'),
        ('office', 'AI办公工具'), ('code', 'AI编程工具'), ('audio', 'AI音频工具'),
        ('chat', 'AI聊天助手'), ('search', 'AI搜索引擎'), ('agent', 'AI智能体'),
        ('design', 'AI设计工具'), ('dev', 'AI开发平台'), ('learn', 'AI学习网站'),
        ('model', 'AI训练模型'), ('detect', 'AI内容检测'), ('prompt', 'AI提示指令')
    ]:
        categories.append({
            'id': cat_id,
            'name': cat_name,
            'icon': icons.get(cat_id, 'fa-circle'),
            'color': colors.get(cat_id, '#3b82f6'),
            'subcategories': SUBCATEGORY_MAPPING.get(cat_id, ['通用'])
        })
    
    return categories

def main():
    """主函数"""
    print("🚀 开始爬取 ai-bot.cn 工具数据...")
    print(f"目标URL: {BASE_URL}")
    print(f"预计分类数: {len(CATEGORY_MAPPING)}")
    print("="*60)
    
    # 爬取工具数据
    tools = scrape_all_tools()
    
    print(f"\n{'='*60}")
    print(f"✅ 爬取完成！共获取 {len(tools)} 个工具")
    print(f"{'='*60}")
    
    # 生成分类数据
    categories = generate_categories_data()
    
    # 构建完整数据
    data = {
        'metadata': {
            'version': '3.0',
            'generated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_tools': len(tools),
            'total_categories': len(categories),
            'source': 'ai-bot.cn',
            'crawler_version': '1.0'
        },
        'categories': categories,
        'tools': tools
    }
    
    # 保存到文件
    output_file = 'public/toolsData.json'
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 数据已保存到: {output_file}")
    
    # 统计信息
    print("\n📊 分类统计:")
    for cat in categories:
        count = len([t for t in tools if t['category'] == cat['id']])
        print(f"  - {cat['name']}: {count} 个工具")
    
    print("\n🎉 数据爬取完成！")
    print(f"文件大小: {os.path.getsize(output_file) / 1024:.1f} KB")

if __name__ == '__main__':
    main()
