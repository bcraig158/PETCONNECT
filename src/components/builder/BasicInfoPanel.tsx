// src/components/builder/BasicInfoPanel.tsx
'use client';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';
import { useRef } from 'react';

export default function BasicInfoPanel() {
  const { schema, updateBasicInfo } = usePageBuilderStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateBasicInfo({ profileUrl: data.url });
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Upload error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-gray-600">Set your profile name, bio, and avatar</p>
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="display-name" className="block text-sm font-medium mb-2">
          Display Name (Pet Name)
        </label>
        <input
          id="display-name"
          type="text"
          value={schema?.displayName || ''}
          onChange={(e) => updateBasicInfo({ displayName: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your pet's name"
        />
      </div>

      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-medium mb-2">Profile Photo</label>
        <div className="flex items-center gap-4">
          {schema?.profileUrl && (
            <img
              src={schema.profileUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          )}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Upload Photo
            </button>
            <p className="text-xs text-gray-500 mt-1">Or enter URL below</p>
          </div>
        </div>
        <input
          type="url"
          value={schema?.profileUrl || ''}
          onChange={(e) => updateBasicInfo({ profileUrl: e.target.value })}
          className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          value={schema?.bioHtml || ''}
          onChange={(e) => updateBasicInfo({ bioHtml: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell visitors about your pet..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {schema?.bioHtml?.length || 0} characters
        </p>
      </div>
    </div>
  );
}

