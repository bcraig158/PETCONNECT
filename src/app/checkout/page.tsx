// src/app/checkout/page.tsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatUSD } from '@/lib/currency';

type OrderData = {
  orderId: string;
  amountCents: number;
  currency: string;
};

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [cardToken, setCardToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      router.push('/products');
      return;
    }

    // Fetch order details if needed (already have from embedded route)
    // For now, we assume orderId is valid and fetch amount if needed
    fetch(`/api/checkout/embedded?orderId=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orderId) {
          setOrder(data);
        }
      })
      .catch(() => {
        setError('Failed to load order details');
      });
  }, [orderId, router]);

  // Payment tokenization placeholder (unused for now, will be used when payment provider SDK is integrated)
  // const handleTokenize = async () => {
  //   // This is where you would integrate your payment provider's JS SDK
  //   // to tokenize the card client-side. For now, this is a placeholder.
  //   // The actual implementation depends on your payment provider.
  //   
  //   // Example structure (replace with your provider's actual SDK):
  //   // const token = await paymentProviderSDK.tokenize({
  //   //   cardNumber: '...',
  //   //   expiry: '...',
  //   //   cvv: '...',
  //   // });
  //   
  //   alert('Payment tokenization not yet implemented. Please integrate your payment provider\'s JS SDK here to tokenize cards client-side.');
  //   return null;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !cardToken) {
      setError('Please complete card tokenization first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/embedded/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token: cardToken }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'PAID') {
        router.push(`/success?order_id=${orderId}`);
      } else {
        setError(data.error || 'Payment processing failed');
        setLoading(false);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!order && !error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <section>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Back to Products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Full Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <form onSubmit={handleSubmit} className="grid gap-3">
          <h2 className="text-lg font-medium">Payment Information</h2>
          
          <div className="p-4 border rounded bg-neutral-50">
            <p className="text-sm text-neutral-600 mb-3">
              <strong>Note:</strong> Integrate your payment provider's hosted fields or JS SDK here
              to tokenize the card client-side. Never collect raw card numbers on your server.
            </p>
            <p className="text-xs text-neutral-500">
              This should use your provider's hosted payment fields (iframe) or JS SDK
              to generate a secure token. Replace this placeholder with your actual integration.
            </p>
          </div>

          {/* Placeholder for payment provider's hosted fields */}
          <div id="payment-form" className="border rounded p-4 min-h-[200px] flex items-center justify-center bg-neutral-50">
            <p className="text-sm text-neutral-600 text-center">
              Payment form placeholder<br />
              Integrate your payment provider SDK here
            </p>
          </div>

          <input
            type="text"
            placeholder="Payment Token (from provider SDK)"
            value={cardToken}
            onChange={(e) => setCardToken(e.target.value)}
            className="rounded border p-2"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !cardToken}
            className="mt-3 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Processing…' : `Pay ${order ? formatUSD(order.amountCents) : ''}`}
          </button>
        </form>

        <div className="border rounded p-4 h-fit">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <div className="space-y-2">
            {order && (
              <>
                <div className="flex justify-between">
                  <span>Order #{order.orderId.slice(-8)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatUSD(order.amountCents)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <section>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </section>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
