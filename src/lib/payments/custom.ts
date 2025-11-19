// src/lib/payments/custom.ts
import type { PaymentProvider } from "./provider";

const BASE = process.env.PAYMENT_PROVIDER_BASE_URL!;
const SECRET = process.env.PAYMENT_SECRET_KEY!;
const PUB = process.env.PAYMENT_PUBLIC_KEY!;

// Example using fetch; replace endpoints/fields to match your processor
export const CustomProvider: PaymentProvider = {
  async createHostedCheckout({ orderId, lines, customer, successUrl, cancelUrl }) {
    const res = await fetch(`${BASE}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${SECRET}`,
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
    // Typically done client-side via provider JS SDK; fallback server call if needed
    const res = await fetch(`${BASE}/v1/tokens`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${PUB}`,
      },
      body: JSON.stringify({ card: cardPayload }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Tokenization failed: ${error}`);
    }
    return res.json(); // { token }
  },

  async chargeWithToken({ orderId, token, amountCents, currency }) {
    const res = await fetch(`${BASE}/v1/charges`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${SECRET}`,
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
    return res.json(); // { providerRef, status }
  },
};

