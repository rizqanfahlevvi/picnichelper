import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { usePatientStore } from '../../store/patientStore';
import {
  calculateSchwartzEgfr, interpretProteinCrRatio, classifyUrinOutput,
  type GfrResult, type ProteinCrResult,
} from '../../utils/renal';
import { REFERENCES } from '../../data/references';

type RenalTab = 'egfr' | 'pcr' | 'uo';

const TABS: { id: RenalTab; label: string }[] = [
  { id: 'egfr', label: 'eGFR' },
  { id: 'pcr',  label: 'Protein:Cr' },
  { id: 'uo',   label: 'Urine Output' },
];

export function RenalCalculator() {
  const [tab, setTab] = useState<RenalTab>('egfr');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Kalkulator Renal</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          eGFR Schwartz <Cite source="schwartz2009" /> · CKD KDIGO <Cite source="kdigo2012" />.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: 'var(--r-pill)',
              border: 'none', cursor: 'pointer',
              font: 'var(--type-subheadline)', fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? 'var(--accent)' : 'var(--fill-secondary)',
              color: tab === t.id ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}>{t.label}</button>
        ))}
      </div>

      {tab === 'egfr' && <EgfrSection />}
      {tab === 'pcr'  && <PcrSection />}
      {tab === 'uo'   && <UoSection />}

      <TheoryAccordion />
      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['schwartz2009', 'kdigo2012'] as const).map((key) => (
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

// ── eGFR ─────────────────────────────────────────────────────────────────
function EgfrSection() {
  const { heightCm } = usePatientStore();
  const [cr, setCr] = useState('');
  const [result, setResult] = useState<GfrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const height = Number(heightCm);
  const canCalc = cr.trim() && heightCm.trim();

  function calc() {
    setError(null); setResult(null);
    try { setResult(calculateSchwartzEgfr(height, Number(cr))); }
    catch (e) { setError(e instanceof Error ? e.message : 'Input tidak valid'); }
  }

  return (
    <>
      <div className="ios-card">
        <div style={{ padding: '12px 14px 0' }}>
          <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>
            Bedside Schwartz 2009
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--label-secondary)', marginBottom: 10, background: 'var(--fill-tertiary)', padding: '6px 10px', borderRadius: 'var(--r-sm)' }}>
            eGFR = 0.413 × tinggi (cm) / Cr (mg/dL)
          </p>
        </div>
        <InputRow label="Tinggi badan" unit="cm" value={heightCm} readOnly placeholder="dari Data Pasien" />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />
        <InputRow label="Kreatinin serum" unit="mg/dL" value={cr} onChange={setCr} placeholder="0.5" type="number" />
        {!heightCm.trim() && (
          <p style={{ padding: '0 14px 8px', font: 'var(--type-caption-1)', color: 'var(--sys-orange)' }}>
            ⚠ Isi tinggi badan di Data Pasien.
          </p>
        )}
        <div style={{ padding: '8px 14px 14px' }}>
          <button
            onClick={calc} disabled={!canCalc}
            style={{
              width: '100%', minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff',
              font: 'var(--type-body)', fontWeight: 600,
              opacity: canCalc ? 1 : 0.4, transition: 'opacity var(--dur-fast)',
            }}
          >Hitung eGFR</button>
        </div>
      </div>

      {error && <div className="ios-warn ios-warn--danger"><AlertTriangle size={15} /><span>{error}</span></div>}

      {result && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', background: `color-mix(in srgb, ${result.color} 10%, var(--bg-tertiary))`, borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 4 }}>eGFR</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 700, color: result.color }}>{result.egfr}</span>
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>mL/min/1.73m²</span>
            </div>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <span style={{
              display: 'inline-block',
              font: 'var(--type-caption-2)', fontWeight: 700,
              color: result.color,
              background: `color-mix(in srgb, ${result.color} 12%, transparent)`,
              padding: '3px 10px', borderRadius: 'var(--r-pill)',
            }}>{result.stageLabel}</span>
            {(result.stage === 'G4' || result.stage === 'G5') && (
              <p style={{ font: 'var(--type-footnote)', color: 'var(--sys-red)', marginTop: 8, lineHeight: 1.4 }}>
                ⚠ Pertimbangkan konsultasi nefrologi pediatri segera.
              </p>
            )}
          </div>
          <CkdTable current={result.stage} />
        </div>
      )}
    </>
  );
}

