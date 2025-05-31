#!/bin/bash

# Production Health Check Script
# Usage: ./scripts/health-check.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 Production Health Check${NC}"
echo "=========================="

# Check Docker services
echo -e "\n${BLUE}🐳 Docker Services Status:${NC}"
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Health check variables
HEALTH_ISSUES=0

# Function to check endpoint
check_endpoint() {
    local url="$1"
    local name="$2"
    local expected_code="${3:-200}"
    
    echo -n "  Checking ${name}... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✅ OK (${response})${NC}"
    else
        echo -e "${RED}❌ FAILED (${response})${NC}"
        HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
    fi
}

# Function to check database
check_database() {
    echo -n "  Checking database connection... "
    
    if docker compose exec -T postgres pg_isready -U postgres -d api >/dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
        HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
    fi
}

# Function to check disk space
check_disk_space() {
    echo -n "  Checking disk space... "
    
    # Get disk usage percentage for root partition
    disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -lt 85 ]; then
        echo -e "${GREEN}✅ OK (${disk_usage}% used)${NC}"
    elif [ "$disk_usage" -lt 95 ]; then
        echo -e "${YELLOW}⚠️  WARNING (${disk_usage}% used)${NC}"
    else
        echo -e "${RED}❌ CRITICAL (${disk_usage}% used)${NC}"
        HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
    fi
}

# Function to check memory usage
check_memory() {
    echo -n "  Checking memory usage... "
    
    # Get memory usage percentage (macOS compatible)
    if command -v vm_stat >/dev/null 2>&1; then
        # macOS using vm_stat
        memory_info=$(vm_stat | grep -E "(free|inactive|active|wired)")
        pages_free=$(echo "$memory_info" | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
        pages_inactive=$(echo "$memory_info" | grep "Pages inactive" | awk '{print $3}' | sed 's/\.//')
        pages_active=$(echo "$memory_info" | grep "Pages active" | awk '{print $3}' | sed 's/\.//')
        pages_wired=$(echo "$memory_info" | grep "Pages wired down" | awk '{print $4}' | sed 's/\.//')
        
        # Calculate memory usage (rough approximation)
        total_pages=$((pages_free + pages_inactive + pages_active + pages_wired))
        used_pages=$((pages_active + pages_wired))
        
        if [ "$total_pages" -gt 0 ]; then
            memory_usage=$((used_pages * 100 / total_pages))
        else
            memory_usage=0
        fi
    elif command -v free >/dev/null 2>&1; then
        # Linux using free command
        memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    else
        echo -e "${YELLOW}⚠️  Cannot determine memory usage${NC}"
        return
    fi
    
    if [ "$memory_usage" -lt 85 ]; then
        echo -e "${GREEN}✅ OK (${memory_usage}% used)${NC}"
    elif [ "$memory_usage" -lt 95 ]; then
        echo -e "${YELLOW}⚠️  WARNING (${memory_usage}% used)${NC}"
    else
        echo -e "${RED}❌ CRITICAL (${memory_usage}% used)${NC}"
        HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
    fi
}

# Perform health checks
echo -e "\n${BLUE}🔍 Application Health Checks:${NC}"
check_endpoint "http://localhost/" "Frontend" "200"
check_endpoint "http://localhost/api/health" "API Health" "200"
check_endpoint "http://localhost/api-docs/" "API Documentation" "200"
check_endpoint "http://localhost:9999" "Dozzle Monitoring" "200"

echo -e "\n${BLUE}🗄️  Database Health Checks:${NC}"
check_database

echo -e "\n${BLUE}💻 System Health Checks:${NC}"
check_disk_space
check_memory

# Check Docker container stats
echo -e "\n${BLUE}📊 Container Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -6

# Check recent logs for errors
echo -e "\n${BLUE}📋 Recent Error Analysis:${NC}"
echo "  Checking for recent errors in logs..."

# Check API errors (last 50 lines)
api_errors=$(docker compose logs --tail=50 api 2>/dev/null | grep -i "error\|exception\|failed" | wc -l)
if [ "$api_errors" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️  Found ${api_errors} error(s) in API logs${NC}"
else
    echo -e "  ${GREEN}✅ No errors in recent API logs${NC}"
fi

# Check nginx errors
nginx_errors=$(docker compose logs --tail=50 nginx 2>/dev/null | grep -i "error" | wc -l)
if [ "$nginx_errors" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️  Found ${nginx_errors} error(s) in nginx logs${NC}"
else
    echo -e "  ${GREEN}✅ No errors in recent nginx logs${NC}"
fi

# Final health report
echo -e "\n${BLUE}📈 Health Report Summary:${NC}"
echo "================================"

if [ "$HEALTH_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    echo -e "${GREEN}✅ No critical issues detected${NC}"
    exit 0
else
    echo -e "${RED}❌ ${HEALTH_ISSUES} issue(s) detected${NC}"
    echo -e "${YELLOW}⚠️  Please review and address the issues above${NC}"
    exit 1
fi
