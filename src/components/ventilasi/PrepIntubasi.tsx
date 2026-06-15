import { useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
// CheckCircle2 + Circle used in checklist; AlertTriangle/ChevronDown/Up in drug warnings
import { usePatientStore } from '../../store/patientStore';
import { TRIAS_BY_CATEGORY, type TriasDrug } from '../../data/triasDrugs';
import { ettSizeByAge, roundToHalf } from '../../utils/ett';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { REFERENCES } from '../../data/references';

// ── Drug detail card (selected drug info) ────────────────────────────────────
function DrugDetailCard({ drug, weightKg }: { drug: TriasDrug; weightKg: number }) {
  const [showWarning, setShowWarning] = useState(false);
  const isMcg    = drug.rsiDose.unit === 'mcg/kg';
  const doseMinRaw = drug.rsiDose.min * weightKg;
  const doseMaxRaw = drug.rsiDose.max * weightKg;
  const doseMinMg  = isMcg ? doseMinRaw / 1000 : doseMinRaw;
  const doseMaxMg  = isMcg ? doseMaxRaw / 1000 : doseMaxRaw;
  const volMin = doseMinMg / drug.concentration;
  const volMax = doseMaxMg / drug.concentration;
  const hasWeight = weightKg > 0;

  return (
    <div style={{
      borderRadius: 'var(--r-card)',
      border: '1.5px solid var(--accent)',
      background: 'color-mix(in srgb, var(--accent) 6%, var(--bg-tertiary))',
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          Onset: <strong>{drug.onset}</strong>
        </span>
        <span style={{ color: 'var(--label-tertiary)' }}>·</span>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          Durasi: <strong>{drug.duration}</strong>
        </span>
      </div>

      <div style={{ marginBottom: hasWeight ? 6 : 0 }}>
        <span style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>
          Dosis RSI
        </span>
        <div style={{ font: 'var(--type-footnote)', color: 'var(--label-primary)', marginTop: 2 }}>
          {drug.rsiDose.min}–{drug.rsiDose.max} {drug.rsiDose.unit}
          {hasWeight && (
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
              {' '}→ {isMcg
                ? `${doseMinRaw.toFixed(0)}–${doseMaxRaw.toFixed(0)} mcg`
                : `${doseMinMg.toFixed(2)}–${doseMaxMg.toFixed(2)} mg`}
            </span>
          )}
        </div>
        {hasWeight && (
          <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 2 }}>
            Volume: <strong>{volMin.toFixed(2)}–{volMax.toFixed(2)} mL</strong>
            <span style={{ color: 'var(--label-tertiary)' }}> ({drug.concentration} {drug.concentrationUnit})</span>
          </div>
        )}
      </div>

      {drug.notes && (
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 6, borderTop: '0.5px solid var(--separator)', paddingTop: 6 }}>
          {drug.notes}
        </p>
      )}

      {drug.warnings && drug.warnings.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <button
            onClick={() => setShowWarning(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--sys-yellow)' }}
          >
            <AlertTriangle size={12} />
            <span style={{ font: 'var(--type-caption-2)', fontWeight: 600 }}>
              {showWarning ? 'Sembunyikan' : 'Lihat'} peringatan
            </span>
            {showWarning ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showWarning && (
            <ul style={{ margin: '4px 0 0', paddingLeft: 14, listStyleType: 'disc' }}>
              {drug.warnings.map((w, i) => (
                <li key={i} style={{ font: 'var(--type-caption-1)', color: 'var(--sys-yellow)', lineHeight: 1.4 }}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ── Checklist ─────────────────────────────────────────────────────────────────
const ALAT_LIST = [
  'Laringoskop + blade sesuai usia (Miller untuk neonatus/bayi, Macintosh untuk anak)',
  'BVM + masker ukuran sesuai, terhubung O₂',
  'ETT cuffed & uncuffed ukuran sesuai + satu nomor lebih kecil',
  'Stylet, forceps Magill, tape/plester fiksasi ETT',
  'Syringe 10 mL untuk inflate cuff (jika cuffed)',
  'Suction siap nyala + kateter yankauer',
  'Monitor: SpO₂, EKG, NIBP terpasang',
  'Akses IV atau IO terpasang & berfungsi',
  'Oksigen aliran tinggi aktif (pre-oksigenasi 3–5 mnt)',
  'Konfirmasi posisi ETT: stetoskop + ETCO₂ / kapnografi',
];

// ── Emergency drugs ──────────────────────────────────────────────────────────
function EmergencyDrugs({ weightKg }: { weightKg: number }) {
  const hasWeight = weightKg > 0;
  const drugs = [
    {
      name: 'Atropin',
      dose: '0.01–0.02 mg/kg IV (min 0.1 mg)',
      conc: 0.25,
      concLabel: '0.25 mg/mL',
      minDose: Math.max(0.1, 0.01 * weightKg),
      maxDose: Math.max(0.1, 0.02 * weightKg),
      note: 'Pre-medikasi bradikardi, sekresi (suksinilkolin pada anak kecil)',
    },
    {
      name: 'Epinefrin (Adrenalin)',
      dose: '0.01 mg/kg IV = 0.1 mL/kg larutan 1:10.000',
      conc: 0.1,
      concLabel: '0.1 mg/mL (1:10.000)',
      minDose: 0.01 * weightKg,
      maxDose: 0.01 * weightKg,
      note: 'Henti jantung / anafilaksis berat',
    },
  ];

  return (
    <div className="ios-list">
      {drugs.map((d, i) => (
        <div key={d.name} style={{
          padding: '12px 14px',
          borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
          background: 'var(--bg-tertiary)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>
              {d.name}
            </span>
            {hasWeight && (
              <span style={{
                font: 'var(--type-caption-1)', fontWeight: 700,
                color: 'var(--sys-orange)',
                background: 'color-mix(in srgb, var(--sys-orange) 12%, transparent)',
                padding: '2px 8px', borderRadius: 'var(--r-pill)', flexShrink: 0,
              }}>
                {d.minDose === d.maxDose
                  ? `${d.minDose.toFixed(2)} mg`
                  : `${d.minDose.toFixed(2)}–${d.maxDose.toFixed(2)} mg`}
                {' '}= {d.minDose === d.maxDose
                  ? `${(d.minDose / d.conc).toFixed(1)} mL`
                  : `${(d.minDose / d.conc).toFixed(1)}–${(d.maxDose / d.conc).toFixed(1)} mL`}
              </span>
            )}
          </div>
          <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginTop: 3 }}>{d.dose}</p>
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 1 }}>
            Konsentrasi: {d.concLabel} · {d.note}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function PrepIntubasi() {
  const { weightKg, ageYears } = usePatientStore();
  const weight = parseFloat(weightKg) || 0;
  const age    = parseFloat(ageYears)  || 0;

  const [checkedAlat, setCheckedAlat] = useState<Record<number, boolean>>({});
  const [selectedDrug, setSelectedDrug] = useState<Record<string, string>>({
    analgetik: TRIAS_BY_CATEGORY.analgetik[0].id,
    sedasi:    TRIAS_BY_CATEGORY.sedasi[0].id,
    relaksan:  TRIAS_BY_CATEGORY.relaksan[0].id,
  });

  function toggleAlat(i: number) {
    setCheckedAlat(prev => ({ ...prev, [i]: !prev[i] }));
  }

  const ettRaw = age > 0 ? ettSizeByAge(age) : null;
  const ett = ettRaw ? { ...ettRaw, depth: roundToHalf(ettRaw.uncuffed * 3) } : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── Checklist Alat ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Checklist Alat & Persiapan</span>
          <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
            {Object.values(checkedAlat).filter(Boolean).length}/{ALAT_LIST.length}
          </span>
        </div>
        <div className="ios-list">
          {ALAT_LIST.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleAlat(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', minHeight: 'var(--hit)',
                borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
                background: checkedAlat[i]
                  ? 'color-mix(in srgb, var(--sys-green) 6%, var(--bg-tertiary))'
                  : 'var(--bg-tertiary)',
                width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background var(--dur-fast)',
              }}
            >
              {checkedAlat[i]
                ? <CheckCircle2 size={20} style={{ color: 'var(--sys-green)', flexShrink: 0, marginTop: 1 }} />
                : <Circle size={20} style={{ color: 'var(--separator)', flexShrink: 0, marginTop: 1 }} />}
              <span style={{
                font: 'var(--type-subheadline)',
                color: checkedAlat[i] ? 'var(--label-tertiary)' : 'var(--label-primary)',
                textDecoration: checkedAlat[i] ? 'line-through' : 'none',
              }}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ETT Reference ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Ukuran ETT <Cite source="pals2020" /></span>
        </div>
        {ett ? (
          <div className="ios-card" style={{ padding: '14px 16px' }}>
            <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', marginBottom: 10 }}>
              Berdasarkan usia {age} tahun
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'Uncuffed', val: `${ett.uncuffed} mm`, sub: 'usia/4 + 4' },
                { label: 'Cuffed',   val: `${ett.cuffed} mm`,   sub: 'usia/4 + 3.5' },
                { label: 'Kedalaman', val: `${ett.depth} cm`,   sub: 'ukuran × 3' },
              ].map(c => (
                <div key={c.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{c.val}</div>
                  <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', marginTop: 2 }}>{c.label}</div>
                  <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="ios-card" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0 }}>
              {[
                { label: 'Prematur', uncuffed: '2.5', cuffed: '—',   depth: '7' },
                { label: 'Aterm',    uncuffed: '3.0–3.5', cuffed: '—', depth: '9–10' },
                { label: '1 th',     uncuffed: '4.0', cuffed: '3.5', depth: '12' },
                { label: '2 th',     uncuffed: '4.5', cuffed: '4.0', depth: '13' },
              ].map((r, i) => (
                <div key={i} style={{
                  padding: '8px 6px', textAlign: 'center',
                  borderRight: i < 3 ? '0.5px solid var(--separator)' : 'none',
                }}>
                  <div style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-primary)', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ font: 'var(--type-caption-1)', color: 'var(--accent)' }}>U: {r.uncuffed}</div>
                  <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>C: {r.cuffed}</div>
                  <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>D: {r.depth} cm</div>
                </div>
              ))}
            </div>
            <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginTop: 8, textAlign: 'center' }}>
              Isi data pasien (usia) untuk kalkulasi otomatis
            </p>
          </div>
        )}
      </div>

      {/* ── Trias RSI ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Trias RSI <Cite source="bnfc2023" /></span>
          {!weight && (
            <span style={{ font: 'var(--type-caption-1)', color: 'var(--sys-yellow)' }}>Isi berat pasien</span>
          )}
        </div>

        {(['analgetik', 'sedasi', 'relaksan'] as const).map((cat) => {
          const catLabel = cat === 'analgetik' ? 'Analgetik' : cat === 'sedasi' ? 'Sedasi / Induksi' : 'Muscle Relaxant';
          const drugs    = TRIAS_BY_CATEGORY[cat];
          const activeDrug = drugs.find(d => d.id === selectedDrug[cat]);
          return (
            <div key={cat} style={{ marginBottom: 12, padding: '0 16px' }}>
              {/* Row: label + dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ font: 'var(--type-footnote)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>
                  {catLabel}
                </span>
                <select
                  value={selectedDrug[cat]}
                  onChange={e => setSelectedDrug(prev => ({ ...prev, [cat]: e.target.value }))}
                  style={{
                    padding: '5px 28px 5px 10px',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--separator)',
                    background: 'var(--fill-secondary)',
                    color: 'var(--label-primary)',
                    font: 'var(--type-footnote)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    appearance: 'auto',
                    minWidth: 140,
                  }}
                >
                  {drugs.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              {/* Selected drug detail card */}
              {activeDrug && <DrugDetailCard drug={activeDrug} weightKg={weight} />}
            </div>
          );
        })}
      </div>

      {/* ── Obat Emergensi ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Obat Emergensi <Cite source="pals2020" /></span>
        </div>
        <EmergencyDrugs weightKg={weight} />
      </div>

      <Disclaimer />

      {/* Reference block */}
      <div className="ios-card" style={{ padding: '12px 14px', marginBottom: 8 }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['pals2020', 'bnfc2023'] as const).map((key) => (
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
