#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI工具数据生成脚本
基于 ai-bot.cn 的分类结构，生成完整的工具数据
"""

import json
import random
from datetime import datetime

# 分类定义（基于 ai-bot.cn 的结构）
CATEGORIES = {
    "writing": {
        "name": "AI写作工具",
        "icon": "fa-pen-nib",
        "color": "#f59e0b",
        "subcategories": ["论文写作", "小说创作", "营销文案", "学术写作", "公文写作"]
    },
    "image": {
        "name": "AI图像工具",
        "icon": "fa-image",
        "color": "#ec4899",
        "subcategories": ["图像生成", "背景移除", "图片编辑", "无损放大", "商品图生成", "3D模型"]
    },
    "video": {
        "name": "AI视频工具",
        "icon": "fa-video",
        "color": "#8b5cf6",
        "subcategories": ["视频生成", "数字人", "视频编辑", "动画制作"]
    },
    "office": {
        "name": "AI办公工具",
        "icon": "fa-briefcase",
        "color": "#3b82f6",
        "subcategories": ["PPT生成", "表格处理", "思维导图", "文档工具", "会议工具", "翻译工具"]
    },
    "code": {
        "name": "AI编程工具",
        "icon": "fa-code",
        "color": "#10b981",
        "subcategories": ["代码补全", "调试工具", "代码审查", "低代码平台"]
    },
    "audio": {
        "name": "AI音频工具",
        "icon": "fa-microphone-lines",
        "color": "#06b6d4",
        "subcategories": ["音乐生成", "语音合成", "音频编辑", "声音克隆"]
    },
    "chat": {
        "name": "AI聊天助手",
        "icon": "fa-comments",
        "color": "#6366f1",
        "subcategories": ["通用对话", "角色扮演", "情感陪伴"]
    },
    "search": {
        "name": "AI搜索引擎",
        "icon": "fa-magnifying-glass",
        "color": "#14b8a6",
        "subcategories": ["通用搜索", "学术搜索", "代码搜索"]
    },
    "agent": {
        "name": "AI智能体",
        "icon": "fa-robot",
        "color": "#f97316",
        "subcategories": ["个人助理", "工作流自动化", "多Agent协作"]
    },
    "design": {
        "name": "AI设计工具",
        "icon": "fa-palette",
        "color": "#d946ef",
        "subcategories": ["UI设计", "平面设计", "Logo设计", "建筑设计"]
    },
    "dev": {
        "name": "AI开发平台",
        "icon": "fa-laptop-code",
        "color": "#84cc16",
        "subcategories": ["模型训练", "API服务", "模型部署"]
    },
    "learn": {
        "name": "AI学习网站",
        "icon": "fa-graduation-cap",
        "color": "#f43f5e",
        "subcategories": ["AI教程", "在线课程", "实践项目"]
    },
    "model": {
        "name": "AI训练模型",
        "icon": "fa-brain",
        "color": "#8b5cf6",
        "subcategories": ["大语言模型", "图像模型", "多模态模型"]
    },
    "detect": {
        "name": "AI内容检测",
        "icon": "fa-shield-halved",
        "color": "#ef4444",
        "subcategories": ["AI检测", "降重工具", "原创检测"]
    },
    "prompt": {
        "name": "AI提示指令",
        "icon": "fa-terminal",
        "color": "#64748b",
        "subcategories": ["提示词库", "提示词优化", "提示词交易"]
    }
}

# 工具数据模板（基于 ai-bot.cn 的热门工具）
TOOLS_TEMPLATE = [
    # AI写作工具
    {"name": "ChatGPT", "category": "chat", "subcategory": "通用对话", "desc": "OpenAI的划时代产品，GPT-4o最强模型，全能AI助手", "url": "https://chat.openai.com", "pricing": "付费", "tags": ["对话", "写作", "编程"], "rating": 4.8, "visits": "351M+", "chinese": False},
    {"name": "Claude", "category": "chat", "subcategory": "通用对话", "desc": "Anthropic出品，代码与逻辑能力超越GPT-4，长文本处理强", "url": "https://claude.ai", "pricing": "付费", "tags": ["对话", "代码", "长文本"], "rating": 4.9, "visits": "239M+", "chinese": False},
    {"name": "文心一言", "category": "chat", "subcategory": "通用对话", "desc": "百度出品的知识增强大语言模型，中文理解能力强", "url": "https://yiyan.baidu.com", "pricing": "免费/付费", "tags": ["对话", "中文", "搜索"], "rating": 4.5, "visits": "120M+", "chinese": True},
    {"name": "通义千问", "category": "chat", "subcategory": "通用对话", "desc": "阿里出品的大模型，支持多轮对话和复杂任务", "url": "https://tongyi.aliyun.com", "pricing": "免费/付费", "tags": ["对话", "中文", "办公"], "rating": 4.6, "visits": "80M+", "chinese": True},
    {"name": "豆包", "category": "chat", "subcategory": "通用对话", "desc": "字节跳动出品，语音交互体验极佳，适合日常使用", "url": "https://www.doubao.com", "pricing": "免费", "tags": ["对话", "语音", "日常"], "rating": 4.7, "visits": "100M+", "chinese": True},
    {"name": "Kimi智能助手", "category": "chat", "subcategory": "通用对话", "desc": "月之暗面出品，支持20万字超长上下文，文件分析强", "url": "https://kimi.moonshot.cn", "pricing": "免费", "tags": ["对话", "长文本", "文件分析"], "rating": 4.8, "visits": "66M+", "chinese": True},
    {"name": "DeepSeek", "category": "code", "subcategory": "代码补全", "desc": "深度求索开源模型，推理能力极其强大，代码生成优秀", "url": "https://www.deepseek.com", "pricing": "开源", "tags": ["代码", "开源", "国产"], "rating": 4.9, "visits": "78M+", "chinese": True},
    {"name": "讯飞绘文", "category": "writing", "subcategory": "营销文案", "desc": "免费AI写作工具，5分钟生成一篇原创稿", "url": "https://huixwen.iflytek.com", "pricing": "免费", "tags": ["写作", "文案", "免费"], "rating": 4.4, "visits": "25M+", "chinese": True},
    {"name": "笔灵AI写作", "category": "writing", "subcategory": "论文写作", "desc": "600+写作模板、AI一键生成论文/小说，论文降重降AI", "url": "https://ibiling.cn", "pricing": "付费", "tags": ["写作", "论文", "降重"], "rating": 4.5, "visits": "30M+", "chinese": True},
    {"name": "新华妙笔", "category": "writing", "subcategory": "公文写作", "desc": "新华社推出的体制内办公学习平台", "url": "https://miaobi.xinhuaskl.com", "pricing": "付费", "tags": ["写作", "公文", "体制内"], "rating": 4.3, "visits": "15M+", "chinese": True},
    
    # AI图像工具
    {"name": "Midjourney", "category": "image", "subcategory": "图像生成", "desc": "目前生成质量最高的AI绘画工具，艺术感强", "url": "https://www.midjourney.com", "pricing": "付费", "tags": ["绘画", "艺术", "设计"], "rating": 4.9, "visits": "162M+", "chinese": False},
    {"name": "Stable Diffusion", "category": "image", "subcategory": "图像生成", "desc": "开源AI绘画基石，可本地部署，生态丰富", "url": "https://stability.ai", "pricing": "开源", "tags": ["绘画", "开源", "本地"], "rating": 4.8, "visits": "85M+", "chinese": False},
    {"name": "即梦AI", "category": "image", "subcategory": "图像生成", "desc": "抖音旗下免费AI图片创作工具，中文支持好", "url": "https://jimeng.jianying.com", "pricing": "免费/付费", "tags": ["绘画", "抖音", "中文"], "rating": 4.6, "visits": "45M+", "chinese": True},
    {"name": "LiblibAI", "category": "image", "subcategory": "图像生成", "desc": "国内领先的AI图像创作平台和模型分享社区", "url": "https://www.liblib.art", "pricing": "免费/付费", "tags": ["绘画", "模型", "社区"], "rating": 4.7, "visits": "35M+", "chinese": True},
    {"name": "通义万相", "category": "image", "subcategory": "图像生成", "desc": "阿里推出的AI创意内容生成平台，支持多种风格", "url": "https://tongyi.aliyun.com/wanxiang", "pricing": "免费/付费", "tags": ["绘画", "阿里", "中文"], "rating": 4.5, "visits": "28M+", "chinese": True},
    {"name": "可灵AI", "category": "video", "subcategory": "视频生成", "desc": "快手推出的AI图像和视频创作平台", "url": "https://klingai.kuaishou.com", "pricing": "免费/付费", "tags": ["视频", "快手", "中文"], "rating": 4.7, "visits": "40M+", "chinese": True},
    {"name": "Remove.bg", "category": "image", "subcategory": "背景移除", "desc": "一键自动去除图片背景，效果精准", "url": "https://www.remove.bg", "pricing": "免费/付费", "tags": ["抠图", "背景", "图片处理"], "rating": 4.8, "visits": "120M+", "chinese": False},
    {"name": "稿定AI", "category": "image", "subcategory": "图片编辑", "desc": "一站式AI设计工具集，免费AI绘图、图片转AI绘画、AI抠图消除", "url": "https://www.gaoding.com", "pricing": "免费/付费", "tags": ["设计", "抠图", "编辑"], "rating": 4.5, "visits": "50M+", "chinese": True},
    
    # AI视频工具
    {"name": "Runway", "category": "video", "subcategory": "视频生成", "desc": "Gen-2模型，视频编辑与生成的专业工具", "url": "https://runwayml.com", "pricing": "付费", "tags": ["视频", "编辑", "生成"], "rating": 4.8, "visits": "43M+", "chinese": False},
    {"name": "Pika", "category": "video", "subcategory": "视频生成", "desc": "AI视频生成工具，支持文本/图像生成视频", "url": "https://pika.art", "pricing": "免费/付费", "tags": ["视频", "生成", "动画"], "rating": 4.6, "visits": "25M+", "chinese": False},
    {"name": "HeyGen", "category": "video", "subcategory": "数字人", "desc": "专业的AI数字人视频创作平台，支持多语言", "url": "https://www.heygen.com", "pricing": "付费", "tags": ["数字人", "视频", "多语言"], "rating": 4.7, "visits": "30M+", "chinese": False},
    {"name": "Sora", "category": "video", "subcategory": "视频生成", "desc": "OpenAI推出的AI视频生成模型，效果惊艳", "url": "https://openai.com/sora", "pricing": "付费", "tags": ["视频", "OpenAI", "生成"], "rating": 4.9, "visits": "200M+", "chinese": False},
    {"name": "Vidu", "category": "video", "subcategory": "视频生成", "desc": "生数科技推出的AI视频生成大模型，国产Sora", "url": "https://www.vidu.com", "pricing": "免费/付费", "tags": ["视频", "国产", "生成"], "rating": 4.5, "visits": "15M+", "chinese": True},
    {"name": "蝉镜", "category": "video", "subcategory": "数字人", "desc": "AI数字人视频生成平台，适合电商和营销", "url": "https://www.chanjing.cc", "pricing": "付费", "tags": ["数字人", "视频", "电商"], "rating": 4.4, "visits": "12M+", "chinese": True},
    
    # AI编程工具
    {"name": "GitHub Copilot", "category": "code", "subcategory": "代码补全", "desc": "最流行的AI编程助手，自动补全代码，支持多种语言", "url": "https://github.com/features/copilot", "pricing": "付费", "tags": ["编程", "代码", "微软"], "rating": 4.8, "visits": "210M+", "chinese": False},
    {"name": "Cursor", "category": "code", "subcategory": "代码补全", "desc": "AI-first的代码编辑器，基于VS Code，代码生成能力强", "url": "https://cursor.sh", "pricing": "免费/付费", "tags": ["编程", "编辑器", "AI"], "rating": 4.9, "visits": "45M+", "chinese": False},
    {"name": "Trae", "category": "code", "subcategory": "代码补全", "desc": "字节跳动推出的AI编程IDE，Vibe Coding必备", "url": "https://www.trae.ai", "pricing": "免费", "tags": ["编程", "IDE", "字节"], "rating": 4.6, "visits": "20M+", "chinese": True},
    {"name": "Codeium", "category": "code", "subcategory": "代码补全", "desc": "免费的AI代码补全工具，支持70+语言和40+编辑器", "url": "https://codeium.com", "pricing": "免费", "tags": ["编程", "免费", "补全"], "rating": 4.5, "visits": "35M+", "chinese": False},
    {"name": "通义灵码", "category": "code", "subcategory": "代码补全", "desc": "阿里推出的AI编程助手，代码补全和生成", "url": "https://tongyi.aliyun.com/lingma", "pricing": "免费", "tags": ["编程", "阿里", "中文"], "rating": 4.4, "visits": "25M+", "chinese": True},
    {"name": "CodeGeeX", "category": "code", "subcategory": "代码补全", "desc": "智谱AI推出的代码生成模型，开源免费", "url": "https://codegeex.cn", "pricing": "开源", "tags": ["编程", "开源", "国产"], "rating": 4.3, "visits": "18M+", "chinese": True},
    
    # AI办公工具
    {"name": "Notion AI", "category": "office", "subcategory": "文档工具", "desc": "集成在Notion中的AI，润色、总结、翻译、写作", "url": "https://www.notion.so", "pricing": "付费", "tags": ["笔记", "办公", "写作"], "rating": 4.7, "visits": "76M+", "chinese": False},
    {"name": "AiPPT", "category": "office", "subcategory": "PPT生成", "desc": "AI快速生成高质量PPT，设计精美", "url": "https://www.aippt.cn", "pricing": "免费/付费", "tags": ["PPT", "办公", "设计"], "rating": 4.5, "visits": "40M+", "chinese": True},
    {"name": "Gamma", "category": "office", "subcategory": "PPT生成", "desc": "AI幻灯片演示生成工具，支持交互", "url": "https://gamma.app", "pricing": "免费/付费", "tags": ["PPT", "演示", "设计"], "rating": 4.8, "visits": "55M+", "chinese": False},
    {"name": "扣子PPT", "category": "office", "subcategory": "PPT生成", "desc": "免费一键生成精美PPT，Coze出品", "url": "https://www.coze.cn", "pricing": "免费", "tags": ["PPT", "免费", "字节"], "rating": 4.4, "visits": "22M+", "chinese": True},
    {"name": "讯飞智文", "category": "office", "subcategory": "PPT生成", "desc": "一键生成PPT和Word，讯飞出品", "url": "https://zhiwen.xfyun.cn", "pricing": "免费/付费", "tags": ["PPT", "Word", "讯飞"], "rating": 4.5, "visits": "28M+", "chinese": True},
    {"name": "ChatExcel", "category": "office", "subcategory": "表格处理", "desc": "聊天式Excel处理工具，自然语言操作表格", "url": "https://chatexcel.com", "pricing": "免费/付费", "tags": ["Excel", "表格", "中文"], "rating": 4.3, "visits": "15M+", "chinese": True},
    {"name": "ProcessOn", "category": "office", "subcategory": "思维导图", "desc": "在线作图工具，支持AI生成思维导图和流程图", "url": "https://www.processon.com", "pricing": "免费/付费", "tags": ["思维导图", "流程图", "作图"], "rating": 4.6, "visits": "35M+", "chinese": True},
    {"name": "DeepL", "category": "office", "subcategory": "翻译工具", "desc": "高质量AI翻译工具，支持多种语言", "url": "https://www.deepl.com", "pricing": "免费/付费", "tags": ["翻译", "语言", "AI"], "rating": 4.8, "visits": "150M+", "chinese": False},
    
    # AI音频工具
    {"name": "Suno", "category": "audio", "subcategory": "音乐生成", "desc": "一键生成广播级歌曲，音乐界ChatGPT", "url": "https://suno.ai", "pricing": "免费/付费", "tags": ["音乐", "生成", "创作"], "rating": 4.9, "visits": "97M+", "chinese": False},
    {"name": "Udio", "category": "audio", "subcategory": "音乐生成", "desc": "AI音乐生成工具，支持多种风格", "url": "https://www.udio.com", "pricing": "免费/付费", "tags": ["音乐", "生成", "创作"], "rating": 4.7, "visits": "25M+", "chinese": False},
    {"name": "ElevenLabs", "category": "audio", "subcategory": "语音合成", "desc": "最逼真的AI语音合成，支持多语言和情感", "url": "https://elevenlabs.io", "pricing": "免费/付费", "tags": ["语音", "合成", "多语言"], "rating": 4.8, "visits": "80M+", "chinese": False},
    {"name": "讯飞听见", "category": "audio", "subcategory": "语音合成", "desc": "讯飞语音转文字和合成工具，中文支持好", "url": "https://www.iflyrec.com", "pricing": "免费/付费", "tags": ["语音", "转写", "中文"], "rating": 4.6, "visits": "45M+", "chinese": True},
    {"name": "剪映", "category": "audio", "subcategory": "音频编辑", "desc": "抖音出品视频剪辑工具，集成AI配音和字幕", "url": "https://www.capcut.cn", "pricing": "免费", "tags": ["剪辑", "配音", "字幕"], "rating": 4.7, "visits": "200M+", "chinese": True},
    
    # AI搜索引擎
    {"name": "Perplexity", "category": "search", "subcategory": "通用搜索", "desc": "AI搜索引擎，直接给出答案和引用来源", "url": "https://www.perplexity.ai", "pricing": "免费/付费", "tags": ["搜索", "问答", "引用"], "rating": 4.8, "visits": "180M+", "chinese": False},
    {"name": "秘塔AI搜索", "category": "search", "subcategory": "通用搜索", "desc": "最好用的AI搜索工具，没有广告，直达结果", "url": "https://metaso.cn", "pricing": "免费", "tags": ["搜索", "中文", "无广告"], "rating": 4.7, "visits": "60M+", "chinese": True},
    {"name": "360AI搜索", "category": "search", "subcategory": "通用搜索", "desc": "360推出的AI搜索引擎，安全可信", "url": "https://ai.so.com", "pricing": "免费", "tags": ["搜索", "中文", "安全"], "rating": 4.3, "visits": "35M+", "chinese": True},
    {"name": "Consensus", "category": "search", "subcategory": "学术搜索", "desc": "AI学术搜索引擎，基于论文回答问题", "url": "https://consensus.app", "pricing": "免费/付费", "tags": ["学术", "论文", "研究"], "rating": 4.6, "visits": "20M+", "chinese": False},
    {"name": "Elicit", "category": "search", "subcategory": "学术搜索", "desc": "AI研究助手，自动分析和总结论文", "url": "https://elicit.org", "pricing": "免费/付费", "tags": ["学术", "研究", "分析"], "rating": 4.5, "visits": "15M+", "chinese": False},
    
    # AI智能体
    {"name": "Coze", "category": "agent", "subcategory": "个人助理", "desc": "字节跳动AI应用开发平台，可创建个人智能体", "url": "https://www.coze.com", "pricing": "免费", "tags": ["智能体", "开发", "字节"], "rating": 4.6, "visits": "40M+", "chinese": True},
    {"name": "扣子空间", "category": "agent", "subcategory": "工作流自动化", "desc": "免费全能AI办公智能体，自动化工作流", "url": "https://www.coze.cn", "pricing": "免费", "tags": ["智能体", "办公", "自动化"], "rating": 4.5, "visits": "25M+", "chinese": True},
    {"name": "Dify", "category": "agent", "subcategory": "工作流自动化", "desc": "开源LLM应用开发平台，可视化编排工作流", "url": "https://dify.ai", "pricing": "开源", "tags": ["智能体", "开源", "开发"], "rating": 4.7, "visits": "30M+", "chinese": True},
    {"name": "AutoGPT", "category": "agent", "subcategory": "多Agent协作", "desc": "自主AI智能体，可自动分解任务并执行", "url": "https://autogpt.net", "pricing": "开源", "tags": ["智能体", "自主", "开源"], "rating": 4.4, "visits": "35M+", "chinese": False},
    {"name": "Manus", "category": "agent", "subcategory": "个人助理", "desc": "通用AI智能体，可执行复杂任务", "url": "https://manus.im", "pricing": "付费", "tags": ["智能体", "通用", "任务"], "rating": 4.8, "visits": "50M+", "chinese": True},
    
    # AI设计工具
    {"name": "Canva AI", "category": "design", "subcategory": "平面设计", "desc": "Canva集成AI功能，智能设计和排版", "url": "https://www.canva.com", "pricing": "免费/付费", "tags": ["设计", "平面", "模板"], "rating": 4.7, "visits": "300M+", "chinese": True},
    {"name": "Figma AI", "category": "design", "subcategory": "UI设计", "desc": "Figma集成AI功能，UI设计助手", "url": "https://www.figma.com", "pricing": "免费/付费", "tags": ["设计", "UI", "协作"], "rating": 4.8, "visits": "150M+", "chinese": True},
    {"name": "Looka", "category": "design", "subcategory": "Logo设计", "desc": "AI Logo生成工具，快速创建品牌标识", "url": "https://looka.com", "pricing": "付费", "tags": ["Logo", "品牌", "设计"], "rating": 4.5, "visits": "25M+", "chinese": False},
    {"name": "即时设计", "category": "design", "subcategory": "UI设计", "desc": "国产UI设计工具，集成AI功能", "url": "https://js.design", "pricing": "免费", "tags": ["设计", "UI", "国产"], "rating": 4.6, "visits": "30M+", "chinese": True},
    {"name": "MasterGo", "category": "design", "subcategory": "UI设计", "desc": "国产在线设计工具，AI辅助设计", "url": "https://mastergo.com", "pricing": "免费/付费", "tags": ["设计", "UI", "国产"], "rating": 4.5, "visits": "20M+", "chinese": True},
    
    # AI开发平台
    {"name": "Hugging Face", "category": "dev", "subcategory": "模型训练", "desc": "最大的AI模型社区和平台，开源生态", "url": "https://huggingface.co", "pricing": "免费/付费", "tags": ["模型", "开源", "社区"], "rating": 4.9, "visits": "120M+", "chinese": False},
    {"name": "Replicate", "category": "dev", "subcategory": "API服务", "desc": "AI模型API平台，快速部署和运行模型", "url": "https://replicate.com", "pricing": "付费", "tags": ["API", "部署", "模型"], "rating": 4.7, "visits": "35M+", "chinese": False},
    {"name": "魔搭社区", "category": "dev", "subcategory": "模型训练", "desc": "阿里AI模型社区，中文模型丰富", "url": "https://modelscope.cn", "pricing": "免费", "tags": ["模型", "阿里", "中文"], "rating": 4.6, "visits": "40M+", "chinese": True},
    {"name": "飞桨", "category": "dev", "subcategory": "模型训练", "desc": "百度深度学习平台，国产AI框架", "url": "https://www.paddlepaddle.org.cn", "pricing": "开源", "tags": ["框架", "百度", "国产"], "rating": 4.5, "visits": "25M+", "chinese": True},
    {"name": "火山引擎", "category": "dev", "subcategory": "API服务", "desc": "字节跳动AI服务平台，大模型API", "url": "https://www.volcengine.com", "pricing": "付费", "tags": ["API", "字节", "企业"], "rating": 4.6, "visits": "30M+", "chinese": True},
    
    # AI学习网站
    {"name": "Coursera AI", "category": "learn", "subcategory": "在线课程", "desc": "顶级AI课程平台，斯坦福等名校课程", "url": "https://www.coursera.org", "pricing": "免费/付费", "tags": ["课程", "学习", "名校"], "rating": 4.8, "visits": "200M+", "chinese": True},
    {"name": "Fast.ai", "category": "learn", "subcategory": "在线课程", "desc": "免费深度学习课程，实用导向", "url": "https://www.fast.ai", "pricing": "免费", "tags": ["课程", "深度学习", "免费"], "rating": 4.7, "visits": "15M+", "chinese": False},
    {"name": "Kaggle", "category": "learn", "subcategory": "实践项目", "desc": "数据科学竞赛平台，学习和实践", "url": "https://www.kaggle.com", "pricing": "免费", "tags": ["竞赛", "数据", "实践"], "rating": 4.8, "visits": "100M+", "chinese": True},
    {"name": "吴恩达机器学习", "category": "learn", "subcategory": "在线课程", "desc": "最经典的机器学习课程", "url": "https://www.coursera.org/learn/machine-learning", "pricing": "免费", "tags": ["课程", "经典", "入门"], "rating": 4.9, "visits": "80M+", "chinese": True},
    {"name": "AI中国", "category": "learn", "subcategory": "AI教程", "desc": "中文AI学习社区，教程和资讯", "url": "https://www.aichina.com", "pricing": "免费", "tags": ["社区", "中文", "教程"], "rating": 4.4, "visits": "20M+", "chinese": True},
    
    # AI训练模型
    {"name": "GPT-4", "category": "model", "subcategory": "大语言模型", "desc": "OpenAI最强模型，多模态能力强", "url": "https://openai.com/gpt-4", "pricing": "付费", "tags": ["模型", "OpenAI", "多模态"], "rating": 4.9, "visits": "500M+", "chinese": False},
    {"name": "Claude 3", "category": "model", "subcategory": "大语言模型", "desc": "Anthropic最新模型，推理能力顶尖", "url": "https://www.anthropic.com/claude", "pricing": "付费", "tags": ["模型", "Anthropic", "推理"], "rating": 4.9, "visits": "150M+", "chinese": False},
    {"name": "Llama 3", "category": "model", "subcategory": "大语言模型", "desc": "Meta开源大模型，性能强劲", "url": "https://llama.meta.com", "pricing": "开源", "tags": ["模型", "开源", "Meta"], "rating": 4.7, "visits": "80M+", "chinese": False},
    {"name": "文心大模型", "category": "model", "subcategory": "大语言模型", "desc": "百度大模型，中文理解优秀", "url": "https://wenxin.baidu.com", "pricing": "API付费", "tags": ["模型", "百度", "中文"], "rating": 4.5, "visits": "60M+", "chinese": True},
    {"name": "通义大模型", "category": "model", "subcategory": "大语言模型", "desc": "阿里大模型，多模态能力强", "url": "https://tongyi.aliyun.com", "pricing": "API付费", "tags": ["模型", "阿里", "多模态"], "rating": 4.6, "visits": "50M+", "chinese": True},
    {"name": "Stable Diffusion XL", "category": "model", "subcategory": "图像模型", "desc": "最强开源图像生成模型", "url": "https://stability.ai", "pricing": "开源", "tags": ["模型", "图像", "开源"], "rating": 4.8, "visits": "100M+", "chinese": False},
    {"name": "GPT-4o", "category": "model", "subcategory": "多模态模型", "desc": "OpenAI多模态模型，视觉音频全能", "url": "https://openai.com/index/hello-gpt-4o", "pricing": "付费", "tags": ["模型", "多模态", "OpenAI"], "rating": 4.9, "visits": "300M+", "chinese": False},
    
    # AI内容检测
    {"name": "GPTZero", "category": "detect", "subcategory": "AI检测", "desc": "检测文本是否由AI生成", "url": "https://gptzero.me", "pricing": "免费/付费", "tags": ["检测", "AI文本", "原创"], "rating": 4.4, "visits": "45M+", "chinese": False},
    {"name": "Originality.ai", "category": "detect", "subcategory": "AI检测", "desc": "AI内容检测和原创性检查", "url": "https://originality.ai", "pricing": "付费", "tags": ["检测", "原创", "内容"], "rating": 4.5, "visits": "20M+", "chinese": False},
    {"name": "Turnitin", "category": "detect", "subcategory": "降重工具", "desc": "学术抄袭检测，论文查重", "url": "https://www.turnitin.com", "pricing": "付费", "tags": ["查重", "学术", "论文"], "rating": 4.6, "visits": "150M+", "chinese": True},
    {"name": "知网查重", "category": "detect", "subcategory": "降重工具", "desc": "中国知网论文查重系统", "url": "https://www.cnki.net", "pricing": "付费", "tags": ["查重", "论文", "学术"], "rating": 4.3, "visits": "200M+", "chinese": True},
    {"name": "Copyleaks", "category": "detect", "subcategory": "原创检测", "desc": "AI内容检测和抄袭检测", "url": "https://copyleaks.com", "pricing": "免费/付费", "tags": ["检测", "抄袭", "AI"], "rating": 4.4, "visits": "25M+", "chinese": False},
    
    # AI提示指令
    {"name": "PromptHero", "category": "prompt", "subcategory": "提示词库", "desc": "AI提示词库和搜索，图像提示词丰富", "url": "https://prompthero.com", "pricing": "免费", "tags": ["提示词", "图像", "库"], "rating": 4.6, "visits": "30M+", "chinese": False},
    {"name": "FlowGPT", "category": "prompt", "subcategory": "提示词库", "desc": "ChatGPT提示词社区，分享和发现", "url": "https://flowgpt.com", "pricing": "免费", "tags": ["提示词", "社区", "分享"], "rating": 4.5, "visits": "25M+", "chinese": True},
    {"name": "Learning Prompt", "category": "prompt", "subcategory": "提示词优化", "desc": "中文提示词学习教程", "url": "https://learningprompt.wiki", "pricing": "免费", "tags": ["提示词", "教程", "中文"], "rating": 4.7, "visits": "15M+", "chinese": True},
    {"name": "PromptBase", "category": "prompt", "subcategory": "提示词交易", "desc": "提示词交易平台，买卖优质提示词", "url": "https://promptbase.com", "pricing": "付费", "tags": ["提示词", "交易", "市场"], "rating": 4.4, "visits": "20M+", "chinese": False},
    {"name": "Snooze", "category": "prompt", "subcategory": "提示词优化", "desc": "AI提示词优化工具，提升输出质量", "url": "https://snooze.ai", "pricing": "免费/付费", "tags": ["提示词", "优化", "工具"], "rating": 4.3, "visits": "10M+", "chinese": False},
]

def generate_tools_data():
    """生成完整的工具数据"""
    tools = []
    
    for idx, template in enumerate(TOOLS_TEMPLATE, 1):
        tool = {
            "id": idx,
            "name": template["name"],
            "category": template["category"],
            "subcategory": template["subcategory"],
            "desc": template["desc"],
            "url": template["url"],
            "tags": template["tags"],
            "pricing": template["pricing"],
            "pricing_type": "free" if "免费" in template["pricing"] else ("paid" if "付费" in template["pricing"] else "opensource"),
            "chinese_support": template["chinese"],
            "popularity_score": random.randint(60, 100),
            "visits": template["visits"],
            "rating": template["rating"],
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "logo": f"https://ui-avatars.com/api/?name={template['name'].replace(' ', '+')}&background=random&color=fff&size=128",
            "features": template["tags"][:3],
            "use_cases": ["个人使用", "团队协作", "企业应用"][:random.randint(1, 3)]
        }
        tools.append(tool)
    
    return tools

def generate_categories_data():
    """生成分类数据"""
    categories = []
    
    for key, value in CATEGORIES.items():
        cat = {
            "id": key,
            "name": value["name"],
            "icon": value["icon"],
            "color": value["color"],
            "subcategories": value["subcategories"]
        }
        categories.append(cat)
    
    return categories

def main():
    """主函数"""
    print("🚀 开始生成AI工具数据...")
    
    # 生成工具数据
    tools = generate_tools_data()
    print(f"✅ 生成了 {len(tools)} 个工具数据")
    
    # 生成分类数据
    categories = generate_categories_data()
    print(f"✅ 生成了 {len(categories)} 个分类")
    
    # 构建完整数据
    data = {
        "metadata": {
            "version": "2.0",
            "generated_at": datetime.now().isoformat(),
            "total_tools": len(tools),
            "total_categories": len(categories),
            "source": "ai-bot.cn inspired"
        },
        "categories": categories,
        "tools": tools
    }
    
    # 保存到文件
    output_file = "public/toolsData.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 数据已保存到 {output_file}")
    
    # 统计信息
    print("\n📊 数据统计:")
    print(f"   - 总工具数: {len(tools)}")
    print(f"   - 总分类数: {len(categories)}")
    
    # 按分类统计
    print("\n📁 分类分布:")
    for cat in categories:
        count = len([t for t in tools if t["category"] == cat["id"]])
        print(f"   - {cat['name']}: {count} 个工具")
    
    print("\n🎉 数据生成完成!")

if __name__ == "__main__":
    main()
