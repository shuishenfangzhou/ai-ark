# AI方舟后端开发 - FastAPI + DeepSeek集成

## TL;DR

> **快速摘要**: 为现有的 AI 工具导航站创建 FastAPI 后端服务，集成 DeepSeek API 实现智能工具推荐功能，支持前端通过 /api/ask 接口调用 AI 助手。
> 
> **交付物**:
> - FastAPI 后端源代码（app/ 目录）
> - DeepSeek API 集成服务
> - 完整的 API 接口和错误处理
> - 更新的 requirements.txt
> - Docker 部署配置
> 
> **估计工作量**: Short（2-4 小时）
> **并行执行**: YES - 代码编写和测试准备可并行
> **关键路径**: 创建基础结构 → 实现 DeepSeek 服务 → 实现 API 路由 → 配置测试 → 部署验证

---

## Context

### 原始需求
用户已有前端静态导航站（1495 个 AI 工具），需要添加后端支持实现"AI助手"功能，使其能够：
- 根据用户需求智能推荐合适的 AI 工具
- 提供语义搜索和工具对比功能
- 保护 API Key 不被前端暴露

### 访谈总结
**用户偏好**:
- **AI模型**: DeepSeek（都可以，基础推荐即可）
- **智能级别**: 基础推荐（根据描述推荐工具）
- **部署方式**: Docker 容器（1Panel 应用）
- **爬虫功能**: 后续扩展（本次不包含）

**关键讨论**:
- 项目已有完善的 Docker 基础设施（Dockerfile.backend, docker-compose.yml）
- 需要创建缺失的 FastAPI 源代码
- toolsData.json 已有 1495 个工具数据，可作为 AI 推荐的知识库

### 研究发现
**FastAPI + DeepSeek 技术方案**（来源：FastAPI 官方文档、DeepSeek API 官方文档）:
- 使用 Pydantic Settings 安全读取 .env
- AsyncOpenAI 客户端实现异步高性能调用
- CORS 配置允许前端跨域访问
- 完整的错误处理和结构化日志

**Docker 基础设施**:
- 已有 Dockerfile.backend：Python 3.11-slim 多阶段构建
- 已有 docker-compose.yml：后端 + 前端 + Nginx 完整编排
- 工具数据通过 volume 挂载到容器

---

## Work Objectives

### 核心目标
创建 FastAPI 后端服务，通过 DeepSeek API 实现智能工具推荐功能，为前端提供安全的 API 接口。

### 具体交付物
1. **app/main.py**: FastAPI 应用入口，包含 CORS 和中间件配置
2. **app/config.py**: Pydantic Settings 配置管理
3. **app/api/routes.py**: API 路由定义
4. **app/services/deepseek_service.py**: DeepSeek API 服务封装
5. **app/models/schemas.py**: Pydantic 数据模型
6. **app/public/toolsData.json**: 工具数据访问层
7. **requirements.txt**: 更新的 Python 依赖
8. **.env.example**: 环境变量模板

### 完成定义
- [ ] `curl http://localhost:8000/health` 返回 `{"status": "healthy"}`
- [ ] `curl -X POST http://localhost:8000/api/ask` 返回 AI 推荐结果
- [ ] 前端可通过 JavaScript 调用后端 API
- [ ] Docker 容器正常启动并通过健康检查
- [ ] 所有日志正常输出

### Must Have
- FastAPI 应用入口和路由
- DeepSeek API 集成（支持流式和非流式响应）
- CORS 配置（允许前端跨域调用）
- 工具数据加载和查询功能
- 完整的错误处理和日志记录
- Docker 健康检查

### Must NOT Have（防护栏）
- 不修改前端代码（仅提供 API 接口）
- 不包含爬虫功能（后续扩展）
- 不硬编码 API Key（使用环境变量）
- 不泄露敏感信息到日志

---

## Verification Strategy（验证策略）

### 验证阶段

**阶段 1: 本地代码验证**
- Python 语法检查：`python -m py_compile app/*.py`
- FastAPI 应用启动测试
- API 接口测试（使用 curl）

