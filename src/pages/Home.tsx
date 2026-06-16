import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search, X, ChevronRight,
  Wind, Zap, Droplets, FlaskConical,
  Calculator, Syringe, BarChart2, BookOpen, Activity, BookMarked,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PatientSummary } from '../components/PatientSummary';
import { DRUG_LIBRARY, DRUG_CATEGORY_LABEL } from '../data/drugLibrary';
import { FLUID_LIBRARY, FLUID_CATEGORY_LABEL } from '../data/fluidLibrary';

/* ── Static data ──────────────────────────────────────────────────────────── */

const STATS = [
  { value: '8',   label: 'Kalkulator', color: 'var(--sys-teal)'   },
  { value: '146', label: 'Obat',       color: 'var(--sys-indigo)' },
  { value: '7',   label: 'Skoring',    color: 'var(--sys-orange)' },
  { value: '54',  label: 'Referensi',  color: 'var(--sys-green)'  },
];

interface QuickItem { to: string; label: string; sub: string; icon: LucideIcon; tintColor: string; }
const QUICK_ACCESS: QuickItem[] = [
  { to: '/kalkulator?c=ett',   label: 'ETT & Intubasi',  sub: 'Ukuran & kedalaman',   icon: Wind,         tintColor: 'var(--sys-teal)' },
  { to: '/kalkulator?c=dosis', label: 'Dosis Emergensi', sub: 'Per BB — PALS 2020',   icon: Zap,          tintColor: 'var(--sys-red)'  },
  { to: '/drugs-fluids',       label: 'Cairan Rumatan',  sub: 'Holliday-Segar 4-2-1', icon: Droplets,     tintColor: 'var(--sys-blue)' },
  { to: '/kalkulator?c=agd',   label: 'Gas Darah',       sub: 'Boston Rules · P/F',   icon: FlaskConical, tintColor: 'var(--sys-teal)' },
];

interface ModuleItem { to: string; icon: LucideIcon; tint: string; label: string; sub: string; }
const MODULES: ModuleItem[] = [
  { to: '/kalkulator',   icon: Calculator, tint: 'tint-resp',   label: 'Kalkulator',     sub: 'ETT · AGD · Elektrolit · Gizi'     },
  { to: '/drugs-fluids', icon: Syringe,    tint: 'tint-drug',   label: 'Drugs & Fluids', sub: '146 obat · kalkulator cairan'      },
  { to: '/skoring',      icon: BarChart2,  tint: 'tint-score',  label: 'Skoring Klinis', sub: 'PELOD-2 · pSOFA · Downes · pGCS'  },
  { to: '/teori',        icon: BookOpen,   tint: 'tint-theory', label: 'Teori & Klinis', sub: 'Sepsis · Syok · Ventilasi'         },
  { to: '/monitoring',   icon: Activity,   tint: 'tint-vital',  label: 'Ventilasi',      sub: 'Persiapan · Setting · Weaning'     },
  { to: '/referensi',    icon: BookMarked, tint: 'tint-theory', label: 'Referensi',      sub: '54 pustaka & sitasi'              },
];

/* ── Search index ─────────────────────────────────────────────────────────── */

interface SearchItem { label: string; sub: string; to: string; category: string; aliases?: string[]; }

