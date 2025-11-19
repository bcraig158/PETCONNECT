// src/app/p/[slug]/page.tsx
// Alternative route for /p/[slug] - redirects to [username] route
import { redirect } from 'next/navigation';

export default async function PublicPageSlug({ params }: { params: { slug: string } }) {
  // Redirect to the main username route
  redirect(`/${params.slug}`);
}

