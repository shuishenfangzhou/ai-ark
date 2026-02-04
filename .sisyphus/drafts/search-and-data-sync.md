# 搜索框优化与ai-bot.cn数据同步计划

## 需求分析

### 1. 搜索框改造需求
- **当前状态**: 使用 Ctrl+K 快捷键触发搜索
- **目标状态**: 模仿 ai-bot.cn，使用放大镜图标按钮触发搜索
- **改造位置**: `src/components/Header.astro`

### 2. ai-bot.cn数据同步需求
- **当前状态**: tools.json 包含216个工具，logo字段大多为null
- **目标状态**: 抓取 ai-bot.cn 的工具数据（约1400+工具）和logo图片
- **数据源**: https://ai-bot.cn/ (WordPress站点)

## ai-bot.cn网站分析

### 网站结构
- **平台**: WordPress + OneNav主题
- **分类**: 30+ 主分类，100+ 子分类
- **工具数量**: 约1400+ AI工具
- **图片存储**: `https://ai-bot.cn/wp-content/uploads/{年份}/{月份}/{图片}.png`
- **数据页面**: `https://ai-bot.cn/sites/{id}.html`

### 工具数据页面示例
```
https://ai-bot.cn/sites/4189.html (豆包)
https://ai-bot.cn/sites/17772.html (即梦AI)
https://ai-bot.cn/sites/65814.html (TRAE编程)
```

### 工具卡片HTML结构
```html
<div class="sites-item">
  <img src="https://ai-bot.cn/wp-content/themes/onenav/images/favicon.png" alt="工具名">
  <h3>工具名称</h3>
  <p>工具描述...</p>
  <a href="工具官网链接">直达</a>
</div>
```

## 技术方案

### 方案一：Python爬虫方案（推荐）
使用Python脚本定期同步数据：
1. **主分类页面**: 抓取所有分类链接
2. **工具列表页**: 遍历每个工具详情页
3. **详情页解析**: 提取工具名称、描述、官网、logo
4. **图片下载**: 下载logo到本地或使用CDN
5. **JSON生成**: 输出标准化的tools.json格式

### 方案二：Node.js爬虫方案
使用Puppeteer/Playwright渲染页面后爬取

### 方案三：WordPress REST API（如果可用）
检查是否有WP REST API接口

## 实施步骤

### 阶段1：搜索框UI改造
1. 移除 Ctrl+K 快捷键提示
2. 添加放大镜图标按钮
3. 优化搜索框样式
4. 测试搜索功能

### 阶段2：数据抓取脚本开发
1. 搭建Python爬虫环境
2. 实现分类页解析
3. 实现工具详情页解析
4. 实现图片下载功能
5. 生成标准JSON格式

### 阶段3：数据整合
1. 合并现有数据和新抓取数据
2. 处理重复工具
3. 更新logo图片路径
4. 验证数据完整性

## 待确认事项
1. 是否需要保持现有数据中的部分字段（如rating、popularity）？
2. Logo图片存储方式：本地存储 / CDN / 远程链接？
3. 数据更新频率：每日/每周/手动？
4. 是否需要过滤特定类别的工具？
