# Deployment Checklist - Netlify + Supabase

Quick checklist to deploy PetConnect to Netlify with Supabase.

## Pre-Deployment

### Supabase Setup
- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project in Supabase
- [ ] Save database password securely
- [ ] Get connection string from Settings → Database → Connection string (URI)
- [ ] Replace `[YOUR-PASSWORD]` in connection string
- [ ] Test connection locally with `.env.local`
- [ ] Run `npm run db:push` to create schema
- [ ] Run `npm run db:seed` to seed products
- [ ] Verify tables exist in Supabase Table Editor

### Code Preparation
- [ ] All code committed to Git
- [ ] `netlify.toml` exists in project root
- [ ] `package.json` has updated build script
- [ ] Code pushed to Git repository (GitHub/GitLab/Bitbucket)

## Netlify Setup

### Site Creation
- [ ] Create Netlify account at [netlify.com](https://netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect Git provider (GitHub/GitLab/Bitbucket)
- [ ] Select PetConnect repository
- [ ] Verify build settings:
  - Build command: `npm run build`
  - Publish directory: `.next` (or leave empty)
- [ ] Click "Deploy site" (first deploy will fail - that's OK)

### Plugin Installation
- [ ] Go to Site settings → Plugins
- [ ] Search for "Essential Next.js Plugin" or "@netlify/plugin-nextjs"
- [ ] Install plugin
- [ ] Or verify it's in `netlify.toml` (already configured)

### Environment Variables
- [ ] Go to Site settings → Environment variables
- [ ] Add `DATABASE_URL`:
  - Value: Your Supabase connection string
  - Scope: All scopes
- [ ] Add `AUTH_SECRET`:
  - Generate: `openssl rand -hex 32`
  - Scope: All scopes
- [ ] Add `NEXT_PUBLIC_SITE_URL`:
  - Value: `https://your-site-name.netlify.app` (get after first deploy)
  - Scope: All scopes
- [ ] Add `NODE_ENV`:
  - Value: `production`
  - Scope: All scopes
- [ ] (Optional) Add `RESEND_API_KEY` if using contact form
- [ ] (Optional) Add `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`

### First Deployment
- [ ] Trigger new deployment (push commit or manual trigger)
- [ ] Monitor build logs
- [ ] Verify `prisma generate` runs successfully
- [ ] Verify `next build` completes
- [ ] Check for any build errors
- [ ] Note your site URL from Netlify Dashboard

### Update Site URL
- [ ] Get your Netlify site URL (e.g., `https://petconnect-123.netlify.app`)
- [ ] Update `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] Trigger new deployment

## Post-Deployment Verification

### Basic Functionality
- [ ] Home page loads: `https://your-site.netlify.app`
- [ ] Products page loads: `https://your-site.netlify.app/products`
- [ ] No console errors in browser

### Authentication
- [ ] Registration page loads: `https://your-site.netlify.app/register`
- [ ] Can create new account
- [ ] User appears in Supabase User table
- [ ] Login page loads: `https://your-site.netlify.app/login`
- [ ] Can login with created account
- [ ] Session persists after login

### Protected Routes
- [ ] Account page accessible after login: `https://your-site.netlify.app/account`
- [ ] Orders page accessible: `https://your-site.netlify.app/orders`
- [ ] Builder page accessible: `https://your-site.netlify.app/builder`
- [ ] Unauthenticated users redirected to login

### Page Builder
- [ ] Builder interface loads
- [ ] Can edit profile information
- [ ] Can add links
- [ ] Can add social links
- [ ] Changes save successfully
- [ ] Public page displays: `https://your-site.netlify.app/[username]`

### Database
- [ ] Check Supabase Dashboard → Table Editor
- [ ] Verify User table has data
- [ ] Verify Product table has 6 products
- [ ] Verify Page table updates when editing builder
- [ ] Verify Link table updates when adding links

### API Routes
- [ ] Check Netlify Dashboard → Functions
- [ ] No function errors
- [ ] API routes respond correctly

## Optional Configuration

### Custom Domain
- [ ] Go to Domain settings → Add custom domain
- [ ] Configure DNS as instructed by Netlify
- [ ] Update `NEXT_PUBLIC_SITE_URL` to custom domain
- [ ] Wait for SSL certificate (automatic)
- [ ] Test site on custom domain

### Email Service (Resend)
- [ ] Create Resend account
- [ ] Get API key
- [ ] Add `RESEND_API_KEY` to Netlify environment variables
- [ ] Add `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`
- [ ] Test contact form

### Monitoring
- [ ] Set up Netlify Analytics (if needed)
- [ ] Configure error tracking (optional)
- [ ] Set up uptime monitoring (optional)

## Troubleshooting

If something fails:
- [ ] Check Netlify build logs for errors
- [ ] Verify all environment variables are set
- [ ] Check Supabase connection string format
- [ ] Verify database schema is created
- [ ] Check Netlify Functions logs
- [ ] Review browser console for client-side errors
- [ ] See [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section

## Success Criteria

✅ All basic functionality works  
✅ Authentication works  
✅ Database connection works  
✅ Page builder works  
✅ Public pages display correctly  
✅ No critical errors in logs  

---

**Once all items are checked, your site is successfully deployed!** 🎉

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

