// src/app/layout.tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'PetConnect',
    template: '%s | PetConnect',
  },
  description: 'PetConnect - Create beautiful profile pages for your pets and shop curated products',
  keywords: ['pet', 'profile', 'shop', 'ecommerce', 'products', 'pet profile', 'pet page builder'],
};

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
    <html lang="en" className={inter.className}>
      <body className="antialiased min-h-screen flex flex-col">
        <ErrorBoundary>
          <Providers>
            <Header />
            <main className="flex-1 mx-auto max-w-6xl p-4 w-full">{children}</main>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
