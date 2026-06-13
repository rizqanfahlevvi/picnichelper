import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { usePatientStore } from '../../store/patientStore';
import {
  classifyNa, calc3pctNaClVol, calcFreeWaterDeficit,
  classifyK, calcKDose,
  classifyCaTotal, classifyCaIonized, calcCaGluconateVol, correctCaForAlbumin,
  classifyMg, calcMgSO4Vol,
  severityColor, SEVERITY_LABEL, STATUS_LABEL,
  type ElectClass,
} from '../../utils/electrolytes';
import { REFERENCES } from '../../data/references';

type ElectTab = 'na' | 'k' | 'ca' | 'mg';

const TABS: { id: ElectTab; label: string; unit: string }[] = [
  { id: 'na', label: 'Natrium',  unit: 'mEq/L' },
  { id: 'k',  label: 'Kalium',   unit: 'mEq/L' },
  { id: 'ca', label: 'Kalsium',  unit: 'mg/dL / mmol/L' },
  { id: 'mg', label: 'Magnesium', unit: 'mg/dL' },
];

export function ElectrolyteCalculator() {
  const [tab, setTab] = useState<ElectTab>('na');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Elektrolit</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Interpretasi & strategi koreksi <Cite source="greenbaum2020" /><Cite source="feld2018" />.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: 'var(--r-pill)',
              border: 'none', cursor: 'pointer',
              font: 'var(--type-subheadline)', fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? 'var(--accent)' : 'var(--fill-secondary)',
              color: tab === t.id ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'na' && <NaSection />}
      {tab === 'k'  && <KSection />}
      {tab === 'ca' && <CaSection />}
      {tab === 'mg' && <MgSection />}

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['greenbaum2020', 'feld2018', 'pals2020'] as const).map((key) => (
            <li key={key} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[key].id}]</span>{' '}
              {REFERENCES[key].citation}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ── Natrium ───────────────────────────────────────────────────────────────
function NaSection() {
  const { weightKg } = usePatientStore();
  const [val, setVal] = useState('');
  const [targetRise, setTargetRise] = useState('2');

  const na  = Number(val);
  const wt  = Number(weightKg);
  const ec  = val.trim() ? classifyNa(na) : null;
  const col = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';

  const vol3pct = ec?.status === 'hypo' && wt > 0
    ? calc3pctNaClVol(wt, Number(targetRise) || 2)
    : null;
  const fwd = ec?.status === 'hyper' && wt > 0
    ? calcFreeWaterDeficit(wt, na)
    : null;

  return (
    <>
      <ClassifyCard
        label="Natrium (Na⁺)"
        unit="mEq/L" placeholder="140"
        normal="135–145 mEq/L"
        value={val} onChange={setVal}
        ec={ec} col={col}
      />

      {/* Koreksi Hiponatremia */}
      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Koreksi — 3% NaCl <Cite source="feld2018" />
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flex: 1 }}>Target kenaikan Na</span>
            <input
              type="number" value={targetRise} onChange={(e) => setTargetRise(e.target.value)}
              min="1" max="12"
              style={{ width: 60, textAlign: 'right', borderRadius: 'var(--r-sm)', border: 'none', outline: 'none', background: 'var(--fill-tertiary)', color: 'var(--label-primary)', font: 'var(--type-body)', padding: '4px 8px', minHeight: 36 }}
            />
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>mEq/L</span>
          </div>
          {wt > 0 && vol3pct != null ? (
            <ResultRow label="Volume 3% NaCl" value={vol3pct} unit="mL" note="ΔNa × BB × 0.6 / 0.514" />
          ) : (
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien untuk hitung volume.</p>
          )}
          <p style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', marginTop: 8, lineHeight: 1.4 }}>
            ⚠ Kecepatan max: 1–2 mEq/L/jam (sampai gejala teratasi). Total 24 jam maks 8–10 mEq/L untuk cegah ODS.
          </p>
        </div>
      )}

      {/* Koreksi Hipernatremia */}
      {ec?.status === 'hyper' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Koreksi — Defisit Air Bebas
          </p>
          {wt > 0 && fwd != null ? (
            <ResultRow label="Free Water Deficit" value={fwd} unit="L" note="BB × 0.6 × (Na/145 − 1)" />
          ) : (
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien untuk hitung defisit.</p>
          )}
          <p style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', marginTop: 8, lineHeight: 1.4 }}>
            ⚠ Turunkan Na maks 0.5 mEq/L/jam atau 10–12 mEq/L/24 jam untuk cegah edema serebral.
          </p>
        </div>
      )}

      <TheoryAccordion sections={NA_THEORY} />
    </>
  );
}

