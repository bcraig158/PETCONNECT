# PetConnect - E-commerce & Profile Builder Platform

A complete platform combining e-commerce capabilities with customizable profile pages for pet owners. Built with Next.js, featuring dual checkout options, product catalog, profile page builder, and contact forms.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Hosting**: Netlify
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Forms & Validation**: React Hook Form + Zod
- **State Management**: Zustand
- **Email**: Resend API (optional)
- **Payment Processing**: Custom integration (implement your own)

## Features

- ✅ **E-commerce**: Product catalog stored in database
- ✅ **User Authentication**: Registration, login, and session management
- ✅ **Profile Page Builder**: Create customizable profile pages for pets
  - Links management with drag-and-drop reordering
  - File uploads and management
  - Embeds support (YouTube, Vimeo, Twitter, etc.)
  - Bio and profile customization
- ✅ **Order Management**: View order history and one-click reordering
- ✅ **Dual Checkout Options**:
  - Quick Checkout (hosted checkout redirect)
  - Full Checkout (embedded checkout with customer form)
- ✅ **Contact Form**: Email delivery via Resend API
- ✅ **Webhook Support**: Payment event handling
- ✅ **Responsive Design**: Tailwind CSS

## Getting Started

See **[docs/SETUP.md](./docs/SETUP.md)** for complete setup instructions.

Quick start:

1. Install dependencies: `npm install`
2. Create `.env.local` with your configuration
3. Set up database: `npx prisma db push && npm run db:seed`
4. Start dev server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, troubleshooting, and environment variable configuration, see [docs/SETUP.md](./docs/SETUP.md).

## Payment Integration

This project is configured for a custom payment processor. See **[docs/PAYMENT_INTEGRATION.md](./docs/PAYMENT_INTEGRATION.md)** for detailed integration instructions.

Quick overview:
1. Implement payment functions in `src/lib/payment.ts`
2. Add payment form component to `src/app/checkout/page.tsx`
3. Configure webhook endpoint at `/api/webhooks/payments`
4. Update event handling in webhook route

## Project Structure

```
src/
  app/
    api/
      auth/[...nextauth]/        # NextAuth authentication routes
      register/                  # User registration endpoint
      page/                      # Page builder API endpoints
        links/                    # Links CRUD
        files/                    # Files CRUD
        embeds/                   # Embeds CRUD
      checkout/                  # Checkout endpoints
        hosted/                   # Hosted checkout
        embedded/                 # Embedded checkout
      orders/                    # Order management
      webhooks/                  # Payment webhooks
    (auth)/                      # Auth group routes
      login/                     # Login page
      register/                  # Registration page
    builder/                     # Page builder interface
      links/                     # Links management
      files/                     # Files management
      embeds/                    # Embeds management
    [username]/                  # Public profile pages
    checkout/                    # Full checkout page
    products/                    # Products listing (from database)
    orders/                      # Order history
    account/                     # User account page
  components/
    builder/                     # Builder-specific components
    public/                      # Public page components
  lib/
    products.ts                  # Product helpers (database-based)
    db.ts                        # Prisma client
    payment.ts                   # Payment processor interface
    payments/                    # Payment provider abstraction
```

## Development

### Available Scripts

- `npm run dev` - Start development server (with Turbopack)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm run db:studio` - Open Prisma Studio

See [docs/SETUP.md](./docs/SETUP.md) for a complete list of available scripts.

### Testing Payments

1. Use your payment processor's test mode
2. For quick checkout, click "Quick Checkout" on any product
3. For full checkout, click "Full Checkout" and fill out the form

### Webhook Testing

For local webhook testing, use your payment processor's CLI or webhook forwarding tool to forward events to:
```
http://localhost:3000/api/webhooks/payments
```

**Note**: Both `/api/webhooks/payments` and `/api/webhooks/payment` are available. The `/payments` endpoint is recommended as it has full database integration.

## Deployment

This project is configured for **Netlify + Supabase** deployment.

### Quick Deploy

1. Push your code to Git (GitHub, GitLab, or Bitbucket)
2. Create a Supabase project and get your database connection string
3. Import project in Netlify and connect your Git repository
4. Set environment variables in Netlify Dashboard
5. Deploy!

See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** for complete deployment instructions.

### Required Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

- `DATABASE_URL` - Supabase PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret (generate with `openssl rand -hex 32`)
- `NEXT_PUBLIC_SITE_URL` - Your Netlify site URL

### Optional Environment Variables

- `RESEND_API_KEY` - For contact form emails
- `CONTACT_TO_EMAIL` - Email to receive contact form submissions
- `CONTACT_FROM_EMAIL` - Verified sender email for Resend

## Product Images

Add product images to `public/images/`:
- `alpha.jpg`
- `beta.jpg`
- `gamma.jpg`
- `delta.jpg`
- `epsilon.jpg`
- `zeta.jpg`

## Security Notes

- All prices are server-calculated (client only sends slug/quantity)
- Payment sessions/intents are created server-side
- Webhook signatures are verified before processing
- Never expose payment secrets to the client

## Documentation

All documentation is located in the [`docs/`](./docs/) folder:

- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Netlify + Supabase deployment guide
- **[SETUP.md](./docs/SETUP.md)** - Complete local setup guide
- **[SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md)** - Setup checklist
- **[PAYMENT_INTEGRATION.md](./docs/PAYMENT_INTEGRATION.md)** - Payment provider integration
- **[PAGE_BUILDER_GUIDE.md](./docs/PAGE_BUILDER_GUIDE.md)** - Page builder documentation
- **[ADVANCED_PAGE_BUILDER.md](./docs/ADVANCED_PAGE_BUILDER.md)** - Advanced page builder features
- **[PERFORMANCE_OPTIMIZATIONS.md](./docs/PERFORMANCE_OPTIMIZATIONS.md)** - Performance optimizations
- **[SONARLINT_WARNINGS.md](./docs/SONARLINT_WARNINGS.md)** - SonarLint warnings reference

## License

MIT

