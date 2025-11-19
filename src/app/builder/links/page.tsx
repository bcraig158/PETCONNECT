// src/app/builder/links/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import SortableList from '@/components/builder/SortableList';
import SortableItem from '@/components/builder/SortableItem';

const linkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL'),
});

type LinkForm = z.infer<typeof linkSchema>;

type Link = {
  id: string;
  title: string;
  url: string;
  position: number;
};

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LinkForm>({
    resolver: zodResolver(linkSchema),
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/page/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LinkForm) => {
    try {
      const res = await fetch('/api/page/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          position: links.length,
        }),
      });

      if (res.ok) {
        reset();
        fetchLinks();
      } else {
        alert('Failed to add link');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setDeleting(linkId);
    try {
      const res = await fetch(`/api/page/links/${linkId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchLinks();
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeleting(null);
    }
  };

  const handleReorder = async (newOrder: Link[]) => {
    const linkIds = newOrder.map((link) => link.id);
    setLinks(newOrder); // Optimistic update

    try {
      const res = await fetch('/api/page/links/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds }),
      });

      if (!res.ok) {
        // Revert on error
        fetchLinks();
        alert('Failed to save new order');
      }
    } catch (error) {
      fetchLinks();
      alert('An error occurred while reordering');
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
        <h1 className="text-3xl font-bold">Manage Links</h1>
        <Link href="/builder" className="rounded border px-4 py-2 hover:bg-neutral-50">
          Back to Builder
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Link</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                {...register('title')}
                className="w-full rounded border p-2"
                placeholder="Link title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                {...register('url')}
                type="url"
                className="w-full rounded border p-2"
                placeholder="https://..."
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded bg-black px-4 py-2 text-white"
            >
              Add Link
            </button>
          </form>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Links ({links.length})</h2>
          {links.length === 0 ? (
            <p className="text-neutral-600">No links yet. Add your first link!</p>
          ) : (
            <SortableList
              items={links}
              onReorder={handleReorder}
              getId={(link) => link.id}
            >
              {(link) => (
                <SortableItem id={link.id}>
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-neutral-600 truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(link.id)}
                      disabled={deleting === link.id}
                      className="ml-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deleting === link.id ? 'Deleting...' : 'Delete'}
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

