// src/app/api/links/[id]/click/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const link = await db.link.findUnique({
      where: { id: params.id },
      select: { url: true },
    });

    if (!link) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Increment click counter (fire and forget)
    db.link.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    }).catch(console.error);

    // Redirect to actual URL
    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error('Link click error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
