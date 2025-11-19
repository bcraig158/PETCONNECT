// src/app/builder/socials/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const platforms = ['facebook', 'linkedin', 'instagram', 'youtube', 'twitter', 'whatsapp', 'tiktok'];

export default function SocialsPage() {
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    try {
      const res = await fetch('/api/page');
      if (res.ok) {
        const data = await res.json();
        const pageSocials = data.page.socialsJson || {};
        setSocials(typeof pageSocials === 'object' ? pageSocials : {});
      }
    } catch (error) {
      console.error('Failed to fetch socials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/page/socials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socials),
      });

      if (res.ok) {
        alert('Social links saved!');
      } else {
        alert('Failed to save social links');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Social Links</h1>
        <Link href="/builder" className="rounded border px-4 py-2 hover:bg-neutral-50">
          Back to Builder
        </Link>
      </div>

      <div className="max-w-2xl">
        <div className="border rounded-lg p-6 space-y-4">
          {platforms.map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {platform}
              </label>
              <input
                type="url"
                value={socials[platform] || ''}
                onChange={(e) =>
                  setSocials({ ...socials, [platform]: e.target.value })
                }
                placeholder={`https://${platform}.com/your-profile`}
                className="w-full rounded border p-2"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50 mt-4"
          >
            {saving ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      </div>
    </section>
  );
}

