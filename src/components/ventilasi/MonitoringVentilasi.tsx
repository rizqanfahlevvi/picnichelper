import { useState } from 'react';
import { usePatientStore } from '../../store/patientStore';
import { TRIAS_BY_CATEGORY, type TriasDrug } from '../../data/triasDrugs';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { REFERENCES } from '../../data/references';
import { CheckCircle2, Circle } from 'lucide-react';

// ── Monitoring checklist items ────────────────────────────────────────────────
const MONITORING_LIST = [
  { text: 'SpO₂: target 91–95% (RDS/prematur) atau ≥ 95% (kondisi lain)', detail: 'Titrasi FiO₂ ke target terendah yang aman [47]' },
  { text: 'EtCO₂: target 35–45 mmHg (normokarbik)', detail: 'Pada HIE: hindari hiperventilasi (PaCO₂ < 35 mmHg dapat memperburuk iskemia serebral)' },
  { text: 'Peak Inspiratory Pressure (PIP) < 30 cmH₂O', detail: 'PIP tinggi → risiko volutrauma/barotrauma; pertimbangkan turunkan TV atau ubah mode [47]' },
  { text: 'Plateau pressure < 28 cmH₂O', detail: 'Ukur plateau pressure saat no-flow pause; merepresentasikan tekanan alveolar puncak' },
  { text: 'Cek simetri dada & suara napas bilateral', detail: 'Asimetri → curiga intubasi endobronkial, pneumotoraks, atau atelektasis' },
  { text: 'Dynamic compliance: TV / (PIP − PEEP)', detail: 'Compliance menurun → worsening ARDS, edema, mucus plugging' },
  { text: 'Posisi ETT terkonfirmasi (CXR atau auskultasi)', detail: 'Kedalaman ETT = ukuran × 3 cm dari bibir; konfirmasi EtCO₂ kontinyu' },
  { text: 'NGT terpasang dan berfungsi', detail: 'Cegah distensi lambung yang dapat mengganggu ekskursi diafragma' },
  { text: 'Head of Bed (HOB) 30°', detail: 'Posisi semi-tegak mengurangi risiko VAP (Ventilator-Associated Pneumonia) [48]' },
  { text: 'Monitoring sedasi: RASS atau Comfort Score', detail: 'Target RASS -2 hingga 0 (sedasi ringan); hindari over-sedasi' },
];

// ── Maintenance drug calculator ───────────────────────────────────────────────
// Only drugs that have maintenanceDose defined
type MaintenanceDrug = TriasDrug & Required<Pick<TriasDrug, 'maintenanceDose'>>;

function getAllMaintDrugs(): MaintenanceDrug[] {
  return [...TRIAS_BY_CATEGORY.analgetik, ...TRIAS_BY_CATEGORY.sedasi, ...TRIAS_BY_CATEGORY.relaksan]
    .filter((d): d is MaintenanceDrug => d.maintenanceDose !== undefined);
}

