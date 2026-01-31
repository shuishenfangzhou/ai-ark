"""
AI方舟 - 数据库初始化脚本

从 dist/tools.json 导入数据到 MySQL 数据库。
"""

import json
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# 数据库连接字符串
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/ai_ark_db?charset=utf8mb4"
)

# 工具数据文件路径
TOOLS_JSON_PATH = os.getenv(
    "TOOLS_JSON_PATH",
    "dist/toolsData.json"
)


def get_tools_from_json(file_path: str) -> list:
    """从JSON文件读取工具数据"""
    if not os.path.exists(file_path):
        print(f"错误: 工具数据文件不存在: {file_path}")
        return []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            # 兼容不同的JSON格式
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                # 如果是字典，尝试获取 'tools' 键
                return data.get('tools', [])
            else:
                print(f"错误: 未知的JSON格式")
                return []
        except json.JSONDecodeError as e:
            print(f"错误: JSON解析失败: {e}")
            return []


def check_db_empty(engine) -> bool:
    """检查数据库是否为空"""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM tools"))
        count = result.scalar()
        return count == 0


def insert_tool(conn, tool: dict):
    """插入单个工具到数据库"""
    sql = """
    INSERT INTO tools (name, description, url, category, logo_path, tags)
    VALUES (:name, :description, :url, :category, :logo_path, :tags)
    """
    conn.execute(text(sql), {
        "name": tool.get("name", ""),
        "description": tool.get("description", ""),
        "url": tool.get("url", ""),
        "category": tool.get("category", "未分类"),
        "logo_path": tool.get("image", tool.get("logo_path", "")),
        "tags": ",".join(tool.get("tags", []))
    })


def create_table(engine):
    """创建 tools 表"""
    sql = """
    CREATE TABLE IF NOT EXISTS tools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(2048) NOT NULL,
        category VARCHAR(100) NOT NULL,
        logo_path VARCHAR(512),
        tags VARCHAR(512),
        INDEX idx_category (category),
        INDEX idx_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """
    with engine.connect() as conn:
        conn.execute(text(sql))
        conn.commit()


def main():
    """主函数"""
    print("AI方舟 - 数据库初始化脚本")
    print("=" * 50)
    
    # 创建数据库引擎
    print(f"连接到数据库...")
    engine = create_engine(DATABASE_URL, echo=False)
    
    # 创建表
    print("创建 tools 表...")
    create_table(engine)
    
    # 检查数据库是否为空
    if not check_db_empty(engine):
        print("数据库中已有数据，跳过数据导入。")
        print("如需重新导入，请先清空数据库:")
        print("docker-compose exec db mysql -uroot -ppassword -e 'DELETE FROM ai_ark_db.tools;'")
        return
    
    # 读取工具数据
    print(f"读取工具数据: {TOOLS_JSON_PATH}")
    tools = get_tools_from_json(TOOLS_JSON_PATH)
    
    if not tools:
        print("没有找到工具数据，退出。")
        sys.exit(1)
    
    print(f"找到 {len(tools)} 个工具，准备导入...")
    
    # 批量导入
    try:
        with engine.connect() as conn:
            for i, tool in enumerate(tools, 1):
                insert_tool(conn, tool)
                if i % 100 == 0:
                    print(f"   已导入 {i}/{len(tools)} 个工具...")
            conn.commit()
        
        print(f"成功导入 {len(tools)} 个工具！")
        
    except Exception as e:
        print(f"导入失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