// ── Kalium ────────────────────────────────────────────────────────────────
function KSection() {
  const { weightKg } = usePatientStore();
  const [val, setVal] = useState('');
  const wt  = Number(weightKg);
  const k   = Number(val);
  const ec  = val.trim() ? classifyK(k)  : null;
  const col = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';
  const dose = ec?.status === 'hypo' && wt > 0 ? calcKDose(wt) : null;

  return (
    <>
      <ClassifyCard
        label="Kalium (K⁺)"
        unit="mEq/L" placeholder="4.0"
        normal="3.5–5.5 mEq/L"
        value={val} onChange={setVal}
        ec={ec} col={col}
      />

      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Koreksi — KCl IV <Cite source="pals2020" />
          </p>
          {wt > 0 && dose ? (
            <>
              <ResultRow label="Dosis KCl (rendah)" value={dose.lowMeq}  unit="mEq" note="0.2 mEq/kg" />
              <div style={{ height: '0.5px', background: 'var(--separator)', margin: '8px 0' }} />
              <ResultRow label="Dosis KCl (tinggi)" value={dose.highMeq} unit="mEq" note="0.5 mEq/kg" />
            </>
          ) : (
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien.</p>
          )}
          <p style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', marginTop: 8, lineHeight: 1.4 }}>
            ⚠ Kecepatan IV maks: 0.3 mEq/kg/jam (perifer) · 0.5 mEq/kg/jam (sentral, monitor EKG).
          </p>
        </div>
      )}

      {ec?.status === 'hyper' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Tatalaksana Hiperkalemia <Cite source="pals2020" />
          </p>
          {[
            { step: '1. Stabilisasi membran', detail: 'Ca glukonat 10%: 0.5–1 mL/kg IV lambat ≥ 10 menit (onset 1–3 mnt). Indikasi: K > 6.5 atau perubahan EKG.' },
            { step: '2. Shift K ke intrasel', detail: 'Insulin reguler 0.1 U/kg + Dextrose 0.5 g/kg IV. Salbutamol nebulisasi (dosis nebulisasi rutin). NaHCO₃ bila asidosis metabolik.' },
            { step: '3. Eliminasi K', detail: 'Kayexalate (sodium polystyrene sulfonate) per oral/rektal. Furosemid bila fungsi ginjal adekuat. Dialisis bila gagal ginjal berat.' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
              <p style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', marginBottom: 3 }}>{s.step}</p>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.4 }}>{s.detail}</p>
            </div>
          ))}
        </div>
      )}

      <TheoryAccordion sections={K_THEORY} />
    </>
  );
}

