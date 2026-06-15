import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronRight, AlertTriangle, Info, BookOpen, X } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import {
  DRUG_LIBRARY, DRUG_CATEGORY_LABEL, DRUG_CATEGORY_ORDER,
  type DrugEntry, type DrugCategory, type DrugRoute,
} from '../../data/drugLibrary';
import { REFERENCES } from '../../data/references';
import { calculateDose, formatDose, isSingleDose } from '../../utils/drugDose';
import { Disclaimer } from '../Disclaimer';

const ROUTE_COLOR: Record<string, string> = {
  IV:         'var(--sys-red)',
  PO:         'var(--sys-green)',
  IM:         'var(--sys-orange)',
  SC:         'var(--sys-orange)',
  Inhalasi:   'var(--sys-cyan)',
  Rektal:     'var(--sys-purple)',
  Intranasal: 'var(--sys-cyan)',
  Sublingual: 'var(--sys-yellow)',
};

const CATEGORY_COLOR: Partial<Record<DrugCategory, string>> = {
  emergensi:      'var(--sys-red)',
  vasoaktif:      'var(--sys-orange)',
  antikonvulsan:  'var(--sys-purple)',
  sedasi:         'var(--sys-cyan)',
  analgesik:      'var(--sys-green)',
  bronkodilator:  'var(--sys-cyan)',
  kortikosteroid: 'var(--sys-yellow)',
  diuretik:       'var(--sys-blue)',
  antiemetik:     'var(--sys-teal)',
  antibiotik:     'var(--sys-green)',
};

const PAGE_SIZE = 10;

