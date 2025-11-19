// src/app/builder/page.tsx - New Page Builder with Sidebar + Editor + Preview
'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/builder/Sidebar';
import EditorPanel from '@/components/builder/EditorPanel';
import PreviewFrame from '@/components/builder/PreviewFrame';
import AutoSave from '@/components/builder/AutoSave';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';
import { motion } from 'framer-motion';

export default function BuilderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setSchema, currentSection } = usePageBuilderStore();

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // Fetch page data and populate store
    const fetchPage = async () => {
      try {
        const res = await fetch('/api/page');
        if (res.ok) {
          const data = await res.json();
          const page = data.page;
          
          // Transform database schema to page builder schema
          const pageSchema = {
            id: page.id,
            slug: page.slug,
            displayName: page.displayName || '',
            bioHtml: page.bioHtml || '',
            profileUrl: page.profileUrl || '',
            theme: (page.themeJson && typeof page.themeJson === 'object'
              ? page.themeJson
              : {}) as any,
            links: page.links || [],
            embeds: page.embeds || [],
            files: page.files || [],
            socials: (page.socialsJson && typeof page.socialsJson === 'object'
              ? page.socialsJson
              : {}) as Record<string, string>,
          };
          
          setSchema(pageSchema);
        }
      } catch (error) {
        console.error('Failed to fetch page:', error);
      }
    };

    fetchPage();
  }, [session, router, setSchema]);

  if (!session) {
    return null;
  }

  const showPreview = currentSection === 'preview';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex ml-64">
        {/* Editor Panel */}
        {!showPreview && (
          <div className="flex-1 overflow-y-auto">
            <EditorPanel />
          </div>
        )}

        {/* Preview Panel (shown only when preview is selected OR always on large screens) */}
        {showPreview ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-6 bg-gray-100"
          >
            <PreviewFrame />
          </motion.div>
        ) : (
          <div className="hidden lg:block w-96 p-6 bg-gray-100 border-l">
            <div className="sticky top-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Live Preview</h3>
              </div>
              <div className="h-[calc(100vh-8rem)]">
                <PreviewFrame />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto-save indicator */}
      <AutoSave />
    </div>
  );
}
