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
        /* M3 icon button size: 48dp */
        'flex h-11 w-11 items-center justify-center rounded-full',
        'text-muted-foreground transition-colors',
        'hover:bg-surface-high hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {/* Ikon bertukar berdasarkan tema aktif */}
      <Sun  size={20} className="hidden dark:block" />
      <Moon size={20} className="block  dark:hidden" />
    </button>
  );
}
