// src/lib/store/pageBuilder.ts
// Zustand store for page builder state management
import { create } from 'zustand';

export type ThemeConfig = {
  brandColor?: string;
  textColor?: string;
  backgroundColor?: string;
  font?: string;
  borderRadius?: string;
  layout?: 'stack' | 'grid';
};

export type PageSchema = {
  id: string;
  slug: string;
  displayName: string;
  bioHtml: string | null;
  profileUrl: string | null;
  theme: ThemeConfig;
  links: Array<{ id: string; title: string; url: string; position: number }>;
  embeds: Array<{ id: string; provider: string; srcUrl: string; htmlSafe: string; position: number }>;
  files: Array<{ id: string; name: string; blobUrl: string; position: number }>;
  socials: Record<string, string>;
};

interface PageBuilderStore {
  schema: PageSchema | null;
  currentSection: string;
  isSaving: boolean;
  lastSaved: Date | null;
  setSchema: (schema: PageSchema) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateBasicInfo: (updates: Partial<Pick<PageSchema, 'displayName' | 'bioHtml' | 'profileUrl'>>) => void;
  setCurrentSection: (section: string) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  reset: () => void;
}

export const usePageBuilderStore = create<PageBuilderStore>((set) => ({
  schema: null,
  currentSection: 'brand',
  isSaving: false,
  lastSaved: null,
  
  setSchema: (schema) => set({ schema }),
  
  updateTheme: (themeUpdates) =>
    set((state) => ({
      schema: state.schema
        ? {
            ...state.schema,
            theme: { ...state.schema.theme, ...themeUpdates },
          }
        : null,
    })),
  
  updateBasicInfo: (updates) =>
    set((state) => ({
      schema: state.schema
        ? {
            ...state.schema,
            ...updates,
          }
        : null,
    })),
  
  setCurrentSection: (section) => set({ currentSection: section }),
  
  setSaving: (saving) => set({ isSaving: saving }),
  
  setLastSaved: (date) => set({ lastSaved: date }),
  
  reset: () =>
    set({
      schema: null,
      currentSection: 'brand',
      isSaving: false,
      lastSaved: null,
    }),
}));

