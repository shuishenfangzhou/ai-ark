/**
 * AI方舟 - UI 美化增强包
 * 包含动画、卡片悬停效果、视觉优化
 */

class UIBeaautifier {
    constructor() {
        this.init();
    }

    init() {
        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.enhanceToolCards();
        this.addPageAnimations();
        this.enhanceButtons();
        this.addSkeletonLoading();
        this.enhanceSearchBox();
        this.addScrollEffects();
    }

    // 增强工具卡片
    enhanceToolCards() {
        const cards = document.querySelectorAll('.tool-card');
        cards.forEach(card => {
            card.classList.add('tool-card-enhanced');
            
            // 添加悬停效果
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovered');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovered');
            });
            
            // 点击波纹效果
            card.addEventListener('click', (e) => {
                this.createRipple(card, e);
            });
        });
    }

    // 创建波纹效果
    createRipple(element, event) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // 页面动画
    addPageAnimations() {
        // 工具卡片淡入动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in-up');
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.tool-card').forEach(card => {
            observer.observe(card);
        });
    }

    // 增强按钮
    enhanceButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
        buttons.forEach(btn => {
            btn.classList.add('btn-enhanced');
        });
    }

    // 骨架屏加载
    addSkeletonLoading() {
        const skeletonHTML = `
            <div class="skeleton-card">
                <div class="skeleton skeleton-logo"></div>
                <div class="skeleton-content">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            </div>
        `;
        
        // 替换加载状态
        window.showSkeletonLoading = () => {
            const container = document.getElementById('tools-list');
            if (container) {
                container.innerHTML = skeletonHTML.repeat(8);
            }
        };
    }

    // 增强搜索框
    enhanceSearchBox() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.classList.add('search-input-enhanced');
            
            // 聚焦动画
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });
        }
    }

    // 滚动效果
    addScrollEffects() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // 回到顶部按钮显示
            const backToTop = document.getElementById('back-to-top');
            if (backToTop) {
                if (currentScroll > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }
            
            lastScroll = currentScroll;
        });
    }

    // 工具卡片统计动画
    animateCounter(element, target, duration = 1000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    }
}

// CSS 样式注入
const beautifyStyles = `
/* ===== 工具卡片增强 ===== */
.tool-card-enhanced {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
}

.tool-card-enhanced:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.2);
}

.tool-card-enhanced::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.tool-card-enhanced:hover::before {
    transform: scaleX(1);
}

/* ===== 波纹效果 ===== */
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* ===== 淡入动画 ===== */
.fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== 按钮增强 ===== */
.btn-enhanced {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.btn-enhanced::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
}

.btn-enhanced:hover::after {
    width: 200px;
    height: 200px;
}

/* ===== 搜索框增强 ===== */
.search-input-enhanced {
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.search-input-enhanced:focus {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.focused .search-input-enhanced {
    border-color: #3b82f6;
}

/* ===== 骨架屏 ===== */
.skeleton-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 0.5rem;
}

.skeleton-logo {
    width: 64px;
    height: 64px;
    border-radius: 0.75rem;
    flex-shrink: 0;
}

.skeleton-content {
    flex: 1;
}

.skeleton-title {
    height: 20px;
    width: 60%;
    margin-bottom: 0.75rem;
}

.skeleton-text {
    height: 14px;
    width: 100%;
    margin-bottom: 0.5rem;
}

.skeleton-text.short {
    width: 80%;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* ===== 回到顶部按钮 ===== */
#back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

#back-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

#back-to-top:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

/* ===== 分类标签动画 ===== */
.category-item {
    transition: all 0.2s ease;
    position: relative;
}

.category-item::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: #3b82f6;
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.category-item:hover::after,
.category-item.active::after {
    width: 60%;
}

/* ===== 评分星星动画 ===== */
.star-rating .star {
    transition: all 0.2s ease;
    cursor: pointer;
}

.star-rating .star:hover,
.star-rating .star.hover {
    transform: scale(1.2);
}

/* ===== 加载动画 ===== */
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f0f0f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ===== 渐变背景动画 ===== */
.gradient-bg {
    background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* ===== 工具提示 ===== */
.tooltip-enhanced {
    position: relative;
}

.tooltip-enhanced::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    padding: 0.5rem 0.75rem;
    background: #1e293b;
    color: white;
    font-size: 0.75rem;
    border-radius: 0.5rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    z-index: 1000;
}

.tooltip-enhanced:hover::before {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-4px);
}
`;

// 注入样式
const styleSheet = document.createElement('style');
styleSheet.textContent = beautifyStyles;
document.head.appendChild(styleSheet);

// 初始化
window.uiBeautifier = new UIBeaautifier();

// 添加回到顶部按钮到页面
document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(backToTop);
});
