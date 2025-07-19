# ---------- Base Build Stage ----------
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy full project
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN yarn install --frozen-lockfile
RUN yarn build

# Build backend
WORKDIR /app/backend
RUN yarn install --frozen-lockfile
RUN yarn build

# ---------- Final Stage ----------
FROM debian:bullseye-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl ffmpeg nginx && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node + Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install --global yarn

# Set working directory
WORKDIR /app

# Copy backend build and install runtime dependencies
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/yarn.lock ./backend/
WORKDIR /app/backend
RUN yarn install --production

# Copy frontend build output to nginx html dir
COPY --from=builder /app/frontend/dist /var/www/html

# Configure nginx
RUN rm /etc/nginx/sites-enabled/default
COPY ./nginx.conf /etc/nginx/sites-enabled/default

# Set working directory back to /app
WORKDIR /app

# Expose frontend port
EXPOSE 80

# Start both Nginx and backend server
CMD service nginx start && node /app/backend/dist/index.js
