# Frontend API Integration Guide

## Overview

This guide explains how the React TypeScript frontend integrates with the Express TSOA API backend. The integration includes proper TypeScript types, error handling, and Swagger-based client generation.

## Architecture

```
Frontend (React + TypeScript) ↔ API Client (Axios) ↔ API (Express + TSOA) ↔ Database (PostgreSQL)
```

## API Client Structure

### Base Configuration

The API client is configured in `src/services/api.ts` with:

- **Base URL**: `${REACT_APP_API_URL}/api` (defaults to `http://localhost:3000/api`)
- **Timeout**: 10 seconds
- **Headers**: Content-Type: application/json
- **Interceptors**: Request logging and error handling

### Environment Variables

```bash
# Development
REACT_APP_API_URL=http://localhost:3000

# Production (via reverse proxy)
REACT_APP_API_URL=/api
```

## TypeScript Interfaces

All interfaces match the API models exactly:

### Core Models

```typescript
export interface Ticket {
  id: number;
  ticket_number: string;           // Auto-generated: TKT-YYYYMMDD-NNNN
  title: string;
  description?: string;
  location?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_technician_id: number;
  customer_name?: string;
  customer_phone?: string;
  scheduled_date?: Date;
  created_at: Date;
  updated_at: Date;
  attachments?: TicketAttachment[];
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_technician_id: number;  // Required
  customer_name?: string;
  customer_phone?: string;
  scheduled_date?: Date;
}

export interface TicketAttachment {
  id: number;
  file_name: string;
  file_type: string;
}
```

## API Service Methods

### Ticket Operations

```typescript
// Get all tickets (with optional status filter)
ticketService.getAllTickets(status?: 'assigned' | 'in_progress' | 'completed' | 'cancelled')

// Create a new ticket
ticketService.createTicket(ticket: CreateTicketRequest)

// Update an existing ticket
ticketService.updateTicket(id: number, ticket: UpdateTicketRequest)

// Delete a ticket
ticketService.deleteTicket(id: number)
```

### Technician-Specific Operations

```typescript
// Get tickets assigned to a specific technician
ticketService.getTechnicianTickets(technicianId: number, status?: string)

// Get a specific ticket (must belong to technician)
ticketService.getTechnicianTicket(technicianId: number, ticketId: number)

// Update ticket status
ticketService.updateTicketStatus(technicianId: number, ticketId: number, statusUpdate: UpdateTicketStatusRequest)
```

### Health Check

```typescript
// Check API health
healthService.checkHealth()
```

## Error Handling

The API client includes comprehensive error handling:

### Request Interceptor
```typescript
// Logs all outgoing requests
console.log(`Making ${method} request to: ${url}`);
```

### Response Interceptor
```typescript
// Logs and handles API errors
console.error('API Error:', error.response?.data || error.message);
```

### Component-Level Error Handling
```typescript
const [error, setError] = useState<string | null>(null);

try {
  const tickets = await ticketService.getAllTickets();
  setTickets(tickets);
} catch (err) {
  setError('Failed to load tickets. Make sure the API is running.');
  console.error('Error loading tickets:', err);
}
```

## Swagger Integration

### Accessing Swagger UI

- **Development**: http://localhost:3000/api-docs
- **Production**: http://your-domain/api-docs

### Swagger Configuration

The API includes server URLs for both development and production:

```json
{
  "servers": [
    {
      "url": "http://localhost:3000/api",
      "description": "Development server"
    },
    {
      "url": "/api",
      "description": "Production server (via reverse proxy)"
    }
  ]
}
```

### Auto-Generated Client Code

Use the API client generator to create TypeScript code from Swagger:

```bash
cd services/frontend
node scripts/generate-api-client.js
```

This will analyze the Swagger specification and generate:
- TypeScript interfaces for all models
- Service methods for all endpoints
- Proper type annotations and parameter handling

## Development Workflow

### 1. API Changes
1. Update the API models/controllers
2. Run `npm run swagger` in the API service
3. Run the client generator script
4. Update frontend types and service calls

### 2. Testing API Integration
```bash
# Test API endpoints directly
curl -X GET "http://localhost:3000/api/tickets"
curl -X POST "http://localhost:3000/api/tickets" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test","assigned_technician_id":1}'

# Check API health
curl -X GET "http://localhost:3000/api/health"
```

### 3. Frontend Development
```bash
# Start development environment
docker compose -f docker-compose.dev.yml up frontend-dev api-dev postgres

# Frontend available at: http://localhost:3001
# API available at: http://localhost:3000
# Swagger UI at: http://localhost:3000/api-docs
```

## Production Deployment

### Docker Configuration

The frontend uses a multi-stage Docker build:

1. **Development**: Hot reload with React dev server
2. **Production**: Nginx serving static files with API proxy

### Nginx Reverse Proxy

The production Nginx configuration includes:

```nginx
# API proxy
location /api/ {
    proxy_pass http://api:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Serve React static files
location / {
    try_files $uri $uri/ /index.html;
}
```

## Best Practices

### 1. Type Safety
- Always use TypeScript interfaces
- Leverage generic types for API responses
- Use enum types for status/priority fields

### 2. Error Handling
- Implement try-catch blocks for all API calls
- Provide user-friendly error messages
- Log detailed errors for debugging

### 3. Performance
- Use React's useEffect with dependency arrays
- Implement loading states
- Consider caching for frequently accessed data

### 4. Development
- Use the Swagger UI for API testing
- Leverage the client generator for consistency
- Keep types synchronized between frontend and backend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API includes proper CORS headers
2. **Type Mismatches**: Regenerate client code after API changes
3. **Network Errors**: Check if API service is running
4. **404 Errors**: Verify API routes match the service calls

### Debug Tools

1. **Browser DevTools**: Check Network tab for API calls
2. **API Logs**: Use `docker compose logs api-dev`
3. **Frontend Logs**: Use `docker compose logs frontend-dev`
4. **Database**: Direct PostgreSQL queries for data verification

### Health Checks

```bash
# API Health
curl http://localhost:3000/api/health

# Frontend Availability
curl http://localhost:3001

# Database Connection
docker compose exec postgres psql -U postgres -d api -c "SELECT NOW();"
```

## Example Usage

### Creating a Complete Ticket

```typescript
const newTicket: CreateTicketRequest = {
  title: "Broken Air Conditioning",
  description: "AC unit in conference room not working",
  location: "Conference Room B",
  priority: "high",
  assigned_technician_id: 1,
  customer_name: "Jane Smith",
  customer_phone: "555-0199"
};

try {
  const createdTicket = await ticketService.createTicket(newTicket);
  console.log("Created ticket:", createdTicket.ticket_number);
} catch (error) {
  console.error("Failed to create ticket:", error);
}
```

### Filtering Tickets

```typescript
// Get only high priority tickets
const urgentTickets = await ticketService.getAllTickets("urgent");

// Get tickets for specific technician
const techTickets = await ticketService.getTechnicianTickets(1, "in_progress");
```

This integration provides a robust, type-safe, and maintainable connection between the React frontend and Express API backend.
