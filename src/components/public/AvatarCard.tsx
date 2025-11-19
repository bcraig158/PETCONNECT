// src/components/public/AvatarCard.tsx
import Image from 'next/image';

type Props = {
  avatar?: string | null;
  name: string;
  title?: string | null;
  bio?: string | null;
};

export default function AvatarCard({ avatar, name, title, bio }: Props) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      {avatar && (
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={avatar}
            alt={name}
            fill
            className="rounded-full object-cover border-4 border-white shadow-lg"
            sizes="128px"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      {title && <h2 className="text-xl text-neutral-600 mb-4">{title}</h2>}
      {bio && (
        <div
          className="max-w-2xl text-neutral-700 prose prose-sm prose-neutral"
          dangerouslySetInnerHTML={{ __html: bio }}
        />
      )}
    </div>
  );
}

