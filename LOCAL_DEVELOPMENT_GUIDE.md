# Complete Local Development Guide — PetConnect Frontend

Step-by-step guide to build and test the frontend locally.

---

## Prerequisites

### Required
- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn
- Git (for version control)
- A code editor (VS Code, Cursor, etc.)

### Verify installation

```bash
# Check Node.js version
node -v
# Should show v18.x, v20.x, or v24.x

# Check npm version
npm -v
# Should show 8.x or higher

# Check Git (optional)
git --version
```

---

## Quick Setup (Automated)

**Want to automate everything?** Run the setup script:

```bash
cd /Users/brycecraig/PETCONNECT
npm run setup
```

Or directly:

```bash
./setup-local.sh
```

This script will:
- ✅ Check prerequisites (Node.js, npm)
- ✅ Install dependencies
- ✅ Create `.env.local` with template
- ✅ Generate Prisma Client
- ✅ Test database connection
- ✅ Seed the database
- ✅ Run type checks
- ✅ Optionally start the dev server

**Note:** You'll still need to update `DATABASE_URL` in `.env.local` with your Supabase password when prompted.

---

## Manual Setup (Step-by-Step)

## Step 1: Navigate to project directory

```bash
cd /Users/brycecraig/PETCONNECT
```

---

## Step 2: Install dependencies

```bash
npm install
```

**Expected output:**
- Dependencies installed
- No errors

**If errors occur:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Step 3: Set up environment variables

### 3.1 Create `.env.local` file

Create `.env.local` in the project root:

```bash
# In the project root directory
touch .env.local
```

### 3.2 Add required variables

Open `.env.local` and add:

```bash
# ============================================
# REQUIRED - App Configuration
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NODE_ENV=development

# ============================================
# REQUIRED - Database (Supabase)
# ============================================
# Get this from: https://supabase.com/dashboard/project/mwqoyvapjyjzaemsosoh
# Settings → Database → Connection string → URI
DATABASE_URL=postgresql://postgres.mwqoyvapjyjzaemsosoh:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# ============================================
# REQUIRED - Authentication
# ============================================
# Generate with: openssl rand -hex 32
AUTH_SECRET=5bf60d592e493e68370c6eed1adabdf7cd964ff5ae3cbcad85ace5ffba135d32

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
```

### 3.3 Get Supabase database connection string

1. Open: https://supabase.com/dashboard/project/mwqoyvapjyjzaemsosoh
2. Go to **Settings** → **Database**
3. Find **Connection string** → **URI**
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. Update `DATABASE_URL` in `.env.local`

**Example format:**

```bash
DATABASE_URL=postgresql://postgres.mwqoyvapjyjzaemsosoh:your_password_here@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

## Step 4: Verify database connection

### 4.1 Test connection

```bash
npx prisma db pull
```

**Expected output:**
- Connection successful
- Schema synced

**If it fails:**
- Check `DATABASE_URL` format
- Verify password
- Ensure database allows connections from your IP

### 4.2 Generate Prisma client

```bash
npm run db:generate
```

**Expected output:**
- Prisma Client generated

### 4.3 Verify database is seeded

```bash
# Check if products exist (optional)
npx prisma studio
```

This opens Prisma Studio. Check the `Product` table for 6 products.

**If products don't exist, seed the database:**

```bash
npm run db:seed
```

---

## Step 5: Start the development server

### 5.1 Start server

```bash
npm run dev
```

If port 3000 is in use, use port 3001:

```bash
PORT=3001 npm run dev
```

**Expected output:**

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3001
  - Ready in 2.3s
```

### 5.2 Open in browser

Open: **http://localhost:3001**

**You should see:**
- Home page loads
- Navigation visible
- No console errors

---

## Step 6: Test core features

### 6.1 Test public pages

1. **Home page**
   - URL: http://localhost:3001
   - Should show: Welcome message, featured products

2. **Products page**
   - URL: http://localhost:3001/products
   - Should show: 6 products from database

3. **About page**
   - URL: http://localhost:3001/about
   - Should show: About content

4. **Contact page**
   - URL: http://localhost:3001/contact
   - Should show: Contact form

### 6.2 Test authentication

1. **Registration**
   - URL: http://localhost:3001/register
   - Fill form:
     - Owner Name: "John Doe"
     - Pet Name: "Fluffy"
     - Email: "john@example.com"
     - Username: "johndoe" (lowercase, letters/numbers/underscores only)
     - Password: "password123" (min 8 characters)
     - Confirm Password: "password123"
   - Click "Create Account"
   - **Expected:** Success message, redirect to login

2. **Login**
   - URL: http://localhost:3001/login
   - Enter:
     - Username: "johndoe"
     - Password: "password123"
   - Click "Sign In"
   - **Expected:** Redirect to `/account` or dashboard

### 6.3 Test authenticated pages

1. **Account page**
   - URL: http://localhost:3001/account
   - Should show: Profile info, edit mode
   - Test: Edit profile, change password

2. **Orders page**
   - URL: http://localhost:3001/orders
   - Should show: Empty state (no orders yet)

3. **Page builder**
   - URL: http://localhost:3001/builder
   - Should show: Builder interface with sidebar
   - Test: Navigate sections, edit content

