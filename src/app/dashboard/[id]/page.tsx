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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View storefront
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Business header card */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: `${business.brandColor}15` }}>
              {business.logoEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-lg font-semibold">{business.name}</h1>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">
                  {business.niche}
                </span>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">
                  {business.tone}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-3">{business.tagline}</p>
              <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(business.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-[var(--border)]" style={{ backgroundColor: business.brandColor }} />
                  {business.secondaryColor && (
                    <span className="w-3 h-3 rounded-full border border-[var(--border)]" style={{ backgroundColor: business.secondaryColor }} />
                  )}
                  <span className="text-[var(--muted-foreground)]">Brand palette</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
              <Package className="w-4 h-4" /> Products
              <span className="text-xs text-[var(--muted-foreground)] font-normal">({business.products.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {business.products.map((product) => (
              <div key={product.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 hover:border-[var(--border)] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${business.brandColor}12` }}>
                    {product.imageEmoji}
                  </div>
                  <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <h3 className="text-sm font-medium mb-0.5">{product.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-2">{product.category}</p>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing assets */}
        {business.marketingAssets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
                <Megaphone className="w-4 h-4" /> Marketing
                <span className="text-xs text-[var(--muted-foreground)] font-normal">({business.marketingAssets.length})</span>
              </h2>
              <Link href={`/dashboard/${business.id}/marketing`} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.marketingAssets.map((asset) => (
                <div key={asset.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium">{asset.title}</h3>
                      <p className="text-[10px] text-[var(--muted-foreground)]">{asset.platform}</p>
                    </div>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">
                      {asset.type}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] whitespace-pre-wrap line-clamp-4 leading-relaxed flex-1">{asset.content}</p>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    <Link href={`/dashboard/${business.id}/marketing`} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                      View full copy &rarr;
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
