// src/app/api/page/bio/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const { bioHtml } = body;

    const sanitized = bioHtml ? sanitizeHtml(bioHtml) : null;

    const page = await db.page.update({
      where: { userId },
      data: {
        bioHtml: sanitized,
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Bio update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

