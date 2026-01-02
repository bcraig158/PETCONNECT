# Setup Guide

Complete guide to set up and run PetConnect locally.

## Prerequisites

- **Node.js 24 LTS** (or Node.js 18+)
- **npm** or **yarn**
- **PostgreSQL database** (Supabase, Neon, or local PostgreSQL)
- **Git** (optional, for version control)

### Verify Installation

```bash
# Check Node.js version
node -v
# Should show v18.x, v20.x, or v24.x

# Check npm version
npm -v
# Should show 8.x or higher
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Database (Required)
# Get connection string from your PostgreSQL provider
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Authentication (Required)
# Generate with: openssl rand -hex 32
AUTH_SECRET=your-generated-secret-here

# Email (Optional - for contact form)
RESEND_API_KEY=
CONTACT_FROM_EMAIL="PetConnect <no-reply@localhost>"
CONTACT_TO_EMAIL=you@example.com

# Payment Provider (Optional - for production)
PAYMENT_PROVIDER_BASE_URL=
PAYMENT_PUBLIC_KEY=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=

# File Uploads (Optional - Vercel Blob)
BLOB_READ_WRITE_TOKEN=

# Rate Limiting (Optional - Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 3. Set Up Database (Supabase)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project:
   - Click "New Project"
   - Enter project name: "PetConnect"
   - Set a strong database password (save it!)
   - Select a region
   - Click "Create new project"
3. Get connection string:
   - Go to **Settings** → **Database**
   - Scroll to **Connection string** section
   - Select **URI** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual database password
4. Add to `.env.local` as `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
   ```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with products
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

If port 3000 is in use, Next.js will automatically use the next available port (e.g., 3001). Update `NEXT_PUBLIC_SITE_URL` in `.env.local` accordingly.

## Automated Setup

You can use the setup script for automated setup:

```bash
npm run setup
```

Or directly:

```bash
./setup-local.sh
```

This script will:
- Check prerequisites
- Install dependencies
- Create `.env.local` template
- Generate Prisma client
- Test database connection
- Seed the database

**Note:** You'll still need to update `DATABASE_URL` in `.env.local` with your actual database connection string.

## Testing the Setup

### 1. Verify Pages Load

- **Home**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **About**: http://localhost:3000/about
- **Contact**: http://localhost:3000/contact

### 2. Test Authentication

1. **Register**: http://localhost:3000/register
   - Fill in: Owner Name, Pet Name, Email, Username, Password
   - Click "Create Account"

2. **Login**: http://localhost:3000/login
   - Enter username and password
   - Click "Sign In"

### 3. Test Authenticated Features

After logging in:

- **Account**: http://localhost:3000/account
- **Orders**: http://localhost:3000/orders
- **Page Builder**: http://localhost:3000/builder
- **Public Page**: http://localhost:3000/[your-username]

### 4. Test Page Builder

1. Go to `/builder`
2. Edit profile information
3. Add links at `/builder/links`
4. Add social links at `/builder/socials`
5. View your public page at `/[your-username]`

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (with Turbopack)
npm run dev:webpack  # Start dev server (with Webpack)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check formatting

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Analysis
npm run analyze      # Bundle size analysis

# Maintenance
npm run clean        # Clean build artifacts
```

## Troubleshooting

### Port Already in Use

If port 3000 is in use:

```bash
# Use a different port
PORT=3001 npm run dev
```

Then update `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### Database Connection Failed

1. Verify `DATABASE_URL` format is correct
2. Check password is correct
3. For cloud databases, ensure SSL mode is set correctly
4. Test connection:
   ```bash
   npx prisma db pull
   ```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Prisma Client Not Generated

```bash
npm run db:generate
```

### Products Not Showing

1. Verify database is seeded:
   ```bash
   npm run db:seed
   ```
2. Check database connection
3. Open Prisma Studio to verify:
   ```bash
   npm run db:studio
   ```

### Authentication Not Working

1. Check `AUTH_SECRET` is set in `.env.local`
2. Restart dev server after changing `.env.local`
3. Clear browser cookies/localStorage
4. Check browser console for errors

### TypeScript Errors

```bash
# Check for errors
npm run type-check
```

### Build Fails

1. Check TypeScript errors: `npm run type-check`
2. Check for missing dependencies: `npm install`
3. Clear build cache:
   ```bash
   npm run clean
   npm run build
   ```

## Environment Variables Reference

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -hex 32`)
- `NEXT_PUBLIC_SITE_URL` - Your site URL (http://localhost:3000 for dev)

### Optional

- `RESEND_API_KEY` - For email delivery (contact form)
- `CONTACT_TO_EMAIL` - Email to receive contact form submissions
- `CONTACT_FROM_EMAIL` - Verified sender email for Resend
- `PAYMENT_PROVIDER_BASE_URL` - Payment provider API base URL
- `PAYMENT_PUBLIC_KEY` - Payment provider public key
- `PAYMENT_SECRET_KEY` - Payment provider secret key
- `PAYMENT_WEBHOOK_SECRET` - Webhook signing secret
- `BLOB_READ_WRITE_TOKEN` - File upload token (optional, can use Supabase Storage instead)
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL for rate limiting (optional)
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token (optional)

**Note**: This project is configured for Netlify + Supabase deployment. For production deployment, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Next Steps

1. **Add Product Images**: Place images in `public/images/`
   - `alpha.jpg`, `beta.jpg`, `gamma.jpg`, `delta.jpg`, `epsilon.jpg`, `zeta.jpg`

2. **Configure Payment Provider**: See [`PAYMENT_INTEGRATION.md`](./PAYMENT_INTEGRATION.md)

3. **Set Up Email**: Get Resend API key and add to `.env.local`

4. **Deploy**: See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for Netlify + Supabase deployment guide

## Additional Resources

- **Deployment Guide**: See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for Netlify + Supabase deployment
- **Setup Checklist**: See [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md) for a detailed checklist
- **Payment Integration**: See [`PAYMENT_INTEGRATION.md`](./PAYMENT_INTEGRATION.md)
- **Page Builder Guide**: See [`PAGE_BUILDER_GUIDE.md`](./PAGE_BUILDER_GUIDE.md)
- **Performance Optimizations**: See [`PERFORMANCE_OPTIMIZATIONS.md`](./PERFORMANCE_OPTIMIZATIONS.md)

---

**Need Help?** Check the troubleshooting section above or review the main [`README.md`](../README.md) for project overview.

