// src/app/api/checkout/embedded/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CustomProvider } from "@/lib/payments/custom";

export async function POST(req: NextRequest) {
  try {
    const { orderId, token } = await req.json();

    if (!orderId || !token) {
      return NextResponse.json(
        { error: "Missing orderId or token" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order is not in pending status" },
        { status: 400 }
      );
    }

    if (!CustomProvider.chargeWithToken) {
      return NextResponse.json(
        { error: "Token charging not supported" },
        { status: 501 }
      );
    }

    const res = await CustomProvider.chargeWithToken({
      orderId,
      token,
      amountCents: order.totalCents,
      currency: order.currency,
    });

    if (res.status === "PAID") {
      await db.order.update({
        where: { id: orderId },
        data: { status: "PAID", providerRef: res.providerRef },
      });
    } else if (res.status === "PENDING") {
      await db.order.update({
        where: { id: orderId },
        data: { providerRef: res.providerRef },
      });
    }

    return NextResponse.json({ status: res.status });
  } catch (error) {
    console.error("Embedded confirm error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

