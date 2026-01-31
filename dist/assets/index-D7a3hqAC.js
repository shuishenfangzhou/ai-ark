(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const o={tools:[],categories:[],filteredTools:[],displayedTools:[],currentPage:1,itemsPerPage:24,activeCategory:"all",activeSubcategory:null,searchQuery:"",sortBy:"popular",filters:{pricing:[],chinese:!1},compareList:[],favorites:JSON.parse(localStorage.getItem("aiark_favorites")||"[]"),viewMode:"grid",isLoggedIn:!1,user:null},s={};document.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 AI方舟 初始化中..."),p(),await b(),w(),h(),x(),u(),L(),$(),B(),console.log("✅ AI方舟 初始化完成")});function p(){s.toolsGrid=document.getElementById("tools-grid"),s.categoryNav=document.getElementById("category-nav"),s.mobileCategories=document.getElementById("mobile-categories"),s.globalSearch=document.getElementById("global-search"),s.mobileSearch=document.getElementById("mobile-search"),s.pageTitle=document.getElementById("page-title"),s.totalCountBadge=document.getElementById("total-count-badge"),s.sortSelect=document.getElementById("sort-select"),s.activeFilters=document.getElementById("active-filters"),s.noResults=document.getElementById("no-results"),s.loadingState=document.getElementById("loading-state"),s.loadMoreBtn=document.getElementById("load-more-btn"),s.compareBtn=document.getElementById("compare-btn"),s.compareCount=document.getElementById("compare-count"),s.compareDrawer=document.getElementById("compare-drawer"),s.compareItems=document.getElementById("compare-items"),s.compareModal=document.getElementById("compare-modal"),s.compareTable=document.getElementById("compare-table"),s.loginModal=document.getElementById("login-modal"),s.loginBtn=document.getElementById("login-btn"),s.authSection=document.getElementById("auth-section"),s.favoritesBtn=document.getElementById("favorites-btn"),s.todayRecommendations=document.getElementById("today-recommendations"),s.myCollections=document.getElementById("my-collections")}async function b(){try{s.loadingState.classList.remove("hidden");const e=await(await fetch("/toolsData.json")).json();o.categories=e.categories||[],o.tools=e.tools||[],o.filteredTools=[...o.tools],s.totalCountBadge&&(s.totalCountBadge.textContent=o.tools.length),C(),console.log(`📊 加载了 ${o.tools.length} 个工具，${o.categories.length} 个分类`)}catch(t){console.error("❌ 数据加载失败:",t),d("数据加载失败，请刷新页面重试","error")}finally{s.loadingState.classList.add("hidden")}}function h(){if(!o.categories.length)return;const t=o.categories.map(a=>`
        <div class="category-group" data-category="${a.id}">
            <button class="category-item w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition mb-1" onclick="selectCategory('${a.id}')">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3" style="background-color: ${a.color}">
                    <i class="fa-solid ${a.icon} text-sm"></i>
                </div>
                <span class="flex-1 text-left">${a.name}</span>
                <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">${o.tools.filter(n=>n.category===a.id).length}</span>
            </button>
            ${a.subcategories?`
                <div class="subcategory-list pl-12 space-y-1" id="subcat-${a.id}">
                    ${a.subcategories.map(n=>`
                        <button class="subcategory-item block w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" onclick="selectSubcategory('${a.id}', '${n}')">
                            ${n}
                        </button>
                    `).join("")}
                </div>
            `:""}
        </div>
    `).join("");s.categoryNav&&(s.categoryNav.innerHTML=t);const e=o.categories.map(a=>`
        <button class="category-btn-mobile whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2" 
                onclick="selectCategory('${a.id}')"
                data-id="${a.id}"
                style="border-color: ${a.color}20; color: ${a.color}">
            <i class="fa-solid ${a.icon}"></i>
            ${a.name}
        </button>
    `).join("");s.mobileCategories&&(s.mobileCategories.innerHTML=e)}window.selectCategory=function(t){o.activeCategory=t,o.activeSubcategory=null,o.currentPage=1,document.querySelectorAll(".category-item").forEach(n=>{var i;n.classList.remove("active"),((i=n.closest(".category-group"))==null?void 0:i.dataset.category)===t&&n.classList.add("active")});const e=o.categories.find(n=>n.id===t);s.pageTitle&&e&&(s.pageTitle.textContent=e.name),document.querySelectorAll(".subcategory-list").forEach(n=>{n.classList.remove("expanded")});const a=document.getElementById(`subcat-${t}`);a&&a.classList.add("expanded"),l()};window.selectSubcategory=function(t,e){o.activeCategory=t,o.activeSubcategory=e,o.currentPage=1,s.pageTitle&&(s.pageTitle.textContent=e),l(),event.stopPropagation()};function x(){document.querySelectorAll(".filter-pricing").forEach(e=>{e.addEventListener("change",()=>{const a=Array.from(document.querySelectorAll(".filter-pricing:checked")).map(n=>n.value);o.filters.pricing=a,o.currentPage=1,l()})});const t=document.getElementById("filter-chinese");t&&t.addEventListener("change",()=>{o.filters.chinese=t.checked,o.currentPage=1,l()}),s.sortSelect&&s.sortSelect.addEventListener("change",()=>{o.sortBy=s.sortSelect.value,l()})}function l(){let t=[...o.tools];if(o.activeCategory!=="all"&&(t=t.filter(e=>e.category===o.activeCategory),o.activeSubcategory&&(t=t.filter(e=>e.subcategory===o.activeSubcategory))),o.searchQuery){const e=o.searchQuery.toLowerCase();t=t.filter(a=>a.name.toLowerCase().includes(e)||a.desc.toLowerCase().includes(e)||a.tags.some(n=>n.toLowerCase().includes(e)))}switch(o.filters.pricing.length>0&&(t=t.filter(e=>{const a=e.pricing_type||(e.pricing.includes("免费")?"free":"paid");return o.filters.pricing.includes(a)})),o.filters.chinese&&(t=t.filter(e=>e.chinese_support)),o.sortBy){case"popular":t.sort((e,a)=>(a.popularity_score||0)-(e.popularity_score||0));break;case"newest":t.sort((e,a)=>a.id-e.id);break;case"rating":t.sort((e,a)=>(a.rating||0)-(e.rating||0));break;case"name":t.sort((e,a)=>e.name.localeCompare(a.name,"zh"));break}o.filteredTools=t,o.currentPage=1,y(),u()}function y(){if(!s.activeFilters)return;const t=[];if(o.activeCategory!=="all"){const e=o.categories.find(a=>a.id===o.activeCategory);t.push({text:(e==null?void 0:e.name)||o.activeCategory,onRemove:()=>selectCategory("all")})}if(o.searchQuery&&t.push({text:`搜索: ${o.searchQuery}`,onRemove:()=>{o.searchQuery="",s.globalSearch.value="",s.mobileSearch.value="",l()}}),t.length===0){s.activeFilters.classList.add("hidden");return}s.activeFilters.innerHTML=t.map(e=>`
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
            ${e.text}
            <button onclick="(${e.onRemove})()" class="ml-2 text-blue-400 hover:text-blue-600">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join(""),s.activeFilters.classList.remove("hidden")}function u(){if(!s.toolsGrid)return;const t=0,e=o.currentPage*o.itemsPerPage,a=o.filteredTools.slice(t,e);if(a.length===0){s.toolsGrid.innerHTML="",s.noResults.classList.remove("hidden"),s.loadMoreBtn.classList.add("hidden");return}s.noResults.classList.add("hidden");const n=a.map(i=>v(i)).join("");s.toolsGrid.innerHTML=n,o.filteredTools.length>e?s.loadMoreBtn.classList.remove("hidden"):s.loadMoreBtn.classList.add("hidden")}function v(t){var i,r;const e=o.categories.find(c=>c.id===t.category),a=o.favorites.includes(t.id),n=o.compareList.includes(t.id);return`
        <div class="tool-card bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl cursor-pointer group animate-fade-in" data-tool-id="${t.id}">
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
                <button onclick="toggleFavorite(${t.id}, event)" class="text-slate-300 hover:text-red-500 transition ${a?"text-red-500":""}">
                    <i class="${a?"fa-solid":"fa-regular"} fa-heart"></i>
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
                    <span class="px-2 py-0.5 rounded text-xs ${(i=t.pricing)!=null&&i.includes("免费")?"bg-green-100 text-green-600":(r=t.pricing)!=null&&r.includes("开源")?"bg-purple-100 text-purple-600":"bg-amber-100 text-amber-600"}">
                        ${t.pricing||"未知"}
                    </span>
                </div>
                
                <div class="flex items-center gap-2">
                    <!-- Compare Checkbox -->
                    <label class="flex items-center cursor-pointer" onclick="event.stopPropagation()">
                        <input type="checkbox" class="compare-checkbox hidden" ${n?"checked":""} onchange="toggleCompare(${t.id})" data-tool-id="${t.id}">
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
    `}function w(){s.globalSearch&&(s.globalSearch.addEventListener("input",g(e=>{o.searchQuery=e.target.value,o.currentPage=1,l()},300)),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="k"&&(e.preventDefault(),s.globalSearch.focus())})),s.mobileSearch&&s.mobileSearch.addEventListener("input",g(e=>{o.searchQuery=e.target.value,o.currentPage=1,l()},300)),s.loadMoreBtn&&s.loadMoreBtn.addEventListener("click",()=>{o.currentPage++,u()}),s.loginBtn&&s.loginBtn.addEventListener("click",()=>{s.loginModal.classList.remove("hidden")});const t=document.getElementById("all-categories-btn");t&&t.addEventListener("click",()=>{selectCategory("all")})}function g(t,e){let a;return function(...i){const r=()=>{clearTimeout(a),t(...i)};clearTimeout(a),a=setTimeout(r,e)}}function L(){m()}window.toggleCompare=function(t){const e=o.compareList.indexOf(t);if(e>-1)o.compareList.splice(e,1);else{if(o.compareList.length>=4){d("最多只能对比4个工具","warning");return}o.compareList.push(t)}m(),u()};function m(){const t=o.compareList.length;if(s.compareCount&&(s.compareCount.textContent=t,s.compareCount.classList.toggle("hidden",t===0)),t>0){s.compareDrawer.classList.remove("translate-y-full");const e=o.compareList.map(a=>o.tools.find(n=>n.id===a)).filter(Boolean);s.compareItems.innerHTML=e.map(a=>`
            <div class="flex-shrink-0 w-32 bg-slate-50 rounded-lg p-2 relative">
                <button onclick="toggleCompare(${a.id})" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${a.logo}" class="w-8 h-8 rounded mx-auto mb-1">
                <p class="text-xs text-center truncate">${a.name}</p>
            </div>
        `).join(""),document.getElementById("compare-drawer-count").textContent=t}else s.compareDrawer.classList.add("translate-y-full")}window.clearCompare=function(){o.compareList=[],m(),u()};window.toggleCompareDrawer=function(){s.compareDrawer.classList.toggle("translate-y-full")};window.startCompare=function(){if(o.compareList.length<2){d("请至少选择2个工具进行对比","warning");return}const t=o.compareList.map(a=>o.tools.find(n=>n.id===a)).filter(Boolean),e=[{label:"工具名称",key:"name"},{label:"分类",key:"category",render:a=>{var n;return((n=o.categories.find(i=>i.id===a))==null?void 0:n.name)||a}},{label:"评分",key:"rating"},{label:"访问量",key:"visits"},{label:"价格",key:"pricing"},{label:"中文支持",key:"chinese_support",render:a=>a?"✅":"❌"},{label:"描述",key:"desc"}];s.compareTable.innerHTML=`
        <table class="w-full">
            <thead>
                <tr class="border-b border-slate-200">
                    <th class="text-left py-3 px-4 font-semibold text-slate-700">对比项</th>
                    ${t.map(a=>`
                        <th class="text-center py-3 px-4">
                            <div class="flex flex-col items-center">
                                <img src="${a.logo}" class="w-10 h-10 rounded-lg mb-2">
                                <span class="font-semibold text-slate-900">${a.name}</span>
                            </div>
                        </th>
                    `).join("")}
                </tr>
            </thead>
            <tbody>
                ${e.map(a=>`
                    <tr class="border-b border-slate-100">
                        <td class="py-3 px-4 font-medium text-slate-600">${a.label}</td>
                        ${t.map(n=>`
                            <td class="py-3 px-4 text-center text-slate-700">
                                ${a.render?a.render(n[a.key]):n[a.key]||"-"}
                            </td>
                        `).join("")}
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,s.compareModal.classList.remove("hidden")};window.closeCompareModal=function(){s.compareModal.classList.add("hidden")};function $(){f()}window.toggleFavorite=function(t,e){e&&e.stopPropagation();const a=o.favorites.indexOf(t);a>-1?(o.favorites.splice(a,1),d("已取消收藏","info")):(o.favorites.push(t),d("已添加到收藏","success")),localStorage.setItem("aiark_favorites",JSON.stringify(o.favorites)),f(),u()};function f(){if(s.favoritesBtn){const t=o.favorites.length;s.favoritesBtn.innerHTML=`
            <i class="${t>0?"fa-solid text-red-500":"fa-regular"} fa-heart mr-2"></i>
            收藏${t>0?` (${t})`:""}
        `}if(s.myCollections)if(o.favorites.length===0)s.myCollections.innerHTML=`
                <div class="text-center py-4 text-slate-400 text-sm">
                    <i class="fa-regular fa-folder-open text-3xl mb-2"></i>
                    <p>暂无收藏工具</p>
                </div>
            `;else{const t=o.favorites.map(e=>o.tools.find(a=>a.id===e)).filter(Boolean);s.myCollections.innerHTML=t.slice(0,5).map(e=>`
                <div class="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer" onclick="showToolDetail(${e.id})">
                    <img src="${e.logo}" class="w-8 h-8 rounded">
                    <span class="text-sm text-slate-700 truncate flex-1">${e.name}</span>
                </div>
            `).join("")}}function C(){if(!s.todayRecommendations||!o.tools.length)return;const t=[...o.tools].sort(()=>Math.random()-.5).slice(0,3);s.todayRecommendations.innerHTML=t.map(e=>`
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
    `).join("")}function B(){const t=localStorage.getItem("aiark_user");t&&(o.user=JSON.parse(t),o.isLoggedIn=!0,k())}function k(){o.isLoggedIn&&s.authSection&&(s.authSection.innerHTML=`
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-bold text-slate-800">Hi, ${o.user.userName||"用户"}</p>
                    <p class="text-[10px] text-green-600 font-medium">已登录</p>
                </div>
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-user text-sm"></i>
                </div>
            </div>
        `)}window.closeLoginModal=function(){s.loginModal.classList.add("hidden")};window.showToolDetail=function(t){const e=o.tools.find(a=>a.id===t);e&&window.open(e.url,"_blank")};window.resetAllFilters=function(){o.activeCategory="all",o.activeSubcategory=null,o.searchQuery="",o.filters.pricing=[],o.filters.chinese=!1,s.globalSearch.value="",s.mobileSearch.value="",document.querySelectorAll(".filter-pricing").forEach(t=>t.checked=!1),document.getElementById("filter-chinese").checked=!1,selectCategory("all")};function d(t,e="info"){const a=document.getElementById("toast-container");if(!a)return;const n={success:"bg-green-500",error:"bg-red-500",warning:"bg-amber-500",info:"bg-blue-500"},i=document.createElement("div");i.className=`${n[e]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`,i.innerHTML=`
        <i class="fa-solid ${e==="success"?"fa-check-circle":e==="error"?"fa-exclamation-circle":e==="warning"?"fa-exclamation-triangle":"fa-info-circle"}"></i>
        <span>${t}</span>
    `,a.appendChild(i),setTimeout(()=>{i.remove()},3e3)}window.showToast=d;
