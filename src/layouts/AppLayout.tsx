import { NavLink, Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

import { NAV_ITEMS } from './navItems';
import { cn } from '../components/ui/cn';

export function AppLayout() {
  const mobilePrimary = NAV_ITEMS.filter((n) => n.primaryMobile);
  const sheetItems = NAV_ITEMS.filter((n) => !n.primaryMobile);

  return (
    <div className="flex h-full bg-background text-foreground">
      {/* ── Sidebar desktop (≥ md) ── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card p-3 md:flex">
        <Brand />
        <nav className="mt-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>
      </aside>

      {/* ── Area konten ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <Brand />
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          <div className="mx-auto w-full max-w-2xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Bottom tab bar mobile ── */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid border-t border-border bg-card md:hidden"
           style={{ gridTemplateColumns: `repeat(${mobilePrimary.length + 1}, 1fr)` }}>
        {mobilePrimary.map((item) => (
          <BottomLink key={item.to} to={item.to} label={item.label} />
        ))}

        {/* Sheet "Menu" — sisa rute via Radix Dialog */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex min-h-[56px] flex-col items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              Menu
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2 p-4 pt-2">
              {sheetItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[56px] items-center justify-center rounded-lg border border-border bg-secondary/50 px-3 text-sm font-medium transition-colors hover:bg-secondary',
                      isActive && 'border-primary text-primary',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
        P
      </span>
      <div className="leading-tight">
        <div className="text-sm font-bold">PICNIC</div>
        <div className="text-[10px] text-muted-foreground">ER &amp; Intensive Care</div>
      </div>
    </div>
  );
}

function SidebarLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/15 text-primary'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  );
}

function BottomLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'flex min-h-[56px] flex-col items-center justify-center text-xs transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  );
}
