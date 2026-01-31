# Docker 静态页面部署到 1Panel

## TL;DR

> **快速摘要**: 将 dist 文件夹中的静态网站通过 Docker 容器化部署到 1Panel 管理的阿里云服务器，配置 nginx 反向代理、Let's Encrypt 免费 SSL 证书、HTTP 到 HTTPS 强制跳转，并启用自动备份功能。
> 
> **交付物**:
> - Dockerfile 和 nginx 配置文件
> - Docker Compose 部署配置
> - 1Panel 网站配置（含 SSL 证书）
> - 自动备份策略
> 
> **估计工作量**: Short（1-2 小时）
> **并行执行**: YES - 本地准备与服务器配置可并行
> **关键路径**: 本地准备文件 → 上传到服务器 → 1Panel 部署容器 → 配置 SSL → 验证

---

## Context

### 原始需求
用户希望将前端构建产物（dist 文件夹）部署到使用 1Panel 管理的阿里云服务器上。采用 Docker 容器化部署方式，需要配置 SSL 证书（自动申请 Let's Encrypt）、启用 HTTPS 跳转，并设置备份策略。

### 访谈总结
**关键讨论**:
- **项目类型**: 纯静态页面（HTML/CSS/JS），无服务端渲染
- **部署方式**: Docker Compose，使用 nginx:alpine 镜像（体积小、安全）
- **服务器环境**: 1Panel 已安装 Docker，域名已解析到服务器 IP
- **SSL 要求**: 自动申请 Let's Encrypt 证书，启用自动续期
- **安全配置**: HTTP 到 HTTPS 强制跳转
- **备份需求**: 启用 1Panel 网站备份功能
- **验证方式**: 浏览器手动访问 + 命令行 curl 验证

**用户偏好**:
- Docker 环境: ✅ 已安装
- 上传方式: 1Panel 文件管理上传
- SSL 证书: 自动申请（Let's Encrypt）

### 研究发现（来自官方文档）

**Docker + Nginx 最佳实践**:
- 使用 `nginx:alpine` 基础镜像（5MB vs 135MB），减少攻击面
- 多阶段构建分离构建和运行环境（虽然本项目无需构建）
- 使用只读挂载（`:ro`）增强安全性
- 配置 gzip 压缩可减少 60-70% 传输数据量

**1Panel 部署特性**:
- 支持 Docker Compose 通过容器管理界面部署
- ACME 集成支持自动申请和续期 SSL 证书
- 内置网站备份功能，支持定时自动备份
- 支持 HTTPS 跳转和 HSTS 安全增强

**Nginx 静态站点配置要点**:
- SPA 路由支持: `try_files $uri $uri/ /index.html;`
- 静态资源缓存: `expires max;` + `Cache-Control: public, immutable`
- 安全响应头: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- Gzip 压缩: `gzip_types` 包含所有常用资源类型

---

## Work Objectives

### 核心目标
在 1Panel 管理的阿里云服务器上，通过 Docker 容器化方式部署静态网站，实现 HTTPS 安全访问，并建立自动备份机制。

### 具体交付物
1. 完整的 Dockerfile（基于 nginx:alpine）
2. nginx.conf 配置文件（包含 SPA 路由、压缩、缓存、安全头）
3. docker-compose.yml 文件（容器编排配置）
4. SSL 证书自动申请和配置
5. 1Panel 网站备份策略

### 完成定义
- [ ] 浏览器访问 `https://your-domain.com` 正常显示网站内容
- [ ] HTTP 访问自动跳转到 HTTPS
- [ ] `curl -I https://your-domain.com` 返回 HTTP 200
- [ ] SSL 证书状态显示"已部署"且有效期 > 80 天
- [ ] 1Panel 备份配置显示"已启用"

### Must Have
- Dockerfile 和 nginx 配置文件
- Docker Compose 部署配置
- SSL 证书自动申请（Let's Encrypt）
- HTTP 到 HTTPS 跳转
- 网站备份配置

