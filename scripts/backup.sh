#!/bin/bash
#
# AI方舟 - 自动备份脚本
# 用法: ./backup.sh [daily|weekly|monthly]
# 建议添加 crontab:
# 每天凌晨 3 点备份: 0 3 * * * /var/www/ai-ark/backup.sh daily
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="/var/www/ai-ark"
BACKUP_DIR="/backup/ai-ark"
RETENTION_DAYS=7

log_info() { echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]${NC} $1"; }
log_error() { echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR]${NC} $1"; }

# 创建备份
do_backup() {
    local type="${1:-daily}"
    local date=$(date +%Y%m%d)
    local time=$(date +%H%M%S)
    local backup_file="${BACKUP_DIR}/${type}_${date}_${time}"
    
    mkdir -p ${BACKUP_DIR}
    
    log_info "开始 ${type} 备份..."
    
    local total_size=0
    local success=true
    
    # 备份 1: 工具数据
    log_info "备份工具数据..."
    if [ -f "${PROJECT_DIR}/public/toolsData.json" ]; then
        cp "${PROJECT_DIR}/public/toolsData.json" "${backup_file}_tools.json"
        local size=$(stat -f%z "${backup_file}_tools.json" 2>/dev/null || stat -c%s "${backup_file}_tools.json" 2>/dev/null || echo "0")
        log_info "  工具数据: $(numfmt --to=iec $size) ✓"
        total_size=$((total_size + size))
    else
        log_warn "  工具数据文件不存在，跳过"
    fi
    
    # 备份 2: Docker 镜像 (每周)
    if [ "$type" = "weekly" ]; then
        log_info "备份 Docker 镜像..."
        if docker save ai-ark-backend ai-ark-frontend > "${backup_file}_images.tar" 2>/dev/null; then
            local size=$(stat -f%z "${backup_file}_images.tar" 2>/dev/null || stat -c%s "${backup_file}_images.tar" 2>/dev/null || echo "0")
            log_info "  Docker 镜像: $(numfmt --to=iec $size) ✓"
            total_size=$((total_size + size))
        else
            log_warn "  Docker 镜像备份失败，跳过"
        fi
    fi
    
    # 备份 3: 环境变量
    log_info "备份环境配置..."
    if [ -f "${PROJECT_DIR}/.env" ]; then
        cp "${PROJECT_DIR}/.env" "${backup_file}_env"
        log_info "  环境变量: 已备份 ✓"
    fi
    
    # 备份 4: Docker Compose 配置
    log_info "备份 Docker 配置..."
    if [ -f "${PROJECT_DIR}/docker-compose.1panel.yml" ]; then
        cp "${PROJECT_DIR}/docker-compose.1panel.yml" "${backup_file}_compose.yml"
        log_info "  Docker Compose: 已备份 ✓"
    fi
    
    # 创建压缩包
    log_info "创建压缩包..."
    cd ${BACKUP_DIR}
    tar -czf "${backup_file}.tar.gz" \
        $(basename "${backup_file}")_tools.json \
        $(basename "${backup_file}")_env \
        $(basename "${backup_file}")_compose.yml 2>/dev/null
    
    # 清理临时文件
    rm -f $(basename "${backup_file}")_*.json $(basename "${backup_file})_env $(basename "${backup_file}")_compose.yml 2>/dev/null
    
    local final_size=$(stat -f%z "${backup_file}.tar.gz" 2>/dev/null || stat -c%s "${backup_file}.tar.gz" 2>/dev/null || echo "0")
    
    log_info "备份完成!"
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  备份摘要${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo "  类型: ${type}"
    echo "  文件: ${backup_file}.tar.gz"
    echo "  大小: $(numfmt --to=iec $final_size)"
    echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
}

# 清理旧备份
cleanup() {
    log_info "清理 ${RETENTION_DAYS} 天前的旧备份..."
    
    local deleted=0
    local freed=0
    
    # 查找并删除旧备份
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
            rm -f "$file"
            log_info "  删除: $(basename $file)"
            ((deleted++))
            freed=$((freed + size))
        fi
    done < <(find ${BACKUP_DIR} -name "*.tar.gz" -type f -mtime +${RETENTION_DAYS})
    
    if [ $deleted -gt 0 ]; then
        log_info "已删除 ${deleted} 个旧备份文件，释放空间: $(numfmt --to=iec $freed)"
    else
        log_info "无需清理，没有旧备份文件"
    fi
}

# 恢复备份
restore() {
    local backup_file="$2"
    
    if [ -z "$backup_file" ]; then
        log_error "请指定要恢复的备份文件"
        echo "用法: $0 restore 20260131_030000"
        echo ""
        echo "可用备份:"
        ls -t ${BACKUP_DIR}/*.tar.gz | head -10
        exit 1
    fi
    
    log_info "从 ${backup_file} 恢复备份..."
    
    # 解压
    cd ${BACKUP_DIR}
    tar -xzf "${backup_file}"
    
    # 恢复工具数据
    if [ -f "${backup_file%.tar.gz}_tools.json" ]; then
        cp "${backup_file%.tar.gz}_tools.json" "${PROJECT_DIR}/public/toolsData.json"
        log_info "  工具数据已恢复 ✓"
    fi
    
    # 恢复环境变量
    if [ -f "${backup_file%.tar.gz}_env" ]; then
        cp "${backup_file%.tar.gz}_env" "${PROJECT_DIR}/.env"
        chmod 600 "${PROJECT_DIR}/.env"
        log_info "  环境变量已恢复 ✓"
    fi
    
    # 恢复 Docker Compose
    if [ -f "${backup_file%.tar.gz}_compose.yml" ]; then
        cp "${backup_file%.tar.gz}_compose.yml" "${PROJECT_DIR}/docker-compose.1panel.yml"
        log_info "  Docker Compose 配置已恢复 ✓"
    fi
    
    log_info "恢复完成!"
    log_warn "请重启服务使更改生效: docker-compose -f ${PROJECT_DIR}/docker-compose.1panel.yml restart"
}

# 列出备份
list() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  可用备份列表${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    ls -lh ${BACKUP_DIR}/*.tar.gz 2>/dev/null | awk '{print $9, "(" $5 ")"}' | head -20
    
    echo ""
    echo "总大小: $(du -sh ${BACKUP_DIR} 2>/dev/null | cut -f1)"
}

# 显示帮助
help() {
    echo "AI方舟 备份脚本"
    echo ""
    echo "用法: $0 {backup|cleanup|restore|list} [参数]"
    echo ""
    echo "命令:"
    echo "  backup [daily|weekly|monthly] - 创建备份 (默认 daily)"
    echo "  cleanup                       - 清理旧备份"
    echo "  restore <文件名>              - 恢复备份"
    echo "  list                          - 列出所有备份"
    echo ""
    echo "示例:"
    echo "  $0 backup daily"
    echo "  $0 backup weekly"
    echo "  $0 list"
    echo "  $0 restore daily_20260131_030000.tar.gz"
    echo ""
    echo "Crontab 示例:"
    echo "  # 每天凌晨 3 点备份"
    echo "  0 3 * * * /var/www/ai-ark/backup.sh daily"
    echo ""
    echo "  # 每周日凌晨 4 点备份 (含镜像)"
    echo "  0 4 * * 0 /var/www/ai-ark/backup.sh weekly"
}

# 主程序
case "${1:-backup}" in
    backup)
        do_backup "${2:-daily}"
        cleanup
        ;;
    cleanup)
        cleanup
        ;;
    restore)
        restore "$@"
        ;;
    list)
        list
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
