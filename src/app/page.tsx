import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Shield, RefreshCw, LogOut } from 'lucide-react';
import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

function SignOutButton() {
  return (
    <form action={async () => {
      'use server';
      await signOut({ redirectTo: '/' });
    }}>
      <button type="submit" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </form>
  );
}

const gradientSquares = [
  { from: 'from-blue-500', to: 'to-cyan-400', opacity: 'opacity-20', size: 'w-24 h-24', rotate: 'rotate-12' },
  { from: 'from-purple-500', to: 'to-pink-400', opacity: 'opacity-15', size: 'w-32 h-32', rotate: '-rotate-6' },
  { from: 'from-emerald-500', to: 'to-teal-400', opacity: 'opacity-20', size: 'w-20 h-20', rotate: 'rotate-45' },
  { from: 'from-orange-500', to: 'to-amber-400', opacity: 'opacity-15', size: 'w-28 h-28', rotate: '-rotate-12' },
  { from: 'from-indigo-500', to: 'to-violet-400', opacity: 'opacity-20', size: 'w-16 h-16', rotate: 'rotate-3' },
  { from: 'from-rose-500', to: 'to-red-400', opacity: 'opacity-15', size: 'w-24 h-24', rotate: '-rotate-45' },
  { from: 'from-sky-500', to: 'to-blue-400', opacity: 'opacity-20', size: 'w-20 h-20', rotate: 'rotate-6' },
  { from: 'from-fuchsia-500', to: 'to-purple-400', opacity: 'opacity-15', size: 'w-32 h-32', rotate: '-rotate-3' },
  { from: 'from-lime-500', to: 'to-green-400', opacity: 'opacity-20', size: 'w-16 h-16', rotate: 'rotate-12' },
  { from: 'from-yellow-500', to: 'to-orange-400', opacity: 'opacity-15', size: 'w-28 h-28', rotate: '-rotate-6' },
  { from: 'from-cyan-500', to: 'to-sky-400', opacity: 'opacity-20', size: 'w-24 h-24', rotate: 'rotate-45' },
  { from: 'from-violet-500', to: 'to-indigo-400', opacity: 'opacity-15', size: 'w-20 h-20', rotate: '-rotate-12' },
];

export default async function LandingPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userEmail = session?.user?.email as string | undefined;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Square gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top section */}
        <div className="absolute top-8 left-[5%]">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 rotate-12 blur-sm`} />
        </div>
        <div className="absolute top-20 right-[10%]">
          <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 opacity-15 -rotate-6 blur-sm`} />
        </div>
        <div className="absolute top-40 left-[15%]">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 opacity-20 rotate-45 blur-sm`} />
        </div>
        <div className="absolute top-60 right-[20%]">
          <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 opacity-15 -rotate-12 blur-sm`} />
        </div>
        <div className="absolute top-10 left-[40%]">
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-400 opacity-20 rotate-3 blur-sm`} />
        </div>

        {/* Middle section */}
        <div className="absolute top-[45%] left-[8%]">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-rose-500 to-red-400 opacity-15 -rotate-45 blur-sm`} />
        </div>
        <div className="absolute top-[50%] right-[5%]">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br from-sky-500 to-blue-400 opacity-20 rotate-6 blur-sm`} />
        </div>
        <div className="absolute top-[55%] left-[30%]">
          <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-400 opacity-15 -rotate-3 blur-sm`} />
        </div>
        <div className="absolute top-[40%] right-[35%]">
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-lime-500 to-green-400 opacity-20 rotate-12 blur-sm`} />
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-20 left-[12%]">
          <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-400 opacity-15 -rotate-6 blur-sm`} />
        </div>
        <div className="absolute bottom-40 right-[15%]">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-400 opacity-20 rotate-45 blur-sm`} />
        </div>
        <div className="absolute bottom-10 left-[45%]">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-400 opacity-15 -rotate-12 blur-sm`} />
        </div>

        {/* Grid overlay for square pattern effect */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--foreground) 1px, transparent 1px),
              linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <header className="border-b border-[var(--border)] relative z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">BizForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-xs text-zinc-500 hidden sm:block">{userEmail}</span>
                <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                  Dashboard
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                >
                  Get started <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 relative z-10">
        <section className="py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted-foreground)] mb-6">
            <Zap className="w-3 h-3" /> Generate a business in 60 seconds
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight max-w-3xl mx-auto">
            Turn an idea into a
            <br />
            <span className="text-[var(--muted)]">complete business</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] mt-6 max-w-xl mx-auto leading-relaxed">
            Describe your idea in plain English. BizForge generates your brand, products, landing page, and marketing campaigns automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
            <Link
              href={isAuthenticated ? '/create' : '/signup'}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
            >
              {isAuthenticated ? 'Create a business' : 'Start building'} <ArrowRight className="w-4 h-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--card)] font-medium text-sm transition-colors"
              >
                Sign in to your account
              </Link>
            )}
          </div>
        </section>

        <section className="py-16 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Multi-provider AI', desc: 'Routes between Groq, Ollama, and local fallback. Always works, even offline.' },
              { icon: Shield, title: 'Validated output', desc: 'Zod schemas validate every AI response to guarantee consistent, usable structures.' },
              { icon: RefreshCw, title: 'Guaranteed fallback', desc: 'If all external APIs fail, built-in templates keep the system running.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--foreground)]">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 border-t border-[var(--border)]">
          <h2 className="text-lg font-medium text-[var(--foreground)] mb-8">What you get from a single prompt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Brand identity', desc: 'Name, colors, tone, logo' },
              { label: 'Product catalog', desc: '3-10 products with pricing' },
              { label: 'Landing page', desc: 'Hero, features, FAQs, testimonials' },
              { label: 'Marketing copy', desc: 'Emails, ads, social posts' },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">{item.label}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">© 2026 BizForge AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
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
