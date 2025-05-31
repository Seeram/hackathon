# Express TSOA API with Docker

A containerized Express.js API built with TypeScript, TSOA, and PostgreSQL.

## 🏗️ Architecture

- **API Service**: Express.js with TSOA for TypeScript-first API development
- **Database**: PostgreSQL 15 with automatic initialization
- **Reverse Proxy**: Nginx for load balancing and routing
- **Log Monitoring**: Dozzle for real-time container log viewing
- **Documentation**: Auto-generated Swagger/OpenAPI docs

## 📁 Project Structure

```
hackathon/
├── services/
│   ├── api/                 # Express TSOA API service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── routes/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── db/                  # Database initialization scripts
│   │   └── 01-init.sql
│   └── nginx/               # Nginx reverse proxy configuration
│       └── nginx.conf
├── scripts/                 # Testing and utility scripts
│   ├── test-database-api.sh
│   └── test-docker-setup.sh
├── docker-compose.yml       # Production Docker Compose
├── docker-compose.dev.yml   # Development Docker Compose
└── Makefile                 # Build and deployment shortcuts
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Running with Docker Compose

**Development Mode (with direct service access):**
```bash
make dev
# or
docker compose -f docker-compose.dev.yml up -d
```

**Production Mode (everything behind reverse proxy):**
```bash
make prod
# or
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Standard mode:**
```bash
docker compose up -d
```

### Available Endpoints

**Development Mode:**
- **API**: http://localhost:3001 (direct access)
- **Frontend**: http://localhost:3000 (direct access)
- **Swagger Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health
- **Nginx Proxy**: http://localhost:8081 (reverse proxy)
- **Dozzle Logs**: http://localhost:9999 (real-time log viewer)

**Production Mode:**
- **Application**: http://localhost (all traffic through nginx reverse proxy)
- **API**: http://localhost/api (proxied through nginx)
- **Swagger Documentation**: http://localhost/api-docs (proxied through nginx)
- **Health Check**: http://localhost/health (proxied through nginx)
- **Dozzle Logs**: http://localhost:9999 (log viewer)

## 🛠️ Development

### Local Development Setup

1. **Install dependencies:**
   ```bash
   cd services/api
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
- **Database**: api
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
| `DB_NAME` | Database name | api |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | password |

### Docker Compose Services

- **postgres**: PostgreSQL database with persistent volume
- **api**: Express.js API service
- **nginx**: Reverse proxy (optional)

## 🧪 Testing the API

### Get All Posts
**Development:**
```bash
curl http://localhost:3001/api/posts
curl http://localhost:8081/api/posts
```

**Production:**
```bash
curl http://localhost/api/posts
```

### Create a Post
**Development:**
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "Test Post",
    "content": "This is a test post"
  }'
```

**Production:**
```bash
curl -X POST http://localhost/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "Test Post",
    "content": "This is a test post"
  }'
```

### Health Check
**Development:**
```bash
curl http://localhost:3001/health
curl http://localhost:8081/health
```

**Production:**
```bash
curl http://localhost/health
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

### Quick Commands

```bash
# Production deployment
make prod-deploy        # Full production deployment
make prod              # Start production environment
make health            # Run health checks
make backup            # Create database backup
make restore BACKUP_FILE=database_backup_YYYYMMDD_HHMMSS.sql.gz

# Monitoring
make dozzle            # Open log viewer
make logs              # View container logs
```

### Production Features

1. **Automated Deployment**: Complete CI/CD-ready deployment scripts
2. **Health Monitoring**: Comprehensive system health checks
3. **Backup & Recovery**: Automated database backup and restore
4. **Reverse Proxy**: Nginx with SSL-ready configuration
5. **Log Management**: Real-time log monitoring with Dozzle
6. **Resource Monitoring**: Container and system resource tracking

### Security Considerations

For production deployment, consider:

1. **Environment Variables**: Use proper secrets management
2. **Database**: Use managed PostgreSQL service
3. **SSL**: Add HTTPS termination
4. **Monitoring**: Add logging and monitoring solutions
5. **Scaling**: Use container orchestration (Kubernetes, ECS, etc.)

### Backup Strategy

The system includes automated backup and restore capabilities:

```bash
# Create backup
make backup

# List available backups
make restore

# Restore from backup
make restore BACKUP_FILE=database_backup_20240531_123456.sql.gz
```

Backups are:
- Automatically compressed
- Timestamped for easy identification
- Cleaned up automatically (keeps last 10)
- Include complete database schema and data

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

Visit the following URLs for interactive Swagger documentation:

**Development:**
- http://localhost:3001/api-docs (direct API access)
- http://localhost:8081/api-docs (via nginx proxy)

**Production:**
- http://localhost/api-docs (via nginx reverse proxy)

## ✅ Production Readiness Checklist

Your hackathon project now includes enterprise-grade production features:

### 🏗️ Infrastructure
- ✅ **Multi-container Docker setup** with docker-compose
- ✅ **Nginx reverse proxy** for load balancing and routing
- ✅ **Production and development environments** with separate configs
- ✅ **Health checks** for all services
- ✅ **Automated deployment scripts** with error handling

### 🛡️ Security & Reliability
- ✅ **Service isolation** - no direct port exposure in production
- ✅ **Database connection pooling** and health monitoring
- ✅ **Error handling** and graceful degradation
- ✅ **Container restart policies** for high availability

### 📊 Monitoring & Maintenance
- ✅ **Real-time log monitoring** with Dozzle
- ✅ **Comprehensive health checks** (application, database, system)
- ✅ **Automated database backups** with compression
- ✅ **Point-in-time recovery** capabilities
- ✅ **Resource usage monitoring** for all containers

### 🚀 Development Workflow
- ✅ **Makefile automation** for all common operations
- ✅ **Hot-reload development environment**
- ✅ **Comprehensive testing scripts**
- ✅ **Auto-generated API documentation**
- ✅ **Database migration support**

### 📈 Performance & Scalability
- ✅ **Static asset caching** with nginx
- ✅ **Database indexing** for optimal queries
- ✅ **Container resource optimization**
- ✅ **Production-optimized builds**

### Quick Production Deployment
```bash
# Clone and deploy
git clone <your-repo>
cd hackathon
make prod-deploy

# Monitor and maintain
make health      # Check system health
make backup      # Create backup
make dozzle      # View logs
```

This setup provides a solid foundation for:
- **Hackathon demonstrations** with reliable deployment
- **Production scaling** with minimal configuration changes
- **Team collaboration** with standardized development environment
- **Future enhancements** with well-structured codebase
