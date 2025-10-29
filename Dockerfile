# ================= FRONTEND BUILD STAGE =================
FROM node:20-alpine AS frontend
WORKDIR /app/frontend

# Copy package files
COPY project/package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source files
COPY project/ .

# Build the Vite app
RUN npm run build


# ================= BACKEND BUILD STAGE =================
FROM node:20-alpine AS backend
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy backend source files
COPY backend/ .

# Copy frontend build output into backend's public directory
COPY --from=frontend /app/frontend/dist ./public

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the backend
CMD ["npm", "start"]
