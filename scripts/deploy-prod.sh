#!/bin/bash

# Production deployment script for the application

set -e

echo "🚀 Starting production deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml down --remove-orphans

# Pull latest images and build
echo "🔨 Building services..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

# Start services
echo "🎯 Starting production services..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker compose -f docker-compose.yml -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Production deployment successful!"
    echo ""
    echo "🌐 Application is available at:"
    echo "   Frontend: http://localhost"
    echo "   API: http://localhost/api"
    echo "   API Docs: http://localhost/api-docs"
    echo "   Health: http://localhost/health"
    echo "   Logs: http://localhost:9999"
    echo ""
    echo "📊 To view logs:"
    echo "   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
else
    echo "❌ Some services failed to start. Check logs:"
    docker compose -f docker-compose.yml -f docker-compose.prod.yml logs
    exit 1
fi
