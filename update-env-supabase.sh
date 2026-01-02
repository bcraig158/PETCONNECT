#!/bin/bash
echo "Enter your Supabase connection string:"
echo "Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
read -p "DATABASE_URL: " db_url
if [ ! -z "$db_url" ]; then
    # Update DATABASE_URL in .env.local
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" .env.local
    else
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$db_url|" .env.local
    fi
    echo "✅ Updated DATABASE_URL in .env.local"
else
    echo "❌ No connection string provided"
    exit 1
fi
