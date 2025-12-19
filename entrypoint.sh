#!/bin/sh
# Wait for Postgres to be ready
echo "Waiting for Postgres to start..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Postgres is up!"

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables automatically)
npx prisma db push

# Start Remix server
npm start
