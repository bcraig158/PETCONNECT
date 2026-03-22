import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-neutral-500">
        <span>&copy; {new Date().getFullYear()} PetConnect. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-neutral-900 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