### Must NOT Have（防护栏）
- 不修改服务器的系统配置（仅操作 Docker 和 1Panel）
- 不涉及域名解析配置（用户已自行完成）
- 不使用付费 SSL 证书（使用免费 Let's Encrypt）
- 不配置额外的后端服务（纯静态站点）

---

## Verification Strategy（验证策略）

> 由于这是部署任务而非开发任务，采用**手动验证 + 命令行验证**双重确认机制。

### 验证流程

**阶段 1: 容器部署验证**
- 检查 Docker 容器状态: `docker ps | grep static-site`
- 验证容器日志无错误: `docker logs static-site`

**阶段 2: HTTP 服务验证**
- 本地测试: `curl -I http://localhost:80`
- 预期结果: HTTP 200，Server: nginx

**阶段 3: HTTPS 证书验证**
- 浏览器访问: `https://your-domain.com`
- 检查证书: 浏览器地址栏锁图标 → 证书有效
- 命令行检查: `curl -I https://your-domain.com`
- 预期结果: HTTP 200，SSL 证书有效

**阶段 4: HTTPS 跳转验证**
- 测试跳转: `curl -I http://your-domain.com`
- 预期结果: HTTP 301 或 302，跳转到 HTTPS

**阶段 5: 功能性验证**
- 页面加载成功，无 404 错误
- 静态资源（CSS/JS/图片）正常加载
- 浏览器开发者工具无 JavaScript 错误

### 验证命令汇总
```bash
# 1. 检查容器状态
docker ps --filter "name=static-site" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 2. 检查容器日志
docker logs --tail 20 static-site

# 3. 本地 HTTP 测试
curl -I http://localhost:80

# 4. 远程 HTTPS 测试
curl -I https://your-domain.com

# 5. HTTPS 跳转测试
curl -I http://your-domain.com -L | grep -E "HTTP|Location"

# 6. 检查 SSL 证书信息
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 证据捕获
- [ ] 容器状态截图（docker ps 输出）
- [ ] 浏览器访问截图（显示网站正常加载）
- [ ] 证书信息截图（浏览器锁图标和有效期）
- [ ] curl 命令输出（HTTP 状态码和响应头）

---

## Execution Strategy

### 并行执行 waves

```
Wave 1 (本地准备，可立即开始):
├── Task 1: 创建 Dockerfile 和 nginx 配置
└── Task 2: 创建 docker-compose.yml

Wave 2 (服务器配置，在 Wave 1 完成后):
├── Task 3: 上传文件到服务器
├── Task 4: 在 1Panel 部署 Docker 容器
├── Task 5: 配置 SSL 证书
└── Task 6: 配置备份策略

