(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const p of r.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const i={tools:[],categories:[],filteredTools:[],displayedTools:[],currentPage:1,itemsPerPage:24,activeCategory:"all",activeSubcategory:null,searchQuery:"",sortBy:"popular",filters:{pricing:[],chinese:!1},compareList:[],favorites:JSON.parse(localStorage.getItem("aiark_favorites")||"[]"),viewMode:"grid",isLoggedIn:!1,user:null},f=[{id:"chat",name:"AI 对话",icon:"fa-comments",color:"#3b82f6"},{id:"writing",name:"AI 写作",icon:"fa-pen-nib",color:"#f59e0b"},{id:"image",name:"AI 绘画",icon:"fa-image",color:"#ec4899"},{id:"video",name:"AI 视频",icon:"fa-video",color:"#8b5cf6"},{id:"office",name:"AI 办公",icon:"fa-briefcase",color:"#10b981"},{id:"dev",name:"AI 编程",icon:"fa-code",color:"#6366f1"},{id:"search",name:"AI 搜索",icon:"fa-search",color:"#14b8a6"},{id:"audio",name:"AI 音频",icon:"fa-music",color:"#06b6d4"},{id:"agent",name:"AI 智能体",icon:"fa-robot",color:"#f97316"},{id:"learn",name:"AI 学习",icon:"fa-graduation-cap",color:"#f43f5e"}],h=[{id:1,name:"豆包",category:"chat",tags:["字节跳动","免费","智能助手"],desc:"智能对话助手，办公创作全能！字节跳动出品的AI对话助手，语音交互体验自然，提供多种个性化智能体。",rating:4.8,visits:"45M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/08/doubao-icon.png",url:"https://www.doubao.com",pricing:"免费",chinese_support:!0,popularity_score:98},{id:2,name:"即梦AI",category:"video",tags:["视频生成","图片生成","数字人"],desc:"一站式AI视频、图片、数字人创作工具。剪映团队推出的AI内容创作平台。",rating:4.7,visits:"12M+",logo:"https://ai-bot.cn/wp-content/uploads/2024/05/jimeng-ai-icon.png",url:"https://jimeng.jianying.com",pricing:"免费/付费",chinese_support:!0,popularity_score:95},{id:3,name:"TRAE编程",category:"dev",tags:["IDE","编程助手","字节跳动"],desc:"AI编程IDE，Vibe Coding 必备！字节跳动推出的新一代AI编程工具。",rating:4.9,visits:"5M+",logo:"https://ai-bot.cn/wp-content/uploads/2025/01/trae-ai-icon.png",url:"https://www.trae.ai",pricing:"免费",chinese_support:!0,popularity_score:96},{id:4,name:"AiPPT",category:"office",tags:["PPT生成","办公效率","一键生成"],desc:"AI快速生成高质量PPT。输入标题即可生成大纲和完整PPT内容。",rating:4.6,visits:"8M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/05/aippt-icon.png",url:"https://www.aippt.cn",pricing:"免费/付费",chinese_support:!0,popularity_score:94},{id:5,name:"秘塔AI搜索",category:"search",tags:["无广告","学术搜索","深度搜索"],desc:"最好用的AI搜索工具，没有广告，直达结果。深入理解问题，提供精准答案。",rating:4.8,visits:"20M+",logo:"https://ai-bot.cn/wp-content/uploads/2024/01/metaso-icon.png",url:"https://metaso.cn",pricing:"免费",chinese_support:!0,popularity_score:97},{id:6,name:"堆友AI",category:"image",tags:["阿里出品","3D设计","免费生图"],desc:"免费AI绘画和生图神器。阿里巴巴设计师团队推出的AI设计平台。",rating:4.7,visits:"15M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/06/d-design-icon.png",url:"https://d.design",pricing:"免费",chinese_support:!0,popularity_score:93},{id:7,name:"白日梦",category:"video",tags:["文生视频","长视频","故事创作"],desc:"AI视频创作平台，最长可生成六分钟的视频。光魔科技推出，支持文生视频、动态画面、AI角色生成。",rating:4.6,visits:"3M+",logo:"https://ai-bot.cn/wp-content/uploads/2024/04/aibrm-icon.png",url:"https://aibrm.com",pricing:"免费/付费",chinese_support:!0,popularity_score:90},{id:8,name:"Udacity AI学院",category:"learn",tags:["课程","深度学习","职业教育"],desc:"Udacity推出的School of AI，从入门到高级的AI学习课程。涵盖机器学习、深度学习、NLP等领域。",rating:4.8,visits:"1M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/06/udacity-icon.png",url:"https://www.udacity.com/school-of-ai",pricing:"付费",chinese_support:!1,popularity_score:85},{id:9,name:"DeepSeek",category:"chat",tags:["开源","强逻辑","深度思考"],desc:"幻方量化推出的AI智能助手和开源大模型。擅长代码生成与数学推理，中文能力出色。",rating:4.9,visits:"30M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/11/deepseek-icon.png",url:"https://chat.deepseek.com",pricing:"免费",chinese_support:!0,popularity_score:99},{id:10,name:"Kimi智能助手",category:"chat",tags:["长文本","文件分析","月之暗面"],desc:"月之暗面推出的AI智能助手。支持20万字超长上下文，擅长研报分析与长文总结。",rating:4.8,visits:"25M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/10/kimi-chat-icon.png",url:"https://kimi.moonshot.cn",pricing:"免费",chinese_support:!0,popularity_score:97},{id:11,name:"通义千问",category:"chat",tags:["阿里","全能型","文档解析"],desc:"阿里巴巴推出的超大规模预训练模型。具备多轮对话、文案创作、逻辑推理等能力。",rating:4.7,visits:"28M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/04/tongyi-qianwen-icon.png",url:"https://tongyi.aliyun.com",pricing:"免费",chinese_support:!0,popularity_score:96},{id:12,name:"文心一言",category:"chat",tags:["百度","知识增强","绘图"],desc:"百度推出的基于文心大模型的AI智能助手。能够与人对话互动，回答问题，协助创作。",rating:4.6,visits:"40M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/yiyan-baidu-icon.png",url:"https://yiyan.baidu.com",pricing:"免费/付费",chinese_support:!0,popularity_score:95},{id:13,name:"Midjourney",category:"image",tags:["绘图","艺术","高质量"],desc:"AI图像和插画生成工具。目前效果最好的AI绘画工具之一，能够生成照片级逼真且富有艺术感的图像。",rating:4.9,visits:"50M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/midjourney-icon.png",url:"https://www.midjourney.com",pricing:"付费",chinese_support:!1,popularity_score:98},{id:14,name:"Runway",category:"video",tags:["视频编辑","文生视频","影视级"],desc:"专业的AI视频编辑和生成工具。好莱坞级别的视频制作和后期处理AI软件。",rating:4.8,visits:"10M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/runwayml-icon.png",url:"https://runwayml.com",pricing:"免费/付费",chinese_support:!1,popularity_score:94},{id:15,name:"Suno",category:"audio",tags:["音乐生成","写歌","人声"],desc:"高质量的AI音乐创作平台。只需输入歌词或描述，即可生成包含人声的完整歌曲。",rating:4.8,visits:"15M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/12/suno-ai-icon.png",url:"https://www.suno.ai",pricing:"免费/付费",chinese_support:!1,popularity_score:96},{id:16,name:"Gamma",category:"office",tags:["PPT","文档","网页"],desc:"AI幻灯片演示生成工具。一种新的媒介，可以像文档一样书写，像幻灯片一样展示。",rating:4.8,visits:"18M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/gamma-app-icon.png",url:"https://gamma.app",pricing:"免费/付费",chinese_support:!1,popularity_score:95},{id:17,name:"Perplexity",category:"search",tags:["搜索","引用","精准"],desc:"AI搜索引擎与深度研究工具。结合了ChatGPT的对话能力和搜索引擎的实时性。",rating:4.8,visits:"22M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/perplexity-ai-icon.png",url:"https://www.perplexity.ai",pricing:"免费/付费",chinese_support:!1,popularity_score:97},{id:18,name:"Coze",category:"agent",tags:["智能体","字节跳动","无代码"],desc:"新一代一站式 AI Bot 开发平台。无论你是否有编程基础，都可以快速创建各种类型的 Chat Bot。",rating:4.7,visits:"8M+",logo:"https://ai-bot.cn/wp-content/uploads/2024/02/coze-icon.png",url:"https://www.coze.cn",pricing:"免费",chinese_support:!0,popularity_score:94},{id:19,name:"LiblibAI",category:"image",tags:["模型分享","Stable Diffusion","社区"],desc:"国内领先的AI图像创作平台和模型分享社区。可以在线运行Stable Diffusion模型。",rating:4.7,visits:"10M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/05/liblibai-icon.png",url:"https://www.liblib.ai",pricing:"免费",chinese_support:!0,popularity_score:92},{id:20,name:"稿定AI",category:"image",tags:["设计","商用","电商"],desc:"一站式AI设计工具集。提供AI绘图、AI设计、AI文案等功能，助力设计提效。",rating:4.6,visits:"12M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/05/gaoding-ai-icon.png",url:"https://www.gaoding.com/ai",pricing:"免费/付费",chinese_support:!0,popularity_score:91},{id:21,name:"讯飞星火",category:"chat",tags:["科大讯飞","语音","写作"],desc:"科大讯飞推出的新一代认知智能大模型。拥有跨领域的知识和语言理解能力。",rating:4.7,visits:"20M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/05/xinghuo-xfyun-icon.png",url:"https://xinghuo.xfyun.cn",pricing:"免费",chinese_support:!0,popularity_score:93},{id:22,name:"ChatGPT",category:"chat",tags:["OpenAI","基准","最强"],desc:"OpenAI 推出的AI聊天机器人。开启了AI新时代的革命性产品，GPT-4是目前最强模型之一。",rating:4.9,visits:"1.6B+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/chatgpt-icon.png",url:"https://chat.openai.com",pricing:"免费/付费",chinese_support:!0,popularity_score:100},{id:23,name:"Claude 3",category:"chat",tags:["Anthropic","长文本","安全"],desc:"Anthropic公司推出的对话式AI智能助手。在长文本处理和逻辑推理方面表现优异。",rating:4.8,visits:"20M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/claude-icon.png",url:"https://claude.ai",pricing:"免费/付费",chinese_support:!1,popularity_score:96},{id:24,name:"GitHub Copilot",category:"dev",tags:["代码补全","微软","插件"],desc:"GitHub推出的AI编程工具。你的AI结对程序员，帮助你更快、更少出错地编写代码。",rating:4.9,visits:"15M+",logo:"https://ai-bot.cn/wp-content/uploads/2023/03/github-copilot-icon.png",url:"https://github.com/features/copilot",pricing:"付费",chinese_support:!1,popularity_score:97}],o={};document.addEventListener("DOMContentLoaded",async()=>{console.log("🚀 AI方舟 初始化中..."),b(),await v(),A(),w(),x(),d(),C(),M(),$(),y(),console.log("✅ AI方舟 初始化完成")});function y(){if(window.echarts&&document.getElementById("stats-chart")){const t=echarts.init(document.getElementById("stats-chart")),e={tooltip:{trigger:"item"},legend:{show:!1},series:[{name:"工具分类",type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},label:{show:!1},emphasis:{label:{show:!1}},labelLine:{show:!1},data:[{value:1048,name:"AI 对话",itemStyle:{color:"#3b82f6"}},{value:735,name:"AI 绘画",itemStyle:{color:"#ec4899"}},{value:580,name:"AI 写作",itemStyle:{color:"#f59e0b"}},{value:484,name:"AI 视频",itemStyle:{color:"#8b5cf6"}},{value:300,name:"其他",itemStyle:{color:"#cbd5e1"}}]}]};t.setOption(e),window.addEventListener("resize",()=>{t.resize()})}}function b(){o.toolsGrid=document.getElementById("tools-grid"),o.categoryNav=document.getElementById("category-nav"),o.mobileCategories=document.getElementById("mobile-categories"),o.globalSearch=document.getElementById("global-search"),o.mobileSearch=document.getElementById("mobile-search"),o.pageTitle=document.getElementById("page-title"),o.totalCountBadge=document.getElementById("total-count-badge"),o.sortSelect=document.getElementById("sort-select"),o.activeFilters=document.getElementById("active-filters"),o.noResults=document.getElementById("no-results"),o.loadingState=document.getElementById("loading-state"),o.loadMoreBtn=document.getElementById("load-more-btn"),o.compareBtn=document.getElementById("compare-btn"),o.compareCount=document.getElementById("compare-count"),o.compareDrawer=document.getElementById("compare-drawer"),o.compareItems=document.getElementById("compare-items"),o.compareModal=document.getElementById("compare-modal"),o.compareTable=document.getElementById("compare-table"),o.loginModal=document.getElementById("login-modal"),o.loginBtn=document.getElementById("login-btn"),o.authSection=document.getElementById("auth-section"),o.favoritesBtn=document.getElementById("favorites-btn"),o.todayRecommendations=document.getElementById("today-recommendations"),o.myCollections=document.getElementById("my-collections")}async function v(){try{o.loadingState.classList.remove("hidden"),await new Promise(t=>setTimeout(t,300)),i.categories=f,i.tools=h,i.filteredTools=[...i.tools],o.totalCountBadge&&(o.totalCountBadge.textContent=1428),_(),console.log(`📊 加载了 ${i.tools.length} 个工具，${i.categories.length} 个分类`)}catch(t){console.error("❌ 数据加载失败:",t),l("数据加载失败，请刷新页面重试","error")}finally{o.loadingState.classList.add("hidden")}}function w(){if(!i.categories.length)return;const t=i.categories.map(a=>`
        <div class="category-group" data-category="${a.id}">
            <button class="category-item w-full flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition mb-1" onclick="selectCategory('${a.id}')">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm" style="background-color: ${a.color}">
                    <i class="fa-solid ${a.icon} text-sm"></i>
                </div>
                <span class="flex-1 text-left">${a.name}</span>
                <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shadow-inner">
                    ${Math.floor(Math.random()*100)+10}
                </span>
            </button>
        </div>
    `).join("");o.categoryNav&&(o.categoryNav.innerHTML=t);const e=i.categories.map(a=>`
        <button class="category-btn-mobile whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2" 
                onclick="selectCategory('${a.id}')"
                data-id="${a.id}"
                style="border-color: ${a.color}20; color: ${a.color}">
            <i class="fa-solid ${a.icon}"></i>
            ${a.name}
        </button>
    `).join("");o.mobileCategories&&(o.mobileCategories.innerHTML=e)}window.selectCategory=function(t){i.activeCategory=t,i.activeSubcategory=null,i.currentPage=1,document.querySelectorAll(".category-item").forEach(a=>{var n;a.classList.remove("active"),((n=a.closest(".category-group"))==null?void 0:n.dataset.category)===t&&a.classList.add("active")});const e=document.getElementById("all-categories-btn");if(t==="all"?e==null||e.classList.add("active"):e==null||e.classList.remove("active"),t==="all")o.pageTitle&&(o.pageTitle.textContent="全部工具");else{const a=i.categories.find(n=>n.id===t);o.pageTitle&&a&&(o.pageTitle.textContent=a.name)}c()};window.selectSubcategory=function(t,e){i.activeCategory=t,i.activeSubcategory=e,i.currentPage=1,o.pageTitle&&(o.pageTitle.textContent=e),c(),event.stopPropagation()};function x(){document.querySelectorAll(".filter-pricing").forEach(e=>{e.addEventListener("change",()=>{const a=Array.from(document.querySelectorAll(".filter-pricing:checked")).map(n=>n.value);i.filters.pricing=a,i.currentPage=1,c()})});const t=document.getElementById("filter-chinese");t&&t.addEventListener("change",()=>{i.filters.chinese=t.checked,i.currentPage=1,c()}),o.sortSelect&&o.sortSelect.addEventListener("change",()=>{i.sortBy=o.sortSelect.value,c()})}function c(){let t=[...i.tools];if(i.activeCategory!=="all"&&(t=t.filter(e=>e.category===i.activeCategory)),i.searchQuery){const e=i.searchQuery.toLowerCase();t=t.filter(a=>a.name.toLowerCase().includes(e)||a.desc.toLowerCase().includes(e)||a.tags.some(n=>n.toLowerCase().includes(e)))}switch(i.filters.pricing.length>0&&(t=t.filter(e=>{const a=e.pricing_type||(e.pricing.includes("免费")?"free":"paid");return i.filters.pricing.includes(a)})),i.filters.chinese&&(t=t.filter(e=>e.chinese_support)),i.sortBy){case"popular":t.sort((e,a)=>(a.popularity_score||0)-(e.popularity_score||0));break;case"newest":t.sort((e,a)=>a.id-e.id);break;case"rating":t.sort((e,a)=>(a.rating||0)-(e.rating||0));break;case"name":t.sort((e,a)=>e.name.localeCompare(a.name,"zh"));break}i.filteredTools=t,i.currentPage=1,I(),d()}function I(){if(!o.activeFilters)return;const t=[];if(i.activeCategory!=="all"){const e=i.categories.find(a=>a.id===i.activeCategory);t.push({text:(e==null?void 0:e.name)||i.activeCategory,onRemove:()=>selectCategory("all")})}if(i.searchQuery&&t.push({text:`搜索: ${i.searchQuery}`,onRemove:()=>{i.searchQuery="",o.globalSearch.value="",o.mobileSearch.value="",c()}}),t.length===0){o.activeFilters.classList.add("hidden");return}o.activeFilters.innerHTML=t.map(e=>`
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
            ${e.text}
            <button onclick="(${e.onRemove})()" class="ml-2 text-blue-400 hover:text-blue-600">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join(""),o.activeFilters.classList.remove("hidden")}function d(){if(!o.toolsGrid)return;const t=0,e=i.currentPage*i.itemsPerPage,a=i.filteredTools.slice(t,e);if(a.length===0){o.toolsGrid.innerHTML="",o.noResults.classList.remove("hidden"),o.loadMoreBtn.classList.add("hidden");return}o.noResults.classList.add("hidden");const n=a.map(s=>L(s)).join("");o.toolsGrid.innerHTML=n,i.filteredTools.length>e?o.loadMoreBtn.classList.remove("hidden"):o.loadMoreBtn.classList.add("hidden")}function L(t){const e=i.categories.find(n=>n.id===t.category),a=i.favorites.includes(t.id);return i.compareList.includes(t.id),`
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
                <button onclick="toggleFavorite(${t.id}, event)" class="text-slate-300 hover:text-red-500 transition ${a?"text-red-500":""}">
                    <i class="${a?"fa-solid":"fa-regular"} fa-heart"></i>
                </button>
            </div>
            
            <!-- Description -->
            <p class="text-slate-500 text-sm line-clamp-2 mb-4 h-10">${t.desc}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
                ${t.tags.slice(0,3).map(n=>`
                    <span class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">${n}</span>
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
    `}function A(){o.globalSearch&&(o.globalSearch.addEventListener("input",g(e=>{i.searchQuery=e.target.value,i.currentPage=1,c()},300)),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="k"&&(e.preventDefault(),o.globalSearch.focus())})),o.mobileSearch&&o.mobileSearch.addEventListener("input",g(e=>{i.searchQuery=e.target.value,i.currentPage=1,c()},300)),o.loadMoreBtn&&o.loadMoreBtn.addEventListener("click",()=>{i.currentPage++,d()}),o.loginBtn&&o.loginBtn.addEventListener("click",()=>{o.loginModal.classList.remove("hidden")});const t=document.getElementById("all-categories-btn");t&&t.addEventListener("click",()=>{selectCategory("all")})}function g(t,e){let a;return function(...s){const r=()=>{clearTimeout(a),t(...s)};clearTimeout(a),a=setTimeout(r,e)}}function C(){u()}window.toggleCompare=function(t){const e=i.compareList.indexOf(t);if(e>-1)i.compareList.splice(e,1);else{if(i.compareList.length>=4){l("最多只能对比4个工具","warning");return}i.compareList.push(t)}u(),d()};function u(){const t=i.compareList.length;if(o.compareCount&&(o.compareCount.textContent=t,o.compareCount.classList.toggle("hidden",t===0)),t>0){o.compareDrawer.classList.remove("translate-y-full");const e=i.compareList.map(a=>i.tools.find(n=>n.id===a)).filter(Boolean);o.compareItems.innerHTML=e.map(a=>`
            <div class="flex-shrink-0 w-32 bg-slate-50 rounded-lg p-2 relative">
                <button onclick="toggleCompare(${a.id})" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${a.logo}" class="w-8 h-8 rounded mx-auto mb-1">
                <p class="text-xs text-center truncate">${a.name}</p>
            </div>
        `).join(""),document.getElementById("compare-drawer-count").textContent=t}else o.compareDrawer.classList.add("translate-y-full")}window.clearCompare=function(){i.compareList=[],u(),d()};window.toggleCompareDrawer=function(){o.compareDrawer.classList.toggle("translate-y-full")};window.startCompare=function(){if(i.compareList.length<2){l("请至少选择2个工具进行对比","warning");return}const t=i.compareList.map(a=>i.tools.find(n=>n.id===a)).filter(Boolean),e=[{label:"工具名称",key:"name"},{label:"分类",key:"category",render:a=>{var n;return((n=i.categories.find(s=>s.id===a))==null?void 0:n.name)||a}},{label:"评分",key:"rating"},{label:"访问量",key:"visits"},{label:"价格",key:"pricing"},{label:"中文支持",key:"chinese_support",render:a=>a?"✅":"❌"},{label:"描述",key:"desc"}];o.compareTable.innerHTML=`
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
    `,o.compareModal.classList.remove("hidden")};window.closeCompareModal=function(){o.compareModal.classList.add("hidden")};function M(){m()}window.toggleFavorite=function(t,e){e&&e.stopPropagation();const a=i.favorites.indexOf(t);a>-1?(i.favorites.splice(a,1),l("已取消收藏","info")):(i.favorites.push(t),l("已添加到收藏","success")),localStorage.setItem("aiark_favorites",JSON.stringify(i.favorites)),m(),d()};function m(){if(o.favoritesBtn){const t=i.favorites.length;o.favoritesBtn.innerHTML=`
            <i class="${t>0?"fa-solid text-red-500":"fa-regular"} fa-heart mr-2"></i>
            收藏${t>0?` (${t})`:""}
        `}if(o.myCollections)if(i.favorites.length===0)o.myCollections.innerHTML=`
                <div class="text-center py-4 text-slate-400 text-sm">
                    <i class="fa-regular fa-folder-open text-3xl mb-2"></i>
                    <p>暂无收藏工具</p>
                </div>
            `;else{const t=i.favorites.map(e=>i.tools.find(a=>a.id===e)).filter(Boolean);o.myCollections.innerHTML=t.slice(0,5).map(e=>`
                <div class="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer" onclick="showToolDetail(${e.id})">
                    <img src="${e.logo}" class="w-8 h-8 rounded">
                    <span class="text-sm text-slate-700 truncate flex-1">${e.name}</span>
                </div>
            `).join("")}}async function _(){if(!o.todayRecommendations||!i.tools.length)return;const t=[...i.tools].sort(()=>Math.random()-.5).slice(0,3);o.todayRecommendations.innerHTML=t.map(e=>`
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
    `).join("")}function $(){const t=localStorage.getItem("aiark_user");t&&(i.user=JSON.parse(t),i.isLoggedIn=!0,T())}function T(){i.isLoggedIn&&o.authSection&&(o.authSection.innerHTML=`
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-bold text-slate-800">Hi, ${i.user.userName||"用户"}</p>
                    <p class="text-[10px] text-green-600 font-medium">已登录</p>
                </div>
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-user text-sm"></i>
                </div>
            </div>
        `)}window.closeLoginModal=function(){o.loginModal.classList.add("hidden")};window.showToolDetail=function(t){const e=i.tools.find(a=>a.id===t);e&&window.open(e.url,"_blank")};window.resetAllFilters=function(){i.activeCategory="all",i.activeSubcategory=null,i.searchQuery="",i.filters.pricing=[],i.filters.chinese=!1,o.globalSearch.value="",o.mobileSearch.value="",document.querySelectorAll(".filter-pricing").forEach(t=>t.checked=!1),document.getElementById("filter-chinese").checked=!1,selectCategory("all")};function l(t,e="info"){const a=document.getElementById("toast-container");if(!a)return;const n={success:"bg-green-500",error:"bg-red-500",warning:"bg-amber-500",info:"bg-blue-500"},s=document.createElement("div");s.className=`${n[e]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`,s.innerHTML=`
        <i class="fa-solid ${e==="success"?"fa-check-circle":e==="error"?"fa-exclamation-circle":e==="warning"?"fa-exclamation-triangle":"fa-info-circle"}"></i>
        <span>${t}</span>
    `,a.appendChild(s),setTimeout(()=>{s.remove()},3e3)}window.showToast=l;
