#!/bin/bash
#
# AI方舟 - 监控脚本
# 用法: ./monitor.sh [status|logs|restart|backup]
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/var/www/ai-ark"
CONTAINER_BACKEND="ai-ark-backend"
CONTAINER_FRONTEND="ai-ark-frontend"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查容器状态
status() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  AI方舟 服务状态${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo "容器状态:"
    docker ps --filter "name=ai-ark" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.RunningFor}}"
    
    echo ""
    echo "资源使用:"
    docker stats --no-stream --filter "name=ai-ark" --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    
    echo ""
    echo "健康检查:"
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        log_info "后端 API: 正常 ✓"
        curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health
    else
        log_error "后端 API: 异常 ✗"
    fi
}

# 查看日志
logs() {
    local container="${1:-${CONTAINER_BACKEND}}"
    local lines="${2:-50}"
    
    echo -e "${BLUE}显示 ${container} 最近 ${lines} 行日志${NC}"
    echo "按 Ctrl+C 退出"
    echo ""
    
    docker logs -f --tail "$lines" "$container"
}

# 重启服务
restart() {
    log_info "重启服务..."
    cd ${PROJECT_DIR}
    docker-compose -f docker-compose.1panel.yml restart
    sleep 3
    status
}

# 备份
backup() {
    local backup_dir="/backup/ai-ark"
    local date=$(date +%Y%m%d_%H%M%S)
    local backup_file="${backup_dir}/backup_${date}.tar.gz"
    
    mkdir -p ${backup_dir}
    
    log_info "开始备份..."
    
    # 备份工具数据
    cp ${PROJECT_DIR}/public/toolsData.json ${backup_dir}/toolsData_${date}.json
    
    # 备份 Docker 镜像
    docker save ai-ark-backend ai-ark-frontend > ${backup_dir}/images_${date}.tar
    
    # 创建完整备份
    cd ${PROJECT_DIR}
    tar -czf ${backup_file} \
        public/toolsData.json \
        .env \
        docker-compose.1panel.yml
    
    log_info "备份完成!"
    echo ""
    echo "备份文件:"
    ls -lh ${backup_dir}/
}

# 健康检查详细
health_check() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  AI方舟 健康检查${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    local checks=0
    local passed=0
    
    # 检查 1: 容器运行状态
    ((checks++))
    if docker ps --filter "name=ai-ark" --format "{{.Names}}" | grep -q "${CONTAINER_BACKEND}"; then
        log_info "[$checks] 后端容器运行正常 ✓"
        ((passed++))
    else
        log_error "[$checks] 后端容器未运行 ✗"
    fi
    
    # 检查 2: 容器运行状态
    ((checks++))
    if docker ps --filter "name=ai-ark" --format "{{.Names}}" | grep -q "${CONTAINER_FRONTEND}"; then
        log_info "[$checks] 前端容器运行正常 ✓"
        ((passed++))
    else
        log_error "[$checks] 前端容器未运行 ✗"
    fi
    
    # 检查 3: API 健康端点
    ((checks++))
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        log_info "[$checks] API 健康检查通过 ✓"
        ((passed++))
    else
        log_error "[$checks] API 健康检查失败 ✗"
    fi
    
    # 检查 4: API 响应时间
    ((checks++))
    local response_time=$(curl -sf -o /dev/null -w "%{time_total}" http://localhost:8000/health)
    if [ -n "$response_time" ]; then
        if (( $(echo "$response_time < 2" | bc -l) )); then
            log_info "[$checks] API 响应时间正常 (${response_time}s) ✓"
            ((passed++))
        else
            log_warn "[$checks] API 响应时间较慢 (${response_time}s)"
            ((passed++))
        fi
    else
        log_error "[$checks] API 响应超时 ✗"
    fi
    
    # 检查 5: 数据文件
    ((checks++))
    if [ -f "${PROJECT_DIR}/public/toolsData.json" ]; then
        local tools_count=$(python3 -c "import json; print(len(json.load(open('${PROJECT_DIR}/public/toolsData.json'))['tools']))" 2>/dev/null || echo "0")
        log_info "[$checks] 工具数据文件存在 (${tools_count} 工具) ✓"
        ((passed++))
    else
        log_error "[$checks] 工具数据文件缺失 ✗"
    fi
    
    echo ""
    echo "========================================"
    echo "检查结果: ${passed}/${checks} 通过"
    
    if [ $passed -eq $checks ]; then
        echo -e "${GREEN}所有检查通过! 系统运行正常${NC}"
        exit 0
    else
        echo -e "${RED}存在异常，请检查日志${NC}"
        exit 1
    fi
}

# 显示帮助
help() {
    echo "AI方舟 监控脚本"
    echo ""
    echo "用法: $0 {status|logs|restart|backup|health}"
    echo ""
    echo "命令:"
    echo "  status   - 显示服务状态"
    echo "  logs     - 查看日志 (默认后端)"
    echo "  logs frontend - 查看前端日志"
    echo "  restart  - 重启所有服务"
    echo "  backup   - 备份数据"
    echo "  health   - 健康检查"
    echo ""
    echo "示例:"
    echo "  $0 status"
    echo "  $0 logs"
    echo "  $0 health"
}

# 主程序
case "${1:-status}" in
    status)
        status
        ;;
    logs)
        logs "${2:-${CONTAINER_BACKEND}}" "${3:-50}"
        ;;
    restart)
        restart
        ;;
    backup)
        backup
        ;;
    health)
        health_check
        ;;
    help|--help|-h)
        help
        ;;
    *)
        log_error "未知命令: $1"
        help
        exit 1
        ;;
esac