Wave 3 (最终验证):
└── Task 7: 验证部署结果
```

### 依赖矩阵

| 任务 | 依赖项 | 阻塞 | 可并行任务 |
|------|--------|------|-----------|
| 1 | 无 | 2, 3 | 无（前置步骤） |
| 2 | 1 | 4 | 无（依赖 Task 1） |
| 3 | 2 | 4 | 无（依赖 Task 2） |
| 4 | 3 | 5, 6, 7 | 无（依赖 Task 3） |
| 5 | 4 | 7 | 6（两者都依赖 Task 4） |
| 6 | 4 | 7 | 5（两者都依赖 Task 4） |
| 7 | 4, 5, 6 | 无 | 终验任务 |

### 代理调度总结

| Wave | 任务 | 推荐代理配置 |
|------|------|-------------|
| 1 | 1, 2 | 无需代理（手动创建配置文件） |
| 2 | 3, 4, 5, 6 | delegate_task（Docker 部署操作） |
| 3 | 7 | delegate_task（验证测试） |

---

## TODOs

- [ ] 1. 创建 Dockerfile 和 nginx.conf 配置文件

  **What to do**:
  - 创建 Dockerfile：基于 nginx:alpine，复制静态文件
  - 创建 nginx.conf：SPA 路由支持、gzip 压缩、缓存策略、安全响应头
  - 创建 .dockerignore：排除不必要的文件

  **Must NOT do**:
  - 不要使用 latest 标签（指定具体版本）
  - 不要在 Dockerfile 中包含敏感信息

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 配置文件创建是简单直接的任务
  - **Skills**: None required
    - 这是标准模板的创建任务，不需要特殊技能
  - **Skills Evaluated but Omitted**:
    - docker-ai: 模板已从 research 获取，无需额外查找

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential（Task 1 和 Task 2 顺序执行）
  - **Blocks**: Task 3, 4（依赖配置文件）
  - **Blocked By**: None（可立即开始）

  **References** (CRITICAL):

  **Pattern References**:
  - `nginx:alpine` 官方镜像：Docker Hub 官方 nginx 镜像文档
  - 多阶段构建模式：Docker 最佳实践指南

  **API/Type References**:
  - nginx.conf 语法：nginx.org/en/docs/
  - nginx 核心模块：ngx_http_core_module

  **Test References**:
  - Docker 构建测试：`docker build -t static-site .`
  - 本地运行测试：`docker run -p 80:80 static-site`

  **Documentation References**:
  - 1Panel Docker 部署：docs.1panel.pro/user_manual/containers/composes/
  - nginx 配置最佳实践：github.com/nginx/nginx/blob/master/conf/nginx.conf

  **WHY Each Reference Matters**:
  - Docker Hub 官方镜像提供标准的基础配置和最佳实践
  - nginx 官方文档确保配置语法正确且符合标准
  - 1Panel 文档指导如何在面板中正确部署 Docker 容器

  **Acceptance Criteria**:

  **文件创建验证**:
  - [ ] Dockerfile 存在且包含 FROM nginx:alpine
  - [ ] nginx.conf 存在且包含 server 块
  - [ ] .dockerignore 存在且排除 .git, node_modules 等

  **配置内容验证**:
  - [ ] nginx.conf 包含 `try_files $uri $uri/ /index.html;`
  - [ ] nginx.conf 包含 gzip 配置（gzip on;）
  - [ ] nginx.conf 包含安全头（X-Frame-Options 等）

  **本地构建测试**:
  - [ ] `docker build -t static-site .` → 构建成功
  - [ ] `docker run -d -p 8080:80 static-site` → 容器运行
  - [ ] `curl http://localhost:8080` → 返回 HTML 内容

  **Commit**: NO（本地配置文件，无需提交）

  ---

- [ ] 2. 创建 docker-compose.yml 编排文件

  **What to do**:
  - 定义 nginx 服务配置
  - 配置端口映射（80:80, 443:443）
  - 配置数据卷挂载（静态文件、配置、证书）
  - 设置容器重启策略

  **Must NOT do**:
  - 不要硬编码敏感信息（使用环境变量或挂载文件）
  - 不要使用不安全的端口暴露方式

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 标准 docker-compose 模板创建
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - docker-ai: 模板已从 research 获取

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential（依赖 Task 1）
  - **Blocks**: Task 3, 4
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - Docker Compose v3 规范：docs.docker.com/compose/compose-file/
  - 1Panel Compose 模板：docs.1panel.pro/user_manual/containers/composes/

  **Documentation References**:
  - 1Panel Docker Compose 部署：docs.1panel.pro/user_manual/containers/composes/

  **Acceptance Criteria**:

  **文件验证**:
  - [ ] docker-compose.yml 存在且格式正确
  - [ ] `docker-compose config` → 验证通过（无语法错误）

  **配置验证**:
  - [ ] 包含 image: nginx:alpine
  - [ ] 包含 ports: "80:80" 映射
  - [ ] 包含 volumes 挂载配置
  - [ ] 包含 restart: unless-stopped 策略

  **Commit**: NO

  ---

