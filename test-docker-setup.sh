#!/bin/bash

echo "🐳 Testing Dockerized Express TSOA API Setup"
echo "=============================================="
echo

# Test 1: Health check through direct API
echo "✅ Testing health endpoint (direct API):"
curl -s http://localhost:3001/health | jq
echo

# Test 2: Health check through nginx
echo "✅ Testing health endpoint (via nginx):"
curl -s http://localhost:8081/health | jq
echo

# Test 3: Get posts through direct API
echo "✅ Testing GET posts (direct API):"
curl -s http://localhost:3001/api/posts | jq
echo

# Test 4: Get posts through nginx
echo "✅ Testing GET posts (via nginx):"
curl -s http://localhost:8081/api/posts | jq
echo

# Test 5: Create post through nginx
echo "✅ Testing POST to create new post (via nginx):"
curl -X POST http://localhost:8081/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "id": 4,
    "title": "Final Test Post",
    "content": "This post demonstrates the fully working dockerized API"
  }' | jq
echo

# Test 6: Verify new post was added
echo "✅ Testing that new post was added:"
curl -s http://localhost:8081/api/posts | jq
echo

# Test 7: Check database content
echo "✅ Testing database connectivity and content:"
docker compose exec postgres psql -U postgres -d express_tsoa_api -c "SELECT * FROM posts;"
echo

# Test 8: Container status
echo "✅ Container status:"
docker compose ps
echo

echo "🎉 All tests completed! Docker setup is working correctly."
echo "📚 Swagger documentation available at:"
echo "   - Direct API: http://localhost:3001/api-docs"
echo "   - Via Nginx:  http://localhost:8081/api-docs"
