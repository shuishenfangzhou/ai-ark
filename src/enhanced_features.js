/**
 * AI工具导航 - 增强功能模块
 * 支持高级筛选、详情页优化、运营功能
 */

// 增强的筛选状态
let enhancedState = {
    filters: {
        pricing: 'all',        // all, free, paid, open_source, freemium
        chineseSupport: 'all', // all, yes, no
        category: 'all',
        subcategory: 'all',
        rating: 0,             // 最低评分
        popularity: 0          // 最低热度
    },
    sort: {
        by: 'popularity',      // popularity, rating, name, updated
        order: 'desc'          // desc, asc
    },
    view: {
        mode: 'grid',          // grid, list, compact
        itemsPerPage: 36
    }
};

// 增强的分类数据
let enhancedCategories = {};
let toolsStatistics = {};

/**
 * 初始化增强功能
 */
function initEnhancedFeatures() {
    loadEnhancedData();
    setupAdvancedFilters();
    setupViewControls();
    setupSortingControls();
    setupFavoriteSystem();
    setupToolSubmission();
}

/**
 * 加载增强数据
 */
async function loadEnhancedData() {
    try {
        const response = await fetch('/toolsData.json');
        const data = await response.json();
        
        if (data.categories) {
            enhancedCategories = data.categories;
        }
        
        if (data.statistics) {
            toolsStatistics = data.statistics;
            updateStatisticsDisplay();
        }
        
        // 更新工具数据
        if (data.tools) {
            aiToolsData = data.tools;
        }
        
        console.log('Enhanced data loaded:', {
            tools: aiToolsData.length,
            categories: Object.keys(enhancedCategories).length,
            stats: toolsStatistics
        });
        
    } catch (error) {
        console.warn('Failed to load enhanced data, using fallback');
    }
}

/**
 * 设置高级筛选器
 */
