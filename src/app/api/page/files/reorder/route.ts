// src/app/api/page/files/reorder/route.ts
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
    const { fileIds } = body; // Array of file IDs in new order

    if (!Array.isArray(fileIds)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const page = await db.page.findUnique({
      where: { userId },
      include: { files: true },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const updates = fileIds.map((fileId, index) =>
      db.fileAsset.update({
        where: { id: fileId, pageId: page.id },
        data: { position: index },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("File reorder error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

