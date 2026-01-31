#!/bin/bash
#
# AI方舟 - 远程部署脚本
# 用法: bash REMOTE_DEPLOY.sh
#

set -e

# 服务器信息 (从用户获取)
SERVER_IP="120.26.35.49"
SSH_PORT="22"
SSH_USER="root"
SSH_PASS="210981040436Fhz"

# 项目配置
PROJECT_DIR="/var/www/ai-ark"
DEEPSEEK_API_KEY="sk-abf3975bd37a4e18b06959c0a91d9099"

echo "🚀 AI方舟 - 远程部署"
echo "===================="
echo "服务器: ${SSH_USER}@${SERVER_IP}:${SSH_PORT}"
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# 检查本地文件
check_files() {
    log "检查本地文件..."
    local files=(
        "docker-compose.1panel.yml"
        "docker/Dockerfile.backend"
        "docker/Dockerfile.frontend"
        "backend/requirements.txt"
        "public/toolsData.json"
        "dist/index.html"
    )
    
    for file in "${files[@]}"; do
        if [ ! -f "$file" ]; then
            error "缺少文件: $file"
        fi
    done
    log "本地文件检查通过 ✓"
}

# 创建部署包
create_package() {
    log "创建部署包..."
    tar -czvf /tmp/ai-ark-deploy.tar.gz \
        docker-compose.1panel.yml \
        docker/ \
        backend/ \
        public/ \
        dist/ \
        .env.example \
        --exclude=node_modules \
        --exclude=__pycache__
    log "部署包创建完成: /tmp/ai-ark-deploy.tar.gz"
}

# 上传文件
upload_files() {
    log "上传文件到服务器..."
    
    # 使用 scp 上传 (需要 expect 或 sshpass)
    # 如果没有这些工具，使用 sftp 或手动上传
    
    log "上传命令:"
    echo ""
    echo "请在本地执行以下命令:"
    echo "===================="
    echo "scp -P ${SSH_PORT} /tmp/ai-ark-deploy.tar.gz ${SSH_USER}@${SERVER_IP}:${PROJECT_DIR}/"
    echo ""
    echo "或手动上传以下文件到 ${PROJECT_DIR}/:"
    echo "  - docker-compose.1panel.yml"
    echo "  - docker/Dockerfile.backend"
    echo "  - docker/Dockerfile.frontend"
    echo "  - backend/"
    echo "  - public/"
    echo "  - dist/"
    echo "  - .env.example"
    echo ""
}

# 远程执行命令
remote_exec() {
    local cmd="$1"
    
    # 方法 1: 使用 sshpass (如果可用)
    if command -v sshpass &> /dev/null; then
        sshpass -p "${SSH_PASS}" ssh -o StrictHostKeyChecking=no -p "${SSH_PORT}" "${SSH_USER}@${SERVER_IP}" "$cmd"
    else
        # 方法 2: 提示用户执行
        warn "无法自动执行远程命令，请手动执行:"
        echo ""
        echo "在本地执行 (需要安装 sshpass):"
        echo "  apt install sshpass  # Ubuntu/Debian"
        echo "  yum install sshpass  # CentOS"
        echo ""
        echo "或直接 SSH 连接服务器执行:"
        echo "  ssh ${SSH_USER}@${SERVER_IP} -p ${SSH_PORT}"
        echo "  然后执行: $cmd"
        echo ""
    fi
}

# 配置服务器
configure_server() {
    log "配置服务器..."
    
    remote_exec "mkdir -p ${PROJECT_DIR}"
    remote_exec "cd ${PROJECT_DIR} && cat > .env << 'EOF'
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
LOG_LEVEL=INFO
EOF
chmod 600 ${PROJECT_DIR}/.env"
    
    log "服务器配置完成 ✓"
}

# 构建镜像
build_images() {
    log "构建 Docker 镜像..."
    
    remote_exec "cd ${PROJECT_DIR} && docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend"
    remote_exec "cd ${PROJECT_DIR} && docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./"
    
    log "镜像构建完成 ✓"
}

# 启动服务
start_service() {
    log "启动服务..."
    
    remote_exec "cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml down 2>/dev/null || true"
    remote_exec "cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml up -d"
    
    log "服务启动中... 等待 10 秒"
    sleep 10
    
    log "服务启动完成 ✓"
}

