// src/app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - PetConnect',
  description: 'Learn more about PetConnect and our mission',
};

export default function AboutPage() {
  return (
    <section className="prose max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">About us</h1>
      <p className="text-lg text-neutral-700 mb-4">
        We build simple, well‑designed products for everyday life.
      </p>
      <p className="text-neutral-600">
        At PetConnect, we believe in quality, simplicity, and great customer service. 
        Our carefully curated selection of products reflects our commitment to bringing 
        you the best in design and functionality.
      </p>
    </section>
  );
}

