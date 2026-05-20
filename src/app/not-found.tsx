import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-5 h-5 text-[var(--muted-foreground)]" />
        </div>
        <h1 className="text-3xl font-semibold mb-2">404</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back home
        </Link>
      </div>
    </div>
  );
}
