// AI方舟 - 主应用逻辑
import './style.css';

// 全局状态管理
const state = {
    tools: [],
    categories: [],
    filteredTools: [],
    displayedTools: [],
    currentPage: 1,
    itemsPerPage: 24,
    activeCategory: 'all',
    activeSubcategory: null,
    searchQuery: '',
    sortBy: 'popular',
    filters: {
        pricing: [],
        chinese: false
    },
    compareList: [],
    favorites: JSON.parse(localStorage.getItem('aiark_favorites') || '[]'),
    viewMode: 'grid',
    isLoggedIn: false,
    user: null
};

// MOCK DATA - 静态数据配置 (来自 ai-bot.cn 的真实数据)
const MOCK_CATEGORIES = [
    { id: 'chat', name: 'AI 对话', icon: 'fa-comments', color: '#3b82f6' },
    { id: 'writing', name: 'AI 写作', icon: 'fa-pen-nib', color: '#f59e0b' },
    { id: 'image', name: 'AI 绘画', icon: 'fa-image', color: '#ec4899' },
    { id: 'video', name: 'AI 视频', icon: 'fa-video', color: '#8b5cf6' },
    { id: 'office', name: 'AI 办公', icon: 'fa-briefcase', color: '#10b981' },
    { id: 'dev', name: 'AI 编程', icon: 'fa-code', color: '#6366f1' },
    { id: 'search', name: 'AI 搜索', icon: 'fa-search', color: '#14b8a6' },
    { id: 'audio', name: 'AI 音频', icon: 'fa-music', color: '#06b6d4' },
    { id: 'agent', name: 'AI 智能体', icon: 'fa-robot', color: '#f97316' },
    { id: 'learn', name: 'AI 学习', icon: 'fa-graduation-cap', color: '#f43f5e' }
];

