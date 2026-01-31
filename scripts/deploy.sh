#!/bin/bash
#
# AI方舟 - 1Panel 一键部署脚本
# 用法: chmod +x deploy.sh && ./deploy.sh
#

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="AI方舟"
PROJECT_DIR="/var/www/ai-ark"
BACKUP_DIR="/backup/ai-ark"
DEEPSEEK_API_KEY="sk-abf3975bd37a4e18b06959c0a91d9099"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  ${PROJECT_NAME} - 1Panel 一键部署脚本${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# 函数定义
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 root 权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        echo "请使用: sudo $0"
        exit 1
    fi
}

# 检查 Docker
check_docker() {
    log_info "检查 Docker 环境..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker 服务未运行，请启动 Docker"
        exit 1
    fi
    
    log_info "Docker 环境检查通过 ✓"
}

# 创建目录结构
create_directories() {
    log_info "创建目录结构..."
    
    mkdir -p ${PROJECT_DIR}
    mkdir -p ${BACKUP_DIR}
    mkdir -p ${PROJECT_DIR}/public
    mkdir -p ${PROJECT_DIR}/backend
    mkdir -p ${PROJECT_DIR}/docker
    
    log_info "目录创建完成 ✓"
}

# 备份现有部署
backup_existing() {
    if [ -d "${PROJECT_DIR}/docker-compose.yml" ]; then
        log_info "备份现有部署..."
        
        BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
        BACKUP_FILE="${BACKUP_DIR}/backup_${BACKUP_DATE}.tar.gz"
        
        tar -czf ${BACKUP_FILE} -C ${PROJECT_DIR} .
        
        log_info "备份已保存到: ${BACKUP_FILE} ✓"
    fi
}

# 上传文件（检测是否在本地运行）
upload_files() {
    log_info "准备部署文件..."
    
    # 检查当前目录是否有部署包
    if [ -f "docker-compose.yml" ]; then
        log_info "检测到本地部署文件，准备复制到服务器..."
        
        # 复制当前目录所有必要文件到项目目录
        cp docker-compose.yml ${PROJECT_DIR}/
        cp docker-compose.1panel.yml ${PROJECT_DIR}/ 2>/dev/null || true
        cp -r backend/ ${PROJECT_DIR}/
        cp -r docker/ ${PROJECT_DIR}/
        cp -r public/ ${PROJECT_DIR}/
        cp -r dist/ ${PROJECT_DIR}/
        cp .env.example ${PROJECT_DIR}/
        
        log_info "文件已复制到 ${PROJECT_DIR} ✓"
    else
        log_warn "未检测到本地部署文件，请确保已上传项目文件到 ${PROJECT_DIR}"
    fi
}

# 创建 .env 文件
create_env() {
    log_info "配置环境变量..."
    
    ENV_FILE="${PROJECT_DIR}/.env"
    
    if [ -f "${ENV_FILE}" ]; then
        log_info "环境变量文件已存在，跳过创建"
    else
        cat > ${ENV_FILE} << EOF
# AI方舟 - 环境变量配置
# DeepSeek API 版本 (2026-01-31)

# DeepSeek API Key
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}

# 应用配置
APP_NAME=AI方舟 API
APP_VERSION=1.0.0
LOG_LEVEL=INFO

# 服务器配置
HOST=0.0.0.0
PORT=8000

# CORS 配置 (生产环境应限制域名)
CORS_ORIGINS=["*"]

# DeepSeek 模型配置
DEEPSEEK_EMBEDDING_MODEL=deepseek-embed
DEEPSEEK_CHAT_MODEL=deepseek-chat
EOF
        
        chmod 600 ${ENV_FILE}
        log_info "环境变量文件已创建 ✓"
    fi
}

# 构建 Docker 镜像
build_images() {
    log_info "构建 Docker 镜像..."
    
    cd ${PROJECT_DIR}
    
    # 构建后端镜像
    log_info "构建后端镜像 (ai-ark-backend:latest)..."
    docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend
    
    # 构建前端镜像
    log_info "构建前端镜像 (ai-ark-frontend:latest)..."
    docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./
    
    log_info "Docker 镜像构建完成 ✓"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    
    cd ${PROJECT_DIR}
    
    # 使用 1Panel 专用配置文件（不含 nginx，由 1Panel 处理）
    if [ -f "docker-compose.1panel.yml" ]; then
        COMPOSE_FILE="-f docker-compose.1panel.yml"
    else
        COMPOSE_FILE=""
    fi
    
    # 停止现有容器
    docker-compose ${COMPOSE_FILE} down 2>/dev/null || true
    
    # 启动容器
    docker-compose ${COMPOSE_FILE} up -d
    
    log_info "服务启动中..."
    sleep 5
    
    log_info "服务启动完成 ✓"
}

# 验证部署
verify_deployment() {
    log_info "验证部署..."
    
    # 检查容器状态
    echo ""
    echo "容器状态:"
    docker ps --filter "name=ai-ark" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # 健康检查
    echo ""
    log_info "执行健康检查..."
    
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        log_info "后端 API 健康检查通过 ✓"
        echo "后端响应: $(curl -s http://localhost:8000/health)"
    else
        log_warn "后端 API 健康检查失败，请检查日志"
    fi
    
    echo ""
}

# 显示访问信息
show_info() {
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  部署完成！${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "${BLUE}访问地址:${NC}"
    echo "  前端页面: http://your-server-ip"
    echo "  API 健康检查: http://your-server-ip:8000/health"
    echo ""
    echo -e "${BLUE}容器管理:${NC}"
    echo "  查看日志: docker logs -f ai-ark-backend"
    echo "  重启服务: cd ${PROJECT_DIR} && docker-compose restart"
    echo "  停止服务: cd ${PROJECT_DIR} && docker-compose down"
    echo ""
    echo -e "${BLUE}配置文件:${NC}"
    echo "  项目目录: ${PROJECT_DIR}"
    echo "  环境变量: ${PROJECT_DIR}/.env"
    echo ""
}

# 查看日志
show_logs() {
    echo ""
    log_info "显示最近日志 (后端)..."
    docker logs --tail 50 ai-ark-backend
}

# 主程序
main() {
    check_root
    check_docker
    create_directories
    backup_existing
    upload_files
    create_env
    build_images
    start_services
    verify_deployment
    show_info
}

# 根据参数执行
case "${1:-deploy}" in
    deploy)
        main
        ;;
    build)
        check_root
        check_docker
        build_images
        ;;
    start)
        start_services
        ;;
    stop)
        cd ${PROJECT_DIR} && docker-compose down
        ;;
    restart)
        cd ${PROJECT_DIR} && docker-compose restart
        ;;
    logs)
        show_logs
        ;;
    backup)
        backup_existing
        ;;
    *)
        echo "用法: $0 {deploy|build|start|stop|restart|logs|backup}"
        echo ""
        echo "命令说明:"
        echo "  deploy   - 一键部署 (默认)"
        echo "  build    - 仅构建 Docker 镜像"
        echo "  start    - 启动服务"
        echo "  stop     - 停止服务"
        echo "  restart  - 重启服务"
        echo "  logs     - 查看后端日志"
        echo "  backup   - 备份现有部署"
        exit 1
        ;;
esac
