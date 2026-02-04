# AI方舟部署计划

## 当前状态

### 已完成工作
- 网站源码开发完成
- 数据抓取：1188个AI工具
- Logo覆盖率：31.1%（370个有logo）

### 部署目标
- GitHub仓库更新代码
- 1Panel一键部署到阿里云服务器

---

## 部署步骤

### 第一步：GitHub仓库更新

```bash
# 1. 初始化Git（如果未初始化）
git init
git add .
git commit -m "feat: 更新AI工具数据，logo覆盖率31.1%"

# 2. 关联GitHub仓库（如果未关联）
git remote add origin https://github.com/你的用户名/ai-ark.git

# 3. 推送到GitHub
git push -u origin main
```

**需要确认**：你的GitHub仓库地址是什么？

---

### 第二步：1Panel部署配置

#### 2.1 创建网站
1. 登录1Panel: `http://120.26.254.53:26226`
2. 进入 **网站** → **创建网站**
3. 填写信息：
   - 域名：`aiark.cn`（或你的域名）
   - 根目录：`/www/wwwroot/ai-ark`
   - PHP版本：不需要（静态站点）
   - 伪静态：不需要

#### 2.2 部署方式选择
**方式A：Git一键部署（推荐）**
1. 在1Panel网站设置中开启 **Git同步**
2. 配置：
   - 仓库地址：`https://github.com/你的用户名/ai-ark.git`
   - 部署目录：`/www/wwwroot/ai-ark`
   - 构建命令：`npm run build`
   - 静态文件目录：`dist`
3. 开启 **自动同步**，每次push自动部署

**方式B：手动上传**
1. 本地运行 `npm run build`
2. 上传 `dist` 文件夹内容到 `/www/wwwroot/ai-ark`

---

### 第三步：OpenResty配置

#### 3.1 静态文件服务
1Panel会自动配置，但确认：
- 网站根目录指向：`/www/wwwroot/ai-ark`
- 默认文档：`index.html`

#### 3.2 伪静态规则（可选）
如果需要URL重写，添加规则：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

### 第四步：域名与SSL

#### 4.1 域名解析
在阿里云域名控制台添加记录：
- 记录类型：`A`
- 主机记录：`@` 或 `www`
- 记录值：`120.26.254.53`

#### 4.2 SSL证书
1Panel → 网站 → SSL → 申请Let's Encrypt证书

---

### 验证步骤

1. **本地验证**：
   ```bash
   npm run preview
   # 访问 http://localhost:4321
   ```

2. **服务器验证**：
   - 访问 `http://120.26.254.26/ai-ark/` 或你的域名
   - 检查工具列表是否正常显示
   - 测试搜索功能
   - 测试分类筛选

---

## GitHub Actions自动部署（可选）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to 1Panel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          source: "dist/*"
          target: /www/wwwroot/ai-ark
      
      - name: SSH Restart OpenResty
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /www/wwwroot/ai-ark
            # 确保文件权限正确
            chown -R www:www /www/wwwroot/ai-ark
            # 重载OpenResty（如果需要）
            systemctl reload openresty
```

需要在GitHub仓库 Settings → Secrets中添加：
- `HOST`: 服务器IP
- `USERNAME`: SSH用户名（如www）
- `KEY`: SSH私钥

---

## 快速命令清单

```bash
# 1. 本地构建
npm run build

# 2. 推送到GitHub
git add .
git commit -m "feat: 更新内容"
git push origin main

# 3. 如果用Git同步，1Panel会自动部署

# 4. 手动上传（如果不使用Git同步）
# - 用FileZilla或WinSCP上传 dist/* 到 /www/wwwroot/ai-ark
```

---

## 确认事项

在开始部署前，请确认：

- [ ] GitHub仓库地址
- [ ] 域名（如果有）
- [ ] 是否需要开启Git自动同步
- [ ] 服务器SSH访问方式（密码还是密钥）

告诉我这些信息，我帮你完成部署！