const MOCK_TOOLS = [
    // 热门工具 (from index)
    {
        id: 1,
        name: '豆包',
        category: 'chat',
        tags: ['字节跳动', '免费', '智能助手'],
        desc: '智能对话助手，办公创作全能！字节跳动出品的AI对话助手，语音交互体验自然，提供多种个性化智能体。',
        rating: 4.8,
        visits: '45M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/08/doubao-icon.png',
        url: 'https://www.doubao.com',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 98
    },
    {
        id: 2,
        name: '即梦AI',
        category: 'video',
        tags: ['视频生成', '图片生成', '数字人'],
        desc: '一站式AI视频、图片、数字人创作工具。剪映团队推出的AI内容创作平台。',
        rating: 4.7,
        visits: '12M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2024/05/jimeng-ai-icon.png',
        url: 'https://jimeng.jianying.com',
        pricing: '免费/付费',
        chinese_support: true,
        popularity_score: 95
    },
    {
        id: 3,
        name: 'TRAE编程',
        category: 'dev',
        tags: ['IDE', '编程助手', '字节跳动'],
        desc: 'AI编程IDE，Vibe Coding 必备！字节跳动推出的新一代AI编程工具。',
        rating: 4.9,
        visits: '5M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2025/01/trae-ai-icon.png',
        url: 'https://www.trae.ai',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 96
    },
    {
        id: 4,
        name: 'AiPPT',
        category: 'office',
        tags: ['PPT生成', '办公效率', '一键生成'],
        desc: 'AI快速生成高质量PPT。输入标题即可生成大纲和完整PPT内容。',
        rating: 4.6,
        visits: '8M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/05/aippt-icon.png',
        url: 'https://www.aippt.cn',
        pricing: '免费/付费',
        chinese_support: true,
        popularity_score: 94
    },
    {
        id: 5,
        name: '秘塔AI搜索',
        category: 'search',
        tags: ['无广告', '学术搜索', '深度搜索'],
        desc: '最好用的AI搜索工具，没有广告，直达结果。深入理解问题，提供精准答案。',
        rating: 4.8,
        visits: '20M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2024/01/metaso-icon.png',
        url: 'https://metaso.cn',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 97
    },
    {
        id: 6,
        name: '堆友AI',
        category: 'image',
        tags: ['阿里出品', '3D设计', '免费生图'],
        desc: '免费AI绘画和生图神器。阿里巴巴设计师团队推出的AI设计平台。',
        rating: 4.7,
        visits: '15M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/06/d-design-icon.png',
        url: 'https://d.design',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 93
    },
    {
        id: 7,
        name: '白日梦',
        category: 'video',
        tags: ['文生视频', '长视频', '故事创作'],
        desc: 'AI视频创作平台，最长可生成六分钟的视频。光魔科技推出，支持文生视频、动态画面、AI角色生成。',
        rating: 4.6,
        visits: '3M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2024/04/aibrm-icon.png',
        url: 'https://aibrm.com',
        pricing: '免费/付费',
        chinese_support: true,
        popularity_score: 90
    },
    {
        id: 8,
        name: 'Udacity AI学院',
        category: 'learn',
        tags: ['课程', '深度学习', '职业教育'],
        desc: 'Udacity推出的School of AI，从入门到高级的AI学习课程。涵盖机器学习、深度学习、NLP等领域。',
        rating: 4.8,
        visits: '1M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/06/udacity-icon.png',
        url: 'https://www.udacity.com/school-of-ai',
        pricing: '付费',
        chinese_support: false,
        popularity_score: 85
    },
    {
        id: 9,
        name: 'DeepSeek',
        category: 'chat',
        tags: ['开源', '强逻辑', '深度思考'],
        desc: '幻方量化推出的AI智能助手和开源大模型。擅长代码生成与数学推理，中文能力出色。',
        rating: 4.9,
        visits: '30M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/11/deepseek-icon.png',
        url: 'https://chat.deepseek.com',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 99
    },
    {
        id: 10,
        name: 'Kimi智能助手',
        category: 'chat',
        tags: ['长文本', '文件分析', '月之暗面'],
        desc: '月之暗面推出的AI智能助手。支持20万字超长上下文，擅长研报分析与长文总结。',
        rating: 4.8,
        visits: '25M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/10/kimi-chat-icon.png',
        url: 'https://kimi.moonshot.cn',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 97
    },
    {
        id: 11,
        name: '通义千问',
        category: 'chat',
        tags: ['阿里', '全能型', '文档解析'],
        desc: '阿里巴巴推出的超大规模预训练模型。具备多轮对话、文案创作、逻辑推理等能力。',
        rating: 4.7,
        visits: '28M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/04/tongyi-qianwen-icon.png',
        url: 'https://tongyi.aliyun.com',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 96
    },
    {
        id: 12,
        name: '文心一言',
        category: 'chat',
        tags: ['百度', '知识增强', '绘图'],
        desc: '百度推出的基于文心大模型的AI智能助手。能够与人对话互动，回答问题，协助创作。',
        rating: 4.6,
        visits: '40M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/yiyan-baidu-icon.png',
        url: 'https://yiyan.baidu.com',
        pricing: '免费/付费',
        chinese_support: true,
        popularity_score: 95
    },
    {
        id: 13,
        name: 'Midjourney',
        category: 'image',
        tags: ['绘图', '艺术', '高质量'],
        desc: 'AI图像和插画生成工具。目前效果最好的AI绘画工具之一，能够生成照片级逼真且富有艺术感的图像。',
        rating: 4.9,
        visits: '50M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/midjourney-icon.png',
        url: 'https://www.midjourney.com',
        pricing: '付费',
        chinese_support: false,
        popularity_score: 98
    },
    {
        id: 14,
        name: 'Runway',
        category: 'video',
        tags: ['视频编辑', '文生视频', '影视级'],
        desc: '专业的AI视频编辑和生成工具。好莱坞级别的视频制作和后期处理AI软件。',
        rating: 4.8,
        visits: '10M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/runwayml-icon.png',
        url: 'https://runwayml.com',
        pricing: '免费/付费',
        chinese_support: false,
        popularity_score: 94
    },
    {
        id: 15,
        name: 'Suno',
        category: 'audio',
        tags: ['音乐生成', '写歌', '人声'],
        desc: '高质量的AI音乐创作平台。只需输入歌词或描述，即可生成包含人声的完整歌曲。',
        rating: 4.8,
        visits: '15M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/12/suno-ai-icon.png',
        url: 'https://www.suno.ai',
        pricing: '免费/付费',
        chinese_support: false,
        popularity_score: 96
    },
    {
        id: 16,
        name: 'Gamma',
        category: 'office',
        tags: ['PPT', '文档', '网页'],
        desc: 'AI幻灯片演示生成工具。一种新的媒介，可以像文档一样书写，像幻灯片一样展示。',
        rating: 4.8,
        visits: '18M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/gamma-app-icon.png',
        url: 'https://gamma.app',
        pricing: '免费/付费',
        chinese_support: false,
        popularity_score: 95
    },
    {
        id: 17,
        name: 'Perplexity',
        category: 'search',
        tags: ['搜索', '引用', '精准'],
        desc: 'AI搜索引擎与深度研究工具。结合了ChatGPT的对话能力和搜索引擎的实时性。',
        rating: 4.8,
        visits: '22M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/perplexity-ai-icon.png',
        url: 'https://www.perplexity.ai',
        pricing: '免费/付费',
        chinese_support: false,
        popularity_score: 97
    },
    {
        id: 18,
        name: 'Coze',
        category: 'agent',
        tags: ['智能体', '字节跳动', '无代码'],
        desc: '新一代一站式 AI Bot 开发平台。无论你是否有编程基础，都可以快速创建各种类型的 Chat Bot。',
        rating: 4.7,
        visits: '8M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2024/02/coze-icon.png',
        url: 'https://www.coze.cn',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 94
    },
    {
        id: 19,
        name: 'LiblibAI',
        category: 'image',
        tags: ['模型分享', 'Stable Diffusion', '社区'],
        desc: '国内领先的AI图像创作平台和模型分享社区。可以在线运行Stable Diffusion模型。',
        rating: 4.7,
        visits: '10M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/05/liblibai-icon.png',
        url: 'https://www.liblib.ai',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 92
    },
    {
        id: 20,
        name: '稿定AI',
        category: 'image',
        tags: ['设计', '商用', '电商'],
        desc: '一站式AI设计工具集。提供AI绘图、AI设计、AI文案等功能，助力设计提效。',
        rating: 4.6,
        visits: '12M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/05/gaoding-ai-icon.png',
        url: 'https://www.gaoding.com/ai',
        pricing: '免费/付费',
        chinese_support: true,
        popularity_score: 91
    },
    {
        id: 21,
        name: '讯飞星火',
        category: 'chat',
        tags: ['科大讯飞', '语音', '写作'],
        desc: '科大讯飞推出的新一代认知智能大模型。拥有跨领域的知识和语言理解能力。',
        rating: 4.7,
        visits: '20M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/05/xinghuo-xfyun-icon.png',
        url: 'https://xinghuo.xfyun.cn',
        pricing: '免费',
        chinese_support: true,
        popularity_score: 93
    },
    {
        id: 22,
        name: 'ChatGPT',
        category: 'chat',
        tags: ['OpenAI', '基准', '最强'],
        desc: 'OpenAI 推出的AI聊天机器人。开启了AI新时代的革命性产品，GPT-4是目前最强模型之一。',
        rating: 4.9,
        visits: '1.6B+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/chatgpt-icon.png',
        url: 'https://chat.openai.com',
        pricing: '免费/付费',
        chinese_support: true,
        popularity_score: 100
    },
    {
        id: 23,
        name: 'Claude 3',
        category: 'chat',
        tags: ['Anthropic', '长文本', '安全'],
        desc: 'Anthropic公司推出的对话式AI智能助手。在长文本处理和逻辑推理方面表现优异。',
        rating: 4.8,
        visits: '20M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/claude-icon.png',
        url: 'https://claude.ai',
        pricing: '免费/付费',
        chinese_support: false,
        popularity_score: 96
    },
    {
        id: 24,
        name: 'GitHub Copilot',
        category: 'dev',
        tags: ['代码补全', '微软', '插件'],
        desc: 'GitHub推出的AI编程工具。你的AI结对程序员，帮助你更快、更少出错地编写代码。',
        rating: 4.9,
        visits: '15M+',
        logo: 'https://ai-bot.cn/wp-content/uploads/2023/03/github-copilot-icon.png',
        url: 'https://github.com/features/copilot',
        pricing: '付费',
        chinese_support: false,
        popularity_score: 97
    }
];

