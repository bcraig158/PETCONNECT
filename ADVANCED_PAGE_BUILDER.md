# Advanced Page Builder - Sprouter-Style Profile Generator

## 🎯 Overview

Your page builder is now a **Sprouter-style Smart Profile Page Generator** with advanced capabilities for creating customizable, scalable profile pages. This document outlines all features, architecture, and extensibility options.

---

## ✨ Core Features

### 1. **Modular Component Architecture**

All page elements are built as reusable, composable components:

- **`AvatarCard`** - Profile header with avatar, name, title, and bio
- **`SocialBar`** - Social media links with icon mapping
- **`ButtonGroup`** - Custom action buttons/links with click tracking
- **`ContactForm`** - Optional contact form with validation
- **`EmbedWidget`** - Safe HTML/iframe embeds (YouTube, Calendly, etc.)

### 2. **Drag-and-Drop Link Management**

- Full dnd-kit integration for reordering links
- Visual drag handles with grip icons
- Optimistic UI updates
- Position persistence in database

### 3. **Social Media Integration**

- Support for 7 platforms: Facebook, LinkedIn, Instagram, YouTube, Twitter, WhatsApp, TikTok
- Icon-based navigation
- Auto-validation of URLs
- Flexible JSON storage for future platforms

### 4. **Theme Customization**

- JSON-based theme storage (`themeJson`)
- Support for:
  - Primary color
  - Background color
  - Text color
- Dynamic CSS variable injection (ready for expansion)
- Per-page customization

### 5. **Click Tracking & Analytics**

- Link click tracking via `/api/links/[id]/click`
- Click counter in database (`clicks` field)
- Redirects to actual URLs after tracking
- Ready for analytics dashboard expansion

### 6. **Contact Form Integration**

- Optional contact form component
- Email delivery via Resend
- Form validation with Zod
- Captcha-ready structure
- Sends to page owner's email

### 7. **Embed Support**

- Safe HTML sanitization with DOMPurify
- Support for iframes (YouTube, Vimeo, etc.)
- Provider-based categorization
- Position-based ordering

### 8. **File Management**

- Vercel Blob integration ready
- File metadata tracking
- Download tracking capability
- Size display

---

## 📐 Architecture

### Component Structure

```
src/components/
├── public/              # Public-facing components
│   ├── AvatarCard.tsx
│   ├── SocialBar.tsx
│   ├── ButtonGroup.tsx
│   ├── ContactForm.tsx
│   └── EmbedWidget.tsx
└── builder/             # Builder/admin components
    ├── SortableList.tsx
    └── SortableItem.tsx
```

### Data Flow

1. **User creates/edits page** → `/builder`
2. **Data stored in DB** → Prisma models (Page, Link, Embed, etc.)
3. **Public page renders** → `/[username]` fetches and displays
4. **Components compose** → Modular components render sections
5. **Clicks tracked** → Analytics endpoints record interactions

---

## 🗄️ Database Schema

### Page Model
```typescript
{
  id: string
  userId: string
  slug: string                    // URL path
  displayName: string             // Pet name / page title
  bioHtml: string?                // Rich text bio
  profileUrl: string?              // Avatar URL
  themeJson: Json?                 // Theme colors/config
  socialsJson: Json?               // Social links map
}
```

### Link Model
```typescript
{
  id: string
  pageId: string
  title: string
  url: string
  position: number                 // For ordering
  clicks: number                   // Analytics
}
```

---

## 🔌 API Endpoints

### Page Management
- `GET /api/page` - Get user's page data
- `PUT /api/page` - Update page info
- `PATCH /api/page/socials` - Update social links
- `POST /api/page/contact` - Submit contact form

### Links
- `GET /api/page/links` - Get all links
- `POST /api/page/links` - Create link
- `DELETE /api/page/links/[id]` - Delete link
- `PATCH /api/page/links/reorder` - Reorder links
- `GET /api/links/[id]/click` - Track click & redirect

### Account
- `PATCH /api/account/profile` - Update profile
- `POST /api/checkout/hosted` - Create checkout for reorder

---

## 🎨 Customization Options

### Theme System

```json
{
  "primary": "#00C57A",
  "bg": "#FFFFFF",
  "text": "#000000"
}
```

**How to use:**
1. Store in `page.themeJson`
2. Apply via inline styles or CSS variables
3. Components read theme and apply colors

### Social Links Structure

```json
{
  "facebook": "https://facebook.com/user",
  "linkedin": "https://linkedin.com/in/user",
  "instagram": "https://instagram.com/user",
  "youtube": "https://youtube.com/@user",
  "twitter": "https://twitter.com/user",
  "whatsapp": "https://api.whatsapp.com/send?phone=1234567890",
  "tiktok": "https://tiktok.com/@user"
}
```

### Link Configuration

Each link supports:
- Title (display text)
- URL (destination)
- Position (sort order)
- Click tracking (automatic)

---

## 🚀 Scaling Capabilities

### 1. **Multi-Tenant Ready**
- User-based page isolation
- Per-user customization
- Independent analytics

### 2. **Component Expansion**
- Easy to add new components
- Modular architecture
- Reusable patterns

### 3. **Analytics Dashboard** (Future)
- Click tracking already in place
- Easy to add views, engagement metrics
- Export capabilities ready

### 4. **Custom Domains** (Future)
- Slug-based routing ready
- DNS mapping straightforward
- SSL via hosting provider

### 5. **QR Code Generation** (Ready to add)
- URL structure in place
- Can add `qrcode` library
- Generate on demand or cache

