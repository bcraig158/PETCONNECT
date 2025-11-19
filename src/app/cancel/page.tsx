// src/app/cancel/page.tsx
import Link from 'next/link';

export default function CancelPage() {
  return (
    <section className="max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
        <p className="text-lg text-neutral-600 mb-4">
          No charge was made. You can safely close this page or try again.
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <Link
          href="/products"
          className="rounded bg-black px-6 py-2 text-white"
        >
          Browse Products
        </Link>
        <Link
          href="/"
          className="rounded border px-6 py-2"
        >
          Return to Home
        </Link>
      </div>
    </section>
  );
}

