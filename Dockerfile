# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Generate Prisma Client (since you have a prisma directory)
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
