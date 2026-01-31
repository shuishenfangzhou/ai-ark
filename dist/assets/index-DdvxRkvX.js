(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const g of i.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&l(g)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();const r=[{id:1,name:"DeepSeek",category:"text",desc:"深度求索开源模型，推理能力极其强大。",url:"https://www.deepseek.com/",tags:["开源","国产","免费"],pricing:"开源",visits:"78M+",rating:4.7,logo:"/assets/logos/deepseek.png"},{id:2,name:"Kimi智能助手",category:"text",desc:"月之暗面出品，支持20万字超长上下文。",url:"https://kimi.moonshot.cn/",tags:["长文本","文件分析","免费"],pricing:"免费",visits:"66M+",rating:4.7,logo:"/assets/logos/kimi智能助手.png"},{id:3,name:"豆包",category:"text",desc:"字节跳动出品，语音交互体验极佳。",url:"https://www.doubao.com/",tags:["语音","日常","免费"],pricing:"免费",visits:"33M+",rating:4.9,logo:"/assets/logos/豆包.png"},{id:4,name:"通义千问",category:"text",desc:"阿里全能型大模型，支持图片理解。",url:"https://tongyi.aliyun.com/",tags:["全能","阿里","免费"],pricing:"免费",visits:"10M+",rating:4.7,logo:"/assets/logos/通义千问.png"},{id:5,name:"文心一言",category:"text",desc:"百度推出的知识增强大语言模型。",url:"https://yiyan.baidu.com/",tags:["百度","知识","付费"],pricing:"付费",visits:"21M+",rating:4.5,logo:"/assets/logos/文心一言.png"},{id:6,name:"智谱清言",category:"text",desc:"清华系GLM模型，中文理解能力出色。",url:"https://chatglm.cn/",tags:["清华","开源","免费"],pricing:"开源",visits:"62M+",rating:4.6,logo:"/assets/logos/智谱清言.png"},{id:7,name:"ChatGPT",category:"text",desc:"OpenAI推出的全球最强AI对话助手。",url:"https://chat.openai.com/",tags:["最强","通用","付费"],pricing:"付费",visits:"1.6B+",rating:4.9,logo:"/assets/logos/chatgpt.png"},{id:8,name:"Claude 3",category:"text",desc:"Anthropic出品，逻辑推理与写作能力超强。",url:"https://claude.ai/",tags:["逻辑","写作","付费"],pricing:"付费",visits:"80M+",rating:4.8,logo:"/assets/logos/claude.png"},{id:9,name:"Midjourney",category:"image",desc:"目前生成质量最高的AI绘画工具。",url:"https://www.midjourney.com/",tags:["绘画","艺术","付费"],pricing:"付费",visits:"50M+",rating:4.9,logo:"/assets/logos/midjourney.png"},{id:10,name:"Stable Diffusion",category:"image",desc:"开源、可本地部署的强大绘画模型。",url:"https://stability.ai/",tags:["开源","本地","免费"],pricing:"免费",visits:"25M+",rating:4.7,logo:"/assets/logos/stablediffusion.png"},{id:11,name:"即梦AI",category:"image",desc:"字节跳动出品，集绘画与视频生成于一体。",url:"https://jimeng.jianying.com/",tags:["绘画","视频","免费"],pricing:"免费",visits:"12M+",rating:4.6,logo:"/assets/logos/即梦ai.png"},{id:12,name:"Sora",category:"video",desc:"OpenAI发布的视频生成大模型（待公测）。",url:"https://openai.com/sora",tags:["视频","真实","付费"],pricing:"待定",visits:"N/A",rating:5,logo:"/assets/logos/sora.png"},{id:13,name:"Runway",category:"video",desc:"专业级AI视频编辑与生成工具。",url:"https://runwayml.com/",tags:["视频","编辑","付费"],pricing:"付费",visits:"18M+",rating:4.6,logo:"/assets/logos/runway.png"},{id:14,name:"Suno",category:"audio",desc:"最强AI音乐生成器，一键写歌。",url:"https://suno.com/",tags:["音乐","生成","免费"],pricing:"免费",visits:"40M+",rating:4.8,logo:"/assets/logos/suno.png"},{id:15,name:"Gamma",category:"office",desc:"一键生成精美PPT，办公神器。",url:"https://gamma.app/",tags:["PPT","办公","免费"],pricing:"免费",visits:"22M+",rating:4.7,logo:"/assets/logos/gamma.png"},{id:16,name:"Perplexity",category:"search",desc:"结合搜索与LLM的智能问答引擎。",url:"https://www.perplexity.ai/",tags:["搜索","问答","免费"],pricing:"免费",visits:"55M+",rating:4.8,logo:"/assets/logos/perplexity.png"},{id:17,name:"秘塔AI搜索",category:"search",desc:"无广告、信源可溯的国产AI搜索。",url:"https://metaso.cn/",tags:["搜索","国产","免费"],pricing:"免费",visits:"8M+",rating:4.7,logo:"/assets/logos/秘塔ai搜索.png"},{id:18,name:"天工AI",category:"search",desc:"昆仑万维出品，拥有强大的搜索与写作能力。",url:"https://www.tiangong.cn/",tags:["搜索","写作","免费"],pricing:"免费",visits:"5M+",rating:4.5,logo:"/assets/logos/天工ai.png"},{id:19,name:"海螺AI",category:"text",desc:"MiniMax出品，语音与文本交互体验极佳。",url:"https://hailuoai.com/",tags:["语音","通用","免费"],pricing:"免费",visits:"6M+",rating:4.6,logo:"/assets/logos/海螺ai.png"},{id:20,name:"Pika",category:"video",desc:"文本生成视频，动画风格独特。",url:"https://pika.art/",tags:["视频","动画","免费"],pricing:"免费",visits:"15M+",rating:4.5,logo:"/assets/logos/pika.png"},{id:21,name:"Leonardo.ai",category:"image",desc:"游戏资产与艺术绘画生成平台。",url:"https://leonardo.ai/",tags:["绘画","游戏","免费"],pricing:"免费",visits:"30M+",rating:4.7,logo:"/assets/logos/leonardoai.png"},{id:22,name:"Civitai",category:"image",desc:"最大的Stable Diffusion模型分享社区。",url:"https://civitai.com/",tags:["模型","社区","免费"],pricing:"免费",visits:"90M+",rating:4.9,logo:"/assets/logos/civitai.svg"},{id:23,name:"Hugging Face",category:"dev",desc:"AI领域的GitHub，模型与数据集托管。",url:"https://huggingface.co/",tags:["开发","模型","免费"],pricing:"免费",visits:"120M+",rating:4.9,logo:"/assets/logos/huggingface.svg"},{id:24,name:"GitHub Copilot",category:"code",desc:"微软推出的AI编程助手。",url:"https://github.com/features/copilot",tags:["编程","助手","付费"],pricing:"付费",visits:"N/A",rating:4.8,logo:"/assets/logos/githubcopilot.png"},{id:25,name:"Cursor",category:"code",desc:"基于VS Code的AI原生代码编辑器。",url:"https://cursor.sh/",tags:["编辑器","编程","免费"],pricing:"免费",visits:"5M+",rating:4.8,logo:"/assets/logos/cursor.png"},{id:26,name:"Gemini",category:"text",desc:"Google推出的多模态大模型。",url:"https://gemini.google.com/",tags:["谷歌","多模态","免费"],pricing:"免费",visits:"150M+",rating:4.6,logo:"/assets/logos/gemini.png"},{id:27,name:"Poe",category:"text",desc:"Quora推出的AI聊天机器人聚合平台。",url:"https://poe.com/",tags:["聚合","聊天","免费"],pricing:"免费",visits:"45M+",rating:4.7,logo:"/assets/logos/poe.png"},{id:28,name:"Replit",category:"code",desc:"在线集成开发环境，内置AI编程助手。",url:"https://replit.com/",tags:["IDE","编程","免费"],pricing:"免费",visits:"20M+",rating:4.5,logo:"/assets/logos/replit.png"},{id:29,name:"V0.dev",category:"code",desc:"Vercel推出的生成式UI开发工具。",url:"https://v0.dev/",tags:["UI","前端","免费"],pricing:"免费",visits:"2M+",rating:4.6,logo:"/assets/logos/v0dev.png"},{id:30,name:"ElevenLabs",category:"audio",desc:"逼真的AI语音合成与克隆工具。",url:"https://elevenlabs.io/",tags:["语音","配音","付费"],pricing:"付费",visits:"25M+",rating:4.8,logo:"/assets/logos/elevenlabs.png"},{id:31,name:"Udio",category:"audio",desc:"高质量AI音乐生成新秀。",url:"https://www.udio.com/",tags:["音乐","生成","免费"],pricing:"免费",visits:"10M+",rating:4.7,logo:"/assets/logos/udio.png"},{id:32,name:"HeyGen",category:"video",desc:"AI数字人视频生成平台。",url:"https://www.heygen.com/",tags:["数字人","口型","付费"],pricing:"付费",visits:"12M+",rating:4.6,logo:"/assets/logos/heygen.png"},{id:33,name:"Canva",category:"image",desc:"在线设计平台，集成强大AI功能。",url:"https://www.canva.com/",tags:["设计","排版","免费"],pricing:"免费",visits:"500M+",rating:4.9,logo:"/assets/logos/canvaai.png"},{id:34,name:"Notion AI",category:"office",desc:"集成在Notion中的AI写作助手。",url:"https://www.notion.so/",tags:["笔记","写作","付费"],pricing:"付费",visits:"200M+",rating:4.8,logo:"/assets/logos/notionai.png"},{id:35,name:"Coze",category:"agent",desc:"字节跳动推出的AI Bot开发平台。",url:"https://www.coze.com/",tags:["Bot","开发","免费"],pricing:"免费",visits:"5M+",rating:4.6,logo:"/assets/logos/coze.svg"},{id:36,name:"Trae",category:"code",desc:"字节跳动推出的AI IDE，支持中文开发。",url:"https://www.trae.ai/",tags:["IDE","中文","免费"],pricing:"免费",visits:"1M+",rating:4.8,logo:"/assets/logos/trae.png"}],c=[{id:"all",name:"全部工具",icon:"fa-layer-group"},{id:"text",name:"AI写作工具",icon:"fa-pen-nib"},{id:"image",name:"AI图像工具",icon:"fa-image"},{id:"video",name:"AI视频工具",icon:"fa-video"},{id:"office",name:"AI办公工具",icon:"fa-briefcase"},{id:"agent",name:"AI智能体",icon:"fa-robot"},{id:"code",name:"AI编程工具",icon:"fa-code"},{id:"audio",name:"AI音频工具",icon:"fa-microphone-lines"},{id:"search",name:"AI搜索引擎",icon:"fa-search"},{id:"dev",name:"AI开发平台",icon:"fa-laptop-code"},{id:"learn",name:"AI学习网站",icon:"fa-graduation-cap"}];let o={view:"home",activeToolId:null,searchQuery:"",activeCategory:"all",sortBy:"popular",isLoggedIn:!1,user:null,itemsPerPage:36,displayedTools:[],filteredData:[]};const a={toolsGrid:document.getElementById("tools-grid"),desktopNav:document.getElementById("desktop-categories"),mobileNav:document.getElementById("mobile-categories"),searchInput:document.getElementById("global-search"),mobileSearchInput:document.getElementById("mobile-search"),sectionTitle:document.getElementById("section-title"),totalCount:document.getElementById("total-tools-count"),noResults:document.getElementById("no-results"),loginBtn:document.getElementById("login-btn"),modal:document.getElementById("login-modal"),closeModalX:document.getElementById("close-modal-x"),confirmLoginBtn:document.getElementById("confirm-login-btn"),backdrop:document.getElementById("modal-backdrop"),authSection:document.getElementById("auth-section"),sortSelect:document.getElementById("sort-select")};document.addEventListener("DOMContentLoaded",()=>{x(),d(),E(),a.totalCount.innerText=r.length,h()});function h(){const e=new IntersectionObserver(s=>{s[0].isIntersecting&&o.view==="home"&&u()},{rootMargin:"200px"}),t=document.createElement("div");t.id="scroll-sentinel",t.className="col-span-full h-10 flex justify-center items-center text-slate-400 text-sm",t.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> 加载更多...',a.toolsGrid.after(t),e.observe(t)}function u(){const e=o.filteredData.length,t=o.displayedTools.length;if(t>=e){const l=document.getElementById("scroll-sentinel");l&&l.classList.add("hidden");return}const s=o.filteredData.slice(t,t+o.itemsPerPage);o.displayedTools=[...o.displayedTools,...s],v(s)}function d(){let e=r.filter(s=>{const l=o.activeCategory==="all"||s.category===o.activeCategory,n=s.name.toLowerCase().includes(o.searchQuery)||s.desc.toLowerCase().includes(o.searchQuery)||s.tags.some(i=>i.toLowerCase().includes(o.searchQuery));return l&&n});o.sortBy==="rating"?e.sort((s,l)=>l.rating-s.rating):o.sortBy==="newest"&&e.sort((s,l)=>l.id-s.id),o.filteredData=e,o.displayedTools=[],a.toolsGrid.innerHTML="";const t=document.getElementById("scroll-sentinel");t&&t.classList.remove("hidden"),u(),e.length===0?(a.noResults.classList.remove("hidden"),t&&t.classList.add("hidden")):a.noResults.classList.add("hidden")}function v(e){e.forEach(t=>{const s=document.createElement("div");s.className="tool-card bg-white rounded-xl p-5 flex flex-col h-full cursor-pointer relative overflow-hidden group animate-fade-in-up",t.pricing.includes("免费"),t.pricing.includes("付费"),s.innerHTML=`
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        <img src="${t.logo}" alt="${t.name}" class="w-8 h-8 object-contain" loading="lazy">
                    </div>
                    <div class="ml-3">
                        <h3 class="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-600 transition-colors">${t.name}</h3>
                        <div class="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                            <span class="flex items-center text-amber-500 font-medium"><i class="fa-solid fa-star mr-0.5 text-[10px]"></i> ${t.rating}</span>
                            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>${t.visits} 热度</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <p class="text-slate-600 text-sm mb-5 line-clamp-2 flex-grow leading-relaxed">${t.desc}</p>
            
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div class="flex flex-wrap gap-2">
                    ${t.tags.slice(0,2).map(l=>`<span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md font-medium">${l}</span>`).join("")}
                </div>
                <button class="visit-btn px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center">
                    访问 <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
                </button>
            </div>
        `,s.addEventListener("click",l=>{y(t.id)}),a.toolsGrid.appendChild(s)})}function x(){a.desktopNav.innerHTML=c.map(e=>`
        <button 
            class="category-btn w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-blue-600 transition group ${e.id==="all"?"active":""}"
            onclick="setCategory('${e.id}')"
            data-id="${e.id}"
        >
            <div class="w-6 flex justify-center mr-2">
                <i class="fa-solid ${e.icon} text-slate-400 group-hover:text-blue-500 transition ${e.id==="all"?"text-blue-500":""}"></i>
            </div>
            ${e.name}
            ${e.id==="all"?"":`<span class="ml-auto text-xs text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-400">${b(e.id)}</span>`}
        </button>
    `).join("")+`
        <div class="mt-8 pt-6 border-t border-slate-100">
            <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">更多资源</h3>
            <a href="javascript:void(0)" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-blue-600 group">
                <i class="fa-solid fa-newspaper w-5 text-slate-400 group-hover:text-blue-500"></i>
                每日AI资讯
            </a>
            <a href="javascript:void(0)" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-blue-600 group">
                <i class="fa-solid fa-graduation-cap w-5 text-slate-400 group-hover:text-blue-500"></i>
                AI教程资源
            </a>
        </div>`,a.mobileNav.innerHTML=c.map(e=>`
        <button 
            class="category-btn-mobile whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition ${e.id==="all"?"bg-blue-600 text-white border-blue-600":"bg-white text-slate-600 border-slate-200"}"
            onclick="setCategory('${e.id}')"
            data-id-mobile="${e.id}"
        >
            ${e.name}
        </button>
    `).join("")}function b(e){return r.filter(t=>t.category===e).length}window.setCategory=e=>{o.activeCategory=e,document.querySelectorAll(".category-btn").forEach(s=>{s.dataset.id===e?(s.classList.add("active"),s.querySelector("i").classList.add("text-blue-500"),s.querySelector("i").classList.remove("text-slate-400")):(s.classList.remove("active"),s.querySelector("i").classList.remove("text-blue-500"),s.querySelector("i").classList.add("text-slate-400"))}),document.querySelectorAll(".category-btn-mobile").forEach(s=>{s.dataset.idMobile===e?(s.classList.remove("bg-white","text-slate-600","border-slate-200"),s.classList.add("bg-blue-600","text-white","border-blue-600")):(s.classList.add("bg-white","text-slate-600","border-slate-200"),s.classList.remove("bg-blue-600","text-white","border-blue-600"))});const t=c.find(s=>s.id===e).name;a.sectionTitle.innerText=t,d()};const p=e=>{o.searchQuery=e.target.value.toLowerCase(),d()};a.searchInput.addEventListener("input",p);a.mobileSearchInput.addEventListener("input",p);a.sortSelect.addEventListener("change",e=>{o.sortBy=e.target.value,d()});window.resetFilters=()=>{o.searchQuery="",a.searchInput.value="",a.mobileSearchInput.value="",setCategory("all")};function y(e){o.view="detail",o.activeToolId=e,f(),window.scrollTo(0,0)}function w(){o.view="home",o.activeToolId=null,f()}function f(){const e=document.getElementById("home-view"),t=document.getElementById("detail-view");o.view==="home"?(e.classList.remove("hidden"),t.classList.add("hidden"),document.title="AI工具集 | 1000+ AI工具集合，国内外AI工具集导航大全"):(e.classList.add("hidden"),t.classList.remove("hidden"),I())}function I(){var n;const e=r.find(i=>i.id===o.activeToolId);if(!e)return w();document.title=`${e.name} - AI工具导航`;const t=document.getElementById("detail-content"),s=["支持中文自然语言交互，上手无门槛。","基于最新大模型架构，响应速度极快。","多模态输入输出，满足复杂场景需求。","企业级数据安全保障，隐私无忧。"],l=e.desc.repeat(3)+" 这是一个非常强大的AI工具，能够帮助用户极大提升工作效率。无论是文本生成、图像创作还是代码编写，它都能提供卓越的体验。";t.innerHTML=`
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Content -->
            <div class="flex-1 min-w-0">
                <!-- Breadcrumb -->
                <nav class="text-sm text-slate-500 mb-6 flex items-center space-x-2">
                    <span onclick="showHome()" class="cursor-pointer hover:text-blue-600">首页</span>
                    <i class="fa-solid fa-angle-right text-xs"></i>
                    <span class="cursor-pointer hover:text-blue-600" onclick="setCategory('${e.category}'); showHome();">${((n=c.find(i=>i.id===e.category))==null?void 0:n.name)||e.category}</span>
                    <i class="fa-solid fa-angle-right text-xs"></i>
                    <span class="text-slate-800 font-medium">${e.name}</span>
                </nav>

                <!-- Header -->
                <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div class="flex flex-col sm:flex-row items-start gap-6">
                        <div class="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                            <img src="${e.logo}" class="w-full h-full object-contain">
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h1 class="text-3xl font-bold text-slate-900">${e.name}</h1>
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-full">${e.pricing}</span>
                            </div>
                            <p class="text-lg text-slate-600 mt-2 leading-relaxed">${e.desc}</p>
                            
                            <div class="flex flex-wrap gap-2 mt-4">
                                ${e.tags.map(i=>`<span class="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium"># ${i}</span>`).join("")}
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
                        <p class="mb-6">${l}</p>
                        <h3 class="text-lg font-bold text-slate-900 mb-3">核心功能</h3>
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            ${s.map(i=>`<li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1.5 mr-2"></i><span>${i}</span></li>`).join("")}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar (Recommendations) -->
            <div class="w-full lg:w-80 flex-shrink-0">
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
                    <h3 class="font-bold text-slate-900 mb-4">相关推荐</h3>
                    <div class="space-y-4">
                        ${r.filter(i=>i.category===e.category&&i.id!==e.id).slice(0,5).map(i=>`
                            <div class="flex items-center gap-3 cursor-pointer group" onclick="showDetail(${i.id})">
                                <div class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                                    <img src="${i.logo}" class="w-full h-full object-contain">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-slate-800 text-sm truncate group-hover:text-blue-600 transition">${i.name}</h4>
                                    <div class="flex items-center text-xs text-slate-400 mt-0.5">
                                        <i class="fa-solid fa-star text-amber-400 mr-1"></i> ${i.rating}
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        </div>
    `}a.loginBtn.addEventListener("click",L);a.closeModalX.addEventListener("click",m);a.backdrop.addEventListener("click",m);a.confirmLoginBtn.addEventListener("click",M);function L(){o.isLoggedIn||(a.modal.classList.remove("hidden"),setTimeout(()=>{a.modal.querySelector('div[class*="transform"]').classList.add("modal-enter-active"),a.modal.querySelector('div[class*="transform"]').classList.remove("modal-enter")},10))}function m(){a.modal.classList.add("hidden")}function M(){a.confirmLoginBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> 登录中...',a.confirmLoginBtn.classList.add("opacity-75","cursor-not-allowed"),setTimeout(()=>{o.isLoggedIn=!0,o.user={name:"VIP User",avatar:"fa-user-check"},A(),m(),a.confirmLoginBtn.innerHTML="我已关注，自动登录",a.confirmLoginBtn.classList.remove("opacity-75","cursor-not-allowed")},1e3)}function A(){a.authSection.innerHTML=`
        <div class="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group">
            <div class="hidden md:block text-right">
                <p class="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">Hi, 微信用户</p>
                <p class="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full inline-block">已关注服务号</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <i class="fa-solid fa-user-astronaut text-sm"></i>
            </div>
        </div>
    `}function E(){const e=document.getElementById("categoryChart").getContext("2d"),t={};r.forEach(s=>{t[s.category]=(t[s.category]||0)+1}),new Chart(e,{type:"doughnut",data:{labels:["写作","图像","视频","办公","编程"],datasets:[{data:[t.text||5,t.image||5,t.video||3,t.office||3,t.code||3],backgroundColor:["#3b82f6","#ec4899","#ef4444","#f59e0b","#1e293b"],borderWidth:0,hoverOffset:10}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{position:"right",labels:{usePointStyle:!0,boxWidth:8}}}}})}
