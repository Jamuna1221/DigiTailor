# =========================
# 1️⃣ Build Frontend (Vite)
# =========================
FROM node:20-alpine AS frontend

WORKDIR /app/frontend

# Copy and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source files
COPY frontend/ .

# Build the Vite app
RUN npm run build


# =========================
# 2️⃣ Build Backend (Express)
# =========================
FROM node:20-alpine AS backend

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source files
COPY backend/ .

# Copy built frontend files into backend's public directory
RUN mkdir -p public
COPY --from=frontend /app/frontend/dist ./public

# Create uploads directory
RUN mkdir -p uploads/profiles uploads/reviews

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start backend
CMD ["npm", "start"]
