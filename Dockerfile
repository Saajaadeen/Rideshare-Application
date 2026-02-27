FROM node:20-alpine

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

RUN apk --no-cache add curl

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Database URL for Prisma generation
ENV DATABASE_URL=postgresql://postgres:supersecret@localhost:5432/rideshare

# Generate Prisma client and build
RUN npx prisma generate
RUN npx prisma migrate deploy
# RUN npx prisma db seed
RUN npm run build

# Set permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
CMD ["npm", "run", "start:prod"]