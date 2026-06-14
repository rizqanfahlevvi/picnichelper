import { useState, useMemo } from 'react';
import { Search, AlertTriangle, Info } from 'lucide-react';
import {
  FLUID_LIBRARY, type FluidEntry, type FluidCategory,
} from '../../data/fluidLibrary';
import { Disclaimer } from '../Disclaimer';

const CATEGORY_LABEL: Record<FluidCategory, string> = {
  kristaloid_isotonik:  'Isotonik',
  kristaloid_hipotonik: 'Hipotonik',
  kristaloid_hipertonik:'Hipertonik',
  koloid:               'Koloid',
  darah:                'Produk Darah',
  nutrisi:              'Nutrisi',
  khusus:               'Khusus',
};

const CATEGORY_ORDER: FluidCategory[] = [
  'kristaloid_isotonik','kristaloid_hipotonik','kristaloid_hipertonik',
  'koloid','darah','nutrisi','khusus',
];

const CATEGORY_COLOR: Record<FluidCategory, string> = {
  kristaloid_isotonik:  'var(--sys-blue)',
  kristaloid_hipotonik: 'var(--sys-cyan)',
  kristaloid_hipertonik:'var(--sys-orange)',
  koloid:               'var(--sys-yellow)',
  darah:                'var(--sys-red)',
  nutrisi:              'var(--sys-green)',
  khusus:               'var(--sys-purple)',
};

const TONICITY_COLOR: Record<string, string> = {
  isotonik:   'var(--sys-green)',
  hipotonik:  'var(--sys-cyan)',
  hipertonik: 'var(--sys-red)',
};

export function FluidLibraryView() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FluidCategory | 'semua'>('semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FLUID_LIBRARY.filter((f) => {
      if (activeCategory !== 'semua' && f.category !== activeCategory) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.aliases.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowX: 'hidden', width: '100%' }}>
      {/* Search */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--fill-secondary)', borderRadius: 'var(--r-sm)',
          padding: '8px 12px',
        }}>
          <Search size={16} style={{ color: 'var(--label-tertiary)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari cairan..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 'var(--type-body)', color: 'var(--label-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--label-tertiary)', padding: 0, lineHeight: 1 }}
            >✕</button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          <FilterPill
            label="Semua" active={activeCategory === 'semua'}
            color="var(--accent)" onClick={() => setActiveCategory('semua')}
          />
          {CATEGORY_ORDER.map((cat) => (
            <FilterPill
              key={cat} label={CATEGORY_LABEL[cat]}
              active={activeCategory === cat}
              color={CATEGORY_COLOR[cat]}
              onClick={() => setActiveCategory(cat === activeCategory ? 'semua' : cat)}
            />
          ))}
        </div>
      </div>

      {/* Fluid list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--label-tertiary)', fontSize: 'var(--type-subhead)' }}>
            Tidak ada cairan ditemukan
          </div>
        ) : (
          filtered.map((fluid) => (
            <FluidCard
              key={fluid.id} fluid={fluid}
              expanded={expandedId === fluid.id}
              onToggle={() => setExpandedId(expandedId === fluid.id ? null : fluid.id)}
            />
          ))
        )}
      </div>

      <div style={{ padding: '0 16px' }}>
        <Disclaimer />
      </div>
    </div>
  );
}

function FilterPill({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
        fontSize: 'var(--type-footnote)', fontWeight: active ? 700 : 500,
        background: active ? color : 'var(--fill-secondary)',
        color: active ? '#fff' : 'var(--label-secondary)',
        transition: 'all 0.15s ease',
      }}
    >{label}</button>
  );
}

function FluidCard({ fluid, expanded, onToggle }: {
  fluid: FluidEntry; expanded: boolean; onToggle: () => void;
}) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', borderRadius: 'var(--r-card)',
      overflow: 'hidden',
      boxShadow: expanded ? '0 2px 12px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s ease',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 'var(--type-body)', fontWeight: 600, color: 'var(--label-primary)',
            }}>{fluid.name}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              background: CATEGORY_COLOR[fluid.category] + '22',
              color: CATEGORY_COLOR[fluid.category],
            }}>{CATEGORY_LABEL[fluid.category]}</span>
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <TonicityBadge tonicity={fluid.composition.tonicity} />
            <span style={{ fontSize: 12, color: 'var(--label-tertiary)' }}>
              {fluid.composition.osmolarity} mOsm/L
            </span>
          </div>
        </div>
        <div style={{
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease', color: 'var(--label-tertiary)', flexShrink: 0,
        }}>▶</div>
      </button>

      {/* Detail */}
      {expanded && <FluidDetail fluid={fluid} />}
    </div>
  );
}