// ── Kalsium ───────────────────────────────────────────────────────────────
function CaSection() {
  const { weightKg } = usePatientStore();
  const [mode, setMode]       = useState<'total' | 'ionized'>('total');
  const [val, setVal]         = useState('');
  const [albumin, setAlbumin] = useState('');

  const wt    = Number(weightKg);
  const caNum = Number(val);
  const albNum = albumin.trim() ? Number(albumin) : null;

  const correctedCa = mode === 'total' && val.trim() && albNum != null
    ? correctCaForAlbumin(caNum, albNum)
    : null;

  const ecRaw  = val.trim()
    ? (mode === 'total' ? classifyCaTotal(caNum) : classifyCaIonized(caNum))
    : null;
  const ecCorr = correctedCa != null ? classifyCaTotal(correctedCa) : null;
  const ec     = ecCorr ?? ecRaw;
  const col    = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';
  const dose   = ec?.status === 'hypo' && wt > 0 ? calcCaGluconateVol(wt) : null;

  return (
    <>
      {/* Mode toggle */}
      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {([['total', 'Ca Total (mg/dL)'], ['ionized', 'iCa (mmol/L)']] as const).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setVal(''); setAlbumin(''); }}
            style={{
              padding: '6px 14px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
              font: 'var(--type-footnote)', fontWeight: mode === m ? 600 : 400,
              background: mode === m ? 'var(--accent)' : 'var(--fill-secondary)',
              color: mode === m ? '#fff' : 'var(--label-primary)', transition: 'all var(--dur-fast)',
            }}>{label}</button>
        ))}
      </div>

      <ClassifyCard
        label={mode === 'total' ? 'Kalsium Total' : 'Kalsium Ionisasi'}
        unit={mode === 'total' ? 'mg/dL' : 'mmol/L'}
        placeholder={mode === 'total' ? '9.0' : '1.20'}
        normal={mode === 'total' ? '8.5–10.5 mg/dL' : '1.12–1.32 mmol/L'}
        value={val} onChange={setVal}
        ec={ecRaw} col={col}
      />

      {/* Koreksi albumin (total Ca mode only) */}
      {mode === 'total' && val.trim() && (
        <div className="ios-card" style={{ padding: '12px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            Koreksi Albumin (opsional)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: albNum != null ? 10 : 0 }}>
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flex: 1 }}>Albumin</span>
            <input
              type="number" value={albumin} onChange={(e) => setAlbumin(e.target.value)}
              placeholder="4.0" min="0" max="8"
              style={{ width: 70, textAlign: 'right', borderRadius: 'var(--r-sm)', border: 'none', outline: 'none', background: 'var(--fill-tertiary)', color: 'var(--label-primary)', font: 'var(--type-body)', padding: '4px 8px', minHeight: 36 }}
            />
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>g/dL</span>
          </div>
          {correctedCa != null && (
            <ResultRow
              label="Ca terkoreksi"
              value={correctedCa} unit="mg/dL"
              note={`Ca + 0.8 × (4 − ${albNum})`}
              tint={severityColor(ecCorr!.severity, ecCorr!.status)}
            />
          )}
        </div>
      )}

      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Koreksi — Ca Glukonat 10% IV <Cite source="pals2020" />
          </p>
          {wt > 0 && dose ? (
            <>
              <ResultRow label="Volume (dosis rendah)" value={dose.lowMl}  unit="mL" note="0.5 mL/kg" />
              <div style={{ height: '0.5px', background: 'var(--separator)', margin: '8px 0' }} />
              <ResultRow label="Volume (dosis tinggi)" value={dose.highMl} unit="mL" note="1 mL/kg (maks 20 mL)" />
            </>
          ) : (
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien.</p>
          )}
          <p style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', marginTop: 8, lineHeight: 1.4 }}>
            ⚠ Infus LAMBAT ≥ 10 menit dengan monitor EKG. Bisa menyebabkan bradikardia bila terlalu cepat.
          </p>
        </div>
      )}

      <TheoryAccordion sections={CA_THEORY} />
    </>
  );
}

// ── Magnesium ─────────────────────────────────────────────────────────────
function MgSection() {
  const { weightKg } = usePatientStore();
  const [val, setVal] = useState('');
  const wt  = Number(weightKg);
  const mg  = Number(val);
  const ec  = val.trim() ? classifyMg(mg)  : null;
  const col = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';
  const dose = ec?.status === 'hypo' && wt > 0 ? calcMgSO4Vol(wt) : null;

  return (
    <>
      <ClassifyCard
        label="Magnesium (Mg²⁺)"
        unit="mg/dL" placeholder="2.0"
        normal="1.7–2.4 mg/dL"
        value={val} onChange={setVal}
        ec={ec} col={col}
      />

      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Koreksi — MgSO₄ 50% IV <Cite source="greenbaum2020" />
          </p>
          {wt > 0 && dose ? (
            <>
              <ResultRow label="Dosis (rendah)" value={dose.lowMg}  unit="mg" note={`25 mg/kg · → ${dose.lowMl} mL MgSO₄ 50%`} />
              <div style={{ height: '0.5px', background: 'var(--separator)', margin: '8px 0' }} />
              <ResultRow label="Dosis (tinggi)" value={dose.highMg} unit="mg" note={`50 mg/kg · → ${dose.highMl} mL MgSO₄ 50%`} />
            </>
          ) : (
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien.</p>
          )}
          <p style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', marginTop: 8, lineHeight: 1.4 }}>
            ⚠ Infus lambat 15–30 menit. Maks dosis tunggal 2000 mg. Monitor: tekanan darah, refleks patella, frekuensi napas.
          </p>
        </div>
      )}

      {ec?.status === 'hyper' && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Tatalaksana Hipermagnesemia
          </p>
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            Hentikan semua suplementasi Mg. Bila simtomatik (depresi napas, bradikardia):
            Ca glukonat 10% 0.5–1 mL/kg IV sebagai antidot. Diuresis paksa bila fungsi ginjal adekuat.
          </p>
        </div>
      )}

      <TheoryAccordion sections={MG_THEORY} />
    </>
  );
}

