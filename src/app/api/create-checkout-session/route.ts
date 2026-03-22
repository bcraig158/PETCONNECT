import { NextResponse } from 'next/server';
import { productSelectionSchema } from '@/lib/validators';
import { findProduct } from '@/lib/products';
import { createPaymentSession } from '@/lib/payment';
import { env } from '@/lib/env';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = productSelectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { slug, quantity } = parsed.data;
    const product = await findProduct(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const amount = product.unitAmount * quantity;
    const baseUrl = env.siteUrl;

    const session = await createPaymentSession({
      slug,
      quantity,
      amount,
      currency: product.currency,
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/cancel`,
      metadata: {
        slug,
        quantity: String(quantity),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}

