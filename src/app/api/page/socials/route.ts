// src/app/api/page/socials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const socialsSchema = z.record(z.string().url().or(z.string().length(0)));

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const parsed = socialsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Filter out empty strings
    const socials = Object.fromEntries(
      Object.entries(parsed.data).filter(([_, url]) => url && url.length > 0)
    );

    const page = await db.page.update({
      where: { userId },
      data: { socialsJson: socials },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Socials update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
