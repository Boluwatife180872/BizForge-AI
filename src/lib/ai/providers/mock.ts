import { z } from 'zod';
import { AIProvider, BusinessData, ProductsData, LandingPageData, MarketingData, PageBlockData } from '../types';

export class TemplateMockProvider implements AIProvider {
  name = 'TemplateMock';

  async isHealthy(): Promise<boolean> {
    return true; // Failsafe fallback is always healthy
  }

  // Seedable/Randomized array selector
  private selectRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private hashSeed(input: string): number {
    let hash = 0;
    for (let index = 0; index < input.length; index += 1) {
      hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
    }
    return Math.abs(hash);
  }

  private pickBySeed<T>(arr: readonly T[], seed: number, offset = 0): T {
    return arr[(seed + offset) % arr.length];
  }

  private rotateBySeed<T>(arr: readonly T[], seed: number): T[] {
    const start = seed % arr.length;
    return [...arr.slice(start), ...arr.slice(0, start)];
  }

  // Map user prompt keywords to an industry category
  private detectIndustry(prompt: string): 'saas' | 'beauty' | 'food' | 'coaching' | 'crafts' {
    const p = prompt.toLowerCase();
    if (p.includes('software') || p.includes('app') || p.includes('saas') || p.includes('tech') || p.includes('platform') || p.includes('tool') || p.includes('system')) {
      return 'saas';
    }
    if (p.includes('skin') || p.includes('cosmetic') || p.includes('beauty') || p.includes('makeup') || p.includes('spa') || p.includes('soap') || p.includes('hair')) {
      return 'beauty';
    }
    if (p.includes('food') || p.includes('coffee') || p.includes('restaurant') || p.includes('cafe') || p.includes('bake') || p.includes('tea') || p.includes('bites') || p.includes('drink') || p.includes('cook')) {
      return 'food';
    }
    if (p.includes('coach') || p.includes('fit') || p.includes('train') || p.includes('gym') || p.includes('learn') || p.includes('teach') || p.includes('course') || p.includes('class')) {
      return 'coaching';
    }
    return 'crafts'; // Default fallback
  }

  // Detect semantic branding tone based on prompt
  private detectTone(prompt: string): 'luxury' | 'casual' | 'premium' | 'local' | 'tech' {
    const p = prompt.toLowerCase();
    if (p.includes('lagos') || p.includes('nairobi') || p.includes('africa') || p.includes('local') || p.includes('community') || p.includes('home')) {
      return 'local';
    }
    if (p.includes('luxury') || p.includes('exclusive') || p.includes('boutique') || p.includes('high-end') || p.includes('artisan')) {
      return 'luxury';
    }
    if (p.includes('tech') || p.includes('ai') || p.includes('fast') || p.includes('digital') || p.includes('automation')) {
      return 'tech';
    }
    if (p.includes('casual') || p.includes('fun') || p.includes('simple') || p.includes('easy') || p.includes('everyday')) {
      return 'casual';
    }
    return 'premium'; // Default
  }

  // Dynamic Brand Generator
  private generateBrandDetails(industry: string, tone: string, prompt: string) {
    const prefixes = {
      saas: ['Apex', 'Cloud', 'Pulse', 'Sync', 'Vertex', 'Nova', 'Grid', 'Flow', 'Byte', 'Logic'],
      beauty: ['Aura', 'Bloom', 'Lume', 'Glow', 'Silk', 'Pure', 'Oasis', 'Iris', 'Rose', 'Velvet'],
      food: ['Daily', 'Urban', 'Lagos', 'Nectar', 'Craving', 'Sweet', 'Spice', 'Java', 'Bakers', 'Taste'],
      coaching: ['Peak', 'Elevate', 'Core', 'Vigor', 'Mind', 'Stride', 'Active', 'Fit', 'Zenith', 'Focus'],
      crafts: ['Terra', 'Artisan', 'Clay', 'Weave', 'Timber', 'Hearth', 'Rustic', 'Sole', 'Maker', 'Native'],
    }[industry as 'saas' | 'beauty' | 'food' | 'coaching' | 'crafts'] || ['Core', 'Nova', 'Zenith'];

    const suffixes = {
      saas: ['Sys', 'Flow', 'Link', 'Grid', 'Forge', 'Hub', 'Lab', 'Scale', 'Stack', 'Desk'],
      beauty: ['Care', 'Skin', 'Organics', 'Studio', 'Bar', 'Lab', 'Essence', 'Aesthetics', 'Bloom', 'Glow'],
      food: ['Bites', 'Cafe', 'Roasters', 'Kitchen', 'Hub', 'Bakehouse', 'Diner', 'Express', 'Platter', 'Bar'],
      coaching: ['Coaching', 'Academy', 'Fit', 'Performance', 'Mindset', 'Lab', 'Hub', 'Club', 'Group', 'Pro'],
      crafts: ['Studio', 'Workshop', 'Handmade', 'Goods', 'Co', 'Collective', 'Works', 'Forge', 'Atelier', 'Designs'],
    }[industry as 'saas' | 'beauty' | 'food' | 'coaching' | 'crafts'] || ['Hub', 'Co', 'Group'];

    const seed = this.hashSeed(`${industry}:${tone}:${prompt}`);
    const prefix = this.pickBySeed(prefixes, seed, 1);
    const suffix = this.pickBySeed(suffixes, seed, 3);
    const name = `${prefix}${suffix}`;

    // Brand Colors mapping (Hex codes)
    const palettes = {
      luxury: { primary: '#1e1b4b', secondary: '#b45309' }, // Dark Indigo & Amber
      casual: { primary: '#0f766e', secondary: '#f59e0b' }, // Teal & Amber
      premium: { primary: '#0f172a', secondary: '#3b82f6' }, // Slate & Blue
      local: { primary: '#7c2d12', secondary: '#ea580c' }, // Rust & Orange
      tech: { primary: '#030712', secondary: '#10b981' }, // Near-black & Emerald
    }[tone as 'luxury' | 'casual' | 'premium' | 'local' | 'tech'];

    const logoEmojis = {
      saas: ['⚡', '💻', '🚀', '📊', '🛠️'],
      beauty: ['🧴', '✨', '🌸', '🌿', '💧'],
      food: ['☕', '🥗', '🍪', '🥐', '🍔'],
      coaching: ['🏋️', '🧠', '🎓', '🎯', '📈'],
      crafts: ['🏺', '🧶', '🎨', '🔨', '🪵'],
    }[industry as 'saas' | 'beauty' | 'food' | 'coaching' | 'crafts'] || ['📦'];

    return {
      name,
      brandColor: palettes.primary,
      secondaryColor: palettes.secondary,
      logoEmoji: this.pickBySeed(logoEmojis, seed, 5),
    };
  }

