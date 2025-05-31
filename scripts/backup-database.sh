#!/bin/bash

# Production Database Backup Script
# Usage: ./scripts/backup-database.sh

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="database_backup_${DATE}.sql"
CONTAINER_NAME="postgres"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗃️  Starting Database Backup Process${NC}"
echo "================================================"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Check if PostgreSQL container is running
if ! docker compose ps | grep -q "${CONTAINER_NAME}.*Up"; then
    echo -e "${RED}❌ PostgreSQL container is not running${NC}"
    echo -e "${YELLOW}💡 Run: docker compose up postgres -d${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Database container status:${NC}"
docker compose ps postgres

# Create backup
echo -e "\n${BLUE}🔄 Creating database backup...${NC}"
docker compose exec postgres pg_dump -U postgres -d api > "${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
    echo -e "${GREEN}✅ Backup created successfully!${NC}"
    echo -e "${BLUE}📁 File: ${BACKUP_DIR}/${BACKUP_FILE}${NC}"
    echo -e "${BLUE}📏 Size: ${BACKUP_SIZE}${NC}"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# Compress backup
echo -e "\n${BLUE}🗜️  Compressing backup...${NC}"
gzip "${BACKUP_DIR}/${BACKUP_FILE}"
COMPRESSED_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}.gz" | cut -f1)
echo -e "${GREEN}✅ Backup compressed: ${BACKUP_FILE}.gz (${COMPRESSED_SIZE})${NC}"

# Cleanup old backups (keep last 10)
echo -e "\n${BLUE}🧹 Cleaning up old backups...${NC}"
cd "${BACKUP_DIR}"
ls -1t database_backup_*.sql.gz | tail -n +11 | xargs -r rm
REMAINING_BACKUPS=$(ls -1 database_backup_*.sql.gz 2>/dev/null | wc -l || echo "0")
echo -e "${GREEN}✅ Cleanup complete. ${REMAINING_BACKUPS} backups retained${NC}"

echo -e "\n${GREEN}🎉 Database backup process completed!${NC}"
echo -e "${BLUE}📋 Backup Summary:${NC}"
echo "   - File: ${BACKUP_FILE}.gz"
echo "   - Size: ${COMPRESSED_SIZE}"
echo "   - Location: ${BACKUP_DIR}/"
echo "   - Retained backups: ${REMAINING_BACKUPS}"
