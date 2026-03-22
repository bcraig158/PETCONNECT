'use client';
import Image from 'next/image';
import { formatUSD } from '@/lib/currency';
import CheckoutButtons from './CheckoutButtons';
import { useState } from 'react';
import { Package } from 'lucide-react';

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
    <div className="group rounded-xl border border-neutral-200 bg-white flex flex-col overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {!imageError && product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50">
            <Package className="text-neutral-300 mb-1" size={36} />
            <span className="text-neutral-400 text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-neutral-600 mt-1 flex-grow line-clamp-2">{product.description}</p>
        <div className="mt-3 text-lg font-bold text-neutral-900">{formatUSD(product.unitAmount)}</div>
        <CheckoutButtons slug={product.slug} />
      </div>
    </div>
  );
}
