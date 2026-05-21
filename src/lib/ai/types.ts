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

export const LandingDesignSchema = z.object({
  layout: z.enum(['editorial', 'split', 'showcase', 'immersive', 'stacked']),
  cardStyle: z.enum(['soft', 'outline', 'glass', 'shadow']),
  heroBg: z.enum(['paper', 'mesh', 'spotlight', 'grid', 'duotone']),
  typography: z.enum(['modern', 'editorial', 'display']),
  density: z.enum(['airy', 'balanced', 'compact']),
  productLayout: z.enum(['grid', 'stack', 'magazine']),
  featureStyle: z.enum(['cards', 'bands', 'checklist']),
  surfaceStyle: z.enum(['flat', 'tinted', 'contrast']),
  navStyle: z.enum(['minimal', 'floating', 'framed']),
  dividerStyle: z.enum(['line', 'accent', 'ornament', 'none']),
  theme: z.enum(['studio', 'terminal', 'atelier', 'catalog', 'journal', 'kinetic']),
  heroMedia: z.enum(['orb', 'device', 'badge', 'pattern', 'stack']),
  ctaStyle: z.enum(['solid', 'outline', 'split']),
});

export type LandingDesignData = z.infer<typeof LandingDesignSchema>;

export const PageBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hero_centered'),
    data: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      ctaText: z.string().min(1),
    }),
  }),
  z.object({
    type: z.literal('hero_split'),
    data: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      ctaText: z.string().min(1),
    }),
  }),
  z.object({
    type: z.literal('feature_grid'),
    data: z.object({
      heading: z.string().min(1).optional(),
      features: z.array(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        iconEmoji: emojiValidation,
      })).min(3).max(6),
    }),
  }),
  z.object({
    type: z.literal('feature_list'),
    data: z.object({
      heading: z.string().min(1).optional(),
      features: z.array(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        iconEmoji: emojiValidation,
      })).min(3).max(6),
    }),
  }),
  z.object({
    type: z.literal('social_proof'),
    data: z.object({
      heading: z.string().min(1).optional(),
      items: z.array(z.object({
        quote: z.string().min(1),
        author: z.string().min(1),
        role: z.string().min(1),
      })).min(2).max(4),
    }),
  }),
  z.object({
    type: z.literal('pricing_table'),
    data: z.object({
      heading: z.string().min(1).optional(),
      plans: z.array(z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        description: z.string().min(1),
        features: z.array(z.string().min(1)).min(2).max(5),
        ctaText: z.string().min(1),
      })).min(2).max(4),
    }),
  }),
  z.object({
    type: z.literal('cta_banner'),
    data: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      ctaText: z.string().min(1),
    }),
  }),
  z.object({
    type: z.literal('story_section'),
    data: z.object({
      eyebrow: z.string().min(1).optional(),
      title: z.string().min(1),
      body: z.string().min(1),
    }),
  }),
  z.object({
    type: z.literal('faq'),
    data: z.object({
      heading: z.string().min(1).optional(),
      items: z.array(z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })).min(3).max(6),
    }),
  }),
  z.object({
    type: z.literal('image_showcase'),
    data: z.object({
      heading: z.string().min(1).optional(),
      items: z.array(z.object({
        title: z.string().min(1),
        caption: z.string().min(1),
        imageEmoji: emojiValidation,
      })).min(3).max(6),
    }),
  }),
]);

export type PageBlockData = z.infer<typeof PageBlockSchema>;

export const LandingPageSchema = z.object({
  pageBlocks: z.array(PageBlockSchema).min(4).max(8),
  design: LandingDesignSchema.optional(),
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
