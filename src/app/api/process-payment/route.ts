// src/app/api/process-payment/route.ts
import { NextResponse } from 'next/server';
import { fullCheckoutSchema } from '@/lib/validators';
import { findProduct } from '@/lib/products';
import { createPaymentIntent } from '@/lib/payment';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = fullCheckoutSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { slug, quantity, customer } = parsed.data;
    const product = await findProduct(slug);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const amount = product.unitAmount * quantity;

    // Create payment intent using your payment processor
    const paymentIntent = await createPaymentIntent({
      slug,
      quantity,
      amount,
      currency: product.currency,
      metadata: {
        slug,
        quantity: String(quantity),
        customerName: customer.name,
        customerEmail: customer.email,
      },
    });

    // TODO: Process the payment with customer data
    // This is where you would integrate with your payment processor
    // to actually charge the customer based on the payment method provided

    // For now, returning success - you'll need to implement actual payment processing
    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.clientSecret,
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  }
}

