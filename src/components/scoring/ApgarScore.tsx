import { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import {
  calcApgar,
  APGAR_APPEARANCE, APGAR_PULSE, APGAR_GRIMACE, APGAR_ACTIVITY, APGAR_RESPIRATION,
  type ApgarItem,
} from '../../utils/apgar';
import { REFERENCES } from '../../data/references';

const APGAR_PARAMS: { label: string; items: ApgarItem[]; key: 'appearance' | 'pulse' | 'grimace' | 'activity' | 'respiration'; mnemonic: string }[] = [
  { key: 'appearance',  label: 'A — Appearance (Warna kulit)', mnemonic: 'A', items: APGAR_APPEARANCE  },
  { key: 'pulse',       label: 'P — Pulse (Denyut jantung)',   mnemonic: 'P', items: APGAR_PULSE       },
  { key: 'grimace',     label: 'G — Grimace (Refleks)',        mnemonic: 'G', items: APGAR_GRIMACE     },
  { key: 'activity',    label: 'A — Activity (Tonus otot)',    mnemonic: 'A', items: APGAR_ACTIVITY    },
  { key: 'respiration', label: 'R — Respiration (Napas)',      mnemonic: 'R', items: APGAR_RESPIRATION },
];

type ApgarState = Record<'appearance' | 'pulse' | 'grimace' | 'activity' | 'respiration', number>;

function ApgarGroup({ label, items, value, onChange }: { label: string; items: ApgarItem[]; value: number; onChange: (v: number) => void }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {items.map((item) => (
          <button
            key={item.score}
            onClick={() => onChange(item.score)}
            style={{
              minHeight: 'var(--hit)', borderRadius: 10, border: 'none', cursor: 'pointer',
              padding: '8px 6px', textAlign: 'center',
              font: 'var(--type-caption-1)', fontWeight: value === item.score ? 600 : 400,
              lineHeight: 1.3,
              background: value === item.score
                ? 'color-mix(in srgb, var(--tint-score) 15%, var(--bg-tertiary))'
                : 'var(--fill-tertiary)',
              color: value === item.score ? 'var(--tint-score)' : 'var(--label-secondary)',
              outline: value === item.score ? '1.5px solid var(--tint-score)' : 'none',
              transition: 'all var(--dur-fast)',
            }}
          >
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 2, fontSize: 14 }}>{item.score}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ApgarScore() {
  const [values, setValues] = useState<ApgarState>({
    appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 2,
  });
  const [minute, setMinute] = useState<1 | 5 | 10>(1);

  const result = calcApgar(values.appearance, values.pulse, values.grimace, values.activity, values.respiration);

  function set(key: keyof ApgarState, val: number) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Apgar Score</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Evaluasi kondisi bayi baru lahir <Cite source="apgar1953" /><Cite source="aap_apgar2015" />.
        </p>
      </div>

      {/* Menit ke- toggle */}
      <div style={{ padding: '0 16px' }}>
        <div className="ios-segmented">
          {([1, 5, 10] as const).map(m => (
            <button key={m} aria-selected={minute === m} onClick={() => setMinute(m)}>
              Menit ke-{m}
            </button>
          ))}
        </div>
      </div>

      <div className="ios-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {APGAR_PARAMS.map((p, i) => (
          <div key={p.key}>
            {i > 0 && <div style={{ borderTop: '0.5px solid var(--separator)', marginBottom: 16 }} />}
            <ApgarGroup label={p.label} items={p.items} value={values[p.key]} onChange={v => set(p.key, v)} />
          </div>
        ))}
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
                Apgar Menit ke-{minute}
              </span>
              <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 2 }}>
                A{values.appearance}+P{values.pulse}+G{values.grimace}+A{values.activity}+R{values.respiration}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: result.color, lineHeight: 1 }}>
              {result.total}
            </span>
          </div>
          <p style={{ font: 'var(--type-headline)', color: result.color, fontWeight: 700 }}>{result.label}</p>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
            {result.action}
          </p>
          <p style={{ font: 'var(--type-caption-1)', fontFamily: 'var(--font-mono)', color: 'var(--label-tertiary)', marginTop: 6 }}>
            0–3 asfiksia berat · 4–6 perlu stimulasi · 7–10 normal
          </p>
          {minute === 1 && result.total < 7 && (
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 6 }}>
              Nilai ulang pada menit ke-5. Apgar menit ke-5 lebih prediktif terhadap outcome neurologis <Cite source="aap_apgar2015" />.
            </p>
          )}
        </div>
      </div>

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['apgar1953', 'aap_apgar2015'] as const).map((key) => (
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
