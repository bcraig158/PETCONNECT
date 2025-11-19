# Localhost Setup Instructions

## Quick Start

1. **Create `.env.local` file** in the root directory with this content:

```bash
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Database - Choose ONE option below:

# Option A: Local Postgres (if you have it installed)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/petconnect?sslmode=prefer

# Option B: Neon (Free cloud Postgres) - Sign up at https://neon.tech
# DATABASE_URL=postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require

# Option C: Supabase (Free cloud Postgres) - Sign up at https://supabase.com
# DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Auth
AUTH_SECRET=5bf60d592e493e68370c6eed1adabdf7cd964ff5ae3cbcad85ace5ffba135d32

# Email (Optional - leave empty for local dev)
RESEND_API_KEY=
CONTACT_FROM_EMAIL="Acme <no-reply@localhost>"
CONTACT_TO_EMAIL=you@example.com

# Payment (Optional - leave empty for local dev)
PAYMENT_PROVIDER_BASE_URL=
PAYMENT_PUBLIC_KEY=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=

# Files (Optional)
BLOB_READ_WRITE_TOKEN=

# Rate limit (Optional - will work without it)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

2. **Set up Database:**

Choose one:
- **Neon (Recommended)**: https://neon.tech - Free PostgreSQL in the cloud
- **Supabase**: https://supabase.com - Free PostgreSQL with extras
- **Local Postgres**: Install PostgreSQL locally

Copy your database connection string to `DATABASE_URL` in `.env.local`

3. **Run database setup:**

```bash
npx prisma db push
npm run db:seed
```

4. **Start dev server:**

```bash
npm run dev
```

5. **Open browser:**

http://localhost:3000

---

## Troubleshooting

### Database Connection Issues
- Make sure DATABASE_URL is correct
- For cloud databases, ensure SSL mode is set correctly
- Check that your database allows connections from your IP

### Missing Environment Variables
- Make sure `.env.local` exists (not `.env`)
- Restart the dev server after changing `.env.local`

### Prisma Errors
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema

---

## What You'll See

1. **Home Page** (`/`) - Welcome page
2. **Products** (`/products`) - 6 products
3. **Register** (`/register`) - Create account
4. **Login** (`/login`) - Sign in
5. **Account** (`/account`) - User dashboard (requires login)
6. **Orders** (`/orders`) - Order history (requires login)
7. **Builder** (`/builder`) - Page builder (requires login)
8. **Public Page** (`/[username]`) - User's profile page

