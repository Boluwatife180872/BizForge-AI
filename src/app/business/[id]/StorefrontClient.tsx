'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Package,
  Sparkles,
} from 'lucide-react';
import CheckoutModal from '@/components/CheckoutModal';
import ThemeToggle from '@/components/ThemeToggle';

type DesignTokens = {
  layout: 'editorial' | 'split' | 'showcase' | 'immersive' | 'stacked';
  cardStyle: 'soft' | 'outline' | 'glass' | 'shadow';
  heroBg: 'paper' | 'mesh' | 'spotlight' | 'grid' | 'duotone';
  typography: 'modern' | 'editorial' | 'display';
  density: 'airy' | 'balanced' | 'compact';
  productLayout: 'grid' | 'stack' | 'magazine';
  featureStyle: 'cards' | 'bands' | 'checklist';
  surfaceStyle: 'flat' | 'tinted' | 'contrast';
  navStyle: 'minimal' | 'floating' | 'framed';
  dividerStyle: 'line' | 'accent' | 'ornament' | 'none';
  showTestimonials: boolean;
  showFaqs: boolean;
  showAbout: boolean;
  sectionOrder: Array<'features' | 'products' | 'testimonials' | 'about' | 'faqs'>;
};

export interface LandingPageProps {
  hero: { title: string; subtitle: string; ctaText: string };
  features: { title: string; description: string; iconEmoji: string }[];
  testimonials: { quote: string; author: string; role: string }[];
  faqs: { question: string; answer: string }[];
  design?: DesignTokens;
}

interface BusinessProps {
  id: string;
  name: string;
  niche: string;
  tagline: string;
  brandColor: string;
  secondaryColor: string | null;
  logoEmoji: string;
  valueProp: string;
  aboutText: string;
  tone: string;
}

interface ProductProps {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  imageEmoji: string;
}

const defaultDesign: DesignTokens = {
  layout: 'split',
  cardStyle: 'soft',
  heroBg: 'paper',
  typography: 'modern',
  density: 'balanced',
  productLayout: 'grid',
  featureStyle: 'cards',
  surfaceStyle: 'tinted',
  navStyle: 'minimal',
  dividerStyle: 'line',
  showTestimonials: true,
  showFaqs: true,
  showAbout: true,
  sectionOrder: ['features', 'products', 'testimonials', 'about', 'faqs'],
};

