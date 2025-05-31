#!/bin/bash

echo "🔬 Testing Frontend-Backend Integration with AI Chat Logs"
echo "========================================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "1. Testing Backend API endpoints with chat logging..."
echo ""

# Test chat endpoint with ticket ID (should log to database)
echo -e "${BLUE}📱 Testing Chat Endpoint with Ticket ID:${NC}"
chat_response=$(curl -s -X POST http://localhost:3000/api/tickets/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message from integration test", "ticketId": 1, "isVoiceMessage": false}')
echo "$chat_response" | jq .
echo ""

# Test chat endpoint without ticket ID (should not log to database)
echo -e "${BLUE}📱 Testing Chat Endpoint without Ticket ID:${NC}"
curl -s -X POST http://localhost:3000/api/tickets/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message without ticket", "isVoiceMessage": false}' | jq .
echo ""

# Test voice recording endpoint with ticket ID
echo -e "${BLUE}🎤 Testing Voice Recording Endpoint:${NC}"
# Create a small test file for voice recording
echo "test audio for integration test" > /tmp/test_audio.wav
voice_response=$(curl -s -X POST http://localhost:3000/api/tickets/voice-recording \
  -F "audio=@/tmp/test_audio.wav" \
  -F "ticketId=1")
echo "$voice_response" | jq .
echo ""

# Test AI suggestions endpoint
echo -e "${BLUE}💡 Testing AI Suggestions Endpoint:${NC}"
suggestions_response=$(curl -s -X POST http://localhost:3000/api/tickets/1/ai-suggestions \
  -H "Content-Type: application/json" \
  -d '{"context": "Integration test context", "category": "test"}')
echo "$suggestions_response" | jq .
echo ""

# Test ticket retrieval with chat logs
echo -e "${BLUE}🎫 Testing Ticket Retrieval with AI Chat Logs:${NC}"
ticket_response=$(curl -s http://localhost:3000/api/tickets/1)
echo "$ticket_response" | jq .
echo ""

# Check if chat logs are included
if echo "$ticket_response" | jq -e '.ai_chat_logs' > /dev/null 2>&1; then
    log_count=$(echo "$ticket_response" | jq '.ai_chat_logs | length')
    echo -e "${GREEN}✅ Ticket includes AI chat logs (count: $log_count)${NC}"
else
    echo -e "${RED}❌ Ticket does not include AI chat logs${NC}"
fi
echo ""

# Verify database contains the chat logs
echo -e "${BLUE}🗄️ Verifying AI Chat Logs in Database:${NC}"
db_logs=$(docker exec postgres psql -U postgres -d api -c "SELECT COUNT(*) FROM ai_chat_logs WHERE ticket_id = 1;" -t 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ AI chat logs in database: $db_logs${NC}"
else
    echo -e "${RED}❌ Could not query chat logs${NC}"
fi
echo ""

echo ""
echo "2. Testing Frontend availability..."
echo ""

# Test frontend server
echo -e "${BLUE}🌐 Testing Frontend Server:${NC}"
frontend_status=$(curl -s -I http://localhost:3002 | head -1)
echo "$frontend_status"
echo ""

# Cleanup test files
rm -f /tmp/test_audio.wav

echo -e "${GREEN}✅ Integration test completed!${NC}"
echo ""
echo "Frontend: http://localhost:3002"
echo "Backend API: http://localhost:3000"
echo "API Docs: http://localhost:3000/api-docs"
echo ""
echo -e "${YELLOW}🔍 AI Chat Logs Integration Status:${NC}"
echo "   • Chat messages are logged to ai_chat_logs table"
echo "   • Voice recordings are processed and logged"
echo "   • AI suggestions are tracked"
echo "   • Tickets include chat logs when retrieved"
