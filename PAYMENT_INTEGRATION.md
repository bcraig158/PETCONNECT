# Payment Integration Guide

This guide will help you integrate your custom payment processor into the PetConnect application.

## Overview

The application has been structured to use a generic payment interface, making it easy to plug in your payment processor. There are two checkout flows:

1. **Quick Checkout**: Hosted checkout page (customer is redirected)
2. **Full Checkout**: Embedded checkout with custom form on your site

## Integration Steps

### 1. Update Payment Library (`src/lib/payment.ts`)

This file contains the payment processor interface. You need to implement three main functions:

#### `createPaymentSession()` - For Quick Checkout

This function creates a hosted checkout session and returns a URL to redirect the customer.

```typescript
export async function createPaymentSession(
  params: CreatePaymentSessionParams
): Promise<PaymentSession> {
  // TODO: Implement your payment processor's hosted checkout
  // 
  // Example structure:
  // 1. Call your payment processor's API to create a checkout session
  // 2. Include: amount, currency, success/cancel URLs, metadata
  // 3. Return { id: sessionId, url: checkoutUrl }
  
  const session = await yourPaymentProcessor.createSession({
    amount: params.amount,
    currency: params.currency,
    successUrl: params.successUrl,
    cancelUrl: params.cancelUrl,
    metadata: params.metadata,
  });
  
  return {
    id: session.id,
    url: session.checkoutUrl,
  };
}
```

#### `createPaymentIntent()` - For Full Checkout

This function creates a payment intent for embedded checkout.

```typescript
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentSession> {
  // TODO: Implement your payment processor's payment intent
  //
  // Example structure:
  // 1. Call your payment processor's API to create a payment intent
  // 2. Include: amount, currency, metadata
  // 3. Return { id: intentId, clientSecret: secret }
  
  const intent = await yourPaymentProcessor.createIntent({
    amount: params.amount,
    currency: params.currency,
    metadata: params.metadata,
  });
  
  return {
    id: intent.id,
    clientSecret: intent.clientSecret,
  };
}
```

#### `verifyWebhookSignature()` - For Webhook Security

This function verifies that incoming webhooks are legitimate.

```typescript
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // TODO: Implement your payment processor's signature verification
  //
  // Example using HMAC:
  // const crypto = require('crypto');
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(payload)
  //   .digest('hex');
  // return signature === expectedSignature;
  
  return yourPaymentProcessor.verifySignature(payload, signature, secret);
}
```

### 2. Update Checkout Page (`src/app/checkout/page.tsx`)

In the "Payment Information" section, add your payment processor's payment form component.

Look for this section in the file:
```typescript
<div className="mt-4">
  <h2 className="text-lg font-medium mb-2">Payment Information</h2>
  {/* TODO: Add your payment processor's payment form component here */}
</div>
```

Replace it with your actual payment form. For example:
```typescript
<div className="mt-4">
  <h2 className="text-lg font-medium mb-2">Payment Information</h2>
  <YourPaymentForm
    clientSecret={paymentIntent?.clientSecret}
    onSuccess={() => router.push('/success')}
    onError={(error) => alert(error.message)}
  />
</div>
```

### 3. Update Payment Processing Endpoint (`src/app/api/process-payment/route.ts`)

In the full checkout flow, you need to actually process the payment with the customer's payment method.

Find this section:
```typescript
// TODO: Process the payment with customer data
// This is where you would integrate with your payment processor
// to actually charge the customer based on the payment method provided
```

Replace it with actual payment processing:
```typescript
const paymentResult = await yourPaymentProcessor.confirmPayment({
  paymentIntentId: paymentIntent.id,
  customerData: customer,
  // Include payment method data from your form
});

if (!paymentResult.success) {
  return NextResponse.json(
    { error: paymentResult.error },
    { status: 400 }
  );
}
```

### 4. Update Webhook Handler (`src/app/api/webhooks/payments/route.ts`)

Customize the webhook event handling for your payment processor's event types.

Update the event type checks:
```typescript
switch (event.type) {
  case 'payment.succeeded':  // Update to match your processor
    // Fulfill order
    break;
  case 'payment.failed':  // Update to match your processor
    // Handle failure
    break;
  // Add other event types as needed
}
```

### 5. Environment Variables

Update `.env.local` with your payment processor credentials:
- `PAYMENT_SECRET_KEY`: Your server-side secret key
- `PAYMENT_PUBLIC_KEY`: Your client-side public key
- `PAYMENT_PROVIDER_BASE_URL`: Your payment provider API base URL (if using custom provider)
- `PAYMENT_WEBHOOK_SECRET`: Webhook signing secret

## Testing

### Test Quick Checkout
1. Go to `/products`
2. Click "Quick Checkout" on any product
3. Verify redirect to your hosted checkout
4. Complete test payment
5. Verify redirect back to `/success`

### Test Full Checkout
1. Go to `/products`
2. Click "Full Checkout" on any product
3. Fill out customer information form
4. Complete payment in embedded form
5. Verify redirect to `/success`

### Test Webhooks
1. Use your payment processor's webhook testing tool
2. Forward webhooks to: `http://localhost:3000/api/webhooks/payments` (recommended)
   
   **Note**: Both `/api/webhooks/payments` and `/api/webhooks/payment` are available. Use `/payments` for full database integration.
3. Verify events are received and processed correctly

## Security Checklist

- ✅ All prices calculated server-side (client only sends slug/quantity)
- ✅ Payment sessions/intents created server-side
- ✅ Webhook signatures verified
- ✅ No payment secrets exposed to client
- ✅ Customer data validated with Zod schemas

## Common Payment Processors

If you're integrating with a specific processor, here are some common ones:

- **Square**: [Square Payments API](https://developer.squareup.com/docs)
- **PayPal**: [PayPal Checkout SDK](https://developer.paypal.com/docs/checkout/)
- **Authorize.Net**: [Authorize.Net Developer Center](https://developer.authorize.net/)
- **Braintree**: [Braintree Developer Docs](https://developer.paypal.com/braintree/docs)

Each processor will have its own SDK and API structure, but the integration pattern remains the same.

## Need Help?

If you encounter issues:
1. Check your payment processor's documentation
2. Verify environment variables are set correctly
3. Check browser console and server logs for errors
4. Test with your payment processor's test mode/credentials first

