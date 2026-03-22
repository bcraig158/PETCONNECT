'use client';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatUSD } from '@/lib/currency';
import { toast } from 'sonner';
import { RotateCcw, ShoppingBag, CreditCard } from 'lucide-react';

type OrderData = {
  orderId: string;
  amountCents: number;
  currency: string;
  items?: Array<{
    name: string;
    quantity: number;
    unitCents: number;
  }>;
};

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [cardToken, setCardToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fetchFailed, setFetchFailed] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setFetchFailed(false);
    setError('');

    try {
      const res = await fetch(`/api/checkout/embedded?orderId=${orderId}`);
      const data = await res.json();
      if (data.orderId) {
        setOrder(data);
      } else {
        setError(data.error || 'Order not found');
        setFetchFailed(true);
      }
    } catch {
      setError('Failed to load order details');
      setFetchFailed(true);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      router.push('/products');
      return;
    }
    fetchOrder();
  }, [orderId, router, fetchOrder]);

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
        toast.success('Payment successful!');
        router.push(`/success?order_id=${orderId}`);
      } else {
        setError(data.error || 'Payment processing failed');
        setLoading(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!order && !error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-black mx-auto" />
          <p className="text-sm text-neutral-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (fetchFailed) {
    return (
      <section className="max-w-md mx-auto">
        <div className="text-center py-16 space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="text-red-400" size={24} />
          </div>
          <h2 className="text-lg font-semibold">Unable to load order</h2>
          <p className="text-neutral-600 text-sm">{error}</p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={fetchOrder}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw size={16} />
              Retry
            </button>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              <ShoppingBag size={16} />
              Products
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold">Payment Information</h2>

          <div className="p-4 border rounded-lg bg-neutral-50">
            <p className="text-sm text-neutral-600 mb-2">
              <strong>Note:</strong> Integrate your payment provider&apos;s hosted fields or JS SDK
              here to securely tokenize card details.
            </p>
            <p className="text-xs text-neutral-500">
              Never collect raw card numbers on your server.
            </p>
          </div>

          <div
            id="payment-form"
            className="border-2 border-dashed rounded-lg p-6 min-h-[180px] flex items-center justify-center bg-neutral-50"
          >
            <div className="text-center">
              <CreditCard className="text-neutral-300 mx-auto mb-2" size={32} />
              <p className="text-sm text-neutral-500">
                Payment provider SDK integration area
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="payment-token" className="block text-sm font-medium mb-1">
              Payment Token
            </label>
            <input
              id="payment-token"
              type="text"
              placeholder="Token from provider SDK"
              value={cardToken}
              onChange={(e) => setCardToken(e.target.value)}
              className="w-full rounded-lg border p-2.5"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !cardToken}
            className="w-full rounded-lg bg-black px-4 py-3 text-white font-medium disabled:opacity-50 hover:bg-neutral-800 transition-colors"
          >
            {loading ? 'Processing...' : `Pay ${order ? formatUSD(order.amountCents) : ''}`}
          </button>
        </form>

        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {order && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-500">Order #{order.orderId.slice(-8)}</p>

              {order.items && order.items.length > 0 && (
                <div className="space-y-2 border-b pb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.name} &times; {item.quantity}
                      </span>
                      <span>{formatUSD(item.unitCents * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between font-semibold text-lg pt-1">
                <span>Total</span>
                <span>{formatUSD(order.amountCents)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-black" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
