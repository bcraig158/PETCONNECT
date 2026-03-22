import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Heart, Share2, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PetConnect - Beautiful Profile Pages for Your Pets',
  description:
    'Create stunning profile pages for your pets, share them with the world, and shop quality pet products.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-8 pb-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              Now in beta
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
              Your pet deserves
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                their own page
              </span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-lg leading-relaxed">
              Build a beautiful profile page for your pet — share their story, photos, links, and
              more. Plus, discover curated products they&apos;ll love.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-neutral-800 transition-colors"
              >
                Create Your Pet&apos;s Page
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 px-6 py-3 font-medium hover:border-neutral-300 transition-colors"
              >
                <ShoppingBag size={18} />
                Browse Products
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-80">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-3xl -rotate-3" />
              <div className="relative bg-white rounded-3xl shadow-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-2xl">
                    🐕
                  </div>
                  <div>
                    <p className="font-bold text-lg">Buddy</p>
                    <p className="text-sm text-neutral-500">Golden Retriever</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Loves fetch, belly rubs, and long walks in the park. Living my best life! 🎾
                </p>
                <div className="space-y-2">
                  {['Instagram', 'TikTok', 'YouTube'].map((name) => (
                    <div
                      key={name}
                      className="w-full rounded-lg bg-neutral-50 px-4 py-2.5 text-sm font-medium text-center"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">How it works</h2>
          <p className="text-neutral-600 mt-2">Get your pet online in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              icon: <Heart className="text-rose-500" size={28} />,
              title: 'Create an account',
              description:
                'Sign up for free and tell us about your pet. Pick a unique username that becomes your pet\'s URL.',
            },
            {
              step: '02',
              icon: <Share2 className="text-blue-500" size={28} />,
              title: 'Build their page',
              description:
                'Use our visual page builder to add photos, bio, social links, files, embeds, and choose a theme.',
            },
            {
              step: '03',
              icon: <ShoppingBag className="text-emerald-500" size={28} />,
              title: 'Share & shop',
              description:
                'Share your pet\'s page with the world. Browse our curated shop for quality products.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl border border-neutral-100 bg-white hover:shadow-lg transition-shadow group"
            >
              <span className="absolute top-4 right-4 text-4xl font-bold text-neutral-100 group-hover:text-neutral-200 transition-colors">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="rounded-3xl bg-neutral-50 -mx-4 px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900">Everything your pet needs</h2>
          <p className="text-neutral-600 mt-2">Packed with features to showcase your furry friend</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Custom Themes', desc: 'Colors, fonts, and layouts that match your pet\'s personality' },
            { title: 'Social Links', desc: 'Connect all your pet\'s social media profiles in one place' },
            { title: 'File Sharing', desc: 'Upload vet records, photos, and documents to share' },
            { title: 'Embeds', desc: 'Embed YouTube videos, TikToks, and more right on the page' },
            { title: 'Click Tracking', desc: 'See which links get the most attention from visitors' },
            { title: 'Contact Form', desc: 'Let visitors reach out directly through your pet\'s page' },
            { title: 'Drag & Drop', desc: 'Reorder links, files, and embeds with simple drag and drop' },
            { title: 'Live Preview', desc: 'See changes in real-time as you build in the page editor' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-neutral-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Shop for your pet</h2>
              <p className="text-neutral-600 mt-1">Quality products your pet will love</p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors hidden sm:block"
            >
              View all products &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors"
            >
              View all products &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="text-center py-12 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 -mx-4 px-8">
        <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">
          Create a free account and build your pet&apos;s profile page in minutes.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
