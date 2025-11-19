// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl p-4 text-sm text-neutral-500">
        © {new Date().getFullYear()} Acme. All rights reserved.
      </div>
    </footer>
  );
}

