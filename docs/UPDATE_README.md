# AI方舟 - 数据自动更新指南

## 📋 目录

- [简介](#简介)
- [快速开始](#快速开始)
- [脚本说明](#脚本说明)
- [使用方法](#使用方法)
- [定时任务](#定时任务-windows-任务计划程序)
- [故障排除](#故障排除)
- [文件说明](#文件说明)

---

## 简介

本项目提供两个自动化数据更新脚本：

1. **`update_data.bat`** - 基础版
2. **`update_data_enhanced.bat`** - 增强版（推荐）

---

## 快速开始

### 方式一：双击运行

1. 双击 `update_data_enhanced.bat`
2. 等待脚本执行完成
3. 查看日志：`logs/update_YYYY-MM-DD.log`

### 方式二：命令行运行

```cmd
cd D:\AI工具箱
update_data_enhanced.bat
```

---

## 脚本说明

### 基础版 `update_data.bat`

```cmd
update_data.bat
```

**特性：**
- ✅ 7 个步骤自动执行
- ✅ 日志记录到 `logs/` 目录
- ⚠️ 无确认提示

### 增强版 `update_data_enhanced.bat` ⭐推荐

```cmd
update_data_enhanced.bat
```

**特性：**
- ✅ 彩色界面输出
- ✅ 详细进度显示
- ✅ 错误恢复机制
- ✅ 自动打开日志（可选）

---

## 使用方法

### 首次使用

1. **确保 Git 已配置**
   ```cmd
   git config user.email "your@email.com"
   git config user.name "Your Name"
   ```

2. **确保有远程仓库**
   ```cmd
   git remote add origin https://github.com/your-username/ai-ark.git
   ```

3. **首次推送代码**
   ```cmd
   git push -u origin main
   ```

### 日常更新

1. **手动运行**（推荐）
   - 双击 `update_data_enhanced.bat`
   - 或在终端执行 `update_data_enhanced.bat`

2. **等待完成**
   - 脚本会自动：抓取数据 → 合并 → 提交 → 推送

3. **验证更新**
   - 1Panel 会自动拉取最新代码
   - 访问网站确认数据已更新

---

## 定时任务 (Windows 任务计划程序)

### 设置每日自动运行

1. **打开任务计划程序**
   - 按 `Win + R`
   - 输入 `taskschd.msc`
   - 回车

2. **创建基本任务**
   - 点击「操作」→「创建基本任务」
   - 名称：`AI方舟-每日更新`
   - 触发：每天（设置时间，如 08:00）

3. **设置操作**
   - 操作：「启动程序」
   - 程序：`D:\AI工具箱\update_data_enhanced.bat`
   - 起始于：`D:\AI工具箱`

4. **完成设置**
   - 点击「确定」
   - 输入密码确认

### 验证任务

1. 在任务列表中找到「AI方舟-每日更新」
2. 右键 → 「运行」
3. 检查 `logs/` 目录是否有新日志

---

## 故障排除

### 问题 1：Python 未找到

```
❌ 错误: Python 未找到
```

**解决方案：**
```cmd
# 检查 Python 是否安装
python --version

# 如果未安装，从 https://python.org 下载安装
# 安装时勾选 "Add Python to PATH"
```

### 问题 2：Git 未配置

```
❌ 错误: git config 未设置
```

**解决方案：**
```cmd
git config user.email "your@email.com"
git config user.name "Your Name"
```

### 问题 3：GitHub 抓取失败

```
⚠️ GitHub 抓取部分失败（可能网络问题）
```

**原因：**
- 网络连接问题
- GitHub API 限制

**解决方案：**
- 脚本会自动继续，不会中断
- 稍后重试即可

### 问题 4：无更新内容

```
⚠️ 没有需要更新的内容
```

**原因：**
- 数据没有变化
- GitHub 抓取失败

**解决方案：**
- 这是正常情况
- 脚本会跳过提交步骤

### 问题 5：推送失败

```
❌ Git push 失败
```

**原因：**
- 远程仓库有更新
- 权限问题

**解决方案：**
```cmd
# 手动拉取并解决冲突
git pull origin main
git push origin main
```

---

## 文件说明

```
AI工具箱/
├── update_data.bat              # 基础版更新脚本
├── update_data_enhanced.bat     # 增强版更新脚本（推荐）
├── scraper/
│   ├── github_scraper_en.py     # GitHub 数据抓取
│   └── merge_data.py            # 数据合并
├── dist/
│   └── toolsData.json           # 前端数据（自动更新）
├── public/
│   └── toolsData.json           # 同步副本
└── logs/                        # 日志目录
    └── update_YYYY-MM-DD.log    # 每日日志
```

---

## 日志格式

日志文件位置：`logs/update_YYYY-MM-DD.log`

```log
========================================
[AI方舟] 数据自动更新脚本
[时间] 2026-01-31 08:00:00
[工作目录] D:\AI工具箱
========================================

[1/7] 检查 Python 环境
  ✅ Python 环境检查通过
[2/7] 切换到项目目录
  ✅ 已切换到: D:\AI工具箱
...
[完成] 脚本执行成功
```

---

## 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                    每日数据更新流程                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Git pull            ← 拉取远程最新代码                  │
│       ↓                                                     │
│  2. GitHub Scraper      ← 抓取 Trending 项目                │
│       ↓                                                     │
│  3. Merge Data          ← 合并 ai-bot + GitHub             │
│       ↓                                                     │
│  4. Git add + commit    ← 提交变更                         │
│       ↓                                                     │
│  5. Git push            ← 推送到远程仓库                    │
│       ↓                                                     │
│  6. 1Panel 拉取         ← 服务器自动更新                   │
│       ↓                                                     │
│  7. 网站数据更新        ← 用户看到最新数据                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 最佳实践

1. **定时任务时间设置**
   - 建议设置在网站访问低峰期（如凌晨 3:00）
   - 避开 GitHub API 限流时段

2. **监控日志**
   - 每日检查 `logs/` 目录
   - 关注是否有错误

3. **定期手动检查**
   - 每周手动运行一次脚本
   - 验证数据质量

4. **备份重要数据**
   - 定期备份 `dist/toolsData.json`
   - 可使用 Git 版本控制

---

## 联系与支持

如有问题，请：
1. 查看日志文件
2. 检查常见问题
3. 联系项目维护者

---

**最后更新：2026-01-31**
