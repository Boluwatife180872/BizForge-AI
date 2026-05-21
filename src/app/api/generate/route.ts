import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import routerInstance from '@/lib/ai/router';
import { BusinessSchema, ProductsSchema, LandingPageSchema, MarketingSchema, LandingPageData } from '@/lib/ai/types';

type DesignProfile = NonNullable<LandingPageData['design']>;

const DESIGN_PROFILES: DesignProfile[] = [
  {
    layout: 'editorial',
    cardStyle: 'soft',
    heroBg: 'paper',
    typography: 'editorial',
    density: 'airy',
    productLayout: 'magazine',
    featureStyle: 'bands',
    surfaceStyle: 'tinted',
    navStyle: 'minimal',
    dividerStyle: 'ornament',
    theme: 'journal',
    heroMedia: 'badge',
    ctaStyle: 'outline',
  },
  {
    layout: 'immersive',
    cardStyle: 'glass',
    heroBg: 'duotone',
    typography: 'display',
    density: 'balanced',
    productLayout: 'stack',
    featureStyle: 'cards',
    surfaceStyle: 'contrast',
    navStyle: 'floating',
    dividerStyle: 'accent',
    theme: 'terminal',
    heroMedia: 'device',
    ctaStyle: 'split',
  },
  {
    layout: 'split',
    cardStyle: 'outline',
    heroBg: 'grid',
    typography: 'modern',
    density: 'compact',
    productLayout: 'grid',
    featureStyle: 'checklist',
    surfaceStyle: 'flat',
    navStyle: 'framed',
    dividerStyle: 'line',
    theme: 'studio',
    heroMedia: 'pattern',
    ctaStyle: 'solid',
  },
  {
    layout: 'showcase',
    cardStyle: 'shadow',
    heroBg: 'mesh',
    typography: 'display',
    density: 'balanced',
    productLayout: 'magazine',
    featureStyle: 'cards',
    surfaceStyle: 'tinted',
    navStyle: 'floating',
    dividerStyle: 'accent',
    theme: 'catalog',
    heroMedia: 'stack',
    ctaStyle: 'split',
  },
  {
    layout: 'stacked',
    cardStyle: 'soft',
    heroBg: 'spotlight',
    typography: 'editorial',
    density: 'airy',
    productLayout: 'stack',
    featureStyle: 'bands',
    surfaceStyle: 'flat',
    navStyle: 'minimal',
    dividerStyle: 'ornament',
    theme: 'atelier',
    heroMedia: 'orb',
    ctaStyle: 'outline',
  },
  {
    layout: 'split',
    cardStyle: 'glass',
    heroBg: 'mesh',
    typography: 'modern',
    density: 'compact',
    productLayout: 'stack',
    featureStyle: 'checklist',
    surfaceStyle: 'contrast',
    navStyle: 'framed',
    dividerStyle: 'line',
    theme: 'kinetic',
    heroMedia: 'device',
    ctaStyle: 'solid',
  },
  {
    layout: 'editorial',
    cardStyle: 'outline',
    heroBg: 'paper',
    typography: 'display',
    density: 'balanced',
    productLayout: 'grid',
    featureStyle: 'bands',
    surfaceStyle: 'flat',
    navStyle: 'minimal',
    dividerStyle: 'accent',
    theme: 'studio',
    heroMedia: 'badge',
    ctaStyle: 'split',
  },
  {
    layout: 'showcase',
    cardStyle: 'shadow',
    heroBg: 'duotone',
    typography: 'modern',
    density: 'compact',
    productLayout: 'grid',
    featureStyle: 'cards',
    surfaceStyle: 'contrast',
    navStyle: 'floating',
    dividerStyle: 'ornament',
    theme: 'kinetic',
    heroMedia: 'stack',
    ctaStyle: 'outline',
  },
  {
    layout: 'immersive',
    cardStyle: 'outline',
    heroBg: 'spotlight',
    typography: 'editorial',
    density: 'airy',
    productLayout: 'magazine',
    featureStyle: 'checklist',
    surfaceStyle: 'flat',
    navStyle: 'framed',
    dividerStyle: 'none',
    theme: 'atelier',
    heroMedia: 'pattern',
    ctaStyle: 'solid',
  },
  {
    layout: 'stacked',
    cardStyle: 'glass',
    heroBg: 'grid',
    typography: 'display',
    density: 'compact',
    productLayout: 'grid',
    featureStyle: 'bands',
    surfaceStyle: 'contrast',
    navStyle: 'floating',
    dividerStyle: 'accent',
    theme: 'terminal',
    heroMedia: 'orb',
    ctaStyle: 'split',
  },
];

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function enforceDesignVariation(
  landingPageData: LandingPageData,
  input: { prompt: string; businessName: string; niche: string; tone: string; nonce: string }
): LandingPageData {
  const seed = hashSeed(`${input.prompt}:${input.businessName}:${input.niche}:${input.tone}:${input.nonce}`);
  const profile = DESIGN_PROFILES[seed % DESIGN_PROFILES.length];
  const existing = landingPageData.design;
  const [heroBlock, ...remainingBlocks] = landingPageData.pageBlocks;
  const rotateBy = remainingBlocks.length ? seed % remainingBlocks.length : 0;
  const variedBlocks = heroBlock
    ? [heroBlock, ...remainingBlocks.slice(rotateBy), ...remainingBlocks.slice(0, rotateBy)]
    : landingPageData.pageBlocks;

  return {
    ...landingPageData,
    pageBlocks: variedBlocks,
    design: {
      ...profile,
      ...existing,
    },
  };
}

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
    const designNonce = crypto.randomUUID().slice(0, 8);

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
      `Original user idea: "${prompt}". Generate a modular block-based landing page for "${businessData.name}" (${businessData.niche} niche). Tagline: "${businessData.tagline}". Value prop: "${businessData.valueProp}". Tone: "${businessData.tone}". Products/offers: ${productsData.products.map((product) => `${product.title} at $${product.price}`).join(', ')}. Brand colors: "${businessData.brandColor}" and "${businessData.secondaryColor || 'auto'}". Style seed: "${businessData.name}-${businessData.niche}-${prompt.length}-${designNonce}". Use the seed to choose a unique pageBlocks sequence and do not reuse a generic fixed section order.`,
      LandingPageSchema
    );
    const variedLandingPageData = enforceDesignVariation(landingPageData, {
      prompt,
      businessName: businessData.name,
      niche: businessData.niche,
      tone: businessData.tone,
      nonce: designNonce,
    });
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
        landingPageJson: JSON.stringify(variedLandingPageData),
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
