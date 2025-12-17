# Dockerfile
FROM node:20-alpine

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy only necessary application files
COPY prisma ./prisma
COPY app ./app
COPY api ./api
COPY server ./server
COPY public ./public
COPY .github ./.github
COPY *.config.* ./
COPY *.json ./
COPY .dockerignore ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Generate Prisma Client with a placeholder DATABASE_URL
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
