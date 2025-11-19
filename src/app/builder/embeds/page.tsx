// src/app/builder/embeds/page.tsx
'use client';
import SortableItem from '@/components/builder/SortableItem';
import SortableList from '@/components/builder/SortableList';
import { handleApiError, handleAsyncError } from '@/lib/errorHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const embedSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  srcUrl: z.string().url('Invalid URL'),
  htmlSafe: z.string().optional(),
});

type EmbedForm = z.infer<typeof embedSchema>;

type Embed = {
  id: string;
  provider: string;
  srcUrl: string;
  htmlSafe: string;
  position: number;
};

export default function EmbedsPage() {
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [_error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmbedForm>({
    resolver: zodResolver(embedSchema),
  });

  useEffect(() => {
    fetchEmbeds();
  }, []);

  const fetchEmbeds = async () => {
    try {
      const res = await fetch('/api/page');
      if (res.ok) {
        const data = await res.json();
        setEmbeds((data.page?.embeds || []).sort((a: Embed, b: Embed) => a.position - b.position));
      }
    } catch (error) {
      console.error('Failed to fetch embeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EmbedForm) => {
    try {
      const res = await fetch('/api/page/embeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        fetchEmbeds();
      } else {
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add embed. Please try again.';
      handleAsyncError(err, 'Failed to add embed', message);
      setError(message);
      return;
    }
  };

  const handleDelete = async (embedId: string) => {
    if (!confirm('Are you sure you want to delete this embed?')) return;

    setDeleting(embedId);
    try {
      const res = await fetch(`/api/page/embeds?id=${embedId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchEmbeds();
      } else {
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete embed. Please try again.';
      handleAsyncError(err, 'Failed to delete embed', message);
      setError(message);
      return;
    } finally {
      setDeleting(null);
    }
  };

  const handleReorder = async (newOrder: Embed[]) => {
    const embedIds = newOrder.map((embed) => embed.id);
    setEmbeds(newOrder); // Optimistic update

    try {
      const res = await fetch('/api/page/embeds/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedIds }),
      });

      if (!res.ok) {
        // Revert on error
        fetchEmbeds();
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to save new order. Please try again.';
      fetchEmbeds(); // Revert optimistic update
      handleAsyncError(err, 'Failed to reorder embeds', message);
      setError(message);
      return;
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
        <h1 className="text-3xl font-bold">Manage Embeds</h1>
        <Link href="/builder" className="rounded border px-4 py-2 hover:bg-neutral-50">
          Back to Builder
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Embed</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="embed-provider" className="block text-sm font-medium mb-1">
                Provider
              </label>
              <select
                {...register('provider', { required: true })}
                id="embed-provider"
                className="w-full rounded border p-2"
                aria-required="true"
              >
                <option value="">Select provider</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="twitter">Twitter/X</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="custom">Custom</option>
              </select>
              {errors.provider && (
                <p className="text-red-500 text-sm mt-1">{errors.provider.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="embed-url" className="block text-sm font-medium mb-1">
                Source URL
              </label>
              <input
                {...register('srcUrl', { required: true })}
                id="embed-url"
                type="url"
                className="w-full rounded border p-2"
                placeholder="https://..."
                aria-required="true"
              />
              {errors.srcUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.srcUrl.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="embed-html" className="block text-sm font-medium mb-1">
                HTML (Optional)
              </label>
              <textarea
                {...register('htmlSafe')}
                id="embed-html"
                className="w-full rounded border p-2"
                rows={4}
                placeholder="Paste embed HTML code here..."
                aria-label="Optional HTML embed code"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Optional: Paste embed HTML code. Will be sanitized for security.
              </p>
            </div>
            <button type="submit" className="w-full rounded bg-black px-4 py-2 text-white">
              Add Embed
            </button>
          </form>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Embeds ({embeds.length})</h2>
          {embeds.length === 0 ? (
            <p className="text-neutral-600">No embeds yet. Add your first embed!</p>
          ) : (
            <SortableList items={embeds} onReorder={handleReorder} getId={(embed) => embed.id}>
              {(embed) => (
                <SortableItem id={embed.id}>
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium capitalize">{embed.provider}</p>
                      <p className="text-sm text-neutral-600 truncate">{embed.srcUrl}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(embed.id)}
                      disabled={deleting === embed.id}
                      className="ml-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deleting === embed.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </SortableItem>
              )}
            </SortableList>
          )}
        </div>
      </div>
    </section>
  );
}