function normalizeDesign(input?: Partial<DesignTokens> & Record<string, unknown>): DesignTokens {
  if (!input) return defaultDesign;

  const legacyLayoutMap: Record<string, DesignTokens['layout']> = {
    centered: 'stacked',
    split: 'split',
    minimal: 'editorial',
    bold: 'immersive',
  };

  const legacyCardMap: Record<string, DesignTokens['cardStyle']> = {
    rounded: 'soft',
    sharp: 'outline',
    pill: 'glass',
  };

  const legacyHeroMap: Record<string, DesignTokens['heroBg']> = {
    solid: 'duotone',
    gradient: 'mesh',
    pattern: 'grid',
    none: 'paper',
  };

  const legacyTypographyMap: Record<string, DesignTokens['typography']> = {
    clean: 'modern',
    elegant: 'editorial',
    bold: 'display',
  };

  const legacyDividerMap: Record<string, DesignTokens['dividerStyle']> = {
    line: 'line',
    dots: 'ornament',
    none: 'none',
  };

  return {
    layout: legacyLayoutMap[input.layout as string] || input.layout || defaultDesign.layout,
    cardStyle: legacyCardMap[input.cardStyle as string] || input.cardStyle || defaultDesign.cardStyle,
    heroBg: legacyHeroMap[input.heroBg as string] || input.heroBg || defaultDesign.heroBg,
    typography: legacyTypographyMap[input.typography as string] || input.typography || defaultDesign.typography,
    density: input.density || defaultDesign.density,
    productLayout: input.productLayout || defaultDesign.productLayout,
    featureStyle: input.featureStyle || defaultDesign.featureStyle,
    surfaceStyle: input.surfaceStyle || defaultDesign.surfaceStyle,
    navStyle: input.navStyle || defaultDesign.navStyle,
    dividerStyle: legacyDividerMap[input.dividerStyle as string] || input.dividerStyle || defaultDesign.dividerStyle,
    showTestimonials: typeof input.showTestimonials === 'boolean' ? input.showTestimonials : defaultDesign.showTestimonials,
    showFaqs: typeof input.showFaqs === 'boolean' ? input.showFaqs : defaultDesign.showFaqs,
    showAbout: typeof input.showAbout === 'boolean' ? input.showAbout : defaultDesign.showAbout,
    sectionOrder: Array.isArray(input.sectionOrder) && input.sectionOrder.length > 0
      ? input.sectionOrder.filter((section): section is DesignTokens['sectionOrder'][number] =>
          ['features', 'products', 'testimonials', 'about', 'faqs'].includes(section as string)
        )
      : defaultDesign.sectionOrder,
  };
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((char) => `${char}${char}`).join('') : clean;

  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getFontFamily(typography: DesignTokens['typography']) {
  if (typography === 'editorial') return 'var(--font-cormorant), Georgia, serif';
  if (typography === 'display') return 'var(--font-archivo), var(--font-space-grotesk), sans-serif';
  return 'var(--font-space-grotesk), var(--font-geist-sans), sans-serif';
}

function getBodyFontFamily(typography: DesignTokens['typography']) {
  if (typography === 'editorial') return 'var(--font-geist-sans), sans-serif';
  return 'var(--font-space-grotesk), var(--font-geist-sans), sans-serif';
}

function getRadiusClass(cardStyle: DesignTokens['cardStyle']) {
  if (cardStyle === 'outline') return 'rounded-lg';
  if (cardStyle === 'glass') return 'rounded-2xl';
  if (cardStyle === 'shadow') return 'rounded-xl';
  return 'rounded-xl';
}

function getDensityClasses(density: DesignTokens['density']) {
  if (density === 'airy') {
    return {
      hero: 'py-28 sm:py-36',
      section: 'py-24',
      gap: 'gap-10',
      grid: 'gap-6',
    };
  }

  if (density === 'compact') {
    return {
      hero: 'py-16 sm:py-20',
      section: 'py-14',
      gap: 'gap-6',
      grid: 'gap-4',
    };
  }

  return {
    hero: 'py-20 sm:py-28',
    section: 'py-16 sm:py-20',
    gap: 'gap-8',
    grid: 'gap-5',
  };
}

function getSurfaceClasses(surfaceStyle: DesignTokens['surfaceStyle']) {
  if (surfaceStyle === 'contrast') {
    return 'bg-[var(--foreground)] text-[var(--background)]';
  }

  if (surfaceStyle === 'tinted') {
    return 'bg-[var(--card)] border border-[var(--card-border)]';
  }

  return 'border border-[var(--card-border)]';
}

function getPageBackground(design: DesignTokens, brandColor: string, secondaryColor: string | null) {
  const accent = secondaryColor || brandColor;

  if (design.surfaceStyle === 'contrast') {
    return {
      backgroundColor: 'var(--background)',
      backgroundImage: `radial-gradient(circle at 20% 0%, ${hexToRgba(brandColor, 0.06)}, transparent 50%)`,
    };
  }

  if (design.surfaceStyle === 'tinted') {
    return {
      backgroundColor: 'var(--background)',
      backgroundImage: `radial-gradient(circle at 80% 0%, ${hexToRgba(accent, 0.04)}, transparent 40%)`,
    };
  }

  return {
    backgroundColor: 'var(--background)',
  };
}

function getHeroBackground(heroBg: DesignTokens['heroBg'], brandColor: string, secondaryColor: string | null) {
  const accent = secondaryColor || brandColor;

  if (heroBg === 'mesh') {
    return {
      backgroundImage: `radial-gradient(ellipse at 20% 50%, ${hexToRgba(brandColor, 0.12)}, transparent 50%), radial-gradient(ellipse at 80% 20%, ${hexToRgba(accent, 0.08)}, transparent 40%)`,
    };
  }

  if (heroBg === 'spotlight') {
    return {
      backgroundImage: `radial-gradient(ellipse at center, ${hexToRgba(accent, 0.08)}, transparent 60%)`,
    };
  }

  if (heroBg === 'grid') {
    return {
      backgroundImage: `linear-gradient(${hexToRgba(brandColor, 0.06)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(brandColor, 0.06)} 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
    };
  }

  if (heroBg === 'duotone') {
    return {
      backgroundImage: `linear-gradient(135deg, ${brandColor}, ${accent})`,
    };
  }

  return {
    backgroundImage: `linear-gradient(180deg, ${hexToRgba(brandColor, 0.04)}, transparent 60%)`,
  };
}

function SectionDivider({
  style,
  brandColor,
  secondaryColor,
}: {
  style: DesignTokens['dividerStyle'];
  brandColor: string;
  secondaryColor: string | null;
}) {
  if (style === 'none') return null;

  if (style === 'accent') {
    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${brandColor}, ${secondaryColor || brandColor}, transparent)` }} />
      </div>
    );
  }

  if (style === 'ornament') {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <div className="h-px w-16 bg-[var(--border)]" />
        <Sparkles className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
        <div className="h-px w-16 bg-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="border-t border-[var(--border)]" />
    </div>
  );
}