// DOM 元素缓存
const dom = {};

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 AI方舟 初始化中...');
    
    cacheDOMElements();
    await loadData(); // 改为加载静态数据
    initEventListeners();
    initCategoryNav();
    initFilters();
    renderTools();
    initCompareFeature();
    initFavorites();
    checkLoginStatus();
    
    // 初始化 ECharts 图表
    initCharts();
    
    console.log('✅ AI方舟 初始化完成');
});

function initCharts() {
    if (window.echarts && document.getElementById('stats-chart')) {
        const chart = echarts.init(document.getElementById('stats-chart'));
        const option = {
            tooltip: { trigger: 'item' },
            legend: { show: false },
            series: [
                {
                    name: '工具分类',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: { show: false },
                    emphasis: {
                        label: { show: false }
                    },
                    labelLine: { show: false },
                    data: [
                        { value: 1048, name: 'AI 对话', itemStyle: { color: '#3b82f6' } },
                        { value: 735, name: 'AI 绘画', itemStyle: { color: '#ec4899' } },
                        { value: 580, name: 'AI 写作', itemStyle: { color: '#f59e0b' } },
                        { value: 484, name: 'AI 视频', itemStyle: { color: '#8b5cf6' } },
                        { value: 300, name: '其他', itemStyle: { color: '#cbd5e1' } }
                    ]
                }
            ]
        };
        chart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }
}