**阶段 2: Docker 构建验证**
- Docker 镜像构建成功
- 容器启动并通过健康检查
- 日志无 ERROR 级别错误

**阶段 3: 功能测试**
- 健康检查接口：`curl http://localhost:8000/health`
- AI 推荐接口：`curl -X POST http://localhost:8000/api/ask`
- CORS 验证：检查响应头是否包含 `Access-Control-Allow-Origin`

### 验证命令
```bash
# 1. 本地启动测试
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. 健康检查
curl http://localhost:8000/health

# 3. AI 推荐测试
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "推荐一个好用的AI写作工具"}
    ],
    "max_results": 3
  }'

# 4. Docker 构建和运行
docker build -f docker/Dockerfile.backend -t ai-ark-backend:latest .
docker run -p 8000:8000 -e DEEPSEEK_API_KEY=your_key ai-ark-backend:latest

# 5. 健康检查验证
curl http://localhost:8000/health
```

### 证据捕获
- [ ] 健康检查响应截图
- [ ] API 调用响应截图
- [ ] Docker 容器状态截图
- [ ] 日志输出截图（无错误）

---

## Execution Strategy

### 并行执行 waves

```
Wave 1 (基础设施，可并行):
├── Task 1: 创建 .env.example 模板
├── Task 2: 更新 requirements.txt
└── Task 3: 创建 app/__init__.py

Wave 2 (核心服务，顺序执行):
├── Task 4: 创建 config.py 配置管理
├── Task 5: 创建 models/schemas.py 数据模型
├── Task 6: 创建 services/deepseek_service.py DeepSeek服务
├── Task 7: 创建 services/__init__.py
└── Task 8: 创建 public/tools_data.py 工具数据层

Wave 3 (API层，顺序执行):
├── Task 9: 创建 api/__init__.py
├── Task 10: 创建 api/routes.py API路由
└── Task 11: 创建 main.py 应用入口

Wave 4 (部署验证，顺序执行):
├── Task 12: Docker 构建测试
└── Task 13: API 功能验证
```

### 依赖矩阵

| 任务 | 依赖项 | 阻塞 | 可并行任务 |
|------|--------|------|-----------|
| 1 | 无 | 12 | 2, 3 |
| 2 | 无 | 5, 6, 11 | 1, 3 |
| 3 | 无 | 4, 5, 6, 9, 10, 11 | 1, 2 |
| 4 | 3 | 5, 6, 8, 11 | 无 |
| 5 | 2, 3 | 6, 10 | 无 |
| 6 | 2, 3, 4 | 10, 11 | 无 |
| 7 | 6 | 10 | 无 |
| 8 | 3 | 10 | 无 |
| 9 | 3 | 10 | 无 |
| 10 | 4, 5, 6, 7, 8, 9 | 11 | 无 |
| 11 | 2, 3, 4, 10 | 12 | 无 |
| 12 | 1, 2, 11 | 13 | 无 |
| 13 | 12 | 无 | 无 |

### 代理调度总结

| Wave | 任务 | 推荐代理 |
|------|------|---------|
| 1 | 1, 2, 3 | 无需代理（简单文件创建） |
| 2 | 4, 5, 6, 7, 8 | delegate_task (ultrabrain) - 复杂逻辑 |
| 3 | 9, 10, 11 | delegate_task (ultrabrain) - API 设计 |
| 4 | 12, 13 | delegate_task (quick) - 验证测试 |

---

## TODOs

