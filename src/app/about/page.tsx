import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - PetConnect',
  description: 'Learn about PetConnect — our mission to help pet owners showcase their beloved companions',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About PetConnect</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          We&apos;re building the easiest way for pet owners to create beautiful profile pages
          for their furry, feathered, and scaly companions.
        </p>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            Every pet has a unique personality and story worth sharing. PetConnect gives pet owners the
            tools to create a dedicated space for their companions — a single link that houses everything
            from social profiles and photos to vet records and favorite products.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Whether you&apos;re a dog parent sharing training videos, a cat owner posting daily
            adventures, or a reptile enthusiast connecting with a community, PetConnect is your pet&apos;s
            home on the internet.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
          <div className="space-y-4">
            {[
              { icon: <Heart className="text-rose-500" size={22} />, text: 'Built by pet lovers, for pet lovers' },
              { icon: <Users className="text-blue-500" size={22} />, text: 'Growing community of pet owners' },
              { icon: <Shield className="text-emerald-500" size={22} />, text: 'Your data is secure and private' },
              { icon: <Sparkles className="text-amber-500" size={22} />, text: 'Always improving with new features' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
                <span className="font-medium text-neutral-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">What We Offer</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Profile Pages',
              description:
                'A customizable page for your pet with bio, links, social connections, embeds, and file sharing. Choose themes, colors, and layouts.',
            },
            {
              title: 'Page Builder',
              description:
                'An intuitive visual editor with live preview, drag-and-drop reordering, auto-save, and theme presets to make building effortless.',
            },
            {
              title: 'Pet Shop',
              description:
                'A curated selection of quality pet products, with secure checkout and order management built right into the platform.',
            },
          ].map((item) => (
            <div key={item.title} className="border rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10 bg-neutral-50 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Join PetConnect</h2>
        <p className="text-neutral-600 mb-6">Create your pet&apos;s profile page today — it&apos;s free.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-black px-6 py-2.5 text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border px-6 py-2.5 font-medium hover:bg-neutral-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
