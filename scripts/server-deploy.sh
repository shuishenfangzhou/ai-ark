#!/bin/bash
#
# AI方舟 - 1Panel 服务器一键部署脚本
# 用法: bash <(curl -sL https://raw.githubusercontent.com/your-repo/main/deploy.sh) install
#

set -e

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
PROJECT_NAME="AI方舟"
PROJECT_DIR="/var/www/ai-ark"
DEEPSEEK_API_KEY="sk-abf3975bd37a4e18b06959c0a91d9099"
GITHUB_REPO="https://github.com/your-username/ai-ark.git"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查 Docker
check_docker() {
    log_info "检查 Docker 环境..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装"
        exit 1
    fi
    if ! docker info &> /dev/null; then
        log_error "Docker 服务未运行"
        exit 1
    fi
    log_info "Docker 检查通过 ✓"
}

# 安装项目
install_project() {
    log_info "开始安装 ${PROJECT_NAME}..."
    
    # 创建目录
    mkdir -p ${PROJECT_DIR}
    cd ${PROJECT_DIR}
    
    # 方式选择
    if command -v git &> /dev/null; then
        log_info "从 Git 安装..."
        if [ -d ".git" ]; then
            git pull
        else
            git clone ${GITHUB_REPO} .
        fi
    else
        log_info "下载部署包..."
        curl -L https://github.com/your-username/ai-ark/archive/main.tar.gz -o /tmp/ai-ark.tar.gz
        tar -xzf /tmp/ai-ark.tar.gz
        mv ai-ark-main/* .
        rm -rf ai-ark-main
    fi
    
    # 创建环境变量
    cat > .env << EOF
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
LOG_LEVEL=INFO
EOF
    chmod 600 .env
    
    log_info "项目安装完成 ✓"
}

# 构建镜像
build_images() {
    log_info "构建 Docker 镜像..."
    cd ${PROJECT_DIR}
    
    # 后端
    log_info "构建后端镜像..."
    docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend
    
    # 前端
    log_info "构建前端镜像..."
    docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./
    
    log_info "镜像构建完成 ✓"
}

# 启动服务
start_service() {
    log_info "启动服务..."
    cd ${PROJECT_DIR}
    
    docker-compose -f docker-compose.1panel.yml down 2>/dev/null || true
    docker-compose -f docker-compose.1panel.yml up -d
    
    log_info "服务启动中..."
    sleep 10
    
    log_info "服务启动完成 ✓"
}

# 验证
verify() {
    log_info "验证部署..."
    
    echo ""
    echo "容器状态:"
    docker ps --filter "name=ai-ark" --format "table {{.Names}}\t{{.Status}}"
    
    echo ""
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        log_info "后端 API 健康检查通过 ✓"
        curl -s http://localhost:8000/health | head -c 100
        echo ""
    else
        log_warn "后端 API 检查失败，请查看日志: docker logs ai-ark-backend"
    fi
}

# 显示信息
show_info() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  ${PROJECT_NAME} 部署完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "访问地址: http://your-server-ip"
    echo "API 健康: http://your-server-ip:8000/health"
    echo ""
    echo "管理命令:"
    echo "  重启: cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml restart"
    echo "  停止: cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml down"
    echo "  日志: docker logs -f ai-ark-backend"
    echo ""
}

# 一键安装
one_click() {
    check_docker
    install_project
    build_images
    start_service
    verify
    show_info
}

# 主入口
case "${1:-one-click}" in
    install)
        install_project
        ;;
    build)
        build_images
        ;;
    start)
        start_service
        ;;
    restart)
        cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml restart
        ;;
    stop)
        cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml down
        ;;
    logs)
        docker logs -f ${2:-ai-ark-backend}
        ;;
    verify)
        verify
        ;;
    one-click|"")

    one_click
        ;;
    *)
        echo "用法: $0 {install|build|start|restart|stop|logs|verify|one-click}"
        ;;
esac
