// src/app/api/page/links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const linkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const parsed = linkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const page = await db.page.findUnique({ where: { userId } });
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get current max position
    const maxPosition = await db.link.aggregate({
      where: { pageId: page.id },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    const link = await db.link.create({
      data: {
        pageId: page.id,
        ...parsed.data,
        position,
      },
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Link create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const page = await db.page.findUnique({
      where: { userId },
      include: { links: { orderBy: { position: 'asc' } } },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ links: page.links });
  } catch (error) {
    console.error('Links fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
    }

    const userId = (session as any).userId;
    const page = await db.page.findUnique({ where: { userId } });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    await db.link.delete({
      where: { id: linkId, pageId: page.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Link delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

