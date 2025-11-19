// src/app/api/page/embeds/reorder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const { embedIds } = body; // Array of embed IDs in new order

    if (!Array.isArray(embedIds)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const page = await db.page.findUnique({
      where: { userId },
      include: { embeds: true },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const updates = embedIds.map((embedId, index) =>
      db.embed.update({
        where: { id: embedId, pageId: page.id },
        data: { position: index },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Embed reorder error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

