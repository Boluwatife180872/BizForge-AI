import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import StorefrontClient, { LandingPageProps } from './StorefrontClient';

export const dynamic = 'force-dynamic';

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) return notFound();

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      products: true,
      marketingAssets: true,
    },
  });

  if (!business) return notFound();

  // Parse landing page JSON safely
  let landingPage: Record<string, unknown> | null = null;
  try {
    landingPage = JSON.parse(business.landingPageJson);
  } catch {
    landingPage = null;
  }

  return (
    <StorefrontClient
      business={{
        id: business.id,
        name: business.name,
        niche: business.niche,
        tagline: business.tagline,
        brandColor: business.brandColor,
        secondaryColor: business.secondaryColor,
        logoEmoji: business.logoEmoji,
        valueProp: business.valueProp,
        aboutText: business.aboutText,
        tone: business.tone,
      }}
      products={business.products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        imageEmoji: p.imageEmoji,
      }))}
      landingPage={landingPage as LandingPageProps | null}
    />
  );
}