- [ ] 1. 创建 .env.example 环境变量模板

  **What to do**:
  - 创建环境变量模板文件
  - 包含 DEEPSEEK_API_KEY 配置项
  - 添加注释说明每个变量的用途
  - 放在项目根目录

  **Must NOT do**:
  - 不包含真实的 API Key
  - 不提交 .env 文件到版本控制

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 简单模板文件创建
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - None

  **Acceptance Criteria**:
  - [ ] 文件存在且名为 `.env.example`
  - [ ] 包含 `DEEPSEEK_API_KEY` 配置项
  - [ ] 包含 `DEEPSEEK_BASE_URL` 配置项（DeepSeek API 地址）
  - [ ] 包含 `DEEPSEEK_MODEL` 配置项
  - [ ] 包含注释说明

  **Content Template**:
  ```bash
  # DeepSeek API 配置
  DEEPSEEK_API_KEY=your_api_key_here
  DEEPSEEK_BASE_URL=https://api.deepseek.com
  DEEPSEEK_MODEL=deepseek-chat

  # 应用配置
  LOG_LEVEL=INFO
  ```

  **Commit**: NO（模板文件）

  ---

- [ ] 2. 更新 requirements.txt 依赖文件

  **What to do**:
  - 添加 FastAPI 相关依赖
  - 添加 OpenAI SDK（DeepSeek 兼容）
  - 添加 Pydantic Settings
  - 保留现有的 requests, beautifulsoup4

  **Must NOT do**:
  - 不添加不必要的依赖
  - 不使用过高的版本号

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: 简单依赖文件更新
  - **Skills**: None required

  **Acceptance Criteria**:
  - [ ] 文件存在且格式正确
  - [ ] 包含 fastapi>=0.115.0
  - [ ] 包含 uvicorn[standard]>=0.30.0
  - [ ] 包含 openai>=1.0.0
  - [ ] 包含 pydantic>=2.0.0
  - [ ] 包含 pydantic-settings>=2.0.0
  - [ ] 包含 python-dotenv>=1.0.0

  **Content**:
  ```text
  # FastAPI 框架
  fastapi>=0.115.0
  uvicorn[standard]>=0.30.0
  pydantic>=2.0.0
  pydantic-settings>=2.0.0
  python-dotenv>=1.0.0

  # AI API
  openai>=1.0.0

  # 现有依赖
  requests>=2.31.0
  beautifulsoup4>=4.12.0
  ```

  **Commit**: NO

  ---

- [ ] 3. 创建 app/__init__.py 包初始化文件

  **What to do**:
  - 创建 app 目录的 __init__.py
  - 创建 api, services, models, public 子包的 __init__.py

  **Must NOT do**:
  - 不包含任何逻辑代码

  **Acceptance Criteria**:
  - [ ] app/__init__.py 存在
  - [ ] api/__init__.py 存在
  - [ ] services/__init__.py 存在
  - [ ] models/__init__.py 存在
  - [ ] public/__init__.py 存在

  **Commit**: NO

  ---

- [ ] 4. 创建 config.py 配置管理模块

  **What to do**:
  - 使用 Pydantic Settings 从 .env 加载配置
  - 定义 DeepSeek API 配置
  - 定义应用配置
  - 支持环境变量优先级覆盖

  **Must NOT do**:
  - 不硬编码任何敏感信息
  - 不在日志中输出 API Key

  **Recommended Agent Profile**:
  - **Category**: ultrabrain
    - Reason: 配置管理涉及安全性和最佳实践
  - **Skills**: ["fastapi"]
    - fastapi: Pydantic Settings 最佳实践

  **Acceptance Criteria**:
  - [ ] 文件存在：app/config.py
  - [ ] 使用 Pydantic Settings
  - [ ] 支持从 .env 文件加载
  - [ ] 支持环境变量覆盖
  - [ ] 提供 get_settings() 函数
  - [ ] 导出 settings 实例

  **Code Structure**:
  ```python
  from pydantic_settings import BaseSettings
  from functools import lru_cache

  class Settings(BaseSettings):
      deepseek_api_key: str
      deepseek_base_url: str = "https://api.deepseek.com"
      deepseek_model: str = "deepseek-chat"
      log_level: str = "INFO"
      
      class Config:
          env_file = ".env"
          case_sensitive = False

  @lru_cache
  def get_settings():
      return Settings()

  settings = get_settings()
  ```

  **References**:
  - FastAPI Settings: https://fastapi.tiangolo.com/advanced/settings/
  - Pydantic Settings: https://docs.pydantic.dev/latest/concepts/pydantic_settings/

  **Commit**: YES（与后端代码一起提交）

  ---

