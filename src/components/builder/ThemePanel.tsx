// src/components/builder/ThemePanel.tsx
'use client';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';
import { motion } from 'framer-motion';

const fontOptions = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
];

const presetThemes = [
  {
    name: 'Ocean',
    theme: {
      brandColor: '#00AEEF',
      textColor: '#FFFFFF',
      backgroundColor: '#001122',
      font: 'Poppins',
    },
  },
  {
    name: 'Forest',
    theme: {
      brandColor: '#00C57A',
      textColor: '#FFFFFF',
      backgroundColor: '#0A1F0A',
      font: 'Inter',
    },
  },
  {
    name: 'Sunset',
    theme: {
      brandColor: '#FF6B6B',
      textColor: '#FFFFFF',
      backgroundColor: '#1A0000',
      font: 'Roboto',
    },
  },
  {
    name: 'Minimal',
    theme: {
      brandColor: '#000000',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
      font: 'Open Sans',
    },
  },
];

export default function ThemePanel() {
  const { schema, updateTheme } = usePageBuilderStore();
  const theme = schema?.theme || {};

  const handleThemeUpdate = (updates: Partial<typeof theme>) => {
    updateTheme(updates);
  };

  const applyPreset = (preset: typeof presetThemes[0]) => {
    updateTheme(preset.theme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Brand & Theme</h2>
        <p className="text-gray-600">Customize colors, fonts, and layout</p>
      </div>

      {/* Preset Themes */}
      <div>
        <label className="block text-sm font-medium mb-3">Preset Themes</label>
        <div className="grid grid-cols-2 gap-3">
          {presetThemes.map((preset) => (
            <motion.button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 border-2 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div
                className="w-full h-12 rounded mb-2"
                style={{
                  background: `linear-gradient(135deg, ${preset.theme.brandColor} 0%, ${preset.theme.backgroundColor} 100%)`,
                }}
              />
              <p className="text-sm font-medium">{preset.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Brand Color */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Brand Color
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.brandColor || '#00AEEF'}
            onChange={(e) => handleThemeUpdate({ brandColor: e.target.value })}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
          />
          <input
            type="text"
            value={theme.brandColor || '#00AEEF'}
            onChange={(e) => handleThemeUpdate({ brandColor: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
            placeholder="#00AEEF"
          />
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Background Color
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.backgroundColor || '#000000'}
            onChange={(e) => handleThemeUpdate({ backgroundColor: e.target.value })}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
          />
          <input
            type="text"
            value={theme.backgroundColor || '#000000'}
            onChange={(e) => handleThemeUpdate({ backgroundColor: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Text Color
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.textColor || '#FFFFFF'}
            onChange={(e) => handleThemeUpdate({ textColor: e.target.value })}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
          />
          <input
            type="text"
            value={theme.textColor || '#FFFFFF'}
            onChange={(e) => handleThemeUpdate({ textColor: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <label htmlFor="font-select" className="block text-sm font-medium mb-2">
          Font Family
        </label>
        <select
          id="font-select"
          value={theme.font || 'Poppins'}
          onChange={(e) => handleThemeUpdate({ font: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Border Radius */}
      <div>
        <label htmlFor="border-radius" className="block text-sm font-medium mb-2">
          Border Radius: {theme.borderRadius || '12px'}
        </label>
        <input
          id="border-radius"
          type="range"
          min="0"
          max="24"
          value={parseInt(theme.borderRadius || '12')}
          onChange={(e) => handleThemeUpdate({ borderRadius: `${e.target.value}px` })}
          className="w-full"
        />
      </div>

      {/* Layout Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Layout</label>
        <div className="flex gap-3">
          <button
            onClick={() => handleThemeUpdate({ layout: 'stack' })}
            className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium ${
              theme.layout === 'stack'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Stack
          </button>
          <button
            onClick={() => handleThemeUpdate({ layout: 'grid' })}
            className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium ${
              theme.layout === 'grid'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Grid
          </button>
        </div>
      </div>
    </div>
  );
}

