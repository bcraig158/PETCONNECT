import Link from 'next/link';
import { XCircle, ShoppingBag, Home } from 'lucide-react';

export default function CancelPage() {
  return (
    <section className="max-w-lg mx-auto text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
        <p className="text-lg text-neutral-600">
          No charge was made. Your order has not been placed.
        </p>
      </div>

      <div className="bg-neutral-50 rounded-xl p-4 mb-8 text-sm text-neutral-600">
        Changed your mind? No worries — you can return to your cart or browse more products anytime.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-white font-medium hover:bg-neutral-800 transition-colors"
        >
          <ShoppingBag size={18} />
          Browse Products
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 font-medium hover:bg-neutral-50 transition-colors"
        >
          <Home size={18} />
          Return Home
        </Link>
      </div>
    </section>
  );
}
