// src/scripts/main.js
// 全局交互脚本 - 占位实现，后续完善

document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Ark v2.0 loaded');
    
    // 搜索框交互
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const keyword = this.value.trim();
                if (keyword) {
                    console.log('搜索：', keyword);
                    // TODO: 实现搜索逻辑
                }
            }
        });
    }
    
    // Ctrl+K 快捷键
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (globalSearch) {
                globalSearch.focus();
            }
        }
    });
    
    // 分类导航点击
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            // TODO: 实现分类筛选
        });
    });
    
    // 对比复选框
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    compareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const count = document.querySelectorAll('.compare-checkbox:checked').length;
            const countBadge = document.getElementById('compare-count');
            if (countBadge) {
                if (count > 0) {
                    countBadge.textContent = count;
                    countBadge.classList.remove('hidden');
                } else {
                    countBadge.classList.add('hidden');
                }
            }
        });
    });
    
    // 排序下拉框
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('排序方式：', this.value);
            // TODO: 实现排序逻辑
        });
    }
    
    // 视图切换
    const viewGrid = document.getElementById('view-grid');
    const viewList = document.getElementById('view-list');
    const toolsGrid = document.getElementById('tools-grid');
    
    if (viewGrid && viewList && toolsGrid) {
        viewGrid.addEventListener('click', function() {
            this.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
            this.classList.remove('text-slate-500');
            viewList.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
            viewList.classList.add('text-slate-500');
            toolsGrid.classList.remove('list-view');
        });
        
        viewList.addEventListener('click', function() {
            this.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
            this.classList.remove('text-slate-500');
            viewGrid.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
            viewGrid.classList.add('text-slate-500');
            toolsGrid.classList.add('list-view');
        });
    }
    
    // 加载更多
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('加载更多');
            // TODO: 实现加载更多逻辑
        });
    }
    
    // 筛选器
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
    if (chineseFilter) {
        chineseFilter.addEventListener('change', applyFilters);
    }
});

// 全局函数
window.resetAllFilters = function() {
    console.log('重置所有筛选');
    const pricingFilters = document.querySelectorAll('.filter-pricing');
    const chineseFilter = document.getElementById('filter-chinese');
    pricingFilters.forEach(f => f.checked = false);
    if (chineseFilter) chineseFilter.checked = false;
    // TODO: 实现重置逻辑
};
