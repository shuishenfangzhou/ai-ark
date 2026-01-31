(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();class v{constructor(){this.events=[],this.startTime=Date.now()}track(t,s={}){const r={name:t,properties:s,timestamp:Date.now(),url:window.location.href,userAgent:navigator.userAgent};this.events.push(r),this.sendEvent(r)}sendEvent(t){console.log("Analytics Event:",t),typeof gtag<"u"&&gtag("event",t.name,{custom_parameter:JSON.stringify(t.properties)})}trackPageView(t){this.track("page_view",{page:t})}trackToolClick(t,s){this.track("tool_click",{tool_name:t,tool_id:s})}trackSearch(t,s){this.track("search",{query:t,results_count:s})}trackCategoryChange(t){this.track("category_change",{category:t})}getSessionStats(){return{duration:Date.now()-this.startTime,events_count:this.events.length,events:this.events}}}const x=new v;let l=[];async function y(){try{const e=await fetch("/toolsData.json");if(!e.ok)throw new Error("Failed to load tools data");l=await e.json(),console.log(`Loaded ${l.length} tools`),g()}catch(e){console.error("Error loading tools data:",e),l=w(),g()}}function w(){return[{id:1,name:"DeepSeek",category:"text",desc:"深度求索开源模型，推理能力极其强大。",url:"https://www.deepseek.com/",tags:["开源","国产","免费"],pricing:"开源",visits:"78M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=DeepSeek&background=random&color=fff&size=128"},{id:2,name:"Kimi智能助手",category:"text",desc:"月之暗面出品，支持20万字超长上下文。",url:"https://kimi.moonshot.cn/",tags:["长文本","文件分析","免费"],pricing:"免费",visits:"66M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=Kimi&background=random&color=fff&size=128"},{id:3,name:"豆包",category:"text",desc:"字节跳动出品，语音交互体验极佳。",url:"https://www.doubao.com/",tags:["语音","日常","免费"],pricing:"免费",visits:"33M+",rating:4.9,logo:"https://ui-avatars.com/api/?name=豆包&background=random&color=fff&size=128"},{id:4,name:"ChatGPT",category:"text",desc:"OpenAI的划时代产品，GPT-4o最强模型。",url:"https://chat.openai.com/",tags:["对话","写作","付费"],pricing:"付费",visits:"50M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=ChatGPT&background=random&color=fff&size=128"},{id:5,name:"Midjourney",category:"image",desc:"目前生成质量最高的AI绘画工具。",url:"https://www.midjourney.com/",tags:["绘画","设计","付费"],pricing:"付费",visits:"454M+",rating:4.6,logo:"https://ui-avatars.com/api/?name=Midjourney&background=random&color=fff&size=128"},{id:6,name:"Stable Diffusion",category:"image",desc:"开源AI绘画基石，可本地部署。",url:"https://stability.ai/",tags:["绘画","开源","免费"],pricing:"开源",visits:"4M+",rating:4.7,logo:"https://ui-avatars.com/api/?name=SD&background=random&color=fff&size=128"},{id:7,name:"Runway",category:"video",desc:"Gen-2模型，视频编辑与生成的专业工具。",url:"https://runwayml.com/",tags:["视频","编辑","付费"],pricing:"付费",visits:"43M+",rating:4.8,logo:"https://ui-avatars.com/api/?name=Runway&background=random&color=fff&size=128"},{id:8,name:"GitHub Copilot",category:"code",desc:"最流行的AI编程助手，自动补全代码。",url:"https://github.com/features/copilot",tags:["编程","代码","付费"],pricing:"付费",visits:"35M+",rating:4.9,logo:"https://ui-avatars.com/api/?name=Copilot&background=random&color=fff&size=128"},{id:9,name:"Suno",category:"audio",desc:"一键生成广播级歌曲，音乐界ChatGPT。",url:"https://suno.ai/",tags:["音乐","音频","付费"],pricing:"付费",visits:"97M+",rating:4.9,logo:"https://ui-avatars.com/api/?name=Suno&background=random&color=fff&size=128"},{id:10,name:"Notion AI",category:"office",desc:"集成在笔记中的AI，润色、总结、翻译。",url:"https://www.notion.so/product/ai",tags:["办公","笔记","付费"],pricing:"付费",visits:"76M+",rating:4.8,logo:"https://ui-avatars.com/api/?name=Notion&background=random&color=fff&size=128"}]}function g(){k(),u(),A(),i.totalCount.innerText=l.length,L(),x.trackPageView("home")}const d=[{id:"all",name:"全部工具",icon:"fa-layer-group"},{id:"text",name:"AI写作工具",icon:"fa-pen-nib"},{id:"image",name:"AI图像工具",icon:"fa-image"},{id:"video",name:"AI视频工具",icon:"fa-video"},{id:"office",name:"AI办公工具",icon:"fa-briefcase"},{id:"agent",name:"AI智能体",icon:"fa-robot"},{id:"code",name:"AI编程工具",icon:"fa-code"},{id:"audio",name:"AI音频工具",icon:"fa-microphone-lines"},{id:"search",name:"AI搜索引擎",icon:"fa-search"},{id:"dev",name:"AI开发平台",icon:"fa-laptop-code"},{id:"learn",name:"AI学习网站",icon:"fa-graduation-cap"}];let a={view:"home",activeToolId:null,searchQuery:"",activeCategory:"all",sortBy:"popular",isLoggedIn:!1,user:null,itemsPerPage:36,displayedTools:[],filteredData:[],favorites:JSON.parse(localStorage.getItem("ai-tools-favorites")||"[]"),likes:JSON.parse(localStorage.getItem("ai-tools-likes")||"{}")};const i={toolsGrid:document.getElementById("tools-grid"),desktopNav:document.getElementById("desktop-categories"),mobileNav:document.getElementById("mobile-categories"),searchInput:document.getElementById("global-search"),mobileSearchInput:document.getElementById("mobile-search"),sectionTitle:document.getElementById("section-title"),totalCount:document.getElementById("total-tools-count"),noResults:document.getElementById("no-results"),loginBtn:document.getElementById("login-btn"),modal:document.getElementById("login-modal"),closeModalX:document.getElementById("close-modal-x"),confirmLoginBtn:document.getElementById("confirm-login-btn"),backdrop:document.getElementById("modal-backdrop"),authSection:document.getElementById("auth-section"),sortSelect:document.getElementById("sort-select")};document.addEventListener("DOMContentLoaded",()=>{y()});function L(){const e=new IntersectionObserver(s=>{s[0].isIntersecting&&a.view==="home"&&f()},{rootMargin:"200px"}),t=document.createElement("div");t.id="scroll-sentinel",t.className="col-span-full h-10 flex justify-center items-center text-slate-400 text-sm",t.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> 加载更多...',i.toolsGrid.after(t),e.observe(t)}function f(){const e=a.filteredData.length,t=a.displayedTools.length;if(t>=e){const r=document.getElementById("scroll-sentinel");r&&r.classList.add("hidden");return}const s=a.filteredData.slice(t,t+a.itemsPerPage);a.displayedTools=[...a.displayedTools,...s],I(s)}function u(){let e=l.filter(s=>{const r=a.activeCategory==="all"||s.category===a.activeCategory,n=s.name.toLowerCase().includes(a.searchQuery)||s.desc.toLowerCase().includes(a.searchQuery)||s.tags.some(o=>o.toLowerCase().includes(a.searchQuery));return r&&n});a.sortBy==="rating"?e.sort((s,r)=>r.rating-s.rating):a.sortBy==="newest"&&e.sort((s,r)=>r.id-s.id),a.filteredData=e,a.displayedTools=[],i.toolsGrid.innerHTML="";const t=document.getElementById("scroll-sentinel");t&&t.classList.remove("hidden"),f(),e.length===0?(i.noResults.classList.remove("hidden"),t&&t.classList.add("hidden")):i.noResults.classList.add("hidden")}function I(e){e.forEach(t=>{const s=document.createElement("div");s.className="tool-card bg-white border border-slate-200 rounded-xl p-4 flex flex-col h-full cursor-pointer relative group transition-all duration-200 hover:shadow-lg hover:-translate-y-1";let r="bg-slate-100 text-slate-500",n=t.pricing||"未知";n.includes("免费")?r="bg-green-50 text-green-600 border border-green-100":(n.includes("付费")||n.includes("试用"))&&(r="bg-amber-50 text-amber-600 border border-amber-100");const o=`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&color=fff&size=64&font-size=0.5`,c="fa-cube";s.innerHTML=`
            <!-- Header: Logo + Title + Badge -->
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center w-full overflow-hidden">
                    <!-- Logo -->
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img 
                            src="${t.logo||o}" 
                            alt="${t.name}" 
                            class="w-full h-full object-cover" 
                            loading="lazy" 
                            onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fa-solid ${c} text-slate-400 text-xl\\'></i>';"
                        >
                    </div>
                    
                    <!-- Title & Badge -->
                    <div class="ml-3 flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-slate-900 text-sm truncate pr-2 group-hover:text-blue-600 transition-colors" title="${t.name}">
                                ${t.name}
                            </h3>
                            <span class="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded ${r}">
                                ${n}
                            </span>
                        </div>
                        <!-- Rating/Tags (Optional line under title) -->
                        <div class="flex items-center mt-0.5 text-[10px] text-slate-400 space-x-2">
                             <span class="flex items-center text-amber-500"><i class="fa-solid fa-star mr-0.5"></i> ${t.rating}</span>
                             <span>•</span>
                             <span class="truncate">${t.category}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Body: Description -->
            <div class="mb-4 flex-grow">
                <p class="text-slate-500 text-xs leading-relaxed line-clamp-2" title="${t.desc}">
                    ${t.desc||"暂无描述..."}
                </p>
            </div>
            
            <!-- Footer: Stats + Action -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                <div class="flex items-center text-xs text-slate-400">
                    <i class="fa-regular fa-eye mr-1"></i>
                    <span>${t.visits}</span>
                </div>
                
                <button class="visit-btn opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 flex items-center" onclick="event.stopPropagation(); window.open('${t.url}', '_blank');">
                    访问 <i class="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                </button>
            </div>
        `,s.addEventListener("click",M=>{E(t.id)}),i.toolsGrid.appendChild(s)})}function k(){i.desktopNav.innerHTML=d.map(e=>`
        <button 
            class="category-btn w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-blue-600 transition group ${e.id==="all"?"active":""}"
            onclick="setCategory('${e.id}')"
            data-id="${e.id}"
        >
            <div class="w-6 flex justify-center mr-2">
                <i class="fa-solid ${e.icon} text-slate-400 group-hover:text-blue-500 transition ${e.id==="all"?"text-blue-500":""}"></i>
            </div>
            ${e.name}
            ${e.id==="all"?"":`<span class="ml-auto text-xs text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-400">${$(e.id)}</span>`}
        </button>
    `).join(""),i.mobileNav.innerHTML=d.map(e=>`
        <button 
            class="category-btn-mobile whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition ${e.id==="all"?"bg-blue-600 text-white border-blue-600":"bg-white text-slate-600 border-slate-200"}"
            onclick="setCategory('${e.id}')"
            data-id-mobile="${e.id}"
        >
            ${e.name}
        </button>
    `).join("")}function $(e){return l.filter(t=>t.category===e).length}window.setCategory=e=>{a.activeCategory=e,document.querySelectorAll(".category-btn").forEach(s=>{s.dataset.id===e?(s.classList.add("active"),s.querySelector("i").classList.add("text-blue-500"),s.querySelector("i").classList.remove("text-slate-400")):(s.classList.remove("active"),s.querySelector("i").classList.remove("text-blue-500"),s.querySelector("i").classList.add("text-slate-400"))}),document.querySelectorAll(".category-btn-mobile").forEach(s=>{s.dataset.idMobile===e?(s.classList.remove("bg-white","text-slate-600","border-slate-200"),s.classList.add("bg-blue-600","text-white","border-blue-600")):(s.classList.add("bg-white","text-slate-600","border-slate-200"),s.classList.remove("bg-blue-600","text-white","border-blue-600"))});const t=d.find(s=>s.id===e).name;i.sectionTitle.innerText=t,i.sectionTitle.scrollIntoView({behavior:"smooth",block:"start"}),u()};const p=e=>{a.searchQuery=e.target.value.toLowerCase(),u()};i.searchInput.addEventListener("input",p);i.mobileSearchInput.addEventListener("input",p);i.sortSelect.addEventListener("change",e=>{a.sortBy=e.target.value,u()});window.resetFilters=()=>{a.searchQuery="",i.searchInput.value="",i.mobileSearchInput.value="",setCategory("all")};function E(e){a.view="detail",a.activeToolId=e,b(),window.scrollTo(0,0)}function h(){a.view="home",a.activeToolId=null,b()}window.showHome=h;function b(){const e=document.getElementById("home-view"),t=document.getElementById("detail-view");a.view==="home"?(e.classList.remove("hidden"),t.classList.add("hidden"),document.title="AI工具集 | 1000+ AI工具集合，国内外AI工具集导航大全"):(e.classList.add("hidden"),t.classList.remove("hidden"),T())}function T(){var n;const e=l.find(o=>o.id===a.activeToolId);if(!e)return h();document.title=`${e.name} - AI工具导航`;const t=document.getElementById("detail-content"),s=["支持中文自然语言交互，上手无门槛。","基于最新大模型架构，响应速度极快。","多模态输入输出，满足复杂场景需求。","企业级数据安全保障，隐私无忧。"],r=e.desc.repeat(3)+" 这是一个非常强大的AI工具，能够帮助用户极大提升工作效率。无论是文本生成、图像创作还是代码编写，它都能提供卓越的体验。";t.innerHTML=`
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Content -->
            <div class="flex-1 min-w-0">
                <!-- Breadcrumb -->
                <nav class="text-sm text-slate-500 mb-6 flex items-center space-x-2">
                    <span onclick="showHome()" class="cursor-pointer hover:text-blue-600">首页</span>
                    <i class="fa-solid fa-angle-right text-xs"></i>
                    <span class="cursor-pointer hover:text-blue-600" onclick="setCategory('${e.category}'); showHome();">${((n=d.find(o=>o.id===e.category))==null?void 0:n.name)||e.category}</span>
                    <i class="fa-solid fa-angle-right text-xs"></i>
                    <span class="text-slate-800 font-medium">${e.name}</span>
                </nav>

                <!-- Header -->
                <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div class="flex flex-col sm:flex-row items-start gap-6">
                        <div class="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                            <img src="${e.logo}" class="w-full h-full object-contain" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fa-solid fa-cube text-slate-400 text-4xl\\'></i>';">
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h1 class="text-3xl font-bold text-slate-900">${e.name}</h1>
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-full">${e.pricing}</span>
                            </div>
                            <p class="text-lg text-slate-600 mt-2 leading-relaxed">${e.desc}</p>
                            
                            <div class="flex flex-wrap gap-2 mt-4">
                                ${e.tags.map(o=>`<span class="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium"># ${o}</span>`).join("")}
                            </div>
                            
                            <div class="flex items-center gap-4 mt-6">
                                <a href="${e.url}" target="_blank" class="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
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
                        <p class="mb-6">${r}</p>
                        <h3 class="text-lg font-bold text-slate-900 mb-3">核心功能</h3>
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            ${s.map(o=>`<li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1.5 mr-2"></i><span>${o}</span></li>`).join("")}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar (Recommendations) -->
            <div class="w-full lg:w-80 flex-shrink-0">
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
                    <h3 class="font-bold text-slate-900 mb-4">相关推荐</h3>
                    <div class="space-y-4">
                        ${l.filter(o=>o.category===e.category&&o.id!==e.id).slice(0,5).map(o=>`
                            <div class="flex items-center gap-3 cursor-pointer group" onclick="showDetail(${o.id})">
                                <div class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                                    <img src="${o.logo}" class="w-full h-full object-contain" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fa-solid fa-cube text-slate-400 text-lg\\'></i>';">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-slate-800 text-sm truncate group-hover:text-blue-600 transition">${o.name}</h4>
                                    <div class="flex items-center text-xs text-slate-400 mt-0.5">
                                        <i class="fa-solid fa-star text-amber-400 mr-1"></i> ${o.rating}
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}i.loginBtn.addEventListener("click",B);i.closeModalX.addEventListener("click",m);i.backdrop.addEventListener("click",m);i.confirmLoginBtn.addEventListener("click",C);function B(){a.isLoggedIn||(i.modal.classList.remove("hidden"),setTimeout(()=>{i.modal.querySelector('div[class*="transform"]').classList.add("modal-enter-active"),i.modal.querySelector('div[class*="transform"]').classList.remove("modal-enter")},10))}function m(){i.modal.classList.add("hidden")}function C(){i.confirmLoginBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> 等待扫码中...',i.confirmLoginBtn.classList.add("opacity-75","cursor-not-allowed"),setTimeout(()=>{a.isLoggedIn=!0,a.user={name:"VIP User",avatar:"fa-user-check"},S(),m(),i.confirmLoginBtn.innerHTML="我已关注，自动登录",i.confirmLoginBtn.classList.remove("opacity-75","cursor-not-allowed")},2e3)}function S(){i.authSection.innerHTML=`
        <div class="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group">
            <div class="hidden md:block text-right">
                <p class="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">Hi, 微信用户</p>
                <p class="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full inline-block">已关注服务号</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <i class="fa-solid fa-user-astronaut text-sm"></i>
            </div>
        </div>
    `}function A(){const e=document.getElementById("categoryChart").getContext("2d"),t={};l.forEach(s=>{t[s.category]=(t[s.category]||0)+1}),new Chart(e,{type:"doughnut",data:{labels:["写作","图像","视频","办公","编程"],datasets:[{data:[t.text||5,t.image||5,t.video||3,t.office||3,t.code||3],backgroundColor:["#3b82f6","#ec4899","#ef4444","#f59e0b","#1e293b"],borderWidth:0,hoverOffset:10}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{position:"right",labels:{usePointStyle:!0,boxWidth:8}}}}})}
