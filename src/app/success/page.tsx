// src/app/success/page.tsx
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <section className="max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank you!</h1>
        <p className="text-lg text-neutral-600 mb-4">
          Your payment was successful.
        </p>
        {sessionId && (
          <p className="text-sm text-neutral-500">
            Order ID: {sessionId}
          </p>
        )}
        <p className="text-neutral-600 mt-4">
          A confirmation email has been sent to you with order details.
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <Link
          href="/products"
          className="rounded bg-black px-6 py-2 text-white"
        >
          Continue Shopping
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <section className="max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
      </section>
    }>
      <SuccessContent />
    </Suspense>
  );
}

