import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { productId, email, name } = await req.json();

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required for checkout' }, { status: 400 });
    }

    // Lookup product to fetch price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        business: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Generate random payment references mimicking Paystack standard
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const reference = `BF-${randomHex}`;

    console.log(`[Checkout API] Mock transaction processed for ${email} buying product "${product.title}" ($${product.price})`);

    // Return checkout success object
    return NextResponse.json({
      success: true,
      status: 'success',
      reference,
      amount: product.price,
      currency: 'USD',
      gateway: 'Paystack (Simulated)',
      message: 'Payment completed successfully. Thank you for your order!',
      orderDetails: {
        productTitle: product.title,
        businessName: product.business.name,
        customerEmail: email,
        customerName: name || 'Guest User',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Checkout API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout transaction', details: message },
      { status: 500 }
    );
  }
}
