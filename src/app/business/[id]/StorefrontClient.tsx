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
} from 'lucide-react';
import CheckoutModal from '@/components/CheckoutModal';
import ThemeToggle from '@/components/ThemeToggle';

export interface LandingPageProps {
  hero: { title: string; subtitle: string; ctaText: string };
  features: { title: string; description: string; iconEmoji: string }[];
  testimonials: { quote: string; author: string; role: string }[];
  faqs: { question: string; answer: string }[];
  design?: {
    layout: 'centered' | 'split' | 'minimal' | 'bold';
    cardStyle: 'rounded' | 'sharp' | 'pill';
    heroBg: 'solid' | 'gradient' | 'pattern' | 'none';
    typography: 'clean' | 'elegant' | 'bold';
    dividerStyle: 'line' | 'dots' | 'none';
    showTestimonials: boolean;
    showFaqs: boolean;
    showAbout: boolean;
    sectionOrder: string[];
  };
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

const defaultDesign = {
  layout: 'centered' as const,
  cardStyle: 'rounded' as const,
  heroBg: 'none' as const,
  typography: 'clean' as const,
  dividerStyle: 'line' as const,
  showTestimonials: true,
  showFaqs: true,
  showAbout: true,
  sectionOrder: ['features', 'products', 'testimonials', 'about', 'faqs'],
};

function SectionDivider({ style, color }: { style: string; color: string }) {
  if (style === 'none') return null;
  if (style === 'dots') {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />
        ))}
      </div>
    );
  }
  return <div className="border-t border-[var(--border)] my-8" />;
}

function CardWrapper({ cardStyle, children, className = '' }: { cardStyle: string; children: React.ReactNode; className?: string }) {
  const radius = cardStyle === 'sharp' ? 'rounded-none' : cardStyle === 'pill' ? 'rounded-2xl' : 'rounded-xl';
  return (
    <div className={`bg-[var(--card)] border border-[var(--card-border)] ${radius} ${className}`}>
      {children}
    </div>
  );
}

