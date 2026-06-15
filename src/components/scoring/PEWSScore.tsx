import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import {
  calcPEWS,
  PEWS_BEHAVIOUR, PEWS_CARDIOVASCULAR, PEWS_RESPIRATORY,
  type PEWSItem,
} from '../../utils/pews';
import { REFERENCES } from '../../data/references';

function PEWSGroup({
  label, items, value, onChange,
}: {
  label: string; items: PEWSItem[]; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
          color: 'var(--tint-score)', background: 'color-mix(in srgb, var(--tint-score) 12%, transparent)',
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
                ? 'color-mix(in srgb, var(--tint-score) 12%, var(--bg-tertiary))'
                : 'var(--fill-tertiary)',
              outline: value === item.score ? '1.5px solid var(--tint-score)' : 'none',
              transition: 'all var(--dur-fast)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
              color: value === item.score ? 'var(--tint-score)' : 'var(--label-tertiary)',
              flexShrink: 0, minWidth: 20, textAlign: 'center',
            }}>{item.score}</span>
            <span style={{
              font: 'var(--type-footnote)', lineHeight: 1.35,
              fontWeight: value === item.score ? 600 : 400,
              color: value === item.score ? 'var(--label-primary)' : 'var(--label-secondary)',
            }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PEWSScore() {
  const [behaviour,      setBehaviour]      = useState(0);
  const [cardiovascular, setCardiovascular] = useState(0);
  const [respiratory,    setRespiratory]    = useState(0);

  const result = calcPEWS(behaviour, cardiovascular, respiratory);
  const isCritical = result.risk === 'kritis' || result.risk === 'tinggi';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">PEWS</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Pediatric Early Warning Score — deteksi dini deteriorasi klinis <Cite source="monaghan2005" />.
        </p>
      </div>

      <div className="ios-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PEWSGroup label="Perilaku" items={PEWS_BEHAVIOUR} value={behaviour} onChange={setBehaviour} />
        <div style={{ borderTop: '0.5px solid var(--separator)', paddingTop: 16 }}>
          <PEWSGroup label="Kardiovaskular" items={PEWS_CARDIOVASCULAR} value={cardiovascular} onChange={setCardiovascular} />
        </div>
        <div style={{ borderTop: '0.5px solid var(--separator)', paddingTop: 16 }}>
          <PEWSGroup label="Respirasi" items={PEWS_RESPIRATORY} value={respiratory} onChange={setRespiratory} />
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
            <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>PEWS</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: result.color, lineHeight: 1 }}>
              {result.total}
            </span>
          </div>
          <p style={{ font: 'var(--type-headline)', color: result.color, fontWeight: 700 }}>{result.riskLabel}</p>
        </div>
        <div style={{ padding: '12px 16px' }}>
          {isCritical && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, padding: '8px 10px', background: `color-mix(in srgb, ${result.color} 10%, transparent)`, borderRadius: 'var(--r-sm)' }}>
              <AlertTriangle size={14} style={{ color: result.color, flexShrink: 0, marginTop: 1 }} />
              <span style={{ font: 'var(--type-footnote)', fontWeight: 600, color: result.color }}>Tindakan segera diperlukan</span>
            </div>
          )}
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            {result.action}
          </p>
          <p style={{ font: 'var(--type-caption-1)', fontFamily: 'var(--font-mono)', color: 'var(--label-tertiary)', marginTop: 6 }}>
            0–2 rendah · 3–4 sedang · 5–6 tinggi · ≥ 7 kritis
          </p>
        </div>
      </div>

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['monaghan2005'] as const).map((key) => (
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
