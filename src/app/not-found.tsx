import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-slide-up">
        <div className="text-6xl font-semibold tracking-tight mb-2 gradient-text">404</div>
        <p className="text-sm text-(--muted-foreground) mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-(--accent) hover:bg-(--accent-hover) text-(--accent-foreground) text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back home
        </Link>
      </div>
    </div>
  );
}
