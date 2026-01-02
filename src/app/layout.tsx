// src/app/layout.tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PetConnect',
    template: '%s | PetConnect',
  },
  description: 'PetConnect - E-commerce and customizable profile pages for pet owners',
  keywords: ['pet', 'profile', 'shop', 'ecommerce', 'products', 'online store'],
};

// Font preloading for better performance
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: Readonly<React.ReactNode>;
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <ErrorBoundary>
          <Providers>
            <Header />
            <main className="flex-1 mx-auto max-w-6xl p-4 w-full">{children}</main>
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