# 验证部署
verify_deployment() {
    log "验证部署..."
    
    # 检查容器状态
    echo ""
    echo "容器状态:"
    remote_exec "docker ps --filter 'name=ai-ark' --format 'table {{.Names}}\t{{.Status}}'"
    
    # 健康检查
    echo ""
    log "健康检查..."
    
    if remote_exec "curl -sf http://localhost:8000/health" 2>/dev/null | grep -q "healthy"; then
        log "后端 API 健康检查通过 ✓"
        remote_exec "curl -s http://localhost:8000/health"
    else
        warn "后端 API 健康检查失败，请查看日志"
        remote_exec "docker logs ai-ark-backend --tail 50"
    fi
}

# 显示完成信息
show_completion() {
    echo ""
    echo -e "${GREEN}=======================================${NC}"
    echo -e "${GREEN}  AI方舟 部署完成！${NC}"
    echo -e "${GREEN}=======================================${NC}"
    echo ""
    echo "访问地址:"
    echo "  前端: http://${SERVER_IP}:3000"
    echo "  API:  http://${SERVER_IP}:8000"
    echo "  健康: http://${SERVER_IP}:8000/health"
    echo ""
    echo "管理命令:"
    echo "  查看日志: docker logs -f ai-ark-backend"
    echo "  重启服务: cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml restart"
    echo "  停止服务: cd ${PROJECT_DIR} && docker-compose -f docker-compose.1panel.yml down"
    echo ""
}

# 主程序
main() {
    check_files
    create_package
    upload_files
    
    echo ""
    echo "===================="
    echo "请先上传文件，然后继续执行以下步骤:"
    echo ""
    echo "步骤 1: SSH 连接服务器"
    echo "  ssh ${SSH_USER}@${SERVER_IP} -p ${SSH_PORT}"
    echo ""
    echo "步骤 2: 配置环境"
    echo "  cd ${PROJECT_DIR}"
    echo "  cat > .env << 'EOF'"
    echo "  DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}"
    echo "  LOG_LEVEL=INFO"
    echo "  EOF"
    echo "  chmod 600 .env"
    echo ""
    echo "步骤 3: 构建镜像"
    echo "  docker build -t ai-ark-backend:latest -f docker/Dockerfile.backend ./backend"
    echo "  docker build -t ai-ark-frontend:latest -f docker/Dockerfile.frontend ./"
    echo ""
    echo "步骤 4: 启动服务"
    echo "  docker-compose -f docker-compose.1panel.yml up -d"
    echo ""
    echo "步骤 5: 验证"
    echo "  curl http://localhost:8000/health"
    echo ""
    
    read -p "是否已上传文件并准备好继续部署? (y/n): " ready
    if [ "$ready" = "y" ] || [ "$ready" = "Y" ]; then
        configure_server
        build_images
        start_service
        verify_deployment
        show_completion
    else
        echo "请上传文件后再次运行此脚本"
    fi
}

# 直接执行远程部署 (如果 sshpass 可用)
auto_deploy() {
    if ! command -v sshpass &> /dev/null; then
        warn "sshpass 未安装，无法自动部署"
        main
        return
    fi
    
    log "开始自动部署..."
    check_files
    create_package
    
    log "上传部署包..."
    sshpass -p "${SSH_PASS}" scp -o StrictHostKeyChecking=no -P "${SSH_PORT}" /tmp/ai-ark-deploy.tar.gz "${SSH_USER}@${SERVER_IP}:${PROJECT_DIR}/"
    
    log "解压文件..."
    remote_exec "cd ${PROJECT_DIR} && tar -xzf ai-ark-deploy.tar.gz && rm -f ai-ark-deploy.tar.gz"
    
    configure_server
    build_images
    start_service
    verify_deployment
    show_completion
}

# 根据参数执行
case "${1:-auto}" in
    auto)
        auto_deploy
        ;;
    manual)
        main
        ;;
    upload)
        check_files
        create_package
        upload_files
        ;;
    *)
        echo "用法: $0 {auto|manual|upload}"
        echo "  auto   - 自动部署 (需要 sshpass)"
        echo "  manual - 手动分步部署"
        echo "  upload - 仅上传文件"
        ;;
esac
