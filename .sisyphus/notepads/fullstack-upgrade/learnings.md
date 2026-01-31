# Fullstack Upgrade - Learnings

## Conventions
- Python modules use lowercase with underscores
- Environment variables use UPPERCASE
- Docker services use hyphens in names

## Gotchas
- DATABASE_URL must include charset=utf8mb4 for MySQL
- SQLAlchemy 2.0 uses text() for raw SQL
- Nginx proxy_set_header requires explicit Host header
- LSP errors in local environment are normal (Python deps not installed locally)

## Decisions
- Using SQLAlchemy 2.0 ORM pattern
- MySQL 8.0 with utf8mb4 encoding
- nginx:alpine for minimal image size
- Dual deployment: standard Docker + 1Panel support

## Final Summary (2026-01-31)
- Completed 11/11 tasks
- All files generated successfully
- Architecture: Static HTML → Full-stack (FastAPI + MySQL + Nginx)
- Deployment: docker-compose up -d --build
