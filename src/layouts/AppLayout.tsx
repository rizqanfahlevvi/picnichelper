/*
 * AppLayout — Apple HIG Adaptive Layout
 *
 * Mobile  (<md): iOS-style Tab Bar (bottom, translucent blur)
 *                + iOS-style Navigation Bar (top, translucent blur)
 * Desktop (≥md): Navigation sidebar + content area
 *
 * Touch targets: every tappable element min 48 × 48 px
 * Background: slate-50 (light) / slate-950 (dark)
 */
import { NavLink, Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../components/ui/cn';
import { BOTTOM_PRIMARY, SHEET_ITEMS, MenuIcon } from './navItems';
import type { NavItem } from './navItems';

export function AppLayout() {
  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">

      {/* ══════════════════════════════════════════
          DESKTOP: Sidebar
      ══════════════════════════════════════════ */}
      <aside className={cn(
        'hidden md:flex w-64 shrink-0 flex-col',
        'bg-white dark:bg-slate-900',
        'border-r border-slate-200 dark:border-slate-800',
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <Brand />
          <ThemeToggle />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {[...BOTTOM_PRIMARY, ...SHEET_ITEMS].map((item) => (
            <SidebarNavItem key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ── iOS Navigation Bar (mobile) ──
            Translucent blur, white/slate-950 tinted background
            Height: 56 px (iOS standard navigation bar) */}
        <header className={cn(
          'md:hidden sticky top-0 z-10',
          'flex items-center justify-between',
          'h-14 px-2',
          /* iOS translucent effect */
          'bg-white/80 backdrop-blur-md dark:bg-slate-950/80',
          'border-b border-slate-200/70 dark:border-slate-800/70',
        )}>
          <Brand />
          <ThemeToggle />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-5 pb-32 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE: iOS-style Tab Bar (bottom)
          Height: 83 px (49px bar + 34px safe area)
          Translucent: bg-white/80 + backdrop-blur-md (light)
                       bg-slate-950/80 + backdrop-blur-md (dark)
          Top border: subtle 1px slate-200/slate-800
          Touch targets: min 48 × 48 px per item
      ══════════════════════════════════════════ */}
      <nav className={cn(
        'md:hidden fixed inset-x-0 bottom-0 z-20',
        'flex items-stretch',
        /* iOS translucent tab bar */
        'bg-white/80 backdrop-blur-md dark:bg-slate-950/80',
        'border-t border-slate-200 dark:border-slate-800',
        /* Safe area for modern phones (swipe indicator) */
        'pb-4',
      )}>
        {BOTTOM_PRIMARY.map((item) => (
          <TabBarItem key={item.to} item={item} />
        ))}

        {/* "Menu" — Sheet untuk rute tambahan */}
        <Sheet>
          <SheetTrigger asChild>
            <button className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1',
              'min-h-[48px] pt-2',
              /* Inactive state */
              'text-slate-400 dark:text-slate-500',
              'transition-colors',
            )}>
              <MenuIcon size={24} strokeWidth={1.75} />
              <span className="text-[10px] font-medium tracking-wide">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2.5 px-5 pb-6 pt-1">
              {SHEET_ITEMS.map((item) => (
                <SheetNavItem key={item.to} item={item} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

/* ── Sub-komponen ─────────────────────────────────────────────────────── */

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl',
        'bg-blue-600 text-white dark:bg-blue-500',
        'text-sm font-black',
      )}>
        P
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          PICNIC
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide">
          ER &amp; Intensive Care
        </div>
      </div>
    </div>
  );
}

/* Sidebar nav item */
function SidebarNavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) => cn(
        'flex items-center gap-3 rounded-xl px-3 min-h-[44px] text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50',
      )}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={isActive ? 2.25 : 1.75}
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

/*
 * iOS Tab Bar item
 * Active : icon + label in blue-600 (light) / blue-400 (dark)
 * Inactive: icon + label in slate-400 (light) / slate-500 (dark)
 * Touch target: min-h-[48px]
 */
function TabBarItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[48px] pt-2 transition-colors"
    >
      {({ isActive }) => (
        <>
          <Icon
            size={24}
            strokeWidth={isActive ? 2.5 : 1.75}
            className={cn(
              'transition-colors',
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500',
            )}
          />
          <span className={cn(
            'text-[10px] font-medium tracking-wide transition-colors',
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-400 dark:text-slate-500',
          )}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

/* Sheet nav item */
function SheetNavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => cn(
        'flex items-center gap-3 min-h-[52px] rounded-xl border px-4 text-sm font-medium transition-colors',
        isActive
          ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
      )}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={isActive ? 2.25 : 1.75}
            className={isActive ? '' : 'text-slate-400 dark:text-slate-500'}
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}
