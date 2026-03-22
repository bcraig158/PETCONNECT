'use client';

const GOOGLE_FONTS = ['Poppins', 'Inter', 'Roboto', 'Open Sans', 'Montserrat'];

export default function FontLoader({ font }: { font: string }) {
  if (!font || !GOOGLE_FONTS.includes(font)) return null;

  const familyParam = font.replace(/\s/g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@300;400;500;600;700&display=swap`;

  return (
    // eslint-disable-next-line @next/next/no-page-custom-font
    <link rel="stylesheet" href={href} />
  );
}
