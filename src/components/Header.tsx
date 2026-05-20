import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';
import { Session } from 'next-auth';
import ThemeToggle from '@/components/ThemeToggle';

function SignOutButton() {
  return (
    <form action={async () => {
      'use server';
      await signOut({ redirectTo: '/' });
    }}>
      <button type="submit" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </form>
  );
}

interface HeaderProps {
  session: Session | null;
  links?: { href: string; label: string; active?: boolean }[];
  rightContent?: React.ReactNode;
  bordered?: boolean;
}

export default function Header({ session, links, rightContent, bordered = true }: HeaderProps) {
  const isAuthenticated = !!session?.user;
  const userEmail = session?.user?.email as string | undefined;

  return (
    <header className={bordered ? 'border-b border-[var(--border)]' : ''}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-foreground)]" />
            </div>
            <span className="text-sm font-semibold tracking-tight">BizForge</span>
          </Link>
          {links && links.length > 0 && (
            <nav className="hidden sm:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    link.active
                      ? 'bg-[var(--card)] text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <span className="text-xs text-[var(--muted-foreground)] hidden sm:block">{userEmail}</span>
          )}
          {rightContent}
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] text-sm font-medium transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