// 缓存DOM元素
function cacheDOMElements() {
    dom.toolsGrid = document.getElementById('tools-grid');
    dom.categoryNav = document.getElementById('category-nav');
    dom.mobileCategories = document.getElementById('mobile-categories');
    dom.globalSearch = document.getElementById('global-search');
    dom.mobileSearch = document.getElementById('mobile-search');
    dom.pageTitle = document.getElementById('page-title');
    dom.totalCountBadge = document.getElementById('total-count-badge');
    dom.sortSelect = document.getElementById('sort-select');
    dom.activeFilters = document.getElementById('active-filters');
    dom.noResults = document.getElementById('no-results');
    dom.loadingState = document.getElementById('loading-state');
    dom.loadMoreBtn = document.getElementById('load-more-btn');
    dom.compareBtn = document.getElementById('compare-btn');
    dom.compareCount = document.getElementById('compare-count');
    dom.compareDrawer = document.getElementById('compare-drawer');
    dom.compareItems = document.getElementById('compare-items');
    dom.compareModal = document.getElementById('compare-modal');
    dom.compareTable = document.getElementById('compare-table');
    dom.loginModal = document.getElementById('login-modal');
    dom.loginBtn = document.getElementById('login-btn');
    dom.authSection = document.getElementById('auth-section');
    dom.favoritesBtn = document.getElementById('favorites-btn');
    dom.todayRecommendations = document.getElementById('today-recommendations');
    dom.myCollections = document.getElementById('my-collections');
}

// 加载数据 (改为静态数据)
async function loadData() {
    try {
        dom.loadingState.classList.remove('hidden');
        
        // 模拟网络延迟（可选）
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 使用静态 Mock 数据
        state.categories = MOCK_CATEGORIES;
        state.tools = MOCK_TOOLS;
        state.filteredTools = [...state.tools];
        
        // 更新统计
        if (dom.totalCountBadge) {
            dom.totalCountBadge.textContent = 1428; // Hardcode as requested
        }
        
        // 生成今日推荐
        generateTodayRecommendations();
        
        console.log(`📊 加载了 ${state.tools.length} 个工具，${state.categories.length} 个分类`);
    } catch (error) {
        console.error('❌ 数据加载失败:', error);
        showToast('数据加载失败，请刷新页面重试', 'error');
    } finally {
        dom.loadingState.classList.add('hidden');
    }
}

