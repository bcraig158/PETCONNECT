// src/app/api/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const reorderSchema = z.object({
  orderId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { orderId } = parsed.data;

    // Find the original order
    const originalOrder = await db.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true } } },
    });

    if (!originalOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create new order with same items
    const totalCents = originalOrder.items.reduce(
      (sum, item) => sum + item.unitCents * item.quantity,
      0
    );

    const newOrder = await db.order.create({
      data: {
        userId,
        status: 'PENDING',
        currency: originalOrder.currency,
        totalCents,
        provider: 'custom',
        items: {
          create: originalOrder.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCents: item.unitCents,
            nameSnap: item.nameSnap,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ orderId: newOrder.id });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