- [ ] 5. 创建 models/schemas.py 数据模型

  **What to do**:
  - 定义 AskRequest 请求模型
  - 定义 AskResponse 响应模型
  - 定义 Message 消息模型
  - 定义 ErrorResponse 错误模型
  - 使用 Pydantic 进行数据验证

  **Must NOT do**:
  - 不添加不必要的字段
  - 不跳过验证逻辑

  **Acceptance Criteria**:
  - [ ] 文件存在：app/models/schemas.py
  - [ ] AskRequest 包含 messages 列表字段
  - [ ] AskRequest 包含可选的 temperature, max_tokens 字段
  - [ ] AskResponse 包含 id, message, usage 字段
  - [ ] 所有模型通过 Pydantic 验证

  **Code Structure**:
  ```python
  from pydantic import BaseModel, Field
  from typing import List, Optional

  class Message(BaseModel):
      role: str
      content: str

  class AskRequest(BaseModel):
      messages: List[Message]
      temperature: float = 0.7
      max_tokens: int = 2000

  class AskResponse(BaseModel):
      id: str
      message: Message
      usage: dict
  ```

  **Commit**: YES

  ---

- [ ] 6. 创建 services/deepseek_service.py DeepSeek 服务

  **What to do**:
  - 使用 openai SDK 调用 DeepSeek API
  - 实现异步客户端 AsyncOpenAI
  - 支持流式和非流式响应
  - 统一错误处理
  - 日志记录请求和响应

  **Must NOT do**:
  - 不在日志中输出完整的 API 响应
  - 不忽略异常处理

  **Recommended Agent Profile**:
  - **Category**: ultrabrain
    - Reason: 外部 API 集成涉及错误处理和性能优化
  - **Skills**: ["fastapi"]
    - fastapi: 异步服务最佳实践

  **Acceptance Criteria**:
  - [ ] 文件存在：app/services/deepseek_service.py
  - [ ] 使用 AsyncOpenAI 客户端
  - [ ] chat_completion() 方法返回标准响应格式
  - [ ] chat_completion_stream() 方法支持流式输出
  - [ ] _handle_error() 方法处理常见错误
  - [ ] 提供 get_deepseek_service() 单例函数

  **Code Structure**:
  ```python
  from openai import AsyncOpenAI
  from config import get_settings

  class DeepSeekService:
      def __init__(self):
          settings = get_settings()
          self.client = AsyncOpenAI(
              api_key=settings.deepseek_api_key,
              base_url=settings.deepseek_base_url
          )
      
      async def chat_completion(self, messages, **kwargs):
          response = await self.client.chat.completions.create(
              model=settings.deepseek_model,
              messages=messages,
              **kwargs
          )
          return response

  def get_deepseek_service():
      # 单例模式
      global _service
      if _service is None:
          _service = DeepSeekService()
      return _service
  ```

  **References**:
  - DeepSeek API: https://api-docs.deepseek.com/
  - OpenAI Python SDK: https://platform.openai.com/docs/api-reference

  **Commit**: YES

  ---

- [ ] 7. 创建 services/__init__.py

  **What to do**:
  - 导出 deepseek_service 模块
  - 导出 get_deepseek_service 函数

  **Acceptance Criteria**:
  - [ ] 文件存在且可导入

  **Commit**: YES

  ---

