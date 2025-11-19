// src/components/Header.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact us' },
];

export default function Header() {
  const path = usePathname();
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">PetConnect</Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6">
            {NAV.map(i => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className={path === i.href ? 'font-medium underline' : 'hover:underline'}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/account" className="hover:underline">
                Account
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded border px-3 py-1 text-sm hover:bg-neutral-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/register" className="rounded bg-black px-3 py-1 text-white text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

