import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, ExternalLink, Package, Megaphone, Sparkles } from 'lucide-react';
import prisma from '@/lib/db';
import Header from '@/components/Header';

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

  const totalProducts = businesses.reduce((sum, b) => sum + b._count.products, 0);
  const totalAssets = businesses.reduce((sum, b) => sum + b._count.marketingAssets, 0);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header
        session={session}
        links={[
          { href: '/dashboard', label: 'Dashboard', active: true },
          { href: '/create', label: 'Create' },
        ]}
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              {businesses.length === 0
                ? 'Generate your first business to get started'
                : `${businesses.length} business${businesses.length > 1 ? 'es' : ''} generated`}
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New business
          </Link>
        </div>

        {/* Stats */}
        {businesses.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Businesses</p>
              <p className="text-2xl font-semibold">{businesses.length}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Products</p>
              <p className="text-2xl font-semibold">{totalProducts}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Marketing assets</p>
              <p className="text-2xl font-semibold">{totalAssets}</p>
            </div>
          </div>
        )}

        {/* Business list */}
        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[var(--border)] rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">No businesses yet</h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-6">Describe an idea and AI will build the rest</p>
            <Link
              href="/create"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] text-sm font-medium transition-colors"
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
                className="group block rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 hover:border-[var(--border)] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${biz.brandColor}15` }}>
                      {biz.logoEmoji}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--foreground)]">{biz.name}</h3>
                      <span className="text-[10px] font-medium text-[var(--muted-foreground)]">{biz.niche}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-[var(--muted)] line-clamp-2 mb-4">{biz.tagline}</p>
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {biz._count.products}</span>
                    <span className="flex items-center gap-1"><Megaphone className="w-3 h-3" /> {biz._count.marketingAssets}</span>
                  </div>
                  <span>
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
