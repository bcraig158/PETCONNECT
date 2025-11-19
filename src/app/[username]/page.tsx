// src/app/[username]/page.tsx
import AvatarCard from '@/components/public/AvatarCard';
import ButtonGroup from '@/components/public/ButtonGroup';
import EmbedWidget from '@/components/public/EmbedWidget';
import SocialBar from '@/components/public/SocialBar';
import { db } from '@/lib/db';
import DOMPurify from 'isomorphic-dompurify';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const page = await db.page.findUnique({
    where: { slug: params.username },
    include: { user: true },
  });

  if (!page) {
    return { title: 'Page Not Found' };
  }

  const bioText = page.bioHtml ? DOMPurify.sanitize(page.bioHtml, { ALLOWED_TAGS: [] }) : undefined;

  return {
    title: `${page.displayName} - ${page.user.ownerName}`,
    description: bioText,
    openGraph: {
      title: page.displayName,
      description: bioText,
      images: page.profileUrl ? [page.profileUrl] : [],
    },
  };
}

export default async function PublicPagePage({ params }: { params: { username: string } }) {
  const page = await db.page.findUnique({
    where: { slug: params.username },
    include: {
      user: true,
      links: { orderBy: { position: 'asc' } },
      embeds: { orderBy: { position: 'asc' } },
      files: { orderBy: { position: 'asc' } },
    },
  });

  if (!page) {
    notFound();
  }

  const bioHtml = page.bioHtml ? DOMPurify.sanitize(page.bioHtml) : null;
  const socials =
    page.socialsJson && typeof page.socialsJson === 'object'
      ? (page.socialsJson as Record<string, string>)
      : null;
  const themeRaw =
    page.themeJson && typeof page.themeJson === 'object'
      ? (page.themeJson as {
          brandColor?: string;
          primary?: string;
          backgroundColor?: string;
          bg?: string;
          textColor?: string;
          text?: string;
          font?: string;
          borderRadius?: string;
          layout?: string;
        })
      : undefined;

  // Convert theme format for components
  const buttonTheme = themeRaw
    ? {
        primary: themeRaw.primary || themeRaw.brandColor,
        bg: themeRaw.bg || themeRaw.backgroundColor,
        text: themeRaw.text || themeRaw.textColor,
      }
    : undefined;

  const bgColor = themeRaw?.backgroundColor || themeRaw?.bg || '#ffffff';
  const textColor = themeRaw?.textColor || themeRaw?.text || '#000000';
  const fontFamily = themeRaw?.font || 'Poppins';
  const borderRadius = themeRaw?.borderRadius || '12px';

  return (
    <div
      className="min-h-screen"
      style={
        {
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: fontFamily,
          '--brand-color': themeRaw?.brandColor || themeRaw?.primary || '#00AEEF',
          '--border-radius': borderRadius,
        } as React.CSSProperties
      }
    >
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <AvatarCard
          avatar={page.profileUrl}
          name={page.displayName}
          title={`by ${page.user.ownerName}`}
          bio={bioHtml}
        />

        {/* Social Icons */}
        <SocialBar socials={socials} />

        {/* Action Buttons / Links */}
        <ButtonGroup buttons={page.links} theme={buttonTheme} />

        {/* Contact Form - can be enabled in page settings */}
        {/* <ContactForm pageId={page.id} pageSlug={page.slug} /> */}

        {/* Embeds */}
        {page.embeds.length > 0 && (
          <div className="space-y-4 mb-8">
            {page.embeds.map((embed) => (
              <EmbedWidget key={embed.id} embed={embed} />
            ))}
          </div>
        )}

        {/* Files */}
        {page.files.length > 0 && (
          <div className="space-y-3 mb-8">
            <h2 className="text-xl font-semibold mb-3 text-center">Files</h2>
            {page.files.map((file) => (
              <a
                key={file.id}
                href={file.blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border px-6 py-4 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-neutral-500">
                    {(file.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
