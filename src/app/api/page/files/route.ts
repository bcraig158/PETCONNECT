// src/app/api/page/files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const { name, blobUrl, sizeBytes, contentType } = body;

    if (!name || !blobUrl) {
      return NextResponse.json(
        { error: "Missing name or blobUrl" },
        { status: 400 }
      );
    }

    const page = await db.page.findUnique({ where: { userId } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const maxPosition = await db.fileAsset.aggregate({
      where: { pageId: page.id },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    const file = await db.fileAsset.create({
      data: {
        pageId: page.id,
        name,
        blobUrl,
        sizeBytes: sizeBytes || 0,
        contentType: contentType || "application/octet-stream",
        position,
      },
    });

    return NextResponse.json({ file });
  } catch (error) {
    console.error("File create error:", error);
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
      include: { files: { orderBy: { position: 'asc' } } },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ files: page.files });
  } catch (error) {
    console.error("Files fetch error:", error);
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
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    const userId = (session as any).userId;
    const page = await db.page.findUnique({ where: { userId } });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    await db.fileAsset.delete({
      where: { id: fileId, pageId: page.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("File delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