function MaintenanceCalc({ weightKg }: { weightKg: number }) {
  const [selected, setSelected] = useState<string>('fentanil');
  const drugs = getAllMaintDrugs();
  const drug  = drugs.find(d => d.id === selected)!;

  const hasWeight = weightKg > 0;
  const md = drug.maintenanceDose;

  // convert dose to mg first, then to mL/hr
  const isMcg  = md.unit === 'mcg/kg/jam' || md.unit === 'mcg/kg/mnt';
  const perMin = md.unit === 'mcg/kg/mnt';

  function calcMlHr(dose: number): number {
    // dose in mcg/kg/jam or mg/kg/jam
    const dosePerHour = perMin ? dose * 60 : dose;
    const doseMgHr = isMcg ? (dosePerHour * weightKg) / 1000 : dosePerHour * weightKg;
    return doseMgHr / drug.concentration;
  }

  const mlHrMin = hasWeight ? calcMlHr(md.min) : 0;
  const mlHrMax = hasWeight ? calcMlHr(md.max) : 0;

  const catLabel: Record<string, string> = { analgetik: 'Analgetik', sedasi: 'Sedasi', relaksan: 'Relaksan' };

  return (
    <div>
      {/* Drug selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 0 10px' }}>
        {drugs.map(d => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            style={{
              padding: '5px 12px', borderRadius: 'var(--r-pill)',
              border: selected === d.id ? 'none' : '1px solid var(--separator)',
              background: selected === d.id ? 'var(--accent)' : 'var(--fill-secondary)',
              color: selected === d.id ? '#fff' : 'var(--label-primary)',
              font: 'var(--type-footnote)', fontWeight: selected === d.id ? 600 : 400,
              cursor: 'pointer', transition: 'all var(--dur-fast)',
            }}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Result card */}
      <div style={{
        background: 'var(--fill-secondary)',
        borderRadius: 'var(--r-card)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>{drug.name}</span>
            <span style={{
              marginLeft: 8, font: 'var(--type-caption-2)', fontWeight: 600,
              background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
              color: 'var(--accent)', padding: '2px 8px', borderRadius: 'var(--r-pill)',
            }}>
              {catLabel[drug.category]}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', marginBottom: 2 }}>Dosis maintenance</p>
            <p style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--label-primary)' }}>
              {md.min}–{md.max} {md.unit}
            </p>
          </div>
          {hasWeight && (
            <div>
              <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', marginBottom: 2 }}>
                Kecepatan infus
              </p>
              <p style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--accent)' }}>
                {mlHrMin.toFixed(2)}–{mlHrMax.toFixed(2)} mL/jam
              </p>
            </div>
          )}
        </div>

        {hasWeight && (
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 6 }}>
            Konsentrasi: {drug.concentration} {drug.concentrationUnit} · Berat: {weightKg} kg
          </p>
        )}
        {!hasWeight && (
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--sys-yellow)', marginTop: 6 }}>
            Isi berat pasien untuk kalkulasi volume infus
          </p>
        )}

        {drug.notes && (
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 8, borderTop: '0.5px solid var(--separator)', paddingTop: 8 }}>
            {drug.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ── SBT steps ─────────────────────────────────────────────────────────────────
const SBT_STEPS = [
  'Set mode CPAP 5 cmH₂O atau T-piece.',
  'Observasi 30–120 menit.',
  'Gagal bila: RR > 35×/mnt, SpO₂ < 90%, HR ↑/↓ > 20%, retraksi berat, atau agitasi.',
  'Lanjut ekstubasi bila SBT berhasil dan proteksi jalan napas adekuat.',
];

// ── Main component ─────────────────────────────────────────────────────────────
export function MonitoringVentilasi() {
  const { weightKg } = usePatientStore();
  const [localWeight, setLocalWeight] = useState(weightKg);
  const weight = parseFloat(localWeight) || 0;

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  function toggle(i: number) {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  }

  const ticked = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── Monitoring checklist ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Monitoring Ventilasi <Cite source="palicc2015" /></span>
          <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
            {ticked}/{MONITORING_LIST.length}
          </span>
        </div>
        <div className="ios-list">
          {MONITORING_LIST.map((item, i) => (
            <div key={i}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', minHeight: 'var(--hit)',
                borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
                background: checked[i]
                  ? 'color-mix(in srgb, var(--sys-green) 6%, var(--bg-tertiary))'
                  : 'var(--bg-tertiary)',
                transition: 'background var(--dur-fast)',
              }}>
                <button
                  onClick={() => toggle(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 1 }}
                >
                  {checked[i]
                    ? <CheckCircle2 size={20} style={{ color: 'var(--sys-green)' }} />
                    : <Circle size={20} style={{ color: 'var(--separator)' }} />}
                </button>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <span style={{
                    font: 'var(--type-subheadline)',
                    color: checked[i] ? 'var(--label-tertiary)' : 'var(--label-primary)',
                    textDecoration: checked[i] ? 'line-through' : 'none',
                  }}>
                    {item.text}
                  </span>
                </button>
              </div>
              {expanded === i && (
                <div style={{
                  padding: '8px 14px 10px 44px',
                  borderTop: '0.5px solid var(--separator)',
                  background: 'var(--fill-tertiary)',
                  font: 'var(--type-footnote)', color: 'var(--label-secondary)',
                }}>
                  {item.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Maintenance drug calculator ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Kalkulator Obat Maintenance <Cite source="bnfc2023" /></span>
        </div>
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          {/* Weight input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <label style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', flexShrink: 0 }}>
              Berat:
            </label>
            <input
              type="number"
              value={localWeight}
              onChange={e => setLocalWeight(e.target.value)}
              placeholder="kg"
              min={0.5}
              max={150}
              style={{
                width: 80, padding: '5px 8px', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--separator)', background: 'var(--fill-secondary)',
                color: 'var(--label-primary)', font: 'var(--type-body)',
              }}
            />
            <span style={{ font: 'var(--type-footnote)', color: 'var(--label-tertiary)' }}>kg</span>
          </div>
          <MaintenanceCalc weightKg={weight} />
        </div>
      </div>

      {/* ── SBT protocol ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Protokol SBT <Cite source="newth2009" /></span>
        </div>
        <div className="ios-list">
          {SBT_STEPS.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)',
              borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
              background: 'var(--bg-tertiary)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                color: 'var(--accent)', flexShrink: 0, marginTop: 2,
              }}>
                {i + 1}.
              </span>
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px', marginBottom: 8 }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['pals2020', 'palicc2015', 'newth2009', 'bnfc2023'] as const).map((key) => (
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
