// src/app/api/page/profile/route.ts
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
    const { avatar, displayName } = body;

    const page = await db.page.update({
      where: { userId },
      data: {
        displayName: displayName || undefined,
        profileUrl: avatar || null,
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

