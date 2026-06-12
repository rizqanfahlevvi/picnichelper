import { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import {
  calculateDownes,
  DOWNES_OPTIONS,
  DOWNES_PARAM_LABELS,
  type DownesInput,
  type DownesParam,
} from '../../utils/downes';
import { REFERENCES } from '../../data/references';

const PARAMS = Object.keys(DOWNES_PARAM_LABELS) as DownesParam[];

const SEVERITY_TINT = {
  ringan: 'var(--sys-green)',
  sedang: 'var(--sys-orange)',
  berat:  'var(--sys-red)',
};

export function DownesScore() {
  const [values, setValues] = useState<DownesInput>({
    respiratoryRate: 0,
    retractions: 0,
    cyanosis: 0,
    airEntry: 0,
    grunting: 0,
  });

  const result = calculateDownes(values);
  const tint = SEVERITY_TINT[result.severity];

  function set(param: DownesParam, score: 0 | 1 | 2) {
    setValues((prev) => ({ ...prev, [param]: score }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Downes Score</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Penilaian distres napas neonatus <Cite source="downes1970" />.
        </p>
      </div>

      <div className="ios-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PARAMS.map((param) => (
          <div key={param}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>
                {DOWNES_PARAM_LABELS[param]}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
                color: 'var(--tint-score)',
                background: 'color-mix(in srgb, var(--tint-score) 12%, transparent)',
                padding: '2px 10px', borderRadius: 'var(--r-pill)',
              }}>
                {values[param]}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {DOWNES_OPTIONS[param].map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => set(param, opt.score)}
                  style={{
                    minHeight: 'var(--hit)', borderRadius: 10, border: 'none', cursor: 'pointer',
                    padding: '8px 6px', textAlign: 'center',
                    font: 'var(--type-caption-1)', fontWeight: values[param] === opt.score ? 600 : 400,
                    lineHeight: 1.3,
                    background: values[param] === opt.score
                      ? 'color-mix(in srgb, var(--tint-score) 15%, var(--bg-tertiary))'
                      : 'var(--fill-tertiary)',
                    color: values[param] === opt.score ? 'var(--tint-score)' : 'var(--label-secondary)',
                    outline: values[param] === opt.score ? '1.5px solid var(--tint-score)' : 'none',
                    transition: 'all var(--dur-fast)',
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 700, marginBottom: 2, fontSize: 14 }}>{opt.score}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="ios-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '14px 16px',
          background: `color-mix(in srgb, ${tint} 10%, var(--bg-tertiary))`,
          borderBottom: '0.5px solid var(--separator)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Skor</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: tint, lineHeight: 1 }}>
              {result.total}
            </span>
          </div>
          <p style={{ font: 'var(--type-headline)', color: tint, fontWeight: 700, textTransform: 'capitalize' }}>
            {result.severity}
          </p>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            {result.interpretation}
          </p>
          <p style={{ font: 'var(--type-caption-1)', fontFamily: 'var(--font-mono)', color: 'var(--label-tertiary)', marginTop: 6 }}>
            Skala: 0–2 ringan · 3–5 sedang · 6–10 berat
          </p>
        </div>
      </div>

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES.downes1970.id}]</span>{' '}
          {REFERENCES.downes1970.citation}
        </p>
      </div>
    </div>
  );
}
