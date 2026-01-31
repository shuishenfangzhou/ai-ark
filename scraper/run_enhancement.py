#!/usr/bin/env python3
"""
快速运行数据扩容脚本
测试增强功能，生成示例数据
"""
import json
import random
import time
from datetime import datetime, timedelta

def generate_enhanced_sample_data():
    """生成增强的示例数据用于测试"""
    
    # 基础分类
    categories = {
        "text": "AI写作工具",
        "image": "AI图像工具", 
        "video": "AI视频工具",
        "audio": "AI音频工具",
        "code": "AI编程工具",
        "office": "AI办公工具",
        "search": "AI搜索引擎",
        "design": "AI设计工具",
        "agent": "AI智能体",
        "platform": "AI开发平台",
        "learn": "AI学习网站",
        "model": "AI训练模型",
        "detect": "AI内容检测",
        "prompt": "AI提示指令",
        "data": "AI数据工具"
    }
    
    # 示例工具数据 (扩展到500+)
    sample_tools = []
    
    # 热门工具
    hot_tools = [
        {"name": "ChatGPT", "cat": "text", "desc": "OpenAI的划时代产品，GPT-4o最强模型，全能AI助手。", "url": "https://chat.openai.com/", "tags": ["对话", "全能", "付费"], "hot": True},
        {"name": "Claude", "cat": "text", "desc": "Anthropic出品，代码与逻辑能力超越GPT-4，长文本处理强。", "url": "https://claude.ai/", "tags": ["代码", "长文本", "付费"], "hot": True},
        {"name": "Midjourney", "cat": "image", "desc": "目前生成质量最高的AI绘画工具，艺术感强。", "url": "https://www.midjourney.com/", "tags": ["艺术", "绘画", "付费"], "hot": True},
        {"name": "GitHub Copilot", "cat": "code", "desc": "最流行的AI编程助手，自动补全代码，支持多种语言。", "url": "https://github.com/features/copilot", "tags": ["编程", "微软", "付费"], "hot": True},
        {"name": "Notion AI", "cat": "office", "desc": "集成在Notion中的AI，润色、总结、翻译、写作。", "url": "https://www.notion.so/", "tags": ["笔记", "办公", "付费"], "hot": True},
    ]
    
    # 国产工具
    chinese_tools = [
        {"name": "DeepSeek", "cat": "text", "desc": "深度求索开源模型，推理能力极其强大，支持代码生成和数学推理。", "url": "https://www.deepseek.com/", "tags": ["开源", "国产", "免费", "代码"]},
        {"name": "Kimi智能助手", "cat": "text", "desc": "月之暗面出品，支持200万字超长上下文，文件分析能力强。", "url": "https://kimi.moonshot.cn/", "tags": ["长文本", "文件分析", "免费", "国产"]},
        {"name": "豆包", "cat": "text", "desc": "字节跳动出品，语音交互体验极佳，支持多模态理解。", "url": "https://www.doubao.com/", "tags": ["语音", "日常", "免费", "国产"]},
        {"name": "通义千问", "cat": "text", "desc": "阿里全能型大模型，支持图片理解和文档分析，中文能力强。", "url": "https://tongyi.aliyun.com/", "tags": ["全能", "阿里", "免费", "国产"]},
        {"name": "文心一言", "cat": "text", "desc": "百度推出的知识增强大语言模型，中文知识问答能力强。", "url": "https://yiyan.baidu.com/", "tags": ["百度", "知识", "免费", "国产"]},
        {"name": "即梦AI", "cat": "image", "desc": "字节跳动推出的AI绘画与视频生成平台，效果出色。", "url": "https://jimeng.jianying.com/", "tags": ["绘画", "视频", "免费", "国产"]},
        {"name": "可灵AI", "cat": "video", "desc": "快手推出的AI视频生成工具，效果惊艳，支持长视频。", "url": "https://klingai.com/", "tags": ["视频", "快手", "免费", "国产"]},
        {"name": "秘塔AI搜索", "cat": "search", "desc": "无广告的AI学术搜索，自动生成摘要，信息准确。", "url": "https://metaso.cn/", "tags": ["搜索", "学术", "免费", "国产"]},
    ]
    
    # 生成更多工具数据
    def generate_tool_variants():
        """生成工具变体"""
        base_names = [
            "AI助手", "智能工具", "创作平台", "生成器", "编辑器", "分析器", 
            "优化器", "转换器", "检测器", "管理器", "设计师", "写手",
            "画师", "剪辑师", "翻译官", "顾问", "专家", "大师"
        ]
        
        prefixes = [
            "智能", "超级", "专业", "高级", "极速", "精准", "全能", "强大",
            "便捷", "高效", "创新", "领先", "顶级", "卓越", "完美", "神奇"
        ]
        
        domains = [
            "办公", "创作", "设计", "编程", "营销", "教育", "医疗", "金融",
            "电商", "游戏", "社交", "新闻", "娱乐", "旅游", "美食", "健康"
        ]
        
        tools = []
        for i in range(200):  # 生成200个变体工具
            prefix = random.choice(prefixes)
            domain = random.choice(domains)
            base_name = random.choice(base_names)
            
            name = f"{prefix}{domain}{base_name}"
            category = random.choice(list(categories.keys()))
            
            # 定价类型
            pricing_types = ["免费", "付费", "开源", "免费试用"]
            pricing = random.choice(pricing_types)
            
            # 是否国产
            is_chinese = random.choice([True, False])
            chinese_tags = ["国产", "中文"] if is_chinese else []
            
            tool = {
                "name": name,
                "cat": category,
                "desc": f"专业的{domain}领域AI工具，提供{base_name.replace('师', '').replace('官', '').replace('手', '')}服务，功能强大易用。",
                "url": f"https://www.{name.lower().replace('ai', '').replace('智能', '')}.com/",
                "tags": [domain, base_name.replace('师', '').replace('官', ''), pricing] + chinese_tags,
                "generated": True
            }
            
            tools.append(tool)
        
        return tools
    
    # 合并所有工具
    all_tools = hot_tools + chinese_tools + generate_tool_variants()
    
    # 增强每个工具的数据
    enhanced_tools = []
    for i, tool in enumerate(all_tools):
        # 基础信息
        enhanced = {
            "id": i + 1,
            "name": tool["name"],
            "category": tool["cat"],
            "desc": tool["desc"],
            "url": tool["url"],
            "tags": tool["tags"]
        }
        
        # 定价信息
        pricing_map = {"免费": "free", "付费": "paid", "开源": "open_source", "免费试用": "freemium"}
        pricing_tag = next((tag for tag in tool["tags"] if tag in pricing_map), "免费")
        enhanced["pricing"] = pricing_tag
        enhanced["pricing_type"] = pricing_map.get(pricing_tag, "free")
        
        # 中文支持
        chinese_indicators = ["国产", "中文", "阿里", "腾讯", "百度", "字节", "华为", "快手"]
        enhanced["chinese_support"] = any(tag in chinese_indicators for tag in tool["tags"])
        
        # 热度和评分
        if tool.get("hot", False):
            enhanced["popularity_score"] = random.randint(90, 100)
            enhanced["visits"] = f"{random.randint(100, 500)}M+"
            enhanced["rating"] = round(random.uniform(4.7, 5.0), 1)
        else:
            enhanced["popularity_score"] = random.randint(60, 89)
            enhanced["visits"] = f"{random.randint(1, 99)}M+"
            enhanced["rating"] = round(random.uniform(4.2, 4.9), 1)
        
        # 其他信息
        enhanced["last_updated"] = "2026-01-30"
        enhanced["logo"] = f"https://ui-avatars.com/api/?name={tool['name']}&background=random&color=fff&size=128"
        
        # 子分类
        subcategories = {
            "text": ["对话助手", "文案写作", "学术写作", "代码注释", "翻译工具"],
            "image": ["图像生成", "图像编辑", "图像增强", "背景移除", "风格转换"],
            "video": ["视频生成", "视频编辑", "数字人", "动画制作", "视频翻译"],
            "audio": ["音乐生成", "语音合成", "语音识别", "音频编辑", "播客工具"],
            "code": ["代码生成", "代码审查", "调试工具", "文档生成", "测试工具"],
            "office": ["PPT制作", "表格处理", "文档分析", "思维导图", "项目管理"],
            "search": ["智能搜索", "学术搜索", "代码搜索", "图像搜索", "问答系统"],
            "design": ["UI设计", "平面设计", "Logo设计", "网页设计", "原型设计"],
            "agent": ["聊天机器人", "工作流自动化", "多智能体", "任务规划", "决策支持"],
            "platform": ["模型训练", "API服务", "云平台", "开发框架", "部署工具"],
            "learn": ["在线课程", "技术博客", "论文资源", "实践项目", "社区论坛"],
            "model": ["大语言模型", "图像模型", "多模态模型", "开源模型", "专用模型"],
            "detect": ["AI检测", "抄袭检测", "内容审核", "安全检测", "质量评估"],
            "prompt": ["提示词库", "提示优化", "模板市场", "教程指南", "工程工具"],
            "data": ["数据标注", "数据清洗", "数据分析", "数据可视化", "数据集"]
        }
        
        if tool["cat"] in subcategories:
            enhanced["subcategory"] = random.choice(subcategories[tool["cat"]])
        
        enhanced_tools.append(enhanced)
    
    # 生成统计信息
    stats = {
        "total_tools": len(enhanced_tools),
        "categories": {},
        "pricing_distribution": {},
        "chinese_support_count": 0,
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    for tool in enhanced_tools:
        # 分类统计
        category = tool["category"]
        stats["categories"][category] = stats["categories"].get(category, 0) + 1
        
        # 定价统计
        pricing = tool["pricing_type"]
        stats["pricing_distribution"][pricing] = stats["pricing_distribution"].get(pricing, 0) + 1
        
        # 中文支持统计
        if tool["chinese_support"]:
            stats["chinese_support_count"] += 1
    
    # 增强的分类信息
    enhanced_categories = {
        cat_id: {
            "name": cat_name,
            "icon": f"fa-{cat_id}",
            "subcategories": subcategories.get(cat_id, [])
        }
        for cat_id, cat_name in categories.items()
    }
    
    return {
        "tools": enhanced_tools,
        "statistics": stats,
        "categories": enhanced_categories,
        "version": "2.0.0",
        "generated_at": stats["last_updated"]
    }

def main():
    """主函数"""
    print("🚀 开始生成增强版AI工具数据...")
    
    # 生成数据
    data = generate_enhanced_sample_data()
    
    # 确保目录存在
    import os
    os.makedirs("public", exist_ok=True)
    os.makedirs("js", exist_ok=True)
    
    # 输出JSON文件
    with open("public/toolsData.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # 输出JS文件（兼容现有前端）
    js_content = f"""// ==========================================
// AI工具数据库 - 增强版 v2.0 (测试数据)
// 生成时间: {data["generated_at"]}
// 工具总数: {data["statistics"]["total_tools"]}
// 支持中文: {data["statistics"]["chinese_support_count"]}
// ==========================================

const aiToolsData = {json.dumps(data["tools"], indent=2, ensure_ascii=False)};

// 分类信息
const categories = {json.dumps(data["categories"], indent=2, ensure_ascii=False)};

// 统计信息  
const statistics = {json.dumps(data["statistics"], indent=2, ensure_ascii=False)};

// 导出
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ aiToolsData, categories, statistics }};
}}
"""
    
    with open("js/tools_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    
    # 输出统计信息
    print("\n" + "="*60)
    print("🎉 增强版数据生成完成！")
    print("="*60)
    print(f"📊 工具总数: {data['statistics']['total_tools']}")
    print(f"🇨🇳 中文支持: {data['statistics']['chinese_support_count']}")
    print(f"📁 分类数量: {len(data['categories'])}")
    print(f"💰 定价分布:")
    for pricing, count in data['statistics']['pricing_distribution'].items():
        print(f"   {pricing}: {count}")
    print(f"📂 输出文件:")
    print(f"   - public/toolsData.json")
    print(f"   - js/tools_data.js")
    print("="*60)
    
    print("\n📈 分类统计:")
    for cat_id, count in sorted(data['statistics']['categories'].items(), key=lambda x: x[1], reverse=True):
        cat_name = data['categories'].get(cat_id, {}).get('name', cat_id)
        print(f"   {cat_name}: {count} 个工具")
    
    print(f"\n✅ 数据已生成，可以运行 'npm run dev' 查看效果！")

if __name__ == "__main__":
    main()