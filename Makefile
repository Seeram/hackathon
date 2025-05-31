.PHONY: help build up down logs clean dev prod prod-deploy restart

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make prod-deploy - Deploy to production with full rebuild"
	@echo "  make build    - Build all services"
	@echo "  make up       - Start all services in background"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs from all services"
	@echo "  make backup   - Create database backup"
	@echo "  make restore  - Restore database from backup"
	@echo "  make health   - Run production health checks"
	@echo "  make dozzle   - Open Dozzle log viewer (production)"
	@echo "  make dozzle-dev - Open Dozzle log viewer (development)"
	@echo "  make clean    - Remove all containers and volumes"

# Development environment
dev:
	docker compose -f docker-compose.dev.yml up --build

# Production environment
prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Production deployment with full rebuild
prod-deploy:
	./scripts/deploy-prod.sh

# Build all services
build:
	docker compose build

# Start services in background
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Restart services
restart:
	docker compose restart

# View logs
logs:
	docker compose logs -f

# Database backup
backup:
	@echo "Creating database backup..."
	./scripts/backup-database.sh

# Database restore (requires BACKUP_FILE parameter)
restore:
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "Usage: make restore BACKUP_FILE=database_backup_YYYYMMDD_HHMMSS.sql.gz"; \
		echo "Available backups:"; \
		ls -la ./backups/database_backup_*.sql.gz 2>/dev/null || echo "No backups found"; \
	else \
		./scripts/restore-database.sh $(BACKUP_FILE); \
	fi

# Production health check
health:
	@echo "Running production health checks..."
	./scripts/health-check.sh

# Open Dozzle log viewer for production
dozzle:
	@echo "Opening Dozzle log viewer at http://localhost:9999"
	@open http://localhost:9999 2>/dev/null || echo "Please open http://localhost:9999 in your browser"

# Open Dozzle log viewer for development
dozzle-dev:
	@echo "Opening Dozzle log viewer at http://localhost:9998"
	@open http://localhost:9998 2>/dev/null || echo "Please open http://localhost:9998 in your browser"

# Clean up everything
clean:
	docker compose down -v --remove-orphans
	docker system prune -f