// 初始化分类导航
function initCategoryNav() {
    if (!state.categories.length) return;
    
    // 桌面端分类导航
    const navHTML = state.categories.map(cat => `
        <div class="category-group" data-category="${cat.id}">
            <button class="category-item w-full flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition mb-1" onclick="selectCategory('${cat.id}')">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm" style="background-color: ${cat.color}">
                    <i class="fa-solid ${cat.icon} text-sm"></i>
                </div>
                <span class="flex-1 text-left">${cat.name}</span>
                <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shadow-inner">
                    ${Math.floor(Math.random() * 100) + 10}
                </span>
            </button>
        </div>
    `).join('');
    
    if (dom.categoryNav) {
        dom.categoryNav.innerHTML = navHTML;
    }
    
    // 移动端分类
    const mobileHTML = state.categories.map(cat => `
        <button class="category-btn-mobile whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2" 
                onclick="selectCategory('${cat.id}')"
                data-id="${cat.id}"
                style="border-color: ${cat.color}20; color: ${cat.color}">
            <i class="fa-solid ${cat.icon}"></i>
            ${cat.name}
        </button>
    `).join('');
    
    if (dom.mobileCategories) {
        dom.mobileCategories.innerHTML = mobileHTML;
    }
}

// 选择分类
window.selectCategory = function(categoryId) {
    state.activeCategory = categoryId;
    state.activeSubcategory = null;
    state.currentPage = 1;
    
    // 更新UI
    document.querySelectorAll('.category-item').forEach(el => {
        el.classList.remove('active');
        if (el.closest('.category-group')?.dataset.category === categoryId) {
            el.classList.add('active');
        }
    });
    
    // 全部分类按钮状态
    const allBtn = document.getElementById('all-categories-btn');
    if (categoryId === 'all') {
        allBtn?.classList.add('active');
    } else {
        allBtn?.classList.remove('active');
    }
    
    // 更新标题
    if (categoryId === 'all') {
        if (dom.pageTitle) dom.pageTitle.textContent = '全部工具';
    } else {
        const category = state.categories.find(c => c.id === categoryId);
        if (dom.pageTitle && category) {
            dom.pageTitle.textContent = category.name;
        }
    }
    
    applyFilters();
};

// 选择子分类
window.selectSubcategory = function(categoryId, subcategory) {
    state.activeCategory = categoryId;
    state.activeSubcategory = subcategory;
    state.currentPage = 1;
    
    if (dom.pageTitle) {
        dom.pageTitle.textContent = subcategory;
    }
    
    applyFilters();
    event.stopPropagation();
};

// 初始化筛选器
function initFilters() {
    // 价格筛选
    document.querySelectorAll('.filter-pricing').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const values = Array.from(document.querySelectorAll('.filter-pricing:checked')).map(cb => cb.value);
            state.filters.pricing = values;
            state.currentPage = 1;
            applyFilters();
        });
    });
    
    // 中文支持筛选
    const chineseFilter = document.getElementById('filter-chinese');
    if (chineseFilter) {
        chineseFilter.addEventListener('change', () => {
            state.filters.chinese = chineseFilter.checked;
            state.currentPage = 1;
            applyFilters();
        });
    }
    
    // 排序
    if (dom.sortSelect) {
        dom.sortSelect.addEventListener('change', () => {
            state.sortBy = dom.sortSelect.value;
            applyFilters();
        });
    }
}

// 应用筛选
function applyFilters() {
    let filtered = [...state.tools];
    
    // 分类筛选
    if (state.activeCategory !== 'all') {
        filtered = filtered.filter(t => t.category === state.activeCategory);
    }
    
    // 搜索筛选
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(query) ||
            t.desc.toLowerCase().includes(query) ||
            t.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    // 价格筛选
    if (state.filters.pricing.length > 0) {
        filtered = filtered.filter(t => {
            const pricing = t.pricing_type || (t.pricing.includes('免费') ? 'free' : 'paid');
            return state.filters.pricing.includes(pricing);
        });
    }
    
    // 中文支持筛选
    if (state.filters.chinese) {
        filtered = filtered.filter(t => t.chinese_support);
    }
    
    // 排序
    switch (state.sortBy) {
        case 'popular':
            filtered.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
            break;
    }
    
    state.filteredTools = filtered;
    state.currentPage = 1;
    
    updateActiveFilters();
    renderTools();
}

