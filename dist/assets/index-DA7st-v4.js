(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(n){if(n.ep)return;n.ep=!0;const l=s(n);fetch(n.href,l)}})();const a={tools:[],categories:[],filteredTools:[],displayedTools:[],currentPage:1,itemsPerPage:24,activeCategory:"all",activeSubcategory:null,searchQuery:"",sortBy:"popular",filters:{pricing:[],chinese:!1},compareList:[],favorites:JSON.parse(localStorage.getItem("aiark_favorites")||"[]"),viewMode:"grid",isLoggedIn:!1,user:null},o={};document.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 AI方舟 初始化中..."),x(),await b(),$(),v(),h(),m(),L(),k(),B(),console.log("✅ AI方舟 初始化完成")});function x(){o.toolsGrid=document.getElementById("tools-grid"),o.categoryNav=document.getElementById("category-nav"),o.mobileCategories=document.getElementById("mobile-categories"),o.globalSearch=document.getElementById("global-search"),o.mobileSearch=document.getElementById("mobile-search"),o.pageTitle=document.getElementById("page-title"),o.totalCountBadge=document.getElementById("total-count-badge"),o.sortSelect=document.getElementById("sort-select"),o.activeFilters=document.getElementById("active-filters"),o.noResults=document.getElementById("no-results"),o.loadingState=document.getElementById("loading-state"),o.loadMoreBtn=document.getElementById("load-more-btn"),o.compareBtn=document.getElementById("compare-btn"),o.compareCount=document.getElementById("compare-count"),o.compareDrawer=document.getElementById("compare-drawer"),o.compareItems=document.getElementById("compare-items"),o.compareModal=document.getElementById("compare-modal"),o.compareTable=document.getElementById("compare-table"),o.loginModal=document.getElementById("login-modal"),o.loginBtn=document.getElementById("login-btn"),o.authSection=document.getElementById("auth-section"),o.favoritesBtn=document.getElementById("favorites-btn"),o.todayRecommendations=document.getElementById("today-recommendations"),o.myCollections=document.getElementById("my-collections")}async function b(){try{o.loadingState.classList.remove("hidden");const e=await(await fetch("/toolsData.json")).json();a.categories=e.categories||[],a.tools=e.tools||[],a.filteredTools=[...a.tools],o.totalCountBadge&&(o.totalCountBadge.textContent=a.tools.length),C(),console.log(`📊 加载了 ${a.tools.length} 个工具，${a.categories.length} 个分类`)}catch(t){console.error("❌ 数据加载失败:",t),u("数据加载失败，请刷新页面重试","error")}finally{o.loadingState.classList.add("hidden")}}function v(){if(!a.categories.length)return;const t=a.categories.map(s=>`
        <div class="category-group" data-category="${s.id}">
            <button class="category-item w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition mb-1" onclick="selectCategory('${s.id}')">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3" style="background-color: ${s.color}">
                    <i class="fa-solid ${s.icon} text-sm"></i>
                </div>
                <span class="flex-1 text-left">${s.name}</span>
                <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">${a.tools.filter(i=>i.category===s.id).length}</span>
            </button>
            ${s.subcategories?`
                <div class="subcategory-list pl-12 space-y-1" id="subcat-${s.id}">
                    ${s.subcategories.map(i=>`
                        <button class="subcategory-item block w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" onclick="selectSubcategory('${s.id}', '${i}')">
                            ${i}
                        </button>
                    `).join("")}
                </div>
            `:""}
        </div>
    `).join("");o.categoryNav&&(o.categoryNav.innerHTML=t);const e=a.categories.map(s=>`
        <button class="category-btn-mobile whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2" 
                onclick="selectCategory('${s.id}')"
                data-id="${s.id}"
                style="border-color: ${s.color}20; color: ${s.color}">
            <i class="fa-solid ${s.icon}"></i>
            ${s.name}
        </button>
    `).join("");o.mobileCategories&&(o.mobileCategories.innerHTML=e)}window.selectCategory=function(t){a.activeCategory=t,a.activeSubcategory=null,a.currentPage=1,document.querySelectorAll(".category-item").forEach(i=>{var n;i.classList.remove("active"),((n=i.closest(".category-group"))==null?void 0:n.dataset.category)===t&&i.classList.add("active")});const e=a.categories.find(i=>i.id===t);o.pageTitle&&e&&(o.pageTitle.textContent=e.name),document.querySelectorAll(".subcategory-list").forEach(i=>{i.classList.remove("expanded")});const s=document.getElementById(`subcat-${t}`);s&&s.classList.add("expanded"),d()};window.selectSubcategory=function(t,e){a.activeCategory=t,a.activeSubcategory=e,a.currentPage=1,o.pageTitle&&(o.pageTitle.textContent=e),d(),event.stopPropagation()};function h(){document.querySelectorAll(".filter-pricing").forEach(e=>{e.addEventListener("change",()=>{const s=Array.from(document.querySelectorAll(".filter-pricing:checked")).map(i=>i.value);a.filters.pricing=s,a.currentPage=1,d()})});const t=document.getElementById("filter-chinese");t&&t.addEventListener("change",()=>{a.filters.chinese=t.checked,a.currentPage=1,d()}),o.sortSelect&&o.sortSelect.addEventListener("change",()=>{a.sortBy=o.sortSelect.value,d()})}function d(){let t=[...a.tools];if(a.activeCategory!=="all"&&(t=t.filter(e=>e.category===a.activeCategory),a.activeSubcategory&&(t=t.filter(e=>e.subcategory===a.activeSubcategory))),a.searchQuery){const e=a.searchQuery.toLowerCase();t=t.filter(s=>s.name.toLowerCase().includes(e)||s.desc.toLowerCase().includes(e)||s.tags.some(i=>i.toLowerCase().includes(e)))}switch(a.filters.pricing.length>0&&(t=t.filter(e=>{const s=e.pricing_type||(e.pricing.includes("免费")?"free":"paid");return a.filters.pricing.includes(s)})),a.filters.chinese&&(t=t.filter(e=>e.chinese_support)),a.sortBy){case"popular":t.sort((e,s)=>(s.popularity_score||0)-(e.popularity_score||0));break;case"newest":t.sort((e,s)=>s.id-e.id);break;case"rating":t.sort((e,s)=>(s.rating||0)-(e.rating||0));break;case"name":t.sort((e,s)=>e.name.localeCompare(s.name,"zh"));break}a.filteredTools=t,a.currentPage=1,y(),m()}function y(){if(!o.activeFilters)return;const t=[];if(a.activeCategory!=="all"){const e=a.categories.find(s=>s.id===a.activeCategory);t.push({text:(e==null?void 0:e.name)||a.activeCategory,onRemove:()=>selectCategory("all")})}if(a.searchQuery&&t.push({text:`搜索: ${a.searchQuery}`,onRemove:()=>{a.searchQuery="",o.globalSearch.value="",o.mobileSearch.value="",d()}}),t.length===0){o.activeFilters.classList.add("hidden");return}o.activeFilters.innerHTML=t.map(e=>`
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
            ${e.text}
            <button onclick="(${e.onRemove})()" class="ml-2 text-blue-400 hover:text-blue-600">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join(""),o.activeFilters.classList.remove("hidden")}function m(){if(!o.toolsGrid)return;const t=0,e=a.currentPage*a.itemsPerPage,s=a.filteredTools.slice(t,e);if(s.length===0){o.toolsGrid.innerHTML="",o.noResults.classList.remove("hidden"),o.loadMoreBtn.classList.add("hidden");return}o.noResults.classList.add("hidden");const i=s.map(n=>w(n)).join("");o.toolsGrid.innerHTML=i,a.filteredTools.length>e?o.loadMoreBtn.classList.remove("hidden"):o.loadMoreBtn.classList.add("hidden")}function w(t){var n,l;const e=a.categories.find(c=>c.id===t.category),s=a.favorites.includes(t.id),i=a.compareList.includes(t.id);return`
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
                <button onclick="toggleFavorite(${t.id}, event)" class="text-slate-300 hover:text-red-500 transition ${s?"text-red-500":""}">
                    <i class="${s?"fa-solid":"fa-regular"} fa-heart"></i>
                </button>
            </div>
            
            <!-- Description -->
            <p class="text-slate-500 text-sm line-clamp-2 mb-4">${t.desc}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
                ${t.tags.slice(0,3).map(c=>`
                    <span class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">${c}</span>
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
                    <span class="px-2 py-0.5 rounded text-xs ${(n=t.pricing)!=null&&n.includes("免费")?"bg-green-100 text-green-600":(l=t.pricing)!=null&&l.includes("开源")?"bg-purple-100 text-purple-600":"bg-amber-100 text-amber-600"}">
                        ${t.pricing||"未知"}
                    </span>
                </div>
                
                <div class="flex items-center gap-2">
                    <!-- Compare Checkbox -->
                    <label class="flex items-center cursor-pointer" onclick="event.stopPropagation()">
                        <input type="checkbox" class="compare-checkbox hidden" ${i?"checked":""} onchange="toggleCompare(${t.id})" data-tool-id="${t.id}">
                        <div class="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center transition hover:border-blue-400">
                            <svg class="w-3 h-3 text-white hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <span class="ml-1.5 text-xs text-slate-500">对比</span>
                    </label>
                    
                    <button onclick="window.open('${t.url}', '_blank'); event.stopPropagation();" class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                        访问
                    </button>
                </div>
            </div>
        </div>
    `}function $(){o.globalSearch&&(o.globalSearch.addEventListener("input",f(e=>{a.searchQuery=e.target.value,a.currentPage=1,d()},300)),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="k"&&(e.preventDefault(),o.globalSearch.focus())})),o.mobileSearch&&o.mobileSearch.addEventListener("input",f(e=>{a.searchQuery=e.target.value,a.currentPage=1,d()},300)),o.loadMoreBtn&&o.loadMoreBtn.addEventListener("click",()=>{a.currentPage++,m()}),o.loginBtn&&o.loginBtn.addEventListener("click",()=>{o.loginModal.classList.remove("hidden")});const t=document.getElementById("all-categories-btn");t&&t.addEventListener("click",()=>{selectCategory("all")})}function f(t,e){let s;return function(...n){const l=()=>{clearTimeout(s),t(...n)};clearTimeout(s),s=setTimeout(l,e)}}function L(){g()}window.toggleCompare=function(t){const e=a.compareList.indexOf(t);if(e>-1)a.compareList.splice(e,1);else{if(a.compareList.length>=4){u("最多只能对比4个工具","warning");return}a.compareList.push(t)}g(),m()};function g(){const t=a.compareList.length;if(o.compareCount&&(o.compareCount.textContent=t,o.compareCount.classList.toggle("hidden",t===0)),t>0){o.compareDrawer.classList.remove("translate-y-full");const e=a.compareList.map(s=>a.tools.find(i=>i.id===s)).filter(Boolean);o.compareItems.innerHTML=e.map(s=>`
            <div class="flex-shrink-0 w-32 bg-slate-50 rounded-lg p-2 relative">
                <button onclick="toggleCompare(${s.id})" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${s.logo}" class="w-8 h-8 rounded mx-auto mb-1">
                <p class="text-xs text-center truncate">${s.name}</p>
            </div>
        `).join(""),document.getElementById("compare-drawer-count").textContent=t}else o.compareDrawer.classList.add("translate-y-full")}window.clearCompare=function(){a.compareList=[],g(),m()};window.toggleCompareDrawer=function(){o.compareDrawer.classList.toggle("translate-y-full")};window.startCompare=function(){if(a.compareList.length<2){u("请至少选择2个工具进行对比","warning");return}const t=a.compareList.map(s=>a.tools.find(i=>i.id===s)).filter(Boolean),e=[{label:"工具名称",key:"name"},{label:"分类",key:"category",render:s=>{var i;return((i=a.categories.find(n=>n.id===s))==null?void 0:i.name)||s}},{label:"评分",key:"rating"},{label:"访问量",key:"visits"},{label:"价格",key:"pricing"},{label:"中文支持",key:"chinese_support",render:s=>s?"✅":"❌"},{label:"描述",key:"desc"}];o.compareTable.innerHTML=`
        <table class="w-full">
            <thead>
                <tr class="border-b border-slate-200">
                    <th class="text-left py-3 px-4 font-semibold text-slate-700">对比项</th>
                    ${t.map(s=>`
                        <th class="text-center py-3 px-4">
                            <div class="flex flex-col items-center">
                                <img src="${s.logo}" class="w-10 h-10 rounded-lg mb-2">
                                <span class="font-semibold text-slate-900">${s.name}</span>
                            </div>
                        </th>
                    `).join("")}
                </tr>
            </thead>
            <tbody>
                ${e.map(s=>`
                    <tr class="border-b border-slate-100">
                        <td class="py-3 px-4 font-medium text-slate-600">${s.label}</td>
                        ${t.map(i=>`
                            <td class="py-3 px-4 text-center text-slate-700">
                                ${s.render?s.render(i[s.key]):i[s.key]||"-"}
                            </td>
                        `).join("")}
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,o.compareModal.classList.remove("hidden")};window.closeCompareModal=function(){o.compareModal.classList.add("hidden")};function k(){p()}window.toggleFavorite=function(t,e){e&&e.stopPropagation();const s=a.favorites.indexOf(t);s>-1?(a.favorites.splice(s,1),u("已取消收藏","info")):(a.favorites.push(t),u("已添加到收藏","success")),localStorage.setItem("aiark_favorites",JSON.stringify(a.favorites)),p(),m()};function p(){if(o.favoritesBtn){const t=a.favorites.length;o.favoritesBtn.innerHTML=`
            <i class="${t>0?"fa-solid text-red-500":"fa-regular"} fa-heart mr-2"></i>
            收藏${t>0?` (${t})`:""}
        `}if(o.myCollections)if(a.favorites.length===0)o.myCollections.innerHTML=`
                <div class="text-center py-4 text-slate-400 text-sm">
                    <i class="fa-regular fa-folder-open text-3xl mb-2"></i>
                    <p>暂无收藏工具</p>
                </div>
            `;else{const t=a.favorites.map(e=>a.tools.find(s=>s.id===e)).filter(Boolean);o.myCollections.innerHTML=t.slice(0,5).map(e=>`
                <div class="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer" onclick="showToolDetail(${e.id})">
                    <img src="${e.logo}" class="w-8 h-8 rounded">
                    <span class="text-sm text-slate-700 truncate flex-1">${e.name}</span>
                </div>
            `).join("")}}function C(){if(!o.todayRecommendations||!a.tools.length)return;const t=[...a.tools].sort(()=>Math.random()-.5).slice(0,3);o.todayRecommendations.innerHTML=t.map(e=>`
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
    `).join("")}function B(){const t=localStorage.getItem("aiark_user");t&&(a.user=JSON.parse(t),a.isLoggedIn=!0,T())}function T(){a.isLoggedIn&&o.authSection&&(o.authSection.innerHTML=`
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-bold text-slate-800">Hi, ${a.user.userName||"用户"}</p>
                    <p class="text-[10px] text-green-600 font-medium">已登录</p>
                </div>
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-user text-sm"></i>
                </div>
            </div>
        `)}window.closeLoginModal=function(){o.loginModal.classList.add("hidden")};window.showToolDetail=function(t){const e=a.tools.find(s=>s.id===t);e&&window.open(e.url,"_blank")};window.resetAllFilters=function(){a.activeCategory="all",a.activeSubcategory=null,a.searchQuery="",a.filters.pricing=[],a.filters.chinese=!1,o.globalSearch.value="",o.mobileSearch.value="",document.querySelectorAll(".filter-pricing").forEach(t=>t.checked=!1),document.getElementById("filter-chinese").checked=!1,selectCategory("all")};function u(t,e="info"){const s=document.getElementById("toast-container");if(!s)return;const i={success:"bg-green-500",error:"bg-red-500",warning:"bg-amber-500",info:"bg-blue-500"},n=document.createElement("div");n.className=`${i[e]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`,n.innerHTML=`
        <i class="fa-solid ${e==="success"?"fa-check-circle":e==="error"?"fa-exclamation-circle":e==="warning"?"fa-exclamation-triangle":"fa-info-circle"}"></i>
        <span>${t}</span>
    `,s.appendChild(n),setTimeout(()=>{n.remove()},3e3)}window.showToolDetail=function(t){var l,c;const e=a.tools.find(r=>r.id===t);if(!e)return;const s=a.categories.find(r=>r.id===e.category),i=a.favorites.includes(t),n=document.createElement("div");n.id="tool-detail-modal",n.className="fixed inset-0 z-[100] overflow-y-auto",n.innerHTML=`
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="closeToolDetail()"></div>
        <div class="fixed inset-4 md:inset-10 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-4xl mx-auto">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-100">
                <div class="flex items-center gap-4">
                    <img src="${e.logo}" alt="${e.name}" class="w-16 h-16 rounded-xl object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=random&color=fff&size=128'">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">${e.name}</h2>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-sm px-3 py-1 rounded-full" style="background-color: ${(s==null?void 0:s.color)||"#3b82f6"}20; color: ${(s==null?void 0:s.color)||"#3b82f6"}">
                                ${(s==null?void 0:s.name)||e.category}
                            </span>
                            ${e.chinese_support?'<span class="text-sm text-red-500">🇨🇳 中文支持</span>':""}
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="toggleFavorite(${e.id})" class="p-2 rounded-lg ${i?"bg-red-50 text-red-500":"bg-slate-100 text-slate-400"} hover:bg-red-50 hover:text-red-500 transition">
                        <i class="${i?"fa-solid":"fa-regular"} fa-heart text-xl"></i>
                    </button>
                    <button onclick="closeToolDetail()" class="p-2 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-auto p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left Column - Main Info -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Description -->
                        <div class="bg-slate-50 rounded-xl p-6">
                            <h3 class="font-semibold text-slate-900 mb-3">工具介绍</h3>
                            <p class="text-slate-600 leading-relaxed">${e.desc}</p>
                        </div>
                        
                        <!-- Features -->
                        <div>
                            <h3 class="font-semibold text-slate-900 mb-3">核心功能</h3>
                            <div class="flex flex-wrap gap-2">
                                ${(e.features||[]).map(r=>`<span class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm">${r}</span>`).join("")}
                            </div>
                        </div>
                        
                        <!-- Use Cases -->
                        <div>
                            <h3 class="font-semibold text-slate-900 mb-3">适用场景</h3>
                            <div class="flex flex-wrap gap-2">
                                ${(e.use_cases||[]).map(r=>`<span class="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm">${r}</span>`).join("")}
                            </div>
                        </div>
                        
                        <!-- Tags -->
                        <div>
                            <h3 class="font-semibold text-slate-900 mb-3">标签</h3>
                            <div class="flex flex-wrap gap-2">
                                ${(e.tags||[]).map(r=>`<span class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm">${r}</span>`).join("")}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column - Stats & Actions -->
                    <div class="space-y-6">
                        <!-- Stats Card -->
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                            <h3 class="font-semibold text-slate-900 mb-4">数据统计</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-600">评分</span>
                                    <span class="flex items-center gap-1 text-amber-500 font-semibold">
                                        <i class="fa-solid fa-star"></i>
                                        ${e.rating||"-"}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-600">访问量</span>
                                    <span class="font-semibold text-slate-900">${e.visits||"-"}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-600">价格</span>
                                    <span class="px-2 py-1 rounded text-sm ${(l=e.pricing)!=null&&l.includes("免费")?"bg-green-100 text-green-600":(c=e.pricing)!=null&&c.includes("开源")?"bg-purple-100 text-purple-600":"bg-amber-100 text-amber-600"}">
                                        ${e.pricing||"未知"}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-600">更新日期</span>
                                    <span class="text-slate-900">${e.last_updated||"-"}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Actions -->
                        <div class="space-y-3">
                            <a href="${e.url}" target="_blank" class="block w-full py-3 bg-blue-500 text-white rounded-xl font-semibold text-center hover:bg-blue-600 transition">
                                <i class="fa-solid fa-external-link-alt mr-2"></i>
                                访问官网
                            </a>
                            <button onclick="toggleCompare(${e.id})" class="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition">
                                <i class="fa-solid fa-scale-balanced mr-2"></i>
                                加入对比
                            </button>
                            <button onclick="shareTool(${e.id})" class="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition">
                                <i class="fa-solid fa-share-nodes mr-2"></i>
                                分享工具
                            </button>
                        </div>
                        
                        <!-- Similar Tools -->
                        <div>
                            <h3 class="font-semibold text-slate-900 mb-3">相似工具</h3>
                            <div class="space-y-2" id="similar-tools">
                                ${E(e).map(r=>`
                                    <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition" onclick="showToolDetail(${r.id})">
                                        <img src="${r.logo}" class="w-10 h-10 rounded-lg object-cover">
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium text-slate-900 truncate">${r.name}</p>
                                            <p class="text-xs text-slate-500 truncate">${r.desc.slice(0,30)}...</p>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.appendChild(n),document.body.style.overflow="hidden"};window.closeToolDetail=function(){const t=document.getElementById("tool-detail-modal");t&&(t.remove(),document.body.style.overflow="")};function E(t){return a.tools.filter(e=>e.id!==t.id&&e.category===t.category).slice(0,3)}window.shareTool=function(t){const e=a.tools.find(i=>i.id===t);if(!e)return;const s=`推荐一个AI工具：${e.name} - ${e.desc.slice(0,50)}...`;navigator.share?navigator.share({title:e.name,text:s,url:e.url}):(navigator.clipboard.writeText(`${s} ${e.url}`),u("链接已复制到剪贴板","success"))};window.showToast=u;