function CardWrapper({
  design,
  className = '',
  children,
}: {
  design: DesignTokens;
  className?: string;
  children: React.ReactNode;
}) {
  const radiusClass = getRadiusClass(design.cardStyle);
  const surfaceClass = getSurfaceClasses(design.surfaceStyle);
  const extraEffects = design.cardStyle === 'glass'
    ? 'backdrop-blur-xl shadow-lg shadow-black/[0.04]'
    : design.cardStyle === 'shadow'
    ? 'shadow-md shadow-black/[0.06]'
    : '';

  return (
    <div className={`${radiusClass} ${surfaceClass} ${extraEffects} ${className}`}>
      {children}
    </div>
  );
}

function HeroSection({
  hero,
  business,
  design,
}: {
  hero: LandingPageProps['hero'];
  business: BusinessProps;
  design: DesignTokens;
}) {
  const density = getDensityClasses(design.density);
  const accent = business.secondaryColor || business.brandColor;
  const headingClass = design.typography === 'display'
    ? 'text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.95]'
    : design.typography === 'editorial'
    ? 'text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05]'
    : 'text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]';
  const heroStyle = getHeroBackground(design.heroBg, business.brandColor, business.secondaryColor);
  const lightText = design.heroBg === 'duotone';
  const textColorClass = lightText ? 'text-white' : 'text-[var(--foreground)]';
  const subtextClass = lightText ? 'text-white/70' : 'text-[var(--muted)]';

  const cta = (
    <a
      href="#products"
      className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${design.cardStyle === 'outline' ? 'rounded-lg' : 'rounded-full'}`}
      style={{
        backgroundColor: lightText ? '#ffffff' : business.brandColor,
        color: lightText ? business.brandColor : '#ffffff',
      }}
    >
      <ShoppingBag className="h-4 w-4" />
      {hero.ctaText}
    </a>
  );

  if (design.layout === 'immersive') {
    return (
      <section className={`relative overflow-hidden px-6 ${density.hero}`} style={heroStyle}>
        <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(180deg, transparent, ${hexToRgba(accent, 0.15)})` }} />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className={`mb-5 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-medium ${lightText ? 'bg-white/10 text-white/80' : 'bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--card-border)]'}`}>
              <span className="text-lg">{business.logoEmoji}</span>
              {business.name}
            </div>
            <h1 className={`${headingClass} ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
              {hero.title}
            </h1>
          </div>
          <div className="max-w-md">
            <p className={`mb-6 text-base leading-7 sm:text-lg ${subtextClass}`} style={{ fontFamily: getBodyFontFamily(design.typography) }}>
              {hero.subtitle}
            </p>
            {cta}
          </div>
        </div>
      </section>
    );
  }

  if (design.layout === 'showcase') {
    return (
      <section className={`px-6 ${density.hero}`}>
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <CardWrapper design={design} className={`relative overflow-hidden p-8 sm:p-12 ${lightText ? 'text-white' : ''}`} >
            <div className="absolute inset-0" style={heroStyle} />
            <div className="relative z-10">
              <div className={`mb-5 inline-flex items-center gap-2.5 text-sm ${lightText ? 'text-white/80' : 'text-[var(--muted-foreground)]'}`}>
                <span className="text-xl">{business.logoEmoji}</span>
                <span>{business.tagline}</span>
              </div>
              <h1 className={`${headingClass} mb-4 ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
                {hero.title}
              </h1>
              <p className={`mb-8 max-w-xl text-base leading-7 sm:text-lg ${subtextClass}`} style={{ fontFamily: getBodyFontFamily(design.typography) }}>
                {hero.subtitle}
              </p>
              {cta}
            </div>
          </CardWrapper>
          <div className={`grid ${density.grid}`}>
            {[business.valueProp, `Built for ${business.niche} brands with a ${business.tone} voice.`].map((copy, index) => (
              <CardWrapper key={index} design={design} className="flex min-h-[160px] flex-col justify-between p-6">
                <span className="text-3xl">{index === 0 ? business.logoEmoji : '✦'}</span>
                <p className="text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: getBodyFontFamily(design.typography) }}>
                  {copy}
                </p>
              </CardWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (design.layout === 'editorial') {
    return (
      <section className={`px-6 ${density.hero}`}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.35fr_1fr]">
          <div className="flex items-start justify-start lg:justify-center">
            <div className="sticky top-20">
              <div className="mb-3 text-5xl">{business.logoEmoji}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                {business.name}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className={`rounded-2xl p-8 sm:p-12 ${lightText ? 'text-white' : ''}`} style={heroStyle}>
              <p className={`mb-3 text-xs uppercase tracking-[0.24em] ${subtextClass}`}>{business.tagline}</p>
              <h1 className={`${headingClass} mb-5 ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
                {hero.title}
              </h1>
              <p className={`max-w-2xl text-base leading-8 ${subtextClass}`} style={{ fontFamily: getBodyFontFamily(design.typography) }}>
                {hero.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {cta}
              <span className="text-sm text-[var(--muted-foreground)]">{business.valueProp}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (design.layout === 'stacked') {
    return (
      <section className={`px-6 ${density.hero}`}>
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className={`rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--muted-foreground)] inline-flex items-center gap-2 self-start`} style={{ backgroundColor: hexToRgba(business.brandColor, 0.06) }}>
            <span className="text-lg">{business.logoEmoji}</span> {business.name}
          </div>
          <div className={`rounded-2xl p-8 sm:p-12 ${lightText ? 'text-white' : ''}`} style={heroStyle}>
            <h1 className={`${headingClass} mb-4 ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
              {hero.title}
            </h1>
            <p className={`mb-8 max-w-2xl text-base leading-8 sm:text-lg ${subtextClass}`} style={{ fontFamily: getBodyFontFamily(design.typography) }}>
              {hero.subtitle}
            </p>
            {cta}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`px-6 ${density.hero}`}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-4 flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="text-2xl">{business.logoEmoji}</span>
            <span className="font-medium">{business.name}</span>
          </div>
          <h1 className={`${headingClass} mb-4 ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
            {hero.title}
          </h1>
          <p className={`mb-8 max-w-xl text-base leading-7 sm:text-lg ${subtextClass}`} style={{ fontFamily: getBodyFontFamily(design.typography) }}>
            {hero.subtitle}
          </p>
          {cta}
        </div>
        <div className="min-h-[300px] overflow-hidden rounded-2xl p-8" style={heroStyle}>
          <div className="flex h-full flex-col justify-between">
            <div className="text-[72px] leading-none">{business.logoEmoji}</div>
            <div>
              <p className={`mb-1.5 text-[10px] uppercase tracking-[0.2em] ${subtextClass}`}>Signature promise</p>
              <p className={`text-xl ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
                {business.valueProp}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function StorefrontClient({
  business,
  products,
  landingPage,
}: {
  business: BusinessProps;
  products: ProductProps[];
  landingPage: LandingPageProps | null;
}) {
  const [checkoutProduct, setCheckoutProduct] = useState<ProductProps | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const design = normalizeDesign(landingPage?.design as (Partial<DesignTokens> & Record<string, unknown>) | undefined);
  const density = getDensityClasses(design.density);
  const pageBackground = getPageBackground(design, business.brandColor, business.secondaryColor);
  const headingFont = getFontFamily(design.typography);
  const bodyFont = getBodyFontFamily(design.typography);

  const sectionMap: Record<string, React.ReactNode> = {};

  if (landingPage?.features?.length) {
    sectionMap.features = (
      <section className={`mx-auto max-w-6xl px-6 ${density.section}`}>
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Highlights</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>
            Why {business.name} feels different
          </h2>
        </div>

        {design.featureStyle === 'bands' ? (
          <div className={`flex flex-col ${density.grid}`}>
            {landingPage.features.map((feature, index) => (
              <CardWrapper key={index} design={design} className="p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 text-2xl">{feature.iconEmoji}</div>
                    <h3 className="text-xl font-medium" style={{ fontFamily: headingFont }}>{feature.title}</h3>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>
                    {feature.description}
                  </p>
                </div>
              </CardWrapper>
            ))}
          </div>
        ) : design.featureStyle === 'checklist' ? (
          <div className={`grid md:grid-cols-3 ${density.grid}`}>
            {landingPage.features.map((feature, index) => (
              <div key={index} className="border-t border-[var(--border)] pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xl">{feature.iconEmoji}</span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">0{index + 1}</span>
                </div>
                <h3 className="mb-1.5 text-base font-medium" style={{ fontFamily: headingFont }}>{feature.title}</h3>
                <p className="text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>{feature.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid sm:grid-cols-2 md:grid-cols-3 ${density.grid}`}>
            {landingPage.features.map((feature, index) => (
              <CardWrapper key={index} design={design} className="p-6">
                <span className="mb-4 block text-2xl">{feature.iconEmoji}</span>
                <h3 className="mb-1.5 text-base font-medium" style={{ fontFamily: headingFont }}>{feature.title}</h3>
                <p className="text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>{feature.description}</p>
              </CardWrapper>
            ))}
          </div>
        )}
      </section>
    );
  }

  sectionMap.products = (
    <section id="products" className={`mx-auto max-w-6xl px-6 ${density.section}`}>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: hexToRgba(business.brandColor, 0.1) }}>
            <Package className="h-4 w-4" style={{ color: business.brandColor }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Collection</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>Products</h2>
          </div>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">{products.length} offer{products.length !== 1 ? 's' : ''}</span>
      </div>

      {design.productLayout === 'stack' ? (
        <div className={`flex flex-col ${density.grid}`}>
          {products.map((product) => (
            <CardWrapper key={product.id} design={design} className="overflow-hidden p-4 sm:p-6">
              <div className="grid gap-5 md:grid-cols-[100px_1fr_auto] md:items-center">
                <div
                  className="flex h-24 items-center justify-center rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.08)}, ${hexToRgba(business.secondaryColor || business.brandColor, 0.12)})` }}
                >
                  <span className="text-4xl">{product.imageEmoji}</span>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{product.category}</p>
                  <h3 className="mb-1.5 text-lg font-medium" style={{ fontFamily: headingFont }}>{product.title}</h3>
                  <p className="text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>{product.description}</p>
                </div>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => setCheckoutProduct(product)}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ backgroundColor: business.brandColor }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Buy now
                  </button>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      ) : design.productLayout === 'magazine' ? (
        <div className={`grid md:grid-cols-2 ${density.grid}`}>
          {products.map((product, index) => (
            <CardWrapper
              key={product.id}
              design={design}
              className={`overflow-hidden ${index % 3 === 0 ? 'md:col-span-2' : ''}`}
            >
              <div className={`grid h-full ${index % 3 === 0 ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
                <div
                  className="flex min-h-[200px] items-center justify-center p-8"
                  style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.1)}, ${hexToRgba(business.secondaryColor || business.brandColor, 0.16)})` }}
                >
                  <span className="text-6xl">{product.imageEmoji}</span>
                </div>
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{product.category}</p>
                    <h3 className="mb-1.5 text-2xl font-medium" style={{ fontFamily: headingFont }}>{product.title}</h3>
                    <p className="text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>{product.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => setCheckoutProduct(product)}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                      style={{ backgroundColor: business.brandColor }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      ) : (
        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 ${density.grid}`}>
          {products.map((product) => (
            <CardWrapper key={product.id} design={design} className="overflow-hidden group">
              <div
                className="flex h-40 items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.08)}, ${hexToRgba(business.secondaryColor || business.brandColor, 0.14)})` }}
              >
                <span className="text-5xl">{product.imageEmoji}</span>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{product.category}</p>
                    <h3 className="text-base font-medium" style={{ fontFamily: headingFont }}>{product.title}</h3>
                  </div>
                  <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <p className="mb-5 text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>{product.description}</p>
                <button
                  onClick={() => setCheckoutProduct(product)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ backgroundColor: business.brandColor }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy now
                </button>
              </div>
            </CardWrapper>
          ))}
        </div>
      )}
    </section>
  );

  if (design.showTestimonials && landingPage?.testimonials?.length) {
    sectionMap.testimonials = (
      <section className={`mx-auto max-w-5xl px-6 ${density.section}`}>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Proof</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>What customers are saying</h2>
        </div>
        <div className={`grid md:grid-cols-2 ${density.grid}`}>
          {landingPage.testimonials.map((testimonial, index) => (
            <CardWrapper key={index} design={design} className="p-6">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-5 text-base leading-8 text-[var(--muted)]" style={{ fontFamily: design.typography === 'editorial' ? headingFont : bodyFont }}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-medium">{testimonial.author}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{testimonial.role}</p>
              </div>
            </CardWrapper>
          ))}
        </div>
      </section>
    );
  }

  if (design.showAbout) {
    sectionMap.about = (
      <section className={`mx-auto max-w-5xl px-6 ${density.section}`}>
        <CardWrapper design={design} className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div
              className="flex min-h-[200px] items-center justify-center px-8 py-10"
              style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.1)}, ${hexToRgba(business.secondaryColor || business.brandColor, 0.18)})` }}
            >
              <div className="text-center">
                <div className="mb-4 text-6xl">{business.logoEmoji}</div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--foreground)]/50">{business.niche}</p>
              </div>
            </div>
            <div className="p-6 sm:p-10">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">About</p>
              <h2 className="mb-4 text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>The story behind {business.name}</h2>
              <p className="mb-5 text-sm leading-8 text-[var(--muted)] sm:text-base" style={{ fontFamily: bodyFont }}>
                {business.aboutText}
              </p>
              <p className="text-sm italic text-[var(--muted-foreground)]" style={{ fontFamily: bodyFont }}>
                {business.valueProp}
              </p>
            </div>
          </div>
        </CardWrapper>
      </section>
    );
  }

  if (design.showFaqs && landingPage?.faqs?.length) {
    sectionMap.faqs = (
      <section className={`mx-auto max-w-4xl px-6 ${density.section}`}>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Questions</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>Frequently asked questions</h2>
        </div>
        <div className={`flex flex-col ${density.grid}`}>
          {landingPage.faqs.map((faq, index) => (
            <CardWrapper key={index} design={design} className="overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium" style={{ fontFamily: headingFont }}>{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-5 pb-5 text-sm leading-7 text-[var(--muted)] animate-fade-in" style={{ fontFamily: bodyFont }}>
                  {faq.answer}
                </div>
              )}
            </CardWrapper>
          ))}
        </div>
      </section>
    );
  }

  const sectionsToRender = design.sectionOrder.filter((section) => sectionMap[section]);
  const navClass = design.navStyle === 'floating'
    ? 'sticky top-4 z-30 mx-auto mt-4 max-w-6xl rounded-full border border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl'
    : design.navStyle === 'framed'
    ? 'border-b border-[var(--border)]'
    : 'border-b border-transparent';

  return (
    <div
      className="min-h-screen text-[var(--foreground)]"
      style={{
        ...pageBackground,
        fontFamily: bodyFont,
      }}
    >
      <nav className={navClass}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-lg">{business.logoEmoji}</span>
            <span className="text-sm font-semibold">{business.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: business.brandColor }} />
              {business.secondaryColor && (
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: business.secondaryColor }} />
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {landingPage?.hero && (
        <HeroSection hero={landingPage.hero} business={business} design={design} />
      )}

      {sectionsToRender.map((sectionKey, index) => (
        <div key={sectionKey}>
          {index > 0 && (
            <SectionDivider
              style={design.dividerStyle}
              brandColor={business.brandColor}
              secondaryColor={business.secondaryColor}
            />
          )}
          {sectionMap[sectionKey]}
        </div>
      ))}

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-[var(--muted-foreground)]">
          &copy; 2026 {business.name}. Built with{' '}
          <Link href="/" className="transition-colors hover:text-[var(--foreground)]" style={{ color: business.brandColor }}>
            BizForge
          </Link>
        </div>
      </footer>

      {checkoutProduct && (
        <CheckoutModal
          productId={checkoutProduct.id}
          productTitle={checkoutProduct.title}
          price={checkoutProduct.price}
          businessName={business.name}
          brandColor={business.brandColor}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </div>
  );
}
