#!/bin/bash

# Production Database Restore Script
# Usage: ./scripts/restore-database.sh [backup_file]

set -e

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="postgres"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Database Restore Process${NC}"
echo "================================="

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}📂 Available backups:${NC}"
    ls -la "${BACKUP_DIR}"/database_backup_*.sql.gz 2>/dev/null || echo "No backups found"
    echo ""
    echo -e "${RED}❌ Please provide a backup file${NC}"
    echo -e "${BLUE}Usage: $0 <backup_file>${NC}"
    echo -e "${BLUE}Example: $0 database_backup_20240531_123456.sql.gz${NC}"
    exit 1
fi

BACKUP_FILE="$1"
BACKUP_PATH=""

# Check if file exists (with or without path)
if [ -f "${BACKUP_FILE}" ]; then
    BACKUP_PATH="${BACKUP_FILE}"
elif [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"
else
    echo -e "${RED}❌ Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Backup file: ${BACKUP_PATH}${NC}"

# Check if PostgreSQL container is running
if ! docker compose ps | grep -q "${CONTAINER_NAME}.*Up"; then
    echo -e "${RED}❌ PostgreSQL container is not running${NC}"
    echo -e "${YELLOW}💡 Run: docker compose up postgres -d${NC}"
    exit 1
fi

# Warning about data loss
echo -e "\n${YELLOW}⚠️  WARNING: This will replace all existing data!${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Operation cancelled${NC}"
    exit 0
fi

# Stop API service to prevent connections
echo -e "\n${BLUE}🛑 Stopping API service...${NC}"
docker compose stop api || true

# Drop and recreate database
echo -e "${BLUE}🗑️  Dropping existing database...${NC}"
docker compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS api;"
docker compose exec postgres psql -U postgres -c "CREATE DATABASE api;"

# Restore from backup
echo -e "${BLUE}🔄 Restoring database...${NC}"
if [[ "${BACKUP_PATH}" == *.gz ]]; then
    # Compressed backup
    gunzip -c "${BACKUP_PATH}" | docker compose exec -T postgres psql -U postgres -d api
else
    # Uncompressed backup
    cat "${BACKUP_PATH}" | docker compose exec -T postgres psql -U postgres -d api
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
else
    echo -e "${RED}❌ Database restore failed${NC}"
    exit 1
fi

# Restart API service
echo -e "\n${BLUE}🚀 Starting API service...${NC}"
docker compose start api

# Wait for API to be ready
echo -e "${BLUE}⏳ Waiting for API to be ready...${NC}"
sleep 5

# Test API health
if curl -s -f http://localhost/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API is healthy and ready${NC}"
else
    echo -e "${YELLOW}⚠️  API may still be starting up${NC}"
fi

echo -e "\n${GREEN}🎉 Database restore completed!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo "   - Verify data integrity"
echo "   - Check application functionality"
echo "   - Monitor logs: docker compose logs api"
