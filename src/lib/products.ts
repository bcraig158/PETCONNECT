// src/lib/products.ts
// Products are now stored in the database
// This file provides helper functions to access products from the database
import { db } from './db';

export type Product = {
  slug: string;
  name: string;
  description: string;
  image: string;
  currency: string;
  unitAmount: number; // in cents
};

/**
 * Get all active products from the database
 */
export async function getProducts(): Promise<Product[]> {
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'asc' },
  });

  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    image: p.imageUrl,
    currency: p.currency,
    unitAmount: p.unitAmount,
  }));
}

/**
 * Find a product by slug from the database
 */
export async function findProduct(slug: string): Promise<Product | null> {
  const product = await db.product.findUnique({
    where: { slug, active: true },
  });

  if (!product) return null;

  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    currency: product.currency,
    unitAmount: product.unitAmount,
  };
}

/**
 * Legacy static products array - deprecated, use getProducts() instead
 * @deprecated Use getProducts() to fetch from database
 */
export const PRODUCTS: Product[] = [];