// ── Shared components ─────────────────────────────────────────────────────
function ClassifyCard({ label, unit, placeholder, normal, value, onChange, ec, col }: {
  label: string; unit: string; placeholder: string; normal: string;
  value: string; onChange: (v: string) => void;
  ec: ElectClass | null; col: string;
}) {
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--separator)' }}>
        <div style={{ flex: 1 }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', fontWeight: 600 }}>{label}</span>
          <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>({unit})</span>
        </div>
        <input
          type="number" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: 90, textAlign: 'right', borderRadius: 'var(--r-sm)',
            border: 'none', outline: 'none', background: 'var(--fill-tertiary)',
            color: 'var(--label-primary)', font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
          }}
        />
      </div>
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Normal: {normal}</span>
        {ec ? (
          <span style={{
            font: 'var(--type-caption-2)', fontWeight: 700,
            color: col,
            background: `color-mix(in srgb, ${col} 12%, transparent)`,
            padding: '3px 10px', borderRadius: 'var(--r-pill)',
          }}>
            {ec.status !== 'normal' ? `${STATUS_LABEL[ec.status]}-` : ''}{ec.status === 'normal' ? 'Normal' : `${label.split(' ')[0].slice(0,2).toLowerCase()}emia`} · {SEVERITY_LABEL[ec.severity]}
          </span>
        ) : (
          <span style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>—</span>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, unit, note, tint }: {
  label: string; value: number; unit: string; note: string; tint?: string;
}) {
  const c = tint ?? 'var(--accent)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{label}</p>
        <p style={{ font: 'var(--type-caption-2)', fontFamily: 'var(--font-mono)', color: 'var(--label-tertiary)', marginTop: 2 }}>{note}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: c }}>
          {value % 1 === 0 ? value : value.toFixed(1)}
        </span>
        <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}

// ── Theory accordion ──────────────────────────────────────────────────────
interface TheorySection { title: string; content: string; }

