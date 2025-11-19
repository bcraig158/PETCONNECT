// src/components/builder/PreviewFrame.tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';
import { useSession } from 'next-auth/react';

export default function PreviewFrame() {
  const { schema } = usePageBuilderStore();
  const { data: session } = useSession();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const username = (session?.user as any)?.username;

  useEffect(() => {
    if (!schema || !username) return;

    // Update iframe preview with current schema
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Update preview URL or send message to iframe
    iframe.src = `/${username}?preview=true&t=${Date.now()}`;
  }, [schema, username]);

  if (!username) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-gray-500">Preview unavailable</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
      <div className="bg-white px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <p className="text-xs text-gray-500">Live Preview</p>
        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          Open in new tab →
        </a>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 bg-white"
        title="Page Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}

