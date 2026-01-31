// 简单的用户行为分析
export class Analytics {
    constructor() {
        this.events = [];
        this.startTime = Date.now();
    }

    // 记录事件
    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.events.push(event);
        
        // 发送到后端（如果有的话）
        this.sendEvent(event);
    }

    // 发送事件到后端
    sendEvent(event) {
        // 这里可以发送到你的分析服务
        console.log('Analytics Event:', event);
        
        // 示例：发送到Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event.name, {
                custom_parameter: JSON.stringify(event.properties)
            });
        }
    }

    // 记录页面访问
    trackPageView(page) {
        this.track('page_view', { page });
    }

    // 记录工具点击
    trackToolClick(toolName, toolId) {
        this.track('tool_click', { 
            tool_name: toolName, 
            tool_id: toolId 
        });
    }

    // 记录搜索
    trackSearch(query, results) {
        this.track('search', { 
            query, 
            results_count: results 
        });
    }

    // 记录分类切换
    trackCategoryChange(category) {
        this.track('category_change', { category });
    }

    // 获取会话统计
    getSessionStats() {
        return {
            duration: Date.now() - this.startTime,
            events_count: this.events.length,
            events: this.events
        };
    }
}

// 全局实例
export const analytics = new Analytics();