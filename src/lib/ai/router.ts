import { z } from 'zod';
import { GroqProvider } from './providers/groq';
import { OllamaProvider } from './providers/ollama';
import { TemplateMockProvider } from './providers/mock';

interface ProviderMetrics {
  isHealthy: boolean;
  latencies: number[]; // rolling history of last 5 request latencies in ms
}

interface RouterState {
  providers: {
    Groq: ProviderMetrics;
    Ollama: ProviderMetrics;
    TemplateMock: ProviderMetrics;
  };
  lastChecked: number;
}

// Global state container for Next.js hot-reloads
declare global {
  var globalRouterState: RouterState | undefined;
}

const INITIAL_STATE: RouterState = {
  providers: {
    Groq: { isHealthy: false, latencies: [] },
    Ollama: { isHealthy: false, latencies: [] },
    TemplateMock: { isHealthy: true, latencies: [10] }, // Mock is always healthy and fast
  },
  lastChecked: 0,
};

class AIRouter {
  private state: RouterState;
  private instances: {
    Groq: GroqProvider;
    Ollama: OllamaProvider;
    TemplateMock: TemplateMockProvider;
  };

  constructor() {
    if (!globalThis.globalRouterState) {
      globalThis.globalRouterState = JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    this.state = globalThis.globalRouterState!;

    this.instances = {
      Groq: new GroqProvider(),
      Ollama: new OllamaProvider(),
      TemplateMock: new TemplateMockProvider(),
    };

    // 1. Server Startup Health Check
    this.runFullHealthCheck();

    // 2. Background Refresh Daemon (every 60 seconds)
    if (typeof window === 'undefined') {
      setInterval(() => {
        this.runFullHealthCheck();
      }, 60000);
    }
  }

  // Check health status for all providers
  private async runFullHealthCheck() {
    const groqOk = await this.instances.Groq.isHealthy();
    const ollamaOk = await this.instances.Ollama.isHealthy();

    this.state.providers.Groq.isHealthy = groqOk;
    this.state.providers.Ollama.isHealthy = ollamaOk;
    this.state.providers.TemplateMock.isHealthy = true;
    this.state.lastChecked = Date.now();
  }

  // Pre-call lightweight verification
  private async runPreCallHealthCheck(providerName: 'Groq' | 'Ollama' | 'TemplateMock'): Promise<boolean> {
    if (providerName === 'TemplateMock') return true;
    const provider = this.instances[providerName];
    const ok = await provider.isHealthy();
    this.state.providers[providerName].isHealthy = ok;
    return ok;
  }

  // Record request latency (rolling average of last 5)
  private recordLatency(providerName: 'Groq' | 'Ollama' | 'TemplateMock', durationMs: number) {
    const list = this.state.providers[providerName].latencies;
    list.push(durationMs);
    if (list.length > 5) {
      list.shift();
    }
  }

  // Calculate average latency
  private getAverageLatency(providerName: 'Groq' | 'Ollama' | 'TemplateMock'): number {
    const list = this.state.providers[providerName].latencies;
    if (list.length === 0) return 0;
    const sum = list.reduce((a, b) => a + b, 0);
    return sum / list.length;
  }

  // AI Router Selection Logic
  private async selectProvider(
    _type: 'business' | 'products' | 'landing_page' | 'marketing'
  ): Promise<('Groq' | 'Ollama' | 'TemplateMock')[]> {
    // 3. Evaluate real-time health + latency
    const candidates: ('Groq' | 'Ollama' | 'TemplateMock')[] = ['Groq', 'Ollama', 'TemplateMock'];
    const healthyCandidates: ('Groq' | 'Ollama' | 'TemplateMock')[] = [];

    for (const name of candidates) {
      const isHealthy = await this.runPreCallHealthCheck(name);
      if (isHealthy) {
        healthyCandidates.push(name);
      }
    }

    // Rank healthy providers by priority weights & latency penalty thresholds
    // Groq priority -> Ollama -> Mock
    healthyCandidates.sort((a, b) => {
      const weightA = a === 'Groq' ? 3 : a === 'Ollama' ? 2 : 1;
      const weightB = b === 'Groq' ? 3 : b === 'Ollama' ? 2 : 1;

      const avgLatencyA = this.getAverageLatency(a);
      const avgLatencyB = this.getAverageLatency(b);

      // Latency penalty check: if Groq is over 10s or Ollama is over 25s, drop weight rank
      const penaltyA = (a === 'Groq' && avgLatencyA > 10000) || (a === 'Ollama' && avgLatencyA > 25000) ? 2 : 0;
      const penaltyB = (b === 'Groq' && avgLatencyB > 10000) || (b === 'Ollama' && avgLatencyB > 25000) ? 2 : 0;

      const scoreA = weightA - penaltyA;
      const scoreB = weightB - penaltyB;

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Descending score
      }

      // If scores are equal, sort by actual average latency (ascending)
      return avgLatencyA - avgLatencyB;
    });

    return healthyCandidates.length > 0 ? healthyCandidates : ['TemplateMock'];
  }

