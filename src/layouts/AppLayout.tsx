import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BOTTOM_PRIMARY, SHEET_ITEMS, MenuIcon } from './navItems';
import type { NavItem } from './navItems';

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

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

  /* Close More panel on navigation */
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-secondary)' }}>

      {/* ══════════════════════════════════════════
          DESKTOP: Sidebar (≥ md)
      ══════════════════════════════════════════ */}
      <aside style={{
        width: sidebarExpanded ? 220 : 64,
        flexShrink: 0,
        display: 'none',
        flexDirection: 'column',
        background: 'var(--bg-tertiary)',
        borderRight: '0.5px solid var(--separator)',
        transition: 'width 260ms var(--ease-out)',
        overflow: 'hidden',
      }} className="md-sidebar">

        {/* Sidebar header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: sidebarExpanded ? 'space-between' : 'center',
          padding: sidebarExpanded ? '16px 12px 12px' : '16px 0 12px',
          borderBottom: '0.5px solid var(--separator)',
          flexShrink: 0,
          gap: 8,
          minHeight: 60,
          transition: 'padding 260ms var(--ease-out)',
        }}>
          {sidebarExpanded && <Brand />}
          {!sidebarExpanded && (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--sys-teal)',
              display: 'grid', placeItems: 'center',
              color: '#fff', fontWeight: 900, fontSize: 14,
              flexShrink: 0,
            }}>P</div>
          )}
          <button
            onClick={() => setSidebarExpanded((v) => !v)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              background: 'var(--fill-secondary)',
              color: 'var(--label-secondary)',
              display: 'grid', placeItems: 'center',
              flexShrink: 0,
              transition: 'background var(--dur-fast)',
            }}
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarExpanded
              ? <ChevronLeft size={14} strokeWidth={2} />
              : <ChevronRight size={14} strokeWidth={2} />
            }
          </button>
        </div>

        {/* Sidebar nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 6px' }}>
          {[...BOTTOM_PRIMARY, ...SHEET_ITEMS].map((item) => (
            <SidebarItem key={item.to} item={item} expanded={sidebarExpanded} />
          ))}
        </nav>

        {/* Theme toggle at bottom */}
        <div style={{
          padding: '8px 6px 12px',
          borderTop: '0.5px solid var(--separator)',
          display: 'flex',
          justifyContent: sidebarExpanded ? 'flex-end' : 'center',
        }}>
          <ThemeToggle />
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, minHeight: 0 }}>

        {/* Top nav bar (mobile only) */}
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

        {/* Scrollable content with fade transition */}
        <main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div style={{
            maxWidth: 640,
            margin: '0 auto',
            padding: '0 0 16px',
          }} className="md-content-pad">
            <FadeOutlet pathname={pathname} />
          </div>
        </main>

        {/* ══════════════════════════════════════════
            MOBILE: Bottom Tab Bar — natural flex child (< md)
        ══════════════════════════════════════════ */}
        <nav className="ios-tabbar md-hidden">
          {BOTTOM_PRIMARY.map((item) => (
            <TabItem key={item.to} item={item} />
          ))}

          {/* More button */}
          <button
            className={`ios-tab${moreOpen ? ' is-active' : ''}`}
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 48, height: 28, borderRadius: 14,
              background: moreOpen ? 'rgba(50,173,230,0.15)' : 'transparent',
              transition: 'background 180ms, transform 260ms var(--ease-out)',
              transform: moreOpen ? 'rotate(90deg)' : 'none',
            }}>
              <MenuIcon size={22} strokeWidth={moreOpen ? 2.2 : 1.85} />
            </span>
            <span style={{ fontWeight: moreOpen ? 700 : 500 }}>Menu</span>
          </button>
        </nav>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE: More slide-up panel (< md)
      ══════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className="md-hidden"
        onClick={() => setMoreOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'var(--bg-overlay)',
          opacity: moreOpen ? 1 : 0,
          pointerEvents: moreOpen ? 'auto' : 'none',
          transition: 'opacity 200ms',
        }}
      />

      {/* Panel */}
      <div
        className="md-hidden"
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
          paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px))',
          background: 'var(--bg-elevated)',
          borderRadius: '14px 14px 0 0',
          borderTop: '0.5px solid var(--separator)',
          padding: '12px 16px 20px',
          transform: moreOpen ? 'translateY(0)' : 'translateY(100%)',
          opacity: moreOpen ? 1 : 0,
          transition: 'transform 280ms var(--ease-out), opacity 200ms',
          boxShadow: 'var(--shadow-2)',
        }}
      >
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: 'var(--fill-secondary)',
          margin: '0 auto 16px',
        }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SHEET_ITEMS.map((item) => (
            <MoreGridItem key={item.to} item={item} onNav={() => setMoreOpen(false)} />
          ))}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar      { display: flex !important; }
          .md-hidden       { display: none  !important; }
          .md-content-pad  { padding: 24px 24px 32px !important; }
        }
        @keyframes page-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Fade Outlet ─────────────────────────────────────────────────────────── */
function FadeOutlet({ pathname }: { pathname: string }) {
  return (
    <div key={pathname} style={{ animation: 'page-fade-in 220ms var(--ease-out)' }}>
      <Outlet />
    </div>
  );
}

/* ── Brand ──────────────────────────────────────────────────────────────── */
function Brand({ compact }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 8 : 10, overflow: 'hidden' }}>
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
        <div style={{ lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden' }}>
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
function SidebarItem({ item, expanded }: { item: NavItem; expanded: boolean }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      title={!expanded ? item.label : undefined}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center',
        gap: expanded ? 10 : 0,
        justifyContent: expanded ? 'flex-start' : 'center',
        padding: expanded ? '8px 10px' : '8px 0',
        borderRadius: 10,
        minHeight: 'var(--hit)',
        marginBottom: 2,
        background: isActive ? 'var(--accent-tint)' : 'transparent',
        color: isActive ? 'var(--accent)' : 'var(--label-secondary)',
        fontWeight: isActive ? 600 : 400,
        font: 'var(--type-subheadline)',
        textDecoration: 'none',
        transition: 'background var(--dur-fast), color var(--dur-fast)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
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
          {expanded && item.label}
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
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 28, borderRadius: 14,
            background: isActive ? 'rgba(50,173,230,0.15)' : 'transparent',
            transition: 'background 180ms',
          }}>
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.85} />
          </span>
          <span style={{ fontWeight: isActive ? 700 : 500 }}>
            {item.tabLabel ?? item.shortLabel ?? item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

/* ── More grid item (slide-up panel) ────────────────────────────────────── */
function MoreGridItem({ item, onNav }: { item: NavItem; onNav: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNav}
      style={({ isActive }) => ({
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '16px 8px',
        borderRadius: 'var(--r-card)',
        background: isActive ? 'var(--accent-tint)' : 'var(--fill-tertiary)',
        textDecoration: 'none',
        transition: 'background var(--dur-fast)',
        minHeight: 96,
      })}
    >
      {({ isActive }) => (
        <>
          <span className={item.tint} style={{
            width: 44, height: 44, borderRadius: '30%',
            display: 'grid', placeItems: 'center',
            background: 'var(--tint, var(--accent))',
            color: '#fff',
            boxShadow: 'var(--shadow-1)',
          }}>
            <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
          </span>
          <span style={{
            font: 'var(--type-caption-1)', fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--accent)' : 'var(--label-primary)',
            textAlign: 'center',
          }}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}
