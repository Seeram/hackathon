# Generated API Client Documentation

This project now uses a TypeScript API client automatically generated from the backend Swagger specification using `swagger-typescript-api`.

## Generated Files

- `src/api/Api.ts` - Main generated API client with all types and methods
- `src/api/index.ts` - Convenience wrapper with pre-configured client instance
- `src/services/api.ts` - Backward compatibility exports

## Usage

### Basic Usage

```typescript
import { apiClient, ticketService } from './api';

// Get all tickets
const tickets = await ticketService.getAllTickets();

// Get tickets with filters
const urgentTickets = await ticketService.getAllTickets({
  priority: 'urgent',
  status: 'assigned'
});

// Create a new ticket
const newTicket = await ticketService.createTicket({
  title: 'Fix broken pipe',
  assigned_technician_id: 1,
  priority: 'high',
  description: 'Customer reports water leak in basement'
});

// Update ticket status
await ticketService.updateTicketStatus(1, 123, 'in_progress');
```

### Advanced Usage

```typescript
import { Api } from './api/Api';

// Create a custom API instance with custom configuration
const customApi = new Api({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
});

// Use the custom instance
const tickets = await customApi.tickets.getAllTickets();
```

### Available Methods

#### Tickets
- `getAllTickets(filters?)` - Get all tickets with optional filters
- `getTicket(id)` - Get a specific ticket by ID
- `createTicket(data)` - Create a new ticket
- `updateTicket(id, data)` - Update an existing ticket
- `deleteTicket(id)` - Delete a ticket

#### Technicians
- `getTechnicianTickets(technicianId, status?)` - Get tickets for a specific technician
- `updateTicketStatus(technicianId, ticketId, status)` - Update ticket status

### Types

All TypeScript types are automatically generated and exported:

```typescript
import type {
  Ticket,
  TicketAttachment,
  CreateTicketRequest,
  UpdateTicketRequest
} from './api';
```

## Regenerating the Client

When the backend API changes, regenerate the client:

```bash
npm run generate-api
```

This will:
1. Read the latest Swagger specification from `../api/public/swagger.json`
2. Generate a new TypeScript client with all the latest types and methods
3. Preserve your existing configuration in `src/api/index.ts`

## Configuration

The API client can be configured via environment variables:

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

Or modify the configuration in `src/api/index.ts`:

```typescript
const apiClient = new Api({
  baseURL: 'your-api-url',
  timeout: 10000,
  // ... other axios config options
});
```

## Error Handling

The generated client uses axios and will throw errors for HTTP error responses. Handle them appropriately:

```typescript
try {
  const ticket = await ticketService.getTicket(123);
} catch (error) {
  console.error('Failed to fetch ticket:', error);
  // Handle error appropriately
}
```
