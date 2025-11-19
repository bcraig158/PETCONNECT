// src/lib/payments/provider.ts

export type LineItem = {
  name: string;
  quantity: number;
  unitCents: number;
  currency: string;
  productId: string;
};

export interface PaymentProvider {
  createHostedCheckout(args: {
    orderId: string;
    lines: LineItem[];
    customer: { email?: string; name?: string };
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ redirectUrl: string; providerRef: string }>;

  tokenizeCard?(args: {
    // only when using embedded fields/tokenization
    cardPayload: unknown; // tokenization result from provider JS
  }): Promise<{ token: string }>;

  chargeWithToken?(args: {
    orderId: string;
    token: string;
    amountCents: number;
    currency: string;
  }): Promise<{ providerRef: string; status: "PENDING" | "PAID" }>;
}

