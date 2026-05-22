import Link from 'next/link';
import { ArrowRight, Sparkles, BarChart3, Palette, Globe, Mail } from 'lucide-react';
import { auth } from '@/lib/auth';
import Header from '@/components/Header';

const steps = [
  {
    icon: Sparkles,
    title: 'Describe your idea',
    desc: 'Write a sentence or two about the business you want to build. No templates, no forms — just plain English.',
  },
  {
    icon: Palette,
    title: 'AI builds everything',
    desc: 'Brand identity, product catalog, landing page copy, and marketing campaigns — generated in under 15 seconds.',
  },
  {
    icon: BarChart3,
    title: 'Launch and iterate',
    desc: 'Get a live storefront URL instantly. Refine the output, regenerate sections, or start fresh with a new prompt.',
  },
];

const deliverables = [
  { icon: Palette, label: 'Brand identity', desc: 'Name, colors, tone of voice, logo emoji' },
  { icon: Globe, label: 'Product catalog', desc: '3–10 products with descriptions and pricing' },
  { icon: BarChart3, label: 'Landing page', desc: 'Hero, features, testimonials, FAQs, about' },
  { icon: Mail, label: 'Marketing copy', desc: 'Emails, ads, and social media posts' },
];

export default async function LandingPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header
        session={session}
        links={isAuthenticated ? [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/create', label: 'Create' },
        ] : undefined}
      />

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted-foreground)] mb-8">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>Generate a complete business in 60 seconds</span>
              </div>

              <h1 className="text-[2.25rem] sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-balance">
                Turn an idea into a{' '}
                <span className="text-[var(--muted)]">real business.</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--muted-foreground)] mt-5 max-w-xl leading-relaxed">
                Describe your idea in plain English. BizCraft generates your brand, products, landing page, and marketing campaigns — automatically.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  href={isAuthenticated ? '/create' : '/signup'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-all hover:-translate-y-0.5"
                >
                  {isAuthenticated ? 'Create a business' : 'Start building'} <ArrowRight className="w-4 h-4" />
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] font-medium text-sm transition-all"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm shadow-black/[0.02]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}>☕</div>
                    <div>
                      <p className="text-sm font-medium">Artisan Brew Co.</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">Specialty Coffee · Premium</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-5">
                    <div className="w-4 h-4 rounded-full bg-[#6366f1] border border-[var(--border)] shadow-sm" />
                    <div className="w-4 h-4 rounded-full bg-[#a78bfa] border border-[var(--border)] shadow-sm" />
                    <div className="w-4 h-4 rounded-full bg-[#c4b5fd] border border-[var(--border)] shadow-sm" />
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { emoji: '☕', name: 'House Blend', sub: 'Medium Roast', price: '$14.00' },
                      { emoji: '🫖', name: 'Single Origin', sub: 'Ethiopian Yirgacheffe', price: '$22.00' },
                      { emoji: '🎁', name: 'Gift Set', sub: 'Curated Collection', price: '$45.00' },
                    ].map((item) => (
                      <div key={item.name} className="rounded-lg bg-[var(--background)] border border-[var(--border)] p-3 hover:border-[var(--muted-foreground)] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{item.emoji}</span>
                            <div>
                              <p className="text-xs font-medium">{item.name}</p>
                              <p className="text-[10px] text-[var(--muted-foreground)]">{item.sub}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">3 products</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">5 assets</span>
                    </div>
                    <span className="text-[10px] text-[var(--muted-foreground)]">Generated in 12s</span>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 px-2.5 py-1 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-[10px] font-medium shadow-sm">
                  ✨ BizCraft AI Generated
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6 py-24 sm:py-28">
            <div className="max-w-xl mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">Three steps from idea to launch</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
              {steps.map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-[var(--foreground)]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-[var(--muted-foreground)]">0{i + 1}</span>
                        <h3 className="text-sm font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6 py-24 sm:py-28">
            <div className="max-w-xl mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">Deliverables</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">What you get from a single prompt</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl border border-[var(--border)] overflow-hidden">
              {deliverables.map((item) => (
                <div key={item.label} className="bg-[var(--background)] p-7">
                  <div className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] flex items-center justify-center mb-4">
                    <item.icon className="w-4 h-4 text-[var(--foreground)]" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5">{item.label}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        {isAuthenticated ? (
          <section className="border-t border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-6 py-24 sm:py-28">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">What will you build next?</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-8">
                  Generate another business or check your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/create"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-all hover:-translate-y-0.5"
                  >
                    Create a business <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] font-medium text-sm transition-all"
                  >
                    View dashboard
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="border-t border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-6 py-24 sm:py-28">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">Ready to build?</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-8">
                  Create a free account and generate your first business in under a minute.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-all hover:-translate-y-0.5"
                >
                  Get started free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[var(--brand)] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">&copy; 2026 BizCraft. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Dashboard</Link>
                <Link href="/create" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Create</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Sign in</Link>
                <Link href="/signup" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
