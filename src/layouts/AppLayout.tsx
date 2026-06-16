import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BOTTOM_PRIMARY, SHEET_ITEMS, MenuIcon } from './navItems';
import type { NavItem, SubNavItem } from './navItems';

const PAGE_TITLES: Record<string, string> = {
  '/':             'Home',
  '/kalkulator':   'Kalkulator',
  '/drugs-fluids': 'Drugs & Fluids',
  '/skoring':      'Skoring Klinis',
  '/teori':        'Teori & Klinis',
  '/monitoring':   'Ventilasi',
  '/referensi':    'Referensi',
};

export function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'PICNIC Helper';
  const isHome = pathname === '/';

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  /* Close More panel on navigation */
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  function handleToggleSection(to: string) {
    setOpenSection((prev) => (prev === to ? null : to));
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-secondary)' }}>

      {/* ══════════════════════════════════════════
          DESKTOP: Sidebar (≥ md)
      ══════════════════════════════════════════ */}
      <aside style={{
        width: sidebarExpanded ? 220 : 60,
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
          padding: sidebarExpanded ? '0 12px' : '0',
          borderBottom: '0.5px solid var(--separator)',
          flexShrink: 0,
          gap: 8,
          height: 56,
          transition: 'padding 260ms var(--ease-out)',
        }}>
          {sidebarExpanded && (
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'var(--sys-teal)',
              display: 'grid', placeItems: 'center',
              color: '#fff', fontWeight: 900, fontSize: 13,
              flexShrink: 0,
            }}>P</div>
          )}
          {!sidebarExpanded && (
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'var(--sys-teal)',
              display: 'grid', placeItems: 'center',
              color: '#fff', fontWeight: 900, fontSize: 13,
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
            <SidebarItem
              key={item.to}
              item={item}
              expanded={sidebarExpanded}
              openSection={openSection}
              onToggleSection={handleToggleSection}
            />
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

        {/* Desktop top bar (≥ md) */}
        <header className="md-topbar" style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 56,
          borderBottom: '0.5px solid var(--separator)',
          background: 'var(--bg-elevated)',
          flexShrink: 0,
        }}>
          <Brand />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Clock />
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile top nav bar */}
        <header
          className={`ios-nav md-hidden ${isHome ? 'ios-nav--plain' : ''}`}
          style={{ justifyContent: 'space-between' }}
        >
          <Brand compact />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {!isHome && (
              <span className="ios-nav-title" style={{ marginRight: 4 }}>{title}</span>
            )}
            <button
              onClick={() => window.location.reload()}
              title="Muat ulang aplikasi"
              style={{
                width: 32, height: 32, borderRadius: '50%',
                border: 'none', cursor: 'pointer',
                background: 'var(--fill-secondary)',
                color: 'var(--label-secondary)',
                display: 'grid', placeItems: 'center',
              }}
            >
              <RotateCcw size={15} strokeWidth={2} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable content with fade transition */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, overscrollBehaviorY: 'none' }}>
          <div style={{ margin: '0 auto', padding: '0 0 16px' }} className="md-content-pad">
            <TabFade pathname={pathname} />
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
          paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
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
          .md-sidebar      { display: flex    !important; }
          .md-hidden       { display: none    !important; }
          .md-topbar       { display: flex    !important; }
          .md-content-pad  { padding: 24px 32px 32px !important; max-width: 960px !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Clock ───────────────────────────────────────────────────────────────── */
function Clock() {
  const fmt = () => new Date().toLocaleTimeString('id-ID', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      fontVariantNumeric: 'tabular-nums',
      font: 'var(--type-body)',
      color: 'var(--label-secondary)',
      letterSpacing: '0.02em',
      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    }}>
      {time}
    </span>
  );
}