function TonicityBadge({ tonicity }: { tonicity: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
      background: TONICITY_COLOR[tonicity] + '22',
      color: TONICITY_COLOR[tonicity],
    }}>{tonicity}</span>
  );
}

function FluidDetail({ fluid }: { fluid: FluidEntry }) {
  const { composition: c } = fluid;

  return (
    <div style={{ borderTop: '1px solid var(--separator)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Komposisi */}
      <section>
        <SectionLabel>Komposisi</SectionLabel>
        <div style={{
          background: 'var(--fill-secondary)', borderRadius: 'var(--r-sm)',
          overflow: 'hidden', marginTop: 6,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--type-footnote)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--separator)' }}>
                {['Elektrolit','mEq/L atau g/L'].map((h) => (
                  <th key={h} style={{
                    padding: '6px 10px', textAlign: h === 'mEq/L atau g/L' ? 'right' : 'left',
                    color: 'var(--label-secondary)', fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.na    !== undefined && <CompRow label="Na⁺"      value={c.na}   unit="mEq/L" />}
              {c.k     !== undefined && <CompRow label="K⁺"       value={c.k}    unit="mEq/L" />}
              {c.cl    !== undefined && <CompRow label="Cl⁻"      value={c.cl}   unit="mEq/L" />}
              {c.ca    !== undefined && <CompRow label="Ca²⁺"     value={c.ca}   unit="mEq/L" />}
              {c.mg    !== undefined && <CompRow label="Mg²⁺"     value={c.mg}   unit="mEq/L" />}
              {c.lactate !== undefined && <CompRow label="Laktat"  value={c.lactate} unit="mEq/L" />}
              {c.acetate !== undefined && <CompRow label="Asetat"  value={c.acetate} unit="mEq/L" />}
              {c.bicarb  !== undefined && <CompRow label="HCO₃⁻"  value={c.bicarb}  unit="mEq/L" />}
              {c.glucose !== undefined && <CompRow label="Glukosa" value={c.glucose} unit="g/L" />}
              {c.pH      !== undefined && <CompRow label="pH"      value={c.pH}  unit="" />}
              {c.kcalPerL !== undefined && <CompRow label="Kalori"  value={c.kcalPerL} unit="kcal/L" />}
              <CompRow label="Osmolarity" value={c.osmolarity} unit="mOsm/L" highlight />
            </tbody>
          </table>
        </div>
      </section>

      {/* Indikasi */}
      {fluid.indications.length > 0 && (
        <section>
          <SectionLabel color="var(--sys-green)">Indikasi</SectionLabel>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fluid.indications.map((ind, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Info size={14} style={{ color: 'var(--sys-green)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--type-footnote)', color: 'var(--label-primary)', lineHeight: 1.5 }}>{ind}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Perhatian */}
      {fluid.cautions.length > 0 && (
        <section>
          <SectionLabel color="var(--sys-orange)">Perhatian</SectionLabel>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fluid.cautions.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertTriangle size={14} style={{ color: 'var(--sys-orange)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--type-footnote)', color: 'var(--label-primary)', lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catatan */}
      {fluid.notes && (
        <section>
          <div style={{
            background: 'var(--sys-blue)11', border: '1px solid var(--sys-blue)33',
            borderRadius: 'var(--r-sm)', padding: '10px 12px',
          }}>
            <span style={{ fontSize: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
              {fluid.notes}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}

function CompRow({ label, value, unit, highlight }: {
  label: string; value: number; unit: string; highlight?: boolean;
}) {
  return (
    <tr style={{ borderBottom: '1px solid var(--separator)' }}>
      <td style={{
        padding: '6px 10px', color: highlight ? 'var(--label-primary)' : 'var(--label-secondary)',
        fontWeight: highlight ? 700 : 400,
      }}>{label}</td>
      <td style={{
        padding: '6px 10px', textAlign: 'right',
        color: highlight ? 'var(--label-primary)' : 'var(--label-primary)',
        fontWeight: highlight ? 700 : 500, fontFamily: 'var(--font-mono)',
      }}>{value}{unit ? ` ${unit}` : ''}</td>
    </tr>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 'var(--type-footnote)', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.06em', color: color ?? 'var(--label-secondary)',
    }}>{children}</span>
  );
}
