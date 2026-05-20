import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Cross-version compatibility for Next.js 14 and 15 (params may be a Promise or standard object)
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        products: true,
        marketingAssets: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GET Business API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve business information', details: message },
      { status: 500 }
    );
  }
}
