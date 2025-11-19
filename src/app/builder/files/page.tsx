// src/app/builder/files/page.tsx
'use client';
import SortableItem from '@/components/builder/SortableItem';
import SortableList from '@/components/builder/SortableList';
import { handleApiError, handleAsyncError } from '@/lib/errorHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const fileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  blobUrl: z.string().url('Invalid URL'),
});

type FileForm = z.infer<typeof fileSchema>;

type FileAsset = {
  id: string;
  name: string;
  blobUrl: string;
  sizeBytes: number;
  contentType: string;
  position: number;
};

export default function FilesPage() {
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [_error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/page');
      if (res.ok) {
        const data = await res.json();
        setFiles(
          (data.page?.files || []).sort((a: FileAsset, b: FileAsset) => a.position - b.position)
        );
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorMessage = await handleApiError(uploadRes);
        alert(errorMessage);
        return;
      }

      const uploadData = await uploadRes.json();

      const res = await fetch('/api/page/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          blobUrl: uploadData.url,
          sizeBytes: uploadData.size,
          contentType: uploadData.contentType,
        }),
      });

      if (res.ok) {
        reset();
        fetchFiles();
      } else {
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      handleAsyncError(err, 'Failed to upload file', message);
      setError(message);
      return;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FileForm) => {
    try {
      const res = await fetch('/api/page/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sizeBytes: 0,
          contentType: 'application/octet-stream',
        }),
      });

      if (res.ok) {
        reset();
        fetchFiles();
      } else {
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add file. Please try again.';
      handleAsyncError(err, 'Failed to add file', message);
      setError(message);
      return;
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    setDeleting(fileId);
    try {
      const res = await fetch(`/api/page/files?id=${fileId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchFiles();
      } else {
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete file. Please try again.';
      handleAsyncError(err, 'Failed to delete file', message);
      setError(message);
      return;
    } finally {
      setDeleting(null);
    }
  };

  const handleReorder = async (newOrder: FileAsset[]) => {
    const fileIds = newOrder.map((file) => file.id);
    setFiles(newOrder); // Optimistic update

    try {
      const res = await fetch('/api/page/files/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds }),
      });

      if (!res.ok) {
        // Revert on error
        fetchFiles();
        const errorMessage = await handleApiError(res);
        alert(errorMessage);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to save new order. Please try again.';
      fetchFiles(); // Revert optimistic update
      handleAsyncError(err, 'Failed to reorder files', message);
      setError(message);
      return;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <h1 className="text-3xl font-bold">Manage Files</h1>
        <Link href="/builder" className="rounded border px-4 py-2 hover:bg-neutral-50">
          Back to Builder
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New File</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full rounded border p-2 disabled:opacity-50"
                aria-label="Upload a file to add to your page"
              />
              {uploading && <p className="text-sm text-neutral-600 mt-1">Uploading...</p>}
            </div>
            <div className="text-sm text-neutral-600">OR</div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="file-name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  {...register('name', { required: true })}
                  id="file-name"
                  className="w-full rounded border p-2"
                  placeholder="File name"
                  aria-required="true"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="file-url" className="block text-sm font-medium mb-1">
                  File URL
                </label>
                <input
                  {...register('blobUrl', { required: true })}
                  id="file-url"
                  type="url"
                  className="w-full rounded border p-2"
                  placeholder="https://..."
                  aria-required="true"
                />
                {errors.blobUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.blobUrl.message}</p>
                )}
              </div>
              <button type="submit" className="w-full rounded bg-black px-4 py-2 text-white">
                Add File by URL
              </button>
            </form>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Files ({files.length})</h2>
          {files.length === 0 ? (
            <p className="text-neutral-600">No files yet. Upload your first file!</p>
          ) : (
            <SortableList items={files} onReorder={handleReorder} getId={(file) => file.id}>
              {(file) => (
                <SortableItem id={file.id}>
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-neutral-600">
                        {formatFileSize(file.sizeBytes)} • {file.contentType}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(file.id)}
                      disabled={deleting === file.id}
                      className="ml-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deleting === file.id ? 'Deleting...' : 'Delete'}
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
