# Deployment Guide - Netlify + Supabase

Complete guide to deploy PetConnect to Netlify with Supabase as the database.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Netlify account ([netlify.com](https://netlify.com))
- Supabase account ([supabase.com](https://supabase.com))

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: PetConnect (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to initialize (~2 minutes)

### 1.2 Get Database Connection String

1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set during project creation
6. **Save this connection string** - you'll need it for Netlify environment variables

### 1.3 Set Up Database Schema

You have two options:

#### Option A: Using Prisma (Recommended)

From your local machine:

```bash
# Make sure DATABASE_URL is set in .env.local
DATABASE_URL="your-supabase-connection-string"

# Generate Prisma Client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Seed products
npm run db:seed
```

#### Option B: Using Supabase SQL Editor

1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Run your Prisma-generated SQL (from `prisma/migrations` or use `prisma db push` to generate SQL)
4. Or manually create tables based on your `prisma/schema.prisma`

### 1.4 Verify Database Setup

```bash
# Open Prisma Studio to verify
npm run db:studio
```

Or check in Supabase Dashboard → **Table Editor** to see your tables.

## Step 2: Prepare Your Code

### 2.1 Ensure All Changes Are Committed

```bash
git add .
git commit -m "Configure for Netlify deployment"
git push
```

### 2.2 Verify Configuration Files

Make sure these files exist:
- ✅ `netlify.toml` (created automatically)
- ✅ `package.json` (with updated build script)
- ✅ `prisma/schema.prisma` (your database schema)

## Step 3: Netlify Setup

### 3.1 Create Netlify Site

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your PetConnect repository
6. Click **"Next"**

### 3.2 Configure Build Settings

Netlify should auto-detect Next.js, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `.next` (or leave empty - plugin handles it)
- **Base directory**: (leave empty unless your project is in a subdirectory)

Click **"Deploy site"** (we'll configure environment variables next)

### 3.3 Install Netlify Next.js Plugin

1. In Netlify Dashboard, go to your site
2. Navigate to **Site settings** → **Plugins**
3. Search for **"Essential Next.js Plugin"** or **"@netlify/plugin-nextjs"**
4. Click **"Install"**

Alternatively, the plugin is already configured in `netlify.toml`.

## Step 4: Configure Environment Variables

### 4.1 Required Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables** → **Add variable**:

#### Required Variables:

```bash
# App Configuration
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require

# Authentication
AUTH_SECRET=<generate with: openssl rand -hex 32>
```

**Important Notes:**
- Replace `[PASSWORD]` with your actual Supabase database password
- Replace `[project-ref]` and `[region]` with your Supabase project details
- Generate a new `AUTH_SECRET` for production (don't use your dev secret)
- `NEXT_PUBLIC_SITE_URL` should match your Netlify site URL (you'll get this after first deploy)

#### Optional Variables (for contact form):

```bash
# Email (Optional - for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_FROM_EMAIL="PetConnect <noreply@yourdomain.com>"
CONTACT_TO_EMAIL=you@example.com
```

### 4.2 Set Variables for All Environments

When adding variables, select:
- ✅ **All scopes** (or at least "Production" and "Deploy previews")

### 4.3 Get Your Netlify Site URL

1. After first deployment, go to **Site settings** → **General**
2. Your site URL will be: `https://your-site-name.netlify.app`
3. Update `NEXT_PUBLIC_SITE_URL` environment variable to match this URL

## Step 5: Deploy

### 5.1 Trigger Deployment

1. **Option A**: Push a commit to trigger auto-deployment
   ```bash
   git commit --allow-empty -m "Trigger Netlify deployment"
   git push
   ```

2. **Option B**: In Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

### 5.2 Monitor Build

1. Go to **Deploys** tab in Netlify Dashboard
2. Click on the active deploy to see build logs
3. Watch for:
   - ✅ `prisma generate` running successfully
   - ✅ `next build` completing
   - ✅ No errors

### 5.3 First Build Time

First build may take 5-10 minutes:
- Installing dependencies
- Generating Prisma Client
- Building Next.js application

Subsequent builds are faster (~2-3 minutes).

## Step 6: Verify Deployment

### 6.1 Test Your Site

Visit your Netlify site URL and test:

- [ ] Home page loads: `https://your-site.netlify.app`
- [ ] Products page works: `https://your-site.netlify.app/products`
- [ ] Registration works: `https://your-site.netlify.app/register`
- [ ] Login works: `https://your-site.netlify.app/login`
- [ ] Page builder works: `https://your-site.netlify.app/builder`
- [ ] Public pages work: `https://your-site.netlify.app/[username]`

### 6.2 Check Function Logs

1. Go to **Functions** tab in Netlify Dashboard
2. Check for any errors in API routes
3. Test API endpoints if needed

### 6.3 Verify Database Connection

1. Try registering a new user
2. Check Supabase Dashboard → **Table Editor** → **User** table
3. Verify data is being saved

## Step 7: Post-Deployment

### 7.1 Custom Domain (Optional)

1. Go to **Domain settings** → **Add custom domain**
2. Follow Netlify's DNS configuration instructions
3. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

### 7.2 Set Up Continuous Deployment

Already configured! Every push to your main branch will trigger a new deployment.

### 7.3 Environment-Specific Variables

You can set different variables for:
- **Production**: Your main site
- **Deploy previews**: Preview deployments for pull requests
- **Branch deploys**: Deployments from other branches

## Troubleshooting

### Build Fails: "Prisma Client not found"

**Solution**: Ensure `prisma generate` runs before build. Check that `package.json` has:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Error

**Check:**
1. `DATABASE_URL` is correctly formatted
2. Password is correct (no special characters need URL encoding)
3. Connection string includes `?sslmode=require`
4. Supabase project is active (not paused)

**Test connection:**
```bash
# From local machine with DATABASE_URL set
npx prisma db pull
```

### Environment Variables Not Loading

**Solutions:**
1. Ensure variables are set in Netlify Dashboard (not just `.env.local`)
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)
4. Use `NEXT_PUBLIC_` prefix for client-side variables

### Build Timeout

**Solutions:**
1. Netlify free tier: 15-minute timeout
2. Optimize build: Remove unused dependencies
3. Consider Netlify Pro for longer build times
4. Use build caching (Netlify does this automatically)

### Edge Runtime Errors

Your middleware uses Edge Runtime. If you see errors:

1. Check middleware doesn't use Node.js-only modules
2. Argon2 is dynamically imported (already done in your code)
3. All Edge-compatible dependencies are used

### Functions Not Working

**Check:**
1. Netlify Next.js plugin is installed
2. API routes are in `src/app/api/` directory
3. Functions appear in Netlify Dashboard → **Functions** tab
4. Check function logs for errors

## Quick Reference

### Netlify Dashboard Links

- **Site Overview**: `https://app.netlify.com/sites/[your-site]`
- **Deploys**: `https://app.netlify.com/sites/[your-site]/deploys`
- **Functions**: `https://app.netlify.com/sites/[your-site]/functions`
- **Environment Variables**: `https://app.netlify.com/sites/[your-site]/configuration/env`

### Supabase Dashboard Links

- **Project Dashboard**: `https://supabase.com/dashboard/project/[project-ref]`
- **Database Settings**: `https://supabase.com/dashboard/project/[project-ref]/settings/database`
- **SQL Editor**: `https://supabase.com/dashboard/project/[project-ref]/sql`
- **Table Editor**: `https://supabase.com/dashboard/project/[project-ref]/editor`

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Configure environment variables
3. ✅ Test all features
4. ⬜ Set up custom domain (optional)
5. ⬜ Configure email service (optional - for contact form)
6. ⬜ Set up monitoring/analytics (optional)

---

**Need Help?** Check the troubleshooting section above or review the main [`README.md`](../README.md) for project overview.