  // System Prompts Per Type
  private getSystemPrompt(type: 'business' | 'products' | 'landing_page' | 'marketing'): string {
    const commonInstructions = `
CRITICAL RESPONSE RULES:
1. You MUST output ONLY valid, raw, parseable JSON content matching the requested schema.
2. Do NOT wrap your response in markdown code blocks like \`\`\`json ... \`\`\`. Output raw JSON text.
3. Do NOT include any introduction, explanations, text notes, conversational greetings, or comments.
4. Ensure all JSON field keys match the Zod contract schema exactly.
5. All emoji placeholders must contain a single valid unicode emoji.
`;

    switch (type) {
      case 'business':
        return `You are BizCraft AI's branding architect. Generate a cohesive business concept based on the user's prompt.
JSON Structure Contract:
{
  "name": "Generated Brand Name",
  "niche": "Primary industry/category",
  "tagline": "A short catchy slogan",
  "brandColor": "#HEX_COLOR (primary color matching the branding)",
  "secondaryColor": "#HEX_COLOR (secondary matching palette color)",
  "logoEmoji": "Single emoji for the logo icon",
  "valueProp": "Detailed 1-2 sentence core value proposition description",
  "aboutText": "A paragraph explaining the history, motivation, and passion behind this business.",
  "tone": "One of: luxury, casual, premium, local, tech"
}
${commonInstructions}`;

      case 'products':
        return `You are BizCraft AI's product strategist. Generate between 3 and 5 detailed, highly-relevant products or service tiers based on the business details.
JSON Structure Contract:
{
  "products": [
    {
      "title": "Product Title",
      "price": 49.00,
      "description": "Engaging description explaining product value and inclusions",
      "category": "Product Category/Department",
      "imageEmoji": "Single emoji representing the item"
    }
  ]
}
${commonInstructions}`;

      case 'landing_page':
        return `You are BizCraft AI's UX/UI designer and copywriter. You are designing a landing page using modular blocks.

CRITICAL CREATIVE REQUIREMENT:
You MUST choose a unique combination of page sections for EVERY generation.
You MUST vary layout, block order, and structure per business.
You MUST avoid repeating common SaaS layouts unless the niche truly requires it.
You MUST choose block combinations based on niche, tone, products, and customer intent.
You MUST output ONLY JSON with a "pageBlocks" array.
Each generation must feel like a completely different designer created it.

ANTI-REPETITION RULES:
- Never use the same block sequence twice. Always shuffle the order after the hero.
- Do NOT default to hero + features + testimonials + FAQ. That is the old template.
- Mix and match from ALL available block types. Not every page needs features. Not every page needs FAQ.
- Some pages should lead with story. Some should lead with social proof. Some should lead with pricing.
- If the niche is visual (beauty, food, crafts), prioritize image_showcase and story_section.
- If the niche is transactional (SaaS, coaching), prioritize pricing_table and cta_banner.
- Vary the total block count: sometimes 4 blocks, sometimes 5, sometimes 6 or 7.
- Use different heading copy for each block type. Do not reuse "Why it works" or "Customer proof" every time.

JSON Structure Contract:
{
  "pageBlocks": [
    {
      "type": "hero_centered" or "hero_split" or "feature_grid" or "feature_list" or "social_proof" or "pricing_table" or "cta_banner" or "story_section" or "faq" or "image_showcase",
      "data": {}
    }
  ],
  "design": {
    "layout": "editorial" or "split" or "showcase" or "immersive" or "stacked",
    "cardStyle": "soft" or "outline" or "glass" or "shadow",
    "heroBg": "paper" or "mesh" or "spotlight" or "grid" or "duotone",
    "typography": "modern" or "editorial" or "display",
    "density": "airy" or "balanced" or "compact",
    "productLayout": "grid" or "stack" or "magazine",
    "featureStyle": "cards" or "bands" or "checklist",
    "surfaceStyle": "flat" or "tinted" or "contrast",
    "navStyle": "minimal" or "floating" or "framed",
    "dividerStyle": "line" or "accent" or "ornament" or "none",
    "theme": "studio" or "terminal" or "atelier" or "catalog" or "journal" or "kinetic",
    "heroMedia": "orb" or "device" or "badge" or "pattern" or "stack",
    "ctaStyle": "solid" or "outline" or "split"
  }
}

Block data contracts:
- hero_centered / hero_split data: { "title": string, "subtitle": string, "ctaText": string }
- feature_grid / feature_list data: { "heading": string, "features": [{ "title": string, "description": string, "iconEmoji": "single emoji" }] } with 3-6 features
- social_proof data: { "heading": string, "items": [{ "quote": string, "author": string, "role": string }] } with 2-4 items
- pricing_table data: { "heading": string, "plans": [{ "name": string, "price": string, "description": string, "features": [string], "ctaText": string }] } with 2-4 plans
- cta_banner data: { "title": string, "subtitle": string, "ctaText": string }
- story_section data: { "eyebrow": string, "title": string, "body": string }
- faq data: { "heading": string, "items": [{ "question": string, "answer": string }] } with 3-6 items
- image_showcase data: { "heading": string, "items": [{ "title": string, "caption": string, "imageEmoji": "single emoji" }] } with 3-6 items

Composition rules:
- Generate 4-7 blocks total. Vary the count per generation.
- The first block MUST be either "hero_centered" or "hero_split".
- Do NOT include both hero types in the same page.
- Do NOT include every possible block type. Select a curated subset.
- Randomize block order after the hero. Never use a fixed sequence.
- Different industries MUST produce different page compositions.
- SaaS often benefits from pricing_table + feature_grid + social_proof, but vary the order and do not always include all three.
- Beauty often benefits from image_showcase + story_section + social_proof, but experiment with other combinations.
- Coaching often benefits from story_section + cta_banner + social_proof, but try different arrangements.
- Local/craft/food brands should prefer story/image/showcase blocks over generic feature-heavy SaaS structure.
- Write unique, brand-specific heading copy for every block. Never use generic headings.

Design Guide:
- layout: "editorial" = asymmetrical magazine composition, "split" = clear two-column presentation, "showcase" = product-first gallery feeling, "immersive" = dramatic full-bleed hero, "stacked" = layered blocks with strong rhythm
- cardStyle: "soft" = rounded calm panels, "outline" = crisp framed surfaces, "glass" = translucent layered surfaces, "shadow" = raised editorial cards
- heroBg: "paper" = subtle textured light backdrop, "mesh" = multi-color soft gradients, "spotlight" = radial focus around the message, "grid" = structured pattern, "duotone" = strong two-color contrast
- typography: "modern" = clean geometric sans, "editorial" = serif headline with refined rhythm, "display" = high-impact compressed voice
- density: controls spacing rhythm; use "airy" for luxury/editorial, "compact" for energetic/product-heavy brands
- productLayout: "grid" = classic cards, "stack" = horizontal list, "magazine" = alternating feature tiles
- featureStyle: "cards" = boxed highlights, "bands" = wide strips, "checklist" = lean text-led benefits
- surfaceStyle: "flat" = minimal surfaces, "tinted" = soft color washes, "contrast" = strong dark/light section shifts
- navStyle: "minimal" = simple inline nav, "floating" = translucent floating bar, "framed" = boxed bordered header
- dividerStyle: "line" = thin separators, "accent" = color bars, "ornament" = decorative motif, "none" = no dividers
- theme: "studio" = maker-led creative space, "terminal" = technical command-center, "atelier" = refined luxury craft, "catalog" = commerce-forward collection, "journal" = narrative editorial, "kinetic" = energetic movement-led brand
- heroMedia: choose the dominant visual object in the hero, matched to the brand
- ctaStyle: choose button treatment that fits the brand, not the default every time

Uniqueness rules:
- Avoid generic startup SaaS aesthetics unless the prompt explicitly suggests that direction.
- Deliberately combine layout, typography, spacing, and surface treatment into a distinct art direction.
- Two brands in different niches should not share the same overall visual personality.
- Prefer surprising but usable compositions over safe template-like choices.
- Treat each generation as a fresh design brief, not a fill-in-the-blanks template.
${commonInstructions}`;

      case 'marketing':
        return `You are BizCraft AI's growth marketer. Generate a set of 4 marketing assets based on the business details.
JSON Structure Contract:
{
  "assets": [
    {
      "type": "email" or "ad" or "post",
      "title": "Asset Title (e.g. Welcome Sequence, Launch Ad)",
      "content": "Full copywriting content. Use line breaks \\n for email layout.",
      "platform": "Instagram" or "TikTok" or "Email" or "Facebook" or "LinkedIn"
    }
  ]
}
Note: Generate at least 1 email, 1 ad copy, and 2 social media posts.
${commonInstructions}`;
    }
  }

