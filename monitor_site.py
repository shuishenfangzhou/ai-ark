import requests
import subprocess
import time
import logging
import os
from datetime import datetime

# === 配置区域 ===
# 目标网址 (容器内部互联或本机IP)
TARGET_URL = "http://localhost:8080" 
# Docker 容器名称
CONTAINER_NAME = "ai-ark-static"
# 检查间隔 (秒)
CHECK_INTERVAL = 60
# 连续失败多少次重启容器
MAX_RETRIES = 3
# 日志文件路径
LOG_FILE = "/var/log/ai-ark-monitor.log"

# === 日志配置 ===
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def check_site():
    """检查网站是否返回 200 OK"""
    try:
        response = requests.get(TARGET_URL, timeout=10)
        if response.status_code == 200:
            return True
        else:
            logging.warning(f"⚠️ Status Code Error: {response.status_code}")
            return False
    except requests.RequestException as e:
        logging.error(f"❌ Connection Error: {e}")
        return False

def restart_container():
    """重启 Docker 容器"""
    logging.info(f"🔄 Attempting to restart container: {CONTAINER_NAME}")
    try:
        # 使用 subprocess 调用 Docker 命令
        result = subprocess.run(
            ['docker', 'restart', CONTAINER_NAME],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            logging.info(f"✅ Container {CONTAINER_NAME} restarted successfully.")
            return True
        else:
            logging.error(f"❌ Failed to restart container: {result.stderr}")
            return False
    except Exception as e:
        logging.error(f"❌ System Error during restart: {e}")
        return False

def main():
    fail_count = 0
    logging.info("🚀 Monitor Service Started. Watching " + TARGET_URL)
    
    while True:
        if check_site():
            if fail_count > 0:
                logging.info("✅ Site recovered.")
            fail_count = 0 # 重置失败计数
        else:
            fail_count += 1
            logging.warning(f"⚠️ Check failed ({fail_count}/{MAX_RETRIES})")
            
            if fail_count >= MAX_RETRIES:
                logging.error("🚨 Max retries reached. Triggering restart...")
                if restart_container():
                    fail_count = 0 # 重启后重置
                    logging.info("⏳ Waiting 30s for container to warm up...")
                    time.sleep(30) # 等待容器启动
                else:
                    logging.critical("💀 Restart failed! Please check server manually.")
                    # 这里可以扩展发送邮件或钉钉通知
        
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    # 确保以 root 运行 (为了控制 docker)
    if os.geteuid() != 0:
        print("Error: This script must be run as root to control Docker.")
        exit(1)
    main()
