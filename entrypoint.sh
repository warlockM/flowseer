#!/bin/sh

# Admin credentials
ADMIN_EMAIL="admin@flowseer.local"
ADMIN_PASSWORD="flowseer123"

echo "📦 Running PocketBase migration..."
./pocketbase migrate

echo "🛠️ Creating superadmin user..."
./pocketbase superuser create $ADMIN_EMAIL $ADMIN_PASSWORD || echo "🔒 Admin already exists."

# Run PocketBase in foreground (removes all .env logic)
echo "🚀 Starting PocketBase..."
exec ./pocketbase serve --http=0.0.0.0:8090
