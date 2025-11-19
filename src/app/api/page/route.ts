// src/app/api/page/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;

    const page = await db.page.findUnique({
      where: { userId },
      include: {
        links: { orderBy: { position: 'asc' } },
        embeds: { orderBy: { position: 'asc' } },
        files: { orderBy: { position: 'asc' } },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Page fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const { displayName, bioHtml, profileUrl, themeJson } = body;

    const page = await db.page.update({
      where: { userId },
      data: {
        displayName: displayName || undefined,
        bioHtml: bioHtml || null,
        profileUrl: profileUrl || null,
        themeJson: themeJson || undefined,
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

