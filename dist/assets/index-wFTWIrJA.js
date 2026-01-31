(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function s(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=s(o);fetch(o.href,a)}})();class ${constructor(){this.events=[],this.startTime=Date.now()}track(e,s={}){const i={name:e,properties:s,timestamp:Date.now(),url:window.location.href,userAgent:navigator.userAgent};this.events.push(i),this.sendEvent(i)}sendEvent(e){console.log("Analytics Event:",e),typeof gtag<"u"&&gtag("event",e.name,{custom_parameter:JSON.stringify(e.properties)})}trackPageView(e){this.track("page_view",{page:e})}trackToolClick(e,s){this.track("tool_click",{tool_name:e,tool_id:s})}trackSearch(e,s){this.track("search",{query:e,results_count:s})}trackCategoryChange(e){this.track("category_change",{category:e})}getSessionStats(){return{duration:Date.now()-this.startTime,events_count:this.events.length,events:this.events}}}const M=new $;let n={filters:{pricing:"all",chineseSupport:"all",category:"all",rating:0,popularity:0},sort:{by:"popularity"}},x={},u={};function w(){A(),D(),setupViewControls(),setupSortingControls(),P(),N()}async function A(){try{const e=await(await fetch("/toolsData.json")).json();e.categories&&(x=e.categories),e.statistics&&(u=e.statistics,q()),e.tools&&(aiToolsData=e.tools),console.log("Enhanced data loaded:",{tools:aiToolsData.length,categories:Object.keys(x).length,stats:u})}catch{console.warn("Failed to load enhanced data, using fallback")}}function D(){const t=document.createElement("div");t.id="advanced-filters",t.className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm",t.innerHTML=`
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
    `,document.querySelector("main");const e=document.getElementById("home-view");e&&e.insertBefore(t,e.firstChild),j()}function j(){const t=document.getElementById("toggle-filters"),e=document.getElementById("filters-content");t&&e&&t.addEventListener("click",()=>{const i=e.classList.contains("hidden");e.classList.toggle("hidden"),t.innerHTML=i?'<i class="fa-solid fa-chevron-up"></i> 收起':'<i class="fa-solid fa-chevron-down"></i> 展开'}),["pricing-filter","chinese-filter","rating-filter","popularity-filter"].forEach(i=>{const o=document.getElementById(i);o&&o.addEventListener("change",H)})}function H(){var t,e,s,i;n.filters.pricing=((t=document.getElementById("pricing-filter"))==null?void 0:t.value)||"all",n.filters.chineseSupport=((e=document.getElementById("chinese-filter"))==null?void 0:e.value)||"all",n.filters.rating=parseFloat(((s=document.getElementById("rating-filter"))==null?void 0:s.value)||0),n.filters.popularity=parseInt(((i=document.getElementById("popularity-filter"))==null?void 0:i.value)||0),f(),h()}function f(){let t=aiToolsData.filter(s=>{const i=n.filters.category==="all"||s.category===n.filters.category,o=!state.searchQuery||s.name.toLowerCase().includes(state.searchQuery)||s.desc.toLowerCase().includes(state.searchQuery)||s.tags.some(C=>C.toLowerCase().includes(state.searchQuery)),a=n.filters.pricing==="all"||s.pricing_type===n.filters.pricing,d=n.filters.chineseSupport==="all"||n.filters.chineseSupport==="yes"&&s.chinese_support||n.filters.chineseSupport==="no"&&!s.chinese_support,v=s.rating>=n.filters.rating,T=(s.popularity_score||0)>=n.filters.popularity;return i&&o&&a&&d&&v&&T});t=F(t),state.filteredData=t,state.displayedTools=[],dom.toolsGrid.innerHTML="",loadMoreTools();const e=document.getElementById("no-results");t.length===0?e==null||e.classList.remove("hidden"):e==null||e.classList.add("hidden")}function F(t){return t.sort((e,s)=>{let i,o;switch(n.sort.by){case"popularity":i=e.popularity_score||0,o=s.popularity_score||0;break;case"rating":i=e.rating||0,o=s.rating||0;break;case"name":i=e.name.toLowerCase(),o=s.name.toLowerCase();break;case"updated":i=new Date(e.last_updated||"2026-01-01"),o=new Date(s.last_updated||"2026-01-01");break;default:return 0}return o>i?1:-1})}function h(){const t=document.getElementById("active-filters");if(!t)return;const e=[];if(n.filters.pricing!=="all"){const s={free:"免费",paid:"付费",open_source:"开源",freemium:"免费试用"};e.push({type:"pricing",label:`定价: ${s[n.filters.pricing]}`,value:n.filters.pricing})}if(n.filters.chineseSupport!=="all"){const s=n.filters.chineseSupport==="yes"?"支持中文":"仅英文";e.push({type:"chineseSupport",label:`语言: ${s}`,value:n.filters.chineseSupport})}n.filters.rating>0&&e.push({type:"rating",label:`评分: ${n.filters.rating}+`,value:n.filters.rating}),n.filters.popularity>0&&e.push({type:"popularity",label:`热度: ${n.filters.popularity}+`,value:n.filters.popularity}),t.innerHTML=e.map(s=>`
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ${s.label}
            <button class="ml-2 hover:text-blue-900" onclick="removeFilter('${s.type}')">
                <i class="fa-solid fa-times"></i>
            </button>
        </span>
    `).join(""),e.length>0&&(t.innerHTML+=`
            <button onclick="clearAllFilters()" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                <i class="fa-solid fa-trash mr-1"></i> 清除全部
            </button>
        `)}window.removeFilter=function(t){switch(t){case"pricing":n.filters.pricing="all",document.getElementById("pricing-filter").value="all";break;case"chineseSupport":n.filters.chineseSupport="all",document.getElementById("chinese-filter").value="all";break;case"rating":n.filters.rating=0,document.getElementById("rating-filter").value="0";break;case"popularity":n.filters.popularity=0,document.getElementById("popularity-filter").value="0";break}f(),h()};window.clearAllFilters=function(){n.filters={pricing:"all",chineseSupport:"all",category:"all",subcategory:"all",rating:0,popularity:0},document.getElementById("pricing-filter").value="all",document.getElementById("chinese-filter").value="all",document.getElementById("rating-filter").value="0",document.getElementById("popularity-filter").value="0",f(),h()};function P(){JSON.parse(localStorage.getItem("ai-tools-favorites")||"[]"),document.addEventListener("click",t=>{if(t.target.closest(".favorite-btn")){const e=parseInt(t.target.closest(".favorite-btn").dataset.toolId);I(e)}})}function I(t){let e=JSON.parse(localStorage.getItem("ai-tools-favorites")||"[]");e.includes(t)?e=e.filter(s=>s!==t):e.push(t),localStorage.setItem("ai-tools-favorites",JSON.stringify(e)),_(),b(e.includes(t)?"已添加到收藏":"已取消收藏")}function _(){const t=JSON.parse(localStorage.getItem("ai-tools-favorites")||"[]");document.querySelectorAll(".favorite-btn").forEach(e=>{const s=parseInt(e.dataset.toolId),i=t.includes(s);e.innerHTML=i?'<i class="fa-solid fa-heart text-red-500"></i>':'<i class="fa-regular fa-heart"></i>',e.title=i?"取消收藏":"添加收藏"})}function N(){const t=document.querySelector('button:contains("提交工具")');t&&t.addEventListener("click",O)}function O(){document.body.insertAdjacentHTML("beforeend",`
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
    `)}window.closeSubmissionModal=function(){const t=document.getElementById("submission-modal");t&&t.remove()};window.submitTool=function(){const t=document.getElementById("tool-submission-form");new FormData(t),b("提交成功！我们会在24小时内审核您的工具。","success"),closeSubmissionModal()};function b(t,e="info"){const s=document.createElement("div");switch(s.className="fixed top-4 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full",e){case"success":s.classList.add("bg-green-500");break;case"error":s.classList.add("bg-red-500");break;default:s.classList.add("bg-blue-500")}s.textContent=t,document.body.appendChild(s),setTimeout(()=>{s.classList.remove("translate-x-full")},100),setTimeout(()=>{s.classList.add("translate-x-full"),setTimeout(()=>s.remove(),300)},3e3)}function q(){if(!u)return;const t=document.getElementById("total-tools-count");t&&(t.textContent=u.total_tools||aiToolsData.length);const e=document.getElementById("chinese-support-count");e&&(e.textContent=u.chinese_support_count||0)}window.enhancedFeatures={init:w,applyFilters:f,toggleFavorite:I,showToast:b};document.addEventListener("DOMContentLoaded",()=>{setTimeout(w,1e3)});let c=[];async function z(){try{const t=await fetch("/toolsData.json");if(!t.ok)throw new Error("Failed to load tools data");c=await t.json(),console.log(`Loaded ${c.length} tools`),y()}catch(t){console.error("Error loading tools data:",t),c=Q(),y()}}function Q(){return[{id:1,name:"DeepSeek",category:"text",desc:"深度求索开源模型，推理能力极其强大。",url:"https://www.deepseek.com/",tags:["开源","国产","免费"],pricing:"开源",visits:"78M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=DeepSeek&background=random&color=fff&size=128"},{id:2,name:"Kimi智能助手",category:"text",desc:"月之暗面出品，支持20万字超长上下文。",url:"https://kimi.moonshot.cn/",tags:["长文本","文件分析","免费"],pricing:"免费",visits:"66M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=Kimi&background=random&color=fff&size=128"},{id:3,name:"豆包",category:"text",desc:"字节跳动出品，语音交互体验极佳。",url:"https://www.doubao.com/",tags:["语音","日常","免费"],pricing:"免费",visits:"33M+",rating:4.9,logo:"https://ui-avatars.com/api/?name=豆包&background=random&color=fff&size=128"},{id:4,name:"ChatGPT",category:"text",desc:"OpenAI的划时代产品，GPT-4o最强模型。",url:"https://chat.openai.com/",tags:["对话","写作","付费"],pricing:"付费",visits:"50M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=ChatGPT&background=random&color=fff&size=128"},{id:5,name:"Midjourney",category:"image",desc:"目前生成质量最高的AI绘画工具。",url:"https://www.midjourney.com/",tags:["绘画","设计","付费"],pricing:"付费",visits:"454M+",rating:4.6,logo:"https://ui-avatars.com/api/?name=Midjourney&background=random&color=fff&size=128"},{id:6,name:"Stable Diffusion",category:"image",desc:"开源AI绘画基石，可本地部署。",url:"https://stability.ai/",tags:["绘画","开源","免费"],pricing:"开源",visits:"4M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=SD&background=random&color=fff&size=128"},{id:7,name:"Runway",category:"video",desc:"Gen-2模型，视频编辑与生成的专业工具。",url:"https://runwayml.com/",tags:["视频","编辑","付费"],pricing:"付费",visits:"43M+",rating:4.8,logo:"https://ui-avatars.com/api/?name=Runway&background=random&color=fff&size=128"},{id:8,name:"GitHub Copilot",category:"code",desc:"最流行的AI编程助手，自动补全代码。",url:"https://github.com/features/copilot",tags:["编程","代码","付费"],pricing:"付费",visits:"35M+",rating:4.9,logo:"https://ui-avatars.com/api/?name=Copilot&background=random&color=fff&size=128"},{id:9,name:"Suno",category:"audio",desc:"一键生成广播级歌曲，音乐界ChatGPT。",url:"https://suno.ai/",tags:["音乐","音频","付费"],pricing:"付费",visits:"97M+",rating:4.9,logo:"https://ui-avatars.com/api/?name=Suno&background=random&color=fff&size=128"},{id:10,name:"Notion AI",category:"office",desc:"集成在笔记中的AI，润色、总结、翻译。",url:"https://www.notion.so/product/ai",tags:["办公","笔记","付费"],pricing:"付费",visits:"76M+",rating:4.8,logo:"https://ui-avatars.com/api/?name=Notion&background=random&color=fff&size=128"}]}function y(){R(),p(),Y(),l.totalCount.innerText=c.length,G(),M.trackPageView("home")}const m=[{id:"all",name:"全部工具",icon:"fa-layer-group"},{id:"text",name:"AI写作工具",icon:"fa-pen-nib"},{id:"image",name:"AI图像工具",icon:"fa-image"},{id:"video",name:"AI视频工具",icon:"fa-video"},{id:"office",name:"AI办公工具",icon:"fa-briefcase"},{id:"agent",name:"AI智能体",icon:"fa-robot"},{id:"code",name:"AI编程工具",icon:"fa-code"},{id:"audio",name:"AI音频工具",icon:"fa-microphone-lines"},{id:"search",name:"AI搜索引擎",icon:"fa-search"},{id:"dev",name:"AI开发平台",icon:"fa-laptop-code"},{id:"learn",name:"AI学习网站",icon:"fa-graduation-cap"}];let r={view:"home",activeToolId:null,searchQuery:"",activeCategory:"all",sortBy:"popular",isLoggedIn:!1,user:null,itemsPerPage:36,displayedTools:[],filteredData:[],favorites:JSON.parse(localStorage.getItem("ai-tools-favorites")||"[]"),likes:JSON.parse(localStorage.getItem("ai-tools-likes")||"{}")};const l={toolsGrid:document.getElementById("tools-grid"),desktopNav:document.getElementById("desktop-categories"),mobileNav:document.getElementById("mobile-categories"),searchInput:document.getElementById("global-search"),mobileSearchInput:document.getElementById("mobile-search"),sectionTitle:document.getElementById("section-title"),totalCount:document.getElementById("total-tools-count"),noResults:document.getElementById("no-results"),loginBtn:document.getElementById("login-btn"),modal:document.getElementById("login-modal"),closeModalX:document.getElementById("close-modal-x"),confirmLoginBtn:document.getElementById("confirm-login-btn"),backdrop:document.getElementById("modal-backdrop"),authSection:document.getElementById("auth-section"),sortSelect:document.getElementById("sort-select")};document.addEventListener("DOMContentLoaded",()=>{z()});function G(){const t=new IntersectionObserver(s=>{s[0].isIntersecting&&r.view==="home"&&L()},{rootMargin:"200px"}),e=document.createElement("div");e.id="scroll-sentinel",e.className="col-span-full h-10 flex justify-center items-center text-slate-400 text-sm",e.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> 加载更多...',l.toolsGrid.after(e),t.observe(e)}function L(){const t=r.filteredData.length,e=r.displayedTools.length;if(e>=t){const i=document.getElementById("scroll-sentinel");i&&i.classList.add("hidden");return}const s=r.filteredData.slice(e,e+r.itemsPerPage);r.displayedTools=[...r.displayedTools,...s],U(s)}function p(){let t=c.filter(s=>{const i=r.activeCategory==="all"||s.category===r.activeCategory,o=s.name.toLowerCase().includes(r.searchQuery)||s.desc.toLowerCase().includes(r.searchQuery)||s.tags.some(a=>a.toLowerCase().includes(r.searchQuery));return i&&o});r.sortBy==="rating"?t.sort((s,i)=>i.rating-s.rating):r.sortBy==="newest"&&t.sort((s,i)=>i.id-s.id),r.filteredData=t,r.displayedTools=[],l.toolsGrid.innerHTML="";const e=document.getElementById("scroll-sentinel");e&&e.classList.remove("hidden"),L(),t.length===0?(l.noResults.classList.remove("hidden"),e&&e.classList.add("hidden")):l.noResults.classList.add("hidden")}function U(t){t.forEach(e=>{const s=document.createElement("div");s.className="tool-card bg-white border border-slate-200 rounded-xl p-4 flex flex-col h-full cursor-pointer relative group transition-all duration-200 hover:shadow-lg hover:-translate-y-1";let i="bg-slate-100 text-slate-500",o=e.pricing||"未知";o.includes("免费")?i="bg-green-50 text-green-600 border border-green-100":(o.includes("付费")||o.includes("试用"))&&(i="bg-amber-50 text-amber-600 border border-amber-100");const a=`https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=random&color=fff&size=64&font-size=0.5`,d="fa-cube";s.innerHTML=`
            <!-- Header: Logo + Title + Badge -->
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center w-full overflow-hidden">
                    <!-- Logo -->
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img 
                            src="${e.logo||a}" 
                            alt="${e.name}" 
                            class="w-full h-full object-cover" 
                            loading="lazy" 
                            onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fa-solid ${d} text-slate-400 text-xl\\'></i>';"
                        >
                    </div>
                    
                    <!-- Title & Badge -->
                    <div class="ml-3 flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-slate-900 text-sm truncate pr-2 group-hover:text-blue-600 transition-colors" title="${e.name}">
                                ${e.name}
                            </h3>
                            <span class="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded ${i}">
                                ${o}
                            </span>
                        </div>
                        <!-- Rating/Tags (Optional line under title) -->
                        <div class="flex items-center mt-0.5 text-[10px] text-slate-400 space-x-2">
                             <span class="flex items-center text-amber-500"><i class="fa-solid fa-star mr-0.5"></i> ${e.rating}</span>
                             <span>•</span>
                             <span class="truncate">${e.category}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Body: Description -->
            <div class="mb-4 flex-grow">
                <p class="text-slate-500 text-xs leading-relaxed line-clamp-2" title="${e.desc}">
                    ${e.desc||"暂无描述..."}
                </p>
            </div>
            
            <!-- Footer: Stats + Action -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                <div class="flex items-center text-xs text-slate-400">
                    <i class="fa-regular fa-eye mr-1"></i>
                    <span>${e.visits}</span>
                </div>
                
                <button class="visit-btn opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 flex items-center" onclick="event.stopPropagation(); window.open('${e.url}', '_blank');">
                    访问 <i class="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                </button>
            </div>
        `,s.addEventListener("click",v=>{J(e.id)}),l.toolsGrid.appendChild(s)})}function R(){l.desktopNav.innerHTML=m.map(t=>`
        <button 
            class="category-btn w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-blue-600 transition group ${t.id==="all"?"active":""}"
            onclick="setCategory('${t.id}')"
            data-id="${t.id}"
        >
            <div class="w-6 flex justify-center mr-2">
                <i class="fa-solid ${t.icon} text-slate-400 group-hover:text-blue-500 transition ${t.id==="all"?"text-blue-500":""}"></i>
            </div>
            ${t.name}
            ${t.id==="all"?"":`<span class="ml-auto text-xs text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-400">${V(t.id)}</span>`}
        </button>
    `).join(""),l.mobileNav.innerHTML=m.map(t=>`
        <button 
            class="category-btn-mobile whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition ${t.id==="all"?"bg-blue-600 text-white border-blue-600":"bg-white text-slate-600 border-slate-200"}"
            onclick="setCategory('${t.id}')"
            data-id-mobile="${t.id}"
        >
            ${t.name}
        </button>
    `).join("")}function V(t){return c.filter(e=>e.category===t).length}window.setCategory=t=>{r.activeCategory=t,document.querySelectorAll(".category-btn").forEach(s=>{s.dataset.id===t?(s.classList.add("active"),s.querySelector("i").classList.add("text-blue-500"),s.querySelector("i").classList.remove("text-slate-400")):(s.classList.remove("active"),s.querySelector("i").classList.remove("text-blue-500"),s.querySelector("i").classList.add("text-slate-400"))}),document.querySelectorAll(".category-btn-mobile").forEach(s=>{s.dataset.idMobile===t?(s.classList.remove("bg-white","text-slate-600","border-slate-200"),s.classList.add("bg-blue-600","text-white","border-blue-600")):(s.classList.add("bg-white","text-slate-600","border-slate-200"),s.classList.remove("bg-blue-600","text-white","border-blue-600"))});const e=m.find(s=>s.id===t).name;l.sectionTitle.innerText=e,l.sectionTitle.scrollIntoView({behavior:"smooth",block:"start"}),p()};const E=t=>{r.searchQuery=t.target.value.toLowerCase(),p()};l.searchInput.addEventListener("input",E);l.mobileSearchInput.addEventListener("input",E);l.sortSelect.addEventListener("change",t=>{r.sortBy=t.target.value,p()});window.resetFilters=()=>{r.searchQuery="",l.searchInput.value="",l.mobileSearchInput.value="",setCategory("all")};function J(t){r.view="detail",r.activeToolId=t,S(),window.scrollTo(0,0)}function k(){r.view="home",r.activeToolId=null,S()}window.showHome=k;function S(){const t=document.getElementById("home-view"),e=document.getElementById("detail-view");r.view==="home"?(t.classList.remove("hidden"),e.classList.add("hidden"),document.title="AI工具集 | 1000+ AI工具集合，国内外AI工具集导航大全"):(t.classList.add("hidden"),e.classList.remove("hidden"),K())}function K(){var o;const t=c.find(a=>a.id===r.activeToolId);if(!t)return k();document.title=`${t.name} - AI工具导航`;const e=document.getElementById("detail-content"),s=["支持中文自然语言交互，上手无门槛。","基于最新大模型架构，响应速度极快。","多模态输入输出，满足复杂场景需求。","企业级数据安全保障，隐私无忧。"],i=t.desc.repeat(3)+" 这是一个非常强大的AI工具，能够帮助用户极大提升工作效率。无论是文本生成、图像创作还是代码编写，它都能提供卓越的体验。";e.innerHTML=`
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Content -->
            <div class="flex-1 min-w-0">
                <!-- Breadcrumb -->
                <nav class="text-sm text-slate-500 mb-6 flex items-center space-x-2">
                    <span onclick="showHome()" class="cursor-pointer hover:text-blue-600">首页</span>
                    <i class="fa-solid fa-angle-right text-xs"></i>
                    <span class="cursor-pointer hover:text-blue-600" onclick="setCategory('${t.category}'); showHome();">${((o=m.find(a=>a.id===t.category))==null?void 0:o.name)||t.category}</span>
                    <i class="fa-solid fa-angle-right text-xs"></i>
                    <span class="text-slate-800 font-medium">${t.name}</span>
                </nav>

                <!-- Header -->
                <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div class="flex flex-col sm:flex-row items-start gap-6">
                        <div class="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                            <img src="${t.logo}" class="w-full h-full object-contain" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fa-solid fa-cube text-slate-400 text-4xl\\'></i>';">
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h1 class="text-3xl font-bold text-slate-900">${t.name}</h1>
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-full">${t.pricing}</span>
                            </div>
                            <p class="text-lg text-slate-600 mt-2 leading-relaxed">${t.desc}</p>
                            
                            <div class="flex flex-wrap gap-2 mt-4">
                                ${t.tags.map(a=>`<span class="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium"># ${a}</span>`).join("")}
                            </div>
                            
                            <div class="flex items-center gap-4 mt-6">
                                <a href="${t.url}" target="_blank" class="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                    访问官方网站 <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i>
                                </a>
                                <button class="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition">
                                    <i class="fa-regular fa-heart mr-2"></i> 收藏
                                </button>
                                <button class="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition">
                                    <i class="fa-solid fa-share-nodes"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Body -->
                <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <i class="fa-solid fa-circle-info text-blue-500 mr-2"></i> 工具详情
                    </h2>
                    <div class="prose prose-slate max-w-none text-slate-600 leading-7">
                        <p class="mb-6">${i}</p>
                        <h3 class="text-lg font-bold text-slate-900 mb-3">核心功能</h3>
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            ${s.map(a=>`<li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1.5 mr-2"></i><span>${a}</span></li>`).join("")}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar (Recommendations) -->
            <div class="w-full lg:w-80 flex-shrink-0">
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
                    <h3 class="font-bold text-slate-900 mb-4">相关推荐</h3>
                    <div class="space-y-4">
                        ${c.filter(a=>a.category===t.category&&a.id!==t.id).slice(0,5).map(a=>`
                            <div class="flex items-center gap-3 cursor-pointer group" onclick="showDetail(${a.id})">
                                <div class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                                    <img src="${a.logo}" class="w-full h-full object-contain" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fa-solid fa-cube text-slate-400 text-lg\\'></i>';">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-slate-800 text-sm truncate group-hover:text-blue-600 transition">${a.name}</h4>
                                    <div class="flex items-center text-xs text-slate-400 mt-0.5">
                                        <i class="fa-solid fa-star text-amber-400 mr-1"></i> ${a.rating}
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}l.loginBtn.addEventListener("click",B);l.closeModalX.addEventListener("click",g);l.backdrop.addEventListener("click",g);l.confirmLoginBtn.addEventListener("click",W);function B(){r.isLoggedIn||(l.modal.classList.remove("hidden"),setTimeout(()=>{l.modal.querySelector('div[class*="transform"]').classList.add("modal-enter-active"),l.modal.querySelector('div[class*="transform"]').classList.remove("modal-enter")},10))}function g(){l.modal.classList.add("hidden")}function W(){l.confirmLoginBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> 等待扫码中...',l.confirmLoginBtn.classList.add("opacity-75","cursor-not-allowed"),setTimeout(()=>{r.isLoggedIn=!0,r.user={name:"VIP User",avatar:"fa-user-check"},X(),g(),l.confirmLoginBtn.innerHTML="我已关注，自动登录",l.confirmLoginBtn.classList.remove("opacity-75","cursor-not-allowed")},2e3)}function X(){l.authSection.innerHTML=`
        <div class="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group">
            <div class="hidden md:block text-right">
                <p class="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">Hi, 微信用户</p>
                <p class="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full inline-block">已关注服务号</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <i class="fa-solid fa-user-astronaut text-sm"></i>
            </div>
        </div>
    `}function Y(){const t=document.getElementById("categoryChart").getContext("2d"),e={};c.forEach(s=>{e[s.category]=(e[s.category]||0)+1}),new Chart(t,{type:"doughnut",data:{labels:["写作","图像","视频","办公","编程"],datasets:[{data:[e.text||5,e.image||5,e.video||3,e.office||3,e.code||3],backgroundColor:["#3b82f6","#ec4899","#ef4444","#f59e0b","#1e293b"],borderWidth:0,hoverOffset:10}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{position:"right",labels:{usePointStyle:!0,boxWidth:8}}}}})}class Z{constructor(){this.state="idle",this.scanTimer=null,this.init()}init(){const e=localStorage.getItem("aiark_user");e&&JSON.parse(e).loggedIn&&(this.state="loggedin",this.updateUserUI()),this.bindEvents()}bindEvents(){const e=document.getElementById("refresh-qr-btn");e&&e.addEventListener("click",()=>this.resetQRCode())}openModal(){this.state!=="loggedin"&&(l.modal.classList.remove("hidden"),this.resetState(),this.startPolling())}resetState(){this.state="idle";const e=document.getElementById("scan-status"),s=document.getElementById("login-success-status"),i=document.getElementById("login-status-msg");e&&e.classList.add("hidden"),s&&s.classList.add("hidden"),i&&(i.classList.add("hidden"),i.textContent=""),this.scanTimer&&clearTimeout(this.scanTimer)}resetQRCode(){this.resetState();const e=document.getElementById("wechat-qr-image");e&&(e.style.opacity="0.5",setTimeout(()=>{e.style.opacity="1"},300)),this.startPolling()}startPolling(){this.scanTimer=setTimeout(()=>{this.onScanSuccess()},2e3)}onScanSuccess(){this.state="scanning";const e=document.getElementById("scan-status");e&&e.classList.remove("hidden"),this.scanTimer=setTimeout(()=>{this.onLoginConfirm()},3e3)}onLoginConfirm(){this.state="loggedin";const e=document.getElementById("scan-status"),s=document.getElementById("login-success-status");e&&e.classList.add("hidden"),s&&s.classList.remove("hidden"),localStorage.setItem("aiark_user",JSON.stringify({loggedIn:!0,loginTime:Date.now(),userType:"wechat",userName:"微信用户"})),setTimeout(()=>{this.updateUserUI(),g()},1500)}updateUserUI(){const e=document.getElementById("auth-section");if(!e)return;e.innerHTML=`
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group" id="user-profile">
                <div class="hidden md:block text-right">
                    <p class="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">Hi, 微信用户</p>
                    <p class="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full inline-block">
                        <i class="fa-solid fa-check-circle mr-1"></i>已登录
                    </p>
                </div>
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <i class="fa-solid fa-user text-sm"></i>
                </div>
            </div>
        `;const s=document.getElementById("user-profile");s&&s.addEventListener("click",()=>{confirm("是否退出登录？")&&this.logout()})}logout(){localStorage.removeItem("aiark_user"),this.state="idle";const e=document.getElementById("auth-section");if(e){e.innerHTML=`
                <button id="login-btn" class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition flex items-center shadow-md hover:shadow-lg transform active:scale-95">
                    <i class="fa-brands fa-weixin mr-2"></i> 登录 / 注册
                </button>
            `;const s=document.getElementById("login-btn");s&&s.addEventListener("click",()=>this.openModal())}alert("已退出登录")}}const ee=new Z;l.loginBtn.removeEventListener("click",B);l.loginBtn.addEventListener("click",()=>ee.openModal());
