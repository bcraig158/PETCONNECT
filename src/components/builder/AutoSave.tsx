// src/components/builder/AutoSave.tsx
'use client';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';
import { Check, Loader2 } from 'lucide-react';

export default function AutoSave() {
  const { schema, isSaving, lastSaved, setSaving, setLastSaved } = usePageBuilderStore();
  const [debouncedSchema] = useDebounce(schema, 1500);

  useEffect(() => {
    if (!debouncedSchema) return;

    const saveSchema = async () => {
      setSaving(true);
      
      try {
        // Save theme
        if (debouncedSchema.theme) {
          await fetch('/api/page', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              displayName: debouncedSchema.displayName,
              bioHtml: debouncedSchema.bioHtml,
              profileUrl: debouncedSchema.profileUrl,
              themeJson: debouncedSchema.theme,
            }),
          });
        }

        // Save basic info
        await fetch('/api/page', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: debouncedSchema.displayName,
            bioHtml: debouncedSchema.bioHtml,
            profileUrl: debouncedSchema.profileUrl,
            themeJson: debouncedSchema.theme,
          }),
        });

        setLastSaved(new Date());
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        setSaving(false);
      }
    };

    saveSchema();
  }, [debouncedSchema, setSaving, setLastSaved]);

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-50">
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        </>
      ) : null}
    </div>
  );
}

