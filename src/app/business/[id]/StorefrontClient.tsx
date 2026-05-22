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
  theme: 'studio' | 'terminal' | 'atelier' | 'catalog' | 'journal' | 'kinetic';
  heroMedia: 'orb' | 'device' | 'badge' | 'pattern' | 'stack';
  ctaStyle: 'solid' | 'outline' | 'split';
};

type FeatureItem = { title: string; description: string; iconEmoji: string };
type SocialProofItem = { quote: string; author: string; role: string };
type FaqItem = { question: string; answer: string };
type ShowcaseItem = { title: string; caption: string; imageEmoji: string };
type PricingPlan = { name: string; price: string; description: string; features: string[]; ctaText: string };

type PageBlock =
  | { type: 'hero_centered'; data: { title: string; subtitle: string; ctaText: string } }
  | { type: 'hero_split'; data: { title: string; subtitle: string; ctaText: string } }
  | { type: 'feature_grid'; data: { heading?: string; features: FeatureItem[] } }
  | { type: 'feature_list'; data: { heading?: string; features: FeatureItem[] } }
  | { type: 'social_proof'; data: { heading?: string; items: SocialProofItem[] } }
  | { type: 'pricing_table'; data: { heading?: string; plans: PricingPlan[] } }
  | { type: 'cta_banner'; data: { title: string; subtitle: string; ctaText: string } }
  | { type: 'story_section'; data: { eyebrow?: string; title: string; body: string } }
  | { type: 'faq'; data: { heading?: string; items: FaqItem[] } }
  | { type: 'image_showcase'; data: { heading?: string; items: ShowcaseItem[] } };

export interface LandingPageProps {
  pageBlocks?: PageBlock[];
  hero?: { title: string; subtitle: string; ctaText: string };
  features?: FeatureItem[];
  testimonials?: SocialProofItem[];
  faqs?: FaqItem[];
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
  theme: 'studio',
  heroMedia: 'orb',
  ctaStyle: 'solid',
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

