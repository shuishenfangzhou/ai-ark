#!/bin/bash
# AI方舟 - 1Panel 一键部署脚本
# 用法: bash deploy_to_1panel.sh

set -e

echo "=========================================="
echo "  AI方舟 - 1Panel 一键部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在1Panel环境
check_1panel() {
    if [ -f "/opt/1panel/1panel" ]; then
        echo -e "${GREEN}✅ 检测到 1Panel 环境${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ 未检测到 1Panel，将使用 Docker Compose 部署${NC}"
        return 1
    fi
}

# 步骤1: 检查环境
echo "[1/5] 检查部署环境..."
check_1panel
IS_1PANEL=$?

# 步骤2: 更新代码
echo ""
echo "[2/5] 更新代码..."
if [ -d ".git" ]; then
    git pull origin main
else
    echo -e "${YELLOW}⚠️ 非 Git 仓库，跳过更新${NC}"
fi

# 步骤3: 配置环境变量
echo ""
echo "[3/5] 配置环境变量..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️ 已创建 .env 文件，请编辑配置: nano .env${NC}"
fi

# 步骤4: 构建和启动
echo ""
echo "[4/5] 构建并启动服务..."
if [ $IS_1PANEL -eq 0 ]; then
    # 1Panel 环境使用 docker-compose
    docker-compose down
    docker-compose up -d --build
else
    # 标准 Docker Compose
    docker-compose down
    docker-compose up -d --build
fi

# 步骤5: 验证部署
echo ""
echo "[5/5] 验证部署..."
sleep 5

# 健康检查
HEALTH=$(curl -s http://localhost:8080/health 2>/dev/null || echo "failed")
if [ "$HEALTH" != "failed" ]; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
    echo ""
    echo "访问地址:"
    echo "  - 前端: http://localhost:8080"
    echo "  - API文档: http://localhost:8080/docs"
    echo "  - 健康检查: http://localhost:8080/health"
else
    echo -e "${YELLOW}⚠️ 健康检查失败，请查看日志: docker-compose logs${NC}"
fi

echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
