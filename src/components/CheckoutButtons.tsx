// src/components/CheckoutButtons.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutButtons({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function basic() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/hosted', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productSlug: slug, quantity: 1 }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert(data.error || 'Unable to start checkout.');
      }
    } catch (error) {
      setLoading(false);
      alert('Checkout failed. Please try again.');
    }
  }

  async function full() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/embedded', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productSlug: slug, quantity: 1 }),
      });
      const data = await res.json();
      if (data.orderId) {
        router.push(`/checkout?orderId=${data.orderId}`);
      } else {
        setLoading(false);
        alert(data.error || 'Unable to start checkout.');
      }
    } catch (error) {
      setLoading(false);
      alert('Checkout failed. Please try again.');
    }
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        onClick={basic}
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Starting…' : 'Quick Checkout'}
      </button>
      <button
        onClick={full}
        disabled={loading}
        className="rounded border px-4 py-2 disabled:opacity-50"
      >
        Full Checkout
      </button>
    </div>
  );
}

