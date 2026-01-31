"""
GitHub Topics 配置文件
定义要抓取的 AI 相关主题和关键词
"""

# GitHub Topics - 按分类组织的 AI 相关主题
GITHUB_TOPICS = {
    # AI 编程与开发
    "dev": [
        "ai",
        "machine-learning",
        "deep-learning",
        "neural-network",
        "llm",
        "large-language-model",
        "gpt",
        "transformer",
        "pytorch",
        "tensorflow",
        "artificial-intelligence",
        "python",
        "code-generation",
        "ai-assistant",
        "copilot",
        "vibe-coding"
    ],
    
    # AI 图像
    "image": [
        "stable-diffusion",
        "image-generation",
        "ai-art",
        "diffusion-model",
        "image-processing",
        "computer-vision",
        "gan",
        "style-transfer",
        "text-to-image",
        "midjourney"
    ],
    
    # AI 视频
    "video": [
        "video-generation",
        "video-editing",
        "motion-capture",
        "deepfake",
        "video-processing",
        "sora"
    ],
    
    # AI 写作
    "writing": [
        "nlp",
        "natural-language-processing",
        "text-generation",
        "language-model",
        "chatbot",
        "llama",
        "bert"
    ],
    
    # AI 音频
    "audio": [
        "speech-recognition",
        "text-to-speech",
        "voice-cloning",
        "audio-generation",
        "whisper"
    ],
    
    # AI 办公
    "office": [
        "document-ai",
        "ocr",
        "table-extraction"
    ],
    
    # AI 智能体
    "agents": [
        "autonomous-agents",
        "agent-framework",
        "langchain",
        "crewai",
        "auto-gpt"
    ]
}

# 排除的非 AI 主题（避免误抓）
EXCLUDED_TOPICS = [
    "blockchain",
    "cryptocurrency",
    "bitcoin",
    "nft",
    "web3"
]

# 每页抓取的仓库数量
PER_PAGE = 30

# 最大重试次数
MAX_RETRIES = 3

# 请求间隔（秒）- 避免被限流
REQUEST_DELAY = 1.0

# 最低 stars 阈值（只抓取有一定热度的项目）
MIN_STARS = 100

# 语言过滤器（只抓取这些语言的仓库）
LANGUAGE_FILTER = ["Python", "JavaScript", "TypeScript", "Rust", "Go", "C++"]
