import Link from 'next/link';
import { ArrowRight, Zap, Shield, Layers, Sparkles } from 'lucide-react';
import { auth } from '@/lib/auth';
import Header from '@/components/Header';

const steps = [
  {
    number: '01',
    icon: Zap,
    title: 'Describe your idea',
    desc: 'Write a sentence or two about the business you want to build. No templates, no forms — just plain English.',
  },
  {
    number: '02',
    icon: Layers,
    title: 'AI builds everything',
    desc: 'Brand identity, product catalog, landing page copy, and marketing campaigns — generated in under 15 seconds.',
  },
  {
    number: '03',
    icon: Shield,
    title: 'Launch and iterate',
    desc: 'Get a live storefront URL instantly. Refine the output, regenerate sections, or start fresh with a new prompt.',
  },
];

const deliverables = [
  { label: 'Brand identity', desc: 'Name, colors, tone of voice, logo' },
  { label: 'Product catalog', desc: '3–10 products with descriptions and pricing' },
  { label: 'Landing page', desc: 'Hero, features, testimonials, FAQs, about' },
  { label: 'Marketing copy', desc: 'Emails, ads, and social media posts' },
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
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted-foreground)] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate a complete business in 60 seconds</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
              Turn an idea into a
              <br />
              <span className="text-[var(--muted)]">real business.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--muted-foreground)] mt-6 max-w-xl leading-relaxed">
              Describe your idea in plain English. BizForge generates your brand, products, landing page, and marketing campaigns — automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link
                href={isAuthenticated ? '/create' : '/signup'}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-colors"
              >
                {isAuthenticated ? 'Create a business' : 'Start building'} <ArrowRight className="w-4 h-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] font-medium text-sm transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 border-t border-[var(--border)]">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Three steps from idea to launch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{step.number}</span>
                      <h3 className="text-sm font-medium text-[var(--foreground)]">{step.title}</h3>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 border-t border-[var(--border)]">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2">Deliverables</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">What you get from a single prompt</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
            {deliverables.map((item) => (
              <div key={item.label} className="bg-[var(--background)] p-6">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">{item.label}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {isAuthenticated ? (
          <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 border-t border-[var(--border)]">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">What will you build next?</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-8">
                Generate another business or check your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-colors"
                >
                  Create a business <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] font-medium text-sm transition-colors"
                >
                  View dashboard
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 border-t border-[var(--border)]">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">Ready to build?</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-8">
                Create a free account and generate your first business in under a minute.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-colors"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">&copy; 2026 BizForge. All rights reserved.</p>
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
