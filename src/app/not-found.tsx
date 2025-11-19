// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link 
          href="/"
          className="rounded bg-black px-4 py-2 text-white inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