- [ ] 8. 创建 public/tools_data.py 工具数据层

  **What to do**:
  - 从 JSON 文件加载工具数据
  - 提供工具查询功能
  - 支持按分类、标签筛选
  - 将工具数据格式化为 AI 提示词

  **Must NOT do**:
  - 不修改原始 JSON 文件
  - 不返回敏感信息

  **Acceptance Criteria**:
  - [ ] 文件存在：app/public/tools_data.py
  - [ ] load_tools() 从 JSON 加载数据
  - [ ] format_tools_for_ai() 格式化工具列表
  - [ ] search_tools() 支持关键词搜索
  - [ ] 按分类筛选功能

  **Code Structure**:
  ```python
  from pathlib import Path
  import json

  def load_tools():
      tools_file = Path(__file__).parent / "toolsData.json"
      with open(tools_file, encoding='utf-8') as f:
          return json.load(f)

  def format_tools_for_ai(tools, max_count=50):
      """将工具列表格式化为 AI 提示词"""
      formatted = []
      for tool in tools[:max_count]:
          formatted.append(f"- {tool['name']}: {tool['desc']}")
      return "\n".join(formatted)

  def search_tools(query, category=None):
      """搜索工具"""
      tools = load_tools()
      # 搜索逻辑
      return results
  ```

  **Commit**: YES

  ---

- [ ] 9. 创建 api/__init__.py

  **What to do**:
  - 导出 router 供主应用使用

  **Acceptance Criteria**:
  - [ ] 文件存在且可导入

  **Commit**: YES

  ---

- [ ] 10. 创建 api/routes.py API 路由

  **What to do**:
  - 定义 /api/ask 接口
  - 定义 /api/health 接口
  - 实现请求验证和响应格式化
  - 集成 DeepSeek 服务和工具数据

  **Must NOT do**:
  - 不跳过异常处理
  - 不返回敏感信息

  **Recommended Agent Profile**:
  - **Category**: ultrabrain
    - Reason: API 路由设计涉及安全性和用户体验
  - **Skills**: ["fastapi", "rest-api"]
    - fastapi: 路由定义和依赖注入
    - rest-api: RESTful 设计最佳实践

  **Acceptance Criteria**:
  - [ ] 文件存在：app/api/routes.py
  - [ ] POST /api/ask 接口存在
  - [ ] GET /api/health 接口存在
  - [ ] 请求体验证通过 Pydantic
  - [ ] 响应格式符合 AskResponse 模型
  - [ ] 集成工具数据到 AI 提示词

  **Code Structure**:
  ```python
  from fastapi import APIRouter, HTTPException
  from models.schemas import AskRequest, AskResponse, Message
  from services.deepseek_service import get_deepseek_service
  from public.tools_data import load_tools, format_tools_for_ai

  router = APIRouter()

  @router.post("/ask", response_model=AskResponse)
  async def ask_assistant(request: AskRequest):
      # 加载工具数据
      tools_data = load_tools()
      tools_list = format_tools_for_ai(tools_data['tools'])
      
      # 构建系统提示词
      system_prompt = f"""你是一个AI工具推荐助手。
      以下是可用的工具列表：
      {tools_list}
      
      根据用户的需求，推荐最合适的工具。"""
      
      # 构建消息
      messages = [{"role": "system", "content": system_prompt}]
      messages.extend([msg.dict() for msg in request.messages])
      
      # 调用 DeepSeek
      deepseek = get_deepseek_service()
      response = await deepseek.chat_completion(messages=messages)
      
      # 返回响应
      return AskResponse(
          id=response.id,
          message=Message(role="assistant", content=response.choices[0].message.content),
          usage={"total_tokens": response.usage.total_tokens}
      )

  @router.get("/health")
  async def health_check():
      return {"status": "healthy"}
  ```

  **References**:
  - FastAPI Router: https://fastapi.tiangolo.com/tutorial/bigger-applications/

  **Commit**: YES

  ---

