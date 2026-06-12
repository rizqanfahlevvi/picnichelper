import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from './ui/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch ke light mode' : 'Switch ke dark mode'}
      className={cn(
        /* 48 × 48 px touch target */
        'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
        'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
        'dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className,
      )}
    >
      <Sun  size={20} className="hidden dark:block" />
      <Moon size={20} className="block  dark:hidden" />
    </button>
  );
}
