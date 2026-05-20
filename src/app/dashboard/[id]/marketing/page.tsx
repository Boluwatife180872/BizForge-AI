import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail, Share2, Award, Sparkles } from 'lucide-react';
import prisma from '@/lib/db';
import CopyButton from '@/components/CopyButton';
import ThemeToggle from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default async function MarketingHubPage({
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
      marketingAssets: true,
    },
  });

  if (!business) return notFound();

  const typeIcons: Record<string, React.ReactNode> = {
    email: <Mail className="w-4 h-4" />,
    ad: <Award className="w-4 h-4" />,
    post: <Share2 className="w-4 h-4" />,
  };

  const typeColors: Record<string, string> = {
    email: 'bg-blue-500/10 text-blue-400',
    ad: 'bg-amber-500/10 text-amber-400',
    post: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <span className="text-[var(--border)]">/</span>
            <Link href={`/dashboard/${business.id}`} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              {business.name}
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-sm font-medium text-[var(--foreground)]">Marketing</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">Marketing assets</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Ready-to-use copy generated for {business.name}</p>
        </div>

        {business.marketingAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[var(--border)] rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-[var(--card)] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-sm text-[var(--muted)]">No marketing assets for this business</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business.marketingAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${typeColors[asset.type] || 'bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]'}`}>
                      {typeIcons[asset.type] || <Share2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{asset.title}</h3>
                      <p className="text-[10px] text-[var(--muted-foreground)]">{asset.platform}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                    {asset.type}
                  </span>
                </div>

                <pre className="flex-1 bg-[var(--code-bg)] border border-[var(--code-border)] rounded-lg p-4 font-mono text-xs text-[var(--muted)] leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-56">
                  {asset.content}
                </pre>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)]">Ready to use</span>
                  <CopyButton text={asset.content} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
