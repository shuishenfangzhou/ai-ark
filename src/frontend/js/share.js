/**
 * AI方舟 - 社交分享组件
 * 支持微信、微博、QQ、复制链接等分享方式
 */

class ShareManager {
    constructor() {
        this.pageUrl = window.location.href;
        this.pageTitle = document.title || 'AI方舟 - AI工具导航';
        this.pageDesc = document.querySelector('meta[name="description"]')?.content || '探索AI的诺亚方舟，收录全品类AI工具';
        this.pageImage = this.getShareImage();
    }

    // 获取分享图片
    getShareImage() {
        // 优先使用 og:image
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;
        
        // 默认使用 Logo
        return window.location.origin + '/image/logo.png';
    }

    // 分享到微信 (生成二维码)
    async shareToWechat(toolId, toolName, toolUrl) {
        try {
            // 使用二维码 API 生成二维码
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(toolUrl)}`;
            
            // 显示分享模态框
            this.showShareModal('wechat', {
                qrcode: qrCodeUrl,
                title: toolName,
                url: toolUrl
            });
        } catch (error) {
            console.error('微信分享失败:', error);
            this.showToast('分享功能暂时不可用', 'error');
        }
    }

    // 分享到微博
    shareToWeibo(toolName, toolUrl) {
        const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(toolUrl)}&title=${encodeURIComponent(toolName)}&pic=${encodeURIComponent(this.pageImage)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // 分享到 QQ
    shareToQQ(toolName, toolUrl) {
        const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(toolUrl)}&title=${encodeURIComponent(toolName)}&pics=${encodeURIComponent(this.pageImage)}&summary=${encodeURIComponent(this.pageDesc)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // 分享到 Twitter
    shareToTwitter(toolName, toolUrl) {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(toolName)}&url=${encodeURIComponent(toolUrl)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // 分享到 Facebook
    shareToFacebook(toolUrl) {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toolUrl)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // 复制链接
    async copyLink(toolUrl) {
        try {
            const urlToCopy = toolUrl || this.pageUrl;
            await navigator.clipboard.writeText(urlToCopy);
            this.showToast('链接已复制到剪贴板', 'success');
        } catch (error) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = toolUrl || this.pageUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('链接已复制到剪贴板', 'success');
        }
    }

    // 生成分享图片 (Canvas)
    async generateShareImage(tool) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布大小
        canvas.width = 1200;
        canvas.height = 630;
        
        // 背景
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 标题
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px "Microsoft YaHei", sans-serif';
        ctx.fillText('AI方舟', 60, 100);
        
        // 工具名称
        ctx.font = 'bold 36px "Microsoft YaHei", sans-serif';
        ctx.fillText(tool.name, 60, 200);
        
        // 描述
        ctx.font = '24px "Microsoft YaHei", sans-serif';
        ctx.fillText(this.truncate(tool.description || '', 40), 60, 280);
        
        // 标签
        if (tool.tags && tool.tags.length > 0) {
            ctx.font = '20px "Microsoft YaHei", sans-serif';
            const tagsText = tool.tags.slice(0, 5).join(' | ');
            ctx.fillText(tagsText, 60, 350);
        }
        
        // 访问链接
        ctx.font = '24px "Microsoft YaHei", sans-serif';
        ctx.fillText('👆 点击访问 AI 工具', 60, 450);
        
        // Logo
        if (tool.logo) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = tool.logo;
            });
            ctx.drawImage(img, canvas.width - 180, 60, 120, 120);
        }
        
        return canvas.toDataURL('image/png');
    }

    // 显示分享模态框
    showShareModal(type, data) {
        let html = '';
        
        if (type === 'wechat') {
            html = `
                <div class="fixed inset-0 z-[200]">
                    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="closeShareModal()"></div>
                    <div class="fixed inset-0 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
                            <div class="p-6 text-center">
                                <h3 class="text-lg font-semibold text-slate-900 mb-4">分享到微信</h3>
                                <div class="mx-auto w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                                    <img src="${data.qrcode}" alt="二维码" class="w-full h-full object-contain">
                                </div>
                                <p class="text-sm text-slate-500 mb-4">扫码分享「${data.title}」</p>
                                <p class="text-xs text-slate-400">链接: ${data.url}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 其他分享方式
            html = `
                <div class="fixed inset-0 z-[200]">
                    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="closeShareModal()"></div>
                    <div class="fixed inset-0 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
                            <div class="p-6">
                                <h3 class="text-lg font-semibold text-slate-900 mb-4">分享到</h3>
                                <div class="grid grid-cols-4 gap-4 mb-6">
                                    <button onclick="shareManager.shareToWechat()" class="flex flex-col items-center p-3 rounded-xl hover:bg-slate-100">
                                        <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                                            <i class="fa-brands fa-weixin text-white text-xl"></i>
                                        </div>
                                        <span class="text-xs text-slate-600">微信</span>
                                    </button>
                                    <button onclick="shareManager.shareToWeibo()" class="flex flex-col items-center p-3 rounded-xl hover:bg-slate-100">
                                        <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
                                            <i class="fa-brands fa-weibo text-white text-xl"></i>
                                        </div>
                                        <span class="text-xs text-slate-600">微博</span>
                                    </button>
                                    <button onclick="shareManager.shareToQQ()" class="flex flex-col items-center p-3 rounded-xl hover:bg-slate-100">
                                        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                                            <i class="fa-brands fa-qq text-white text-xl"></i>
                                        </div>
                                        <span class="text-xs text-slate-600">QQ</span>
                                    </button>
                                    <button onclick="shareManager.copyLink()" class="flex flex-col items-center p-3 rounded-xl hover:bg-slate-100">
                                        <div class="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center mb-2">
                                            <i class="fa-solid fa-link text-white text-xl"></i>
                                        </div>
                                        <span class="text-xs text-slate-600">复制</span>
                                    </button>
                                    <button onclick="shareManager.shareToTwitter()" class="flex flex-col items-center p-3 rounded-xl hover:bg-slate-100">
                                        <div class="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mb-2">
                                            <i class="fa-brands fa-twitter text-white text-xl"></i>
                                        </div>
                                        <span class="text-xs text-slate-600">Twitter</span>
                                    </button>
                                    <button onclick="shareManager.shareToFacebook()" class="flex flex-col items-center p-3 rounded-xl hover:bg-slate-100">
                                        <div class="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-2">
                                            <i class="fa-brands fa-facebook-f text-white text-xl"></i>
                                        </div>
                                        <span class="text-xs text-slate-600">Facebook</span>
                                    </button>
                                </div>
                                <div class="flex gap-2">
                                    <input type="text" readonly value="${this.pageUrl}" class="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm" id="share-url">
                                    <button onclick="shareManager.copyLink()" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">复制</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // 移除已存在的模态框
        const existing = document.getElementById('share-modal');
        if (existing) existing.remove();
        
        // 添加新模态框
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.innerHTML = html;
        document.body.appendChild(modal);
    }

    // 工具方法
    truncate(str, length) {
        if (!str) return '';
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    showToast(message, type = 'info') {
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

// 全局实例
window.shareManager = new ShareManager();

// 全局函数
function showShareModal(type, data) {
    window.shareManager.showShareModal(type, data);
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.remove();
}
