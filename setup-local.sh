#!/bin/bash

# PetConnect Local Development Setup Script
# This script automates the setup process for local development

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="/Users/brycecraig/PETCONNECT"
ENV_FILE="$PROJECT_DIR/.env.local"
PORT=${PORT:-3001}

# Functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Change to project directory
cd "$PROJECT_DIR" || {
    print_error "Failed to navigate to project directory: $PROJECT_DIR"
    exit 1
}

print_step "PetConnect Local Development Setup"
echo "This script will set up your local development environment."
echo ""

# Step 1: Check prerequisites
print_step "Step 1: Checking Prerequisites"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm $(npm -v) is installed"

# Step 2: Install dependencies
print_step "Step 2: Installing Dependencies"

if [ ! -d "node_modules" ]; then
    print_info "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_info "node_modules exists, checking for updates..."
    npm install
    print_success "Dependencies up to date"
fi

# Step 3: Set up environment variables
print_step "Step 3: Setting Up Environment Variables"

if [ -f "$ENV_FILE" ]; then
    print_warning ".env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Keeping existing .env.local file"
        SKIP_ENV=true
    else
        SKIP_ENV=false
    fi
else
    SKIP_ENV=false
fi

if [ "$SKIP_ENV" = false ]; then
    print_info "Creating .env.local file..."
    
    # Generate AUTH_SECRET if not already set
    if [ -f "$ENV_FILE" ] && grep -q "AUTH_SECRET=" "$ENV_FILE"; then
        AUTH_SECRET=$(grep "AUTH_SECRET=" "$ENV_FILE" | cut -d'=' -f2)
    else
        AUTH_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "5bf60d592e493e68370c6eed1adabdf7cd964ff5ae3cbcad85ace5ffba135d32")
    fi
    
    cat > "$ENV_FILE" << EOF
# ============================================
# REQUIRED - App Configuration
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:$PORT
NODE_ENV=development

# ============================================
# REQUIRED - Database (Supabase)
# ============================================
# Get this from: https://supabase.com/dashboard/project/mwqoyvapjyjzaemsosoh
# Settings → Database → Connection string → URI
# Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL=postgresql://postgres.mwqoyvapjyjzaemsosoh:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# ============================================
# REQUIRED - Authentication
# ============================================
AUTH_SECRET=$AUTH_SECRET

# ============================================
# OPTIONAL - Email (Resend)
# ============================================
# Leave empty for local dev - emails will log to console
RESEND_API_KEY=
CONTACT_FROM_EMAIL="PetConnect <no-reply@localhost>"
CONTACT_TO_EMAIL=you@example.com

# ============================================
# OPTIONAL - Payment Provider
# ============================================
# Leave empty for local dev - demo mode will work
PAYMENT_PROVIDER_BASE_URL=
PAYMENT_PUBLIC_KEY=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=

# ============================================
# OPTIONAL - File Uploads (Vercel Blob)
# ============================================
# Leave empty - can add files by URL instead
BLOB_READ_WRITE_TOKEN=

# ============================================
# OPTIONAL - Rate Limiting (Upstash Redis)
# ============================================
# Leave empty - rate limiting disabled without it
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
EOF

    print_success ".env.local file created"
    print_warning "IMPORTANT: Update DATABASE_URL in .env.local with your Supabase password"
    print_info "Get your connection string from: https://supabase.com/dashboard/project/mwqoyvapjyjzaemsosoh"
    echo ""
    read -p "Have you updated DATABASE_URL in .env.local? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Please update DATABASE_URL in .env.local before continuing"
        print_info "You can run this script again after updating the database URL"
        exit 0
    fi
fi

# Step 4: Database setup
print_step "Step 4: Setting Up Database"

# Check if DATABASE_URL is set and not placeholder
if grep -q "\[YOUR-PASSWORD\]" "$ENV_FILE" 2>/dev/null; then
    print_error "DATABASE_URL still contains [YOUR-PASSWORD] placeholder"
    print_info "Please update .env.local with your actual database password"
    exit 1
fi

print_info "Generating Prisma Client..."
npm run db:generate
print_success "Prisma Client generated"

print_info "Testing database connection..."
if npx prisma db pull > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    print_info "Please check your DATABASE_URL in .env.local"
    print_info "You can test the connection manually with: npx prisma db pull"
    exit 1
fi

print_info "Seeding database with products..."
if npm run db:seed > /dev/null 2>&1; then
    print_success "Database seeded (products may already exist, that's okay)"
else
    print_warning "Database seeding had issues (products may already exist)"
    print_info "You can manually seed with: npm run db:seed"
fi

# Step 5: Type check
print_step "Step 5: Type Checking"

print_info "Running TypeScript type check..."
if npm run type-check > /dev/null 2>&1; then
    print_success "TypeScript checks passed"
else
    print_warning "TypeScript errors found (non-blocking)"
    print_info "You can check errors with: npm run type-check"
fi

# Step 6: Build check
print_step "Step 6: Build Verification"

print_info "Testing production build..."
if npm run build > /dev/null 2>&1; then
    print_success "Build successful"
    # Clean up build artifacts
    npm run clean > /dev/null 2>&1 || true
else
    print_warning "Build failed (non-blocking for dev)"
    print_info "You can check build errors with: npm run build"
fi

# Step 7: Final steps
print_step "Step 7: Setup Complete!"

print_success "Local development environment is ready!"
echo ""
print_info "Next steps:"
echo "  1. Start the development server:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  2. Or use port $PORT:"
echo "     ${GREEN}PORT=$PORT npm run dev${NC}"
echo ""
echo "  3. Open your browser:"
echo "     ${GREEN}http://localhost:$PORT${NC}"
echo ""
print_info "Available commands:"
echo "  • ${GREEN}npm run dev${NC}              - Start dev server"
echo "  • ${GREEN}npm run build${NC}            - Build for production"
echo "  • ${GREEN}npm run type-check${NC}        - Check TypeScript"
echo "  • ${GREEN}npm run db:studio${NC}        - Open Prisma Studio"
echo "  • ${GREEN}npm run db:seed${NC}           - Re-seed database"
echo ""

# Ask if user wants to start dev server
read -p "Do you want to start the development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Starting Development Server"
    print_info "Server will start on http://localhost:$PORT"
    print_info "Press Ctrl+C to stop the server"
    echo ""
    PORT=$PORT npm run dev
else
    print_info "You can start the server anytime with: npm run dev"
fi

