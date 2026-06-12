import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { usePatientStore } from '../../store/patientStore';
import {
  calculateMaintenance,
  calculateResuscitationBolus,
  calculateDehydrationCorrection,
  type DehydrationDegree,
} from '../../utils/fluids';

type FluidTab = 'maintenance' | 'resusitasi' | 'dehidrasi';

const TABS: { id: FluidTab; label: string }[] = [
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'resusitasi',  label: 'Resusitasi'  },
  { id: 'dehidrasi',   label: 'Dehidrasi'   },
];

export function FluidCalculator() {
  const { weightKg } = usePatientStore();
  const [tab, setTab] = useState<FluidTab>('maintenance');

  const weightNum = Number(weightKg);
  const validWeight = weightKg.trim() !== '' && Number.isFinite(weightNum) && weightNum > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Cairan</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Maintenance <Cite source="holliday1957" /> · Resusitasi <Cite source="pals2020" />.
        </p>
      </div>

      <div className="ios-segmented" style={{ margin: '0 16px' }}>
        {TABS.map((t) => (
          <button key={t.id} aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {!validWeight && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p className="ios-footnote">Masukkan berat badan pasien untuk menghitung.</p>
        </div>
      )}

      {validWeight && tab === 'maintenance' && <MaintenanceSection weight={weightNum} />}
      {validWeight && tab === 'resusitasi'  && <ResuscitationSection weight={weightNum} />}
      {validWeight && tab === 'dehidrasi'   && <DehydrationSection weight={weightNum} />}

      <Disclaimer />
    </div>
  );
}

function MaintenanceSection({ weight }: { weight: number }) {
  let result: ReturnType<typeof calculateMaintenance> | null = null;
  let error: string | null = null;
  try { result = calculateMaintenance(weight); } catch (e) { error = e instanceof Error ? e.message : ''; }

  if (error) return (
    <div className="ios-warn ios-warn--danger"><AlertTriangle size={15} /><span>{error}</span></div>
  );
  if (!result) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="ios-card">
        <div className="ios-result-grid">
          <div className="ios-result tint-fluid">
            <span className="ios-result-label">mL/jam</span>
            <div><span className="ios-result-value">{result.mlPerHour.toFixed(1)}</span></div>
          </div>
          <div className="ios-result tint-fluid">
            <span className="ios-result-label">mL/24 jam</span>
            <div><span className="ios-result-value">{result.mlPer24Hours.toFixed(0)}</span></div>
          </div>
        </div>
      </div>
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 6 }}>
          Holliday-Segar (4-2-1) <Cite source="holliday1957" />
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-subheadline)', color: 'var(--label-primary)', marginBottom: 4 }}>{result.breakdown}</p>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
          ≤10 kg: 4 mL/kg/jam · 10–20 kg: +2/kg · &gt;20 kg: +1/kg
        </p>
      </div>
    </div>
  );
}

function ResuscitationSection({ weight }: { weight: number }) {
  const r10 = calculateResuscitationBolus(weight, 10);
  const r20 = calculateResuscitationBolus(weight, 20);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="ios-card">
        <BolusTile label="Bolus 10 mL/kg" note="sepsis tanpa hipovolemia" value={r10.bolusMl} />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />
        <BolusTile label="Bolus 20 mL/kg" note="standar resusitasi" value={r20.bolusMl} preferred />
      </div>
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginBottom: 4 }}>
          Cairan: NaCl 0.9% atau Ringer Laktat. Berikan dalam 5–20 menit IV/IO.
        </p>
        <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
          Ulangi bolus sesuai respons (max 60 mL/kg kecuali kontraindikasi). <Cite source="pals2020" />
        </p>
      </div>
    </div>
  );
}

function DehydrationSection({ weight }: { weight: number }) {
  const [degree, setDegree] = useState<DehydrationDegree>('sedang');

  let result: ReturnType<typeof calculateDehydrationCorrection> | null = null;
  try { result = calculateDehydrationCorrection(weight, degree); } catch { /* handled */ }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>
          Derajat Dehidrasi
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {(['ringan', 'sedang', 'berat'] as DehydrationDegree[]).map((d) => (
            <button key={d} onClick={() => setDegree(d)} style={{
              minHeight: 'var(--hit)', borderRadius: 10, border: 'none', cursor: 'pointer',
              textAlign: 'center', font: 'var(--type-subheadline)',
              fontWeight: degree === d ? 600 : 400,
              background: degree === d ? 'color-mix(in srgb, var(--tint-fluid) 15%, var(--bg-tertiary))' : 'var(--fill-tertiary)',
              color: degree === d ? 'var(--tint-fluid)' : 'var(--label-secondary)',
              outline: degree === d ? '1.5px solid var(--tint-fluid)' : 'none',
              transition: 'all var(--dur-fast)',
            }}>
              <span style={{ display: 'block', textTransform: 'capitalize' }}>{d}</span>
              <span style={{ font: 'var(--type-caption-2)', opacity: 0.7 }}>
                {d === 'ringan' ? '5%' : d === 'sedang' ? '10%' : '15%'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="ios-card">
          <div className="ios-result-grid">
            <div className="ios-result tint-fluid">
              <span className="ios-result-label">Defisit</span>
              <div><span className="ios-result-value" style={{ fontSize: 22 }}>{result.deficitMl}</span><span className="ios-result-unit">mL</span></div>
            </div>
            <div className="ios-result tint-fluid">
              <span className="ios-result-label">Total 24 jam</span>
              <div><span className="ios-result-value" style={{ fontSize: 22 }}>{result.totalMl}</span><span className="ios-result-unit">mL</span></div>
            </div>
          </div>
          <div style={{ padding: '10px 14px 12px', borderTop: '0.5px solid var(--separator)' }}>
            {[
              { label: 'Fase 1 (8 jam pertama)',      value: result.phase1Ml },
              { label: 'Fase 2 (16 jam berikutnya)',   value: result.phase2Ml },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--tint-fluid)' }}>{row.value} mL</span>
              </div>
            ))}
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 4 }}>
              ½ defisit + ⅓ maintenance fase 1 · ½ defisit + ⅔ maintenance fase 2
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function BolusTile({ label, note, value, preferred }: {
  label: string; note: string; value: number; preferred?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px',
      background: preferred ? 'color-mix(in srgb, var(--tint-fluid) 6%, var(--bg-tertiary))' : 'var(--bg-tertiary)',
    }}>
      <div>
        <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>{label}</span>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 1 }}>{note}</p>
      </div>
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--tint-fluid)' }}>
          {value}
        </span>
        <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginLeft: 4 }}>mL</span>
      </div>
    </div>
  );
}
