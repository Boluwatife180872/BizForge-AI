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
        return `You are BizForge AI's branding architect. Generate a cohesive business concept based on the user's prompt.
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
        return `You are BizForge AI's product strategist. Generate between 3 and 5 detailed, highly-relevant products or service tiers based on the business details.
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
        return `You are BizForge AI's UX/UI designer and copywriter. Generate a complete landing page with content AND design decisions.

IMPORTANT: Choose a UNIQUE visual design style for this brand. No two businesses should look the same. Match the design to the brand's tone, industry, and personality.

JSON Structure Contract:
{
  "hero": {
    "title": "Catchy Hero Headline",
    "subtitle": "Supporting subtitle copy expanding the value statement",
    "ctaText": "Call to action button text"
  },
  "features": [
    {
      "title": "Feature Title",
      "description": "How it works or what makes it special",
      "iconEmoji": "Single emoji representing the feature benefit"
    }
  ],
  "testimonials": [
    {
      "quote": "Direct quote praising the products, service speed, or quality.",
      "author": "Full Name",
      "role": "Job Title / Customer Type"
    }
  ],
  "faqs": [
    {
      "question": "Common customer question",
      "answer": "Helpful, clear answer"
    }
  ],
  "design": {
    "layout": "centered" or "split" or "minimal" or "bold",
    "cardStyle": "rounded" or "sharp" or "pill",
    "heroBg": "solid" or "gradient" or "pattern" or "none",
    "typography": "clean" or "elegant" or "bold",
    "dividerStyle": "line" or "dots" or "none",
    "showTestimonials": true or false,
    "showFaqs": true or false,
    "showAbout": true or false,
    "sectionOrder": ["features", "products", "testimonials", "about", "faqs"]
  }
}

Design Guide:
- layout: "centered" = classic centered hero, "split" = two-column hero with text left, "minimal" = sparse lots of whitespace, "bold" = large typography dark backgrounds
- cardStyle: "rounded" = soft rounded cards, "sharp" = no border radius, "pill" = very rounded pill shapes
- heroBg: "solid" = solid brand color bg, "gradient" = gradient bg, "pattern" = dotted/grid pattern bg, "none" = plain bg
- typography: "clean" = modern light, "elegant" = refined sophisticated, "bold" = heavy impactful
- dividerStyle: "line" = thin lines between sections, "dots" = dotted dividers, "none" = no dividers
- sectionOrder: arrange sections in an order that makes sense for this brand. Put the most important sections first.

Note: Generate exactly 3 features, 2 testimonials, and 3 FAQs.
${commonInstructions}`;

      case 'marketing':
        return `You are BizForge AI's growth marketer. Generate a set of 4 marketing assets based on the business details.
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
      if (!lp.features || (lp.features as unknown[]).length < 3) {
        lp.features = [
          { title: 'Quality Assured', description: 'Crafted to the highest professional standards.', iconEmoji: '✨' },
          { title: 'Customer First', description: 'Our support team is active and ready to help 24/7.', iconEmoji: '🤝' },
          { title: 'Eco Friendly', description: 'Built with local, green resources and ethics.', iconEmoji: '🌱' },
        ];
      }
      if (!lp.testimonials || (lp.testimonials as unknown[]).length < 2) {
        lp.testimonials = [
          { quote: 'Absolute game changer. Incredible service and quality.', author: 'John Doe', role: 'Premium Member' },
          { quote: 'Exceeded all my expectations. Will definitely order again.', author: 'Jane Smith', role: 'Verified Client' },
        ];
      }
      if (!lp.faqs || (lp.faqs as unknown[]).length < 3) {
        lp.faqs = [
          { question: 'What is your refund policy?', answer: 'We offer full refunds within 14 days if you are not satisfied.' },
          { question: 'How long does shipping take?', answer: 'Orders are processed immediately and take 3-5 business days.' },
          { question: 'Can I cancel my plan?', answer: 'Yes, you can cancel or downgrade your plan at any time through our portal.' },
        ];
      }
      // Default design tokens if AI didn't generate them
      if (!lp.design) {
        lp.design = {
          layout: 'centered',
          cardStyle: 'rounded',
          heroBg: 'none',
          typography: 'clean',
          dividerStyle: 'line',
          showTestimonials: true,
          showFaqs: true,
          showAbout: true,
          sectionOrder: ['features', 'products', 'testimonials', 'about', 'faqs'],
        };
      }
      return lp;
    }

    if (type === 'marketing') {
      const mkt = { ...obj };
      if (Array.isArray(mkt.assets)) {
        mkt.assets = (mkt.assets as Record<string, unknown>[]).map((a) => {
          const assetType = ['email', 'ad', 'post'].includes(a.type as string) ? a.type : 'post';
          const platform = ['Instagram', 'TikTok', 'Email', 'Facebook', 'LinkedIn'].includes(a.platform as string) ? a.platform : 'Instagram';
          return {
            ...a,
            type: assetType,
            platform,
            content: (a.content as string).trim(),
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
