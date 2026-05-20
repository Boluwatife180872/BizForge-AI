import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import routerInstance from '@/lib/ai/router';
import { BusinessSchema, ProductsSchema, LandingPageSchema, MarketingSchema, LandingPageData } from '@/lib/ai/types';

type DesignProfile = NonNullable<LandingPageData['design']>;

const DESIGN_PROFILES: Omit<DesignProfile, 'showTestimonials' | 'showFaqs' | 'showAbout' | 'sectionOrder'>[] = [
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
  },
];

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function rotateSections(seed: number): DesignProfile['sectionOrder'] {
  const base: DesignProfile['sectionOrder'] = ['features', 'products', 'testimonials', 'about', 'faqs'];
  const start = seed % base.length;
  return [...base.slice(start), ...base.slice(0, start)] as DesignProfile['sectionOrder'];
}

function enforceDesignVariation(
  landingPageData: LandingPageData,
  input: { prompt: string; businessName: string; niche: string; tone: string; nonce: string }
): LandingPageData {
  const seed = hashSeed(`${input.prompt}:${input.businessName}:${input.niche}:${input.tone}:${input.nonce}`);
  const profile = DESIGN_PROFILES[seed % DESIGN_PROFILES.length];
  const existing = landingPageData.design;

  return {
    ...landingPageData,
    design: {
      ...profile,
      showTestimonials: existing?.showTestimonials ?? true,
      showFaqs: existing?.showFaqs ?? true,
      showAbout: existing?.showAbout ?? true,
      sectionOrder: rotateSections(seed + input.businessName.length),
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
      `Original user idea: "${prompt}". Generate landing page layout sections for "${businessData.name}" (${businessData.niche} niche). Tagline: "${businessData.tagline}". Value prop: "${businessData.valueProp}". Tone: "${businessData.tone}". Brand colors: "${businessData.brandColor}" and "${businessData.secondaryColor || 'auto'}". Style seed: "${businessData.name}-${businessData.niche}-${prompt.length}-${designNonce}".`,
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
