/*
 * AppLayout — M3 Adaptive Navigation + Apple HIG Top App Bar
 *
 * Mobile  (<md): M3 Navigation Bar (bottom) + M3 Top App Bar (sticky)
 * Desktop (≥md): M3 Navigation Drawer (side) + content area
 *
 * ELEVASI:
 *  Light  → shadow pada bar/card
 *  Dark   → bar menggunakan surface-container (level 2), lebih terang dari
 *            background surface (level 0) — TANPA shadow
 */
import { NavLink, Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../components/ui/cn';
import { BOTTOM_PRIMARY, SHEET_ITEMS, MenuIcon } from './navItems';
import type { NavItem } from './navItems';

export function AppLayout() {
  return (
    <div className="flex h-full bg-surface-dim text-foreground">

      {/* ══════════════════════════════════════════════════
          DESKTOP: Navigation Drawer (M3)
          Surface: surface-container (level 2) — lebih terang dari bg
      ══════════════════════════════════════════════════ */}
      <aside className={cn(
        'hidden md:flex w-64 shrink-0 flex-col',
        /* Light: bg putih + shadow lateral; Dark: tonal level-2, no shadow */
        'bg-surface-lowest dark:bg-surface-container',
        'border-r border-border',
        'elevation-1 dark:shadow-none',
      )}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Brand />
          <ThemeToggle />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {[...BOTTOM_PRIMARY, ...SHEET_ITEMS].map((item) => (
            <DrawerNavItem key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════════════════════
          Content area
      ══════════════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* M3 Top App Bar — mobile only
            Light: bg putih + shadow bottom
            Dark : surface-container (level 2) + no shadow */}
        <header className={cn(
          'md:hidden sticky top-0 z-10',
          'flex items-center justify-between px-4',
          'h-14 min-h-[56px]',
          'bg-surface-lowest dark:bg-surface-container',
          'border-b border-border',
          'elevation-1 dark:shadow-none',
        )}>
          <Brand />
          <ThemeToggle />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-5 pb-28 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE: M3 Navigation Bar (bottom)
          Height: 80dp (56dp bar + 16dp safe area / padding)
          Light : bg putih + border-t + shadow top
          Dark  : surface-container-high (level 3) — NO shadow
      ══════════════════════════════════════════════════ */}
      <nav className={cn(
        'md:hidden fixed inset-x-0 bottom-0 z-20',
        'flex items-stretch',
        'bg-surface-lowest dark:bg-surface-high',
        'border-t border-border',
        'elevation-2 dark:shadow-none',
        'pb-4',   /* safe-area approximation */
      )}>
        {BOTTOM_PRIMARY.map((item) => (
          <BottomNavItem key={item.to} item={item} />
        ))}

        {/* Tombol "Menu" → M3 Bottom Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1',
              'min-h-[56px] pt-3 pb-1',
              'text-muted-foreground hover:text-foreground transition-colors',
            )}>
              {/* No indicator for menu button */}
              <MenuIcon size={24} strokeWidth={1.75} />
              <span className="text-[10px] font-medium tracking-wide">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2.5 px-5 pb-6 pt-2">
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

/* ── Sub-komponen ──────────────────────────────────────────────────────── */

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        'flex h-9 w-9 items-center justify-center',
        'rounded-xl bg-primary text-primary-foreground',
        'text-sm font-black tracking-tight',
        'elevation-1',
      )}>
        P
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight text-foreground">PICNIC</div>
        <div className="text-[10px] font-medium text-muted-foreground tracking-wide">
          ER &amp; Intensive Care
        </div>
      </div>
    </div>
  );
}

/* Drawer nav item — M3 "Navigation Drawer Item"
   Active: indicator pill di belakang, teks + ikon primary */
function DrawerNavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) => cn(
        'group flex items-center gap-3 rounded-full px-4 min-h-[44px] text-sm font-medium',
        'transition-colors',
        isActive
          /* Active: M3 indicator — primary-container bg */
          ? 'bg-primary-container text-[hsl(var(--on-primary-container))]'
          : 'text-muted-foreground hover:bg-surface-high hover:text-foreground',
      )}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={isActive ? 2.25 : 1.75}
            className={isActive ? 'text-[hsl(var(--on-primary-container))]' : ''}
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

/* Bottom nav item — M3 Navigation Bar dengan active indicator pill */
function BottomNavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className="flex flex-1 flex-col items-center justify-start pt-3 pb-1 min-h-[56px] transition-colors"
    >
      {({ isActive }) => (
        <>
          {/* M3 active indicator — pill di belakang ikon */}
          <div className={cn(
            'flex items-center justify-center',
            'w-16 h-8 rounded-full transition-colors',
            isActive
              ? 'bg-primary-container'
              : 'bg-transparent group-hover:bg-surface-high',
          )}>
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.75}
              className={cn(
                'transition-colors',
                isActive
                  ? 'text-[hsl(var(--on-primary-container))]'
                  : 'text-muted-foreground',
              )}
            />
          </div>
          {/* Label */}
          <span className={cn(
            'mt-1 text-[10px] font-medium tracking-wide transition-colors',
            isActive
              ? 'text-[hsl(var(--on-primary-container))] dark:text-primary'
              : 'text-muted-foreground',
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
        'flex items-center gap-3 min-h-[52px] rounded-2xl px-4 text-sm font-medium',
        'border transition-colors',
        isActive
          ? 'border-primary/30 bg-primary-container text-[hsl(var(--on-primary-container))]'
          : 'border-border bg-surface-container text-foreground hover:bg-surface-high',
      )}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={isActive ? 2.25 : 1.75}
            className={isActive ? 'text-[hsl(var(--on-primary-container))]' : 'text-muted-foreground'}
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}
