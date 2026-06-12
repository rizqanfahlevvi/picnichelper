import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch ke light mode' : 'Switch ke dark mode'}
      style={{
        width: 'var(--hit)',
        height: 'var(--hit)',
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        border: 'none',
        background: 'transparent',
        color: 'var(--label-secondary)',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background var(--dur-fast)',
      }}
      className={className}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--fill-secondary)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <Sun  size={18} strokeWidth={1.75} className="hidden dark:block" />
      <Moon size={18} strokeWidth={1.75} className="block  dark:hidden" />
    </button>
  );
}