  // Output Normalization Layer
  private normalizeData(type: string, data: unknown): unknown {
    const obj = data as Record<string, unknown>;
    if (type === 'business') {
      const biz = { ...obj };
      if (!biz.secondaryColor) {
        biz.secondaryColor = this.generateComplementaryColor(biz.brandColor as string);
      }
      biz.name = (biz.name as string).trim();
      biz.tagline = (biz.tagline as string).trim();
      if (!['luxury', 'casual', 'premium', 'local', 'tech'].includes(biz.tone as string)) {
        biz.tone = 'premium';
      }
      return biz;
    }

    if (type === 'products') {
      const prod = { ...obj };
      if (Array.isArray(prod.products)) {
        prod.products = (prod.products as Record<string, unknown>[]).map((p) => ({
          ...p,
          price: typeof p.price === 'number' ? Math.round(p.price * 100) / 100 : 19.99,
          description: (p.description as string).trim(),
        }));
      }
      return prod;
    }

    if (type === 'landing_page') {
      const lp = { ...obj };
      {
      const defaultDesign = {
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
      const rawDesign = (lp.design as Record<string, unknown> | undefined) || {};
      const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => (
        typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback
      );
      lp.design = {
        layout: pick(rawDesign.layout, ['editorial', 'split', 'showcase', 'immersive', 'stacked'] as const, defaultDesign.layout),
        cardStyle: pick(rawDesign.cardStyle, ['soft', 'outline', 'glass', 'shadow'] as const, defaultDesign.cardStyle),
        heroBg: pick(rawDesign.heroBg, ['paper', 'mesh', 'spotlight', 'grid', 'duotone'] as const, defaultDesign.heroBg),
        typography: pick(rawDesign.typography, ['modern', 'editorial', 'display'] as const, defaultDesign.typography),
        density: pick(rawDesign.density, ['airy', 'balanced', 'compact'] as const, defaultDesign.density),
        productLayout: pick(rawDesign.productLayout, ['grid', 'stack', 'magazine'] as const, defaultDesign.productLayout),
        featureStyle: pick(rawDesign.featureStyle, ['cards', 'bands', 'checklist'] as const, defaultDesign.featureStyle),
        surfaceStyle: pick(rawDesign.surfaceStyle, ['flat', 'tinted', 'contrast'] as const, defaultDesign.surfaceStyle),
        navStyle: pick(rawDesign.navStyle, ['minimal', 'floating', 'framed'] as const, defaultDesign.navStyle),
        dividerStyle: pick(rawDesign.dividerStyle, ['line', 'accent', 'ornament', 'none'] as const, defaultDesign.dividerStyle),
        theme: pick(rawDesign.theme, ['studio', 'terminal', 'atelier', 'catalog', 'journal', 'kinetic'] as const, defaultDesign.theme),
        heroMedia: pick(rawDesign.heroMedia, ['orb', 'device', 'badge', 'pattern', 'stack'] as const, defaultDesign.heroMedia),
        ctaStyle: pick(rawDesign.ctaStyle, ['solid', 'outline', 'split'] as const, defaultDesign.ctaStyle),
      };
      const legacyFeatures = Array.isArray(lp.features) ? lp.features as Record<string, unknown>[] : [];
      const legacyTestimonials = Array.isArray(lp.testimonials) ? lp.testimonials as Record<string, unknown>[] : [];
      const legacyFaqs = Array.isArray(lp.faqs) ? lp.faqs as Record<string, unknown>[] : [];
      const fallbackHero = lp.hero as Record<string, unknown> | undefined;
      lp.pageBlocks = Array.isArray(lp.pageBlocks) && lp.pageBlocks.length >= 4 ? lp.pageBlocks : [
        {
          type: 'hero_split',
          data: {
            title: typeof fallbackHero?.title === 'string' ? fallbackHero.title : 'Build something customers remember',
            subtitle: typeof fallbackHero?.subtitle === 'string' ? fallbackHero.subtitle : 'A focused brand experience shaped around your business idea.',
            ctaText: typeof fallbackHero?.ctaText === 'string' ? fallbackHero.ctaText : 'Shop offers',
          },
        },
        {
          type: 'feature_grid',
          data: {
            heading: 'Why it works',
            features: (legacyFeatures.length ? legacyFeatures : [
              { title: 'Distinct offer', description: 'Clear positioning that helps customers understand the value quickly.', iconEmoji: '✨' },
              { title: 'Built for action', description: 'A direct path from interest to purchase without unnecessary friction.', iconEmoji: '⚡' },
              { title: 'Customer focused', description: 'Every section is written around the buyer problem and outcome.', iconEmoji: '🤝' },
            ]).slice(0, 6).map((feature) => ({
              title: typeof feature.title === 'string' ? feature.title : 'Distinct offer',
              description: typeof feature.description === 'string' ? feature.description : 'Clear value for the right customer.',
              iconEmoji: typeof feature.iconEmoji === 'string' ? feature.iconEmoji : '✨',
            })),
          },
        },
        {
          type: 'social_proof',
          data: {
            heading: 'Customer proof',
            items: (legacyTestimonials.length ? legacyTestimonials : [
              { quote: 'The experience felt focused, polished, and easy to trust.', author: 'Jordan Lee', role: 'Early customer' },
              { quote: 'Exactly the kind of offer I was hoping to find.', author: 'Maya Stone', role: 'Verified buyer' },
            ]).slice(0, 4).map((item) => ({
              quote: typeof item.quote === 'string' ? item.quote : 'A polished experience from start to finish.',
              author: typeof item.author === 'string' ? item.author : 'Verified customer',
              role: typeof item.role === 'string' ? item.role : 'Customer',
            })),
          },
        },
        {
          type: 'faq',
          data: {
            heading: 'Questions',
            items: (legacyFaqs.length ? legacyFaqs : [
              { question: 'How do I get started?', answer: 'Choose the offer that fits your goal and complete checkout.' },
              { question: 'Can I ask questions first?', answer: 'Yes, contact the team before purchasing if you need guidance.' },
              { question: 'What happens after purchase?', answer: 'You receive the next steps and support details immediately.' },
            ]).slice(0, 6).map((item) => ({
              question: typeof item.question === 'string' ? item.question : 'How do I get started?',
              answer: typeof item.answer === 'string' ? item.answer : 'Choose the offer that fits your goal.',
            })),
          },
        },
      ];
      return lp;
    }
    }

    if (type === 'marketing') {
      const mkt = { ...obj };
      if (Array.isArray(mkt.assets)) {
        mkt.assets = (mkt.assets as Record<string, unknown>[]).map((a) => {
          const rawType = typeof a.type === 'string' ? a.type.trim().toLowerCase() : '';
          const rawPlatform = typeof a.platform === 'string' ? a.platform.trim().toLowerCase() : '';
          const assetType = ['email', 'ad', 'post'].includes(rawType) ? rawType : 'post';
          const platformMap: Record<string, 'Instagram' | 'TikTok' | 'Email' | 'Facebook' | 'LinkedIn'> = {
            instagram: 'Instagram',
            'instagram post': 'Instagram',
            'instagram reel': 'Instagram',
            'instagram reels': 'Instagram',
            tiktok: 'TikTok',
            'tik tok': 'TikTok',
            email: 'Email',
            newsletter: 'Email',
            facebook: 'Facebook',
            'facebook ad': 'Facebook',
            linkedin: 'LinkedIn',
            'linked in': 'LinkedIn',
            'linkedin post': 'LinkedIn',
          };
          const platform = platformMap[rawPlatform] || 'Instagram';
          return {
            ...a,
            type: assetType,
            platform,
            title: typeof a.title === 'string' ? a.title.trim() : 'Marketing Asset',
            content: typeof a.content === 'string' ? a.content.trim() : '',
          };
        });
      }
      return mkt;
    }

    return obj;
  }

  // Helper: Create a nice secondary color based on primary HEX
  private generateComplementaryColor(hex: string): string {
    try {
      let clean = hex.replace('#', '');
      if (clean.length === 3) {
        clean = clean.split('').map(c => c + c).join('');
      }
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);

      // Invert color components to generate a complementary HEX
      const compR = (255 - r).toString(16).padStart(2, '0');
      const compG = (255 - g).toString(16).padStart(2, '0');
      const compB = (255 - b).toString(16).padStart(2, '0');

      return `#${compR}${compG}${compB}`;
    } catch {
      return '#3b82f6'; // Safe fallback blue
    }
  }