function HeroSection({
  hero,
  brandColor,
  secondaryColor,
  layout,
  heroBg,
  typography,
  businessName,
  logoEmoji,
}: {
  hero: { title: string; subtitle: string; ctaText: string };
  brandColor: string;
  secondaryColor: string | null;
  layout: string;
  heroBg: string;
  typography: string;
  businessName: string;
  logoEmoji: string;
}) {
  const headingSize = typography === 'bold'
    ? 'text-4xl sm:text-6xl font-black'
    : typography === 'elegant'
    ? 'text-3xl sm:text-5xl font-light tracking-wide'
    : 'text-3xl sm:text-5xl font-semibold tracking-tight';

  const heroBgClass = heroBg === 'solid'
    ? 'text-white'
    : heroBg === 'gradient'
    ? 'text-white'
    : heroBg === 'pattern'
    ? ''
    : '';

  const bgStyle = heroBg === 'solid'
    ? { backgroundColor: brandColor }
    : heroBg === 'gradient'
    ? { background: `linear-gradient(135deg, ${brandColor}, ${secondaryColor || brandColor})` }
    : heroBg === 'pattern'
    ? { backgroundImage: `radial-gradient(${brandColor}15 1px, transparent 1px)`, backgroundSize: '24px 24px' }
    : {};

  if (layout === 'split') {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={heroBgClass}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{logoEmoji}</span>
              <span className="text-sm font-medium text-[var(--muted-foreground)]">{businessName}</span>
            </div>
            <h1 className={`${headingSize} leading-tight mb-4`}>{hero.title}</h1>
            <p className={`text-base sm:text-lg ${heroBg === 'none' ? 'text-[var(--muted)]' : 'text-white/80'} leading-relaxed mb-8`}>
              {hero.subtitle}
            </p>
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
              style={{ backgroundColor: heroBg === 'none' ? brandColor : '#fff', color: heroBg === 'none' ? '#fff' : brandColor }}
            >
              <ShoppingBag className="w-4 h-4" /> {hero.ctaText}
            </a>
          </div>
          <div
            className="h-64 sm:h-80 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${brandColor}10, ${secondaryColor || brandColor}10)`,
              borderRadius: '16px',
            }}
          >
            <span className="text-8xl">{logoEmoji}</span>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'minimal') {
    return (
      <section className="max-w-4xl mx-auto px-6 py-24 sm:py-32 text-center">
        <h1 className={`${headingSize} leading-tight mb-6`}>{hero.title}</h1>
        <p className="text-base text-[var(--muted)] max-w-lg mx-auto leading-relaxed mb-10">
          {hero.subtitle}
        </p>
        <a
          href="#products"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm transition-colors hover:opacity-90 border-2"
          style={{ borderColor: brandColor, color: brandColor }}
        >
          {hero.ctaText}
        </a>
      </section>
    );
  }

  if (layout === 'bold') {
    return (
      <section
        className="relative px-6 py-20 sm:py-32 text-center overflow-hidden"
        style={bgStyle}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-medium text-white/80 mb-6">
            {logoEmoji} {businessName}
          </div>
          <h1 className={`${headingSize} leading-tight mb-6 text-white`}>{hero.title}</h1>
          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-10">
            {hero.subtitle}
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: '#fff', color: brandColor }}
          >
            <ShoppingBag className="w-4 h-4" /> {hero.ctaText}
          </a>
        </div>
      </section>
    );
  }

  // Default: centered
  return (
    <section
      className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center"
      style={bgStyle}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-3xl">{logoEmoji}</span>
        <span className="text-sm font-medium text-[var(--muted-foreground)]">{businessName}</span>
      </div>
      <h1 className={`${headingSize} leading-tight mb-4 ${heroBgClass}`}>{hero.title}</h1>
      <p className={`text-base sm:text-lg ${heroBg === 'none' ? 'text-[var(--muted)]' : 'text-white/80'} max-w-xl mx-auto leading-relaxed mb-8`}>
        {hero.subtitle}
      </p>
      <a
        href="#products"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
        style={{ backgroundColor: heroBg === 'none' ? brandColor : '#fff', color: heroBg === 'none' ? '#fff' : brandColor }}
      >
        <ShoppingBag className="w-4 h-4" /> {hero.ctaText}
      </a>
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

  const brandColor = business.brandColor || '#3b82f6';
  const design = landingPage?.design || defaultDesign;

  const sectionMap: Record<string, React.ReactNode> = {};

  // Features section
  if (landingPage?.features && landingPage.features.length > 0) {
    sectionMap.features = (
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className={`text-lg font-medium text-center mb-8 ${design.typography === 'bold' ? 'font-black text-2xl' : design.typography === 'elegant' ? 'font-light tracking-wide' : ''}`}>
          Why {business.name}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {landingPage.features.map((feat, idx) => (
            <CardWrapper key={idx} cardStyle={design.cardStyle} className="p-5">
              <span className="text-2xl mb-3 block">{feat.iconEmoji}</span>
              <h3 className="text-sm font-medium mb-1">{feat.title}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{feat.description}</p>
            </CardWrapper>
          ))}
        </div>
      </section>
    );
  }

  // Products section
  sectionMap.products = (
    <section id="products" className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-4 h-4" style={{ color: brandColor }} />
        <h2 className={`text-lg font-medium ${design.typography === 'bold' ? 'font-black text-xl' : design.typography === 'elegant' ? 'font-light tracking-wide' : ''}`}>
          Products
        </h2>
        <span className="text-xs text-[var(--muted-foreground)]">({products.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <CardWrapper
            key={product.id}
            cardStyle={design.cardStyle}
            className="overflow-hidden group hover:border-[var(--border)] transition-colors"
          >
            <div
              className="h-36 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${brandColor}08, ${business.secondaryColor || brandColor}08)` }}
            >
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {product.imageEmoji}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium">{product.title}</h3>
                <span className="text-sm font-semibold ml-2">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)] mb-2">{product.category}</p>
              <p className="text-xs text-[var(--muted)] line-clamp-2 mb-4">{product.description}</p>
              <button
                onClick={() => setCheckoutProduct(product)}
                className="w-full flex items-center justify-center gap-1.5 py-2 font-medium text-xs text-white transition-colors hover:opacity-90"
                style={{
                  backgroundColor: brandColor,
                  borderRadius: design.cardStyle === 'pill' ? '9999px' : design.cardStyle === 'sharp' ? '0' : '8px',
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Buy now
              </button>
            </div>
          </CardWrapper>
        ))}
      </div>
    </section>
  );

  // Testimonials section
  if (design.showTestimonials && landingPage?.testimonials && landingPage.testimonials.length > 0) {
    sectionMap.testimonials = (
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className={`text-lg font-medium text-center mb-8 ${design.typography === 'bold' ? 'font-black text-2xl' : design.typography === 'elegant' ? 'font-light tracking-wide' : ''}`}>
          What customers say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {landingPage.testimonials.map((test, idx) => (
            <CardWrapper key={idx} cardStyle={design.cardStyle} className="p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[var(--muted)] italic leading-relaxed mb-3">
                &ldquo;{test.quote}&rdquo;
              </p>
              <div>
                <p className="text-xs font-medium">{test.author}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">{test.role}</p>
              </div>
            </CardWrapper>
          ))}
        </div>
      </section>
    );
  }

  // About section
  if (design.showAbout) {
    sectionMap.about = (
      <section className="max-w-3xl mx-auto px-6 py-16">
        <CardWrapper cardStyle={design.cardStyle} className="p-6 text-center">
          <span className="text-3xl mb-3 block">{business.logoEmoji}</span>
          <h2 className={`text-base font-medium mb-2 ${design.typography === 'bold' ? 'font-black text-lg' : design.typography === 'elegant' ? 'font-light tracking-wide' : ''}`}>
            About {business.name}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-lg mx-auto mb-3">
            {business.aboutText}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] italic">&ldquo;{business.valueProp}&rdquo;</p>
        </CardWrapper>
      </section>
    );
  }

  // FAQ section
  if (design.showFaqs && landingPage?.faqs && landingPage.faqs.length > 0) {
    sectionMap.faqs = (
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className={`text-lg font-medium text-center mb-8 ${design.typography === 'bold' ? 'font-black text-2xl' : design.typography === 'elegant' ? 'font-light tracking-wide' : ''}`}>
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-2">
          {landingPage.faqs.map((faq, idx) => (
            <CardWrapper key={idx} cardStyle={design.cardStyle} className="overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium pr-4">{faq.question}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </CardWrapper>
          ))}
        </div>
      </section>
    );
  }

  // Render sections in AI-determined order
  const sectionsToRender = design.sectionOrder.filter((s) => sectionMap[s]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Nav */}
      <nav className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-xl">{business.logoEmoji}</span>
            <span className="text-sm font-semibold">{business.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brandColor }} />
              {business.secondaryColor && (
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: business.secondaryColor }} />
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      {landingPage?.hero && (
        <HeroSection
          hero={landingPage.hero}
          brandColor={brandColor}
          secondaryColor={business.secondaryColor}
          layout={design.layout}
          heroBg={design.heroBg}
          typography={design.typography}
          businessName={business.name}
          logoEmoji={business.logoEmoji}
        />
      )}

      {/* Ordered sections */}
      {sectionsToRender.map((sectionKey, idx) => (
        <div key={sectionKey}>
          {idx > 0 && <SectionDivider style={design.dividerStyle} color={brandColor} />}
          {sectionMap[sectionKey]}
        </div>
      ))}

      {/* Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            © 2026 {business.name}. Built with{' '}
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors" style={{ color: brandColor }}>
              BizForge AI
            </Link>
          </p>
        </div>
      </footer>

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          productId={checkoutProduct.id}
          productTitle={checkoutProduct.title}
          price={checkoutProduct.price}
          businessName={business.name}
          brandColor={brandColor}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </div>
  );
}
