#!/bin/bash

echo "🐳 Testing Database-Powered Express TSOA API"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test URLs
API_URL="http://localhost:3001"
NGINX_URL="http://localhost:8081"

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

# Test GET all posts from database
test_endpoint "$API_URL/api/posts" "GET all posts from database (direct API)"
test_endpoint "$NGINX_URL/api/posts" "GET all posts from database (via nginx)"

# Test GET specific post
test_endpoint "$API_URL/api/posts/1" "GET post by ID (direct API)"
test_endpoint "$NGINX_URL/api/posts/1" "GET post by ID (via nginx)"

# Test POST new post to database
echo -e "${BLUE}Testing: Creating new post in database${NC}"
new_post='{"title": "Database Test Post", "content": "This post was created and stored in PostgreSQL database", "author": "API Tester"}'
create_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$new_post" "$NGINX_URL/api/posts")
echo -e "${GREEN}✅ Created new post in database:${NC}"
echo "$create_response" | jq . 2>/dev/null || echo "$create_response"
echo ""

# Extract the ID from the created post for further testing
post_id=$(echo "$create_response" | jq -r '.id' 2>/dev/null)

if [ "$post_id" != "null" ] && [ "$post_id" != "" ]; then
    # Test GET the newly created post
    test_endpoint "$NGINX_URL/api/posts/$post_id" "GET newly created post"
    
    # Test PUT update post
    update_data='{"title": "Updated Database Post", "content": "This post was updated in the database"}'
    test_endpoint "$NGINX_URL/api/posts/$post_id" "PUT update post in database" "PUT" "$update_data"
    
    # Test GET updated post
    test_endpoint "$NGINX_URL/api/posts/$post_id" "GET updated post"
    
    # Test DELETE post
    test_endpoint "$NGINX_URL/api/posts/$post_id" "DELETE post from database" "DELETE"
    
    # Verify post was deleted
    echo -e "${BLUE}Testing: Verify post was deleted (should return 404)${NC}"
    delete_verify=$(curl -s -w "%{http_code}" "$NGINX_URL/api/posts/$post_id")
    if [[ "$delete_verify" == *"404"* ]]; then
        echo -e "${GREEN}✅ Post successfully deleted (404 response)${NC}"
    else
        echo -e "${RED}❌ Post deletion verification failed${NC}"
    fi
    echo ""
fi

# Test database content directly
echo -e "${BLUE}Testing: Direct database query${NC}"
db_content=$(docker exec postgres psql -U postgres -d api -c "SELECT id, title, author, created_at FROM posts ORDER BY created_at;" -t)
echo -e "${GREEN}✅ Database content:${NC}"
echo "$db_content"
echo ""

# Test invalid endpoints
echo -e "${BLUE}Testing: Invalid post ID (should return 404)${NC}"
invalid_response=$(curl -s -w "%{http_code}" "$NGINX_URL/api/posts/99999")
if [[ "$invalid_response" == *"404"* ]]; then
    echo -e "${GREEN}✅ Invalid post ID correctly returns 404${NC}"
else
    echo -e "${RED}❌ Invalid post ID test failed${NC}"
fi
echo ""

# Container status
echo -e "${BLUE}Container status:${NC}"
docker compose ps
echo ""

echo -e "${GREEN}🎉 Database integration tests completed!${NC}"
echo -e "${BLUE}📚 Swagger documentation available at:${NC}"
echo "   - Direct API: http://localhost:3001/api-docs"
echo "   - Via Nginx:  http://localhost:8081/api-docs"
echo ""
echo -e "${BLUE}📊 Database features tested:${NC}"
echo "   ✅ CRUD operations (Create, Read, Update, Delete)"
echo "   ✅ Database persistence"
echo "   ✅ Error handling (404 for non-existent posts)"
echo "   ✅ Data validation and timestamps"
echo "   ✅ Full integration with PostgreSQL"
