#!/bin/bash

# Setup Local PostgreSQL for PetConnect Development

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up local PostgreSQL for PetConnect...${NC}"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL not found. Installing via Homebrew...${NC}"
    
    if ! command -v brew &> /dev/null; then
        echo -e "${RED}❌ Homebrew not found. Please install Homebrew first:${NC}"
        echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    echo "Installing PostgreSQL..."
    brew install postgresql@15
    
    echo ""
    echo -e "${YELLOW}⚠️  PostgreSQL installed. You need to start it:${NC}"
    echo "  brew services start postgresql@15"
    echo ""
    echo "Or start it manually:"
    echo "  pg_ctl -D /opt/homebrew/var/postgresql@15 start"
    echo ""
    read -p "Press Enter after starting PostgreSQL, or Ctrl+C to exit..."
fi

# Check if PostgreSQL is running
if ! pg_isready -q 2>/dev/null; then
    echo -e "${YELLOW}PostgreSQL doesn't appear to be running.${NC}"
    echo ""
    echo "Start PostgreSQL with one of these commands:"
    echo "  brew services start postgresql@15"
    echo "  OR"
    echo "  pg_ctl -D /opt/homebrew/var/postgresql@15 start"
    echo ""
    read -p "Press Enter after starting PostgreSQL, or Ctrl+C to exit..."
fi

# Create database
echo -e "${BLUE}Creating database 'petconnect'...${NC}"
createdb petconnect 2>/dev/null || {
    if [ $? -eq 2 ]; then
        echo -e "${GREEN}✅ Database 'petconnect' already exists${NC}"
    else
        echo -e "${RED}❌ Failed to create database${NC}"
        exit 1
    fi
}

echo -e "${GREEN}✅ Local PostgreSQL setup complete!${NC}"
echo ""
echo "Your .env.local should have:"
echo "  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/petconnect?sslmode=prefer"
echo ""
echo "Now run:"
echo "  npm run db:push"
echo "  npm run db:seed"
echo "  npm run dev"

