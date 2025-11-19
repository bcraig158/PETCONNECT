// src/components/builder/EditorPanel.tsx
'use client';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Files, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import BasicInfoPanel from './BasicInfoPanel';
import PreviewFrame from './PreviewFrame';
import ThemePanel from './ThemePanel';

export default function EditorPanel() {
  const { currentSection } = usePageBuilderStore();

  const renderSection = () => {
    switch (currentSection) {
      case 'brand':
        return <ThemePanel />;
      case 'basic':
        return <BasicInfoPanel />;
      case 'links':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Social & Links</h2>
              <p className="text-gray-600">Manage your links and social connections</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/builder/links"
                className="p-6 border-2 rounded-lg hover:border-blue-500 transition-colors group"
              >
                <LinkIcon className="w-8 h-8 mb-3 text-blue-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Manage Links</h3>
                <p className="text-sm text-gray-600">Add, edit, and reorder your links</p>
              </Link>
              <Link
                href="/builder/socials"
                className="p-6 border-2 rounded-lg hover:border-blue-500 transition-colors group"
              >
                <LinkIcon className="w-8 h-8 mb-3 text-green-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Social Links</h3>
                <p className="text-sm text-gray-600">Connect your social media accounts</p>
              </Link>
            </div>
          </div>
        );
      case 'files':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Files & Embeds</h2>
              <p className="text-gray-600">Upload files and embed content</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/builder/files"
                className="p-6 border-2 rounded-lg hover:border-blue-500 transition-colors group"
              >
                <Files className="w-8 h-8 mb-3 text-purple-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Manage Files</h3>
                <p className="text-sm text-gray-600">Upload and organize files</p>
              </Link>
              <Link
                href="/builder/embeds"
                className="p-6 border-2 rounded-lg hover:border-blue-500 transition-colors group"
              >
                <FileText className="w-8 h-8 mb-3 text-orange-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Manage Embeds</h3>
                <p className="text-sm text-gray-600">Add YouTube, Vimeo, and more</p>
              </Link>
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className="h-full">
            <PreviewFrame />
          </div>
        );
      case 'settings':
        const schema = usePageBuilderStore.getState().schema;
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Advanced Settings</h2>
              <p className="text-gray-600">Additional configuration options</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Page Slug</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Your page URL: /{schema?.slug || 'username'}
                </p>
                <p className="text-xs text-gray-500">This cannot be changed after creation</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Export Data</h3>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Download JSON
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <ThemePanel />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
