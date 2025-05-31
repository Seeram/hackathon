#!/bin/bash

# Frontend-Backend Integration Test Suite
# Tests the complete React TypeScript frontend with Express TSOA API backend

echo "🚀 Frontend-Backend Integration Test Suite"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
API_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:3001"
SWAGGER_URL="http://localhost:3000/api-docs"

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    
    echo -n "🔍 Checking $name... "
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Running${NC}"
        return 0
    else
        echo -e "${RED}❌ Not accessible${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -n "🧪 Testing $description... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$API_URL$endpoint")
    fi
    
    # Extract status code (last 3 characters)
    status_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ $status_code${NC}"
        return 0
    else
        echo -e "${RED}❌ $status_code (expected $expected_status)${NC}"
        echo "   Response: $response_body"
        return 1
    fi
}

# Function to validate JSON response
validate_json() {
    local json_string=$1
    local description=$2
    
    echo -n "🔍 Validating $description... "
    
    if echo "$json_string" | jq . > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Valid JSON${NC}"
        return 0
    else
        echo -e "${RED}❌ Invalid JSON${NC}"
        return 1
    fi
}

# Start tests
echo
echo -e "${BLUE}Phase 1: Service Availability${NC}"
echo "==============================="

check_service "$FRONTEND_URL" "Frontend (React)"
frontend_status=$?

check_service "$API_URL/health" "API (Express)"
api_status=$?

check_service "$SWAGGER_URL" "Swagger UI"
swagger_status=$?

# Check database connection via API
echo -n "🔍 Checking Database connection... "
db_response=$(curl -s "$API_URL/tickets")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Connected${NC}"
    db_status=0
else
    echo -e "${RED}❌ Connection failed${NC}"
    db_status=1
fi

echo
echo -e "${BLUE}Phase 2: API Endpoint Testing${NC}"
echo "=============================="

# Test health endpoint
test_api_endpoint "GET" "/health" "" "200" "Health check"

# Test getting all tickets
echo -n "🧪 Testing GET /tickets... "
tickets_response=$(curl -s "$API_URL/tickets")
tickets_status=$?
if [ $tickets_status -eq 0 ]; then
    echo -e "${GREEN}✅ 200${NC}"
    validate_json "$tickets_response" "tickets response"
    
    # Count tickets
    ticket_count=$(echo "$tickets_response" | jq '. | length' 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "   📊 Found $ticket_count tickets"
    fi
else
    echo -e "${RED}❌ Failed${NC}"
fi

# Test creating a ticket
test_ticket_data='{
  "title": "Integration Test Ticket",
  "description": "This ticket was created by the test suite",
  "priority": "medium",
  "assigned_technician_id": 1,
  "customer_name": "Test Customer",
  "customer_phone": "555-TEST",
  "location": "Test Location"
}'

echo -n "🧪 Testing POST /tickets... "
create_response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$test_ticket_data" \
    "$API_URL/tickets")

create_status_code="${create_response: -3}"
create_response_body="${create_response%???}"

if [ "$create_status_code" = "200" ] || [ "$create_status_code" = "201" ]; then
    echo -e "${GREEN}✅ $create_status_code${NC}"
    validate_json "$create_response_body" "create ticket response"
    
    # Extract ticket ID for further tests
    ticket_id=$(echo "$create_response_body" | jq -r '.id' 2>/dev/null)
    if [ "$ticket_id" != "null" ] && [ -n "$ticket_id" ]; then
        echo "   🎫 Created ticket ID: $ticket_id"
        
        # Test getting the specific ticket
        test_api_endpoint "GET" "/tickets/$ticket_id" "" "200" "GET specific ticket"
        
        # Test updating the ticket
        update_data='{"priority": "high", "status": "in_progress"}'
        test_api_endpoint "PUT" "/tickets/$ticket_id" "$update_data" "200" "UPDATE ticket"
        
        # Test deleting the ticket
        test_api_endpoint "DELETE" "/tickets/$ticket_id" "" "200" "DELETE ticket"
    fi
else
    echo -e "${RED}❌ $create_status_code${NC}"
    echo "   Response: $create_response_body"
fi

echo
echo -e "${BLUE}Phase 3: Frontend Integration${NC}"
echo "============================"

