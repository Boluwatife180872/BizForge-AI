import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import routerInstance from '@/lib/ai/router';
import { BusinessSchema, ProductsSchema, LandingPageSchema, MarketingSchema } from '@/lib/ai/types';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A valid business idea prompt is required' }, { status: 400 });
    }

    console.log(`[Generate API] Processing prompt: "${prompt}"`);

    const businessData = await routerInstance.generateContent(
      'business',
      prompt,
      BusinessSchema
    );
    console.log(`[Generate API] Business generated: ${businessData.name}`);

    const productsData = await routerInstance.generateContent(
      'products',
      `Generate products for the business named "${businessData.name}", which is in the "${businessData.niche}" niche. Tagline: "${businessData.tagline}". Value proposition: "${businessData.valueProp}".`,
      ProductsSchema
    );
    console.log(`[Generate API] Products catalog generated: ${productsData.products.length} items`);

    const landingPageData = await routerInstance.generateContent(
      'landing_page',
      `Generate landing page layout sections for "${businessData.name}" (${businessData.niche} niche). Tagline: "${businessData.tagline}". Value prop: "${businessData.valueProp}".`,
      LandingPageSchema
    );
    console.log(`[Generate API] Landing page configuration generated`);

    const marketingData = await routerInstance.generateContent(
      'marketing',
      `Generate marketing assets copy for "${businessData.name}" (${businessData.niche} niche). Tagline: "${businessData.tagline}". Value prop: "${businessData.valueProp}".`,
      MarketingSchema
    );
    console.log(`[Generate API] Marketing assets generated: ${marketingData.assets.length} copy drafts`);

    const createdBusiness = await prisma.business.create({
      data: {
        userId: session.user.id,
        name: businessData.name,
        niche: businessData.niche,
        tagline: businessData.tagline,
        brandColor: businessData.brandColor,
        secondaryColor: businessData.secondaryColor || null,
        logoEmoji: businessData.logoEmoji,
        valueProp: businessData.valueProp,
        aboutText: businessData.aboutText,
        tone: businessData.tone,
        landingPageJson: JSON.stringify(landingPageData),
        products: {
          create: productsData.products.map((p) => ({
            title: p.title,
            price: p.price,
            description: p.description,
            category: p.category,
            imageEmoji: p.imageEmoji,
          })),
        },
        marketingAssets: {
          create: marketingData.assets.map((m) => ({
            type: m.type,
            title: m.title,
            content: m.content,
            platform: m.platform,
          })),
        },
      },
      include: {
        products: true,
        marketingAssets: true,
      },
    });

    console.log(`[Generate API] Saved successfully! Generated Business ID: ${createdBusiness.id}`);

    return NextResponse.json({
      success: true,
      businessId: createdBusiness.id,
      business: createdBusiness,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Generate API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to generate online business. Please try again.', details: message },
      { status: 500 }
    );
  }
}
