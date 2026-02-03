// src/scripts/main.js
// 完整交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Ark v2.0 loaded');
    
    // ============ 搜索功能 ============
    const globalSearch = document.getElementById('global-search');
    const mobileSearch = document.getElementById('mobile-search');
    
    function handleSearch(keyword) {
        if (keyword.trim()) {
            console.log('搜索：', keyword);
            currentFilters.search = keyword.toLowerCase().trim();
            applyFilters();
        } else {
            currentFilters.search = '';
            applyFilters();
        }
    }
    
    globalSearch?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleSearch(this.value);
        }
    });
    
    mobileSearch?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleSearch(this.value);
        }
    });
    
    // Ctrl+K 快捷键
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            globalSearch?.focus();
        }
    });
    
    // ============ 移动端侧边栏 ============
    const mobileSidebarTrigger = document.getElementById('mobile-sidebar-trigger');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    const sidebarContainer = document.getElementById('sidebar-container');
    
    function toggleMobileSidebar() {
        sidebarContainer?.classList.toggle('translate-x-[-100%]');
        mobileSidebarOverlay?.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }
    
    mobileSidebarTrigger?.addEventListener('click', toggleMobileSidebar);
    
    mobileSidebarOverlay?.addEventListener('click', toggleMobileSidebar);
    
    // ============ 分类导航 ============
    const categoryItems = document.querySelectorAll('.category-item');
    const allCategoriesBtn = document.getElementById('all-categories-btn');
    const pageTitle = document.getElementById('page-title');
    
    // Global filter state
    const currentFilters = {
        category: null,
        search: '',
        pricing: [],
        chinese: false,
        sort: 'popular'
    };
    
    // Current visible tools (for load more)
    let visibleCount = 24;
    const TOOLS_PER_PAGE = 24;
    
    function setActiveCategory(element) {
        categoryItems.forEach(i => i.classList.remove('active'));
        element?.classList.add('active');
    }
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            setActiveCategory(this);
            const categoryName = this.querySelector('span')?.textContent;
            if (categoryName && pageTitle) {
                pageTitle.textContent = categoryName;
            }
            // 实现分类筛选
            currentFilters.category = categoryName === '全部' ? null : categoryName;
            applyFilters();
        });
    });
    
    allCategoriesBtn?.addEventListener('click', function() {
        setActiveCategory(null);
        if (pageTitle) {
            pageTitle.textContent = '全部工具';
        }
        currentFilters.category = null;
        applyFilters();
    });
    
    // ============ 对比功能 ============
    const compareBtn = document.getElementById('compare-btn');
    const compareModal = document.getElementById('compare-modal');
    const closeCompareModal = document.getElementById('close-compare-modal');
    const clearCompare = document.getElementById('clear-compare');
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const compareCount = document.getElementById('compare-count');
    
    compareBtn?.addEventListener('click', function() {
        compareModal?.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    
    closeCompareModal?.addEventListener('click', function() {
        compareModal?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
    
    clearCompare?.addEventListener('click', function() {
        compareCheckboxes.forEach(cb => cb.checked = false);
        updateCompareCount();
    });
    
    function updateCompareCount() {
        const count = document.querySelectorAll('.compare-checkbox:checked').length;
        if (compareCount) {
            if (count > 0) {
                compareCount.textContent = count;
                compareCount.classList.remove('hidden');
            } else {
                compareCount.classList.add('hidden');
            }
        }
    }
    
    compareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCompareCount);
    });
    
    // ============ 收藏功能 ============
    const favoritesBtn = document.getElementById('favorites-btn');
    const favoritesModal = document.getElementById('favorites-modal');
    const closeFavoritesModal = document.getElementById('close-favorites-modal');
    const clearAllFavorites = document.getElementById('clear-all-favorites');
    const favoriteButtons = document.querySelectorAll('[id^="fav-"]');
    
    favoritesBtn?.addEventListener('click', function() {
        favoritesModal?.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    
    closeFavoritesModal?.addEventListener('click', function() {
        favoritesModal?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
    
    clearAllFavorites?.addEventListener('click', function() {
        // TODO: 清空所有收藏
        console.log('清空所有收藏');
    });
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-regular')) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid', 'text-red-500');
                } else {
                    icon.classList.remove('fa-solid', 'text-red-500');
                    icon.classList.add('fa-regular');
                }
            }
        });
    });
    
    // ============ 筛选功能 ============
    const pricingFilters = document.querySelectorAll('.filter-pricing');
    const chineseFilter = document.getElementById('filter-chinese');
    
    function updateActiveFiltersDisplay() {
        const activeFilters = document.getElementById('active-filters');
        if (!activeFilters) return;
        
        let filtersHtml = '';
        
        if (currentFilters.category) {
            filtersHtml += `
                <div class="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm">
                    <span>${currentFilters.category}</span>
                    <button class="ml-2 text-blue-400 hover:text-blue-600" onclick="resetCategory()">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
            `;
        }
        
        if (currentFilters.search) {
            filtersHtml += `
                <div class="flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm">
                    <span>搜索: ${currentFilters.search}</span>
                    <button class="ml-2 text-green-400 hover:text-green-600" onclick="resetSearch()">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
            `;
        }
        
        if (currentFilters.pricing.length > 0) {
            currentFilters.pricing.forEach(p => {
                const label = p === 'free' ? '免费' : p === 'freemium' ? ' freemium' : p === 'paid' ? '付费' : p;
                filtersHtml += `
                    <div class="flex items-center bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm">
                        <span>${label}</span>
                        <button class="ml-2 text-purple-400 hover:text-purple-600" onclick="removePricingFilter('${p}')">
                            <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                    </div>
                `;
            });
        }
        
        if (currentFilters.chinese) {
            filtersHtml += `
                <div class="flex items-center bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-sm">
                    <span>🇨🇳 中文</span>
                    <button class="ml-2 text-orange-400 hover:text-orange-600" onclick="resetChineseFilter()">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
            `;
        }
        
        activeFilters.innerHTML = filtersHtml;
    }
    
    // Global functions for filter buttons
    window.resetCategory = function() {
        currentFilters.category = null;
        setActiveCategory(null);
        if (pageTitle) pageTitle.textContent = '全部工具';
        applyFilters();
    };
    
    window.resetSearch = function() {
        currentFilters.search = '';
        const globalSearch = document.getElementById('global-search');
        const mobileSearch = document.getElementById('mobile-search');
        if (globalSearch) globalSearch.value = '';
        if (mobileSearch) mobileSearch.value = '';
        applyFilters();
    };
    
    window.removePricingFilter = function(value) {
        currentFilters.pricing = currentFilters.pricing.filter(p => p !== value);
        const filter = document.querySelector(`.filter-pricing[value="${value}"]`);
        if (filter) filter.checked = false;
        applyFilters();
    };
    
    window.resetChineseFilter = function() {
        currentFilters.chinese = false;
        const chineseFilter = document.getElementById('filter-chinese');
        if (chineseFilter) chineseFilter.checked = false;
        applyFilters();
    };
    
    function updateLoadMoreButton(totalVisible) {
        const loadMoreBtn = document.getElementById('load-more-btn');
        const noMoreData = document.getElementById('no-more-data');
        const loadingState = document.getElementById('loading-state');
        
        if (loadMoreBtn) {
            if (visibleCount >= totalVisible) {
                loadMoreBtn.classList.add('hidden');
                if (noMoreData) noMoreData.classList.remove('hidden');
            } else {
                loadMoreBtn.classList.remove('hidden');
                loadMoreBtn.innerHTML = '<i class="fa-solid fa-refresh mr-2"></i> 加载更多';
                if (noMoreData) noMoreData.classList.add('hidden');
            }
        }
        
        if (loadingState) loadingState.classList.add('hidden');
    }
    
    function applyFilters() {
        const pricing = Array.from(pricingFilters)
            .filter(f => f.checked)
            .map(f => f.value);
        const chinese = chineseFilter?.checked;
        currentFilters.pricing = pricing;
        currentFilters.chinese = chinese || false;
        
        const tools = document.querySelectorAll('.tool-card');
        const noResults = document.getElementById('no-results');
        const toolsGrid = document.getElementById('tools-grid');
        let visibleTools = 0;
        
        tools.forEach(tool => {
            const toolCategory = tool.dataset.category;
            const toolName = tool.dataset.name;
            const toolTags = tool.dataset.tags;
            const toolPricing = tool.dataset.pricing;
            const toolChinese = tool.dataset.chinese;
            
            // Category filter
            const categoryMatch = !currentFilters.category || 
                toolCategory === currentFilters.category ||
                toolCategory.includes(currentFilters.category);
            
            // Search filter
            const searchMatch = !currentFilters.search || 
                toolName.includes(currentFilters.search) ||
                toolTags.includes(currentFilters.search);
            
            // Pricing filter
            const pricingMatch = currentFilters.pricing.length === 0 || 
                currentFilters.pricing.includes(toolPricing);
            
            // Chinese filter
            const chineseMatch = !currentFilters.chinese || toolChinese === 'true';
            
            if (categoryMatch && searchMatch && pricingMatch && chineseMatch) {
                tool.classList.remove('hidden');
                visibleTools++;
            } else {
                tool.classList.add('hidden');
            }
        });
        
        // Show/hide no results message
        if (noResults) {
            if (visibleTools === 0) {
                noResults.classList.remove('hidden');
                if (toolsGrid) toolsGrid.classList.add('hidden');
            } else {
                noResults.classList.add('hidden');
                if (toolsGrid) toolsGrid.classList.remove('hidden');
            }
        }
        
        // Update active filters display
        updateActiveFiltersDisplay();
        
        // Reset visible count for load more
        visibleCount = TOOLS_PER_PAGE;
        updateLoadMoreButton(visibleTools);
        
        console.log('筛选结果：', visibleTools, '个工具');
    }
    
    pricingFilters.forEach(f => f.addEventListener('change', applyFilters));
    chineseFilter?.addEventListener('change', applyFilters);
    
    // ============ 排序功能 ============
    const sortSelect = document.getElementById('sort-select');
    
    function sortTools(sortBy) {
        const tools = Array.from(document.querySelectorAll('.tool-card:not(.hidden)'));
        const toolsGrid = document.getElementById('tools-grid');
        
        tools.sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    // Sort by popularity (higher first)
                    return (parseInt(b.dataset.popularity || '0') || 0) - (parseInt(a.dataset.popularity || '0') || 0);
                case 'newest':
                    // Sort by updated_at (newer first)
                    return new Date(b.dataset.updated || '0') - new Date(a.dataset.updated || '0');
                case 'rating':
                    // Sort by rating (higher first)
                    return parseFloat(b.dataset.rating || '0') - parseFloat(a.dataset.rating || '0');
                case 'name':
                    // Sort by name (alphabetical)
                    return a.dataset.name.localeCompare(b.dataset.name);
                default:
                    return 0;
            }
        });
        
        // Re-append in sorted order
        if (toolsGrid) {
            tools.forEach(tool => toolsGrid.appendChild(tool));
        }
    }
    
    sortSelect?.addEventListener('change', function() {
        console.log('排序方式：', this.value);
        currentFilters.sort = this.value;
        sortTools(this.value);
    });
    
    // ============ 视图切换 ============
    const viewGrid = document.getElementById('view-grid');
    const viewList = document.getElementById('view-list');
    const toolsGrid = document.getElementById('tools-grid');
    
    viewGrid?.addEventListener('click', function() {
        this.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
        this.classList.remove('text-slate-500');
        viewList?.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
        viewList?.classList.add('text-slate-500');
        toolsGrid?.classList.remove('list-view');
    });
    
    viewList?.addEventListener('click', function() {
        this.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
        this.classList.remove('text-slate-500');
        viewGrid?.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
        viewGrid?.classList.add('text-slate-500');
        toolsGrid?.classList.add('list-view');
    });
    
    // ============ 加载更多 ============
    const loadMoreBtn = document.getElementById('load-more-btn');
    const noMoreData = document.getElementById('no-more-data');
    const loadingState = document.getElementById('loading-state');
    
    loadMoreBtn?.addEventListener('click', function() {
        if (loadingState) loadingState.classList.remove('hidden');
        this.innerHTML = '<i class="fa-solid fa-spinner animate-spin mr-2"></i> 加载中...';
        
        setTimeout(() => {
            // Show more tools
            const hiddenTools = document.querySelectorAll('.tool-card:not(.hidden)');
            let newlyVisible = 0;
            
            hiddenTools.forEach((tool, index) => {
                if (index < visibleCount + TOOLS_PER_PAGE && index >= visibleCount) {
                    tool.classList.remove('hidden');
                    newlyVisible++;
                }
            });
            
            visibleCount += newlyVisible;
            
            // Update button state
            const totalVisible = document.querySelectorAll('.tool-card:not(.hidden)').length;
            if (visibleCount >= totalVisible) {
                this.classList.add('hidden');
                if (noMoreData) noMoreData.classList.remove('hidden');
            } else {
                this.innerHTML = '<i class="fa-solid fa-refresh mr-2"></i> 加载更多';
            }
            
            if (loadingState) loadingState.classList.add('hidden');
        }, 500);
    });
    
    // ============ 订阅功能 ============
    const subscribeBtn = document.getElementById('subscribe-btn');
    const subscribeEmail = document.getElementById('subscribe-email');
    
    subscribeBtn?.addEventListener('click', function() {
        const email = subscribeEmail?.value.trim();
        if (email && email.includes('@')) {
            alert('订阅成功！');
            if (subscribeEmail) subscribeEmail.value = '';
        } else {
            alert('请输入有效的邮箱地址');
        }
    });
    
    // ============ 模态框点击外部关闭 ============
    [compareModal, favoritesModal].forEach(modal => {
        modal?.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });
    
    // ============ 微信扫码弹窗 ============
    const scanBtn = document.getElementById('scanBtn');
    
    scanBtn?.addEventListener('click', function() {
        if (typeof window.openWechatModal === 'function') {
            window.openWechatModal();
        } else {
            console.warn('WechatModal 未加载或 openWechatModal 函数不存在');
        }
    });
});

