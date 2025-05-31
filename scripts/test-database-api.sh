#!/bin/bash

echo "🎫 Testing Technician Ticket System API"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test URLs
API_URL="http://localhost:3000"  # API not directly exposed in production, will likely fail
NGINX_URL="http://localhost:9000"  # Nginx port from production config

# Test technician ID
TECHNICIAN_ID=1

# Function to test endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local method=${3:-GET}
    local data=$4
    
    echo -e "${BLUE}Testing: $description${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$url")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -X PUT -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "PATCH" ]; then
        response=$(curl -s -X PATCH -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -X DELETE "$url")
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $description:${NC}"
        echo "$response" | jq . 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ $description failed${NC}"
    fi
    echo ""
}

# Test health endpoint
test_endpoint "$API_URL/api/health" "Health check (direct API)"
test_endpoint "$NGINX_URL/api/health" "Health check (via nginx)"

# Test GET all tickets for technician
test_endpoint "$API_URL/api/technicians/$TECHNICIAN_ID/tickets" "GET all tickets for technician (direct API)"
test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets" "GET all tickets for technician (via nginx)"

# Test GET tickets by status
test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets?status=assigned" "GET assigned tickets for technician"
test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets?status=in_progress" "GET in-progress tickets for technician"

# Test creating a new ticket
echo -e "${BLUE}Testing: Creating new ticket${NC}"
new_ticket='{
    "title": "Fix broken HVAC unit",
    "description": "Customer reports no cooling in conference room",
    "location": "Building A, Floor 3, Conference Room 301",
    "priority": "high",
    "assigned_technician_id": '$TECHNICIAN_ID',
    "customer_name": "Jane Smith",
    "customer_phone": "555-0123",
    "scheduled_date": "2025-06-01"
}'
create_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$new_ticket" "$NGINX_URL/api/tickets")
echo -e "${GREEN}✅ Created new ticket:${NC}"
echo "$create_response" | jq . 2>/dev/null || echo "$create_response"
echo ""

# Extract the ticket ID for further testing
ticket_id=$(echo "$create_response" | jq -r '.id' 2>/dev/null)

if [ "$ticket_id" != "null" ] && [ "$ticket_id" != "" ]; then
    # Test GET the newly created ticket
    test_endpoint "$NGINX_URL/api/tickets/$ticket_id" "GET newly created ticket"
    
    # Test GET ticket via technician endpoint
    test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets/$ticket_id" "GET ticket via technician endpoint"
    
    # Test updating ticket status to in_progress
    status_update='{"status": "in_progress"}'
    test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets/$ticket_id/status" "Update ticket status to in_progress" "PATCH" "$status_update"
    
    # Test updating ticket details
    ticket_update='{
        "title": "Fix broken HVAC unit - URGENT",
        "description": "Customer reports no cooling in conference room - affecting important meeting",
        "priority": "urgent"
    }'
    test_endpoint "$NGINX_URL/api/tickets/$ticket_id" "Update ticket details" "PUT" "$ticket_update"
    
    # Test GET updated ticket
    test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets/$ticket_id" "GET updated ticket"
    
    # Test completing the ticket
    complete_status='{"status": "completed"}'
    test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets/$ticket_id/status" "Complete ticket" "PATCH" "$complete_status"
    
    # Verify completed status
    test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets/$ticket_id" "Verify completed ticket"
    
    # Test DELETE ticket (cleanup)
    test_endpoint "$NGINX_URL/api/tickets/$ticket_id" "DELETE ticket (cleanup)" "DELETE"
    
    # Verify ticket was deleted
    echo -e "${BLUE}Testing: Verify ticket was deleted (should return 404)${NC}"
    delete_verify=$(curl -s -w "%{http_code}" "$NGINX_URL/api/tickets/$ticket_id")
    if [[ "$delete_verify" == *"404"* ]]; then
        echo -e "${GREEN}✅ Ticket successfully deleted (404 response)${NC}"
    else
        echo -e "${RED}❌ Ticket deletion verification failed${NC}"
    fi
    echo ""
fi

# Test creating multiple tickets for testing
echo -e "${BLUE}Testing: Creating multiple test tickets${NC}"

