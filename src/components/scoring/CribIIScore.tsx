import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { calculateCribII, type CribIIInput, type CribIISex } from '../../utils/cribii';
import { REFERENCES } from '../../data/references';

const DEFAULT: CribIIInput = {
  gestationalAgeWeeks: 28,
  birthWeightGrams: 1000,
  sex: 'male',
  admissionTemperatureC: 36.5,
  baseExcess: 0,
};

const RISK_TINT = {
  'rendah':        'var(--sys-green)',
  'sedang':        'var(--sys-orange)',
  'tinggi':        'var(--sys-red)',
  'sangat tinggi': 'var(--sys-red)',
};

export function CribIIScore() {
  const [v, setV] = useState<CribIIInput>(DEFAULT);
  const [error, setError] = useState<string | null>(null);

  function num(key: keyof CribIIInput, val: string) {
    setError(null);
    setV((p) => ({ ...p, [key]: Number(val) || 0 }));
  }
  function setSex(sex: CribIISex) {
    setError(null);
    setV((p) => ({ ...p, sex }));
  }

  let result: ReturnType<typeof calculateCribII> | null = null;
  try {
    result = calculateCribII(v);
    if (error) setError(null);
  } catch (e) {
    if (!error) setError(e instanceof Error ? e.message : 'Input tidak valid');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">CRIB-II</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Clinical Risk Index for Babies II <Cite source="parry2003" />. Neonatus prematur ≤ 32 minggu.
        </p>
      </div>

      <div className="ios-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="Usia gestasi" unit="minggu" value={v.gestationalAgeWeeks}
            onChange={(x) => num('gestationalAgeWeeks', x)} min={22} max={32} />
          <NF label="Berat lahir" unit="gram" value={v.birthWeightGrams}
            onChange={(x) => num('birthWeightGrams', x)} />
        </div>

        <div>
          <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)', display: 'block', marginBottom: 8 }}>
            Jenis Kelamin
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(['male', 'female'] as CribIISex[]).map((sex) => (
              <button key={sex} onClick={() => setSex(sex)}
                style={optionStyle(v.sex === sex)}>
                {sex === 'male' ? 'Laki-laki' : 'Perempuan'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="Suhu masuk" unit="°C" value={v.admissionTemperatureC}
            onChange={(x) => num('admissionTemperatureC', x)} step="0.1" />
          <NF label="Base Excess" unit="mmol/L" value={v.baseExcess}
            onChange={(x) => num('baseExcess', x)} step="0.1" />
        </div>
      </div>

      {error && (
        <div className="ios-warn ios-warn--danger">
          <AlertTriangle size={15} /><span>{error}</span>
        </div>
      )}

      {result && (
        <>
          <ScoreResult
            total={result.total} tint={RISK_TINT[result.riskCategory]}
            label={`Risiko ${result.riskCategory}`}
            sub={`Estimasi mortalitas: ~${result.estimatedMortalityPercent}% (tabel Parry 2003)`}
          />
          <OrganBreakdown items={result.subscores.map(s => ({ organ: s.label, detail: '', score: s.score }))} />
        </>
      )}

      <Disclaimer />
      <RefCard refKey="parry2003" />
    </div>
  );
}

function optionStyle(active: boolean): React.CSSProperties {
  return {
    minHeight: 'var(--hit)', borderRadius: 10, border: 'none', cursor: 'pointer',
    font: 'var(--type-subheadline)', fontWeight: active ? 600 : 400,
    background: active ? 'color-mix(in srgb, var(--tint-score) 15%, var(--bg-tertiary))' : 'var(--fill-tertiary)',
    color: active ? 'var(--tint-score)' : 'var(--label-secondary)',
    outline: active ? '1.5px solid var(--tint-score)' : 'none',
    transition: 'all var(--dur-fast)',
  };
}

function NF({ label, unit, value, onChange, step, min, max }: {
  label: string; unit: string; value: number;
  onChange: (v: string) => void; step?: string; min?: number; max?: number;
}) {
  return (
    <div>
      <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)', display: 'block', marginBottom: 6 }}>
        {label}{unit && <span style={{ fontWeight: 400, color: 'var(--label-tertiary)' }}> ({unit})</span>}
      </label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        step={step ?? '1'} min={min} max={max}
        style={{
          width: '100%', minHeight: 40, borderRadius: 'var(--r-sm)',
          border: '0.5px solid var(--separator)', outline: 'none',
          background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
          font: 'var(--type-body)', padding: '0 10px', boxSizing: 'border-box',
        }} />
    </div>
  );
}

function ScoreResult({ total, tint, label, sub }: { total: number; tint: string; label: string; sub?: string }) {
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '14px 16px',
        background: `color-mix(in srgb, ${tint} 10%, var(--bg-tertiary))`,
        borderBottom: '0.5px solid var(--separator)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: tint, lineHeight: 1 }}>{total}</span>
        </div>
        <p style={{ font: 'var(--type-headline)', color: tint, fontWeight: 700, marginTop: 4, textTransform: 'capitalize' }}>{label}</p>
      </div>
      {sub && (
        <div style={{ padding: '10px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>{sub}</p>
        </div>
      )}
    </div>
  );
}

function OrganBreakdown({ items }: { items: { organ: string; detail: string; score: number }[] }) {
  return (
    <div className="ios-list">
      {items.map((o, i) => (
        <div key={o.organ} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', minHeight: 40,
          borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
          background: 'var(--bg-tertiary)',
        }}>
          <div>
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{o.organ}</span>
            {o.detail && <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 1 }}>{o.detail}</p>}
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
            color: o.score > 0 ? 'var(--sys-red)' : 'var(--sys-green)',
          }}>{o.score}</span>
        </div>
      ))}
    </div>
  );
}

function RefCard({ refKey }: { refKey: keyof typeof REFERENCES }) {
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
        <li style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[refKey].id}]</span>{' '}
          {REFERENCES[refKey].citation}
        </li>
      </ol>
    </div>
  );
}
