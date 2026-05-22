import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-slide-up">
        <p className="text-7xl font-semibold tracking-tight text-[var(--muted-foreground)] mb-2">404</p>
        <p className="text-sm text-[var(--muted-foreground)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] text-sm font-medium transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back home
        </Link>
      </div>
    </div>
  );
}
