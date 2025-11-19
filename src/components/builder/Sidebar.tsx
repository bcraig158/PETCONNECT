// src/components/builder/Sidebar.tsx
'use client';
import { Palette, Link2, FileText, Settings, Eye } from 'lucide-react';
import { usePageBuilderStore } from '@/lib/store/pageBuilder';

const sections = [
  { id: 'brand', name: 'Brand & Theme', icon: Palette },
  { id: 'basic', name: 'Basic Info', icon: FileText },
  { id: 'links', name: 'Social & Links', icon: Link2 },
  { id: 'files', name: 'Files & Embeds', icon: FileText },
  { id: 'preview', name: 'Live Preview', icon: Eye },
  { id: 'settings', name: 'Advanced', icon: Settings },
];

export default function Sidebar() {
  const { currentSection, setCurrentSection } = usePageBuilderStore();

  return (
    <aside className="w-64 bg-[#1f2a38] text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-[#273443]">
        <h1 className="text-xl font-bold">Page Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Customize your profile</p>
      </div>
      
      <nav className="flex-1 p-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = currentSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-left
                transition-colors
                ${
                  isActive
                    ? 'bg-[#0d1620] text-white shadow-lg'
                    : 'hover:bg-[#273443] text-gray-300'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{section.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#273443]">
        <div className="text-xs text-gray-400">
          <p>PetConnect Builder</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

