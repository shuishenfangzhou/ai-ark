# AI Tools Dashboard Architecture

## Component Architecture

### 1. Page Structure
```
index.html
├── Header (sticky)
│   ├── Logo
│   ├── Search Bar
│   └── User Actions (Login/Submit)
├── Main Layout (flex)
│   ├── Sidebar (w-64, fixed)
│   │   └── Category Navigation
│   └── Content Area
│       ├── View Toggle (List/Detail)
│       ├── List View
│       │   ├── Filter Bar
│       │   ├── Tool Grid (responsive)
│       │   │   └── ToolCard × N
│       │   └── Pagination/Load More
│       └── Detail View
│           ├── Breadcrumb
│           ├── Tool Header
│           ├── Tool Info
│           ├── Feature List
│           ├── Related Tools
│           └── Right Sidebar (Hot Tools)
└── Footer
```

### 2. Component Hierarchy

#### ToolCard Component
```
.tool-card
├── Card Header
│   ├── Logo (left)
│   └── Title + Tags (right)
├── Card Body
│   └── Description (line-clamp-2)
└── Card Footer
    ├── Stats (visits, likes)
    └── Action Button (Visit)
```

#### DetailView Component
```
.detail-view
├── Breadcrumb
│   └── 首页 > Category > ToolName
├── Tool Header
│   ├── Large Logo
│   ├── Title
│   ├── Tags
│   └── Action Buttons
├── Tool Content
│   ├── Description
│   ├── Features List
│   └── Official Link
└── Sidebar
    └── Hot Tools Ranking
```

### 3. Data Schema

```javascript
{
  id: Number,
  name: String,           // 工具名称
  category: String,       // 分类key
  desc: String,          // 简短描述
  url: String,           // 官网链接
  tags: Array<String>,   // 标签数组
  pricing: String,       // 免费/付费/开源等
  visits: String,        // 访问量 (e.g., "45M+")
  rating: Number,        // 评分 (4.5-5.0)
  logo: String,          // Logo路径或URL
  features: Array<String> // 功能特点 (detail view)
}
```

### 4. Category Structure

```javascript
const categories = [
  { key: 'text', name: 'AI写作工具', icon: 'fa-pen' },
  { key: 'image', name: 'AI图像工具', icon: 'fa-image' },
  { key: 'video', name: 'AI视频工具', icon: 'fa-video' },
  { key: 'audio', name: 'AI音频工具', icon: 'fa-music' },
  { key: 'code', name: 'AI编程工具', icon: 'fa-code' },
  { key: 'search', name: 'AI搜索引擎', icon: 'fa-search' },
  { key: 'office', name: 'AI办公工具', icon: 'fa-briefcase' },
  { key: 'chat', name: 'AI聊天助手', icon: 'fa-comments' },
  { key: 'design', name: 'AI设计工具', icon: 'fa-palette' },
  { key: 'agent', name: 'AI智能体', icon: 'fa-robot' },
  { key: 'platform', name: 'AI开发平台', icon: 'fa-server' },
  { key: 'learn', name: 'AI学习网站', icon: 'fa-graduation-cap' },
  { key: 'model', name: 'AI训练模型', icon: 'fa-brain' },
  { key: 'detect', name: 'AI内容检测', icon: 'fa-shield-alt' },
  { key: 'prompt', name: 'AI提示指令', icon: 'fa-terminal' }
];
```

### 5. State Management

```javascript
// Global State
const state = {
  currentView: 'list',    // 'list' | 'detail'
  selectedTool: null,     // Tool object when in detail view
  searchQuery: '',
  activeCategory: 'all',
  filters: {
    pricing: [],         // ['免费', '付费', '开源']
    features: []         // ['API', '中文支持', '移动端']
  },
  sortBy: 'popular',     // 'popular' | 'newest' | 'rating'
  favorites: [],         // Array of tool IDs
  likes: {}              // { toolId: count }
};
```

### 6. Key Functions

```javascript
// View Management
function showListView() {}
function showDetailView(toolId) {}
function toggleView() {}

// Search & Filter
function searchTools(query) {}
function filterByCategory(category) {}
function filterByPricing(pricing) {}
function sortTools(criteria) {}

// Social Features
function toggleLike(toolId) {}
function toggleFavorite(toolId) {}
function isFavorited(toolId) {}

// Data
function loadToolsData() {}
function getToolById(id) {}
function getRelatedTools(category, excludeId) {}
function getHotTools(limit) {}
```

### 7. Responsive Breakpoints

```css
/* Mobile First */
/* Default: Mobile */
grid-cols-1

/* Tablet (md: 768px) */
md:grid-cols-2

/* Desktop (lg: 1024px) */
lg:grid-cols-3

/* Large Desktop (xl: 1280px) */
xl:grid-cols-4

/* Sidebar */
/* Mobile: Hidden/Drawer */
/* Desktop: Fixed w-64 */
```

### 8. Image Fallback Strategy

```javascript
function getToolLogo(tool) {
  // Priority 1: Local downloaded logo
  if (tool.logo && tool.logo.startsWith('assets/')) {
    return tool.logo;
  }
  
  // Priority 2: UI Avatars (letter avatar)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=128`;
}

// Error handling
<img src="${logo}" 
     onerror="this.src='https://ui-avatars.com/api/?name=${name}&background=random&color=fff'" />
```

### 9. SEO Structure

```html
<!-- Meta Tags -->
<title>AI工具集 | 200+ AI工具导航大全</title>
<meta name="description" content="收录200+国内外优质AI工具，包括AI写作、AI绘画、AI视频、AI编程等分类，助你快速找到合适的AI工具。">

<!-- Open Graph -->
<meta property="og:title" content="AI工具集 | 200+ AI工具导航大全">
<meta property="og:description" content="收录200+国内外优质AI工具...">
<meta property="og:image" content="assets/og-image.png">

<!-- JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI工具集",
  "description": "200+ AI工具导航大全",
  "url": "https://your-domain.com"
}
</script>
```

### 10. File Structure

```
project/
├── index.html              # Main entry
├── js/
│   ├── tools_data.js      # Generated data (200+ tools)
│   ├── app.js             # Main application logic
│   └── components.js      # Reusable components
├── css/
│   └── styles.css         # Custom styles (if needed)
├── assets/
│   ├── logos/             # Downloaded tool logos
│   └── og-image.png       # Social share image
├── tools_manager.py       # Data generation script
└── .sisyphus/
    └── plans/
        └── ai-tools-web-upgrade.md
```

## Implementation Notes

1. **Keep it Simple**: Use vanilla JS + Tailwind CDN, no build step required
2. **Performance**: Lazy load images, virtual scroll for large lists
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Mobile First**: Sidebar becomes drawer on mobile
5. **Data**: All data in JS file, no backend needed for MVP
