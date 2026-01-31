# Role
你是一名精通 Next.js (React) 和 Tailwind CSS 的高级前端架构师。正在负责重构一个 AI 工具导航站。

# Context
我现有的网站是：https://ai-tools-dashboard-sepia.vercel.app/
参考标杆网站是：https://ai-bot.cn/

# Mission
请完全参照 ai-bot.cn 的 UI 布局和交互逻辑，对我现有的代码进行彻底重构。重点解决布局结构、卡片密度以及“无图工具”的兼容显示问题。

# Critical Instructions (必须执行的指令)

## 1. 布局重构 (Layout & Navigation)
- **侧边栏 (Sidebar)**：实现一个左侧固定导航栏（w-64），列出所有工具分类（如：AI Chat, Image Gen, Video, etc.）。点击分类时，右侧主内容区应平滑滚动到对应锚点。
- **网格系统 (Grid System)**：右侧内容区采用响应式网格布局。
  - Desktop: `grid-cols-4` (一行 4 个)
  - Tablet: `grid-cols-2`
  - Mobile: `grid-cols-1`
- **间距 (Spacing)**：减小卡片之间的间距 (`gap-4`)，提升屏幕空间利用率，减少留白。

## 2. 智能卡片组件 (Smart Tool Card)
请重新设计 `ToolCard` 组件，必须包含以下元素：
- **Header**: 左侧是 Logo，右侧是标题和一行标签（如：Free/Paid）。
- **Body**: 限制为 2 行的灰字描述 (`line-clamp-2`)。
- **Footer**: 点赞数/热度统计 + "访问官网"的图标按钮。

## 3. 图片容错与兜底机制 (Image Fallback Strategy) - 🌟 重要
目前有很多工具缺少 Logo 图片，绝不能因此隐藏它们。请按以下逻辑实现 `ImageWithFallback` 组件：
- **逻辑**：
  1. 尝试加载 `tool.logo_url`。
  2. 如果 URL 为空 或 加载失败 (onError)，则**显示默认样式**。
- **默认样式 (Default)**：
  - 方案 A：显示一个带有该工具首字母的彩色背景方块（类似 Gmail 头像）。
  - 方案 B：显示一个统一的灰色 SVG 占位图标（IconPlaceholder）。
- **数据渲染**：
  - 检查代码中的 `.map()` 循环，**移除**任何类似 `if (!tool.image) return null` 的过滤条件。
  - 确保即使没有图片，卡片也能完整渲染，且布局高度与其他有图卡片保持一致（使用 `aspect-square` 或固定宽高）。

## 4. 视觉风格 (Visual Style)
- **背景**：`bg-slate-50` (极浅灰)。
- **卡片**：`bg-white`, `border-slate-200`, `rounded-xl`。
- **交互**：`hover:shadow-lg`, `hover:-translate-y-1` (轻微上浮), `transition-all`。

# Output
请提供修改后的 `ToolCard.tsx` 组件代码（包含图片 Fallback 逻辑）以及主页面布局的 Tailwind 类名结构。