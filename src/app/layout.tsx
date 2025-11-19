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

interface RootLayoutProps {
  readonly children: Readonly<React.ReactNode>;
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Roboto:wght@400;500&family=Open+Sans:wght@400;600&family=Montserrat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
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
