import { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import {
  calcPGCS,
  EYE_ITEMS, VERBAL_ITEMS_ADULT, VERBAL_ITEMS_PEDS, MOTOR_ITEMS,
  type GCSItem,
} from '../../utils/pgcs';
import { REFERENCES } from '../../data/references';

function ScoreGroup({
  label, items, value, tint, onChange,
}: {
  label: string; items: GCSItem[]; value: number; tint: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
          color: tint, background: `color-mix(in srgb, ${tint} 12%, transparent)`,
          padding: '2px 10px', borderRadius: 'var(--r-pill)',
        }}>{value}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item) => (
          <button
            key={item.score}
            onClick={() => onChange(item.score)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              minHeight: 'var(--hit)', padding: '8px 12px',
              borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: value === item.score
                ? `color-mix(in srgb, ${tint} 12%, var(--bg-tertiary))`
                : 'var(--fill-tertiary)',
              outline: value === item.score ? `1.5px solid ${tint}` : 'none',
              transition: 'all var(--dur-fast)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
              color: value === item.score ? tint : 'var(--label-tertiary)',
              flexShrink: 0, minWidth: 20, textAlign: 'center',
            }}>{item.score}</span>
            <div>
              <div style={{ font: 'var(--type-footnote)', fontWeight: value === item.score ? 600 : 400, color: value === item.score ? 'var(--label-primary)' : 'var(--label-secondary)', lineHeight: 1.3 }}>
                {item.label}
              </div>
              <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', lineHeight: 1.3, marginTop: 1 }}>
                {item.detail}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PGCSScore() {
  const [isPeds, setIsPeds]   = useState(true);
  const [eye,    setEye]      = useState(4);
  const [verbal, setVerbal]   = useState(5);
  const [motor,  setMotor]    = useState(6);

  const result = calcPGCS(eye, verbal, motor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Pediatric GCS (pGCS)</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Glasgow Coma Scale modifikasi pediatri <Cite source="teasdale1974" /><Cite source="reilly1988" />.
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ padding: '0 16px' }}>
        <div className="ios-segmented">
          <button aria-selected={isPeds} onClick={() => setIsPeds(true)}>Bayi / Anak &lt; 5 th</button>
          <button aria-selected={!isPeds} onClick={() => setIsPeds(false)}>Anak &gt; 5 th / Dewasa</button>
        </div>
      </div>

      {/* Score inputs */}
      <div className="ios-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ScoreGroup label="E — Mata (Eye)" items={EYE_ITEMS} value={eye} tint="var(--sys-blue)" onChange={setEye} />
        <div style={{ borderTop: '0.5px solid var(--separator)', paddingTop: 16 }}>
          <ScoreGroup
            label={isPeds ? 'V — Verbal (modifikasi pediatri)' : 'V — Verbal'}
            items={isPeds ? VERBAL_ITEMS_PEDS : VERBAL_ITEMS_ADULT}
            value={verbal} tint="var(--sys-teal)"
            onChange={setVerbal}
          />
        </div>
        <div style={{ borderTop: '0.5px solid var(--separator)', paddingTop: 16 }}>
          <ScoreGroup label="M — Motorik" items={MOTOR_ITEMS} value={motor} tint="var(--sys-orange)" onChange={setMotor} />
        </div>
      </div>

      {/* Result */}
      <div className="ios-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '14px 16px',
          background: `color-mix(in srgb, ${result.color} 10%, var(--bg-tertiary))`,
          borderBottom: '0.5px solid var(--separator)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div>
              <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Total GCS
              </span>
              <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 2 }}>
                E{eye} + V{verbal} + M{motor}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: result.color, lineHeight: 1 }}>
              {result.total}
            </span>
          </div>
          <p style={{ font: 'var(--type-headline)', color: result.color, fontWeight: 700 }}>{result.severityLabel}</p>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            {result.detail}
          </p>
          <p style={{ font: 'var(--type-caption-1)', fontFamily: 'var(--font-mono)', color: 'var(--label-tertiary)', marginTop: 6 }}>
            Skala: ≤ 8 berat · 9–12 sedang · 13–14 ringan · 15 normal
          </p>
        </div>
      </div>

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['teasdale1974', 'reilly1988'] as const).map((key) => (
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