- [ ] 3. 通过 1Panel 文件管理上传文件到服务器

  **What to do**:
  - 通过 1Panel 文件管理器连接到服务器
  - 创建目标目录（如 /www/wwwroot/static-site）
  - 上传 dist 文件夹内容
  - 上传 Dockerfile、nginx.conf、docker-compose.yml

  **Must NOT do**:
  - 不要上传到错误的目录
  - 不要覆盖现有重要文件

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 文件上传是简单操作
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential（依赖 Task 2）
  - **Blocks**: Task 4
  - **Blocked By**: Task 2

  **References**:

  **Path References**:
  - 1Panel 默认网站目录：/www/wwwroot/
  - Docker Compose 项目目录：/www/wwwroot/static-site/

  **Acceptance Criteria**:

  **目录结构验证**:
  - [ ] /www/wwwroot/static-site/ 目录存在
  - [ ] /www/wwwroot/static-site/dist/ 包含所有静态文件
  - [ ] /www/wwwroot/static-site/Dockerfile 存在
  - [ ] /www/wwwroot/static-site/nginx.conf 存在
  - [ ] /www/wwwroot/static-site/docker-compose.yml 存在

  **文件内容验证**:
  - [ ] Dockerfile 可正常读取
  - [ ] nginx.conf 可正常读取
  - [ ] docker-compose.yml 可正常读取

  **Commit**: NO

  ---

- [ ] 4. 在 1Panel 中部署 Docker 容器

  **What to do**:
  - 打开 1Panel → 容器 → Composes
  - 点击"创建" → 选择"编辑"模式
  - 粘贴 docker-compose.yml 内容
  - 点击确认部署容器
  - 等待容器启动完成

  **Must NOT do**:
  - 不要选择错误的网络模式
  - 不要暴露不必要的端口

  **Recommended Agent Profile**:
  - **Category**: unspecified-low
    - Reason: 1Panel 界面操作，复杂度低
  - **Skills**: ["docker-ai"]
    - docker-ai: 理解 Docker Compose 配置和容器管理

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential（依赖 Task 3）
  - **Blocks**: Task 5, 6, 7
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - 1Panel Compose 管理：docs.1panel.pro/user_manual/containers/composes/
  - Docker 容器状态管理：docs.docker.com/engine/reference/commandline/ps/

  **Acceptance Criteria**:

  **容器状态验证**:
  - [ ] 1Panel 容器列表显示 static-site 容器
  - [ ] 容器状态显示"运行中"
  - [ ] 容器重启策略为"unless-stopped"

  **端口验证**:
  - [ ] 80 端口已映射
  - [ ] 443 端口已映射（如配置了 SSL）

  **日志验证**:
  - [ ] 容器日志无 ERROR 级别错误
  - [ ] nginx 正常启动（日志显示 "started"）

  **Commit**: NO

  ---

- [ ] 5. 在 1Panel 中配置 SSL 证书（Let's Encrypt 自动申请）

  **What to do**:
  - 打开 1Panel → 网站 → 选择静态站点 → SSL 证书
  - 点击"申请证书"
  - 填写域名信息（主域名 + 其他域名）
  - 选择 DNS 提供商（阿里云 DNS）
  - 配置 DNS API 密钥
  - 启用自动续期
  - 确认申请并等待验证完成

  **Must NOT do**:
  - 不要使用不安全的验证方式
  - 不要禁用自动续期

  **Recommended Agent Profile**:
  - **Category**: unspecified-low
    - Reason: 1Panel 界面操作，流程标准化
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Task 5 和 Task 6 可并行（都依赖 Task 4）
  - **Blocks**: Task 7
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - ACME 证书申请：docs.1panel.pro/user_manual/websites/certificate_request/
  - DNS 验证方式：docs.1panel.pro/user_manual/websites/certificate_request/

  **Acceptance Criteria**:

  **证书状态验证**:
  - [ ] 证书状态显示"已签发"
  - [ ] 证书有效期 > 80 天
  - [ ] 自动续期已启用

  **证书部署验证**:
  - [ ] 证书已应用到网站配置
  - [ ] HTTPS 可正常访问

  **DNS 验证**:
  - [ ] DNS TXT 记录已自动添加（如使用 DNS 验证）
  - [ ] 验证通过后 DNS 记录保留

  **Commit**: NO

  ---

