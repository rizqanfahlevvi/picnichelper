import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ThemeToggle } from '../components/ThemeToggle';
import { BOTTOM_PRIMARY, SHEET_ITEMS, MenuIcon } from './navItems';
import type { NavItem } from './navItems';

/* Page titles untuk ios-nav-title */
const PAGE_TITLES: Record<string, string> = {
  '/':             'Home',
  '/kalkulator':   'Kalkulator',
  '/drugs-fluids': 'Drugs & Fluids',
  '/skoring':      'Skoring Klinis',
  '/teori':        'Teori & Klinis',
  '/monitoring':   'Monitoring & Weaning',
  '/referensi':    'Referensi',
};

export function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'PICNIC Helper';
  const isHome = pathname === '/';

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-secondary)' }}>

      {/* ══════════════════════════════════════════
          DESKTOP: Sidebar (≥ md)
      ══════════════════════════════════════════ */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        display: 'none',    /* override via CSS media query below */
        flexDirection: 'column',
        background: 'var(--bg-tertiary)',
        borderRight: '0.5px solid var(--separator)',
      }} className="md-sidebar">
        {/* Sidebar header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 12px',
          borderBottom: '0.5px solid var(--separator)',
        }}>
          <Brand />
          <ThemeToggle />
        </div>
        {/* Sidebar nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {[...BOTTOM_PRIMARY, ...SHEET_ITEMS].map((item) => (
            <SidebarItem key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>

        {/* ── Top nav bar (mobile only) ── */}
        <header
          className={`ios-nav md-hidden ${isHome ? 'ios-nav--plain' : ''}`}
          style={{ justifyContent: 'space-between' }}
        >
          <Brand compact />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {!isHome && (
              <span className="ios-nav-title" style={{ marginRight: 4 }}>{title}</span>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{
            maxWidth: 640,
            margin: '0 auto',
            /* Padding bottom: ruang untuk tab bar mobile + safe area */
            padding: '0 0 96px',
          }} className="md-content-pad">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE: Bottom Tab Bar (< md)
      ══════════════════════════════════════════ */}
      <nav className="ios-tabbar md-hidden">
        {BOTTOM_PRIMARY.map((item) => (
          <TabItem key={item.to} item={item} />
        ))}

        {/* Menu → Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="ios-tab" aria-selected={false}>
              <MenuIcon size={24} strokeWidth={1.75} />
              <span>Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="ios-list" style={{ margin: '8px 16px 32px' }}>
              {SHEET_ITEMS.map((item) => (
                <SheetItem key={item.to} item={item} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Responsive styles injected via <style> tag */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar { display: flex !important; }
          .md-hidden  { display: none  !important; }
          .md-content-pad { padding: 24px 24px 32px !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Brand ──────────────────────────────────────────────────────────────── */
function Brand({ compact }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 8 : 10 }}>
      <div style={{
        width: compact ? 28 : 32, height: compact ? 28 : 32,
        borderRadius: 8, flexShrink: 0,
        background: 'var(--sys-teal)',
        display: 'grid', placeItems: 'center',
        color: '#fff', fontWeight: 900,
        fontSize: compact ? 12 : 14,
        boxShadow: 'var(--shadow-1)',
      }}>P</div>
      {!compact && (
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ font: 'var(--type-headline)', letterSpacing: '-0.022em', color: 'var(--label-primary)' }}>
            PICNIC
          </div>
          <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)' }}>
            ER &amp; Intensive Care
          </div>
        </div>
      )}
      {compact && (
        <span style={{ font: 'var(--type-headline)', letterSpacing: '-0.022em', color: 'var(--label-primary)' }}>
          PICNIC
        </span>
      )}
    </div>
  );
}

/* ── Sidebar item (desktop) ─────────────────────────────────────────────── */
function SidebarItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px', borderRadius: 10,
        minHeight: 'var(--hit)',
        marginBottom: 2,
        background: isActive ? 'var(--accent-tint)' : 'transparent',
        color: isActive ? 'var(--accent)' : 'var(--label-secondary)',
        fontWeight: isActive ? 600 : 400,
        font: 'var(--type-subheadline)',
        textDecoration: 'none',
        transition: 'background var(--dur-fast), color var(--dur-fast)',
      })}
    >
      {({ isActive }) => (
        <>
          <span className={item.tint} style={{
            width: 28, height: 28, borderRadius: '30%', flexShrink: 0,
            display: 'grid', placeItems: 'center',
            background: isActive ? 'var(--tint, var(--accent))' : 'var(--fill-secondary)',
            color: isActive ? '#fff' : 'var(--label-secondary)',
            transition: 'background var(--dur-fast)',
          }}>
            <Icon size={16} strokeWidth={isActive ? 2.25 : 1.75} />
          </span>
          {item.label}
        </>
      )}
    </NavLink>
  );
}

/* ── Tab bar item (mobile) ──────────────────────────────────────────────── */
function TabItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) => `ios-tab${isActive ? ' is-active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <Icon size={24} strokeWidth={isActive ? 2.25 : 1.75} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

/* ── Sheet item ─────────────────────────────────────────────────────────── */
function SheetItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={`ios-row ${item.tint}`}
    >
      {({ isActive }) => (
        <>
          <span className="ios-row-icon">
            <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} color="#fff" />
          </span>
          <span className="ios-row-text">
            <span className="ios-row-label">{item.label}</span>
          </span>
        </>
      )}
    </NavLink>
  );
}
