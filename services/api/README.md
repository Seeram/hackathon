# API Service

Express.js REST API built with TypeScript and TSOA for type-safe development and automatic OpenAPI documentation generation.

## Overview

This service provides the backend API for the hackathon project with:
- Type-safe API development using TSOA
- Automatic Swagger/OpenAPI documentation
- PostgreSQL database integration with Knex.js ORM
- Comprehensive error handling and validation
- Health check endpoints

## Technology Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **API Documentation**: TSOA + Swagger UI
- **Database**: PostgreSQL with Knex.js ORM
- **Validation**: TSOA runtime validation
- **Environment**: Docker containerized

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Generate API routes and documentation
npm run swagger

# Development with auto-reload
npm run dev:watch

# Build for production
npm run build

# Start production server
npm start
```

### API Documentation

Once running, visit:
- **Development**: http://localhost:3001/api-docs
- **Production**: http://localhost/api-docs

### Database Integration

The API connects to PostgreSQL using Knex.js:
- Schema initialization scripts in `/services/db/`
- Database migrations and seeds supported
- Connection pooling and health checks included

### Docker Usage

```bash
# Build API container
docker build -t api-service .

# Run with Docker Compose
docker compose up api
```

## API Endpoints

- **Health Check**: `GET /health`
- **API Documentation**: `GET /api-docs`
- **Posts**: CRUD operations for posts
- Additional endpoints auto-documented via Swagger

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | postgres |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | api |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | password |
  ```json
  {
    "title": "Post Title",
    "content": "Post Content"
  }
  ```
- **Response:**
  ```json
  {
    "id": "1",
    "title": "Post Title",
    "content": "Post Content"
  }
  ```

## License

This project is licensed under the MIT License.