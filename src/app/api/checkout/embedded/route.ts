import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order.id,
      amountCents: order.totalCents,
      currency: order.currency,
      status: order.status,
      items: order.items.map((item) => ({
        name: item.nameSnap,
        quantity: item.quantity,
        unitCents: item.unitCents,
      })),
    });
  } catch (error) {
    console.error("Embedded checkout GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productSlug, quantity = 1 } = await req.json();

    const product = await db.product.findUnique({ where: { slug: productSlug } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const session = await auth();
    const userId = (session as any)?.userId || "anonymous";

    const order = await db.order.create({
      data: {
        userId,
        status: "PENDING",
        currency: product.currency,
        totalCents: product.unitAmount * quantity,
        provider: "custom",
        items: {
          create: [
            {
              productId: product.id,
              quantity,
              unitCents: product.unitAmount,
              nameSnap: product.name,
            },
          ],
        },
      },
      select: { id: true, totalCents: true, currency: true },
    });

    // Return pricing so client can render provider hosted fields & tokenize
    return NextResponse.json({
      orderId: order.id,
      amountCents: order.totalCents,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Embedded checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

