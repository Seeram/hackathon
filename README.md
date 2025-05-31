# Express TSOA API with Docker

A containerized Express.js API built with TypeScript, TSOA, and PostgreSQL.

## 🏗️ Architecture

- **API Service**: Express.js with TSOA for TypeScript-first API development
- **Database**: PostgreSQL 15 with automatic initialization
- **Reverse Proxy**: Nginx for load balancing and routing
- **Log Monitoring**: Dozzle for real-time container log viewing
- **Documentation**: Auto-generated Swagger/OpenAPI docs

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Running with Docker Compose

1. **Start all services:**
   ```bash
   docker compose up -d
   ```

2. **View logs:**
   ```bash
   docker compose logs -f api
   ```

3. **Stop services:**
   ```bash
   docker compose down
   ```

### Available Endpoints

- **API**: http://localhost:3001 (direct access)
- **Swagger Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health
- **Nginx Proxy**: http://localhost:8081 (reverse proxy to API)
- **Dozzle Logs**: http://localhost:9999 (real-time log viewer)

## 🛠️ Development

### Local Development Setup

1. **Install dependencies:**
   ```bash
   cd express-tsoa-api
   npm install
   ```

2. **Start PostgreSQL with Docker:**
   ```bash
   docker compose up postgres -d
   ```

3. **Copy environment file:**
   ```bash
   cp .env.local .env
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

### Docker Commands

```bash
# Build only the API service
docker compose build api

# Start only database
docker compose up postgres -d

# View database logs
docker compose logs postgres

# Execute commands in running container
docker compose exec api npm run migrate

# Rebuild and restart API
docker compose up --build api
```

## 📊 Database

### Connection Details
- **Host**: localhost (or postgres in Docker)
- **Port**: 5432
- **Database**: express_tsoa_api
- **User**: postgres
- **Password**: password

### Sample Data
The database is automatically initialized with sample posts when started.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | express_tsoa_api |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | password |

### Docker Compose Services

- **postgres**: PostgreSQL database with persistent volume
- **api**: Express.js API service
- **nginx**: Reverse proxy (optional)

## 🧪 Testing the API

### Get All Posts
```bash
curl http://localhost:3001/api/posts
curl http://localhost:8081/api/posts
```

### Create a Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "Test Post",
    "content": "This is a test post"
  }'
```

### Create a Post via Nginx
```bash
curl -X POST http://localhost:8081/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "title": "Test Post via Nginx",
    "content": "This is a test post through nginx"
  }'
```

### Health Check
```bash
curl http://localhost:3001/health
curl http://localhost:8081/health
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:watch        # Start with auto-reload

# Build
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run migrate         # Run database migrations
npm run migrate:rollback # Rollback migrations
npm run seed:run        # Run database seeds

# Documentation
npm run swagger         # Generate Swagger docs
```

## 🐳 Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use proper secrets management
2. **Database**: Use managed PostgreSQL service
3. **SSL**: Add HTTPS termination
4. **Monitoring**: Add logging and monitoring solutions
5. **Scaling**: Use container orchestration (Kubernetes, ECS, etc.)

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Ensure PostgreSQL is healthy
3. **Build failures**: Check Dockerfile and dependencies

### Logs
```bash
# View all service logs
docker compose logs

# View specific service logs
docker compose logs api
docker compose logs postgres
```

## 📚 API Documentation

Visit http://localhost:3000/api-docs for interactive Swagger documentation.
