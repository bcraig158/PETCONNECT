// src/app/api/webhooks/payment/route.ts
// DEPRECATED: This endpoint is kept for backward compatibility
// Use /api/webhooks/payments instead which has full implementation
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs"; // ensure Node runtime for raw body

function verifySignature(raw: string, sig: string): boolean {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    console.error("PAYMENT_WEBHOOK_SECRET not configured");
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(raw).digest("hex");
  
  // Use constant-time comparison to prevent timing attacks
  if (digest.length !== sig.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
}

export async function POST(req: NextRequest) {
  try {
    // Support both header formats for compatibility
    const sig = req.headers.get("x-signature") || req.headers.get("x-payment-signature") || "";
    const raw = await req.text();

    if (!verifySignature(raw, sig)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(raw);

    // Handle different event types
    if (event.type === "payment.succeeded") {
      const { orderId, providerRef } = event.data;

      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "PAID", providerRef: providerRef || event.data.id },
        });
      }
    } else if (event.type === "payment.failed" || event.type === "payment.canceled") {
      const { orderId } = event.data;
      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "CANCELED" },
        });
      }
    } else if (event.type === "payment.refunded") {
      const { orderId } = event.data;
      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "REFUNDED" },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 400 }
    );
  }
}

