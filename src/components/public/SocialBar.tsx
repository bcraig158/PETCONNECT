// src/components/public/SocialBar.tsx
import { Facebook, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from 'lucide-react';

type SocialPlatform = 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'twitter' | 'whatsapp';

const icons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
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
    <div className="flex justify-center gap-4 mb-8">
      {Object.entries(socials).map(([platform, url]) => {
        const Icon = icons[platform as SocialPlatform];
        if (!Icon || !url) return null;

        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            aria-label={platform}
          >
            <Icon className="w-5 h-5 text-neutral-700" />
          </a>
        );
      })}
    </div>
  );
}

