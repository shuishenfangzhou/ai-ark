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
            // TODO: 实现搜索逻辑
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
            // TODO: 实现分类筛选
        });
    });
    
    allCategoriesBtn?.addEventListener('click', function() {
        setActiveCategory(null);
        if (pageTitle) {
            pageTitle.textContent = '全部工具';
        }
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
    
    function applyFilters() {
        const pricing = Array.from(pricingFilters)
            .filter(f => f.checked)
            .map(f => f.value);
        const chinese = chineseFilter?.checked;
        console.log('筛选：', { pricing, chinese });
        // TODO: 实现筛选逻辑
    }
    
    pricingFilters.forEach(f => f.addEventListener('change', applyFilters));
    chineseFilter?.addEventListener('change', applyFilters);
    
    // ============ 排序功能 ============
    const sortSelect = document.getElementById('sort-select');
    sortSelect?.addEventListener('change', function() {
        console.log('排序方式：', this.value);
        // TODO: 实现排序逻辑
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
            if (loadingState) loadingState.classList.add('hidden');
            this.classList.add('hidden');
            if (noMoreData) noMoreData.classList.remove('hidden');
        }, 1000);
        // TODO: 实现加载更多逻辑
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
});

// 全局函数
window.resetAllFilters = function() {
    console.log('重置所有筛选');
    const pricingFilters = document.querySelectorAll('.filter-pricing');
    const chineseFilter = document.getElementById('filter-chinese');
    const activeFilters = document.getElementById('active-filters');
    
    pricingFilters.forEach(f => f.checked = false);
    if (chineseFilter) chineseFilter.checked = false;
    if (activeFilters) activeFilters.innerHTML = '';
    
    // TODO: 实现重置逻辑
};