### 6. **Advanced Embeds**
- Already supports HTML/iframe
- Can add provider-specific components
- Embed validation/auto-detection

---

## 📦 Additional Features Ready to Implement

### 1. **File Upload UI**
- Vercel Blob integration ready
- Upload component structure exists
- FileAsset model in database

### 2. **Embed Management UI**
- Similar to links management
- Provider selection dropdown
- URL validation

### 3. **Theme Builder**
- Color picker components
- Font selection
- Background patterns/images

### 4. **Analytics Dashboard**
- Click charts
- Top links
- Traffic sources
- Time-series data

### 5. **QR Code Generator**
```typescript
// Example implementation
import QRCode from 'qrcode';

const qrDataUrl = await QRCode.toDataURL(`https://yourdomain.com/${username}`);
```

### 6. **Public/Private Toggle**
- Add `public` boolean to Page model
- Middleware check for private pages
- Password protection option

---

## 🔧 Technical Stack

### Frontend
- **Next.js 15** - App Router, SSR, Static Generation
- **React** - Component library
- **Tailwind CSS** - Styling
- **dnd-kit** - Drag and drop
- **React Hook Form + Zod** - Forms & validation
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **NextAuth v5** - Authentication
- **Resend** - Email delivery

### Security
- **DOMPurify** - XSS protection
- **Zod** - Input validation
- **Argon2** - Password hashing
- **Rate limiting** - Upstash Redis

---

## 📋 Builder UI Pages

### Main Builder (`/builder`)
- Edit profile info
- Preview live changes
- Quick links to sub-pages

### Links Management (`/builder/links`)
- Add/remove links
- Drag to reorder
- Edit link details

### Social Links (`/builder/socials`)
- Manage all social platforms
- URL validation
- One-click save

### Files (Future - `/builder/files`)
- Upload files
- Manage file list
- Set file order

### Embeds (Future - `/builder/embeds`)
- Add embed code
- Provider selection
- Preview embeds

---

## 🎯 Usage Examples

### Creating a Profile Page

1. User registers → Page auto-created with slug = username
2. User edits profile → `/builder`
3. Adds links → `/builder/links`
4. Adds socials → `/builder/socials`
5. Shares URL → `yoursite.com/username`

### Customizing Theme

```typescript
// In builder UI, save to page.themeJson
const theme = {
  primary: '#00C57A',
  bg: '#F5F5F5',
  text: '#000000'
};

// Apply in public page
<div style={{ background: theme.bg, color: theme.text }}>
  {/* Content */}
</div>
```

### Adding Analytics

```typescript
// Click tracking already works
// Add view tracking:
await db.pageAnalytics.create({
  data: {
    pageId: page.id,
    event: 'view',
    timestamp: new Date(),
  }
});
```

---

## 📈 Performance Optimizations

1. **Static Generation** - Public pages can be statically generated
2. **Image Optimization** - Next.js Image component
3. **Database Indexing** - Position fields indexed for sorting
4. **Lazy Loading** - Components load on demand
5. **Caching** - API responses can be cached

---

## 🔐 Security Features

1. **XSS Protection** - DOMPurify for all HTML
2. **CSRF Protection** - NextAuth sessions
3. **Input Validation** - Zod schemas everywhere
4. **SQL Injection** - Prisma parameterized queries
5. **Rate Limiting** - Upstash Redis

---

## 🎨 Design Principles

1. **Minimal & Clean** - Card-based UI
2. **Mobile-First** - Responsive by default
3. **Accessible** - Semantic HTML, ARIA labels
4. **Fast** - Optimized rendering
5. **Customizable** - Theme system, flexible layout

---

## 🚀 Next Steps for Enhancement

### Immediate (Easy)
- [ ] File upload UI component
- [ ] Embed management UI
- [ ] Theme color picker
- [ ] QR code generation

### Short Term
- [ ] Analytics dashboard
- [ ] Advanced embed providers
- [ ] Custom button styles
- [ ] Background image support

### Long Term
- [ ] Custom domain mapping
- [ ] Multiple page templates
- [ ] A/B testing for layouts
- [ ] White-label options

---

## 📚 Component API Reference

### AvatarCard
```typescript
<AvatarCard
  avatar={string | null}
  name={string}
  title={string | null}
  bio={string | null}
/>
```

### SocialBar
```typescript
<SocialBar
  socials={Record<string, string> | null}
/>
```

### ButtonGroup
```typescript
<ButtonGroup
  buttons={Array<{id, title, url, clicks}>}
  theme={{ primary?, bg?, text? }}
/>
```

### ContactForm
```typescript
<ContactForm
  pageId={string}
  pageSlug={string}
/>
```

### EmbedWidget
```typescript
<EmbedWidget
  embed={{ id, provider, srcUrl, htmlSafe }}
/>
```

---

## ✅ Current Status

**Implemented:**
- ✅ Modular component architecture
- ✅ Drag-and-drop link reordering
- ✅ Social media integration
- ✅ Theme system (basic)
- ✅ Click tracking
- ✅ Contact form
- ✅ Embed support
- ✅ File structure ready

**Ready for Enhancement:**
- ⚠️ File upload UI (models ready)
- ⚠️ Embed management UI (structure ready)
- ⚠️ Advanced theme customization
- ⚠️ Analytics dashboard
- ⚠️ QR code generation

**Future:**
- 🔮 Custom domains
- 🔮 Multiple templates
- 🔮 Advanced analytics
- 🔮 White-label features

---

Your page builder is now a **production-ready, scalable profile page generator** with room for extensive customization and growth! 🎉

