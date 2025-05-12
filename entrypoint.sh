#!/bin/sh

echo "🏁 Running entrypoint script..."

# Wait for the PostgreSQL database to be ready
echo "⏳ Waiting for the database to be ready..."
until psql $DATABASE_URL -c '\q'; do
  echo "⏳ Database not ready, waiting..."
  sleep 2
done

# Check if _prisma_migrations table exists (i.e., migrations applied already)
echo "🔍 Checking if migrations have been applied..."
MIGRATION_EXISTS=$(psql $DATABASE_URL -t -c "SELECT EXISTS (SELECT 1 FROM _prisma_migrations);")

if [ $MIGRATION_EXISTS == "t" ]; then
  echo "📦 Migrations already applied – skipping migration deploy."
  npx prisma migrate deploy
else
  echo "🔄 No migrations found – applying migrations..."
  npx prisma migrate dev --name init
fi

echo "🚀 Starting the app..."
exec node dist/index.js
