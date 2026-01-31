作为全栈开发专家，请帮我升级当前的 ai\_tools\_dashboard.html 项目，使其成为一个功能完整的导航站。

**目标：**

1. **真实数据与链接**：将现有的模拟数据替换为真实的国内外 AI 工具数据（如 DeepSeek, ChatGPT, Midjourney, Kimi, 豆包等），点击卡片必须能跳转到真实的官方网站。  
2. **本地资源化**：不要依赖不稳定的在线图片链接。请编写一个 Python 脚本，自动下载所有工具的 Logo 到本地 assets/logos/ 文件夹。  
3. **数据分离**：将数据从 HTML 中剥离，存放在单独的 js/tools\_data.js 文件中，方便后续通过 Python 脚本自动更新。

**具体执行步骤：**

**第一步：创建数据管理脚本**

请创建一个名为 tools\_manager.py 的 Python 脚本。

* 在脚本中定义一个包含 30+ 个热门 AI 工具的字典列表，每个工具需包含：id, name, category (text/image/video/code/audio), desc, url (官网), logo\_url (网络图片地址), tags。  
* 编写函数 download\_images()：遍历列表，将 logo\_url 的图片下载到本地 assets/logos/{name}.png。如果下载失败，生成一个带首字母颜色的占位图。  
* 编写函数 generate\_js()：将工具列表转换为 JavaScript 对象字符串，并导出为 const aiToolsData \= \[...\]，保存到 js/tools\_data.js。\*\*注意：\*\*生成的 JS 中，logo 字段应指向本地路径 (e.g., 'assets/logos/chatgpt.png')。

**第二步：重构 HTML**

修改 ai\_tools\_dashboard.html：

* 引入生成的 \<script src="js/tools\_data.js"\>\</script\>。  
* 修改卡片渲染逻辑：  
  * 图片：使用 \<img\> 标签显示本地 Logo，不再使用 FontAwesome 图标。  
  * 点击事件：点击卡片时，使用 window.open(tool.url, '\_blank') 在新标签页打开官网。  
  * 增加“直达官网”的显著按钮。

**第三步：执行与测试**

* 运行 python tools\_manager.py 完成资源下载和数据生成。  
* 告诉我如何启动本地服务器查看最终效果。