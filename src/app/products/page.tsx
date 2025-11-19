// src/app/products/page.tsx
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Products - PetConnect',
  description: 'Browse our curated selection of products',
};

// Force dynamic rendering (database queries)
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>
      {products.length === 0 ? (
        <p className="text-neutral-600">No products available at the moment.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </section>
  );
}

