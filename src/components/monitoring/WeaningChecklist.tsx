import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { WEANING_CRITERIA, type WeaningCriterion } from '../../utils/vitalSigns';
import { REFERENCES } from '../../data/references';

const CATEGORY_LABELS: Record<WeaningCriterion['category'], string> = {
  klinis:     'Klinis',
  oksigenasi: 'Oksigenasi',
  ventilasi:  'Ventilasi',
  neurologi:  'Neurologi',
};

const CATEGORY_ORDER: WeaningCriterion['category'][] = ['klinis', 'oksigenasi', 'ventilasi', 'neurologi'];

export function WeaningChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WEANING_CRITERIA.map(c => [c.id, false]))
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const total   = WEANING_CRITERIA.length;
  const ticked  = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((ticked / total) * 100);
  const ready   = ticked === total;

  const grouped = CATEGORY_ORDER.reduce<Record<WeaningCriterion['category'], WeaningCriterion[]>>(
    (acc, cat) => {
      acc[cat] = WEANING_CRITERIA.filter(c => c.category === cat);
      return acc;
    },
    {} as Record<WeaningCriterion['category'], WeaningCriterion[]>,
  );

  const progressColor = ready ? 'var(--sys-green)' : 'var(--accent)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Weaning Checklist</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Kriteria weaning ventilator mekanik <Cite source="pals2020" />.
        </p>
      </div>
      {/* Progress card */}
      <div className="ios-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ font: 'var(--type-headline)', color: progressColor }}>
            {ticked}/{total} kriteria terpenuhi
          </span>
          <span style={{
            font: 'var(--type-caption-2)', fontWeight: 700,
            color: ready ? 'var(--sys-green)' : 'var(--accent)',
            background: ready
              ? 'color-mix(in srgb, var(--sys-green) 12%, transparent)'
              : 'var(--accent-tint)',
            padding: '3px 10px', borderRadius: 'var(--r-pill)',
          }}>
            {ready ? 'Siap weaning' : `${percent}%`}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 'var(--r-pill)', background: 'var(--fill-secondary)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 'var(--r-pill)',
            background: progressColor,
            width: `${percent}%`,
            transition: 'width 300ms var(--ease-out)',
          }} />
        </div>
        {ready && (
          <p style={{ font: 'var(--type-footnote)', color: 'var(--sys-green)', marginTop: 8, fontWeight: 500 }}>
            Semua kriteria terpenuhi — pertimbangkan SBT (Spontaneous Breathing Trial).
          </p>
        )}
      </div>

      {/* Checklist per category */}
      {CATEGORY_ORDER.map(cat => (
        <section key={cat}>
          <div className="ios-section" style={{ paddingTop: 6 }}>
            <span className="label">{CATEGORY_LABELS[cat]}</span>
          </div>
          <div className="ios-list">
            {grouped[cat].map((criterion, i) => (
              <div key={criterion.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', minHeight: 'var(--hit)',
                  borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
                  background: checked[criterion.id] ? 'color-mix(in srgb, var(--sys-green) 6%, var(--bg-tertiary))' : 'var(--bg-tertiary)',
                  transition: 'background var(--dur-fast)',
                }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => toggle(criterion.id)}
                    style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      border: checked[criterion.id] ? 'none' : '2px solid var(--separator)',
                      background: checked[criterion.id] ? 'var(--sys-green)' : 'transparent',
                      display: 'grid', placeItems: 'center', cursor: 'pointer',
                      color: '#fff', font: 'var(--type-caption-1)', fontWeight: 700,
                      transition: 'all var(--dur-fast)',
                    }}
                  >
                    {checked[criterion.id] && '✓'}
                  </button>

                  {/* Text */}
                  <button
                    onClick={() => setExpanded(expanded === criterion.id ? null : criterion.id)}
                    style={{
                      flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      font: 'var(--type-body)', letterSpacing: '-0.022em',
                      color: checked[criterion.id] ? 'var(--label-tertiary)' : 'var(--label-primary)',
                      textDecoration: checked[criterion.id] ? 'line-through' : 'none',
                    }}>
                      {criterion.text}
                    </span>
                  </button>

                  <ChevronRight
                    size={16}
                    className="ios-chevron"
                    style={{
                      transform: expanded === criterion.id ? 'rotate(90deg)' : 'none',
                      transition: 'transform var(--dur-fast)',
                    }}
                    onClick={() => setExpanded(expanded === criterion.id ? null : criterion.id)}
                  />
                </div>

                {expanded === criterion.id && (
                  <div style={{
                    padding: '10px 14px 12px 52px',
                    borderTop: '0.5px solid var(--separator)',
                    background: 'var(--fill-tertiary)',
                    font: 'var(--type-footnote)', color: 'var(--label-secondary)',
                  }}>
                    {criterion.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* SBT protocol */}
      <div>
        <div className="ios-section" style={{ paddingTop: 6 }}>
          <span className="label">Protokol SBT</span>
        </div>
        <div className="ios-list">
          {[
            'Set mode CPAP 5 cmH₂O atau T-piece.',
            'Observasi 30–120 menit.',
            'Gagal bila: RR > 35×/mnt, SpO₂ < 90%, HR ↑/↓ > 20%, retraksi berat, atau agitasi.',
            'Ekstubasi bila SBT berhasil dan proteksi jalan napas adekuat.',
          ].map((step, i) => (
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
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['pals2020'] as const).map((key) => (
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
