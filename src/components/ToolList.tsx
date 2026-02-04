import { useState, useEffect } from 'react';
import toolsData from '../../data/tools.json';

// 工具类型定义
interface Tool {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_full?: string;
  url: string;
  logo?: string | null;
  category: string;
  tags: string[];
  pricing: string;
  rating: number;
  popularity?: number;
  features?: string[];
  languages?: string[];
  [key: string]: any;
}

// 扩展Window类型
declare global {
  interface Window {
    openToolDetail?: (tool: Tool) => void;
  }
}

export default function ToolList() {
  const [tools, setTools] = useState<Tool[]>(toolsData.tools as Tool[]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(toolsData.tools as Tool[]);
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // 监听顶部搜索框的搜索事件
  useEffect(() => {
    const handleToolSearch = (e: CustomEvent) => {
      if (e.detail === null) {
        // 重置显示所有工具
        setSearchResults(null);
        setFilteredTools(tools);
        setCurrentPage(1);
      } else {
        // 显示搜索结果
        setSearchResults(e.detail);
        setFilteredTools(e.detail);
        setCurrentPage(1);
      }
    };
    
    // 监听分类筛选事件
    const handleCategoryFilter = (e: CustomEvent) => {
      const category = e.detail;
      if (category === null) {
        // 显示全部
        setFilteredTools(tools);
        setSearchResults(null);
      } else {
        // 按分类筛选
        const filtered = tools.filter(tool => tool.category === category);
        setFilteredTools(filtered);
        setSearchResults(null);
      }
      setCurrentPage(1);
    };
    
    window.addEventListener('toolSearch', handleToolSearch as EventListener);
    window.addEventListener('categoryFilter', handleCategoryFilter as EventListener);
    
    // 清理监听
    return () => {
      window.removeEventListener('toolSearch', handleToolSearch as EventListener);
      window.removeEventListener('categoryFilter', handleCategoryFilter as EventListener);
    };
  }, [tools]);

  // 分页计算
  const displayTools = searchResults !== null ? searchResults : filteredTools;
  const totalPages = Math.ceil(displayTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTools = displayTools.slice(startIndex, startIndex + itemsPerPage);


  // 获取Emoji图标
  const getEmojiIcon = (category: string) => {
    const emojiMap: Record<string, string> = {
      'AI对话': '💬',
      'AI绘画': '🎨',
      'AI写作': '✍️',
      'AI编程': '💻',
      'AI视频': '🎬',
      'AI办公': '📊',
      'AI音频': '🎵',
      'AI设计': '🎯',
      'AI搜索': '🔍',
      'AI模型': '🧠',
    };
    return emojiMap[category] || '🤖';
  };

  // 获取渐变色
  const getGradientClass = (category: string) => {
    const gradientMap: Record<string, string> = {
      'AI对话': 'from-blue-500 to-indigo-600',
      'AI绘画': 'from-purple-500 to-pink-500',
      'AI写作': 'from-amber-500 to-orange-500',
      'AI编程': 'from-emerald-500 to-teal-500',
      'AI视频': 'from-pink-500 to-rose-600',
      'AI办公': 'from-cyan-500 to-blue-500',
      'AI音频': 'from-rose-500 to-red-500',
      'AI设计': 'from-violet-500 to-purple-500',
      'AI搜索': 'from-teal-500 to-cyan-500',
      'AI模型': 'from-indigo-500 to-blue-600',
    };
    return gradientMap[category] || 'from-blue-500 to-indigo-600';
  };

  return (
    <div>
      {/* 工具网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {currentTools.map((tool) => (
            <div 
              key={tool.id}
              className="tool-card bg-white rounded-xl border border-slate-200 p-4 hover:shadow-xl transition-all duration-300 group relative cursor-pointer hover:-translate-y-1"
              onClick={() => window.openToolDetail?.(tool)}
              data-name={tool.name}
              data-description={tool.description}
              data-category={tool.category}
              data-tags={(tool.tags || []).join(',').toLowerCase()}
              data-pricing={tool.pricing}
              data-rating={tool.rating}
              data-url={tool.url}
            >
              <div className="flex justify-between items-start mb-3">
                {/* 工具图标 */}
                <div className="flex-1">
                  {tool.logo ? (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow transition">
                      <img 
                        src={tool.logo} 
                        alt={tool.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // 加载失败时显示emoji图标
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-white text-xl">
                              ${getEmojiIcon(tool.category)}
                            </div>
                          `;
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'block';
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradientClass(tool.category)} flex items-center justify-center text-white text-xl shadow-sm group-hover:shadow transition`}>
                      {getEmojiIcon(tool.category)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* 对比复选框 */}
                  <label className="w-6 h-6 border-2 border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition bg-white" title="添加到对比">
                    <input type="checkbox" className="peer hidden" data-tool-name={tool.name} />
                    <div className="w-3 h-3 bg-blue-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform"></div>
                  </label>
                  
                  {/* 收藏按钮 */}
                  <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition">
                    <i className="fa-regular fa-heart"></i>
                  </button>
                </div>
              </div>
              
              {/* 工具标题 */}
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition text-base">{tool.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">{tool.description}</p>
              </div>
              
              {/* 标签 */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(tool.tags || []).slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition">{tag}</span>
                ))}
              </div>
              
              {/* 评分和直达 */}
              <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-3">
                <div className="flex items-center">
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array(5).fill(0).map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < Math.floor(tool.rating) ? '' : 'fa-star-half-stroke'}`}></i>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-slate-500 font-medium">{tool.rating}</span>
                </div>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  直达 <i className="fa-solid fa-arrow-right ml-0.5 text-[10px]"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

      {/* 无结果提示 */}
      {displayTools.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-magnifying-glass-minus text-slate-300 text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-slate-900">未找到相关工具</h3>
          <p className="text-slate-500 mt-2">尝试更换关键词或调整筛选条件</p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="py-8 text-center">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="mx-4 text-slate-600">
            第 {currentPage} / {totalPages} 页，共 {displayTools.length} 个工具
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
