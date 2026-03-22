import type { PaymentProvider } from './provider';

function getPaymentEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Payment env var ${key} is required but not set`);
  }
  return value;
}

export const CustomProvider: PaymentProvider = {
  async createHostedCheckout({ orderId, lines, customer, successUrl, cancelUrl }) {
    const base = getPaymentEnv('PAYMENT_PROVIDER_BASE_URL');
    const secret = getPaymentEnv('PAYMENT_SECRET_KEY');

    const res = await fetch(`${base}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        orderId,
        line_items: lines,
        customer,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Provider error: ${error}`);
    }
    const data = await res.json();
    return { redirectUrl: data.url, providerRef: data.id };
  },

  async tokenizeCard({ cardPayload }) {
    const base = getPaymentEnv('PAYMENT_PROVIDER_BASE_URL');
    const pub = getPaymentEnv('PAYMENT_PUBLIC_KEY');

    const res = await fetch(`${base}/v1/tokens`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${pub}`,
      },
      body: JSON.stringify({ card: cardPayload }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Tokenization failed: ${error}`);
    }
    return res.json();
  },

  async chargeWithToken({ orderId, token, amountCents, currency }) {
    const base = getPaymentEnv('PAYMENT_PROVIDER_BASE_URL');
    const secret = getPaymentEnv('PAYMENT_SECRET_KEY');

    const res = await fetch(`${base}/v1/charges`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        orderId,
        token,
        amount: amountCents,
        currency,
      }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Charge failed: ${error}`);
    }
    return res.json();
  },
};
