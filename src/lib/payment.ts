// src/lib/payment.ts
// Payment processor interface - replace with your own payment integration

export interface PaymentSession {
  id: string;
  url?: string; // For hosted checkout redirect
  clientSecret?: string; // For embedded checkout
}

export interface CreatePaymentSessionParams {
  slug: string;
  quantity: number;
  amount: number; // in cents
  currency: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentParams {
  slug: string;
  quantity: number;
  amount: number; // in cents
  currency: string;
  metadata?: Record<string, string>;
}

/**
 * Check if payment provider is configured
 */
function isPaymentProviderConfigured(): boolean {
  return !!(
    process.env.PAYMENT_PROVIDER_BASE_URL &&
    process.env.PAYMENT_SECRET_KEY &&
    process.env.PAYMENT_PUBLIC_KEY
  );
}

/**
 * Create a payment session for hosted checkout
 *
 * Development Mode: If PAYMENT_PROVIDER_BASE_URL is not set, returns a demo session
 * Production Mode: Integrate with your actual payment processor
 *
 * To integrate your payment provider:
 * 1. Set PAYMENT_PROVIDER_BASE_URL, PAYMENT_SECRET_KEY, PAYMENT_PUBLIC_KEY in .env.local
 * 2. Replace the fetch call below with your provider's API
 * 3. Update the response handling to match your provider's format
 */
export async function createPaymentSession(
  params: CreatePaymentSessionParams
): Promise<PaymentSession> {
  // Development/Demo mode: Return mock session for testing
  if (!isPaymentProviderConfigured() || process.env.NODE_ENV === 'development') {
    const sessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // In demo mode, redirect directly to success with a mock session ID
    return {
      id: sessionId,
      url: params.successUrl.replace('{CHECKOUT_SESSION_ID}', sessionId),
    };
  }

  // Production mode: Use actual payment provider
  // TODO: Replace this fetch with your payment processor's API
  try {
    const response = await fetch(`${process.env.PAYMENT_PROVIDER_BASE_URL}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payment provider error: ${error}`);
    }

    const data = await response.json();
    return {
      id: data.id || data.sessionId,
      url: data.url || data.checkoutUrl,
      clientSecret: data.clientSecret,
    };
  } catch (error) {
    console.error('Payment session creation error:', error);
    throw error;
  }
}

/**
 * Create a payment intent for embedded checkout
 *
 * Development Mode: Returns a demo client secret
 * Production Mode: Integrate with your actual payment processor
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentSession> {
  // Development/Demo mode: Return mock intent for testing
  if (!isPaymentProviderConfigured() || process.env.NODE_ENV === 'development') {
    const intentId = `demo_intent_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const clientSecret = `demo_secret_${Math.random().toString(36).substring(2, 15)}`;

    return {
      id: intentId,
      clientSecret: clientSecret,
    };
  }

  // Production mode: Use actual payment provider
  // TODO: Replace this fetch with your payment processor's API
  try {
    const response = await fetch(`${process.env.PAYMENT_PROVIDER_BASE_URL}/v1/payment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        metadata: params.metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payment provider error: ${error}`);
    }

    const data = await response.json();
    return {
      id: data.id || data.intentId,
      clientSecret: data.clientSecret || data.secret,
    };
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 *
 * Development Mode: Returns true if secret matches (for testing)
 * Production Mode: Implement your provider's signature verification
 *
 * To implement:
 * 1. Get your provider's webhook secret from PAYMENT_WEBHOOK_SECRET
 * 2. Implement HMAC verification according to your provider's documentation
 * 3. Replace this with your provider's verification method
 */
export function verifyWebhookSignature(
  _payload: string,
  signature: string,
  secret: string
): boolean {
  // Development mode: Simple string comparison for testing
  if (process.env.NODE_ENV === 'development' && !process.env.PAYMENT_WEBHOOK_SECRET) {
    // Allow all webhooks in dev mode if secret matches a test value
    return signature === secret || secret === 'dev_webhook_secret';
  }

  // Production mode: Implement actual HMAC verification
  // TODO: Replace with your payment processor's signature verification
  // Example for Stripe-style verification:
  /*
  import crypto from 'crypto';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
  */

  // For now, basic verification (replace with actual implementation)
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || secret;
  return signature === webhookSecret || signature.startsWith('sha256=');
}