const BASE_SEARCH: SearchItem[] = [
  { label: 'ETT & Intubasi',     sub: 'Ukuran tube + kedalaman insersi',  to: '/kalkulator?c=ett',        category: 'Kalkulator' },
  { label: 'Dosis Emergensi',    sub: 'Obat resusitasi berbasis berat',   to: '/kalkulator?c=dosis',      category: 'Kalkulator' },
  { label: 'Syringe Pump',       sub: 'Kecepatan infus kontinu',          to: '/kalkulator?c=syringe',    category: 'Kalkulator' },
  { label: 'Analisis Gas Darah', sub: 'Boston Rules · AG · P/F Ratio',    to: '/kalkulator?c=agd',        category: 'Kalkulator' },
  { label: 'Elektrolit',         sub: 'Na · K · Ca · Mg koreksi',        to: '/kalkulator?c=elektrolit', category: 'Kalkulator' },
  { label: 'Tekanan Darah',      sub: 'Klasifikasi HTN — AAP 2017',      to: '/kalkulator?c=bp',         category: 'Kalkulator' },
  { label: 'Kalkulator Renal',   sub: 'eGFR Schwartz · Protein:Cr · UO', to: '/kalkulator?c=renal',      category: 'Kalkulator' },
  { label: 'Status Gizi',        sub: 'Z-score WHO/CDC · BBI · HA · WA', to: '/kalkulator?c=gizi',       category: 'Kalkulator' },
  { label: 'pGCS',               sub: 'Kesadaran — modifikasi pediatri',  to: '/skoring',                 category: 'Skoring'    },
  { label: 'PEWS',               sub: 'Deteksi dini deteriorasi',         to: '/skoring',                 category: 'Skoring'    },
  { label: 'Apgar Score',        sub: 'Evaluasi bayi baru lahir',         to: '/skoring',                 category: 'Skoring'    },
  { label: 'Downes Score',       sub: 'Distres napas neonatus',           to: '/skoring',                 category: 'Skoring'    },
  { label: 'PELOD-2',            sub: 'Disfungsi organ pediatri',         to: '/skoring',                 category: 'Skoring'    },
  { label: 'pSOFA',              sub: 'Sepsis organ failure — anak',      to: '/skoring',                 category: 'Skoring'    },
  { label: 'CRIB-II',            sub: 'Risiko klinis neonatus',           to: '/skoring',                 category: 'Skoring'    },
  { label: 'Drugs & Fluids',     sub: 'Drug library + kalkulator cairan', to: '/drugs-fluids',            category: 'Menu'       },
  { label: 'Teori & Klinis',     sub: 'Panduan klinis pediatri',          to: '/teori',                   category: 'Menu'       },
  { label: 'Ventilasi',          sub: 'Persiapan · Setting · Weaning',    to: '/monitoring',              category: 'Menu'       },
  { label: 'Referensi',          sub: 'Daftar pustaka & sitasi',          to: '/referensi',               category: 'Menu'       },
];

/* Build drug + fluid search items at module load time */
const DRUG_SEARCH: SearchItem[] = DRUG_LIBRARY.map((drug) => ({
  label:    drug.name,
  sub:      DRUG_CATEGORY_LABEL[drug.category],
  to:       '/drugs-fluids',
  category: 'Obat',
  aliases:  drug.aliases,
}));

const FLUID_SEARCH: SearchItem[] = FLUID_LIBRARY.map((fluid) => ({
  label:    fluid.name,
  sub:      FLUID_CATEGORY_LABEL[fluid.category],
  to:       '/drugs-fluids',
  category: 'Cairan',
}));

const ALL_SEARCH: SearchItem[] = [...BASE_SEARCH, ...DRUG_SEARCH, ...FLUID_SEARCH];

/* ── Component ────────────────────────────────────────────────────────────── */

