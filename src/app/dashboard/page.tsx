import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, ExternalLink, Calendar, Package, Megaphone, Sparkles, LogOut } from 'lucide-react';
import prisma from '@/lib/db';
import { signOut } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

function SignOutButton() {
  return (
    <form action={async () => {
      'use server';
      await signOut({ redirectTo: '/' });
    }}>
      <button type="submit" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </form>
  );
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const businesses = await prisma.business.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          products: true,
          marketingAssets: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight">BizForge</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--card)] text-[var(--foreground)]">
                Dashboard
              </Link>
              <Link href="/create" className="px-3 py-1.5 rounded-md text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">
                Create
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--muted-foreground)] hidden sm:block">{session.user.email}</span>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Your businesses</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              {businesses.length === 0 ? 'Generate your first business to get started' : `${businesses.length} business${businesses.length > 1 ? 'es' : ''} generated`}
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New business
          </Link>
        </div>

        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[var(--border)] rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-[var(--card)] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">No businesses yet</h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-6">Describe an idea and AI will build the rest</p>
            <Link
              href="/create"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              Create your first business
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((biz) => (
              <Link
                key={biz.id}
                href={`/dashboard/${biz.id}`}
                className="group block bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--border)] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{biz.logoEmoji}</span>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--foreground)] transition-colors">{biz.name}</h3>
                      <span className="text-[10px] font-medium text-[var(--muted-foreground)]">{biz.niche}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--muted)] transition-colors" />
                </div>
                <p className="text-xs text-[var(--muted)] line-clamp-2 mb-4">{biz.tagline}</p>
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {biz._count.products}</span>
                    <span className="flex items-center gap-1"><Megaphone className="w-3 h-3" /> {biz._count.marketingAssets}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(biz.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
