import { z } from 'zod';

// Safe Unicode emoji regex test
const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

export const emojiValidation = z.string().refine((val) => {
  return emojiRegex.test(val);
}, {
  message: "Must be a valid emoji",
});

export const BusinessSchema = z.object({
  name: z.string().min(1),
  niche: z.string().min(1),
  tagline: z.string().min(1),
  brandColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { message: "Brand color must be a valid hex code" }),
  secondaryColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { message: "Secondary color must be a valid hex code" }).optional(),
  logoEmoji: emojiValidation,
  valueProp: z.string().min(1),
  aboutText: z.string().min(1),
  tone: z.enum(['luxury', 'casual', 'premium', 'local', 'tech']),
});

export type BusinessData = z.infer<typeof BusinessSchema>;

export const ProductItemSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  category: z.string().min(1),
  imageEmoji: emojiValidation,
});

export type ProductItemData = z.infer<typeof ProductItemSchema>;

export const ProductsSchema = z.object({
  products: z.array(ProductItemSchema).min(3).max(10),
});

export type ProductsData = z.infer<typeof ProductsSchema>;

export const LandingPageSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    ctaText: z.string().min(1),
  }),
  features: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    iconEmoji: emojiValidation,
  })).min(3),
  testimonials: z.array(z.object({
    quote: z.string().min(1),
    author: z.string().min(1),
    role: z.string().min(1),
  })).min(2),
  faqs: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(3),
  design: z.object({
    layout: z.enum(['centered', 'split', 'minimal', 'bold']),
    cardStyle: z.enum(['rounded', 'sharp', 'pill']),
    heroBg: z.enum(['solid', 'gradient', 'pattern', 'none']),
    typography: z.enum(['clean', 'elegant', 'bold']),
    dividerStyle: z.enum(['line', 'dots', 'none']),
    showTestimonials: z.boolean(),
    showFaqs: z.boolean(),
    showAbout: z.boolean(),
    sectionOrder: z.array(z.enum(['features', 'products', 'testimonials', 'about', 'faqs'])),
  }).optional(),
});

export type LandingPageData = z.infer<typeof LandingPageSchema>;

export const MarketingAssetItemSchema = z.object({
  type: z.enum(['email', 'ad', 'post']),
  title: z.string().min(1),
  content: z.string().min(1),
  platform: z.enum(['Instagram', 'TikTok', 'Email', 'Facebook', 'LinkedIn']),
});

export type MarketingAssetItemData = z.infer<typeof MarketingAssetItemSchema>;

export const MarketingSchema = z.object({
  assets: z.array(MarketingAssetItemSchema).min(4),
});

export type MarketingData = z.infer<typeof MarketingSchema>;

// Standard interface for all AI providers
export interface AIProvider {
  name: string;
  isHealthy(): Promise<boolean>;
  generate<T>(
    type: 'business' | 'products' | 'landing_page' | 'marketing',
    prompt: string,
    schema: z.ZodSchema<T>,
    systemPrompt: string
  ): Promise<T>;
}