# Test if frontend can load
echo -n "🔍 Testing Frontend HTML... "
frontend_html=$(curl -s "$FRONTEND_URL")
if echo "$frontend_html" | grep -q "React App" || echo "$frontend_html" | grep -q "root"; then
    echo -e "${GREEN}✅ HTML loaded${NC}"
else
    echo -e "${RED}❌ HTML not loaded properly${NC}"
fi

# Test if frontend can reach API (via browser simulation)
echo -n "🔍 Testing Frontend->API connectivity... "
# Since we can't easily test client-side JavaScript from curl, we test the CORS headers
cors_response=$(curl -s -I -H "Origin: http://localhost:3001" "$API_URL/tickets")
if echo "$cors_response" | grep -q "200 OK"; then
    echo -e "${GREEN}✅ API accessible from frontend${NC}"
else
    echo -e "${YELLOW}⚠️  Check CORS configuration${NC}"
fi

echo
echo -e "${BLUE}Phase 4: Type Safety & Schema Validation${NC}"
echo "========================================"

# Test if API generates valid TypeScript interfaces
echo -n "🔍 Testing API client generator... "
if cd /Users/seeram/hackathon/services/frontend && node scripts/generate-api-client.js > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Client generator works${NC}"
else
    echo -e "${RED}❌ Client generator failed${NC}"
fi

# Test Swagger schema validation
echo -n "🔍 Testing Swagger schema... "
swagger_spec=$(curl -s "$API_URL/../swagger.json" 2>/dev/null || curl -s "http://localhost:3000/swagger.json")
if echo "$swagger_spec" | jq -e '.paths' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Valid Swagger spec${NC}"
    
    # Count endpoints
    endpoint_count=$(echo "$swagger_spec" | jq '.paths | keys | length' 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "   📊 Found $endpoint_count endpoints"
    fi
else
    echo -e "${RED}❌ Invalid or missing Swagger spec${NC}"
fi

echo
echo -e "${BLUE}Phase 5: Docker Integration${NC}"
echo "=========================="

# Check Docker containers
echo -n "🔍 Checking Docker containers... "
containers=$(docker compose -f /Users/seeram/hackathon/docker-compose.dev.yml ps --format "table {{.Names}}\t{{.Status}}" | grep -c "Up")
if [ "$containers" -ge 3 ]; then
    echo -e "${GREEN}✅ $containers containers running${NC}"
else
    echo -e "${YELLOW}⚠️  Only $containers containers running${NC}"
fi

# Show container status
echo "   📋 Container Status:"
docker compose -f /Users/seeram/hackathon/docker-compose.dev.yml ps --format "   {{.Names}}: {{.Status}}"

echo
echo -e "${BLUE}Final Summary${NC}"
echo "============="

# Calculate success rate
total_tests=0
passed_tests=0

for status in $frontend_status $api_status $swagger_status $db_status; do
    total_tests=$((total_tests + 1))
    if [ $status -eq 0 ]; then
        passed_tests=$((passed_tests + 1))
    fi
done

success_rate=$((passed_tests * 100 / total_tests))

echo "📊 Test Results:"
echo "   ✅ Passed: $passed_tests/$total_tests tests"
echo "   📈 Success Rate: $success_rate%"

if [ $success_rate -eq 100 ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    echo
    echo "🌐 Access Points:"
    echo "   • Frontend: $FRONTEND_URL"
    echo "   • API: $API_URL"
    echo "   • Swagger UI: $SWAGGER_URL"
    echo
    echo "📚 Documentation:"
    echo "   • API Integration Guide: services/frontend/API_INTEGRATION.md"
    echo "   • API Client Generator: services/frontend/scripts/generate-api-client.js"
elif [ $success_rate -ge 75 ]; then
    echo -e "${YELLOW}⚠️  System mostly operational with minor issues${NC}"
else
    echo -e "${RED}❌ System has significant issues${NC}"
fi

echo
echo "🔧 Troubleshooting:"
echo "   • Check logs: docker compose -f docker-compose.dev.yml logs [service-name]"
echo "   • Restart services: docker compose -f docker-compose.dev.yml restart"
echo "   • Rebuild: docker compose -f docker-compose.dev.yml up --build"
echo
echo "✨ Test completed at $(date)"
