# Setup Checklist

Use this checklist to ensure your project is fully configured and ready to run.

## ✅ Pre-Installation Setup

- [ ] Node.js 24 LTS installed (`node -v` should show 24.x)
- [ ] npm or yarn installed
- [ ] Git initialized (optional, for version control)

## ✅ Installation Steps

1. [ ] Install dependencies:
   ```bash
   npm install
   ```

2. [ ] Copy environment template:
   ```bash
   cp .env.example .env.local
   ```

3. [ ] Configure `.env.local` with your values:
   - [ ] `NEXT_PUBLIC_SITE_URL` - Set to `http://localhost:3000` for dev
   - [ ] `PAYMENT_SECRET_KEY` - Your payment processor secret key
   - [ ] `NEXT_PUBLIC_PAYMENT_PUBLISHABLE_KEY` - Your payment processor publishable key
   - [ ] `PAYMENT_WEBHOOK_SECRET` - Webhook secret (can be set later)
   - [ ] `RESEND_API_KEY` - Resend API key (optional, for contact form)
   - [ ] `CONTACT_TO_EMAIL` - Email to receive contact form submissions
   - [ ] `CONTACT_FROM_EMAIL` - Verified sender email for Resend

4. [ ] Add product images to `public/images/`:
   - [ ] `alpha.jpg`
   - [ ] `beta.jpg`
   - [ ] `gamma.jpg`
   - [ ] `delta.jpg`
   - [ ] `epsilon.jpg`
   - [ ] `zeta.jpg`

   **Note:** If you don't have images yet, the app will show placeholder "No image" text.

## ✅ Payment Integration

- [ ] Review `PAYMENT_INTEGRATION.md` guide
- [ ] Implement `createPaymentSession()` in `src/lib/payment.ts`
- [ ] Implement `createPaymentIntent()` in `src/lib/payment.ts`
- [ ] Implement `verifyWebhookSignature()` in `src/lib/payment.ts`
- [ ] Add payment form component to `src/app/checkout/page.tsx`
- [ ] Update webhook handler in `src/app/api/webhooks/payment/route.ts` with your event types
- [ ] Update payment processing in `src/app/api/process-payment/route.ts`

## ✅ Development

1. [ ] Start development server:
   ```bash
   npm run dev
   ```

2. [ ] Test the application:
   - [ ] Home page loads correctly
   - [ ] Products page displays all 6 products
   - [ ] Navigation works (Home, Products, About, Contact)
   - [ ] Contact form submits successfully (if Resend configured)
   - [ ] Quick checkout button works (once payment integration complete)
   - [ ] Full checkout page loads with form (once payment integration complete)

3. [ ] Test error handling:
   - [ ] Visit non-existent page (should show 404)
   - [ ] Submit contact form with invalid data (should show validation errors)

## ✅ Code Quality

- [ ] Run linter:
   ```bash
   npm run lint
   ```

- [ ] Fix any linting errors
- [ ] Review code structure and organization
- [ ] Ensure TypeScript types are correct

## ✅ Production Readiness

1. [ ] Build the project:
   ```bash
   npm run build
   ```

2. [ ] Test production build locally:
   ```bash
   npm run start
   ```

3. [ ] Configure production environment variables:
   - [ ] Set all required env vars in your hosting platform
   - [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
   - [ ] Use production payment processor keys
   - [ ] Configure production webhook endpoint

4. [ ] Set up webhooks:
   - [ ] Configure webhook endpoint in payment processor dashboard
   - [ ] Set webhook URL to: `https://YOUR_DOMAIN/api/webhooks/payment`
   - [ ] Copy webhook secret to `PAYMENT_WEBHOOK_SECRET`

5. [ ] Deploy:
   - [ ] Push code to Git repository
   - [ ] Deploy to Vercel or your preferred platform
   - [ ] Verify deployment works correctly
   - [ ] Test production checkout flows

## ✅ Post-Deployment

- [ ] Test all pages in production
- [ ] Test quick checkout flow
- [ ] Test full checkout flow
- [ ] Test contact form
- [ ] Verify webhooks are received correctly
- [ ] Monitor error logs for any issues
- [ ] Set up analytics (optional)

## 🎉 Project Complete!

Once all items are checked, your e-commerce application is fully configured and ready for use!

