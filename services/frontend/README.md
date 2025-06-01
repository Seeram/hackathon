# Frontend Service

React TypeScript application with modern UI components and voice recording capabilities.

## Overview

This service provides the user interface for the hackathon project featuring:
- Modern React 19 with TypeScript
- Voice recording and playback functionality
- API integration with auto-generated client
- Responsive design with component-based architecture
- Production-ready Docker deployment

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Testing**: Jest + React Testing Library
- **Container**: Docker with Nginx

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### API Integration

The frontend integrates with the backend API:
- Auto-generated API client from OpenAPI specs
- Type-safe API calls with TypeScript
- Error handling and loading states

### Development Server

- **URL**: http://localhost:3000
- **Hot Reload**: Enabled for development
- **Proxy**: API calls proxied to backend service

### Docker Usage

```bash
# Build frontend container
docker build -t frontend-service .

# Run with Docker Compose
docker compose up frontend
```

## Features

- **Voice Recording**: Record and playback audio
- **API Integration**: Real-time data from backend
- **Responsive UI**: Mobile-friendly design
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error boundaries

## Build & Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

The build artifacts are served by Nginx in production mode through the reverse proxy setup.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | "" (relative) |
| `NODE_ENV` | Environment mode | development |