  // Core generator dispatcher
  async generate<T>(
    type: 'business' | 'products' | 'landing_page' | 'marketing',
    prompt: string,
    schema: z.ZodSchema<T>,
    _systemPrompt: string
  ): Promise<T> {
    const industry = this.detectIndustry(prompt);
    const tone = this.detectTone(prompt);
    const brand = this.generateBrandDetails(industry, tone, prompt);

    let result: unknown;

    if (type === 'business') {
      const taglines = {
        saas: `Automate your workflow in seconds.`,
        beauty: `Nourish your skin with clean ingredients.`,
        food: `Fresh, delicious meals delivered hot.`,
        coaching: `Unlock your full potential today.`,
        crafts: `Bespoke artisanal items crafted with love.`,
      }[industry];

      const valueProps = {
        saas: `The modern, all-in-one software platform that eliminates manual spreadsheet management and speeds up delivery times by 40%.`,
        beauty: `Ditch the chemical-heavy products. Our line provides organic skin rejuvenation that brings out your natural glow without irritation.`,
        food: `Enjoy authentic, locally sourced recipes cooked by expert chefs, delivered directly to your doorstep in premium, eco-friendly packaging.`,
        coaching: `Transform your career, fitness, or personal life through goal-oriented 1-on-1 coaching structured for busy high-achievers.`,
        crafts: `Bring warmth to your home with handcrafted pieces built by local artisans using sustainable, high-grade materials.`,
      }[industry];

      const abouts = {
        saas: `We started this platform because we were tired of tools that take weeks of training to use. Our team of software designers built this to be robust, clean, and blazingly fast.`,
        beauty: `Founded by certified herbalists, we formulate everything in-house in small batches. We believe that what goes on your body is just as important as what goes in it.`,
        food: `We are passionate about good food. By partnering with local farmers, we ensure our kitchen receives the freshest seasonal produce while supporting our local community.`,
        coaching: `With over a decade of industry mentorship experience, we design custom frameworks that fit your lifestyle. We don't believe in generic templates; we build paths that adapt to you.`,
        crafts: `Every single object in our collection has a story. Hand-spun, hand-carved, and curated carefully, we celebrate traditional craftsmanship in a modern world.`,
      }[industry];

      const bizData: BusinessData = {
        name: brand.name,
        niche: industry,
        tagline: taglines,
        brandColor: brand.brandColor,
        secondaryColor: brand.secondaryColor,
        logoEmoji: brand.logoEmoji,
        valueProp: valueProps,
        aboutText: abouts,
        tone: tone,
      };
      result = bizData;

    } else if (type === 'products') {
      const productsList = {
        saas: [
          { title: 'Starter Suite', price: 19.00, description: 'Essential dashboard analytics and automated data sync for up to 3 team members.', category: 'Software Plans', imageEmoji: '⚙️' },
          { title: 'Growth Engine', price: 49.00, description: 'Advanced integrations, reports customization, and dedicated support for growing teams.', category: 'Software Plans', imageEmoji: '📈' },
          { title: 'Enterprise Core', price: 149.00, description: 'Unlimited workspaces, API access, custom SSO security, and a dedicated account rep.', category: 'Software Plans', imageEmoji: '🏢' },
        ],
        beauty: [
          { title: 'Hydrating Face Serum', price: 28.00, description: 'Infused with cold-pressed rosehip seed oil and hyaluronic acid for deep nightly recovery.', category: 'Skincare', imageEmoji: '💧' },
          { title: 'Purifying Clay Mask', price: 22.00, description: 'French green clay and organic tea tree extract to deeply cleanse and tighten pores.', category: 'Skincare', imageEmoji: '🧼' },
          { title: 'Essential Glow Oil', price: 35.00, description: 'A lightweight daily elixir of jojoba oil and vitamin E for a bright, non-greasy finish.', category: 'Skincare', imageEmoji: '✨' },
        ],
        food: [
          { title: 'Artisan Roast Box', price: 18.50, description: 'Whole-bean coffee roasted locally in small batches. 500g bag, rich hazelnut notes.', category: 'Pantry', imageEmoji: '☕' },
          { title: 'Classic Breakfast Hamper', price: 25.00, description: 'Fresh sourdough loaf, two buttery croissants, handmade strawberry jam, and cold brew bottle.', category: 'Meals', imageEmoji: '🥐' },
          { title: 'Gourmet Lunch Platter', price: 15.00, description: 'Grilled chicken avocado bowl with organic quinoa, roasted sweet potato, and sesame dressing.', category: 'Meals', imageEmoji: '🥗' },
        ],
        coaching: [
          { title: '1-on-1 Strategy Call', price: 75.00, description: 'A highly focused 60-minute session to audit your current system, roadmap targets, and outline an action plan.', category: 'Consulting', imageEmoji: '📞' },
          { title: 'Monthly Mentorship Program', price: 199.00, description: 'Weekly strategy sessions, direct chat support, and ongoing review of your business/fitness metrics.', category: 'Coaching Packages', imageEmoji: '🎯' },
          { title: 'Implementation Masterclass', price: 99.00, description: 'Lifetime access to our complete video lecture vault, workbook resources, and private student community.', category: 'Courses', imageEmoji: '🎓' },
        ],
        crafts: [
          { title: 'Hand-Thrown Ceramic Mug', price: 32.00, description: 'Meticulously crafted from local clay, featuring a textured oatmeal glaze. Dishwasher safe.', category: 'Kitchenware', imageEmoji: '🏺' },
          { title: 'Artisanal Woven Blanket', price: 85.00, description: 'Soft, heavy-weight organic cotton throw, hand-woven using traditional geometric patterns.', category: 'Home Goods', imageEmoji: '🧶' },
          { title: 'Minimalist Wooden Bowl', price: 45.00, description: 'Hand-turned from fallen wild olive wood. Polished with food-safe organic beeswax.', category: 'Kitchenware', imageEmoji: '🪵' },
        ],
      }[industry];

      const prodData: ProductsData = {
        products: productsList,
      };
      result = prodData;

    } else if (type === 'landing_page') {
      const seed = this.hashSeed(`${prompt}:${brand.name}:${tone}`);

      const heroTitles = {
        saas: [
          { title: `Scale your operations without the friction`, subtitle: `Get the cloud infrastructure that grows alongside your business, giving your team power and simplicity.` },
          { title: `Build faster. Ship smarter.`, subtitle: `The platform that turns complex workflows into simple, automated pipelines for modern teams.` },
          { title: `Your data, finally working for you`, subtitle: `Stop wrestling with spreadsheets. Start making decisions backed by real-time analytics.` },
        ],
        beauty: [
          { title: `Nature's best ingredients for radiant skin`, subtitle: `Handmade organic formulations designed to replenish, hydrate, and maintain your skin's natural balance.` },
          { title: `Clean beauty that actually works`, subtitle: `Plant-powered skincare crafted in small batches for visible, lasting results.` },
          { title: `Glow from the inside out`, subtitle: `Ethically sourced, toxin-free formulas that respect your skin and the planet.` },
        ],
        food: [
          { title: `Everyday dining, elevated to gourmet quality`, subtitle: `Enjoy wholesome, nutrient-rich meals sourced from local fields and delivered straight to your table.` },
          { title: `Real food, real fast`, subtitle: `Chef-prepared meals made from scratch with locally sourced ingredients, delivered hot.` },
          { title: `Farm fresh, table ready`, subtitle: `Skip the grocery run. Get seasonal, wholesome meals delivered in eco-friendly packaging.` },
        ],
        coaching: [
          { title: `Transform your ambition into clear results`, subtitle: `Empowering entrepreneurs and professionals through practical, structure-driven 1-on-1 strategy.` },
          { title: `Stop guessing. Start growing.`, subtitle: `Custom frameworks and accountability systems designed for high-achievers who want measurable progress.` },
          { title: `Your next level is one decision away`, subtitle: `Structured coaching that bridges the gap between where you are and where you want to be.` },
        ],
        crafts: [
          { title: `Artisanal goods built to last generations`, subtitle: `We compile handmade home designs that fuse utility, sustainable wood/clay, and timeless heritage.` },
          { title: `Crafted by hand. Made for life.`, subtitle: `Traditional techniques meet modern design in every piece from our workshop.` },
          { title: `Objects with soul and story`, subtitle: `Each piece is shaped by hand using sustainable materials and time-honored methods.` },
        ],
      }[industry];

      const featureLists = {
        saas: [
          [
            { title: 'Lightning Fast Setup', description: 'Integrate your workflows in under 5 minutes without writing a single line of complex code.', iconEmoji: '⚡' },
            { title: 'Real-Time Dashboard', description: 'Monitor usage metrics, compile reports, and track team changes inside a unified dashboard.', iconEmoji: '📊' },
            { title: 'Military-Grade Security', description: 'Your data is locked tight with standard end-to-end encryption protocols and automated cloud backups.', iconEmoji: '🔒' },
          ],
          [
            { title: 'No-Code Automations', description: 'Build complex triggers and actions visually. No engineering team required.', iconEmoji: '🔧' },
            { title: 'Team Collaboration', description: 'Shared workspaces, role-based access, and real-time commenting built in from day one.', iconEmoji: '👥' },
            { title: 'API-First Design', description: 'Connect any tool in your stack with our RESTful API and pre-built webhooks.', iconEmoji: '🔗' },
          ],
          [
            { title: 'Instant Analytics', description: 'Auto-generated insights and visual reports that surface what matters most.', iconEmoji: '📈' },
            { title: 'Zero Downtime', description: 'Enterprise-grade infrastructure with 99.99% uptime SLA and global CDN.', iconEmoji: '🌐' },
            { title: 'Dedicated Support', description: 'Priority access to our solutions team with guaranteed response under 2 hours.', iconEmoji: '🎧' },
          ],
        ],
        beauty: [
          [
            { title: '100% Organic Sourcing', description: 'We source every plant extract, oil, and clay from certified sustainable organic farms.', iconEmoji: '🌿' },
            { title: 'Zero Toxins or Fillers', description: 'Absolutely no parabens, synthetic fragrances, or harsh chemical additives. Pure skincare.', iconEmoji: '✨' },
            { title: 'Cruelty-Free Always', description: 'We believe in compassionate care. None of our ingredients are ever tested on animals.', iconEmoji: '🐰' },
          ],
          [
            { title: 'Small-Batch Freshness', description: 'Every serum is mixed by hand in batches of 50 to ensure peak potency and freshness.', iconEmoji: '🧪' },
            { title: 'Dermatologist Tested', description: 'All formulations pass rigorous patch testing and sensitivity screening before launch.', iconEmoji: '🩺' },
            { title: 'Refillable Packaging', description: 'Our glass bottles are designed to be refilled, reducing waste by up to 70%.', iconEmoji: '♻️' },
          ],
          [
            { title: 'Visible Results in 14 Days', description: 'Clinical trials show measurable improvement in hydration and skin texture within two weeks.', iconEmoji: '📅' },
            { title: 'Custom Routine Builder', description: 'Answer a short quiz and get a personalized regimen matched to your skin type.', iconEmoji: '📋' },
            { title: 'Free Skin Consultation', description: 'Book a 15-minute call with our in-house esthetician to optimize your routine.', iconEmoji: '💬' },
          ],
        ],
        food: [
          [
            { title: 'Fresh Daily Preparation', description: 'Our chefs cook every order from scratch in our state-of-the-art, sanitary kitchens.', iconEmoji: '👨‍🍳' },
            { title: 'Farm-to-Fork Sourcing', description: 'We partner directly with family farms to ensure ingredients arrive fresh each morning.', iconEmoji: '🥬' },
            { title: 'Eco-Friendly Pack', description: 'All containers are 100% biodegradable and heat-insulated to preserve flavor and safety.', iconEmoji: '♻️' },
          ],
          [
            { title: '45-Minute Delivery', description: 'From kitchen to your door in under 45 minutes. Hot, fresh, and on time.', iconEmoji: '🚀' },
            { title: 'Allergy-Safe Kitchen', description: 'Dedicated prep zones for gluten-free, nut-free, and dairy-free orders.', iconEmoji: '🛡️' },
            { title: 'Weekly Meal Plans', description: 'Subscribe and get curated weekly menus that rotate seasonally for variety.', iconEmoji: '📆' },
          ],
          [
            { title: 'Chef-Curated Menus', description: 'Rotating seasonal menus designed by classically trained chefs with global influences.', iconEmoji: '🍽️' },
            { title: 'Nutrient-Optimized', description: 'Every meal is macro-balanced and designed by a certified nutritionist.', iconEmoji: '💪' },
            { title: 'Taste Guarantee', description: 'Not happy? We will remake it or refund it. No questions asked.', iconEmoji: '✅' },
          ],
        ],
        coaching: [
          [
            { title: 'Bespoke Blueprinting', description: 'No cookie-cutter outlines. We build blueprints tailored around your specific constraints.', iconEmoji: '📋' },
            { title: 'Weekly Core Checkpoints', description: 'Keep momentum high with weekly video check-ins and performance diagnostics.', iconEmoji: '⏱️' },
            { title: 'Direct Access Channel', description: 'Unlock direct Slack/WhatsApp messenger access to your strategy lead for day-to-day feedback.', iconEmoji: '💬' },
          ],
          [
            { title: 'Goal Mapping System', description: 'A proprietary framework that breaks big goals into weekly actionable milestones.', iconEmoji: '🎯' },
            { title: 'Accountability Partner', description: 'You are never alone. Your coach tracks your progress and nudges you when you slip.', iconEmoji: '🤝' },
            { title: 'Progress Dashboards', description: 'Visual scorecards that show exactly where you are improving and where to focus next.', iconEmoji: '📊' },
          ],
          [
            { title: 'Flexible Scheduling', description: 'Book sessions at times that work for you. Reschedule with 24-hour notice.', iconEmoji: '🗓️' },
            { title: 'Resource Library', description: 'Access our vault of templates, worksheets, and recorded strategy sessions anytime.', iconEmoji: '📚' },
            { title: 'Community Access', description: 'Join a private group of like-minded achievers for peer support and networking.', iconEmoji: '🌟' },
          ],
        ],
        crafts: [
          [
            { title: 'Artisan Crafted', description: 'Every single piece is individual, shaped by hand in our studio with high attention to detail.', iconEmoji: '🏺' },
            { title: 'Sustainable Materials', description: 'We source clay, timber, and cotton locally from ethical, certified green suppliers.', iconEmoji: '🌳' },
            { title: 'Lifetime Durability', description: 'Built with traditional joins and premium finishes, designed to withstand daily use.', iconEmoji: '🛡️' },
          ],
          [
            { title: 'Made to Order', description: 'Each piece is crafted after you order, ensuring freshness and personal attention.', iconEmoji: '✋' },
            { title: 'Custom Commissions', description: 'Want a specific size, color, or pattern? We accept bespoke commissions year-round.', iconEmoji: '🎨' },
            { title: 'Gift-Ready Packaging', description: 'Every order arrives in handmade wrapping with a personal note card included.', iconEmoji: '🎁' },
          ],
          [
            { title: 'Heritage Techniques', description: 'We use methods passed down through generations of artisans in our region.', iconEmoji: '🏛️' },
            { title: 'Natural Finishes', description: 'All glazes, oils, and dyes are plant-based and food-safe where applicable.', iconEmoji: '🌿' },
            { title: 'Repair Guarantee', description: 'If something breaks within a year, we will repair it free of charge.', iconEmoji: '🔧' },
          ],
        ],
      }[industry];

      const testimonialsPool = [
        [
          { quote: `This has completely transformed how our family operates. The quality is unmatched and the setup was instant.`, author: `Abiodun Adeyemi`, role: `Founder, Adeyemi & Co` },
          { quote: `I was skeptical at first, but the results speak for themselves. The attention to detail is absolutely incredible.`, author: `Sarah Jenkins`, role: `Creative Director` },
        ],
        [
          { quote: `Exactly what I was looking for. Clean, professional, and it just works without any hassle.`, author: `Marcus Chen`, role: `Operations Lead` },
          { quote: `The team behind this clearly understands their customers. Every touchpoint feels intentional.`, author: `Priya Nair`, role: `Product Manager` },
        ],
        [
          { quote: `I have tried dozens of alternatives and nothing comes close. This is the real deal.`, author: `David Okafor`, role: `Entrepreneur` },
          { quote: `From onboarding to daily use, everything feels polished and thoughtfully designed.`, author: `Elena Vasquez`, role: `Freelance Designer` },
        ],
      ];

      const faqsList = {
        saas: [
          [
            { question: 'Is there a free trial period?', answer: 'Yes! You can explore all our starter features for 14 days without inputting credit card details.' },
            { question: 'Can I import my existing spreadsheet data?', answer: 'Absolutely. We support CSV, Excel, and database JSON direct uploads with automatic column mapping.' },
            { question: 'How secure is our company information?', answer: 'We encrypt all active connections and file stores using AES-256 standard protocols.' },
          ],
          [
            { question: 'Do you offer team discounts?', answer: 'Yes, teams of 5+ get 20% off. Contact us for enterprise volume pricing.' },
            { question: 'What integrations do you support?', answer: 'We integrate with Slack, Notion, Google Workspace, and 50+ other tools via our API.' },
            { question: 'Can I cancel anytime?', answer: 'Absolutely. No contracts, no hidden fees. Cancel from your dashboard in one click.' },
          ],
        ],
        beauty: [
          [
            { question: 'Are your items suitable for highly sensitive skin?', answer: 'Yes, our formulations are free of synthetic fillers and fragrances, making them incredibly gentle.' },
            { question: 'What is the average shelf life of organic products?', answer: 'Because we avoid synthetic preservatives, we recommend using our serums within 6 months of opening.' },
            { question: 'Do you offer custom batch sets?', answer: 'We do! Get in touch with our studio team for custom wedding, spa, or wholesale batches.' },
          ],
          [
            { question: 'How often should I use the serum?', answer: 'We recommend nightly application after cleansing. A little goes a long way — 3 drops per use.' },
            { question: 'Is shipping carbon neutral?', answer: 'Yes, we offset all shipping emissions and use recycled packaging materials.' },
            { question: 'Can I return opened products?', answer: 'If you experience any irritation, we offer full refunds within 30 days no questions asked.' },
          ],
        ],
        food: [
          [
            { question: 'What are your daily delivery hours?', answer: 'We deliver breakfast boxes starting at 7:00 AM, and our kitchen takes lunch/dinner orders until 9:00 PM.' },
            { question: 'Do you accommodate specific food allergies?', answer: 'Yes, you can customize meal platters to exclude dairy, nuts, gluten, or animal products.' },
            { question: 'How far in advance should I order?', answer: 'For standard orders, 45 minutes. For breakfast boxes, please schedule by 8:00 PM the night before.' },
          ],
          [
            { question: 'Do you cater for events?', answer: 'Yes! We offer catering packages for 10-200 guests. Email us for a custom quote.' },
            { question: 'Are portions generous?', answer: 'Every meal is designed to be filling and nutritionally complete. Most customers are fully satisfied.' },
            { question: 'What areas do you deliver to?', answer: 'We currently cover the greater metro area. Check our delivery map at checkout.' },
          ],
        ],
        coaching: [
          [
            { question: 'What background do the coaches have?', answer: 'Our leads have at least 8 years of operational experience scaling digital businesses or training athletes.' },
            { question: 'What if my schedule changes?', answer: 'No problem. You can reschedule any strategy call with 24 hours notice directly through the portal.' },
            { question: 'How is student progress measured?', answer: 'We perform baseline evaluations and compile weekly diagnostic scorecards to track growth.' },
          ],
          [
            { question: 'Do you offer group coaching?', answer: 'Yes, our group cohorts run quarterly with 8-12 members per group for focused attention.' },
            { question: 'What if I am not satisfied?', answer: 'We offer a 30-day money-back guarantee if you do not feel progress after the first month.' },
            { question: 'Can I switch coaches?', answer: 'Absolutely. We want you working with the best fit. Switch anytime at no extra cost.' },
          ],
        ],
        crafts: [
          [
            { question: 'How do I care for hand-made wooden wares?', answer: 'Wash with mild soap and warm water, then dry immediately. Apply food-grade oil monthly.' },
            { question: 'Do you ship fragile ceramics internationally?', answer: 'Yes, we wrap all items in dense biodegradable foam and offer insured international shipping.' },
            { question: 'Can I commission a custom dimensions blanket?', answer: 'Absolutely. Custom weaves take approximately 3 weeks to design and spin. Contact us for rates.' },
          ],
          [
            { question: 'How long does a custom order take?', answer: 'Most custom pieces take 2-4 weeks depending on complexity and current queue.' },
            { question: 'Do you offer wholesale pricing?', answer: 'Yes, retailers and boutiques can apply for our wholesale program with minimum order quantities.' },
            { question: 'Are your pieces food safe?', answer: 'All kitchenware is finished with food-grade, non-toxic sealants certified for daily use.' },
          ],
        ],
      }[industry];

      const storyBodies = {
        saas: [
          `We started this platform because we were tired of tools that take weeks of training to use. Our team built ${brand.name} to feel robust, clean, and fast from the first click.`,
          `After years of watching teams drown in disconnected tools, we decided to build something that actually brings everything together. ${brand.name} is the result.`,
          `Our founding team comes from enterprise software backgrounds. We saw the gap between powerful tools and usable tools, and ${brand.name} bridges it.`,
        ],
        beauty: [
          `Founded around small-batch care, ${brand.name} focuses on ingredients that feel good, look good, and make daily routines easier to trust.`,
          `We started ${brand.name} in a kitchen with a mortar and pestle. Today, we still formulate every product by hand, just at a larger scale.`,
          `Our founder struggled with sensitive skin for years. ${brand.name} was born from the belief that effective skincare should never compromise on safety.`,
        ],
        food: [
          `${brand.name} exists for people who want fresh, dependable flavor without losing time to planning, prep, or compromise.`,
          `We grew up watching our grandparents cook from scratch. ${brand.name} is our way of bringing that same care and quality to busy modern lives.`,
          `What started as a weekend pop-up kitchen became ${brand.name} — a mission to make real, wholesome food accessible to everyone.`,
        ],
        coaching: [
          `${brand.name} was created to turn ambition into repeatable systems, giving clients a practical path from intention to measurable progress.`,
          `After coaching hundreds of professionals, we realized the biggest gap was not talent — it was structure. ${brand.name} fills that gap.`,
          `We built ${brand.name} because we believe everyone deserves a clear roadmap. No fluff, no filler — just focused, actionable guidance.`,
        ],
        crafts: [
          `Every ${brand.name} piece is rooted in material, patience, and daily usefulness, bringing traditional craft into modern homes.`,
          `Our workshop started in a garage with a single pottery wheel. ${brand.name} now ships handmade pieces worldwide, but the ethos remains the same.`,
          `We believe objects should have weight, story, and soul. ${brand.name} is our answer to disposable, mass-produced homeware.`,
        ],
      }[industry];

      const imageShowcaseItems = {
        saas: [
          { title: 'Dashboard View', caption: 'Real-time metrics and team activity in one unified panel.', imageEmoji: '📊' },
          { title: 'Automation Builder', caption: 'Drag-and-drop workflow creation with zero code required.', imageEmoji: '⚙️' },
          { title: 'Integration Hub', caption: 'Connect 50+ tools with pre-built connectors and custom APIs.', imageEmoji: '🔗' },
        ],
        beauty: [
          { title: 'Morning Serum Routine', caption: 'Three drops applied to cleansed skin for all-day hydration.', imageEmoji: '💧' },
          { title: 'Clay Mask Treatment', caption: 'Deep pore cleansing with French green clay and tea tree.', imageEmoji: '🧼' },
          { title: 'Glow Oil Finish', caption: 'Lightweight jojoba and vitamin E elixir for a natural radiance.', imageEmoji: '✨' },
        ],
        food: [
          { title: 'Breakfast Hamper', caption: 'Sourdough, croissants, handmade jam, and cold brew.', imageEmoji: '🥐' },
          { title: 'Lunch Platter', caption: 'Grilled chicken, quinoa, roasted sweet potato, sesame dressing.', imageEmoji: '🥗' },
          { title: 'Artisan Coffee', caption: 'Single-origin beans roasted in small batches daily.', imageEmoji: '☕' },
        ],
        coaching: [
          { title: 'Strategy Session', caption: 'Focused 60-minute audit of your current systems and goals.', imageEmoji: '📞' },
          { title: 'Progress Dashboard', caption: 'Visual scorecards tracking your weekly milestones and KPIs.', imageEmoji: '📈' },
          { title: 'Resource Vault', caption: 'Templates, worksheets, and recorded sessions on demand.', imageEmoji: '📚' },
        ],
        crafts: [
          { title: 'Ceramic Collection', caption: 'Hand-thrown mugs and bowls with organic oatmeal glazes.', imageEmoji: '🏺' },
          { title: 'Woven Textiles', caption: 'Heavy-weight cotton throws in traditional geometric patterns.', imageEmoji: '🧶' },
          { title: 'Wooden Wares', caption: 'Hand-turned bowls from fallen wild olive wood.', imageEmoji: '🪵' },
        ],
      }[industry];

      const pricingPlans = {
        saas: [
          { name: 'Starter', price: '$19/mo', description: 'Essential tools for small teams getting started.', features: ['Up to 3 members', 'Basic analytics', 'Email support'], ctaText: 'Start free trial' },
          { name: 'Growth', price: '$49/mo', description: 'Advanced features for scaling operations.', features: ['Up to 15 members', 'Custom reports', 'Priority support', 'API access'], ctaText: 'Start growth plan' },
          { name: 'Enterprise', price: '$149/mo', description: 'Full power for large organizations.', features: ['Unlimited members', 'SSO & security', 'Dedicated rep', 'Custom integrations'], ctaText: 'Contact sales' },
        ],
        beauty: [
          { name: 'Essentials Kit', price: '$45', description: 'Core trio for a complete daily routine.', features: ['Face serum', 'Clay mask', 'Glow oil'], ctaText: 'Shop essentials' },
          { name: 'Glow Bundle', price: '$78', description: 'Full regimen with bonus travel sizes.', features: ['Full-size serum', 'Full-size mask', 'Travel oil', 'Routine guide'], ctaText: 'Get the bundle' },
          { name: 'Subscription Box', price: '$35/mo', description: 'Monthly curated selection delivered to you.', features: ['3 full-size products', 'Seasonal picks', 'Free shipping', 'Cancel anytime'], ctaText: 'Subscribe now' },
        ],
        food: [
          { name: 'Single Meal', price: '$15', description: 'One chef-prepared meal delivered hot.', features: ['Choice of menu', 'Eco packaging', '45-min delivery'], ctaText: 'Order now' },
          { name: 'Weekly Plan', price: '$65/wk', description: 'Five meals planned and delivered weekly.', features: ['5 meals/week', 'Custom preferences', 'Free delivery', 'Pause anytime'], ctaText: 'Start plan' },
          { name: 'Family Box', price: '$120/wk', description: 'Feeds 4 with variety every day.', features: ['10 meals/week', 'Kid-friendly options', 'Priority delivery', 'Nutrition guide'], ctaText: 'Feed the family' },
        ],
        coaching: [
          { name: 'Single Session', price: '$75', description: 'One focused 60-minute strategy call.', features: ['Goal audit', 'Action plan', 'Follow-up email'], ctaText: 'Book a call' },
          { name: 'Monthly Program', price: '$199/mo', description: 'Weekly sessions with direct chat access.', features: ['4 sessions/mo', 'Slack access', 'Progress tracking', 'Resource vault'], ctaText: 'Join program' },
          { name: 'Masterclass', price: '$99', description: 'Lifetime access to video lecture series.', features: ['Full video vault', 'Workbooks', 'Community access', 'Certificate'], ctaText: 'Enroll now' },
        ],
        crafts: [
          { name: 'Single Piece', price: '$32+', description: 'One handmade item from our collection.', features: ['Handcrafted', 'Gift wrapping', 'Care guide'], ctaText: 'Browse shop' },
          { name: 'Curated Set', price: '$85', description: 'A thoughtfully paired collection of 3 items.', features: ['3 pieces', 'Custom note', 'Free shipping', 'Display guide'], ctaText: 'Get the set' },
          { name: 'Custom Commission', price: '$150+', description: 'Bespoke piece made to your specifications.', features: ['Consultation', 'Custom design', 'Progress updates', 'Lifetime repair'], ctaText: 'Request quote' },
        ],
      }[industry];

      const allBlockTypes = ['feature_grid', 'feature_list', 'social_proof', 'pricing_table', 'cta_banner', 'story_section', 'faq', 'image_showcase'] as const;

      const industryPreferredBlocks: Record<string, readonly (typeof allBlockTypes)[number][]> = {
        saas: ['pricing_table', 'feature_grid', 'social_proof', 'cta_banner', 'faq', 'feature_list'],
        beauty: ['image_showcase', 'story_section', 'social_proof', 'feature_list', 'cta_banner', 'faq'],
        food: ['image_showcase', 'feature_list', 'story_section', 'social_proof', 'faq', 'cta_banner'],
        coaching: ['story_section', 'social_proof', 'cta_banner', 'pricing_table', 'feature_list', 'faq'],
        crafts: ['story_section', 'image_showcase', 'feature_list', 'social_proof', 'faq', 'cta_banner'],
      };

      const preferredBlocks = industryPreferredBlocks[industry];
      const blockCount = 4 + (seed % 3);
      const nonPreferredBlocks = allBlockTypes.filter((b) => !preferredBlocks.slice(0, 4).includes(b));
      const mixedPool = [...preferredBlocks, ...nonPreferredBlocks.slice(0, 2)];

      const selectedBlocks: (typeof allBlockTypes)[number][] = [];
      const poolCopy = [...mixedPool];
      for (let i = 0; i < blockCount && poolCopy.length > 0; i++) {
        const idx = (seed + i * 7 + i * i * 3) % poolCopy.length;
        selectedBlocks.push(poolCopy.splice(idx, 1)[0]);
      }
      while (selectedBlocks.length < 4) {
        const fallback = allBlockTypes[selectedBlocks.length % allBlockTypes.length];
        if (!selectedBlocks.includes(fallback)) {
          selectedBlocks.push(fallback);
        } else {
          selectedBlocks.push(allBlockTypes[(selectedBlocks.length + 3) % allBlockTypes.length]);
        }
      }

      const shuffled = selectedBlocks.map((_, i) => {
        const j = (seed * (i + 1) * 13) % selectedBlocks.length;
        return selectedBlocks[j];
      });
      const uniqueShuffled = [...new Set(shuffled)];
      while (uniqueShuffled.length < 4) {
        const next = allBlockTypes[uniqueShuffled.length % allBlockTypes.length];
        if (!uniqueShuffled.includes(next)) uniqueShuffled.push(next);
        else uniqueShuffled.push(allBlockTypes[(uniqueShuffled.length + 5) % allBlockTypes.length]);
      }

      const heroType = this.pickBySeed(['hero_centered', 'hero_split'] as const, seed, 13);
      const heroVariant = this.pickBySeed(heroTitles, seed, 17);
      const featureVariant = this.pickBySeed(featureLists, seed, 19);
      const testimonialVariant = this.pickBySeed(testimonialsPool, seed, 23);
      const faqVariant = this.pickBySeed(faqsList, seed, 29);
      const storyVariant = this.pickBySeed(storyBodies, seed, 31);

      const pageBlocks = [
        {
          type: heroType,
          data: {
            title: heroVariant.title,
            subtitle: heroVariant.subtitle,
            ctaText: this.pickBySeed(['Get Started Now', 'Explore offers', 'Shop now', 'Book a call', 'View collection'] as const, seed, 37),
          },
        },
        ...uniqueShuffled.slice(0, blockCount - 1).map((blockType, offset) => {
          if (blockType === 'feature_grid' || blockType === 'feature_list') {
            return {
              type: blockType,
              data: {
                heading: this.pickBySeed(['Built around what matters', 'What makes it work', 'Why it stands out', 'Core advantages', 'Key benefits'] as const, seed, 41 + offset),
                features: featureVariant,
              },
            };
          }
          if (blockType === 'social_proof') {
            return {
              type: blockType,
              data: {
                heading: this.pickBySeed(['Customer proof', 'What people say', 'Trusted by many', 'Real stories', 'Voices from the community'] as const, seed, 51 + offset),
                items: testimonialVariant,
              },
            };
          }
          if (blockType === 'pricing_table') {
            return {
              type: blockType,
              data: {
                heading: this.pickBySeed(['Choose your starting point', 'Find your fit', 'Plans that scale', 'Pick your path', 'Simple pricing'] as const, seed, 61 + offset),
                plans: pricingPlans,
              },
            };
          }
          if (blockType === 'cta_banner') {
            return {
              type: blockType,
              data: {
                title: this.pickBySeed([`Start with ${brand.name} today`, `Ready to take the next step?`, `Join thousands who already did`, `Your journey starts here`] as const, seed, 71 + offset),
                subtitle: this.pickBySeed([`Pick the offer that fits your goal and move from idea to action.`, `No commitment required. Explore what we have to offer.`, `Take the first step and see the difference for yourself.`] as const, seed, 81 + offset),
                ctaText: this.pickBySeed(['View offers', 'Get started', 'Take the leap', 'Explore now'] as const, seed, 91 + offset),
              },
            };
          }
          if (blockType === 'story_section') {
            return {
              type: blockType,
              data: {
                eyebrow: this.pickBySeed([`${industry} story`, 'Our journey', 'Behind the brand', 'How we got here'] as const, seed, 101 + offset),
                title: this.pickBySeed([`Why ${brand.name} exists`, `The idea behind ${brand.name}`, `What drives us`, `Our mission`] as const, seed, 111 + offset),
                body: storyVariant,
              },
            };
          }
          if (blockType === 'image_showcase') {
            return {
              type: blockType,
              data: {
                heading: this.pickBySeed(['A closer look', 'In detail', 'See it in action', 'Featured highlights'] as const, seed, 121 + offset),
                items: imageShowcaseItems,
              },
            };
          }
          return {
            type: 'faq',
            data: {
              heading: this.pickBySeed(['Common questions', 'Good to know', 'FAQ', 'Questions & answers'] as const, seed, 131 + offset),
              items: faqVariant,
            },
          };
        }),
      ] as PageBlockData[];

      const densityOptions: Array<'airy' | 'balanced' | 'compact'> = ['airy', 'balanced', 'compact'];
      const productLayouts: Array<'grid' | 'stack' | 'magazine'> = ['grid', 'stack', 'magazine'];
      const featureStyles: Array<'cards' | 'bands' | 'checklist'> = ['cards', 'bands', 'checklist'];
      const surfaceStyles: Array<'flat' | 'tinted' | 'contrast'> = ['flat', 'tinted', 'contrast'];
      const navStyles: Array<'minimal' | 'floating' | 'framed'> = ['minimal', 'floating', 'framed'];
      const dividers: Array<'line' | 'accent' | 'ornament' | 'none'> = ['line', 'accent', 'ornament', 'none'];

      const designProfiles = {
        saas: {
          layout: ['split', 'showcase', 'stacked', 'immersive', 'editorial'] as const,
          cardStyle: ['outline', 'shadow', 'soft', 'glass'] as const,
          heroBg: ['grid', 'mesh', 'spotlight', 'duotone', 'paper'] as const,
          typography: ['modern', 'display', 'modern', 'editorial', 'display'] as const,
        },
        beauty: {
          layout: ['editorial', 'immersive', 'stacked', 'split', 'showcase'] as const,
          cardStyle: ['soft', 'glass', 'shadow', 'outline'] as const,
          heroBg: ['paper', 'mesh', 'spotlight', 'duotone', 'grid'] as const,
          typography: ['editorial', 'modern', 'editorial', 'display', 'modern'] as const,
        },
        food: {
          layout: ['showcase', 'split', 'immersive', 'stacked', 'editorial'] as const,
          cardStyle: ['shadow', 'soft', 'outline', 'glass'] as const,
          heroBg: ['duotone', 'mesh', 'grid', 'spotlight', 'paper'] as const,
          typography: ['display', 'modern', 'editorial', 'display', 'modern'] as const,
        },
        coaching: {
          layout: ['stacked', 'editorial', 'split', 'immersive', 'showcase'] as const,
          cardStyle: ['outline', 'soft', 'shadow', 'glass'] as const,
          heroBg: ['spotlight', 'paper', 'mesh', 'grid', 'duotone'] as const,
          typography: ['editorial', 'modern', 'display', 'editorial', 'modern'] as const,
        },
        crafts: {
          layout: ['editorial', 'showcase', 'immersive', 'stacked', 'split'] as const,
          cardStyle: ['soft', 'shadow', 'outline', 'glass'] as const,
          heroBg: ['paper', 'spotlight', 'duotone', 'mesh', 'grid'] as const,
          typography: ['editorial', 'display', 'modern', 'editorial', 'display'] as const,
        },
      }[industry];

      const lpData: LandingPageData = {
        pageBlocks,
        design: {
          layout: this.pickBySeed(designProfiles.layout, seed, 0),
          cardStyle: this.pickBySeed(designProfiles.cardStyle, seed, 1),
          heroBg: this.pickBySeed(designProfiles.heroBg, seed, 2),
          typography: this.pickBySeed(designProfiles.typography, seed, 3),
          density: this.pickBySeed(densityOptions, seed, 4),
          productLayout: this.pickBySeed(productLayouts, seed, 5),
          featureStyle: this.pickBySeed(featureStyles, seed, 6),
          surfaceStyle: this.pickBySeed(surfaceStyles, seed, 7),
          navStyle: this.pickBySeed(navStyles, seed, 8),
          dividerStyle: this.pickBySeed(dividers, seed, 9),
          theme: this.pickBySeed(['studio', 'terminal', 'atelier', 'catalog', 'journal', 'kinetic'] as const, seed, 10),
          heroMedia: this.pickBySeed(['orb', 'device', 'badge', 'pattern', 'stack'] as const, seed, 11),
          ctaStyle: this.pickBySeed(['solid', 'outline', 'split'] as const, seed, 12),
        },
      };
      result = lpData;

    } else if (type === 'marketing') {
      const marketingList = {
        saas: [
          { type: 'email' as const, title: 'Welcome Automation', content: `Hey {Name},\n\nWelcome to ${brand.name}! We built this tool to free you from spreadsheet chaos. In just 5 minutes, you can configure your dashboard and connect your data stream. Let's get started!\n\nBest,\nThe ${brand.name} Team`, platform: 'Email' as const },
          { type: 'ad' as const, title: 'Facebook Launch Ad', content: `Tired of wasting 10 hours a week on manual workflow updates? 📉\n\nMeet ${brand.name}. The next-generation automation hub that links your tools instantly. Get real-time stats and free up your team. Start your 14-day trial today!`, platform: 'Facebook' as const },
          { type: 'post' as const, title: 'Instagram Infographic', content: `Scaling your company shouldn't mean drowning in micro-management. Here are 3 simple ways to automate your pipeline: 1. Set central triggers, 2. Integrate auto-reporting, 3. Connect ${brand.name}. Link in bio! #SaaS #GrowthHack #BusinessAutomation`, platform: 'Instagram' as const },
          { type: 'post' as const, title: 'LinkedIn Authority Post', content: `In modern operations, speed is the ultimate competitive advantage. Many leaders scale headcount when they should be optimizing pipeline systems. At ${brand.name}, we help teams cut manual administration by 40% using automated workflows. What systems are you looking to automate this quarter?`, platform: 'LinkedIn' as const },
        ],
        beauty: [
          { type: 'email' as const, title: 'Welcome Automation', content: `Hello Glow-Getter,\n\nThank you for choosing ${brand.name}. We craft all our serums in small batches using local, sustainable herbs. Our goal is simple: to help you achieve a bright, natural glow without harsh synthetic chemicals. Your skin is about to thank you!\n\nWarmly,\n${brand.name}`, platform: 'Email' as const },
          { type: 'ad' as const, title: 'Facebook Launch Ad', content: `Ditch the chemical fillers. 🌿 Protect your skin with ${brand.name}'s organic, plant-powered facial serums. Hydrate deeply and restore your natural glow. Shop now and save 15% on your first order!`, platform: 'Facebook' as const },
          { type: 'post' as const, title: 'Instagram Self-Care Reels', content: `Step-by-step evening glow routine: 1. Cleanse with warm water, 2. Apply 3 drops of our Hydrating Serum, 3. Massage gently in upward circles. ✨ Simple, clean, and nourishing. Tap link in bio to shop. #OrganicSkin #CleanBeauty #SkinGlow`, platform: 'Instagram' as const },
          { type: 'post' as const, title: 'TikTok Skincare Hack', content: `Replying to @skincaresarah: Why your face oil is leaving you greasy (and how to fix it). Hint: lightweight carrier oils like jojoba. Try our Essential Glow Oil! 🧴✨ #skintok #glowoil #skincareroutine`, platform: 'TikTok' as const },
        ],
        food: [
          { type: 'email' as const, title: 'Welcome Automation', content: `Hey Foodie,\n\nWelcome to the ${brand.name} family! We believe that fast food should still be real, nutrient-rich food. We source from local farms every morning and deliver fresh in insulated, eco-friendly boxes. Here is a voucher for a free drink on us!\n\nEnjoy,\n${brand.name}`, platform: 'Email' as const },
          { type: 'ad' as const, title: 'Facebook Launch Ad', content: `Fresh, delicious lunch platters delivered hot in under 45 minutes! 🥗\n\nNo time to cook? ${brand.name} serves gourmet farm-to-fork meals prepared by professional chefs. Order today and feed your body the nutrients it deserves!`, platform: 'Facebook' as const },
          { type: 'post' as const, title: 'Instagram Food Shot', content: `Crisp sourdough, creamy avocado, and free-range eggs. 🥐 Coffee roasting in the background. The ultimate morning start is waiting for you at ${brand.name}. Tap link in bio to order delivery! #LagosFoodie #FreshEats #BrunchLife`, platform: 'Instagram' as const },
          { type: 'post' as const, title: 'TikTok Kitchen Behind-The-Scenes', content: `How we bake our signature organic croissants every morning starting at 4:00 AM. 🥐🧈 Fresh, flaky, and delicious! #baketok #behindthescenes #freshcroissants`, platform: 'TikTok' as const },
        ],
        coaching: [
          { type: 'email' as const, title: 'Welcome Automation', content: `Hi {Name},\n\nThank you for taking the first step. At ${brand.name}, we don't believe in generic templates. Our goal is to help you build practical, habits-based blueprints that fit your actual lifestyle. Here is a checklist of 3 questions to answer before our strategy call.\n\nTalk soon,\nCoach`, platform: 'Email' as const },
          { type: 'ad' as const, title: 'Facebook Launch Ad', content: `Ambition without structure equals burnout. 📈\n\nStop spinning your wheels. Get a custom, goal-oriented 1-on-1 strategy blueprint with ${brand.name}. Sign up for a strategy call today and unlock your true potential!`, platform: 'Facebook' as const },
          { type: 'post' as const, title: 'Instagram Tip Slide', content: `3 mistakes keeping you from hitting your quarterly targets: 1. Trying to do too much at once, 2. No weekly diagnostic metrics, 3. Not having an external accountability partner. Let's fix this. Link in bio to book a strategy call! #MindsetCoach #BusinessStrategy #CareerGrowth`, platform: 'Instagram' as const },
          { type: 'post' as const, title: 'LinkedIn Growth Story', content: `I see so many talented founders spending 80 hours a week on operations without ever moving the needle. The bottleneck isn't their work ethic—it's their system design. In our Monthly Mentorship program at ${brand.name}, we help leaders transition from 'operator' to 'owner'. What is your biggest operational bottleneck today?`, platform: 'LinkedIn' as const },
        ],
        crafts: [
          { type: 'email' as const, title: 'Welcome Automation', content: `Hello Patron,\n\nWelcome to ${brand.name}. Our workshop is dedicated to preserving traditional craftsmanship in a fast-paced world. Every clay mug, olive bowl, and cotton throw in our shop has been shaped by hand using sustainable materials. We hope these pieces bring warmth to your home!\n\nBest,\n${brand.name}`, platform: 'Email' as const },
          { type: 'ad' as const, title: 'Facebook Launch Ad', content: `Beautiful, hand-thrown ceramics designed for your daily coffee ritual. 🏺\n\nEach ${brand.name} mug is unique, organic, and crafted to last generations. Sustainable clay, local oatmeal glaze. Browse our studio collection now!`, platform: 'Facebook' as const },
          { type: 'post' as const, title: 'Instagram Studio Tour', content: `Quiet mornings in the clay workshop. 🪵 Shaping the new wild-olive bowls on the lathe. Every piece takes time, patience, and love. Shop the new home collection via link in bio! #ArtisanPottery #HandmadeHome #WabiSabi`, platform: 'Instagram' as const },
          { type: 'post' as const, title: 'TikTok Clay Throwing Process', content: `Shaping a hand-thrown ceramic mug on the wheel. Watch the transformation! 🏺✨ #potterytok #claythrowing #handmadegood`, platform: 'TikTok' as const },
        ],
      }[industry];

      const mktData: MarketingData = {
        assets: marketingList,
      };
      result = mktData;
    }

    // Safety parsing check
    const parseResult = schema.safeParse(result);
    if (!parseResult.success) {
      throw new Error(`Mock failed to validate against schema: ${parseResult.error.message}`);
    }

    return parseResult.data;
  }
}
