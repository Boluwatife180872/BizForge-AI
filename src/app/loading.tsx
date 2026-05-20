import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
      </div>
    </div>
  );
}
