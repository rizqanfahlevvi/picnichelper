import { useState, useMemo } from 'react';
import { Search, AlertTriangle, Info, X, XCircle } from 'lucide-react';
import {
  FLUID_LIBRARY, type FluidEntry, type FluidCategory,
} from '../../data/fluidLibrary';
import { REFERENCES } from '../../data/references';
import { Disclaimer } from '../Disclaimer';

const PAGE_SIZE = 10;

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
  const [selectedFluid, setSelectedFluid] = useState<FluidEntry | null>(null);
  const [page, setPage] = useState(1);

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

  const usePagination = activeCategory === 'semua' && !query.trim();
  const totalPages = usePagination ? Math.ceil(filtered.length / PAGE_SIZE) : 1;
  const paginated = usePagination
    ? filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filtered;

  function handleCategoryChange(cat: FluidCategory | 'semua') {
    setActiveCategory(cat);
    setPage(1);
  }

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
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari cairan..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 'var(--type-body)', color: 'var(--label-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setPage(1); }}
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
            color="var(--accent)" onClick={() => handleCategoryChange('semua')}
          />
          {CATEGORY_ORDER.map((cat) => (
            <FilterPill
              key={cat} label={CATEGORY_LABEL[cat]}
              active={activeCategory === cat}
              color={CATEGORY_COLOR[cat]}
              onClick={() => handleCategoryChange(cat === activeCategory ? 'semua' : cat)}
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
          paginated.map((fluid) => (
            <FluidCard
              key={fluid.id}
              fluid={fluid}
              onSelect={() => setSelectedFluid(fluid)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {usePagination && totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 6, padding: '4px 16px 8px',
        }}>
          <PageBtn label="‹" disabled={page === 1} onClick={() => setPage(p => p - 1)} />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageBtn
              key={p} label={String(p)} active={p === page}
              onClick={() => setPage(p)}
            />
          ))}
          <PageBtn label="›" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
        <Disclaimer />
      </div>

      {/* Modal */}
      {selectedFluid && (
        <FluidModal fluid={selectedFluid} onClose={() => setSelectedFluid(null)} />
      )}
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

function PageBtn({ label, active, disabled, onClick }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8,
        border: 'none', cursor: disabled ? 'default' : 'pointer',
        fontSize: 'var(--type-footnote)', fontWeight: active ? 700 : 500,
        background: active ? 'var(--accent)' : 'var(--fill-secondary)',
        color: active ? '#fff' : disabled ? 'var(--label-quaternary)' : 'var(--label-primary)',
        transition: 'background 0.15s ease',
      }}
    >{label}</button>
  );
}

function FluidCard({ fluid, onSelect }: { fluid: FluidEntry; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%', background: 'var(--bg-secondary)', borderRadius: 'var(--r-card)',
        border: 'none', cursor: 'pointer', textAlign: 'left', padding: '12px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        display: 'flex', alignItems: 'center', gap: 10,
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.985)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--type-body)', fontWeight: 600, color: 'var(--label-primary)' }}>
            {fluid.name}
          </span>
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
      <span style={{ color: 'var(--label-quaternary)', fontSize: 14, flexShrink: 0 }}>›</span>
    </button>
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

function FluidModal({ fluid, onClose }: { fluid: FluidEntry; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        } as React.CSSProperties}
      />

      {/* Modal card */}
      <div style={{
        position: 'fixed', zIndex: 101,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(520px, calc(100vw - 32px))',
        maxHeight: 'calc(100dvh - 80px)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-primary)', borderRadius: 'var(--r-sheet)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Sticky header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '16px 16px 12px',
          borderBottom: '1px solid var(--separator)',
          background: 'var(--bg-primary)',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--type-headline)', fontWeight: 700, color: 'var(--label-primary)' }}>
                {fluid.name}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: CATEGORY_COLOR[fluid.category] + '22',
                color: CATEGORY_COLOR[fluid.category],
              }}>{CATEGORY_LABEL[fluid.category]}</span>
            </div>
            {fluid.aliases.length > 0 && (
              <div style={{ marginTop: 4, fontSize: 'var(--type-footnote)', color: 'var(--label-tertiary)' }}>
                {fluid.aliases.join(' · ')}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--fill-secondary)', border: 'none', borderRadius: '50%',
              width: 28, height: 28, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--label-secondary)',
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <FluidDetail fluid={fluid} />
        </div>
      </div>
    </>
  );
}

function FluidDetail({ fluid }: { fluid: FluidEntry }) {
  const { composition: c } = fluid;

  const refs = (fluid.references ?? [])
    .map((key) => REFERENCES[key])
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);

  return (
    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

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
              {c.na    !== undefined && <CompRow label="Na⁺"      value={c.na}      unit="mEq/L" />}
              {c.k     !== undefined && <CompRow label="K⁺"       value={c.k}       unit="mEq/L" />}
              {c.cl    !== undefined && <CompRow label="Cl⁻"      value={c.cl}      unit="mEq/L" />}
              {c.ca    !== undefined && <CompRow label="Ca²⁺"     value={c.ca}      unit="mEq/L" />}
              {c.mg    !== undefined && <CompRow label="Mg²⁺"     value={c.mg}      unit="mEq/L" />}
              {c.lactate  !== undefined && <CompRow label="Laktat"  value={c.lactate} unit="mEq/L" />}
              {c.acetate  !== undefined && <CompRow label="Asetat"  value={c.acetate} unit="mEq/L" />}
              {c.bicarb   !== undefined && <CompRow label="HCO₃⁻"  value={c.bicarb}  unit="mEq/L" />}
              {c.glucose  !== undefined && <CompRow label="Glukosa" value={c.glucose} unit="g/L" />}
              {c.pH       !== undefined && <CompRow label="pH"      value={c.pH}      unit="" />}
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

      {/* Kontraindikasi */}
      {fluid.contraindications && fluid.contraindications.length > 0 && (
        <section>
          <SectionLabel color="var(--sys-red)">Kontraindikasi</SectionLabel>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fluid.contraindications.map((ci, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <XCircle size={14} style={{ color: 'var(--sys-red)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--type-footnote)', color: 'var(--label-primary)', lineHeight: 1.5 }}>{ci}</span>
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
            {fluid.cautions.map((caut, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertTriangle size={14} style={{ color: 'var(--sys-orange)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--type-footnote)', color: 'var(--label-primary)', lineHeight: 1.5 }}>{caut}</span>
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

      {/* Referensi */}
      {refs.length > 0 && (
        <section style={{ borderTop: '1px solid var(--separator)', paddingTop: 12 }}>
          <SectionLabel>Referensi</SectionLabel>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {refs.map((ref) => (
              <div key={ref.id} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                  flexShrink: 0, marginTop: 2,
                }}>[{ref.id}]</span>
                <span style={{ fontSize: 11, color: 'var(--label-tertiary)', lineHeight: 1.5 }}>
                  {ref.citation}
                </span>
              </div>
            ))}
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
        padding: '6px 10px', color: 'var(--label-secondary)',
        fontWeight: highlight ? 700 : 400,
      }}>{label}</td>
      <td style={{
        padding: '6px 10px', textAlign: 'right',
        color: 'var(--label-primary)',
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