export function Home() {
  const navigate = useNavigate();
  const [query, setQuery]           = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef   = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_SEARCH.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false)
        );
      }).slice(0, 10)
    : [];

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function handleSelect(item: SearchItem) {
    navigate(item.to);
    setQuery('');
    setSearchOpen(false);
  }

  return (
    <div className="ios-screen pb-6">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 20px 20px' }}>

        {/* Badge pill — normal case, no uppercase */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '4px 12px', borderRadius: 100,
          background: 'color-mix(in srgb, var(--sys-teal) 14%, transparent)',
          marginBottom: 16,
        }}>
          <span style={{
            font: 'var(--type-caption-1)', fontWeight: 600,
            color: 'var(--sys-teal)',
          }}>
            Ur Daily Companion in Pediatric Emergency &amp; Intensive Care
          </span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 12, lineHeight: 1 }}>
          <span style={{
            fontWeight: 900,
            fontSize: 'clamp(42px, 10vw, 58px)',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--sys-teal) 0%, var(--sys-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>PICNIC</span>
          <span style={{
            fontWeight: 900,
            fontSize: 'clamp(42px, 10vw, 58px)',
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}> Helper</span>
        </div>

        {/* Subtitle */}
        <p style={{
          font: 'var(--type-body)', color: 'var(--label-secondary)',
          lineHeight: 1.55, maxWidth: 320, marginBottom: 18,
        }}>
          Alat bantu klinis cepat untuk kasus IGD, PICU, NICU.
        </p>

        {/* LinkedIn / Author */}
        <a
          href="https://id.linkedin.com/in/rizqanfahlevvi/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            textDecoration: 'none', color: '#0077B5',
          }}
        >
          <LinkedInIcon />
          <span style={{
            font: 'var(--type-caption-1)', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            Made by Rizqanfahlevvi
          </span>
        </a>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8, padding: '0 16px 8px',
      }}>
        {STATS.map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--r-card)',
            padding: '10px 8px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-1)',
          }}>
            <div style={{
              fontWeight: 800, fontSize: 22, lineHeight: 1,
              color: s.color, marginBottom: 3,
              fontVariantNumeric: 'tabular-nums',
            }}>{s.value}</div>
            <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', lineHeight: 1.2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div ref={wrapperRef} style={{ padding: '8px 16px 0', position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--fill-secondary)',
          borderRadius: 'var(--r-card)',
          padding: '0 14px', height: 44,
          border: searchOpen && query ? '1.5px solid var(--accent)' : '1.5px solid transparent',
          transition: 'border-color 180ms',
        }}>
          <Search size={16} strokeWidth={2} style={{ color: 'var(--label-tertiary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => { if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); } }}
            placeholder="Cari kalkulator, obat, cairan, skoring..."
            style={{
              flex: 1, border: 'none', background: 'transparent',
              outline: 'none', font: 'var(--type-body)', color: 'var(--label-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setSearchOpen(false); inputRef.current?.focus(); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--label-tertiary)', display: 'grid', placeItems: 'center', padding: 0,
              }}
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {searchOpen && query && (
          <div style={{
            position: 'absolute', left: 16, right: 16, top: 52, zIndex: 100,
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--r-card)',
            boxShadow: 'var(--shadow-2)',
            border: '0.5px solid var(--separator)',
            overflow: 'hidden',
            maxHeight: 320, overflowY: 'auto',
          }}>
            {filtered.length > 0 ? filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 2,
                  padding: '10px 14px', width: '100%',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: 'transparent',
                  borderBottom: i < filtered.length - 1 ? '0.5px solid var(--separator)' : 'none',
                  transition: 'background var(--dur-fast)',
                }}
                onPointerEnter={(e) => (e.currentTarget.style.background = 'var(--fill-secondary)')}
                onPointerLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    font: 'var(--type-subheadline)', fontWeight: 500,
                    color: 'var(--label-primary)', flex: 1,
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    font: 'var(--type-caption-2)', color: 'var(--accent)',
                    background: 'var(--accent-tint)',
                    padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                  }}>{item.category}</span>
                </div>
                <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
                  {item.sub}
                </span>
              </button>
            )) : (
              <div style={{ padding: '20px 14px', textAlign: 'center' }}>
                <span style={{ font: 'var(--type-body)', color: 'var(--label-secondary)' }}>
                  Tidak ditemukan untuk "{query}"
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Patient Summary ───────────────────────────────────────────────── */}
      <PatientSummary />

      {/* ── Quick Access ──────────────────────────────────────────────────── */}
      <div className="ios-section"><span className="label">Akses Cepat</span></div>
      <div style={{ padding: '4px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {QUICK_ACCESS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              padding: '14px 12px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--r-card)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              display: 'grid', placeItems: 'center',
              background: `color-mix(in srgb, ${item.tintColor} 15%, var(--bg-tertiary))`,
              color: item.tintColor,
            }}>
              <item.icon size={18} strokeWidth={2} />
            </div>
            <div>
              <p style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', marginBottom: 2 }}>
                {item.label}
              </p>
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.3 }}>
                {item.sub}
              </p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* ── All Modules ───────────────────────────────────────────────────── */}
      <div className="ios-section" style={{ marginTop: 16 }}><span className="label">Semua Modul</span></div>
      <div className="ios-list">
        {MODULES.map((item) => (
          <NavLink key={item.to} to={item.to} className={`ios-row ${item.tint}`}>
            <span className="ios-row-icon"><item.icon size={18} strokeWidth={1.75} color="#fff" /></span>
            <span className="ios-row-text">
              <span className="ios-row-label">{item.label}</span>
              <span className="ios-row-sub">{item.sub}</span>
            </span>
            <ChevronRight size={16} className="ios-chevron" />
          </NavLink>
        ))}
      </div>

      <div className="ios-disclaimer" style={{ marginTop: 24 }}>
        <AlertTriangle size={12} />
        <span>Untuk panduan klinis · bukan pengganti penilaian klinis profesional</span>
      </div>
    </div>
  );
}

/* ── LinkedIn Icon ───────────────────────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