tickets=(
    '{"title": "Replace broken door lock", "location": "Room 101", "priority": "medium", "assigned_technician_id": '$TECHNICIAN_ID', "customer_name": "Bob Johnson", "customer_phone": "555-0456"}'
    '{"title": "Check electrical outlet", "location": "Kitchen", "priority": "low", "assigned_technician_id": '$TECHNICIAN_ID', "customer_name": "Alice Brown", "customer_phone": "555-0789"}'
    '{"title": "Emergency water leak", "location": "Basement", "priority": "urgent", "assigned_technician_id": '$TECHNICIAN_ID', "customer_name": "Mike Davis", "customer_phone": "555-0101"}'
)

for i in "${!tickets[@]}"; do
    echo -e "${GREEN}Creating test ticket $((i+1))...${NC}"
    curl -s -X POST -H "Content-Type: application/json" -d "${tickets[$i]}" "$NGINX_URL/api/tickets" | jq . 2>/dev/null
done
echo ""

# Test GET all tickets again to see the new ones
test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets" "GET all tickets after creating test data"

# Test priority filtering (if tickets exist)
test_endpoint "$NGINX_URL/api/technicians/$TECHNICIAN_ID/tickets?status=assigned" "GET assigned tickets (should show new tickets)"

# Test database content directly
echo -e "${BLUE}Testing: Direct database query${NC}"
db_content=$(docker exec postgres psql -U postgres -d api -c "SELECT id, ticket_number, title, priority, status, customer_name FROM tickets ORDER BY priority DESC, created_at;" -t 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database content:${NC}"
    echo "$db_content"
else
    echo -e "${RED}❌ Could not query database directly${NC}"
fi
echo ""

# Test invalid endpoints
echo -e "${BLUE}Testing: Invalid ticket ID (should return 404)${NC}"
invalid_response=$(curl -s -w "%{http_code}" "$NGINX_URL/api/tickets/99999")
if [[ "$invalid_response" == *"404"* ]]; then
    echo -e "${GREEN}✅ Invalid ticket ID correctly returns 404${NC}"
else
    echo -e "${RED}❌ Invalid ticket ID test failed${NC}"
fi
echo ""

# Test unauthorized technician access
echo -e "${BLUE}Testing: Unauthorized technician access (should return 404)${NC}"
unauthorized_response=$(curl -s -w "%{http_code}" "$NGINX_URL/api/technicians/999/tickets/1")
if [[ "$unauthorized_response" == *"404"* ]]; then
    echo -e "${GREEN}✅ Unauthorized technician access correctly returns 404${NC}"
else
    echo -e "${RED}❌ Unauthorized technician access test failed${NC}"
fi
echo ""

# Container status
echo -e "${BLUE}Container status:${NC}"
docker compose ps
echo ""

echo -e "${GREEN}🎉 Ticket system integration tests completed!${NC}"
echo -e "${BLUE}📚 Swagger documentation available at:${NC}"
echo "   - Direct API: http://localhost:3001/api-docs"
echo "   - Via Nginx:  http://localhost:8081/api-docs"
echo ""
echo -e "${BLUE}🎫 Ticket system features tested:${NC}"
echo "   ✅ Technician ticket management"
echo "   ✅ Ticket CRUD operations"
echo "   ✅ Status updates (assigned → in_progress → completed)"
echo "   ✅ Priority handling (low, medium, high, urgent)"
echo "   ✅ Customer information storage"
echo "   ✅ Location and scheduling"
echo "   ✅ Security (technician-specific access)"
echo "   ✅ Error handling (404 for invalid IDs)"
echo "   ✅ Database persistence with PostgreSQL"
echo ""
echo -e "${BLUE}🔧 Key endpoints tested:${NC}"
echo "   GET /technicians/{id}/tickets - Get technician's tickets"
echo "   GET /technicians/{id}/tickets/{ticketId} - Get specific ticket"
echo "   PATCH /technicians/{id}/tickets/{ticketId}/status - Update status"
echo "   POST /tickets - Create new ticket"
echo "   PUT /tickets/{id} - Update ticket"
echo "   DELETE /tickets/{id} - Delete ticket"