- [ ] 11. 创建 main.py 应用入口

  **What to do**:
  - 创建 FastAPI 应用实例
  - 配置 CORS 中间件
  - 注册 API 路由
  - 添加请求日志中间件
  - 配置应用生命周期

  **Must NOT do**:
  - 不使用通配符 CORS（安全问题）
  - 不在生产环境启用 debug 模式

  **Recommended Agent Profile**:
  - **Category**: ultrabrain
    - Reason: 应用入口涉及安全配置和性能
  - **Skills**: ["fastapi"]
    - fastapi: 中间件和生命周期管理

  **Acceptance Criteria**:
  - [ ] 文件存在：app/main.py
  - [ ] FastAPI 应用正常启动
  - [ ] CORS 配置允许前端跨域
  - [ ] /api 路由已注册
  - [ ] /docs 和 /redoc 可访问
  - [ ] 日志正常输出

  **Code Structure**:
  ```python
  from fastapi import FastAPI, Request
  from fastapi.middleware.cors import CORSMiddleware
  from api.routes import router
  from contextlib import asynccontextmanager

  @asynccontextmanager
  async def lifespan(app: FastAPI):
      # 启动时初始化
      yield
      # 关闭时清理

  app = FastAPI(title="AI Assistant API", lifespan=lifespan)

  # CORS 配置
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:3000", "http://localhost:5173"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )

  # 注册路由
  app.include_router(router, prefix="/api")

  # 日志中间件
  @app.middleware("http")
  async def log_requests(request: Request, call_next):
      print(f"{request.method} {request.url.path}")
      response = await call_next(request)
      return response

  if __name__ == "__main__":
      import uvicorn
      uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
  ```

  **References**:
  - FastAPI CORS: https://fastapi.tiangolo.com/tutorial/cors/
  - FastAPI Lifespan: https://fastapi.tiangolo.com/advanced/events/

  **Commit**: YES

  ---

- [ ] 12. Docker 构建测试

  **What to do**:
  - 构建 Docker 镜像
  - 检查镜像大小
  - 启动容器
  - 验证健康检查通过

  **Must NOT do**:
  - 不使用 --no-cache 构建（测试时可用，生产不用）
  - 不忽略构建错误

  **Acceptance Criteria**:
  - [ ] `docker build -f docker/Dockerfile.backend` 构建成功
  - [ ] 镜像大小 < 200MB（优化后）
  - [ ] 容器启动并通过健康检查
  - [ ] `docker logs <container>` 无 ERROR 级别错误

  **Command**:
  ```bash
  docker build -f docker/Dockerfile.backend -t ai-ark-backend:test .
  docker run -p 8000:8000 -e DEEPSEEK_API_KEY=test_key ai-ark-backend:test
  curl http://localhost:8000/health
  ```

  **Commit**: NO

  ---

- [ ] 13. API 功能验证

  **What to do**:
  - 测试健康检查接口
  - 测试 AI 推荐接口
  - 验证响应格式正确
  - 验证日志输出正常

  **Must NOT do**:
  - 不跳过任何验证步骤
  - 不使用真实的 API Key 进行测试（使用测试 Key）

  **Acceptance Criteria**:
  - [ ] 健康检查返回 `{"status": "healthy"}`
  - [ ] AI 推荐接口返回结构化响应
  - [ ] 响应包含 `id`, `message`, `usage` 字段
  - [ ] 日志显示请求处理正常

  **Commands**:
  ```bash
  # 健康检查
  curl http://localhost:8000/health

  # AI 推荐测试
  curl -X POST http://localhost:8000/api/ask \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role": "user", "content": "推荐一个AI写作工具"}]}'
  ```

  **Commit**: NO

  ---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 4-11 | `feat(backend): 添加 FastAPI 后端和 DeepSeek 集成` | app/*.py, requirements.txt, .env.example | Docker 构建测试 |

---

## Success Criteria

### 验证命令
```bash
# Docker 构建
docker build -f docker/Dockerfile.backend -t ai-ark-backend:latest .

# 运行容器
docker run -p 8000:8000 -e DEEPSEEK_API_KEY=your_key ai-ark-backend:latest

# 健康检查
curl http://localhost:8000/health
# 预期: {"status":"healthy"}

# AI 推荐测试
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "推荐AI写作工具"}]}'
# 预期: 返回包含工具推荐的 JSON 响应
```

### 最终检查清单
- [ ] 所有"Must Have"已实现
- [ ] 所有"Must NOT Have"已避免
- [ ] Docker 镜像构建成功
- [ ] 健康检查接口正常
- [ ] AI 推荐接口正常
- [ ] 无敏感信息泄露
- [ ] 日志正常输出
