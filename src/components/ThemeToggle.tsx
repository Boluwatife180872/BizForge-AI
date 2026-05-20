'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const effectiveTheme = resolvedTheme;

  return (
    <button
      onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      aria-label="Toggle theme"
    >
      {!mounted ? (
        <span className="w-4 h-4" aria-hidden="true" />
      ) : effectiveTheme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