// 全局函数
window.resetAllFilters = function() {
    console.log('重置所有筛选');
    const pricingFilters = document.querySelectorAll('.filter-pricing');
    const chineseFilter = document.getElementById('filter-chinese');
    const activeFilters = document.getElementById('active-filters');
    const globalSearch = document.getElementById('global-search');
    const mobileSearch = document.getElementById('mobile-search');
    const sortSelect = document.getElementById('sort-select');
    
    // Reset all filter states
    currentFilters.category = null;
    currentFilters.search = '';
    currentFilters.pricing = [];
    currentFilters.chinese = false;
    
    // Reset UI elements
    pricingFilters.forEach(f => f.checked = false);
    if (chineseFilter) chineseFilter.checked = false;
    if (activeFilters) activeFilters.innerHTML = '';
    if (globalSearch) globalSearch.value = '';
    if (mobileSearch) mobileSearch.value = '';
    if (sortSelect) sortSelect.value = 'popular';
    
    // Reset category button states
    setActiveCategory(null);
    if (pageTitle) pageTitle.textContent = '全部工具';
    
    // Show all tools
    const tools = document.querySelectorAll('.tool-card');
    tools.forEach(tool => tool.classList.remove('hidden'));
    
    // Reset load more
    visibleCount = TOOLS_PER_PAGE;
    updateLoadMoreButton(tools.length);
    
    // Hide no results message
    const noResults = document.getElementById('no-results');
    const toolsGrid = document.getElementById('tools-grid');
    if (noResults) noResults.classList.add('hidden');
    if (toolsGrid) toolsGrid.classList.remove('hidden');
    
    console.log('已重置所有筛选');
};
