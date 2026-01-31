#!/bin/bash

# AI方舟 - 全自动部署与监控脚本
# 适用系统: Ubuntu / CentOS

echo "🚀 开始自动部署 AI方舟 (静态版)..."

# 1. 检查目录
if [ ! -d "dist" ]; then
    echo "❌ 错误: 未找到 dist 目录。请确保上传了完整的文件包。"
    exit 1
fi

# 2. 配置 Docker 镜像加速 (解决国内拉取失败问题)
echo "⚙️  配置 Docker 镜像加速..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://huecker.io",
    "https://dockerhub.timeweb.cloud",
    "https://noohub.ru"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker
echo "✅ Docker 镜像源已更新"

# 3. 启动 Nginx 容器
echo "📦 启动 Nginx 容器..."
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.static.yml up -d
else
    docker compose -f docker-compose.static.yml up -d
fi

if [ $? -eq 0 ]; then
    echo "✅ 网站容器已启动 (端口 8080)"
else
    echo "❌ 容器启动失败"
    exit 1
fi

# 4. 安装 Python 依赖
echo "🐍 安装监控脚本依赖..."
if command -v apt &> /dev/null; then
    apt update && apt install -y python3-pip python3-requests
elif command -v yum &> /dev/null; then
    yum install -y python3-pip
    pip3 install requests
else
    # 尝试直接 pip
    pip3 install requests
fi

# 5. 配置 Systemd 自动监控服务
echo "🤖 配置自动监控服务 (Systemd)..."
SERVICE_PATH="/etc/systemd/system/ai-ark-monitor.service"
CURRENT_DIR=$(pwd)

cat > $SERVICE_PATH <<EOF
[Unit]
Description=AI Ark Website Monitor
After=docker.service network.target
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=$CURRENT_DIR
ExecStart=/usr/bin/python3 $CURRENT_DIR/monitor_site.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ai-ark-monitor
systemctl start ai-ark-monitor

echo "✅ 监控服务已启动！"
echo "---------------------------------------------"
echo "🎉 部署完成！"
echo "🌐 网站访问地址: http://服务器IP:8080"
echo "📊 监控日志路径: /var/log/ai-ark-monitor.log"
echo "---------------------------------------------"
