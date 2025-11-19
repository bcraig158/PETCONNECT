// src/app/api/page/links/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const reorderSchema = z.object({
  linkIds: z.array(z.string()),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const page = await db.page.findUnique({
      where: { userId },
      include: { links: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Verify all linkIds belong to this page
    const pageLinkIds = new Set(page.links.map((l) => l.id));
    const validIds = parsed.data.linkIds.filter((id) => pageLinkIds.has(id));

    if (validIds.length !== parsed.data.linkIds.length) {
      return NextResponse.json({ error: 'Invalid link IDs' }, { status: 400 });
    }

    // Update positions
    await Promise.all(
      parsed.data.linkIds.map((linkId, index) =>
        db.link.update({
          where: { id: linkId },
          data: { position: index },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
