import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from './ui/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle tema"
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
        'text-muted-foreground hover:bg-accent hover:text-foreground',
        className,
      )}
    >
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="block dark:hidden" />
    </button>
  );
}
