import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { calcRSBI } from '../../utils/rsbi';
import { WEANING_CRITERIA, type WeaningCriterion } from '../../utils/vitalSigns';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { REFERENCES } from '../../data/references';

// ── RSBI Calculator ───────────────────────────────────────────────────────────
function RSBICalc({ defaultWeight }: { defaultWeight: string }) {
  const [rr,     setRr]     = useState('');
  const [tv,     setTv]     = useState('');
  const [weight, setWeight] = useState(defaultWeight);

  const rrNum = parseFloat(rr)     || 0;
  const tvNum = parseFloat(tv)     || 0;
  const wNum  = parseFloat(weight) || 0;

  const canCalc = rrNum > 0 && tvNum > 0 && wNum > 0;
  const result  = canCalc ? calcRSBI(rrNum, tvNum, wNum) : null;

  return (
    <div className="ios-card" style={{ padding: '14px 16px' }}>
      <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginBottom: 12 }}>
        Ukur saat napas spontan minimal 1 menit (T-piece atau CPAP minimal). <Cite source="yang1991" />
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[
          { label: 'RR (×/mnt)', val: rr, set: setRr, placeholder: '30', min: 1, max: 120 },
          { label: 'TV (mL)',    val: tv, set: setTv, placeholder: '80', min: 1, max: 1000 },
          { label: 'BB (kg)',    val: weight, set: setWeight, placeholder: '10', min: 0.5, max: 150 },
        ].map(f => (
          <div key={f.label}>
            <label style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', display: 'block', marginBottom: 4 }}>
              {f.label}
            </label>
            <input
              type="number"
              value={f.val}
              onChange={e => f.set(e.target.value)}
              placeholder={f.placeholder}
              min={f.min}
              max={f.max}
              style={{
                width: '100%', padding: '7px 8px', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--separator)', background: 'var(--fill-secondary)',
                color: 'var(--label-primary)', font: 'var(--type-body)',
              }}
            />
          </div>
        ))}
      </div>

      {result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* RSBI */}
          <div style={{
            padding: '12px 14px', borderRadius: 'var(--r-sm)',
            background: `color-mix(in srgb, ${result.interpretation.color} 10%, var(--bg-tertiary))`,
            border: `1px solid color-mix(in srgb, ${result.interpretation.color} 30%, transparent)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
                RSBI <Cite source="yang1991" />
              </span>
              <span style={{ fontSize: 28, fontWeight: 800, color: result.interpretation.color, lineHeight: 1 }}>
                {result.rsbi}
              </span>
            </div>
            <p style={{ font: 'var(--type-footnote)', fontWeight: 600, color: result.interpretation.color, margin: 0 }}>
              {result.interpretation.label}
            </p>
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 3 }}>
              {result.interpretation.detail}
            </p>
          </div>

          {/* pRSBI */}
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--r-sm)',
            background: 'var(--fill-secondary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
                  pRSBI (pediatrik) = f / TV(mL/kg)
                </span>
                <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 2 }}>
                  Cut-off &lt; 8 napas/mnt/(mL/kg) untuk keberhasilan weaning
                </p>
              </div>
              <span style={{
                fontSize: 24, fontWeight: 800, lineHeight: 1,
                color: result.prsbi < 8 ? 'var(--sys-green)' : result.prsbi <= 11 ? 'var(--sys-yellow)' : 'var(--sys-red)',
              }}>
                {result.prsbi}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--label-tertiary)', font: 'var(--type-footnote)' }}>
          Isi ketiga input untuk menghitung RSBI
        </div>
      )}
    </div>
  );
}

// ── Weaning criteria checklist ────────────────────────────────────────────────
const CATEGORY_LABELS: Record<WeaningCriterion['category'], string> = {
  klinis:     'Klinis',
  oksigenasi: 'Oksigenasi',
  ventilasi:  'Ventilasi',
  neurologi:  'Neurologi',
};
const CATEGORY_ORDER: WeaningCriterion['category'][] = ['klinis', 'oksigenasi', 'ventilasi', 'neurologi'];

function WeaningCriteriaChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WEANING_CRITERIA.map(c => [c.id, false]))
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const ticked  = Object.values(checked).filter(Boolean).length;
  const total   = WEANING_CRITERIA.length;
  const percent = Math.round((ticked / total) * 100);
  const ready   = ticked === total;
  const color   = ready ? 'var(--sys-green)' : 'var(--accent)';

  const grouped = CATEGORY_ORDER.reduce<Record<WeaningCriterion['category'], WeaningCriterion[]>>(
    (acc, cat) => { acc[cat] = WEANING_CRITERIA.filter(c => c.category === cat); return acc; },
    {} as Record<WeaningCriterion['category'], WeaningCriterion[]>,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Progress */}
      <div className="ios-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ font: 'var(--type-headline)', color }}>
            {ticked}/{total} kriteria terpenuhi
          </span>
          <span style={{
            font: 'var(--type-caption-2)', fontWeight: 700,
            color, padding: '3px 10px', borderRadius: 'var(--r-pill)',
            background: ready
              ? 'color-mix(in srgb, var(--sys-green) 12%, transparent)'
              : 'var(--accent-tint)',
          }}>
            {ready ? 'Siap weaning' : `${percent}%`}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 'var(--r-pill)', background: 'var(--fill-secondary)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 'var(--r-pill)', background: color, width: `${percent}%`, transition: 'width 300ms' }} />
        </div>
        {ready && (
          <p style={{ font: 'var(--type-footnote)', color: 'var(--sys-green)', marginTop: 8, fontWeight: 500 }}>
            Semua kriteria terpenuhi — lanjutkan ke SBT dan pertimbangkan ekstubasi.
          </p>
        )}
      </div>

      {CATEGORY_ORDER.map(cat => (
        <section key={cat}>
          <div className="ios-section" style={{ paddingTop: 4 }}>
            <span className="label">{CATEGORY_LABELS[cat]}</span>
          </div>
          <div className="ios-list">
            {grouped[cat].map((c, i) => (
              <div key={c.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', minHeight: 'var(--hit)',
                  borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
                  background: checked[c.id]
                    ? 'color-mix(in srgb, var(--sys-green) 6%, var(--bg-tertiary))'
                    : 'var(--bg-tertiary)',
                  transition: 'background var(--dur-fast)',
                }}>
                  <button
                    onClick={() => setChecked(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                    style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      border: checked[c.id] ? 'none' : '2px solid var(--separator)',
                      background: checked[c.id] ? 'var(--sys-green)' : 'transparent',
                      display: 'grid', placeItems: 'center', cursor: 'pointer',
                      color: '#fff', font: 'var(--type-caption-1)', fontWeight: 700,
                      transition: 'all var(--dur-fast)',
                    }}
                  >
                    {checked[c.id] && '✓'}
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{
                      font: 'var(--type-body)',
                      color: checked[c.id] ? 'var(--label-tertiary)' : 'var(--label-primary)',
                      textDecoration: checked[c.id] ? 'line-through' : 'none',
                    }}>
                      {c.text}
                    </span>
                  </button>
                  <ChevronRight
                    size={16} className="ios-chevron"
                    style={{ transform: expanded === c.id ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast)' }}
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  />
                </div>
                {expanded === c.id && (
                  <div style={{
                    padding: '8px 14px 10px 52px',
                    borderTop: '0.5px solid var(--separator)',
                    background: 'var(--fill-tertiary)',
                    font: 'var(--type-footnote)', color: 'var(--label-secondary)',
                  }}>
                    {c.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ── Ekstubasi steps ───────────────────────────────────────────────────────────
const EKSTUBASI_STEPS = [
  'Pastikan semua kriteria weaning terpenuhi dan RSBI dalam batas aman.',
  'Siapkan alat: BVM + masker, O₂ mask/nasal kanul, suction siap nyala.',
  'Pre-oksigenasi: berikan O₂ 100% (FiO₂ 1.0) selama 3–5 menit.',
  'Suction orofaring dan nasofaring secara menyeluruh.',
  'Deflate cuff perlahan (jika ETT cuffed) menggunakan syringe.',
  'Tarik ETT dengan gerakan tegas saat puncak inspirasi.',
  'Pasang O₂ mask segera; pantau SpO₂ dan RR secara kontinu.',
  'Observasi ketat 1–4 jam: croup/stridor → nebulisasi epinefrin 0.5 mg/kg (maks 5 mg) + deksametason 0.5 mg/kg IV.',
];

// ── Main component ─────────────────────────────────────────────────────────────
export function WeaningEkstubasi() {
  const { weightKg } = usePatientStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── RSBI ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">RSBI & pRSBI <Cite source="yang1991" /></span>
        </div>
        <RSBICalc defaultWeight={weightKg} />
      </div>

      {/* ── Weaning criteria ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Kriteria Weaning <Cite source="pals2020" /></span>
        </div>
        <WeaningCriteriaChecklist />
      </div>

      {/* ── Ekstubasi steps ── */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Langkah Ekstubasi <Cite source="newth2009" /></span>
        </div>
        <div className="ios-list">
          {EKSTUBASI_STEPS.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)',
              borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
              background: 'var(--bg-tertiary)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                color: 'var(--accent)', flexShrink: 0, marginTop: 2, minWidth: 18,
              }}>
                {i + 1}.
              </span>
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px', marginBottom: 8 }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['yang1991', 'pals2020', 'newth2009'] as const).map((key) => (
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
