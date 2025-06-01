# Hackathon Project

A full-stack application with AI-powered agents, built with containerized microservices architecture.

[**Live Demo**](http://65.108.32.137/)

DisPatcher supports maintenance workers from start to finish. It provides job details and checklists upfront, answers questions on site using a vector database of embedded manuals, returning is going to be PDFs in response at the relevant page. It also simplifies reporting by auto-generating post-job summaries from audio transcriptions and logged data.

## 🏗️ Technical Architecture

This project follows a microservices architecture with the following components:

- **Frontend Service**: React TypeScript application with voice recording capabilities
- **API Service**: Express.js with TSOA for type-safe API development
- **Agents Service**: Python-based AI service with speech recognition and PDF processing
- **Database Service**: PostgreSQL 15 with automatic schema initialization
- **Reverse Proxy**: Nginx for routing and load balancing
- **Log Monitoring**: Dozzle for real-time container log viewing

## 📁 Project Structure

```
hackathon/
├── services/
│   ├── api/                    # Express TSOA API service (Node.js/TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/    # API route controllers
│   │   │   ├── models/         # Data models and types
│   │   │   ├── services/       # Business logic services
│   │   │   └── routes/         # Auto-generated TSOA routes
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── frontend/               # React TypeScript frontend
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── api/           # API client code
│   │   │   └── types/         # TypeScript type definitions
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── agents/                 # Python AI agents service
│   │   ├── app.py             # Main Flask/FastAPI application
│   │   ├── dialogue.py        # AI dialogue handling
│   │   ├── embedding_service/  # PDF embedding microservice
│   │   ├── transcribe_service/ # Speech transcription microservice
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── db/                    # Database initialization
│   │   ├── 01-init.sql        # Schema setup
│   │   └── 02-ai-chat-logs.sql # AI chat logging tables
│   └── nginx/                 # Reverse proxy configuration
│       ├── nginx.conf         # Nginx routing configuration
│       └── public/            # Static assets
├── scripts/                   # Automation and testing scripts
│   ├── deploy-prod.sh         # Production deployment
│   ├── backup-database.sh     # Database backup utilities
│   └── test-*.sh             # Integration test scripts
├── backups/                   # Database backup storage
├── docker-compose.yml         # Base Docker Compose configuration
├── docker-compose.dev.yml     # Development environment overrides
├── docker-compose.prod.yml    # Production environment overrides
└── Makefile                   # Build and deployment shortcuts
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for agents service development)

### Environment Setup

**Development Mode (direct service access):**
```bash
make dev
# or
docker compose -f docker-compose.dev.yml up -d
```

**Production Mode (reverse proxy routing):**
```bash
make prod
# or
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Standard Mode:**
```bash
docker compose up -d
```

### Service Endpoints

**Development Mode:**
- **Frontend**: http://localhost:3000 (React development server)
- **API**: http://localhost:3001 (Express API with Swagger docs)
- **Agents**: http://localhost:5000 (Python AI service)
- **Nginx Proxy**: http://localhost:8081 (reverse proxy entry point)
- **Dozzle Logs**: http://localhost:9999 (container log viewer)

**Production Mode:**
- **Application**: http://localhost (all traffic routed through Nginx)
- **API Docs**: http://localhost/api-docs (Swagger documentation)
- **Health Check**: http://localhost/health
- **Dozzle Logs**: http://localhost:9999

## 🛠️ Development

### Service-Specific Development

Each service can be developed independently. See individual service README files:

- [`services/api/README.md`](services/api/README.md) - API service setup and development
- [`services/frontend/README.md`](services/frontend/README.md) - Frontend development guide
- [`services/agents/README.md`](services/agents/README.md) - AI agents service setup

### Database Management

```bash
# Backup database
./scripts/backup-database.sh

# Restore from backup
./scripts/restore-database.sh <backup-file>

# Health check all services
./scripts/health-check.sh
```

## 🧪 Testing

```bash
# Test all services
./scripts/test-integration.sh

# Test specific components
./scripts/test-api-docs.sh
./scripts/test-database-api.sh
./scripts/test-frontend-integration.sh
```

## 🚀 Deployment

```bash
# Deploy to production
./scripts/deploy-prod.sh
```

## 📖 Technology Stack

- **Frontend**: React 19, TypeScript, Axios
- **Backend API**: Express.js, TSOA, TypeScript, Swagger/OpenAPI
- **AI Agents**: Python, Flask/FastAPI, Transformers, Whisper, LangChain
- **Database**: PostgreSQL 15, Knex.js ORM
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Monitoring**: Dozzle for logs


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
