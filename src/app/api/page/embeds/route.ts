// src/app/api/page/embeds/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sanitizeEmbedHtml } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const { provider, srcUrl, htmlSafe } = body;

    if (!provider || !srcUrl) {
      return NextResponse.json(
        { error: "Missing provider or srcUrl" },
        { status: 400 }
      );
    }

    const page = await db.page.findUnique({ where: { userId } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Get current max position
    const maxPosition = await db.embed.aggregate({
      where: { pageId: page.id },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    // Sanitize HTML if provided
    const sanitizedHtml = htmlSafe ? sanitizeEmbedHtml(htmlSafe) : null;

    const embed = await db.embed.create({
      data: {
        pageId: page.id,
        provider,
        srcUrl,
        htmlSafe: sanitizedHtml || "",
        position,
      },
    });

    return NextResponse.json({ embed });
  } catch (error) {
    console.error("Embed create error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const page = await db.page.findUnique({
      where: { userId },
      include: { embeds: { orderBy: { position: 'asc' } } },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ embeds: page.embeds });
  } catch (error) {
    console.error("Embeds fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const embedId = searchParams.get('id');

    if (!embedId) {
      return NextResponse.json({ error: 'Embed ID required' }, { status: 400 });
    }

    const userId = (session as any).userId;
    const page = await db.page.findUnique({ where: { userId } });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    await db.embed.delete({
      where: { id: embedId, pageId: page.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Embed delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

