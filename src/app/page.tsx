// src/app/page.tsx (Home)
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'PetConnect - Welcome',
  description: 'Explore our curated selection of products and create your pet\'s profile page',
};

// Force dynamic rendering (database queries)
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  
  return (
    <section className="grid gap-8">
      <div className="grid gap-4">
        <h1 className="text-4xl font-bold">Welcome to PetConnect</h1>
        <p className="text-lg text-neutral-700 max-w-2xl">
          Create beautiful profile pages for your pets and explore our curated selection of quality products. 
          Secure payments and fast shipping to bring you the best experience.
        </p>
        <Link 
          href="/products" 
          className="w-fit rounded bg-black px-6 py-3 text-white hover:bg-neutral-800 transition-colors"
        >
          Browse Products
        </Link>
      </div>
      
      {products.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <Link
                key={product.slug}
                href="/products"
                className="rounded-lg border p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-neutral-600 mt-1">{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

