/**
 * AI方舟 - UI 控制器
 * 处理页面交互、动态加载、用户状态
 */

class UIController {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.currentCategory = null;
        this.currentSearch = '';
        this.isLoading = false;
        this.tools = [];
        this.categories = [];
        this.favorites = new Set();
        
        this.init();
    }

    // ============ 初始化 ============

    init() {
        this.bindEvents();
        this.checkAuth();
        this.loadCategories();
        this.loadTools();
    }

    bindEvents() {
        // 搜索框
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.search());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.search();
            });
        }

        // 分类筛选
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                
                // 更新激活状态
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 登录模态框
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.addEventListener('shown.bs.modal', () => {
                document.getElementById('login-username')?.focus();
            });
        }

        // 登录表单
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 注册表单
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // 登出按钮
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    // ============ 认证相关 ============

    checkAuth() {
        const user = window.api.getStoredUser();
        if (user) {
            this.updateUIForLoggedIn(user);
        } else {
            this.updateUIForLoggedOut();
        }
    }

    async handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            this.showLoading('登录中...');
            await window.api.login(username, password);
            await window.api.getCurrentUser();
            
            this.hideLoading();
            this.showToast('登录成功！', 'success');
            this.checkAuth();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
            if (modal) modal.hide();
            
        } catch (error) {
            this.hideLoading();
            this.showToast(error.message, 'error');
        }
    }

    async handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            this.showToast('两次密码输入不一致', 'error');
            return;
        }
        
        try {
            this.showLoading('注册中...');
            await window.api.register(username, email, password);
            await window.api.getCurrentUser();
            
            this.hideLoading();
            this.showToast('注册成功！', 'success');
            this.checkAuth();
            
            // 关闭模态框并切换到登录
            const modal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
            if (modal) modal.hide();
            
        } catch (error) {
            this.hideLoading();
            this.showToast(error.message, 'error');
        }
    }

    handleLogout() {
        window.api.logout();
        this.updateUIForLoggedOut();
        this.showToast('已退出登录', 'success');
        this.loadTools(); // 重新加载工具列表
    }

    updateUIForLoggedIn(user) {
        const guestElements = document.querySelectorAll('.guest-only');
        const userElements = document.querySelectorAll('.user-only');
        
        guestElements.forEach(el => el.style.display = 'none');
        userElements.forEach(el => el.style.display = '');
        
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => el.textContent = user.username);
        
        // 显示收藏按钮
        this.loadFavorites();
    }

    updateUIForLoggedOut() {
        const guestElements = document.querySelectorAll('.guest-only');
        const userElements = document.querySelectorAll('.user-only');
        
        guestElements.forEach(el => el.style.display = '');
        userElements.forEach(el => el.style.display = 'none');
    }

    // ============ 工具加载 ============

    async loadCategories() {
        try {
            this.categories = await window.api.getCategories();
            this.renderCategories();
        } catch (error) {
            console.error('Failed to load categories:', error);
            // 使用静态分类数据
            this.renderStaticCategories();
        }
    }

    renderCategories() {
        const container = document.getElementById('categories-list');
        if (!container) return;
        
        let html = '<a href="#" class="category-item active" data-category="">全部</a>';
        
        this.categories.forEach(cat => {
            const icon = cat.icon || '📦';
            html += `
                <a href="#" class="category-item" data-category="${cat.name}">
                    ${icon} ${cat.name} (${cat.count || 0})
                </a>
            `;
        });
        
        container.innerHTML = html;
        
        // 重新绑定事件
        container.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(item.dataset.category);
                
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    renderStaticCategories() {
        // 如果 API 失败，使用静态分类
        const staticCategories = [
            { name: 'General', icon: '📦', count: 0 },
            { name: 'Writing', icon: '✍️', count: 0 },
            { name: 'Image', icon: '🎨', count: 0 },
            { name: 'Video', icon: '🎬', count: 0 },
            { name: 'Chat', icon: '💬', count: 0 },
            { name: 'Dev', icon: '💻', count: 0 },
        ];
        
        const container = document.getElementById('categories-list');
        if (!container) return;
        
        let html = '<a href="#" class="category-item active" data-category="">全部</a>';
        
        staticCategories.forEach(cat => {
            html += `
                <a href="#" class="category-item" data-category="${cat.name}">
                    ${cat.icon} ${cat.name}
                </a>
            `;
        });
        
        container.innerHTML = html;
        
        container.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(item.dataset.category);
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    async loadTools(resetPage = true) {
        if (resetPage) {
            this.currentPage = 1;
        }
        
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            const data = await window.api.getTools({
                q: this.currentSearch,
                category: this.currentCategory,
                page: this.currentPage,
                page_size: this.pageSize
            });
            
            this.tools = data.tools;
            this.renderTools(data);
            this.renderPagination(data);
            
        } catch (error) {
            console.error('Failed to load tools:', error);
            this.loadStaticTools(); // 降级使用静态数据
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    renderTools(data) {
        const container = document.getElementById('tools-list');
        if (!container) return;
        
        if (data.tools.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted">
                        <i class="bi bi-search fs-1"></i>
                        <p class="mt-3">没有找到相关工具</p>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        data.tools.forEach(tool => {
            const isFavorited = this.favorites.has(tool.id);
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card tool-card h-100" data-id="${tool.id}">
                        <div class="card-body">
                            <div class="d-flex align-items-start mb-3">
                                <img src="${tool.logo || '/image/default-logo.png'}" 
                                     alt="${tool.name}" 
                                     class="tool-logo me-3"
                                     onerror="this.src='https://via.placeholder.com/64?text=${tool.name[0]}'">
                                <div class="flex-grow-1">
                                    <h6 class="card-title mb-1">${tool.name}</h6>
                                    <span class="badge bg-${this.getPricingBadge(tool.pricing)}">${tool.pricing}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-primary favorite-btn ${isFavorited ? 'active' : ''}" 
                                        data-id="${tool.id}"
                                        title="${isFavorited ? '取消收藏' : '添加收藏'}">
                                    <i class="bi ${isFavorited ? 'bi-star-fill' : 'bi-star'}"></i>
                                </button>
                            </div>
                            <p class="card-text small text-muted">${this.truncate(tool.description || '', 80)}</p>
                            <div class="tool-meta">
                                <span class="me-2"><i class="bi bi-star-fill text-warning"></i> ${tool.rating || 'N/A'}</span>
                                <span><i class="bi bi-eye"></i> ${tool.visits || '0'}</span>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <a href="${tool.url}" target="_blank" class="btn btn-primary btn-sm w-100">
                                访问工具 <i class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // 绑定收藏按钮事件
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavorite(parseInt(btn.dataset.id));
            });
        });
    }

    loadStaticTools() {
        // 从 toolsData.json 加载静态数据
        const container = document.getElementById('tools-list');
        if (!container) return;
        
        // 这个功能会在静态模式下使用本地数据
        console.log('Using static data mode');
    }

    renderPagination(data) {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        if (data.total_pages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // 上一页
        html += `
            <li class="page-item ${data.page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${data.page - 1}">上一页</a>
            </li>
        `;
        
        // 页码
        const startPage = Math.max(1, data.page - 2);
        const endPage = Math.min(data.total_pages, data.page + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === data.page ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // 下一页
        html += `
            <li class="page-item ${data.page === data.total_pages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${data.page + 1}">下一页</a>
            </li>
        `;
        
        container.innerHTML = html;
        
        // 绑定分页事件
        container.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.parentElement.classList.contains('disabled')) return;
                
                this.currentPage = parseInt(link.dataset.page);
                this.loadTools(false);
                
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // ============ 搜索和筛选 ============

    search() {
        const input = document.getElementById('search-input');
        this.currentSearch = input?.value?.trim() || '';
        this.loadTools();
    }

    filterByCategory(category) {
        this.currentCategory = category || null;
        this.loadTools();
    }

    // ============ 收藏 ============

    async loadFavorites() {
        if (!window.api.isLoggedIn()) return;
        
        try {
            const favorites = await window.api.getFavorites();
            this.favorites = new Set(favorites.map(f => f.tool_id));
            this.updateFavoriteButtons();
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    }

    async toggleFavorite(toolId) {
        if (!window.api.isLoggedIn()) {
            this.showToast('请先登录', 'warning');
            const modal = new bootstrap.Modal(document.getElementById('login-modal'));
            modal.show();
            return;
        }
        
        try {
            if (this.favorites.has(toolId)) {
                // 取消收藏
                await window.api.removeFavorite(toolId);
                this.favorites.delete(toolId);
                this.showToast('已取消收藏', 'success');
            } else {
                // 添加收藏
                await window.api.addFavorite(toolId);
                this.favorites.add(toolId);
                this.showToast('收藏成功', 'success');
            }
            
            this.updateFavoriteButtons();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const toolId = parseInt(btn.dataset.id);
            const isFavorited = this.favorites.has(toolId);
            
            btn.classList.toggle('active', isFavorited);
            btn.querySelector('i').className = isFavorited ? 'bi bi-star-fill' : 'bi bi-star';
            btn.title = isFavorited ? '取消收藏' : '添加收藏';
        });
    }

    // ============ 工具方法 ============

    getPricingBadge(pricing) {
        const badges = {
            'Free': 'success',
            'Freemium': 'info',
            'Paid': 'warning',
            'Unknown': 'secondary'
        };
        return badges[pricing] || 'secondary';
    }

    truncate(str, length) {
        if (!str) return '';
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    showLoading(message = '加载中...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.querySelector('.loading-text').textContent = message;
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        // 简单的 toast 提示
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    }
}

// ============ 全局函数 ============

// 切换登录/注册标签
function switchTab(tab) {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tab === 'login') {
        loginTab.className = 'flex-1 py-4 text-center font-medium text-blue-600 border-b-2 border-blue-600';
        registerTab.className = 'flex-1 py-4 text-center font-medium text-slate-500 border-b-2 border-transparent';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginTab.className = 'flex-1 py-4 text-center font-medium text-slate-500 border-b-2 border-transparent';
        registerTab.className = 'flex-1 py-4 text-center font-medium text-blue-600 border-b-2 border-blue-600';
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

// 关闭登录模态框
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// 打开登录模态框
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// 关闭对比模态框
function closeCompareModal() {
    const modal = document.getElementById('compare-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.ui = new UIController();
});