  // Unified endpoint for AI generation
  public async generateContent<T>(
    type: 'business' | 'products' | 'landing_page' | 'marketing',
    prompt: string,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    const providers = await this.selectProvider(type);
    const systemPrompt = this.getSystemPrompt(type);

    // Iterate through healthy providers sorted by dynamic priorities
    for (const providerName of providers) {
      const provider = this.instances[providerName];
      let attempts = 0;
      const maxAttempts = 2; // initial + 1 retry = max 2 execution attempts

      while (attempts < maxAttempts) {
        attempts++;
        const startTime = Date.now();

        try {
          // Execution Call
          const rawOutput = await provider.generate(type, prompt, schema, systemPrompt);
          const duration = Date.now() - startTime;
          this.recordLatency(providerName, duration);

          // 2-Phase Validation & Normalization
          // Zod Validation 1 occurs inside provider.generate.
          // Output Normalization:
          const normalized = this.normalizeData(type, rawOutput);

          // Zod Validation 2 (Safety Check)
          const secondParse = schema.safeParse(normalized as object);
          if (!secondParse.success) {
            throw new Error(`Normalization broke validation contract: ${secondParse.error.message}`);
          }

          return secondParse.data;
        } catch (error) {
          const duration = Date.now() - startTime;
          this.recordLatency(providerName, duration);
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`[AI Router] ${providerName} attempt ${attempts}/${maxAttempts} failed: ${message}`);

          // If attempts are exhausted for this provider, exit the retry loop and try next provider
          if (attempts >= maxAttempts) {
            break;
          }
        }
      }
    }

    // Ultimate Failsafe Fallback: Invoke Mock Provider directly
    console.error('[AI Router] All configured providers failed. Falling back to Mock.');
    const mockOutput = await this.instances.TemplateMock.generate(type, prompt, schema, systemPrompt);
    const normalizedMock = this.normalizeData(type, mockOutput);
    return schema.parse(normalizedMock as object); // Throws if mock doesn't validate
  }
}

// Global Singleton instance export
const routerInstance = new AIRouter();
export default routerInstance;
