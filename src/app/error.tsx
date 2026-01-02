'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-neutral-600 mb-6">An error occurred. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="rounded bg-black px-4 py-2 text-white">
            Try again
          </button>
          <Link href="/" className="rounded bg-neutral-200 px-4 py-2 text-black">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
