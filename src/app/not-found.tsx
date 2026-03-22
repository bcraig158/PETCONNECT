import Link from 'next/link';
import { Search, Home, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="text-neutral-400" size={28} />
        </div>
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-3">Page not found</h2>
        <p className="text-neutral-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            <ShoppingBag size={16} />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
