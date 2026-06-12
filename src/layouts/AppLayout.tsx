import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';
import { cn } from '../components/ui/cn';

// Navigasi hibrida responsif (CLAUDE.md):
//  - Desktop (≥ md): sidebar statis kiri, 7 menu permanen.
//  - Mobile (< md): bottom tab bar (item primaryMobile) + tombol "Menu"
//    membuka Sheet berisi sisa rute.

export function AppLayout() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const mobilePrimary = NAV_ITEMS.filter((n) => n.primaryMobile);
  const sheetItems = NAV_ITEMS.filter((n) => !n.primaryMobile);

  return (
    <div className="flex h-full">
      {/* ── Sidebar desktop ── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:flex">
        <Brand />
        <nav className="mt-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>
      </aside>

      {/* ── Area konten ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 md:hidden">
          <Brand />
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          <div className="mx-auto w-full max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Bottom tab bar mobile ── */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden">
        {mobilePrimary.map((item) => (
          <BottomLink key={item.to} to={item.to} label={item.label} />
        ))}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex min-h-[56px] flex-col items-center justify-center text-xs text-[var(--color-text-muted)]"
        >
          Menu
        </button>
      </nav>

      {/* ── Sheet "Menu" (sisa rute) ── */}
      {sheetOpen && (
        <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--color-border)]" />
            <div className="grid grid-cols-2 gap-2">
              {sheetItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSheetOpen(false)}
                  className="min-h-[56px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm font-medium"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-black text-[var(--color-bg)]">
        P
      </span>
      <div className="leading-tight">
        <div className="text-sm font-bold">PICNIC</div>
        <div className="text-[10px] text-[var(--color-text-muted)]">ER &amp; Intensive Care</div>
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
          'min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]',
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
          'flex min-h-[56px] flex-col items-center justify-center px-1 text-center text-xs',
          isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]',
        )
      }
    >
      {label}
    </NavLink>
  );
}