function CkdTable({ current }: { current: string }) {
  const stages = [
    { stage: 'G1',  label: 'Normal/Tinggi', range: '≥ 90' },
    { stage: 'G2',  label: 'Ringan', range: '60–89' },
    { stage: 'G3a', label: 'Ringan-Sedang', range: '45–59' },
    { stage: 'G3b', label: 'Sedang-Berat', range: '30–44' },
    { stage: 'G4',  label: 'Berat', range: '15–29' },
    { stage: 'G5',  label: 'Gagal Ginjal', range: '< 15' },
  ];
  return (
    <div style={{ borderTop: '0.5px solid var(--separator)' }}>
      {stages.map((s, i) => (
        <div key={s.stage} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 16px', borderTop: i > 0 ? '0.5px solid var(--separator)' : 'none',
          background: s.stage === current ? 'color-mix(in srgb, var(--accent) 8%, var(--bg-tertiary))' : 'transparent',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {s.stage === current && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
            <span style={{ font: 'var(--type-footnote)', fontWeight: s.stage === current ? 700 : 400, color: s.stage === current ? 'var(--label-primary)' : 'var(--label-secondary)' }}>
              {s.stage} — {s.label}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>{s.range}</span>
        </div>
      ))}
    </div>
  );
}

// ── Protein:Creatinine Ratio ──────────────────────────────────────────────
function PcrSection() {
  const [prot, setProt] = useState('');
  const [cr, setCr]     = useState('');
  const [result, setResult] = useState<ProteinCrResult | null>(null);
  const [error, setError]   = useState<string | null>(null);

  const canCalc = prot.trim() && cr.trim();

  function calc() {
    setError(null); setResult(null);
    try { setResult(interpretProteinCrRatio(Number(prot), Number(cr))); }
    catch (e) { setError(e instanceof Error ? e.message : 'Input tidak valid'); }
  }

  return (
    <>
      <div className="ios-card">
        <div style={{ padding: '12px 14px 4px' }}>
          <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
            Urin sewaktu (spot urine). Satuan protein & kreatinin urin dalam <strong>mg/dL</strong>.
          </p>
        </div>
        <InputRow label="Protein urin" unit="mg/dL" value={prot} onChange={setProt} placeholder="15" type="number" />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />
        <InputRow label="Kreatinin urin" unit="mg/dL" value={cr} onChange={setCr} placeholder="80" type="number" />
        <div style={{ padding: '8px 14px 14px' }}>
          <button onClick={calc} disabled={!canCalc}
            style={{
              width: '100%', minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff',
              font: 'var(--type-body)', fontWeight: 600,
              opacity: canCalc ? 1 : 0.4,
            }}>Hitung Rasio</button>
        </div>
      </div>

      {error && <div className="ios-warn ios-warn--danger"><AlertTriangle size={15} /><span>{error}</span></div>}

      {result && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', background: `color-mix(in srgb, ${result.color} 10%, var(--bg-tertiary))`, borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 4 }}>Rasio Protein:Kreatinin</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 700, color: result.color }}>{result.ratio.toFixed(2)}</span>
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>mg/mg</span>
            </div>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <span style={{
              display: 'inline-block',
              font: 'var(--type-caption-2)', fontWeight: 700,
              color: result.color,
              background: `color-mix(in srgb, ${result.color} 12%, transparent)`,
              padding: '3px 10px', borderRadius: 'var(--r-pill)',
            }}>{result.label}</span>
            {result.ratioClass === 'nephrotic' && (
              <p style={{ font: 'var(--type-footnote)', color: 'var(--sys-red)', marginTop: 8 }}>
                ⚠ Rentang nefrotik — evaluasi sindrom nefrotik.
              </p>
            )}
          </div>
          <div style={{ padding: '0 16px 12px', borderTop: '0.5px solid var(--separator)', paddingTop: 10 }}>
            {[
              { label: 'Normal (anak > 2 th)', val: '< 0.2' },
              { label: 'Proteinuria ringan', val: '0.2–0.5' },
              { label: 'Proteinuria signifikan', val: '0.5–2.0' },
              { label: 'Rentang nefrotik', val: '≥ 2.0' },
            ].map((r) => (
              <div key={r.val} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-caption-1)', color: 'var(--label-primary)' }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Urine Output ──────────────────────────────────────────────────────────
function UoSection() {
  const { weightKg } = usePatientStore();
  const [uoMl, setUoMl] = useState('');
  const [hours, setHours] = useState('1');

  const wt = Number(weightKg);
  const uoNum = Number(uoMl);
  const hNum  = Number(hours) || 1;
  const canCalc = uoMl.trim() && weightKg.trim();
  const rateResult = canCalc && wt > 0 ? classifyUrinOutput(uoNum / hNum, wt) : null;

  return (
    <>
      <div className="ios-card">
        <InputRow label="Berat badan" unit="kg" value={weightKg} readOnly placeholder="dari Data Pasien" />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />
        <InputRow label="Volume urin" unit="mL" value={uoMl} onChange={setUoMl} placeholder="100" type="number" />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />
        <InputRow label="Dalam waktu" unit="jam" value={hours} onChange={setHours} placeholder="1" type="number" />
        {!weightKg.trim() && (
          <p style={{ padding: '0 14px 10px', font: 'var(--type-caption-1)', color: 'var(--sys-orange)' }}>
            ⚠ Isi berat badan di Data Pasien.
          </p>
        )}
      </div>

      {rateResult && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', background: `color-mix(in srgb, ${rateResult.color} 10%, var(--bg-tertiary))`, borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 4 }}>Urine Output</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 700, color: rateResult.color }}>{rateResult.rate.toFixed(2)}</span>
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>mL/kg/jam</span>
            </div>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <span style={{
              display: 'inline-block',
              font: 'var(--type-caption-2)', fontWeight: 700, color: rateResult.color,
              background: `color-mix(in srgb, ${rateResult.color} 12%, transparent)`,
              padding: '3px 10px', borderRadius: 'var(--r-pill)',
            }}>{rateResult.label}</span>
          </div>
        </div>
      )}

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Panduan UO Normal</p>
        {[
          { label: 'Oliguria', val: '< 0.5 mL/kg/jam' },
          { label: 'Borderline / low normal', val: '0.5–1.0 mL/kg/jam' },
          { label: 'Normal', val: '1–4 mL/kg/jam' },
          { label: 'Poliuria', val: '> 4 mL/kg/jam' },
          { label: 'Neonatus — oliguria', val: '< 1.0 mL/kg/jam' },
        ].map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-caption-1)', color: 'var(--label-primary)' }}>{r.val}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────
function InputRow({ label, unit, value, onChange, placeholder, type, readOnly }: {
  label: string; unit: string; value: string;
  onChange?: (v: string) => void; placeholder: string; type?: string; readOnly?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)' }}>
      <div style={{ flex: 1 }}>
        <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{label}</span>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>({unit})</span>
      </div>
      <input
        type={type ?? 'text'} value={value} readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        style={{
          width: 100, textAlign: 'right', borderRadius: 'var(--r-sm)',
          border: 'none', outline: 'none',
          background: readOnly ? 'transparent' : 'var(--fill-tertiary)',
          color: readOnly ? 'var(--label-secondary)' : 'var(--label-primary)',
          font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
        }}
      />
    </div>
  );
}

const RENAL_THEORY = [
  {
    title: 'eGFR & Formula Schwartz',
    content: `Bedside Schwartz 2009 (formula yang diperbarui):
eGFR = 0.413 × tinggi (cm) / kreatinin serum (mg/dL)

Berlaku untuk anak 1–18 tahun dengan kreatinin menggunakan metode enzimatik/IDMS-calibrated (standar laboratorium modern).

Perhatian:
• Bila lab masih menggunakan metode Jaffe (lebih tua), nilai Cr ±20% lebih tinggi → eGFR bisa underestimasi
• Tidak valid pada AKI (nilai kreatinin berubah cepat)
• Kehamilan, amputasi, sangat pendek: hitung dengan hati-hati`,
  },
  {
    title: 'Staging CKD (KDIGO 2012)',
    content: `G1: eGFR ≥ 90 — Normal atau tinggi (+ tanda kerusakan ginjal)
G2: 60–89 — Penurunan ringan
G3a: 45–59 — Penurunan ringan-sedang
G3b: 30–44 — Penurunan sedang-berat
G4: 15–29 — Penurunan berat
G5: < 15 — Gagal ginjal (atau dialisis)

CKD didefinisikan sebagai kelainan struktur/fungsi ginjal yang berlangsung ≥ 3 bulan. G1 + G2 hanya didiagnosis CKD bila ada tanda kerusakan ginjal lain (proteinuria, hematuria, kelainan imaging).`,
  },
  {
    title: 'Penyebab AKI pada Anak',
    content: `Prerenal (tersering, 50–70%):
• Dehidrasi (gastroenteritis, perdarahan)
• Syok distributif/kardiogenik
• Sindrom hepatorenal

Renal intrinsik:
• ATN (iskemia/nefrotoksin — AINS, aminoglikosida, kontras)
• Glomerulonefritis akut (PSAGN, IgA nephropathy, MPGN)
• HUS (Hemolytic Uremic Syndrome) — tersering AKI berat anak
• Nefritis interstisial akut

Postrenal:
• Obstruksi ureteropelvic junction, batu, tumor
• Neurogenic bladder`,
  },
  {
    title: 'Evaluasi & Monitoring CKD',
    content: `Evaluasi dasar:
• Urinalisis + protein:kreatinin urin (PCR)
• Ureum, kreatinin, eGFR
• Elektrolit: Na, K, bikarbonat, Ca, P
• CBC: anemia normsokromik normositik (EPO ↓)
• Parathyroid hormone (PTH) bila G3+
• Tekanan darah (HTN tersering pada CKD anak)
• USG ginjal: ukuran, korteks, obstruksi

Target monitoring (CKD G3+):
• TD: < 50th percentile usia/tinggi
• Hb: 11–12 g/dL (pertimbangkan EPO)
• Bikarbonat: > 22 mEq/L (suplemen NaHCO3 bila perlu)
• Ca × P product: < 55 mg²/dL² (risiko kalsifikasi)`,
  },
];

function TheoryAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 8px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>Panduan Klinis</p>
      </div>
      {RENAL_THEORY.map((s, i) => (
        <div key={i} style={{ borderTop: '0.5px solid var(--separator)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'var(--hit)' }}
          >
            <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', textAlign: 'left' }}>{s.title}</span>
            {open === i ? <ChevronUp size={16} color="var(--label-tertiary)" /> : <ChevronDown size={16} color="var(--label-tertiary)" />}
          </button>
          {open === i && (
            <div style={{ padding: '0 14px 14px' }}>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{s.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
