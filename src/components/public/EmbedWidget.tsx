// src/components/public/EmbedWidget.tsx
import DOMPurify from 'isomorphic-dompurify';

type Embed = {
  id: string;
  provider: string;
  srcUrl: string;
  htmlSafe: string;
};

export default function EmbedWidget({ embed }: { embed: Embed }) {
  // Sanitize HTML for safety
  const sanitized = DOMPurify.sanitize(embed.htmlSafe, {
    ALLOWED_TAGS: ['iframe', 'div', 'script'],
    ALLOWED_ATTR: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class', 'id'],
  });

  return (
    <div className="mb-8 rounded-lg overflow-hidden">
      <div dangerouslySetInnerHTML={{ __html: sanitized }} />
    </div>
  );
}

