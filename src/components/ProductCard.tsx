// src/components/ProductCard.tsx
'use client';
import Image from 'next/image';
import { formatUSD } from '@/lib/currency';
import CheckoutButtons from './CheckoutButtons';
import { useState } from 'react';

type Props = {
  product: {
    slug: string;
    name: string;
    description: string;
    image: string;
    unitAmount: number;
  };
};

export default function ProductCard({ product }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-lg border p-4 flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative aspect-square w-full overflow-hidden rounded bg-neutral-100">
        {!imageError ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200">
            <span className="text-neutral-400 text-sm">No image</span>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-lg font-medium">{product.name}</h3>
      <p className="text-sm text-neutral-600 flex-grow">{product.description}</p>
      <div className="mt-2 font-semibold">{formatUSD(product.unitAmount)}</div>
      <CheckoutButtons slug={product.slug} />
    </div>
  );
}

