// src/app/api/page/links/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const page = await db.page.findUnique({ where: { userId } });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    await db.link.delete({
      where: { id: params.id, pageId: page.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Link delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
