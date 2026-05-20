import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, Megaphone, ExternalLink, Calendar } from 'lucide-react';
import prisma from '@/lib/db';
import ThemeToggle from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) return notFound();

  const business = await prisma.business.findUnique({
    where: { id, userId: session.user.id },
    include: {
      products: true,
      marketingAssets: true,
    },
  });

  if (!business) return notFound();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-sm font-medium text-[var(--foreground)]">{business.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/business/${business.id}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View storefront
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{business.logoEmoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-semibold">{business.name}</h1>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                  {business.niche}
                </span>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                  {business.tone}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-2">{business.tagline}</p>
              <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(business.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: business.brandColor }} />
                  {business.secondaryColor && (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: business.secondaryColor }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Products ({business.products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {business.products.map((product) => (
              <div key={product.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{product.imageEmoji}</span>
                  <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <h3 className="text-sm font-medium mb-0.5">{product.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-2">{product.category}</p>
                <p className="text-xs text-[var(--muted)] line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>
        </div>

        {business.marketingAssets.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4" /> Marketing ({business.marketingAssets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.marketingAssets.map((asset) => (
                <div key={asset.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">{asset.title}</h3>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                      {asset.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--muted-foreground)] mb-3">{asset.platform}</p>
                  <p className="text-xs text-[var(--muted)] whitespace-pre-wrap line-clamp-4">{asset.content}</p>
                  <div className="mt-3">
                    <Link href={`/dashboard/${business.id}/marketing`} className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                      View full copy →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