function setupAdvancedFilters() {
    const filtersContainer = document.createElement('div');
    filtersContainer.id = 'advanced-filters';
    filtersContainer.className = 'bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm';
    
    filtersContainer.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-slate-900 flex items-center">
                <i class="fa-solid fa-filter mr-2 text-blue-500"></i>
                高级筛选
            </h3>
            <button id="toggle-filters" class="text-sm text-slate-500 hover:text-blue-600">
                <i class="fa-solid fa-chevron-down"></i> 展开
            </button>
        </div>
        
        <div id="filters-content" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- 定价筛选 -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">定价模式</label>
                <select id="pricing-filter" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                    <option value="all">全部</option>
                    <option value="free">免费</option>
                    <option value="paid">付费</option>
                    <option value="open_source">开源</option>
                    <option value="freemium">免费试用</option>
                </select>
            </div>
            
            <!-- 中文支持 -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">中文支持</label>
                <select id="chinese-filter" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                    <option value="all">全部</option>
                    <option value="yes">支持中文</option>
                    <option value="no">仅英文</option>
                </select>
            </div>
            
            <!-- 评分筛选 -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">最低评分</label>
                <select id="rating-filter" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                    <option value="0">全部</option>
                    <option value="4.0">4.0+ ⭐</option>
                    <option value="4.5">4.5+ ⭐⭐</option>
                    <option value="4.8">4.8+ ⭐⭐⭐</option>
                </select>
            </div>
            
            <!-- 热度筛选 -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">热度</label>
                <select id="popularity-filter" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                    <option value="0">全部</option>
                    <option value="70">热门 (70+)</option>
                    <option value="85">火爆 (85+)</option>
                    <option value="95">爆款 (95+)</option>
                </select>
            </div>
        </div>
        
        <div id="active-filters" class="mt-4 flex flex-wrap gap-2"></div>
    `;
    
    // 插入到主内容区域
    const mainContent = document.querySelector('main');
    const homeView = document.getElementById('home-view');
    if (homeView) {
        homeView.insertBefore(filtersContainer, homeView.firstChild);
    }
    
    // 绑定事件
    setupFilterEvents();
}

/**
 * 设置筛选器事件
 */
function setupFilterEvents() {
    // 展开/收起筛选器
    const toggleBtn = document.getElementById('toggle-filters');
    const filtersContent = document.getElementById('filters-content');
    
    if (toggleBtn && filtersContent) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = filtersContent.classList.contains('hidden');
            filtersContent.classList.toggle('hidden');
            toggleBtn.innerHTML = isHidden ? 
                '<i class="fa-solid fa-chevron-up"></i> 收起' : 
                '<i class="fa-solid fa-chevron-down"></i> 展开';
        });
    }
    
    // 筛选器变化事件
    const filters = ['pricing-filter', 'chinese-filter', 'rating-filter', 'popularity-filter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', handleFilterChange);
        }
    });
}

/**
 * 处理筛选器变化
 */
function handleFilterChange() {
    // 更新筛选状态
    enhancedState.filters.pricing = document.getElementById('pricing-filter')?.value || 'all';
    enhancedState.filters.chineseSupport = document.getElementById('chinese-filter')?.value || 'all';
    enhancedState.filters.rating = parseFloat(document.getElementById('rating-filter')?.value || 0);
    enhancedState.filters.popularity = parseInt(document.getElementById('popularity-filter')?.value || 0);
    
    // 应用筛选
    applyEnhancedFilters();
    
    // 更新活动筛选器显示
    updateActiveFiltersDisplay();
}

/**
 * 应用增强筛选
 */
function applyEnhancedFilters() {
    let filtered = aiToolsData.filter(tool => {
        // 基础筛选（分类、搜索）
        const matchesCategory = enhancedState.filters.category === 'all' || tool.category === enhancedState.filters.category;
        const matchesSearch = !state.searchQuery || 
            tool.name.toLowerCase().includes(state.searchQuery) || 
            tool.desc.toLowerCase().includes(state.searchQuery) ||
            tool.tags.some(t => t.toLowerCase().includes(state.searchQuery));
        
        // 增强筛选
        const matchesPricing = enhancedState.filters.pricing === 'all' || tool.pricing_type === enhancedState.filters.pricing;
        const matchesChinese = enhancedState.filters.chineseSupport === 'all' || 
            (enhancedState.filters.chineseSupport === 'yes' && tool.chinese_support) ||
            (enhancedState.filters.chineseSupport === 'no' && !tool.chinese_support);
        const matchesRating = tool.rating >= enhancedState.filters.rating;
        const matchesPopularity = (tool.popularity_score || 0) >= enhancedState.filters.popularity;
        
        return matchesCategory && matchesSearch && matchesPricing && matchesChinese && matchesRating && matchesPopularity;
    });
    
    // 排序
    filtered = sortTools(filtered);
    
    // 更新显示
    state.filteredData = filtered;
    state.displayedTools = [];
    dom.toolsGrid.innerHTML = '';
    
    // 重新加载
    loadMoreTools();
    
    // 更新无结果显示
    const noResults = document.getElementById('no-results');
    if (filtered.length === 0) {
        noResults?.classList.remove('hidden');
    } else {
        noResults?.classList.add('hidden');
    }
}

/**
 * 工具排序
 */
function sortTools(tools) {
    return tools.sort((a, b) => {
        let aValue, bValue;
        
        switch (enhancedState.sort.by) {
            case 'popularity':
                aValue = a.popularity_score || 0;
                bValue = b.popularity_score || 0;
                break;
            case 'rating':
                aValue = a.rating || 0;
                bValue = b.rating || 0;
                break;
            case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case 'updated':
                aValue = new Date(a.last_updated || '2026-01-01');
                bValue = new Date(b.last_updated || '2026-01-01');
                break;
            default:
                return 0;
        }
        
        if (enhancedState.sort.order === 'desc') {
            return bValue > aValue ? 1 : -1;
        } else {
            return aValue > bValue ? 1 : -1;
        }
    });
}

/**
 * 更新活动筛选器显示
 */
function updateActiveFiltersDisplay() {
    const container = document.getElementById('active-filters');
    if (!container) return;
    
    const activeFilters = [];
    
    // 检查各个筛选器
    if (enhancedState.filters.pricing !== 'all') {
        const labels = { free: '免费', paid: '付费', open_source: '开源', freemium: '免费试用' };
        activeFilters.push({
            type: 'pricing',
            label: `定价: ${labels[enhancedState.filters.pricing]}`,
            value: enhancedState.filters.pricing
        });
    }
    
    if (enhancedState.filters.chineseSupport !== 'all') {
        const label = enhancedState.filters.chineseSupport === 'yes' ? '支持中文' : '仅英文';
        activeFilters.push({
            type: 'chineseSupport',
            label: `语言: ${label}`,
            value: enhancedState.filters.chineseSupport
        });
    }
    
    if (enhancedState.filters.rating > 0) {
        activeFilters.push({
            type: 'rating',
            label: `评分: ${enhancedState.filters.rating}+`,
            value: enhancedState.filters.rating
        });
    }
    
    if (enhancedState.filters.popularity > 0) {
        activeFilters.push({
            type: 'popularity',
            label: `热度: ${enhancedState.filters.popularity}+`,
            value: enhancedState.filters.popularity
        });
    }
    
    // 渲染活动筛选器
    container.innerHTML = activeFilters.map(filter => `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ${filter.label}
            <button class="ml-2 hover:text-blue-900" onclick="removeFilter('${filter.type}')">
                <i class="fa-solid fa-times"></i>
            </button>
        </span>
    `).join('');
    
    // 如果有活动筛选器，显示清除全部按钮
    if (activeFilters.length > 0) {
        container.innerHTML += `
            <button onclick="clearAllFilters()" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                <i class="fa-solid fa-trash mr-1"></i> 清除全部
            </button>
        `;
    }
}

/**
 * 移除单个筛选器
 */
window.removeFilter = function(filterType) {
    switch (filterType) {
        case 'pricing':
            enhancedState.filters.pricing = 'all';
            document.getElementById('pricing-filter').value = 'all';
            break;
        case 'chineseSupport':
            enhancedState.filters.chineseSupport = 'all';
            document.getElementById('chinese-filter').value = 'all';
            break;
        case 'rating':
            enhancedState.filters.rating = 0;
            document.getElementById('rating-filter').value = '0';
            break;
        case 'popularity':
            enhancedState.filters.popularity = 0;
            document.getElementById('popularity-filter').value = '0';
            break;
    }
    
    applyEnhancedFilters();
    updateActiveFiltersDisplay();
};

/**
 * 清除所有筛选器
 */
window.clearAllFilters = function() {
    enhancedState.filters = {
        pricing: 'all',
        chineseSupport: 'all',
        category: 'all',
        subcategory: 'all',
        rating: 0,
        popularity: 0
    };
    
    // 重置表单
    document.getElementById('pricing-filter').value = 'all';
    document.getElementById('chinese-filter').value = 'all';
    document.getElementById('rating-filter').value = '0';
    document.getElementById('popularity-filter').value = '0';
    
    applyEnhancedFilters();
    updateActiveFiltersDisplay();
};

/**
 * 设置收藏系统
 */
function setupFavoriteSystem() {
    // 从localStorage加载收藏
    const favorites = JSON.parse(localStorage.getItem('ai-tools-favorites') || '[]');
    
    // 添加收藏按钮事件处理
    document.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            const toolId = parseInt(e.target.closest('.favorite-btn').dataset.toolId);
            toggleFavorite(toolId);
        }
    });
}

/**
 * 切换收藏状态
 */
function toggleFavorite(toolId) {
    let favorites = JSON.parse(localStorage.getItem('ai-tools-favorites') || '[]');
    
    if (favorites.includes(toolId)) {
        favorites = favorites.filter(id => id !== toolId);
    } else {
        favorites.push(toolId);
    }
    
    localStorage.setItem('ai-tools-favorites', JSON.stringify(favorites));
    
    // 更新UI
    updateFavoriteButtons();
    
    // 显示提示
    showToast(favorites.includes(toolId) ? '已添加到收藏' : '已取消收藏');
}

/**
 * 更新收藏按钮状态
 */
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('ai-tools-favorites') || '[]');
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const toolId = parseInt(btn.dataset.toolId);
        const isFavorited = favorites.includes(toolId);
        
        btn.innerHTML = isFavorited ? 
            '<i class="fa-solid fa-heart text-red-500"></i>' : 
            '<i class="fa-regular fa-heart"></i>';
        
        btn.title = isFavorited ? '取消收藏' : '添加收藏';
    });
}

/**
 * 设置工具提交功能
 */
function setupToolSubmission() {
    const submitBtn = document.querySelector('button:contains("提交工具")');
    if (submitBtn) {
        submitBtn.addEventListener('click', openSubmissionModal);
    }
}

/**
 * 打开提交工具模态框
 */
function openSubmissionModal() {
    // 创建模态框HTML
    const modalHTML = `
        <div id="submission-modal" class="fixed inset-0 z-[100] overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-slate-900/50 transition-opacity backdrop-blur-sm"></div>
                <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-6 pt-6 pb-4">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-slate-900">提交AI工具</h3>
                            <button onclick="closeSubmissionModal()" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                        
                        <form id="tool-submission-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">工具名称 *</label>
                                <input type="text" name="name" required class="w-full border border-slate-300 rounded-lg px-3 py-2">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">官方网址 *</label>
                                <input type="url" name="url" required class="w-full border border-slate-300 rounded-lg px-3 py-2">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">工具描述 *</label>
                                <textarea name="description" required rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">分类</label>
                                <select name="category" class="w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="text">AI写作工具</option>
                                    <option value="image">AI图像工具</option>
                                    <option value="video">AI视频工具</option>
                                    <option value="audio">AI音频工具</option>
                                    <option value="code">AI编程工具</option>
                                    <option value="office">AI办公工具</option>
                                    <option value="other">其他</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">联系邮箱</label>
                                <input type="email" name="email" class="w-full border border-slate-300 rounded-lg px-3 py-2">
                            </div>
                        </form>
                    </div>
                    
                    <div class="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
                        <button onclick="closeSubmissionModal()" class="px-4 py-2 text-slate-600 hover:text-slate-800">取消</button>
                        <button onclick="submitTool()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">提交</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * 关闭提交模态框
 */
window.closeSubmissionModal = function() {
    const modal = document.getElementById('submission-modal');
    if (modal) {
        modal.remove();
    }
};

/**
 * 提交工具
 */
window.submitTool = function() {
    const form = document.getElementById('tool-submission-form');
    const formData = new FormData(form);
    
    // 这里可以发送到后端API
    // 现在先模拟提交成功
    showToast('提交成功！我们会在24小时内审核您的工具。', 'success');
    closeSubmissionModal();
};

/**
 * 显示提示消息
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full`;
    
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-500');
            break;
        case 'error':
            toast.classList.add('bg-red-500');
            break;
        default:
            toast.classList.add('bg-blue-500');
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 更新统计显示
 */
function updateStatisticsDisplay() {
    if (!toolsStatistics) return;
    
    // 更新总数
    const totalCountElement = document.getElementById('total-tools-count');
    if (totalCountElement) {
        totalCountElement.textContent = toolsStatistics.total_tools || aiToolsData.length;
    }
    
    // 更新中文支持数量
    const chineseCountElement = document.getElementById('chinese-support-count');
    if (chineseCountElement) {
        chineseCountElement.textContent = toolsStatistics.chinese_support_count || 0;
    }
}

// 导出函数供全局使用
window.enhancedFeatures = {
    init: initEnhancedFeatures,
    applyFilters: applyEnhancedFilters,
    toggleFavorite: toggleFavorite,
    showToast: showToast
};

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保主脚本已加载
    setTimeout(initEnhancedFeatures, 1000);
});