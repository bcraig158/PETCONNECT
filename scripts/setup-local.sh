#!/bin/bash

# Quick Local Setup Script for PetConnect
# This script helps you get a local dev environment running quickly

set -e

echo "🚀 PetConnect Local Development Setup"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Creating from template..."
    cat > .env.local << 'EOF'
# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Database (Supabase) - REPLACE WITH YOUR SUPABASE CONNECTION STRING
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require

# Authentication
AUTH_SECRET=$(openssl rand -hex 32)

# Optional - Email
RESEND_API_KEY=
CONTACT_FROM_EMAIL="PetConnect <no-reply@localhost>"
CONTACT_TO_EMAIL=you@example.com
EOF
    echo "✅ Created .env.local template"
    echo "⚠️  Please update DATABASE_URL with your Supabase connection string!"
    exit 1
fi

echo "✅ .env.local found"

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=postgresql://" .env.local || grep -q "\[YOUR-PASSWORD\]" .env.local; then
    echo "⚠️  DATABASE_URL needs to be configured with your Supabase connection string"
    echo ""
    echo "To get your Supabase connection string:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to Settings → Database"
    echo "4. Copy the Connection string (URI format)"
    echo "5. Replace [YOUR-PASSWORD] with your database password"
    echo "6. Update DATABASE_URL in .env.local"
    echo ""
    read -p "Press Enter when you've updated DATABASE_URL, or Ctrl+C to exit..."
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma Client..."
npm run db:generate

echo ""
echo "🗄️  Setting up database schema..."
npm run db:push

echo ""
echo "🌱 Seeding database with products..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"

