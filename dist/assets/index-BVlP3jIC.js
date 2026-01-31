(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const m of r.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&s(m)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}})();const a={tools:[],categories:[],filteredTools:[],displayedTools:[],currentPage:1,itemsPerPage:24,activeCategory:"all",activeSubcategory:null,searchQuery:"",sortBy:"popular",filters:{pricing:[],chinese:!1},compareList:[],favorites:JSON.parse(localStorage.getItem("aiark_favorites")||"[]"),viewMode:"grid",isLoggedIn:!1,user:null},f=[{id:"chat",name:"AI 对话",icon:"fa-comments",color:"#3b82f6"},{id:"writing",name:"AI 写作",icon:"fa-pen-nib",color:"#f59e0b"},{id:"image",name:"AI 绘画",icon:"fa-image",color:"#ec4899"},{id:"video",name:"AI 视频",icon:"fa-video",color:"#8b5cf6"},{id:"office",name:"AI 办公",icon:"fa-briefcase",color:"#10b981"},{id:"dev",name:"AI 编程",icon:"fa-code",color:"#6366f1"},{id:"search",name:"AI 搜索",icon:"fa-search",color:"#14b8a6"},{id:"audio",name:"AI 音频",icon:"fa-music",color:"#06b6d4"}],h=[{id:1,name:"DeepSeek",category:"chat",tags:["开源","免费","强逻辑"],desc:"深度求索开发的开源大语言模型，擅长代码生成与数学推理，中文能力出色。",rating:4.9,visits:"78M+",logo:"https://placehold.co/64x64/2563eb/white?text=DS",url:"https://chat.deepseek.com",pricing:"免费/开源",chinese_support:!0,popularity_score:99},{id:2,name:"Kimi 智能助手",category:"chat",tags:["长文本","文件分析","免费"],desc:"月之暗面科技推出的智能助手，支持20万字超长上下文，擅长研报分析与长文总结。",rating:4.8,visits:"52M+",logo:"https://placehold.co/64x64/000000/white?text=Kimi",url:"https://kimi.moonshot.cn",pricing:"免费",chinese_support:!0,popularity_score:95},{id:3,name:"豆包",category:"chat",tags:["语音对话","生活助手","免费"],desc:"字节跳动出品的AI对话助手，语音交互体验自然，提供多种个性化智能体。",rating:4.7,visits:"45M+",logo:"https://placehold.co/64x64/3b82f6/white?text=DB",url:"https://www.doubao.com",pricing:"免费",chinese_support:!0,popularity_score:92},{id:4,name:"通义千问",category:"chat",tags:["全能型","文档解析","阿里"],desc:"阿里巴巴推出的超大规模预训练模型，具备多轮对话、文案创作、逻辑推理等能力。",rating:4.7,visits:"60M+",logo:"https://placehold.co/64x64/6366f1/white?text=QW",url:"https://tongyi.aliyun.com",pricing:"免费/付费",chinese_support:!0,popularity_score:94},{id:5,name:"文心一言",category:"chat",tags:["知识增强","百度","绘图"],desc:"百度全新一代知识增强大语言模型，能够与人对话互动，回答问题，协助创作。",rating:4.6,visits:"80M+",logo:"https://placehold.co/64x64/2563eb/white?text=EB",url:"https://yiyan.baidu.com",pricing:"免费/付费",chinese_support:!0,popularity_score:93},{id:6,name:"ChatGPT",category:"chat",tags:["基准","最强","OpenAI"],desc:"OpenAI开发的革命性AI对话工具，GPT-4模型代表了当前LLM的最高水平。",rating:4.9,visits:"1.6B+",logo:"https://placehold.co/64x64/10a37f/white?text=GPT",url:"https://chat.openai.com",pricing:"免费/付费",chinese_support:!0,popularity_score:100},{id:7,name:"Midjourney",category:"image",tags:["绘图","艺术","高质量"],desc:"目前效果最好的AI绘画工具之一，能够生成照片级逼真且富有艺术感的图像。",rating:4.9,visits:"30M+",logo:"https://placehold.co/64x64/000000/white?text=MJ",url:"https://www.midjourney.com",pricing:"付费",chinese_support:!1,popularity_score:96},{id:8,name:"Claude 3",category:"chat",tags:["安全","写作","长窗口"],desc:"Anthropic开发的大模型，在写作风格和逻辑推理上表现优异，也是GPT-4的强力竞争者。",rating:4.8,visits:"25M+",logo:"https://placehold.co/64x64/d97757/white?text=CL",url:"https://claude.ai",pricing:"免费/付费",chinese_support:!1,popularity_score:91}],o={};document.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 AI方舟 初始化中..."),v(),await b(),$(),x(),w(),d(),I(),B(),T(),y(),console.log("✅ AI方舟 初始化完成")});function y(){if(window.echarts&&document.getElementById("stats-chart")){const t=echarts.init(document.getElementById("stats-chart")),e={tooltip:{trigger:"item"},legend:{show:!1},series:[{name:"工具分类",type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},label:{show:!1},emphasis:{label:{show:!1}},labelLine:{show:!1},data:[{value:1048,name:"AI 对话",itemStyle:{color:"#3b82f6"}},{value:735,name:"AI 绘画",itemStyle:{color:"#ec4899"}},{value:580,name:"AI 写作",itemStyle:{color:"#f59e0b"}},{value:484,name:"AI 视频",itemStyle:{color:"#8b5cf6"}},{value:300,name:"其他",itemStyle:{color:"#cbd5e1"}}]}]};t.setOption(e),window.addEventListener("resize",()=>{t.resize()})}}function v(){o.toolsGrid=document.getElementById("tools-grid"),o.categoryNav=document.getElementById("category-nav"),o.mobileCategories=document.getElementById("mobile-categories"),o.globalSearch=document.getElementById("global-search"),o.mobileSearch=document.getElementById("mobile-search"),o.pageTitle=document.getElementById("page-title"),o.totalCountBadge=document.getElementById("total-count-badge"),o.sortSelect=document.getElementById("sort-select"),o.activeFilters=document.getElementById("active-filters"),o.noResults=document.getElementById("no-results"),o.loadingState=document.getElementById("loading-state"),o.loadMoreBtn=document.getElementById("load-more-btn"),o.compareBtn=document.getElementById("compare-btn"),o.compareCount=document.getElementById("compare-count"),o.compareDrawer=document.getElementById("compare-drawer"),o.compareItems=document.getElementById("compare-items"),o.compareModal=document.getElementById("compare-modal"),o.compareTable=document.getElementById("compare-table"),o.loginModal=document.getElementById("login-modal"),o.loginBtn=document.getElementById("login-btn"),o.authSection=document.getElementById("auth-section"),o.favoritesBtn=document.getElementById("favorites-btn"),o.todayRecommendations=document.getElementById("today-recommendations"),o.myCollections=document.getElementById("my-collections")}async function b(){try{o.loadingState.classList.remove("hidden"),await new Promise(t=>setTimeout(t,300)),a.categories=f,a.tools=h,a.filteredTools=[...a.tools],o.totalCountBadge&&(o.totalCountBadge.textContent=1428),E(),console.log(`📊 加载了 ${a.tools.length} 个工具，${a.categories.length} 个分类`)}catch(t){console.error("❌ 数据加载失败:",t),c("数据加载失败，请刷新页面重试","error")}finally{o.loadingState.classList.add("hidden")}}function x(){if(!a.categories.length)return;const t=a.categories.map(i=>`
        <div class="category-group" data-category="${i.id}">
            <button class="category-item w-full flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition mb-1" onclick="selectCategory('${i.id}')">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm" style="background-color: ${i.color}">
                    <i class="fa-solid ${i.icon} text-sm"></i>
                </div>
                <span class="flex-1 text-left">${i.name}</span>
                <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shadow-inner">
                    ${Math.floor(Math.random()*100)+10}
                </span>
            </button>
        </div>
    `).join("");o.categoryNav&&(o.categoryNav.innerHTML=t);const e=a.categories.map(i=>`
        <button class="category-btn-mobile whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2" 
                onclick="selectCategory('${i.id}')"
                data-id="${i.id}"
                style="border-color: ${i.color}20; color: ${i.color}">
            <i class="fa-solid ${i.icon}"></i>
            ${i.name}
        </button>
    `).join("");o.mobileCategories&&(o.mobileCategories.innerHTML=e)}window.selectCategory=function(t){a.activeCategory=t,a.activeSubcategory=null,a.currentPage=1,document.querySelectorAll(".category-item").forEach(i=>{var s;i.classList.remove("active"),((s=i.closest(".category-group"))==null?void 0:s.dataset.category)===t&&i.classList.add("active")});const e=document.getElementById("all-categories-btn");if(t==="all"?e==null||e.classList.add("active"):e==null||e.classList.remove("active"),t==="all")o.pageTitle&&(o.pageTitle.textContent="全部工具");else{const i=a.categories.find(s=>s.id===t);o.pageTitle&&i&&(o.pageTitle.textContent=i.name)}l()};window.selectSubcategory=function(t,e){a.activeCategory=t,a.activeSubcategory=e,a.currentPage=1,o.pageTitle&&(o.pageTitle.textContent=e),l(),event.stopPropagation()};function w(){document.querySelectorAll(".filter-pricing").forEach(e=>{e.addEventListener("change",()=>{const i=Array.from(document.querySelectorAll(".filter-pricing:checked")).map(s=>s.value);a.filters.pricing=i,a.currentPage=1,l()})});const t=document.getElementById("filter-chinese");t&&t.addEventListener("change",()=>{a.filters.chinese=t.checked,a.currentPage=1,l()}),o.sortSelect&&o.sortSelect.addEventListener("change",()=>{a.sortBy=o.sortSelect.value,l()})}function l(){let t=[...a.tools];if(a.activeCategory!=="all"&&(t=t.filter(e=>e.category===a.activeCategory)),a.searchQuery){const e=a.searchQuery.toLowerCase();t=t.filter(i=>i.name.toLowerCase().includes(e)||i.desc.toLowerCase().includes(e)||i.tags.some(s=>s.toLowerCase().includes(e)))}switch(a.filters.pricing.length>0&&(t=t.filter(e=>{const i=e.pricing_type||(e.pricing.includes("免费")?"free":"paid");return a.filters.pricing.includes(i)})),a.filters.chinese&&(t=t.filter(e=>e.chinese_support)),a.sortBy){case"popular":t.sort((e,i)=>(i.popularity_score||0)-(e.popularity_score||0));break;case"newest":t.sort((e,i)=>i.id-e.id);break;case"rating":t.sort((e,i)=>(i.rating||0)-(e.rating||0));break;case"name":t.sort((e,i)=>e.name.localeCompare(i.name,"zh"));break}a.filteredTools=t,a.currentPage=1,L(),d()}function L(){if(!o.activeFilters)return;const t=[];if(a.activeCategory!=="all"){const e=a.categories.find(i=>i.id===a.activeCategory);t.push({text:(e==null?void 0:e.name)||a.activeCategory,onRemove:()=>selectCategory("all")})}if(a.searchQuery&&t.push({text:`搜索: ${a.searchQuery}`,onRemove:()=>{a.searchQuery="",o.globalSearch.value="",o.mobileSearch.value="",l()}}),t.length===0){o.activeFilters.classList.add("hidden");return}o.activeFilters.innerHTML=t.map(e=>`
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
            ${e.text}
            <button onclick="(${e.onRemove})()" class="ml-2 text-blue-400 hover:text-blue-600">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join(""),o.activeFilters.classList.remove("hidden")}function d(){if(!o.toolsGrid)return;const t=0,e=a.currentPage*a.itemsPerPage,i=a.filteredTools.slice(t,e);if(i.length===0){o.toolsGrid.innerHTML="",o.noResults.classList.remove("hidden"),o.loadMoreBtn.classList.add("hidden");return}o.noResults.classList.add("hidden");const s=i.map(n=>C(n)).join("");o.toolsGrid.innerHTML=s,a.filteredTools.length>e?o.loadMoreBtn.classList.remove("hidden"):o.loadMoreBtn.classList.add("hidden")}function C(t){const e=a.categories.find(s=>s.id===t.category),i=a.favorites.includes(t.id);return a.compareList.includes(t.id),`
        <div class="tool-card bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl cursor-pointer group animate-fade-in" data-tool-id="${t.id}" onclick="showToolDetail(${t.id})">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src="${t.logo}" alt="${t.name}" class="w-full h-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&color=fff&size=64'">
                    </div>
                    <div class="min-w-0">
                        <h3 class="font-bold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors">${t.name}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs px-2 py-0.5 rounded-full" style="background-color: ${(e==null?void 0:e.color)||"#3b82f6"}20; color: ${(e==null?void 0:e.color)||"#3b82f6"}">
                                ${(e==null?void 0:e.name)||t.category}
                            </span>
                            ${t.chinese_support?'<span class="text-xs text-red-500" title="中文支持">🇨🇳</span>':""}
                        </div>
                    </div>
                </div>
                <button onclick="toggleFavorite(${t.id}, event)" class="text-slate-300 hover:text-red-500 transition ${i?"text-red-500":""}">
                    <i class="${i?"fa-solid":"fa-regular"} fa-heart"></i>
                </button>
            </div>
            
            <!-- Description -->
            <p class="text-slate-500 text-sm line-clamp-2 mb-4 h-10">${t.desc}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
                ${t.tags.slice(0,3).map(s=>`
                    <span class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">${s}</span>
                `).join("")}
            </div>
            
            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                <div class="flex items-center gap-3 text-xs text-slate-400">
                    <span class="flex items-center gap-1">
                        <i class="fa-solid fa-star text-amber-400"></i>
                        ${t.rating||"-"}
                    </span>
                    <span class="flex items-center gap-1">
                        <i class="fa-regular fa-eye"></i>
                        ${t.visits||"-"}
                    </span>
                </div>
                
                <div class="flex items-center gap-2">
                    <button onclick="window.open('${t.url}', '_blank'); event.stopPropagation();" class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                        访问
                    </button>
                </div>
            </div>
        </div>
    `}function $(){o.globalSearch&&(o.globalSearch.addEventListener("input",g(e=>{a.searchQuery=e.target.value,a.currentPage=1,l()},300)),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="k"&&(e.preventDefault(),o.globalSearch.focus())})),o.mobileSearch&&o.mobileSearch.addEventListener("input",g(e=>{a.searchQuery=e.target.value,a.currentPage=1,l()},300)),o.loadMoreBtn&&o.loadMoreBtn.addEventListener("click",()=>{a.currentPage++,d()}),o.loginBtn&&o.loginBtn.addEventListener("click",()=>{o.loginModal.classList.remove("hidden")});const t=document.getElementById("all-categories-btn");t&&t.addEventListener("click",()=>{selectCategory("all")})}function g(t,e){let i;return function(...n){const r=()=>{clearTimeout(i),t(...n)};clearTimeout(i),i=setTimeout(r,e)}}function I(){u()}window.toggleCompare=function(t){const e=a.compareList.indexOf(t);if(e>-1)a.compareList.splice(e,1);else{if(a.compareList.length>=4){c("最多只能对比4个工具","warning");return}a.compareList.push(t)}u(),d()};function u(){const t=a.compareList.length;if(o.compareCount&&(o.compareCount.textContent=t,o.compareCount.classList.toggle("hidden",t===0)),t>0){o.compareDrawer.classList.remove("translate-y-full");const e=a.compareList.map(i=>a.tools.find(s=>s.id===i)).filter(Boolean);o.compareItems.innerHTML=e.map(i=>`
            <div class="flex-shrink-0 w-32 bg-slate-50 rounded-lg p-2 relative">
                <button onclick="toggleCompare(${i.id})" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${i.logo}" class="w-8 h-8 rounded mx-auto mb-1">
                <p class="text-xs text-center truncate">${i.name}</p>
            </div>
        `).join(""),document.getElementById("compare-drawer-count").textContent=t}else o.compareDrawer.classList.add("translate-y-full")}window.clearCompare=function(){a.compareList=[],u(),d()};window.toggleCompareDrawer=function(){o.compareDrawer.classList.toggle("translate-y-full")};window.startCompare=function(){if(a.compareList.length<2){c("请至少选择2个工具进行对比","warning");return}const t=a.compareList.map(i=>a.tools.find(s=>s.id===i)).filter(Boolean),e=[{label:"工具名称",key:"name"},{label:"分类",key:"category",render:i=>{var s;return((s=a.categories.find(n=>n.id===i))==null?void 0:s.name)||i}},{label:"评分",key:"rating"},{label:"访问量",key:"visits"},{label:"价格",key:"pricing"},{label:"中文支持",key:"chinese_support",render:i=>i?"✅":"❌"},{label:"描述",key:"desc"}];o.compareTable.innerHTML=`
        <table class="w-full">
            <thead>
                <tr class="border-b border-slate-200">
                    <th class="text-left py-3 px-4 font-semibold text-slate-700">对比项</th>
                    ${t.map(i=>`
                        <th class="text-center py-3 px-4">
                            <div class="flex flex-col items-center">
                                <img src="${i.logo}" class="w-10 h-10 rounded-lg mb-2">
                                <span class="font-semibold text-slate-900">${i.name}</span>
                            </div>
                        </th>
                    `).join("")}
                </tr>
            </thead>
            <tbody>
                ${e.map(i=>`
                    <tr class="border-b border-slate-100">
                        <td class="py-3 px-4 font-medium text-slate-600">${i.label}</td>
                        ${t.map(s=>`
                            <td class="py-3 px-4 text-center text-slate-700">
                                ${i.render?i.render(s[i.key]):s[i.key]||"-"}
                            </td>
                        `).join("")}
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,o.compareModal.classList.remove("hidden")};window.closeCompareModal=function(){o.compareModal.classList.add("hidden")};function B(){p()}window.toggleFavorite=function(t,e){e&&e.stopPropagation();const i=a.favorites.indexOf(t);i>-1?(a.favorites.splice(i,1),c("已取消收藏","info")):(a.favorites.push(t),c("已添加到收藏","success")),localStorage.setItem("aiark_favorites",JSON.stringify(a.favorites)),p(),d()};function p(){if(o.favoritesBtn){const t=a.favorites.length;o.favoritesBtn.innerHTML=`
            <i class="${t>0?"fa-solid text-red-500":"fa-regular"} fa-heart mr-2"></i>
            收藏${t>0?` (${t})`:""}
        `}if(o.myCollections)if(a.favorites.length===0)o.myCollections.innerHTML=`
                <div class="text-center py-4 text-slate-400 text-sm">
                    <i class="fa-regular fa-folder-open text-3xl mb-2"></i>
                    <p>暂无收藏工具</p>
                </div>
            `;else{const t=a.favorites.map(e=>a.tools.find(i=>i.id===e)).filter(Boolean);o.myCollections.innerHTML=t.slice(0,5).map(e=>`
                <div class="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer" onclick="showToolDetail(${e.id})">
                    <img src="${e.logo}" class="w-8 h-8 rounded">
                    <span class="text-sm text-slate-700 truncate flex-1">${e.name}</span>
                </div>
            `).join("")}}async function E(){if(!o.todayRecommendations||!a.tools.length)return;const t=[...a.tools].sort(()=>Math.random()-.5).slice(0,3);o.todayRecommendations.innerHTML=t.map(e=>`
        <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition" onclick="showToolDetail(${e.id})">
            <img src="${e.logo}" class="w-10 h-10 rounded-lg">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">${e.name}</p>
                <p class="text-xs text-slate-500 truncate">${e.desc.slice(0,30)}...</p>
            </div>
            <span class="text-xs text-amber-500">
                <i class="fa-solid fa-star"></i> ${e.rating}
            </span>
        </div>
    `).join("")}function T(){const t=localStorage.getItem("aiark_user");t&&(a.user=JSON.parse(t),a.isLoggedIn=!0,S())}function S(){a.isLoggedIn&&o.authSection&&(o.authSection.innerHTML=`
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-bold text-slate-800">Hi, ${a.user.userName||"用户"}</p>
                    <p class="text-[10px] text-green-600 font-medium">已登录</p>
                </div>
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-user text-sm"></i>
                </div>
            </div>
        `)}window.closeLoginModal=function(){o.loginModal.classList.add("hidden")};window.showToolDetail=function(t){const e=a.tools.find(i=>i.id===t);e&&window.open(e.url,"_blank")};window.resetAllFilters=function(){a.activeCategory="all",a.activeSubcategory=null,a.searchQuery="",a.filters.pricing=[],a.filters.chinese=!1,o.globalSearch.value="",o.mobileSearch.value="",document.querySelectorAll(".filter-pricing").forEach(t=>t.checked=!1),document.getElementById("filter-chinese").checked=!1,selectCategory("all")};function c(t,e="info"){const i=document.getElementById("toast-container");if(!i)return;const s={success:"bg-green-500",error:"bg-red-500",warning:"bg-amber-500",info:"bg-blue-500"},n=document.createElement("div");n.className=`${s[e]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`,n.innerHTML=`
        <i class="fa-solid ${e==="success"?"fa-check-circle":e==="error"?"fa-exclamation-circle":e==="warning"?"fa-exclamation-triangle":"fa-info-circle"}"></i>
        <span>${t}</span>
    `,i.appendChild(n),setTimeout(()=>{n.remove()},3e3)}window.showToast=c;
