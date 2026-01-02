#!/bin/bash

# Complete Local Setup Script for PetConnect
# This script completes all steps needed to get the app running locally

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PetConnect Local Development Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "Creating .env.local from template..."
    cat > .env.local << 'EOF'
# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Database (Supabase) - UPDATE THIS WITH YOUR SUPABASE CONNECTION STRING
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require

# Authentication
AUTH_SECRET=5bf60d592e493e68370c6eed1adabdf7cd964ff5ae3cbcad85ace5ffba135d32

# Email (Optional)
RESEND_API_KEY=
CONTACT_FROM_EMAIL="PetConnect <no-reply@localhost>"
CONTACT_TO_EMAIL=you@example.com
EOF
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to update DATABASE_URL with your Supabase connection string${NC}"
    echo ""
    echo "To get your Supabase connection string:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Create a new project (or select existing)"
    echo "3. Go to Settings → Database"
    echo "4. Copy the Connection string (URI format)"
    echo "5. Replace [YOUR-PASSWORD] with your database password"
    echo "6. Update DATABASE_URL in .env.local"
    echo ""
    read -p "Press Enter when you've updated DATABASE_URL, or Ctrl+C to exit..."
fi

# Check if DATABASE_URL is configured
DATABASE_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
if [[ "$DATABASE_URL" == *"[YOUR-PASSWORD]"* ]] || [[ "$DATABASE_URL" == *"localhost"* ]] || [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL needs to be configured with Supabase${NC}"
    echo ""
    echo "Current DATABASE_URL: ${DATABASE_URL:0:50}..."
    echo ""
    echo "Please update .env.local with your Supabase connection string."
    echo "Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
    echo ""
    read -p "Press Enter when DATABASE_URL is updated, or Ctrl+C to exit..."
fi

echo ""
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}Step 2: Generating Prisma Client...${NC}"
npm run db:generate

echo ""
echo -e "${BLUE}Step 3: Setting up database schema...${NC}"
export $(grep -v '^#' .env.local | grep DATABASE_URL | xargs)
npx prisma db push --skip-generate || {
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "Please check your DATABASE_URL in .env.local"
    exit 1
}

echo ""
echo -e "${BLUE}Step 4: Seeding database with products...${NC}"
npm run db:seed || {
    echo -e "${YELLOW}⚠️  Seeding failed (products may already exist)${NC}"
}

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "To start the development server, run:"
echo -e "${BLUE}  npm run dev${NC}"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""