### 6.4 Test page builder features

1. **Links management**
   - URL: http://localhost:3001/builder/links
   - Add a link:
     - Title: "My Website"
     - URL: "https://example.com"
   - Test: Drag-and-drop reordering, delete

2. **Social links**
   - URL: http://localhost:3001/builder/socials
   - Add social URLs
   - Click "Save Social Links"

3. **Embeds**
   - URL: http://localhost:3001/builder/embeds
   - Add embed:
     - Provider: "YouTube"
     - Source URL: "https://youtube.com/watch?v=..."
   - Test: Add, delete, reorder

4. **Files**
   - URL: http://localhost:3001/builder/files
   - Add file by URL:
     - Name: "My Document"
     - URL: "https://example.com/file.pdf"
   - Test: Add, delete, reorder

### 6.5 Test public profile page

1. **View your page**
   - URL: http://localhost:3001/johndoe (or your username)
   - Should show: Public profile with your content
   - Test: Links, social icons, embeds, files

### 6.6 Test checkout (demo mode)

1. **Products page**
   - URL: http://localhost:3001/products
   - Click "Quick Checkout" on any product
   - **Expected:** Redirects to success page (demo mode)

2. **Full checkout**
   - Click "Full Checkout" on any product
   - Should show: Checkout form
   - **Note:** Payment tokenization not implemented yet (demo mode)

---

## Step 7: Verify everything works

### Checklist

- [ ] Home page loads
- [ ] Products page shows 6 products
- [ ] Registration creates account
- [ ] Login works
- [ ] Account page accessible
- [ ] Page builder loads
- [ ] Can add links
- [ ] Can add social links
- [ ] Can add embeds
- [ ] Can add files
- [ ] Public profile page displays correctly
- [ ] Checkout redirects (demo mode)
- [ ] No console errors
- [ ] No TypeScript errors

### Run type check

```bash
npm run type-check
```

**Expected:** No errors

### Run build test

```bash
npm run build
```

**Expected:** Build completes successfully

---

## Troubleshooting

### Issue: "Port 3000 already in use"

**Solution:**

```bash
# Use port 3001
PORT=3001 npm run dev
```

Then update `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### Issue: "Database connection failed"

**Solutions:**

1. Verify `DATABASE_URL` in `.env.local`
2. Check password is correct
3. Test connection:

   ```bash
   npx prisma db pull
   ```

4. Ensure Supabase allows connections from your IP

### Issue: "Module not found" errors

**Solution:**

```bash
# Clear and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Issue: "Prisma Client not generated"

**Solution:**

```bash
npm run db:generate
```

### Issue: "Products not showing"

**Solutions:**

1. Verify database is seeded:

   ```bash
   npm run db:seed
   ```

2. Check database connection
3. Open Prisma Studio to verify:

   ```bash
   npx prisma studio
   ```

### Issue: "Authentication not working"

**Solutions:**

1. Check `AUTH_SECRET` is set in `.env.local`
2. Restart dev server after changing `.env.local`
3. Clear browser cookies/localStorage
4. Check browser console for errors

### Issue: "TypeScript errors"

**Solution:**

```bash
# Check for errors
npm run type-check

# If errors, they should be fixed already
# If new errors appear, check the specific file mentioned
```

### Issue: "Build fails"

**Solutions:**

1. Check TypeScript errors:

   ```bash
   npm run type-check
   ```

2. Check for missing dependencies:

   ```bash
   npm install
   ```

3. Clear build cache:

   ```bash
   npm run clean
   npm run build
   ```

---

## Quick reference commands

```bash
# Start development server
npm run dev

# Start on specific port
PORT=3001 npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed products
npm run db:studio      # Open Prisma Studio

# Code quality
npm run lint           # Check code
npm run lint:fix       # Fix linting issues
npm run format         # Format code

# Cleanup
npm run clean          # Remove build artifacts
```

---

## Development workflow

### Daily development

1. Start server: `npm run dev`
2. Make changes
3. Test in browser
4. Check console for errors

### After changing environment variables

1. Stop server (Ctrl+C)
2. Update `.env.local`
3. Restart server: `npm run dev`

### After database schema changes

1. Update `prisma/schema.prisma`
2. Run: `npm run db:push`
3. Run: `npm run db:generate`
4. Restart server

---

## What to expect

### Working features

- User registration and login
- Account management
- Page builder interface
- Public profile pages
- Product catalog
- Order history (viewing)
- Checkout flows (demo mode)
- Contact forms (console logging)

### Demo/placeholder features

- Payment processing (demo mode — redirects to success)
- Email delivery (logs to console)
- File uploads (can add by URL)
- Rate limiting (disabled without Upstash)

---

## Next steps after testing

1. Add product images to `public/images/`
2. Configure payment provider (see `PAYMENT_INTEGRATION.md`)
3. Set up Resend for email (optional)
4. Configure Vercel Blob for file uploads (optional)
5. Set up Upstash Redis for rate limiting (optional)

---

## Support

If issues persist:

1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all environment variables are set
4. Ensure database connection is working
5. Review the troubleshooting section above

---

**Your frontend should be running locally and ready for testing. All core features should work, with payment processing in demo mode until you integrate your payment provider.**