function TheoryAccordion({ sections }: { sections: TheorySection[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 8px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>Panduan Klinis</p>
      </div>
      {sections.map((s, i) => (
        <div key={i} style={{ borderTop: '0.5px solid var(--separator)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer',
              minHeight: 'var(--hit)',
            }}
          >
            <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', textAlign: 'left' }}>{s.title}</span>
            {open === i ? <ChevronUp size={16} color="var(--label-tertiary)" /> : <ChevronDown size={16} color="var(--label-tertiary)" />}
          </button>
          {open === i && (
            <div style={{ padding: '0 14px 14px' }}>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {s.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Theory content ────────────────────────────────────────────────────────
const NA_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Klasifikasi',
    content: `Hiponatremia: Na < 135 mEq/L
• Ringan: 130–134 · Sedang: 125–129 · Berat: < 125

Hipernatremia: Na > 145 mEq/L
• Ringan: 146–150 · Sedang: 151–160 · Berat: > 160

Hiponatremia adalah gangguan elektrolit tersering pada pasien rawat inap anak.`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hiponatremia (terutama bila akut atau berat):
• Mual, sakit kepala, letargi, konfusi
• Kejang, koma → berat mengancam nyawa
• Edema serebral

Hipernatremia:
• Iritabilitas, letargi, high-pitched cry (bayi)
• Spastisitas, kejang (bila berat)
• Demam, mukosa kering`,
  },
  {
    title: 'Penyebab Tersering (Anak)',
    content: `Hiponatremia:
• Cairan IV hipotonik berlebihan (iatrogenik tersering)
• Gastroenteritis dengan rehidrasi air bebas berlebih
• SIADH (post-operatif, meningitis, pneumonia)
• Sindrom nefrotik, gagal jantung

Hipernatremia:
• Asupan tidak adekuat (neonatus/bayi ASI eksklusif)
• Diare osmotik atau diabetes insipidus
• Cairan IV hipertonik berlebihan`,
  },
  {
    title: 'Prinsip Koreksi',
    content: `Hiponatremia simtomatik (kejang/koma):
→ 3% NaCl 2 mEq/kg (≈ 4 mL/kg) IV dalam 10–20 menit
→ Ulangi bila gejala menetap
→ Target: Na naik 2–4 mEq/L atau gejala teratasi
→ Setelah gejala membaik: koreksi lambat, maks 8–10 mEq/L/24 jam

Hipernatremia:
→ Hitung defisit air bebas, ganti bertahap 48–72 jam
→ Maks penurunan 0.5 mEq/L/jam atau 10–12 mEq/L/24 jam
→ Koreksi terlalu cepat → edema serebral (herniasi)`,
  },
  {
    title: 'Monitoring',
    content: `• Cek ulang Na serum 2–4 jam setelah mulai koreksi
• Monitor output urin dan berat badan setiap 4–6 jam
• Bila SIADH: restriksi cairan, koreksi penyakit dasar
• Hindari koreksi hiponatremia > 10 mEq/L/24 jam → risiko ODS (Osmotic Demyelination Syndrome)
• Tanda bahaya: penurunan kesadaran tiba-tiba saat koreksi`,
  },
];

const K_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Klasifikasi',
    content: `Hipokalemia: K < 3.5 mEq/L
• Ringan: 3.0–3.4 · Sedang: 2.5–2.9 · Berat: < 2.5

Hiperkalemia: K > 5.5 mEq/L
• Ringan: 5.5–6.0 · Sedang: 6.0–6.5 · Berat: > 6.5

Catatan: Neonatus memiliki nilai K normal lebih tinggi (3.5–6.0 mEq/L). Pseudohiperkalemia karena hemolisis spesimen harus disingkirkan.`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hipokalemia:
• Kelemahan otot (paralisis flaksid pada berat)
• Kram, konstipasi, ileus
• EKG: T mendatar/inversi, U wave, ST depresi, PR memanjang

Hiperkalemia:
• Kelemahan otot, parastesia
• EKG: T tall peaked → PR memanjang → QRS lebar → sine wave → VF
• Hiperkalemia > 6.5 + EKG changes = EMERGENSI`,
  },
  {
    title: 'Penyebab Tersering',
    content: `Hipokalemia:
• Diare, muntah berkepanjangan (kehilangan GI)
• Diuretik (furosemid, tiazid)
• Alkalosis metabolik
• Kurang asupan (malnutrisi, anoreksia)
• Sindrom Bartter/Gitelman

Hiperkalemia:
• Gagal ginjal akut/kronik (tersering)
• Asidosis metabolik (distribusi K keluar sel)
• Hemolisis masif, rhabdomiolisis
• Insufisiensi adrenal, hipoaldosteronisme
• Obat: ACEi, ARB, spironolakton, succinylcholin`,
  },
  {
    title: 'Prinsip Koreksi',
    content: `Hipokalemia:
→ Koreksi penyebab (diare, diuretik)
→ Ringan-sedang: suplementasi oral (KCl) bila bisa
→ Sedang-berat: KCl IV 0.2–0.5 mEq/kg/dosis dalam 1–2 jam
→ Monitor EKG selama infus IV
→ Koreksi Mg bersamaan bila hipomagnesemia ada (Mg defisiensi mencegah koreksi K)

Hiperkalemia (urutan prioritas):
1. Ca glukonat (stabilisasi membran, onset 1–3 menit)
2. Insulin + dextrose / salbutamol (shift intrasel, onset 15–30 menit)
3. Kayexalate / diuretik / dialisis (eliminasi K, onset jam–hari)`,
  },
];

const CA_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Nilai Normal',
    content: `Ca Total (serum):
• Normal: 8.5–10.5 mg/dL (anak > 1 bulan)
• Neonatus (< 7 hari): batas bawah ~7.0 mg/dL

Ca Ionisasi (iCa):
• Normal: 1.12–1.32 mmol/L
• iCa lebih mencerminkan fungsi fisiologis

Koreksi Albumin:
• Ca terkoreksi = Ca terukur + 0.8 × (4 − albumin)
• Penting: hipoalbuminemia menyebabkan Ca total rendah palsu`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hipokalsemia:
• Tanda Chvostek (+): ketukan N. facialis → kedutan
• Tanda Trousseau (+): manset tensimeter > sistolik 3 mnt → spasme karpal
• Tetani, laringospasme, bronkospasme
• Kejang (neonatus dan bayi)
• EKG: QTc memanjang

Hiperkalsemia:
• "Bones, Stones, Groans, Psychic Moans"
• Kelemahan, mual, poliuria, konstipasi
• EKG: QTc memendek`,
  },
  {
    title: 'Penyebab Tersering',
    content: `Hipokalsemia:
• Hipoparatiroidisme (pasca tiroid/paratiroid, DiGeorge)
• Defisiensi vitamin D (rakhitis)
• Hipomagnesemia (mencegah sekresi PTH)
• Alkalosis (menurunkan fraksi iCa)
• Neonatal: prematuritas, asfiksia, ibu diabetes

Hiperkalsemia:
• Hiperparatiroidisme primer
• Keganasan (PTHrP)
• Intoksikasi vitamin D
• Imobilisasi berkepanjangan
• Williams syndrome`,
  },
  {
    title: 'Tatalaksana',
    content: `Hipokalsemia simtomatik:
→ Ca glukonat 10% IV 0.5–1 mL/kg, infus ≥ 10 menit
→ Monitor EKG selama infus (risiko bradikardia)
→ Setelah akut stabil: suplemen oral Ca + Vitamin D

Hiperkalsemia:
→ Hidrasi agresif NaCl 0.9%: 10–20 mL/kg kemudian maintenance × 2
→ Furosemid setelah rehidrasi adekuat
→ Kortikosteroid (bila karena vitamin D, keganasan hematologi)
→ Pamidronate / bisphosphonate (bila berat)
→ Dialisis (bila gagal ginjal atau sangat berat)`,
  },
];

const MG_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Nilai Normal',
    content: `Normal: 1.7–2.4 mg/dL (0.70–0.99 mmol/L)

Hipomagnesemia: < 1.7 mg/dL
• Ringan: 1.2–1.6 · Sedang: 0.8–1.1 · Berat: < 0.8

Hipermagnesemia: > 2.4 mg/dL
• Lebih jarang; umumnya iatrogenik (terapi Mg berlebihan)`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hipomagnesemia:
• Tremor, fasikulasi, tetani (mirip hipokalsemia)
• Refrakter terhadap koreksi K dan Ca (Mg mengatur transport keduanya)
• EKG: T inversi, QT memanjang, aritmia
• Kejang pada berat

Hipermagnesemia:
• Flush, mual, kelemahan otot
• Depresi refleks patella (tanda penting!)
• Depresi napas (Mg > 5 mg/dL)
• Blok jantung, henti jantung (Mg > 15 mg/dL)`,
  },
  {
    title: 'Penyebab & Keterkaitan',
    content: `Hipomagnesemia:
• Malabsorpsi / malnutrisi
• Diuretik loop atau tiazid
• Diare kronik
• Diabetes mellitus (glikosuria membawa Mg)
• Refeeding syndrome

Keterkaitan klinis penting:
• Hipomagnesemia sering menyertai hipokalemia dan hipokalsemia yang sulit dikoreksi
• Selalu cek dan koreksi Mg bila K atau Ca refrakter terhadap terapi

Hipermagnesemia:
• Terapi tokolisis dengan MgSO4 pada ibu
• Pemberian Mg berlebihan pada eklampsia/preeklampsia
• Gagal ginjal dengan pemberian antasid Mg`,
  },
  {
    title: 'Prinsip Koreksi',
    content: `Hipomagnesemia simtomatik / sedang-berat:
→ MgSO4 50%: 25–50 mg/kg IV (maks 2000 mg per dosis)
→ Infus dalam 15–30 menit (jangan bolus)
→ Monitor: tekanan darah, frekuensi napas, refleks patella tiap 15 menit
→ Ulangi setelah 4–6 jam bila Mg masih rendah

Antidot MgSO4 (bila toksisitas):
→ Ca glukonat 10%: 0.5–1 mL/kg IV segera
→ Oksigen, bantu napas bila depresi napas

Hipermagnesemia:
→ Hentikan semua sumber Mg
→ Ca glukonat sebagai antidot fisiologis
→ Diuretik loop bila ginjal baik
→ Dialisis bila gagal ginjal atau berat`,
  },
];
