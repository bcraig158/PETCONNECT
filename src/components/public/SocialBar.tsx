import { Facebook, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from 'lucide-react';

type SocialPlatform = 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'twitter' | 'whatsapp' | 'tiktok';

const platformLabels: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'Twitter / X',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  whatsapp: MessageCircle,
};

export default function SocialBar({ socials }: { socials: Record<string, string> | null }) {
  if (!socials || Object.keys(socials).length === 0) return null;

  return (
    <nav className="flex justify-center gap-4 mb-8" aria-label="Social media links">
      {Object.entries(socials).map(([platform, url]) => {
        const Icon = icons[platform];
        if (!url) return null;

        const label = platformLabels[platform as SocialPlatform] || platform;

        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400"
            aria-label={`Visit on ${label}`}
          >
            {Icon ? (
              <Icon className="w-5 h-5 text-neutral-700" aria-hidden />
            ) : (
              <span className="text-xs font-medium text-neutral-700">{platform.slice(0, 2).toUpperCase()}</span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
