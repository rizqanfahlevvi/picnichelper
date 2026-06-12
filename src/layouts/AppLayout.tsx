import { NavLink, Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../components/ui/cn';
import { BOTTOM_PRIMARY, SHEET_ITEMS, MenuIcon } from './navItems';
import type { NavItem } from './navItems';

export function AppLayout() {
  return (
    <div className="flex h-full bg-background text-foreground">

      {/* ── Sidebar desktop (≥ md) ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <Brand />
          <ThemeToggle />
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {[...BOTTOM_PRIMARY, ...SHEET_ITEMS].map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      {/* ── Area konten ── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
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

      {/* ── Bottom tab bar mobile ── */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card/95 backdrop-blur-sm pb-safe">
        {BOTTOM_PRIMARY.map((item) => (
          <BottomLink key={item.to} item={item} />
        ))}

        {/* Tombol "Menu" → Sheet Radix */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] pt-2 pb-1 text-muted-foreground hover:text-foreground transition-colors">
              <MenuIcon size={22} />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader className="pb-2">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2 p-4 pt-0">
              {SHEET_ITEMS.map((item) => (
                <SheetNavLink key={item.to} item={item} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

// ─── Sub-komponen ──────────────────────────────────────────────────────────

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-sm">
        P
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight">PICNIC</div>
        <div className="text-[10px] text-muted-foreground">ER &amp; Intensive Care</div>
      </div>
    </div>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={isActive ? 'text-primary' : ''} />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

function BottomLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] pt-2 pb-1 transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function SheetNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 min-h-[52px] rounded-xl border px-4 text-sm font-medium transition-colors',
          isActive
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border bg-background text-foreground hover:bg-accent',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={16} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
          {item.label}
        </>
      )}
    </NavLink>
  );
}
