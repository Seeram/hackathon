.PHONY: help build up down logs clean dev prod restart

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make build    - Build all services"
	@echo "  make up       - Start all services in background"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs from all services"
	@echo "  make dozzle   - Open Dozzle log viewer (production)"
	@echo "  make dozzle-dev - Open Dozzle log viewer (development)"
	@echo "  make clean    - Remove all containers and volumes"

# Development environment
dev:
	docker compose -f docker-compose.dev.yml up --build

# Production environment
prod:
	docker compose up --build -d

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
