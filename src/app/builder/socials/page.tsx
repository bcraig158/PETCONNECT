'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { toast } from 'sonner';

const platforms = ['facebook', 'linkedin', 'instagram', 'youtube', 'twitter', 'whatsapp', 'tiktok'];

const socialsSchema = z.record(z.string().url('Please enter a valid URL').or(z.string().length(0)));

export default function SocialsPage() {
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    } catch {
      toast.error('Failed to load social links');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setFieldErrors({});

    const parsed = socialsSchema.safeParse(socials);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key) errors[String(key)] = issue.message;
      }
      setFieldErrors(errors);
      toast.error('Please fix the invalid URLs before saving');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/page/socials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socials),
      });

      if (res.ok) {
        toast.success('Social links saved!');
      } else {
        toast.error('Failed to save social links');
      }
    } catch {
      toast.error('An error occurred');
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
        <Link href="/builder" className="rounded border px-4 py-2 hover:bg-neutral-50 transition-colors">
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
                onChange={(e) => {
                  setSocials({ ...socials, [platform]: e.target.value });
                  if (fieldErrors[platform]) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next[platform];
                      return next;
                    });
                  }
                }}
                placeholder={`https://${platform}.com/your-profile`}
                className={`w-full rounded border p-2 ${fieldErrors[platform] ? 'border-red-500' : ''}`}
              />
              {fieldErrors[platform] && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors[platform]}</p>
              )}
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