/* ── Tab Fade ────────────────────────────────────────────────────────────── */
function TabFade({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname === currentPath) return;
    setVisible(false);
    const t = setTimeout(() => {
      setCurrentPath(pathname);
      setVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [pathname, currentPath]);

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 180ms' }}>
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
            PICNIC Helper
          </div>
          <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)' }}>
            Pediatric ER &amp; Intensive Care
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
const itemBaseStyle = (isActive: boolean, expanded: boolean): React.CSSProperties => ({
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
  width: '100%',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
});

const iconBaseStyle = (isActive: boolean): React.CSSProperties => ({
  width: 28, height: 28, borderRadius: '30%', flexShrink: 0,
  display: 'grid', placeItems: 'center',
  background: isActive ? 'var(--tint, var(--accent))' : 'var(--fill-secondary)',
  color: isActive ? '#fff' : 'var(--label-secondary)',
  transition: 'background var(--dur-fast)',
});

function SidebarItem({ item, expanded, openSection, onToggleSection }: {
  item: NavItem;
  expanded: boolean;
  openSection: string | null;
  onToggleSection: (to: string) => void;
}) {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const hasSubItems = !!(item.subItems?.length);
  const isSubOpen = openSection === item.to;
  const isActive = item.to === '/'
    ? pathname === '/'
    : pathname.startsWith(item.to);

  /* With sub-items AND sidebar expanded → accordion toggle button */
  if (hasSubItems && expanded) {
    return (
      <div>
        <button
          onClick={() => onToggleSection(item.to)}
          style={itemBaseStyle(isActive, expanded)}
        >
          <span className={item.tint} style={iconBaseStyle(isActive)}>
            <Icon size={16} strokeWidth={isActive ? 2.25 : 1.75} />
          </span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.label}
          </span>
          <ChevronRight
            size={12}
            strokeWidth={2}
            style={{
              flexShrink: 0,
              marginRight: 2,
              transform: isSubOpen ? 'rotate(90deg)' : 'none',
              transition: 'transform 200ms var(--ease-out)',
            }}
          />
        </button>

        {/* Sub-items list */}
        <div style={{
          overflow: 'hidden',
          maxHeight: isSubOpen ? item.subItems!.length * 38 : 0,
          transition: 'max-height 220ms var(--ease-out)',
        }}>
          <div style={{ paddingLeft: 6, paddingBottom: 4 }}>
            {item.subItems!.map((sub) => (
              <SubSidebarItem key={sub.id} sub={sub} parentTo={item.to} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Collapsed or no sub-items → standard NavLink */
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      title={!expanded ? item.label : undefined}
      style={({ isActive: navActive }) => ({
        ...itemBaseStyle(navActive, expanded),
        // override width/border/cursor for NavLink (flex child)
        width: 'auto',
      })}
    >
      {({ isActive: navActive }) => (
        <>
          <span className={item.tint} style={iconBaseStyle(navActive)}>
            <Icon size={16} strokeWidth={navActive ? 2.25 : 1.75} />
          </span>
          {expanded && item.label}
        </>
      )}
    </NavLink>
  );
}

/* ── Sidebar sub-item ────────────────────────────────────────────────────── */
function SubSidebarItem({ sub, parentTo }: { sub: SubNavItem; parentTo: string }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const Icon = sub.icon;
  const params = new URLSearchParams(search);
  const isActive = pathname === parentTo && params.get('c') === sub.id;

  return (
    <button
      onClick={() => navigate(`${parentTo}?c=${sub.id}`)}
      style={{
        display: 'flex', alignItems: 'center',
        gap: 8, padding: '6px 10px 6px 6px',
        borderRadius: 8,
        minHeight: 34,
        marginBottom: 1,
        width: '100%', border: 'none', cursor: 'pointer',
        textAlign: 'left',
        background: isActive ? 'var(--accent-tint)' : 'transparent',
        color: isActive ? 'var(--accent)' : 'var(--label-secondary)',
        fontWeight: isActive ? 600 : 400,
        font: 'var(--type-footnote)',
        transition: 'background var(--dur-fast)',
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}
    >
      <Icon size={13} strokeWidth={isActive ? 2.25 : 1.75} style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.label}</span>
    </button>
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