export function DrugLibraryView() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DrugCategory | 'semua'>('semua');
  const [selectedDrug, setSelectedDrug] = useState<DrugEntry | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return DRUG_LIBRARY.filter((d) => {
      if (!d.verified) return false;
      if (activeCategory !== 'semua' && d.category !== activeCategory) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.aliases.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  // Pagination only when "semua" and no search query
  const usePagination = activeCategory === 'semua' && !query.trim();
  const totalPages = usePagination ? Math.ceil(filtered.length / PAGE_SIZE) : 1;
  const paginated = usePagination
    ? filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filtered;

  function handleCategoryChange(cat: DrugCategory | 'semua') {
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
          <Search size={16} color="var(--label-tertiary)" strokeWidth={2} />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari nama obat atau merek…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              font: 'var(--type-subheadline)', color: 'var(--label-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setPage(1); }}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer',
                color: 'var(--label-tertiary)', fontSize: 16, lineHeight: 1 }}
            >×</button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div style={{ display: 'flex', gap: 6, padding: '0 16px', width: 'max-content' }}>
          <FilterPill label="Semua" active={activeCategory === 'semua'} onClick={() => handleCategoryChange('semua')} />
          {DRUG_CATEGORY_ORDER.filter((cat) =>
            DRUG_LIBRARY.some((d) => d.verified && d.category === cat)
          ).map((cat) => (
            <FilterPill
              key={cat}
              label={DRUG_CATEGORY_LABEL[cat]}
              active={activeCategory === cat}
              color={CATEGORY_COLOR[cat]}
              onClick={() => handleCategoryChange(cat)}
            />
          ))}
        </div>
      </div>

      {/* Count */}
      <p style={{ padding: '0 20px', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
        {query ? `${filtered.length} obat ditemukan` : `${filtered.length} obat`}
        {usePagination && ` · halaman ${page} dari ${totalPages}`}
      </p>

      {/* Drug list */}
      {paginated.length === 0 ? (
        <div className="ios-card" style={{ padding: '24px 16px', textAlign: 'center' }}>
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>Obat tidak ditemukan</p>
          <p style={{ font: 'var(--type-footnote)', color: 'var(--label-tertiary)', marginTop: 4 }}>
            Coba nama generik atau nama dagang
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {paginated.map((drug) => (
            <DrugCard key={drug.id} drug={drug} onSelect={() => setSelectedDrug(drug)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {usePagination && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '4px 16px 8px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', cursor: page === 1 ? 'default' : 'pointer',
              background: 'var(--fill-secondary)', color: page === 1 ? 'var(--label-quaternary)' : 'var(--accent)',
              fontSize: 'var(--type-footnote)', fontWeight: 600,
            }}
          >‹ Prev</button>
          <span style={{ fontSize: 'var(--type-footnote)', color: 'var(--label-secondary)', fontWeight: 500 }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', cursor: page === totalPages ? 'default' : 'pointer',
              background: 'var(--fill-secondary)', color: page === totalPages ? 'var(--label-quaternary)' : 'var(--accent)',
              fontSize: 'var(--type-footnote)', fontWeight: 600,
            }}
          >Next ›</button>
        </div>
      )}

      <Disclaimer />

      {/* Drug detail modal */}
      {selectedDrug && (
        <DrugModal drug={selectedDrug} onClose={() => setSelectedDrug(null)} />
      )}
    </div>
  );
}

/* ── Drug Card ─────────────────────────────────────────────────────────── */
function DrugCard({ drug, onSelect }: { drug: DrugEntry; onSelect: () => void }) {
  const col = CATEGORY_COLOR[drug.category] ?? 'var(--accent)';

  return (
    <button
      onClick={onSelect}
      className="ios-card"
      style={{
        textAlign: 'left', background: 'var(--bg-tertiary)',
        border: 'none', cursor: 'pointer', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', minHeight: 'var(--hit)',
        transition: 'transform var(--dur-fast)',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onPointerUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={(e)=> { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>
            {drug.name}
          </span>
          <span style={{
            font: 'var(--type-caption-2)', fontWeight: 600, color: col,
            background: `color-mix(in srgb, ${col} 12%, transparent)`,
            padding: '2px 8px', borderRadius: 'var(--r-pill)',
          }}>
            {DRUG_CATEGORY_LABEL[drug.category]}
          </span>
        </div>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 2 }}>
          {drug.aliases.slice(0, 3).join(' · ')}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {[...new Set(drug.routes.map((r) => r.route))].slice(0, 3).map((route) => (
          <span key={route} style={{
            font: 'var(--type-caption-2)', fontWeight: 700,
            color: ROUTE_COLOR[route] ?? 'var(--label-secondary)',
            background: `color-mix(in srgb, ${ROUTE_COLOR[route] ?? 'var(--accent)'} 10%, transparent)`,
            padding: '1px 6px', borderRadius: 4, fontSize: 10,
          }}>{route}</span>
        ))}
      </div>

      <ChevronRight size={16} color="var(--label-tertiary)" style={{ flexShrink: 0 }} />
    </button>
  );
}

/* ── Drug Modal ─────────────────────────────────────────────────────────── */
function DrugModal({ drug, onClose }: { drug: DrugEntry; onClose: () => void }) {
  const col = CATEGORY_COLOR[drug.category] ?? 'var(--accent)';
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--r-sheet)',
            width: '100%', maxWidth: 480,
            maxHeight: '88dvh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-3, 0 16px 48px rgba(0,0,0,0.35))',
          }}
        >
          {/* Modal header */}
          <div style={{
            position: 'sticky', top: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '0.5px solid var(--separator)',
            padding: '14px 16px 12px',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
            zIndex: 1,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--label-primary)' }}>
                  {drug.name}
                </span>
                <span style={{
                  font: 'var(--type-caption-2)', fontWeight: 600, color: col,
                  background: `color-mix(in srgb, ${col} 15%, transparent)`,
                  padding: '2px 8px', borderRadius: 'var(--r-pill)',
                }}>
                  {DRUG_CATEGORY_LABEL[drug.category]}
                </span>
              </div>
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
                {drug.aliases.slice(0, 4).join(' · ')}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                background: 'var(--fill-secondary)', border: 'none', cursor: 'pointer',
                display: 'grid', placeItems: 'center', color: 'var(--label-secondary)',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Modal body */}
          <DrugDetail drug={drug} />
        </div>
      </div>
    </>,
    document.body
  );
}

/* ── Drug Detail ─────────────────────────────────────────────────────────── */
function DrugDetail({ drug }: { drug: DrugEntry }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (s: string) => setActiveSection(activeSection === s ? null : s);

  return (
    <div>
      {/* Mechanism */}
      {drug.mechanism && (
        <div style={{ padding: '10px 14px', background: 'var(--fill-tertiary)', borderBottom: '0.5px solid var(--separator)' }}>
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: 'var(--label-primary)' }}>Mekanisme: </span>
            {drug.mechanism}
          </p>
        </div>
      )}

      {/* Dose calculator */}
      <DoseCalculatorSection drug={drug} />

      {/* Accordion sections */}
      {drug.contraindications && drug.contraindications.length > 0 && (
        <AccordionItem
          title="Kontraindikasi"
          open={activeSection === 'kontra'}
          onToggle={() => toggleSection('kontra')}
          accentColor="var(--sys-red)"
        >
          {drug.contraindications.map((c, i) => (
            <BulletRow key={i} text={c} color="var(--sys-red)" />
          ))}
        </AccordionItem>
      )}

      {drug.warnings && drug.warnings.length > 0 && (
        <AccordionItem
          title="Peringatan & Efek Samping"
          open={activeSection === 'warn'}
          onToggle={() => toggleSection('warn')}
          accentColor="var(--sys-orange)"
        >
          {drug.warnings.map((w, i) => (
            <BulletRow key={i} text={w} color="var(--sys-orange)" />
          ))}
        </AccordionItem>
      )}

      {(drug.renalAdjustment || drug.hepaticAdjustment) && (
        <AccordionItem
          title="Penyesuaian Dosis"
          open={activeSection === 'adjust'}
          onToggle={() => toggleSection('adjust')}
        >
          {drug.renalAdjustment && (
            <>
              <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Gangguan Ginjal</p>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{drug.renalAdjustment}</p>
            </>
          )}
          {drug.hepaticAdjustment && (
            <>
              <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Gangguan Hati</p>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>{drug.hepaticAdjustment}</p>
            </>
          )}
        </AccordionItem>
      )}

      {drug.specialPopulations && Object.values(drug.specialPopulations).some(Boolean) && (
        <AccordionItem
          title="Populasi Khusus"
          open={activeSection === 'special'}
          onToggle={() => toggleSection('special')}
        >
          {drug.specialPopulations.neonates && <InfoRow label="Neonatus" value={drug.specialPopulations.neonates} />}
          {drug.specialPopulations.infants  && <InfoRow label="Bayi < 1 th" value={drug.specialPopulations.infants} />}
          {drug.specialPopulations.obesity  && <InfoRow label="Obesitas" value={drug.specialPopulations.obesity} />}
        </AccordionItem>
      )}

      {drug.pharmacokinetics && (
        <AccordionItem
          title="Farmakokinetik"
          open={activeSection === 'pk'}
          onToggle={() => toggleSection('pk')}
        >
          {drug.pharmacokinetics.onset      && <InfoRow label="Onset"      value={drug.pharmacokinetics.onset} />}
          {drug.pharmacokinetics.peak       && <InfoRow label="Puncak"     value={drug.pharmacokinetics.peak} />}
          {drug.pharmacokinetics.duration   && <InfoRow label="Durasi"     value={drug.pharmacokinetics.duration} />}
          {drug.pharmacokinetics.halfLife   && <InfoRow label="Waktu paruh" value={drug.pharmacokinetics.halfLife} />}
          {drug.pharmacokinetics.metabolism && <InfoRow label="Metabolisme" value={drug.pharmacokinetics.metabolism} />}
          {drug.pharmacokinetics.excretion  && <InfoRow label="Ekskresi"   value={drug.pharmacokinetics.excretion} />}
        </AccordionItem>
      )}

      {/* Referensi */}
      {drug.references.length > 0 && (
        <div style={{ borderTop: '0.5px solid var(--separator)', padding: '10px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <BookOpen size={12} color="var(--label-tertiary)" />
            <span style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--label-tertiary)' }}>
              Referensi
            </span>
          </div>
          {drug.references.map((refKey) => {
            const ref = REFERENCES[refKey];
            if (!ref) return null;
            return (
              <p key={refKey} style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', lineHeight: 1.5, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--label-secondary)' }}>[{ref.id}]</span>{' '}
                {ref.citation}
              </p>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ padding: '8px 14px 12px', borderTop: '0.5px solid var(--separator)' }}>
        <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', fontStyle: 'italic' }}>
          Untuk panduan klinis · bukan pengganti penilaian klinis profesional
        </p>
      </div>
    </div>
  );
}

/* ── Dose Calculator Section ─────────────────────────────────────────────── */
function DoseCalculatorSection({ drug }: { drug: DrugEntry }) {
  const { weightKg } = usePatientStore();
  const wt = Number(weightKg);
  const hasWeight = weightKg.trim() !== '' && Number.isFinite(wt) && wt > 0;

  return (
    <div style={{ borderBottom: '0.5px solid var(--separator)' }}>
      <div style={{ padding: '10px 14px 4px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>
          Dosis {hasWeight ? `— BB ${wt} kg` : ''}
        </p>
        {!hasWeight && (
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--sys-orange)', marginTop: 2 }}>
            ⚠ Masukkan berat badan di Data Pasien untuk kalkulasi otomatis
          </p>
        )}
      </div>

      {drug.routes.map((r, i) => (
        <RouteRow key={i} drugRoute={r} weightKg={hasWeight ? wt : null} />
      ))}
    </div>
  );
}

function RouteRow({ drugRoute, weightKg }: { drugRoute: DrugRoute; weightKg: number | null }) {
  const { route, dose } = drugRoute;
  const routeColor = ROUTE_COLOR[route] ?? 'var(--accent)';

  const isFixed = !!dose.fixedDose;

  let calcResult: { min: string; max: string; formula?: string; capped?: boolean } | null = null;
  if (weightKg && !isFixed) {
    try {
      const r = calculateDose(dose, weightKg);
      const unit = r.doseUnit;
      calcResult = {
        min: formatDose(r.minDose, unit),
        max: formatDose(r.maxDose, unit),
        formula: r.formula,
        capped: r.isCapped,
      };
    } catch { /* invalid */ }
  }

  const isSingle = isSingleDose(dose);

  return (
    <div style={{ padding: '8px 14px 10px', borderTop: '0.5px solid var(--separator)' }}>
      {/* Route + indication */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          font: 'var(--type-caption-2)', fontWeight: 700,
          color: routeColor,
          background: `color-mix(in srgb, ${routeColor} 12%, transparent)`,
          padding: '2px 8px', borderRadius: 4,
        }}>{route}</span>
        {dose.indication && (
          <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', flex: 1 }}>
            {dose.indication}
          </span>
        )}
      </div>

      {/* Dose per kg range (atau dosis tetap) */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
          {isFixed
            ? dose.fixedDose
            : isSingle
              ? `${dose.minPerKg} ${dose.unit}`
              : `${dose.minPerKg}–${dose.maxPerKg} ${dose.unit}`}
          {!isFixed && dose.maxAbsoluteMg && ` · maks ${dose.maxAbsoluteMg} ${dose.unit.replace('/kg', '')}`}
        </span>
      </div>

      {/* Calculated dose */}
      {calcResult && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', borderRadius: 'var(--r-sm)',
          background: `color-mix(in srgb, ${routeColor} 8%, var(--bg-tertiary))`,
          marginBottom: 4,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: routeColor }}>
            {isSingle ? calcResult.min : `${calcResult.min} – ${calcResult.max}`}
          </span>
          {calcResult.capped && (
            <span style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', fontWeight: 600 }}>
              (dicap)
            </span>
          )}
        </div>
      )}

      {/* Frequency + IV duration */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          🕐 {dose.frequency}
        </span>
        {dose.ivDuration && (
          <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
            ⏱ {dose.ivDuration}
          </span>
        )}
      </div>

      {/* Notes */}
      {dose.notes && (
        <div style={{
          marginTop: 6, padding: '6px 8px', borderRadius: 'var(--r-sm)',
          background: 'var(--fill-tertiary)',
          display: 'flex', gap: 6, alignItems: 'flex-start',
        }}>
          <Info size={12} color="var(--label-tertiary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            {dose.notes}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function AccordionItem({ title, open, onToggle, children, accentColor }: {
  title: string; open: boolean; onToggle: () => void;
  children: React.ReactNode; accentColor?: string;
}) {
  return (
    <div style={{ borderTop: '0.5px solid var(--separator)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', background: 'transparent',
          border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', minHeight: 40,
        }}
      >
        <span style={{
          font: 'var(--type-footnote)', fontWeight: 600,
          color: accentColor ?? 'var(--label-primary)',
        }}>{title}</span>
        <ChevronRight
          size={14} color="var(--label-tertiary)"
          style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast)' }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function BulletRow({ text, color }: { text: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4 }}>
      <AlertTriangle size={12} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
      <span style={{ flexShrink: 0, font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-primary)', minWidth: 100 }}>{label}</span>
      <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

function FilterPill({ label, active, onClick, color }: {
  label: string; active: boolean; onClick: () => void; color?: string;
}) {
  const c = color ?? 'var(--accent)';
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '6px 14px', borderRadius: 'var(--r-pill)',
        border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
        font: 'var(--type-caption-1)', fontWeight: active ? 700 : 400,
        background: active ? c : 'var(--fill-secondary)',
        color: active ? '#fff' : 'var(--label-primary)',
        transition: 'all var(--dur-fast)',
      }}
    >
      {label}
    </button>
  );
}
