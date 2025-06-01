# Multi-stage Dockerfile for React TypeScript frontend

# Development stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Ensure public directory exists with required index.html
RUN mkdir -p public && \
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>React App</title></head><body><div id="root"></div></body></html>' > public/index.html

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Verify public/index.html exists before building
RUN ls -la public/

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage for hot reload
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Ensure public directory exists with required index.html
RUN mkdir -p public && \
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>React App</title></head><body><div id="root"></div></body></html>' > public/index.html

COPY src ./src
COPY tsconfig.json ./
EXPOSE 3000
CMD ["npm", "start"]
