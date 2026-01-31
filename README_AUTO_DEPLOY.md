# AI方舟 - 全自动部署包

本部署包包含：
1. **网站静态文件** (`dist/`)
2. **Docker 配置文件** (`docker-compose.static.yml`)
3. **Python 自动监控脚本** (`monitor_site.py`)
4. **一键安装脚本** (`setup_server.sh`)

---

## 🚀 如何部署到服务器

### 步骤 1: 上传文件

请将本项目的以下文件/文件夹打包上传到你的阿里云服务器（任意目录，例如 `/root/ai-ark`）：

*   `dist/` (文件夹)
*   `docker/` (文件夹)
*   `docker-compose.static.yml`
*   `monitor_site.py`
*   `setup_server.sh`

**推荐操作**：
1. 在本地全选上述文件，压缩为 `deploy.zip`。
2. 通过 1Panel 的「文件」功能上传到服务器并解压。

### 步骤 2: 执行一键部署

登录服务器终端（SSH），进入解压目录，运行：

```bash
# 赋予执行权限
chmod +x setup_server.sh

# 运行脚本
./setup_server.sh
```

### 步骤 3: 验证

*   **网站访问**：`http://你的服务器IP:8080`
*   **监控状态**：`systemctl status ai-ark-monitor`
*   **查看日志**：`tail -f /var/log/ai-ark-monitor.log`

---

## 🤖 自动化机制说明

*   **网站托管**：使用 Docker 运行 Nginx 容器，轻量级且稳定。
*   **镜像加速**：脚本会自动配置 Docker 国内镜像源，解决 `fetch failed` 问题。
*   **自动监控**：`ai-ark-monitor` 服务会开机自启，每分钟检查一次网站状态。
*   **故障自愈**：如果网站返回非 200 状态码连续 3 次，脚本会自动执行 `docker restart ai-ark-static` 尝试修复。
