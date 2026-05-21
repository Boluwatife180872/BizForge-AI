"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      setSuccess(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please try logging in.");
        return;
      }

      router.push("/dashboard");
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
          <span className="text-sm font-semibold tracking-tight">BizCraft</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Start building businesses with AI</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--success-bg)] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
              </div>
              <h2 className="text-lg font-medium">Account created</h2>
              <p className="text-sm text-[var(--muted-foreground)]">Redirecting to your dashboard...</p>
            </div>
          ) : (
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
                  placeholder="At least 6 characters"
                  required
                  className="w-full rounded-xl bg-[var(--input)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--ring)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
                disabled={loading || !email || !password || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:pointer-events-none text-[var(--accent-foreground)] font-medium text-sm transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  <>
                    Create account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-sm text-[var(--muted-foreground)] mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--foreground)] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
