import { z } from 'zod';
import { AIProvider, BusinessData, ProductsData, LandingPageData, MarketingData } from '../types';

export class TemplateMockProvider implements AIProvider {
  name = 'TemplateMock';

  async isHealthy(): Promise<boolean> {
    return true; // Failsafe fallback is always healthy
  }

  // Seedable/Randomized array selector
  private selectRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private selectRandomMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
  private generateBrandDetails(industry: string, tone: string) {
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

    const prefix = this.selectRandom(prefixes);
    const suffix = this.selectRandom(suffixes);
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
      logoEmoji: this.selectRandom(logoEmojis),
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
    const brand = this.generateBrandDetails(industry, tone);

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
      const heroTitles = {
        saas: { title: `Scale your operations without the friction`, subtitle: `Get the cloud infrastructure that grows alongside your business, giving your team power and simplicity.` },
        beauty: { title: `Nature's best ingredients for radiant skin`, subtitle: `Handmade organic formulations designed to replenish, hydrate, and maintain your skin's natural balance.` },
        food: { title: `Everyday dining, elevated to gourmet quality`, subtitle: `Enjoy wholesome, nutrient-rich meals sourced from local fields and delivered straight to your table.` },
        coaching: { title: `Transform your ambition into clear results`, subtitle: `Empowering entrepreneurs and professionals through practical, structure-driven 1-on-1 strategy.` },
        crafts: { title: `Artisanal goods built to last generations`, subtitle: `We compile handmade home designs that fuse utility, sustainable wood/clay, and timeless heritage.` },
      }[industry];

      const featureLists = {
        saas: [
          { title: 'Lightning Fast Setup', description: 'Integrate your workflows in under 5 minutes without writing a single line of complex code.', iconEmoji: '⚡' },
          { title: 'Real-Time Dashboard', description: 'Monitor usage metrics, compile reports, and track team changes inside a unified dashboard.', iconEmoji: '📊' },
          { title: 'Military-Grade Security', description: 'Your data is locked tight with standard end-to-end encryption protocols and automated cloud backups.', iconEmoji: '🔒' },
        ],
        beauty: [
          { title: '100% Organic Sourcing', description: 'We source every plant extract, oil, and clay from certified sustainable organic farms.', iconEmoji: '🌿' },
          { title: 'Zero Toxins or Fillers', description: 'Absolutely no parabens, synthetic fragrances, or harsh chemical additives. Pure skincare.', iconEmoji: '✨' },
          { title: 'Cruelty-Free Always', description: 'We believe in compassionate care. None of our ingredients are ever tested on animals.', iconEmoji: '🐰' },
        ],
        food: [
          { title: 'Fresh Daily Preparation', description: 'Our chefs cook every order from scratch in our state-of-the-art, sanitary kitchens.', iconEmoji: '👨‍🍳' },
          { title: 'Farm-to-Fork Sourcing', description: 'We partner directly with family farms to ensure ingredients arrive fresh each morning.', iconEmoji: '🥬' },
          { title: 'Eco-Friendly Pack', description: 'All containers are 100% biodegradable and heat-insulated to preserve flavor and safety.', iconEmoji: '♻️' },
        ],
        coaching: [
          { title: 'Bespoke Blueprinting', description: 'No cookie-cutter outlines. We build blueprints tailored around your specific constraints.', iconEmoji: '📋' },
          { title: 'Weekly Core Checkpoints', description: 'Keep momentum high with weekly video check-ins and performance diagnostics.', iconEmoji: '⏱️' },
          { title: 'Direct Access Channel', description: 'Unlock direct Slack/WhatsApp messenger access to your strategy lead for day-to-day feedback.', iconEmoji: '💬' },
        ],
        crafts: [
          { title: 'Artisan Crafted', description: 'Every single piece is individual, shaped by hand in our studio with high attention to detail.', iconEmoji: '🏺' },
          { title: 'Sustainable Materials', description: 'We source clay, timber, and cotton locally from ethical, certified green suppliers.', iconEmoji: '🌳' },
          { title: 'Lifetime Durability', description: 'Built with traditional joins and premium finishes, designed to withstand daily use.', iconEmoji: '🛡️' },
        ],
      }[industry];

      const testimonialsList = [
        { quote: `This has completely transformed how our family operates. The quality is unmatched and the setup was instant.`, author: `Abiodun Adeyemi`, role: `Founder, Adeyemi & Co` },
        { quote: `I was skeptical at first, but the results speak for themselves. The attention to detail is absolutely incredible.`, author: `Sarah Jenkins`, role: `Creative Director` },
      ];

      const faqsList = {
        saas: [
          { question: 'Is there a free trial period?', answer: 'Yes! You can explore all our starter features for 14 days without inputting credit card details.' },
          { question: 'Can I import my existing spreadsheet data?', answer: 'Absolutely. We support CSV, Excel, and database JSON direct uploads with automatic column mapping.' },
          { question: 'How secure is our company information?', answer: 'We encrypt all active connections and file stores using AES-256 standard protocols.' },
        ],
        beauty: [
          { question: 'Are your items suitable for highly sensitive skin?', answer: 'Yes, our formulations are free of synthetic fillers and fragrances, making them incredibly gentle.' },
          { question: 'What is the average shelf life of organic products?', answer: 'Because we avoid synthetic preservatives, we recommend using our serums within 6 months of opening.' },
          { question: 'Do you offer custom batch sets?', answer: 'We do! Get in touch with our studio team for custom wedding, spa, or wholesale batches.' },
        ],
        food: [
          { question: 'What are your daily delivery hours?', answer: 'We deliver breakfast boxes starting at 7:00 AM, and our kitchen takes lunch/dinner orders until 9:00 PM.' },
          { question: 'Do you accommodate specific food allergies?', answer: 'Yes, you can customize meal platters to exclude dairy, nuts, gluten, or animal products.' },
          { question: 'How far in advance should I order?', answer: 'For standard orders, 45 minutes. For breakfast boxes, please schedule by 8:00 PM the night before.' },
        ],
        coaching: [
          { question: 'What background do the coaches have?', answer: 'Our leads have at least 8 years of operational experience scaling digital businesses or training athletes.' },
          { question: 'What if my schedule changes?', answer: 'No problem. You can reschedule any strategy call with 24 hours notice directly through the portal.' },
          { question: 'How is student progress measured?', answer: 'We perform baseline evaluations and compile weekly diagnostic scorecards to track growth.' },
        ],
        crafts: [
          { question: 'How do I care for hand-made wooden wares?', answer: 'Wash with mild soap and warm water, then dry immediately. Apply food-grade oil monthly.' },
          { question: 'Do you ship fragile ceramics internationally?', answer: 'Yes, we wrap all items in dense biodegradable foam and offer insured international shipping.' },
          { question: 'Can I commission a custom dimensions blanket?', answer: 'Absolutely. Custom weaves take approximately 3 weeks to design and spin. Contact us for rates.' },
        ],
      }[industry];

      // Generate varied design tokens based on industry + tone
      const layouts: Array<'centered' | 'split' | 'minimal' | 'bold'> = ['centered', 'split', 'minimal', 'bold'];
      const cardStyles: Array<'rounded' | 'sharp' | 'pill'> = ['rounded', 'sharp', 'pill'];
      const heroBgs: Array<'solid' | 'gradient' | 'pattern' | 'none'> = ['solid', 'gradient', 'pattern', 'none'];
      const typographies: Array<'clean' | 'elegant' | 'bold'> = ['clean', 'elegant', 'bold'];
      const dividers: Array<'line' | 'dots' | 'none'> = ['line', 'dots', 'none'];

      const seed = prompt.length + industry.length + tone.length;
      const pick = <T>(arr: T[], offset: number) => arr[(seed + offset) % arr.length];

      const allSections = ['features', 'products', 'testimonials', 'about', 'faqs'] as const;
      const shuffled = [...allSections].sort(() => ((seed % 7) - 3) * 0.1);

      const lpData: LandingPageData = {
        hero: {
          title: heroTitles.title,
          subtitle: heroTitles.subtitle,
          ctaText: `Get Started Now`,
        },
        features: featureLists,
        testimonials: testimonialsList,
        faqs: faqsList,
        design: {
          layout: pick(layouts, 0),
          cardStyle: pick(cardStyles, 1),
          heroBg: pick(heroBgs, 2),
          typography: pick(typographies, 3),
          dividerStyle: pick(dividers, 4),
          showTestimonials: true,
          showFaqs: true,
          showAbout: true,
          sectionOrder: shuffled,
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
