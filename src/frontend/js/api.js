/**
 * AI方舟 - 前端 API 客户端
 * 处理所有与后端的通信
 */

const API_BASE = '/api/v1';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // ============ 认证相关 ============

    async register(username, email, password) {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }
        
        const data = await response.json();
        this.setToken(data.access_token);
        return data;
    }

    async login(username, password) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
        
        const data = await response.json();
        this.setToken(data.access_token);
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    async getCurrentUser() {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired');
            }
            throw new Error('Failed to get user info');
        }
        
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }

    // ============ 工具相关 ============

    async getTools(params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.q) queryParams.append('q', params.q);
        if (params.category) queryParams.append('category', params.category);
        if (params.pricing) queryParams.append('pricing', params.pricing);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        queryParams.append('page', params.page || 1);
        queryParams.append('page_size', params.page_size || 20);
        
        const response = await fetch(`${API_BASE}/tools?${queryParams}`, {
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch tools');
        }
        
        return response.json();
    }

    async getTool(id) {
        const response = await fetch(`${API_BASE}/tools/${id}`, {
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Tool not found');
        }
        
        return response.json();
    }

    async getCategories() {
        const response = await fetch(`${API_BASE}/categories`, {
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        
        return response.json();
    }

    // ============ 收藏相关 ============

    async getFavorites(page = 1, pageSize = 20) {
        const response = await fetch(`${API_BASE}/favorites?page=${page}&page_size=${pageSize}`, {
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }
        
        return response.json();
    }

    async addFavorite(toolId, note = null) {
        const response = await fetch(`${API_BASE}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders()
            },
            body: JSON.stringify({ tool_id: toolId, note })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to add favorite');
        }
        
        return response.json();
    }

    async removeFavorite(favoriteId) {
        const response = await fetch(`${API_BASE}/favorites/${favoriteId}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }
        
        return response.json();
    }

    // ============ AI 推荐 ============

    async getRecommendations(query, category = null, maxResults = 5) {
        const response = await fetch(`${API_BASE}/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders()
            },
            body: JSON.stringify({
                query,
                category,
                max_results: maxResults
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get recommendations');
        }
        
        return response.json();
    }

    // ============ 工具 ============

    isLoggedIn() {
        return !!this.token;
    }

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

// 导出单例
window.api = new APIClient();