// 更新活跃筛选标签
function updateActiveFilters() {
    if (!dom.activeFilters) return;
    
    const filters = [];
    
    if (state.activeCategory !== 'all') {
        const cat = state.categories.find(c => c.id === state.activeCategory);
        filters.push({
            text: cat?.name || state.activeCategory,
            onRemove: () => selectCategory('all')
        });
    }
    
    if (state.searchQuery) {
        filters.push({
            text: `搜索: ${state.searchQuery}`,
            onRemove: () => {
                state.searchQuery = '';
                dom.globalSearch.value = '';
                dom.mobileSearch.value = '';
                applyFilters();
            }
        });
    }
    
    if (filters.length === 0) {
        dom.activeFilters.classList.add('hidden');
        return;
    }
    
    dom.activeFilters.innerHTML = filters.map(f => `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
            ${f.text}
            <button onclick="(${f.onRemove})()" class="ml-2 text-blue-400 hover:text-blue-600">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join('');
    
    dom.activeFilters.classList.remove('hidden');
}

// 渲染工具列表
function renderTools() {
    if (!dom.toolsGrid) return;
    
    const start = 0;
    const end = state.currentPage * state.itemsPerPage;
    const toolsToShow = state.filteredTools.slice(start, end);
    
    if (toolsToShow.length === 0) {
        dom.toolsGrid.innerHTML = '';
        dom.noResults.classList.remove('hidden');
        dom.loadMoreBtn.classList.add('hidden');
        return;
    }
    
    dom.noResults.classList.add('hidden');
    
    const html = toolsToShow.map(tool => createToolCard(tool)).join('');
    dom.toolsGrid.innerHTML = html;
    
    // 显示/隐藏加载更多按钮
    if (state.filteredTools.length > end) {
        dom.loadMoreBtn.classList.remove('hidden');
    } else {
        dom.loadMoreBtn.classList.add('hidden');
    }
}

// 创建工具卡片
function createToolCard(tool) {
    const category = state.categories.find(c => c.id === tool.category);
    const isFavorite = state.favorites.includes(tool.id);
    const isInCompare = state.compareList.includes(tool.id);
    
    return `
        <div class="tool-card bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl cursor-pointer group animate-fade-in" data-tool-id="${tool.id}" onclick="showToolDetail(${tool.id})">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src="${tool.logo}" alt="${tool.name}" class="w-full h-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=64'">
                    </div>
                    <div class="min-w-0">
                        <h3 class="font-bold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors">${tool.name}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs px-2 py-0.5 rounded-full" style="background-color: ${category?.color || '#3b82f6'}20; color: ${category?.color || '#3b82f6'}">
                                ${category?.name || tool.category}
                            </span>
                            ${tool.chinese_support ? '<span class="text-xs text-red-500" title="中文支持">🇨🇳</span>' : ''}
                        </div>
                    </div>
                </div>
                <button onclick="toggleFavorite(${tool.id}, event)" class="text-slate-300 hover:text-red-500 transition ${isFavorite ? 'text-red-500' : ''}">
                    <i class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
            
            <!-- Description -->
            <p class="text-slate-500 text-sm line-clamp-2 mb-4 h-10">${tool.desc}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
                ${tool.tags.slice(0, 3).map(tag => `
                    <span class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">${tag}</span>
                `).join('')}
            </div>
            
            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                <div class="flex items-center gap-3 text-xs text-slate-400">
                    <span class="flex items-center gap-1">
                        <i class="fa-solid fa-star text-amber-400"></i>
                        ${tool.rating || '-'}
                    </span>
                    <span class="flex items-center gap-1">
                        <i class="fa-regular fa-eye"></i>
                        ${tool.visits || '-'}
                    </span>
                </div>
                
                <div class="flex items-center gap-2">
                    <button onclick="window.open('${tool.url}', '_blank'); event.stopPropagation();" class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                        访问
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 初始化事件监听
function initEventListeners() {
    // 搜索
    if (dom.globalSearch) {
        dom.globalSearch.addEventListener('input', debounce((e) => {
            state.searchQuery = e.target.value;
            state.currentPage = 1;
            applyFilters();
        }, 300));
        
        // Ctrl+K 快捷键
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                dom.globalSearch.focus();
            }
        });
    }
    
    // 移动端搜索
    if (dom.mobileSearch) {
        dom.mobileSearch.addEventListener('input', debounce((e) => {
            state.searchQuery = e.target.value;
            state.currentPage = 1;
            applyFilters();
        }, 300));
    }
    
    // 加载更多
    if (dom.loadMoreBtn) {
        dom.loadMoreBtn.addEventListener('click', () => {
            state.currentPage++;
            renderTools();
        });
    }
    
    // 登录按钮
    if (dom.loginBtn) {
        dom.loginBtn.addEventListener('click', () => {
            dom.loginModal.classList.remove('hidden');
        });
    }
    
    // 全部分类按钮
    const allCategoriesBtn = document.getElementById('all-categories-btn');
    if (allCategoriesBtn) {
        allCategoriesBtn.addEventListener('click', () => {
            selectCategory('all');
        });
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 对比功能
function initCompareFeature() {
    updateCompareUI();
}

window.toggleCompare = function(toolId) {
    const index = state.compareList.indexOf(toolId);
    
    if (index > -1) {
        state.compareList.splice(index, 1);
    } else {
        if (state.compareList.length >= 4) {
            showToast('最多只能对比4个工具', 'warning');
            return;
        }
        state.compareList.push(toolId);
    }
    
    updateCompareUI();
    renderTools(); // 重新渲染以更新checkbox状态
};

function updateCompareUI() {
    const count = state.compareList.length;
    
    // 更新对比按钮
    if (dom.compareCount) {
        dom.compareCount.textContent = count;
        dom.compareCount.classList.toggle('hidden', count === 0);
    }
    
    // 更新对比抽屉
    if (count > 0) {
        dom.compareDrawer.classList.remove('translate-y-full');
        
        const tools = state.compareList.map(id => state.tools.find(t => t.id === id)).filter(Boolean);
        dom.compareItems.innerHTML = tools.map(tool => `
            <div class="flex-shrink-0 w-32 bg-slate-50 rounded-lg p-2 relative">
                <button onclick="toggleCompare(${tool.id})" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${tool.logo}" class="w-8 h-8 rounded mx-auto mb-1">
                <p class="text-xs text-center truncate">${tool.name}</p>
            </div>
        `).join('');
        
        document.getElementById('compare-drawer-count').textContent = count;
    } else {
        dom.compareDrawer.classList.add('translate-y-full');
    }
}

window.clearCompare = function() {
    state.compareList = [];
    updateCompareUI();
    renderTools();
};

window.toggleCompareDrawer = function() {
    dom.compareDrawer.classList.toggle('translate-y-full');
};

window.startCompare = function() {
    if (state.compareList.length < 2) {
        showToast('请至少选择2个工具进行对比', 'warning');
        return;
    }
    
    const tools = state.compareList.map(id => state.tools.find(t => t.id === id)).filter(Boolean);
    
    // 生成对比表格
    const rows = [
        { label: '工具名称', key: 'name' },
        { label: '分类', key: 'category', render: (v) => state.categories.find(c => c.id === v)?.name || v },
        { label: '评分', key: 'rating' },
        { label: '访问量', key: 'visits' },
        { label: '价格', key: 'pricing' },
        { label: '中文支持', key: 'chinese_support', render: (v) => v ? '✅' : '❌' },
        { label: '描述', key: 'desc' }
    ];
    
    dom.compareTable.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b border-slate-200">
                    <th class="text-left py-3 px-4 font-semibold text-slate-700">对比项</th>
                    ${tools.map(tool => `
                        <th class="text-center py-3 px-4">
                            <div class="flex flex-col items-center">
                                <img src="${tool.logo}" class="w-10 h-10 rounded-lg mb-2">
                                <span class="font-semibold text-slate-900">${tool.name}</span>
                            </div>
                        </th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${rows.map(row => `
                    <tr class="border-b border-slate-100">
                        <td class="py-3 px-4 font-medium text-slate-600">${row.label}</td>
                        ${tools.map(tool => `
                            <td class="py-3 px-4 text-center text-slate-700">
                                ${row.render ? row.render(tool[row.key]) : (tool[row.key] || '-')}
                            </td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    dom.compareModal.classList.remove('hidden');
};

window.closeCompareModal = function() {
    dom.compareModal.classList.add('hidden');
};

// 收藏功能
function initFavorites() {
    updateFavoritesUI();
}

window.toggleFavorite = function(toolId, event) {
    if (event) event.stopPropagation();
    
    const index = state.favorites.indexOf(toolId);
    
    if (index > -1) {
        state.favorites.splice(index, 1);
        showToast('已取消收藏', 'info');
    } else {
        state.favorites.push(toolId);
        showToast('已添加到收藏', 'success');
    }
    
    localStorage.setItem('aiark_favorites', JSON.stringify(state.favorites));
    updateFavoritesUI();
    renderTools();
};

function updateFavoritesUI() {
    // 更新收藏按钮状态
    if (dom.favoritesBtn) {
        const count = state.favorites.length;
        dom.favoritesBtn.innerHTML = `
            <i class="${count > 0 ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart mr-2"></i>
            收藏${count > 0 ? ` (${count})` : ''}
        `;
    }
    
    // 更新我的收藏区域
    if (dom.myCollections) {
        if (state.favorites.length === 0) {
            dom.myCollections.innerHTML = `
                <div class="text-center py-4 text-slate-400 text-sm">
                    <i class="fa-regular fa-folder-open text-3xl mb-2"></i>
                    <p>暂无收藏工具</p>
                </div>
            `;
        } else {
            const tools = state.favorites.map(id => state.tools.find(t => t.id === id)).filter(Boolean);
            dom.myCollections.innerHTML = tools.slice(0, 5).map(tool => `
                <div class="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer" onclick="showToolDetail(${tool.id})">
                    <img src="${tool.logo}" class="w-8 h-8 rounded">
                    <span class="text-sm text-slate-700 truncate flex-1">${tool.name}</span>
                </div>
            `).join('');
        }
    }
}

// 生成今日推荐
async function generateTodayRecommendations() {
    if (!dom.todayRecommendations || !state.tools.length) return;
    
    const recommendations = [...state.tools]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    dom.todayRecommendations.innerHTML = recommendations.map(tool => `
        <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition" onclick="showToolDetail(${tool.id})">
            <img src="${tool.logo}" class="w-10 h-10 rounded-lg">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">${tool.name}</p>
                <p class="text-xs text-slate-500 truncate">${tool.desc.slice(0, 30)}...</p>
            </div>
            <span class="text-xs text-amber-500">
                <i class="fa-solid fa-star"></i> ${tool.rating}
            </span>
        </div>
    `).join('');
}

// 登录相关
function checkLoginStatus() {
    const savedUser = localStorage.getItem('aiark_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        state.isLoggedIn = true;
        updateLoginUI();
    }
}

function updateLoginUI() {
    if (state.isLoggedIn && dom.authSection) {
        dom.authSection.innerHTML = `
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-bold text-slate-800">Hi, ${state.user.userName || '用户'}</p>
                    <p class="text-[10px] text-green-600 font-medium">已登录</p>
                </div>
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-user text-sm"></i>
                </div>
            </div>
        `;
    }
}

window.closeLoginModal = function() {
    dom.loginModal.classList.add('hidden');
};

// 工具详情
window.showToolDetail = function(toolId) {
    const tool = state.tools.find(t => t.id === toolId);
    if (!tool) return;
    
    window.open(tool.url, '_blank');
};

// 重置所有筛选
window.resetAllFilters = function() {
    state.activeCategory = 'all';
    state.activeSubcategory = null;
    state.searchQuery = '';
    state.filters.pricing = [];
    state.filters.chinese = false;
    
    dom.globalSearch.value = '';
    dom.mobileSearch.value = '';
    document.querySelectorAll('.filter-pricing').forEach(cb => cb.checked = false);
    document.getElementById('filter-chinese').checked = false;
    
    selectCategory('all');
};

// Toast 通知
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 导出全局函数
window.showToast = showToast;
