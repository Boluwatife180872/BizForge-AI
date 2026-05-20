"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <header className="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-foreground)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight">BizForge</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl bg-[var(--input)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--ring)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl bg-[var(--input)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--ring)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20 text-[var(--error)] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:pointer-events-none text-[var(--accent-foreground)] font-medium text-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-[var(--muted-foreground)] mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--foreground)] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
