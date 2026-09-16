# ==========================================
# Multi-stage Dockerfile for CyberSec Planner
# Stage 1: Build static web bundle
# Stage 2: Serve with lightweight Nginx
# ==========================================

# ------------------------------------------
# Stage 1: Builder
# ------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install system utilities needed for node-gyp if any
RUN apk add --no-cache libc6-compat

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code and config
COPY . .

# Export static single-page web application
ENV NODE_ENV=production
RUN npx expo export -p web

# ------------------------------------------
# Stage 2: Production Nginx Server
# ------------------------------------------
FROM nginx:1.27-alpine AS production

# Set working directory to nginx html
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy exported web bundle from builder
COPY --from=builder /app/dist .

# Create lightweight SPA nginx configuration
RUN echo 'server {' \
    '    listen 80;' \
    '    server_name localhost;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {' \
    '        expires 30d;' \
    '        add_header Cache-Control "public, max-age=2592000, immutable";' \
    '    }' \
    '}' > /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