  const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => (
    typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback
  );
  return {
    layout: pick(legacyLayoutMap[input.layout as string] || input.layout, ['editorial', 'split', 'showcase', 'immersive', 'stacked'] as const, defaultDesign.layout),
    cardStyle: pick(legacyCardMap[input.cardStyle as string] || input.cardStyle, ['soft', 'outline', 'glass', 'shadow'] as const, defaultDesign.cardStyle),
    heroBg: pick(legacyHeroMap[input.heroBg as string] || input.heroBg, ['paper', 'mesh', 'spotlight', 'grid', 'duotone'] as const, defaultDesign.heroBg),
    typography: pick(legacyTypographyMap[input.typography as string] || input.typography, ['modern', 'editorial', 'display'] as const, defaultDesign.typography),
    density: pick(input.density, ['airy', 'balanced', 'compact'] as const, defaultDesign.density),
    productLayout: pick(input.productLayout, ['grid', 'stack', 'magazine'] as const, defaultDesign.productLayout),
    featureStyle: pick(input.featureStyle, ['cards', 'bands', 'checklist'] as const, defaultDesign.featureStyle),
    surfaceStyle: pick(input.surfaceStyle, ['flat', 'tinted', 'contrast'] as const, defaultDesign.surfaceStyle),
    navStyle: pick(input.navStyle, ['minimal', 'floating', 'framed'] as const, defaultDesign.navStyle),
    dividerStyle: pick(legacyDividerMap[input.dividerStyle as string] || input.dividerStyle, ['line', 'accent', 'ornament', 'none'] as const, defaultDesign.dividerStyle),
    theme: pick(input.theme, ['studio', 'terminal', 'atelier', 'catalog', 'journal', 'kinetic'] as const, defaultDesign.theme),
    heroMedia: pick(input.heroMedia, ['orb', 'device', 'badge', 'pattern', 'stack'] as const, defaultDesign.heroMedia),
    ctaStyle: pick(input.ctaStyle, ['solid', 'outline', 'split'] as const, defaultDesign.ctaStyle),
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
      backgroundImage: `linear-gradient(135deg, ${hexToRgba(brandColor, 0.05)} 0 25%, transparent 25% 50%, ${hexToRgba(accent, 0.04)} 50% 75%, transparent 75%), radial-gradient(circle at 20% 0%, ${hexToRgba(brandColor, 0.06)}, transparent 50%)`,
      backgroundSize: design.theme === 'terminal' ? '32px 32px, auto' : 'auto',
    };
  }

  if (design.surfaceStyle === 'tinted') {
    return {
      backgroundColor: 'var(--background)',
      backgroundImage: design.theme === 'journal'
        ? `linear-gradient(90deg, ${hexToRgba(brandColor, 0.035)} 1px, transparent 1px), radial-gradient(circle at 80% 0%, ${hexToRgba(accent, 0.04)}, transparent 40%)`
        : `radial-gradient(circle at 80% 0%, ${hexToRgba(accent, 0.04)}, transparent 40%)`,
      backgroundSize: design.theme === 'journal' ? '72px 72px, auto' : 'auto',
    };
  }

  return {
    backgroundColor: 'var(--background)',
    backgroundImage: design.theme === 'atelier'
      ? `radial-gradient(circle at 12px 12px, ${hexToRgba(brandColor, 0.08)} 1px, transparent 1px)`
      : undefined,
    backgroundSize: design.theme === 'atelier' ? '28px 28px' : undefined,
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

function HeroVisual({
  design,
  business,
}: {
  design: DesignTokens;
  business: BusinessProps;
}) {
  const accent = business.secondaryColor || business.brandColor;

  if (design.heroMedia === 'device') {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black p-3 shadow-2xl shadow-black/20">
        <div className="rounded-[1.4rem] bg-slate-950 p-5 text-emerald-200">
          <div className="mb-5 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="space-y-3 font-mono text-xs">
            <p>$ launch {business.name.toLowerCase().replace(/\s+/g, '-')}</p>
            <div className="h-2 w-2/3 rounded-full bg-emerald-300/50" />
            <div className="h-2 w-4/5 rounded-full bg-white/20" />
            <div className="h-20 rounded-xl border border-emerald-300/20 bg-emerald-300/10" />
          </div>
        </div>
      </div>
    );
  }

  if (design.heroMedia === 'badge') {
    return (
      <div className="relative flex min-h-[280px] items-center justify-center">
        <div className="absolute h-56 w-56 rotate-6 rounded-[2rem]" style={{ backgroundColor: hexToRgba(accent, 0.14) }} />
        <div className="relative grid h-52 w-52 place-items-center rounded-full border border-[var(--border)] bg-[var(--background)] shadow-xl">
          <div className="text-center">
            <div className="mb-3 text-7xl">{business.logoEmoji}</div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{business.niche}</p>
          </div>
        </div>
      </div>
    );
  }

  if (design.heroMedia === 'pattern') {
    return (
      <div className="grid min-h-[280px] grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="grid place-items-center rounded-2xl border border-[var(--border)]"
            style={{
              backgroundColor: index % 2 === 0 ? hexToRgba(business.brandColor, 0.1) : hexToRgba(accent, 0.08),
              transform: `translateY(${(index % 3) * 8}px)`,
            }}
          >
            <span className="text-2xl">{index === 4 ? business.logoEmoji : '✦'}</span>
          </div>
        ))}
      </div>
    );
  }

  if (design.heroMedia === 'stack') {
    return (
      <div className="relative min-h-[300px]">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl"
            style={{
              transform: `translate(-50%, -50%) rotate(${(item - 1) * 8}deg) translateY(${item * 24}px)`,
              zIndex: 3 - item,
            }}
          >
            <div className="mb-8 text-4xl">{item === 1 ? business.logoEmoji : '✧'}</div>
            <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: hexToRgba(item === 0 ? business.brandColor : accent, 0.35) }} />
            <div className="mt-3 h-2 w-1/2 rounded-full bg-[var(--border)]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-h-[300px]">
      <div className="absolute inset-6 rounded-full blur-3xl" style={{ backgroundColor: hexToRgba(accent, 0.18) }} />
      <div className="absolute inset-12 rounded-full border border-[var(--border)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-48 w-48 place-items-center rounded-full text-7xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.18)}, ${hexToRgba(accent, 0.28)})` }}>
          {business.logoEmoji}
        </div>
      </div>
    </div>
  );
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
  variant,
}: {
  hero: NonNullable<LandingPageProps['hero']>;
  business: BusinessProps;
  design: DesignTokens;
  variant?: 'hero_centered' | 'hero_split';
}) {
  const density = getDensityClasses(design.density);
  const accent = business.secondaryColor || business.brandColor;
  const layout = variant === 'hero_centered' ? 'stacked' : variant === 'hero_split' ? 'split' : design.layout;
  const headingClass = design.typography === 'display'
    ? 'text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.95]'
    : design.typography === 'editorial'
    ? 'text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05]'
    : 'text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]';
  const heroStyle = getHeroBackground(design.heroBg, business.brandColor, business.secondaryColor);
  const lightText = design.heroBg === 'duotone';
  const textColorClass = lightText ? 'text-white' : 'text-[var(--foreground)]';
  const subtextClass = lightText ? 'text-white/70' : 'text-[var(--muted)]';
  const ctaBase = `inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${design.cardStyle === 'outline' ? 'rounded-lg' : 'rounded-full'}`;
  const ctaStyle = design.ctaStyle === 'outline'
    ? {
        backgroundColor: 'transparent',
        color: lightText ? '#ffffff' : business.brandColor,
        border: `1px solid ${lightText ? 'rgba(255,255,255,0.45)' : business.brandColor}`,
      }
    : {
        backgroundColor: lightText ? '#ffffff' : business.brandColor,
        color: lightText ? business.brandColor : '#ffffff',
        border: '1px solid transparent',
      };

  const cta = (
    <div className={`flex flex-wrap items-center gap-3 ${design.ctaStyle === 'split' ? 'rounded-full bg-[var(--background)]/10 p-1' : ''}`}>
      <a href="#products" className={ctaBase} style={ctaStyle}>
        <ShoppingBag className="h-4 w-4" />
        {hero.ctaText}
      </a>
      {design.ctaStyle === 'split' && (
        <a
          href="#products"
          className={`${ctaBase} border border-[var(--border)] bg-[var(--background)]/80 text-[var(--foreground)] backdrop-blur`}
        >
          View offers
        </a>
      )}
    </div>
  );

  if (layout === 'immersive') {
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
          <HeroVisual design={design} business={business} />
        </div>
      </section>
    );
  }

  if (layout === 'showcase') {
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
              <CardWrapper key={index} design={design} className={`flex min-h-[160px] flex-col justify-between p-6 ${design.theme === 'kinetic' && index === 1 ? '-rotate-2' : ''}`}>
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

  if (layout === 'editorial') {
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

  if (layout === 'stacked') {
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
          <HeroVisual design={design} business={business} />
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
        <div className="overflow-hidden rounded-2xl p-6" style={heroStyle}>
          <HeroVisual design={design} business={business} />
          <div className="mt-4">
            <p className={`mb-1.5 text-[10px] uppercase tracking-[0.2em] ${subtextClass}`}>Signature promise</p>
            <p className={`text-xl ${textColorClass}`} style={{ fontFamily: getFontFamily(design.typography) }}>
              {business.valueProp}
            </p>
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

  const pageBlocks: PageBlock[] = Array.isArray(landingPage?.pageBlocks) && landingPage.pageBlocks.length > 0
    ? landingPage.pageBlocks
    : [
        { type: 'hero_split' as const, data: { title: business.tagline, subtitle: business.valueProp, ctaText: 'Shop now' } },
        { type: 'story_section' as const, data: { eyebrow: business.niche, title: `The story behind ${business.name}`, body: business.aboutText } },
        { type: 'feature_grid' as const, data: { heading: `Why ${business.name} works`, features: [{ title: 'Quality focused', description: 'Every detail is crafted to deliver a premium experience.', iconEmoji: '✨' }, { title: 'Customer first', description: 'Built around what your audience actually needs.', iconEmoji: '🤝' }, { title: 'Ready to scale', description: 'Designed to grow alongside your business goals.', iconEmoji: '📈' }] } },
        { type: 'cta_banner' as const, data: { title: `Start with ${business.name}`, subtitle: 'Explore our collection and find what works for you.', ctaText: 'View offers' } },
      ];

  function renderBlock(block: PageBlock, index: number) {
    if (block.type === 'hero_centered' || block.type === 'hero_split') {
      return <HeroSection hero={block.data} business={business} design={design} variant={block.type} />;
    }

    if (block.type === 'feature_grid' || block.type === 'feature_list') {
      const isList = block.type === 'feature_list';
      return (
        <section className={`mx-auto max-w-6xl px-6 ${density.section}`}>
          <div className="mb-10">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Highlights</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>
              {block.data.heading || `Why ${business.name} works`}
            </h2>
          </div>
          <div className={isList ? `flex flex-col ${density.grid}` : `grid sm:grid-cols-2 md:grid-cols-3 ${density.grid}`}>
            {block.data.features.map((feature, featureIndex) => (
              <CardWrapper key={`${feature.title}-${featureIndex}`} design={design} className={isList ? 'p-6 sm:p-8' : 'p-6'}>
                <div className={isList ? 'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between' : ''}>
                  <div>
                    <span className="mb-4 block text-2xl">{feature.iconEmoji}</span>
                    <h3 className="mb-1.5 text-base font-medium" style={{ fontFamily: headingFont }}>{feature.title}</h3>
                  </div>
                  <p className="text-sm leading-7 text-[var(--muted)]" style={{ fontFamily: bodyFont }}>{feature.description}</p>
                </div>
              </CardWrapper>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === 'social_proof') {
      return (
        <section className={`mx-auto max-w-5xl px-6 ${density.section}`}>
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Proof</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>{block.data.heading || 'What customers are saying'}</h2>
          </div>
          <div className={`grid md:grid-cols-2 ${density.grid}`}>
            {block.data.items.map((item, itemIndex) => (
              <CardWrapper key={`${item.author}-${itemIndex}`} design={design} className="p-6">
                <div className="mb-4 flex gap-0.5">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                <p className="mb-5 text-base leading-8 text-[var(--muted)]" style={{ fontFamily: design.typography === 'editorial' ? headingFont : bodyFont }}>&ldquo;{item.quote}&rdquo;</p>
                <p className="text-sm font-medium">{item.author}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{item.role}</p>
              </CardWrapper>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === 'pricing_table') {
      return (
        <section id="products" className={`mx-auto max-w-6xl px-6 ${density.section}`}>
          <div className="mb-10">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Offers</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>{block.data.heading || 'Choose your starting point'}</h2>
          </div>
          <div className={`grid md:grid-cols-3 ${density.grid}`}>
            {block.data.plans.map((plan, planIndex) => {
              const matchingProduct = products[planIndex];
              return (
                <CardWrapper key={`${plan.name}-${planIndex}`} design={design} className="flex flex-col p-6">
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">{plan.name}</p>
                  <p className="mt-3 text-3xl font-semibold" style={{ fontFamily: headingFont }}>{plan.price}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{plan.description}</p>
                  <div className="my-6 space-y-2">
                    {plan.features.map((feature) => <p key={feature} className="text-sm text-[var(--muted)]">✓ {feature}</p>)}
                  </div>
                  <button
                    onClick={() => matchingProduct && setCheckoutProduct(matchingProduct)}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: business.brandColor }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {plan.ctaText}
                  </button>
                </CardWrapper>
              );
            })}
          </div>
        </section>
      );
    }

    if (block.type === 'cta_banner') {
      return (
        <section className={`mx-auto max-w-6xl px-6 ${density.section}`}>
          <div className="overflow-hidden rounded-3xl px-8 py-12 text-white sm:px-12" style={{ background: `linear-gradient(135deg, ${business.brandColor}, ${business.secondaryColor || business.brandColor})` }}>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>{block.data.title}</h2>
            <p className="mt-4 max-w-2xl text-white/75">{block.data.subtitle}</p>
            <a href="#products" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold" style={{ color: business.brandColor }}>{block.data.ctaText}</a>
          </div>
        </section>
      );
    }

    if (block.type === 'story_section') {
      return (
        <section className={`mx-auto max-w-5xl px-6 ${density.section}`}>
          <CardWrapper design={design} className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="flex min-h-[220px] items-center justify-center px-8 py-10" style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.1)}, ${hexToRgba(business.secondaryColor || business.brandColor, 0.18)})` }}>
                <div className="text-center"><div className="mb-4 text-6xl">{business.logoEmoji}</div><p className="text-[10px] uppercase tracking-[0.24em] text-[var(--foreground)]/50">{block.data.eyebrow || business.niche}</p></div>
              </div>
              <div className="p-6 sm:p-10">
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Story</p>
                <h2 className="mb-4 text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>{block.data.title}</h2>
                <p className="text-sm leading-8 text-[var(--muted)] sm:text-base" style={{ fontFamily: bodyFont }}>{block.data.body}</p>
              </div>
            </div>
          </CardWrapper>
        </section>
      );
    }

    if (block.type === 'faq') {
      return (
        <section className={`mx-auto max-w-4xl px-6 ${density.section}`}>
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Questions</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>{block.data.heading || 'Frequently asked questions'}</h2>
          </div>
          <div className={`flex flex-col ${density.grid}`}>
            {block.data.items.map((faq, faqIndex) => {
              const key = index * 100 + faqIndex;
              return (
                <CardWrapper key={`${faq.question}-${faqIndex}`} design={design} className="overflow-hidden">
                  <button onClick={() => setOpenFaqIndex(openFaqIndex === key ? null : key)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                    <span className="text-sm font-medium" style={{ fontFamily: headingFont }}>{faq.question}</span>
                    {openFaqIndex === key ? <ChevronUp className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />}
                  </button>
                  {openFaqIndex === key && <div className="px-5 pb-5 text-sm leading-7 text-[var(--muted)] animate-fade-in" style={{ fontFamily: bodyFont }}>{faq.answer}</div>}
                </CardWrapper>
              );
            })}
          </div>
        </section>
      );
    }

    return (
      <section className={`mx-auto max-w-6xl px-6 ${density.section}`}>
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Showcase</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: headingFont }}>{block.data.heading || 'A closer look'}</h2>
        </div>
        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 ${density.grid}`}>
          {block.data.items.map((item, itemIndex) => (
            <CardWrapper key={`${item.title}-${itemIndex}`} design={design} className="overflow-hidden">
              <div className="grid min-h-40 place-items-center text-6xl" style={{ background: `linear-gradient(135deg, ${hexToRgba(business.brandColor, 0.1)}, ${hexToRgba(business.secondaryColor || business.brandColor, 0.16)})` }}>{item.imageEmoji}</div>
              <div className="p-5"><h3 className="text-base font-medium" style={{ fontFamily: headingFont }}>{item.title}</h3><p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.caption}</p></div>
            </CardWrapper>
          ))}
        </div>
      </section>
    );
  }
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
          </div>
        </div>
      </nav>

      {pageBlocks.map((block, index) => (
        <div key={`${block.type}-${index}`}>
          {index > 0 && (
            <SectionDivider
              style={design.dividerStyle}
              brandColor={business.brandColor}
              secondaryColor={business.secondaryColor}
            />
          )}
          {renderBlock(block, index)}
        </div>
      ))}

      <SectionDivider
        style={design.dividerStyle}
        brandColor={business.brandColor}
        secondaryColor={business.secondaryColor}
      />

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

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-[var(--muted-foreground)]">
          &copy; 2026 {business.name}. Built with{' '}
          <Link href="/" className="transition-colors hover:text-[var(--foreground)]" style={{ color: business.brandColor }}>
            BizCraft
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
