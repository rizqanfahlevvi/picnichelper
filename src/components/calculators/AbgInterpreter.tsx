import { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { interpretAbg, type AbgResult, type PrimaryDisorder } from '../../utils/abg';
import { REFERENCES } from '../../data/references';

const DISORDER_LABEL: Record<PrimaryDisorder, string> = {
  metabolic_acidosis:    'Asidosis Metabolik',
  metabolic_alkalosis:   'Alkalosis Metabolik',
  respiratory_acidosis:  'Asidosis Respiratorik',
  respiratory_alkalosis: 'Alkalosis Respiratorik',
  normal:                'AGD Normal',
};

const DISORDER_TINT: Record<PrimaryDisorder, string> = {
  metabolic_acidosis:    'var(--sys-red)',
  metabolic_alkalosis:   'var(--sys-green)',
  respiratory_acidosis:  'var(--sys-orange)',
  respiratory_alkalosis: 'var(--sys-cyan)',
  normal:                'var(--sys-green)',
};

export function AbgInterpreter() {
  const [pH, setPH] = useState('');
  const [paCO2, setPaCO2] = useState('');
  const [hco3, setHco3] = useState('');
  const [result, setResult] = useState<AbgResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleInterpret() {
    setError(null);
    setResult(null);
    try {
      setResult(interpretAbg({ pH: Number(pH), paCO2: Number(paCO2), hco3: Number(hco3) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Input tidak valid');
    }
  }

  function handleReset() {
    setPH(''); setPaCO2(''); setHco3('');
    setResult(null); setError(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Interpretasi AGD</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Boston Rules <Cite source="boston1980" /> — kompensasi asam-basa.
        </p>
      </div>

      {/* Input grid */}
      <div className="ios-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '12px 14px', gap: 10 }}>
          <AbgField label="pH" value={pH} onChange={setPH} placeholder="7.40" hint="6.5–7.9" />
          <AbgField label="PaCO₂" unit="mmHg" value={paCO2} onChange={setPaCO2} placeholder="40" hint="1–150" />
          <AbgField label="HCO₃⁻" unit="mEq/L" value={hco3} onChange={setHco3} placeholder="24" hint="1–60" />
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px' }}>
          <button
            onClick={handleInterpret}
            disabled={!pH || !paCO2 || !hco3}
            style={{
              flex: 1, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff',
              font: 'var(--type-body)', fontWeight: 600,
              opacity: !pH || !paCO2 || !hco3 ? 0.4 : 1,
              transition: 'opacity var(--dur-fast)',
            }}
          >
            Interpretasi
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '0 20px', minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: '0.5px solid var(--separator)', cursor: 'pointer',
              background: 'transparent', color: 'var(--label-primary)',
              font: 'var(--type-body)',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="ios-warn ios-warn--danger">
          <span>{error}</span>
        </div>
      )}

      {result && <AbgResultCard result={result} />}

      <NormalRangeCard />
      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES.boston1980.id}]</span>{' '}
          {REFERENCES.boston1980.citation}
        </p>
      </div>
    </div>
  );
}

function AbgField({ label, unit, value, onChange, placeholder, hint }: {
  label: string; unit?: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; hint: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)' }}>
        {label}{unit && <span style={{ color: 'var(--label-tertiary)', fontWeight: 400 }}> ({unit})</span>}
      </label>
      <input
        type="number" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 40, borderRadius: 'var(--r-sm)',
          border: '0.5px solid var(--separator)', outline: 'none',
          background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
          font: 'var(--type-body)', padding: '0 10px', boxSizing: 'border-box',
        }}
      />
      <span style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>{hint}</span>
    </div>
  );
}

function AbgResultCard({ result }: { result: AbgResult }) {
  const tint = DISORDER_TINT[result.primaryDisorder];

  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--separator)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: tint, flexShrink: 0 }} />
          <span style={{ font: 'var(--type-headline)', color: 'var(--label-primary)' }}>
            {DISORDER_LABEL[result.primaryDisorder]}
          </span>
        </div>
        <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', marginTop: 6 }}>
          {result.interpretation}
        </p>
      </div>

      {result.expectedCompensation && (
        <div style={{ padding: '12px 16px' }}>
          <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 6 }}>
            {result.expectedCompensation.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: tint }}>
              {result.expectedCompensation.low.toFixed(1)}–{result.expectedCompensation.high.toFixed(1)}
            </span>
          </div>
          <CompStatus status={result.compensationStatus} tint={tint} />
        </div>
      )}
    </div>
  );
}

function CompStatus({ status, tint }: { status: AbgResult['compensationStatus']; tint: string }) {
  if (status === 'not_applicable') return null;
  const labels = {
    adequate: 'Kompensasi adekuat',
    over:     'Kompensasi berlebih',
    under:    'Kompensasi kurang',
  };
  return (
    <span style={{
      display: 'inline-block', marginTop: 6,
      font: 'var(--type-caption-2)', fontWeight: 600, color: tint,
      background: `color-mix(in srgb, ${tint} 12%, transparent)`,
      padding: '3px 9px', borderRadius: 'var(--r-pill)',
    }}>
      {labels[status]}
    </span>
  );
}

function NormalRangeCard() {
  const rows = [
    { param: 'pH',    range: '7.35–7.45' },
    { param: 'PaCO₂', range: '35–45 mmHg' },
    { param: 'HCO₃⁻', range: '22–26 mEq/L' },
  ];
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>
        Nilai Normal
      </p>
      {rows.map((r) => (
        <div key={r.param} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-footnote)', color: 'var(--label-primary)' }}>{r.param}</span>
          <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>{r.range}</span>
        </div>
      ))}
    </div>
  );
}
