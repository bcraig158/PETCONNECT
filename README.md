# PetConnect - E-commerce & Profile Builder Platform

A complete platform combining e-commerce capabilities with customizable profile pages for pet owners. Built with Next.js, featuring dual checkout options, product catalog, profile page builder, and contact forms.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Forms & Validation**: React Hook Form + Zod
- **State Management**: Zustand
- **Email**: Resend API
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

### Prerequisites

- Node.js 24 LTS
- npm or yarn
- Resend account for email (optional, for contact form)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see `.env.example` for all options):
- `DATABASE_URL`: PostgreSQL connection string (required)
- `AUTH_SECRET`: Generate with `openssl rand -hex 32` (required)
- `NEXT_PUBLIC_SITE_URL`: Your site URL (http://localhost:3000 for dev)
- `PAYMENT_SECRET_KEY`: Your payment processor secret key
- `PAYMENT_PUBLIC_KEY`: Your payment processor public key
- `PAYMENT_WEBHOOK_SECRET`: Webhook secret from your payment processor
- `RESEND_API_KEY`: Resend API key (for contact form)
- `CONTACT_TO_EMAIL`: Email address to receive contact form submissions
- `CONTACT_FROM_EMAIL`: Verified sender email for Resend
- `UPSTASH_REDIS_REST_URL`: Upstash Redis URL (for rate limiting)
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis token
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token (optional, for file uploads)

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Payment Integration

This project is configured for a custom payment processor. To integrate your payment provider:

1. **Update `src/lib/payment.ts`**:
   - Implement `createPaymentSession()` for hosted checkout
   - Implement `createPaymentIntent()` for embedded checkout
   - Implement `verifyWebhookSignature()` for webhook verification

2. **Update `src/app/checkout/page.tsx`**:
   - Add your payment processor's payment form component in the "Payment Information" section

3. **Configure webhooks**:
   - Set up webhook endpoint at `/api/webhooks/payments` (recommended)
   - Or use `/api/webhooks/payment` for backward compatibility
   - Update event type handling in the webhook route
   - Add your webhook secret to `.env.local`

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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

### Vercel (Recommended)

1. Push your code to Git
2. Import project in Vercel
3. Add environment variables in Vercel Project Settings
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `NEXT_PUBLIC_SITE_URL` - Your production domain
- `PAYMENT_SECRET_KEY` - Production payment processor key
- `NEXT_PUBLIC_PAYMENT_PUBLISHABLE_KEY` - Production publishable key
- `PAYMENT_WEBHOOK_SECRET` - Production webhook secret
- `RESEND_API_KEY` - Resend API key
- `CONTACT_TO_EMAIL` - Contact form recipient
- `CONTACT_FROM_EMAIL` - Verified sender email

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

## License

MIT

