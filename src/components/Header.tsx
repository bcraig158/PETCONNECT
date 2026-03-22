'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const path = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          PetConnect
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6">
            {NAV.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className={`text-sm transition-colors ${
                    path === i.href
                      ? 'font-semibold text-black'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="text-sm font-medium text-neutral-600 hover:text-black transition-colors"
              >
                Account
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                aria-label="Sign out"
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-600 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-black px-4 py-1.5 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-1">
            {NAV.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  path === i.href
                    ? 'font-semibold bg-neutral-50 text-black'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                {i.label}
              </Link>
            ))}
            <div className="border-t mt-3 pt-3 space-y-1">
              {session ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg bg-black px-3 py-2.5 text-sm text-white text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
