'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const displayId = orderId || sessionId;

  return (
    <section className="max-w-lg mx-auto text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank you!</h1>
        <p className="text-lg text-neutral-600">
          Your payment was successful and your order is being processed.
        </p>
      </div>

      {displayId && (
        <div className="bg-neutral-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-neutral-500 mb-1">Order Reference</p>
          <p className="font-mono font-medium">{displayId}</p>
        </div>
      )}

      <p className="text-neutral-600 text-sm mb-8">
        A confirmation email will be sent to you with your order details and tracking information.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-white font-medium hover:bg-neutral-800 transition-colors"
        >
          <Package size={18} />
          View Orders
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-medium hover:bg-neutral-50 transition-colors"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-medium hover:bg-neutral-50 transition-colors"
        >
          <Home size={18} />
          Home
        </Link>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-lg mx-auto text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-neutral-100 rounded-full mx-auto" />
            <div className="h-8 w-48 bg-neutral-100 rounded mx-auto" />
            <div className="h-4 w-64 bg-neutral-100 rounded mx-auto" />
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
