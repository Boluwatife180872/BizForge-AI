'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface Stage {
  key: string;
  label: string;
  status: 'idle' | 'running' | 'done';
}

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [stages, setStages] = useState<Stage[]>([
    { key: 'analyzing', label: 'Analyzing prompt', status: 'idle' },
    { key: 'branding', label: 'Building brand identity', status: 'idle' },
    { key: 'products', label: 'Creating product catalog', status: 'idle' },
    { key: 'landing', label: 'Drafting landing page', status: 'idle' },
    { key: 'marketing', label: 'Writing marketing copy', status: 'idle' },
    { key: 'saving', label: 'Saving to database', status: 'idle' },
  ]);

  useEffect(() => {
    if (!loading || businessId) return;

    const timings = [500, 1500, 3000, 5000, 7000];
    const timers: NodeJS.Timeout[] = [];

    timings.forEach((timing, i) => {
      const timer = setTimeout(() => {
        setStages((prev) => {
          const next = [...prev];
          if (next[i]) next[i] = { ...next[i], status: 'done' };
          if (next[i + 1]) next[i + 1] = { ...next[i + 1], status: 'running' };
          return next;
        });
      }, timing);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [loading, businessId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setBusinessId(null);
    setStages((prev) => prev.map((s, i) => ({ ...s, status: i === 0 ? 'running' : 'idle' })));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setStages((prev) => prev.map((s) => ({ ...s, status: 'done' })));
      setBusinessId(data.businessId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[var(--brand)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">BizCraft</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-16">
        {!loading && !businessId ? (
          <div className="animate-slide-up">
            <div className="mb-10">
              <h1 className="text-2xl font-semibold tracking-tight mb-1.5">Create a business</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Describe your idea and AI will generate everything</p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="prompt" className="text-sm font-medium">
                  Your idea
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="I want to sell hand-thrown ceramic mugs in Lagos"
                  rows={4}
                  required
                  className="w-full rounded-xl bg-[var(--input)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--ring)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none transition-all resize-none"
                />
                <p className="text-xs text-[var(--muted-foreground)]">Be descriptive — mention the niche, audience, and any specific details.</p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20 text-[var(--error)] text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!prompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:pointer-events-none text-[var(--accent-foreground)] font-medium text-sm transition-all hover:-translate-y-0.5"
              >
                Generate business <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : loading && !businessId ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-subtle)] flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[var(--brand)] animate-spin" />
              </div>
              <div>
                <h2 className="text-base font-medium">Generating your business</h2>
                <p className="text-xs text-[var(--muted-foreground)]">This takes about 10–15 seconds</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {stages.map((stage, i) => (
                <div key={stage.key} className="flex items-center gap-3 py-3 px-4 rounded-lg transition-colors">
                  {stage.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  ) : stage.status === 'running' ? (
                    <Loader2 className="w-4 h-4 text-[var(--brand)] animate-spin shrink-0" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${i < stages.findIndex(s => s.status === 'running') ? 'border-[var(--success)] bg-[var(--success)]' : 'border-[var(--border)]'}`} />
                  )}
                  <span className={`text-sm transition-colors ${
                    stage.status === 'done' ? 'text-[var(--muted)]' :
                    stage.status === 'running' ? 'text-[var(--foreground)] font-medium' :
                    'text-[var(--muted-foreground)]'
                  }`}>
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-[var(--success)]" />
            </div>
            <h2 className="text-xl font-semibold mb-1">Business created</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">Your brand, products, landing page, and marketing copy are ready</p>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Link
                href={`/business/${businessId}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-medium text-sm transition-all hover:-translate-y-0.5"
              >
                View storefront <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/dashboard/${businessId}/marketing`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] font-medium text-sm transition-all"
              >
                View marketing assets
              </Link>
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] font-medium text-sm transition-all"
              >
                Back to dashboard
              </Link>
              <Link
                href="/create"
                className="w-full flex items-center justify-center py-3 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium text-sm transition-colors"
              >
                Create another business
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
