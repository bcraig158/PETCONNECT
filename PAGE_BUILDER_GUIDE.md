# Page Builder Implementation Guide

## ✅ What's Been Implemented

A complete, modern page builder system with:

### 1. **Three-Panel Layout**
- **Sidebar** (left): Navigation between sections
- **Editor Panel** (center): Content editing interface
- **Live Preview** (right): Real-time preview of your page

### 2. **Core Features**
- ✅ Brand & Theme customization (colors, fonts, layout)
- ✅ Basic Info editor (name, bio, profile photo)
- ✅ Social & Links management (with quick navigation)
- ✅ Files & Embeds management
- ✅ Live Preview with iframe rendering
- ✅ Auto-save with debouncing (saves after 1.5s of inactivity)
- ✅ Preset theme templates (Ocean, Forest, Sunset, Minimal)

### 3. **Dependencies Installed**
- `framer-motion` - Smooth animations
- `use-debounce` - Auto-save debouncing
- `@dnd-kit/*` - Drag and drop (already installed)
- `lucide-react` - Icons (already installed)
- `zustand` - State management (already installed)

## 📁 File Structure

```
src/
├── components/builder/
│   ├── Sidebar.tsx          # Left navigation panel
│   ├── EditorPanel.tsx      # Main editor content
│   ├── ThemePanel.tsx       # Brand & theme customization
│   ├── BasicInfoPanel.tsx   # Profile info editor
│   ├── PreviewFrame.tsx     # Live preview iframe
│   └── AutoSave.tsx         # Auto-save indicator
├── lib/store/
│   └── pageBuilder.ts       # Zustand state store
└── app/builder/
    └── page.tsx             # Main builder page layout
```

## 🎨 Theme System

The theme system uses CSS variables that update dynamically:

```typescript
{
  brandColor: "#00AEEF",
  textColor: "#FFFFFF",
  backgroundColor: "#000000",
  font: "Poppins",
  borderRadius: "12px",
  layout: "stack" | "grid"
}
```

Themes are stored in `page.themeJson` and applied to the public page.

## 🚀 Usage

1. **Navigate to `/builder`** - The new page builder loads automatically
2. **Select a section** from the sidebar (Brand & Theme, Basic Info, etc.)
3. **Edit content** - Changes save automatically after 1.5 seconds
4. **View preview** - Click "Live Preview" or see it in the right panel
5. **Apply presets** - Use theme presets for quick styling

## 🔄 Data Flow

1. User loads `/builder`
   → Fetches page data from `/api/page`
   → Populates Zustand store

2. User edits content
   → Updates Zustand store immediately
   → Debounced autosave (1.5s delay)
   → PATCH to `/api/page` with updates

3. Preview updates
   → iframe reloads with current page URL
   → Theme styles applied dynamically

## 🎯 Next Steps (Optional Enhancements)

### Short Term
- [ ] Add undo/redo functionality
- [ ] Batch styling for links
- [ ] Quick add modal for links/files
- [ ] OAuth integrations for social accounts

### Medium Term
- [ ] Scheduling for links/content
- [ ] QR code generation
- [ ] Analytics dashboard
- [ ] Custom domains

### Advanced
- [ ] Component marketplace
- [ ] A/B testing for themes
- [ ] Team collaboration
- [ ] Export/import pages

## 🐛 Known Issues / Improvements Needed

1. **Preview iframe** - Currently reloads on every change. Could use postMessage for smoother updates.
2. **Font loading** - Theme fonts need to be loaded via Google Fonts or font files.
3. **Mobile responsive** - Preview panel hides on mobile; could be improved.
4. **Error handling** - Could add better error states and retry logic.

## 💡 Tips for Development

- **State Management**: All page state is in `usePageBuilderStore` - modify schema directly
- **Auto-save**: Uses `use-debounce` to prevent too many API calls
- **Animations**: Framer Motion for section transitions
- **Theme**: CSS variables update instantly without page reload

## 📝 API Endpoints Used

- `GET /api/page` - Fetch page data
- `PUT /api/page` - Update page (includes themeJson)
- `POST /api/upload` - Upload files/images
- `GET /api/page/links` - Fetch links
- `GET /api/page/files` - Fetch files
- `GET /api/page/embeds` - Fetch embeds

## ✨ Styling Notes

The builder uses:
- **Tailwind CSS** for utility classes
- **CSS Variables** for dynamic theming
- **Framer Motion** for animations
- **Lucide React** for icons

Color scheme:
- Sidebar: Dark blue-gray (`#1f2a38`)
- Editor: White background
- Preview: Light gray background

---

**Built with Next.js 15, TypeScript, Tailwind CSS, and Zustand**