- [ ] 6. 配置网站备份策略

  **What to do**:
  - 打开 1Panel → 网站 → 选择静态站点
  - 进入"备份"配置
  - 启用自动备份
  - 选择备份频率（建议每日或每周）
  - 选择备份存储位置（本地/云存储）
  - 设置保留策略（最近 N 个备份）

  **Must NOT do**:
  - 不要选择过长的备份保留周期（浪费空间）
  - 不要忽略备份存储位置的选择

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 1Panel 备份配置是简单设置
  - **Skills**: None required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Task 5 和 Task 6 可并行
  - **Blocks**: Task 7
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - 网站备份功能：docs.1panel.pro/user_manual/websites/website_backup/

  **Acceptance Criteria**:

  **备份配置验证**:
  - [ ] 自动备份已启用
  - [ ] 备份频率已设置
  - [ ] 备份存储位置已指定
  - [ ] 保留策略已配置

  **备份测试验证**:
  - [ ] 手动触发一次备份测试
  - [ ] 备份文件存在于指定位置
  - [ ] 备份文件大小合理（非空）

  **Commit**: NO

  ---

- [ ] 7. 验证部署结果（浏览器 + 命令行双重验证）

  **What to do**:
  - 浏览器访问网站，验证页面正常加载
  - 浏览器检查 SSL 证书信息
  - 使用 curl 验证 HTTP 和 HTTPS 响应
  - 验证 HTTPS 跳转功能
  - 检查静态资源加载情况
  - 截图保存验证结果

  **Must NOT do**:
  - 不要仅依赖单一验证方式
  - 不要跳过任何验证步骤

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 验证任务简单直接
  - **Skills**: ["webapp-testing"]
    - webapp-testing: 浏览器验证和截图

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential（最终验证步骤）
  - **Blocks**: None（最后一步）
  - **Blocked By**: Task 4, 5, 6

  **References**:

  **Pattern References**:
  - SSL 证书验证：浏览器地址栏锁图标
  - HTTP 响应验证：curl 命令
  - 网站功能验证：浏览器开发者工具

  **Acceptance Criteria**:

  **浏览器验证**:
  - [ ] 访问 https://your-domain.com → 页面正常显示
  - [ ] 地址栏显示锁图标（HTTPS 有效）
  - [ ] 点击锁图标 → 证书有效（有效期 > 80 天）
  - [ ] 无 404 错误（所有资源加载正常）

  **命令行验证**:
  - [ ] `curl -I https://your-domain.com` → HTTP 200
  - [ ] `curl -I http://your-domain.com` → HTTP 301/302（跳转）
  - [ ] `curl -I https://your-domain.com` → 包含安全响应头

  **安全验证**:
  - [ ] HTTP 跳转正常（访问 HTTP 自动跳转到 HTTPS）
  - [ ] SSL 证书有效（未过期）
  - [ ] HSTS 头存在（如已启用）

  **功能验证**:
  - [ ] 所有页面链接可正常访问
  - [ ] /JS/图片静态资源（CSS）加载成功
  - [ ] 无 JavaScript 错误

  **证据捕获**:
  - [ ] 浏览器截图（网站首页）
  - [ ] 浏览器截图（SSL 证书信息）
  - [ ] curl 命令输出截图

  **Commit**: NO

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| N/A | 部署任务无需代码提交 | N/A | N/A |

---

## Success Criteria

### 验证命令
```bash
# 检查容器状态
docker ps --filter "name=static-site" --format "table {{.Names}}\t{{.Status}}"

# 测试 HTTPS 访问
curl -I https://your-domain.com
# 预期: HTTP 200，SSL 证书有效

# 测试 HTTP 跳转
curl -I http://your-domain.com -L | grep -E "HTTP|Location"
# 预期: HTTP 301/302，跳转到 HTTPS

# 检查 SSL 证书有效期
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
# 预期: NotAfter: 未来日期（> 80 天）
```

### 最终检查清单
- [ ] 所有"Must Have"已实现
- [ ] 所有"Must NOT Have"已避免
- [ ] 网站可通过 HTTPS 正常访问
- [ ] HTTP 自动跳转到 HTTPS
- [ ] SSL 证书已自动申请并部署
- [ ] 自动备份已配置
- [ ] 所有验证命令返回预期结果
- [ ] 验证截图已保存
