#!/bin/bash
#
# AI方舟 - 一键验证部署脚本
# 用法: curl -sL https://raw.githubusercontent.com/your-repo/main/verify.sh | bash
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SERVER_IP="120.26.35.49"
PROJECT_DIR="/var/www/ai-ark"

log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] [WARN]${NC} $1"; }
error() { echo -e "${RED}[$(date '+%H:%M:%S')] [ERROR]${NC} $1"; }
info() { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           AI方舟 - 部署验证脚本 v1.0                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. 检查 Docker 服务
check_docker() {
    info "检查 Docker 服务..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker 未安装"
        return 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker 服务未运行"
        return 1
    fi
    
    log "Docker 服务正常 ✓"
    return 0
}

# 2. 检查容器状态
check_containers() {
    info "检查容器状态..."
    
    local containers=$(docker ps --filter "name=ai-ark" --format "{{.Names}}")
    
    if [ -z "$containers" ]; then
        error "未找到 AI方舟 容器"
        return 1
    fi
    
    echo ""
    echo "容器列表:"
    docker ps --filter "name=ai-ark" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # 检查是否全部运行
    local running=$(docker ps --filter "name=ai-ark" --format "{{.Status}}" | grep -c "Up" || echo "0")
    local total=$(docker ps --filter "name=ai-ark" --format "{{.Status}}" | wc -l)
    
    if [ "$running" -eq "$total" ]; then
        log "所有容器运行正常 ($running/$total) ✓"
        return 0
    else
        error "部分容器未运行 ($running/$total)"
        return 1
    fi
}

# 3. 检查 API 健康
check_api_health() {
    info "检查 API 健康..."
    
    local response=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        log "API 健康检查通过 ✓"
        echo ""
        info "API 响应:"
        curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health
        return 0
    else
        error "API 健康检查失败 (HTTP $response)"
        return 1
    fi
}

# 4. 测试推荐功能
check_recommend() {
    info "测试推荐功能..."
    
    local response=$(curl -sf -X POST http://localhost:8000/api/recommend \
        -H "Content-Type: application/json" \
        -d '{"query":"AI写作工具","max_results":3}' 2>/dev/null)
    
    if [ -n "$response" ]; then
        log "推荐功能正常 ✓"
        echo ""
        info "推荐结果示例:"
        echo "$response" | python3 -m json.tool 2>/dev/null | head -30 || echo "$response"
        return 0
    else
        warn "推荐功能测试失败 (可能是 API Key 问题)"
        return 1
    fi
}

# 5. 检查数据文件
check_data() {
    info "检查数据文件..."
    
    if [ -f "${PROJECT_DIR}/public/toolsData.json" ]; then
        local size=$(stat -f%z "${PROJECT_DIR}/public/toolsData.json" 2>/dev/null || stat -c%s "${PROJECT_DIR}/public/toolsData.json" 2>/dev/null || echo "0")
        local tools_count=$(python3 -c "import json; print(len(json.load(open('${PROJECT_DIR}/public/toolsData.json'))['tools']))" 2>/dev/null || echo "0")
        
        log "数据文件存在 ($(numfmt --to=iec $size), $tools_count 工具) ✓"
        return 0
    else
        error "数据文件不存在"
        return 1
    fi
}

# 6. 检查前端
check_frontend() {
    info "检查前端服务..."
    
    local response=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        log "前端服务正常 ✓"
        return 0
    else
        warn "前端服务检查失败 (HTTP $response)"
        return 1
    fi
}

# 7. 显示访问信息
show_access_info() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    访问信息                                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${CYAN}前端页面:${NC}  http://${SERVER_IP}:3000"
    echo -e "  ${CYAN}API 健康:${NC}  http://${SERVER_IP}:8000/health"
    echo -e "  ${CYAN}推荐接口:${NC}  POST http://${SERVER_IP}:8000/api/recommend"
    echo ""
    echo -e "  ${CYAN}管理命令:${NC}"
    echo -e "    查看日志:  docker logs -f ai-ark-backend"
    echo -e "    重启服务:  cd ${PROJECT_DIR} && docker-compose restart"
    echo -e "    停止服务:  cd ${PROJECT_DIR} && docker-compose down"
    echo ""
}

# 8. 生成测试报告
generate_report() {
    local total=0
    local passed=0
    
    check_docker && ((passed++)); ((total++))
    check_containers && ((passed++)); ((total++))
    check_api_health && ((passed++)); ((total++))
    check_recommend && ((passed++)); ((total++))
    check_data && ((passed++)); ((total++))
    check_frontend && ((passed++)); ((total++))
    
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    验证报告                                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  检查项目: $total"
    echo -e "  通过: ${GREEN}$passed${NC}"
    echo -e "  失败: ${RED}$((total - passed))${NC}"
    echo ""
    
    if [ $passed -eq $total ]; then
        echo -e "  ${GREEN}🎉 全部检查通过！部署成功！${NC}"
        show_access_info
        return 0
    else
        echo -e "  ${YELLOW}⚠️  部分检查未通过，请查看上方错误信息${NC}"
        echo ""
        echo "  建议操作:"
        echo "    1. 查看日志: docker logs ai-ark-backend"
        echo "    2. 检查配置: cat ${PROJECT_DIR}/.env"
        echo "    3. 重启服务: cd ${PROJECT_DIR} && docker-compose restart"
        return 1
    fi
}

# 主程序
main() {
    generate_report
}

# 如果在服务器上执行，直接运行
if [ "$1" = "--quick" ]; then
    check_docker
    check_containers
    check_api_health
else
    main
fi
