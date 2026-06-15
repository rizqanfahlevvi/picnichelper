import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { REFERENCES } from '../../data/references';

type Kondisi =
  | 'normal'
  | 'rds'
  | 'asma'
  | 'hie'
  | 'neonate_prematur'
  | 'neonate_aterm';

interface Setting {
  tvMin: number;
  tvMax: number;
  rrMin: number;
  rrMax: number;
  peepMin: number;
  peepMax: number;
  fio2Label: string;
  ie: string;
  mode: string;
  notes: string;
}

const KONDISI_OPTIONS: { id: Kondisi; label: string; desc: string }[] = [
  { id: 'normal',          label: 'Normal / Post-op',       desc: 'Induksi elektif, paru sehat' },
  { id: 'rds',             label: 'RDS / ARDS',             desc: 'Sindrom distres napas akut (PALICC-2)' },
  { id: 'asma',            label: 'Asma / Bronkospasme',    desc: 'Obstruksi jalan napas bawah' },
  { id: 'hie',             label: 'HIE',                    desc: 'Hypoxic Ischemic Encephalopathy' },
  { id: 'neonate_prematur',label: 'Neonatus Prematur',      desc: 'Usia gestasi < 37 minggu' },
  { id: 'neonate_aterm',   label: 'Neonatus Aterm',         desc: 'Usia gestasi ≥ 37 minggu' },
];

const SETTINGS: Record<Kondisi, Setting> = {
  normal:           { tvMin: 6,  tvMax: 8,  rrMin: 15, rrMax: 25, peepMin: 4, peepMax: 5,  fio2Label: '0.4–0.5',  ie: '1:2',     mode: 'VCV atau PCV',        notes: 'Titrasi FiO₂ untuk SpO₂ ≥ 95%' },
  rds:              { tvMin: 4,  tvMax: 6,  rrMin: 25, rrMax: 40, peepMin: 6, peepMax: 10, fio2Label: '0.6–1.0',  ie: '1:1.5–2', mode: 'PCV atau HFO',        notes: 'Lung protective: TV rendah, PEEP tinggi. Titrate FiO₂ untuk SpO₂ 91–95% [47]' },
  asma:             { tvMin: 6,  tvMax: 8,  rrMin: 10, rrMax: 16, peepMin: 3, peepMax: 5,  fio2Label: '0.4–0.6',  ie: '1:3–4',   mode: 'VCV',                 notes: 'I:E panjang untuk ekspirasi penuh, hindari air-trapping. RR rendah.' },
  hie:              { tvMin: 5,  tvMax: 7,  rrMin: 30, rrMax: 50, peepMin: 4, peepMax: 5,  fio2Label: '0.21–0.4', ie: '1:2',     mode: 'VCV atau PCV',        notes: 'Normokarbik (PaCO₂ 35–45). Hindari hiperventilasi. FiO₂ serendah mungkin.' },
  neonate_prematur: { tvMin: 4,  tvMax: 5,  rrMin: 40, rrMax: 60, peepMin: 4, peepMax: 6,  fio2Label: '0.21–titrate', ie: '1:1.5–2', mode: 'PCV atau HFO', notes: 'Target SpO₂ 91–95%. Gunakan surfaktan sesuai indikasi [48].' },
  neonate_aterm:    { tvMin: 4,  tvMax: 6,  rrMin: 30, rrMax: 50, peepMin: 4, peepMax: 5,  fio2Label: '0.21–0.4', ie: '1:1.5–2', mode: 'PCV',                 notes: 'Normokarbik. FiO₂ terendah efektif.' },
};

function calcTi(rr: number, ie: string): string {
  // Parse I:E string, return Ti in seconds
  // ie is like "1:2" or "1:1.5–2" → use first numeric ratio
  const match = ie.match(/1:([\d.]+)/);
  if (!match) return '—';
  const ratio = parseFloat(match[1]);
  const cycleDur = 60 / rr;
  const ti = cycleDur / (1 + ratio);
  return ti.toFixed(2) + ' s';
}

export function SettingVentilator() {
  const { weightKg } = usePatientStore();
  const [kondisi, setKondisi]   = useState<Kondisi>('normal');
  const [localWeight, setLocalWeight] = useState(weightKg);

  const weight = parseFloat(localWeight) || 0;
  const s = SETTINGS[kondisi];

  const tvMinMl = (s.tvMin * weight).toFixed(0);
  const tvMaxMl = (s.tvMax * weight).toFixed(0);
  const highFiO2 = kondisi === 'rds' || kondisi === 'neonate_prematur';

  // RR label
  const rrLabel = `${s.rrMin}–${s.rrMax} ×/mnt`;

  // Ti calc using midpoint RR
  const midRR = Math.round((s.rrMin + s.rrMax) / 2);
  const tiLabel = calcTi(midRR, s.ie);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Weight input */}
      <div className="ios-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flexShrink: 0 }}>
            Berat (kg)
          </label>
          <input
            type="number"
            value={localWeight}
            onChange={e => setLocalWeight(e.target.value)}
            placeholder="kg"
            min={0.5}
            max={150}
            style={{
              flex: 1, padding: '6px 10px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--separator)', background: 'var(--fill-secondary)',
              color: 'var(--label-primary)', font: 'var(--type-body)', maxWidth: 100,
            }}
          />
          {weightKg && weightKg !== localWeight && (
            <button
              onClick={() => setLocalWeight(weightKg)}
              style={{ font: 'var(--type-caption-1)', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Reset ke {weightKg} kg
            </button>
          )}
        </div>
      </div>

      {/* Kondisi selector */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Kondisi Klinis</span>
        </div>
        <div className="ios-list">
          {KONDISI_OPTIONS.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => setKondisi(opt.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', minHeight: 'var(--hit)',
                borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
                background: kondisi === opt.id
                  ? 'color-mix(in srgb, var(--accent) 8%, var(--bg-tertiary))'
                  : 'var(--bg-tertiary)',
                width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background var(--dur-fast)',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                border: kondisi === opt.id ? 'none' : '2px solid var(--separator)',
                background: kondisi === opt.id ? 'var(--accent)' : 'transparent',
                display: 'grid', placeItems: 'center',
              }}>
                {kondisi === opt.id && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--type-subheadline)', fontWeight: kondisi === opt.id ? 600 : 400, color: 'var(--label-primary)' }}>
                  {opt.label}
                </div>
                <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="ios-section" style={{ paddingTop: 8 }}>
          <span className="label">Rekomendasi Setting Awal <Cite source="palicc2015" /></span>
        </div>
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Kondisi: {KONDISI_OPTIONS.find(o => o.id === kondisi)?.label}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              {
                label: 'Tidal Volume',
                val: weight > 0 ? `${tvMinMl}–${tvMaxMl} mL` : `${s.tvMin}–${s.tvMax} mL/kg`,
                sub: weight > 0 ? `${s.tvMin}–${s.tvMax} mL/kg` : 'isi berat',
                ref: 'palicc2015' as const,
              },
              { label: 'Frekuensi Napas', val: rrLabel,       sub: 'napas/menit',  ref: 'pals2020' as const },
              { label: 'PEEP',            val: `${s.peepMin}–${s.peepMax} cmH₂O`, sub: '',  ref: 'palicc2015' as const },
              { label: 'FiO₂',           val: s.fio2Label,    sub: 'titrasi',      ref: 'pals2020' as const },
              { label: 'I:E',            val: s.ie,            sub: 'rasio',        ref: 'newth2009' as const },
              { label: 'Ti (estimasi)',  val: tiLabel,         sub: `RR ${midRR}×/mnt`, ref: 'newth2009' as const },
              { label: 'Mode',           val: s.mode,          sub: '',             ref: 'palicc2015' as const },
            ].map((item) => (
              <div key={item.label} style={{
                background: 'var(--fill-secondary)',
                borderRadius: 'var(--r-sm)',
                padding: '10px 12px',
              }}>
                <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', marginBottom: 3 }}>
                  {item.label} <Cite source={item.ref} />
                </div>
                <div style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.2 }}>
                  {item.val}
                </div>
                {item.sub && (
                  <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginTop: 1 }}>{item.sub}</div>
                )}
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{
            marginTop: 12, padding: '8px 10px',
            background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            borderRadius: 'var(--r-sm)',
          }}>
            <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', margin: 0 }}>
              {s.notes}
            </p>
          </div>

          {/* FiO2 warning */}
          {highFiO2 && (
            <div style={{
              marginTop: 8, padding: '8px 10px',
              background: 'color-mix(in srgb, var(--sys-yellow) 12%, transparent)',
              borderRadius: 'var(--r-sm)',
              display: 'flex', gap: 6, alignItems: 'flex-start',
            }}>
              <AlertTriangle size={14} style={{ color: 'var(--sys-yellow)', flexShrink: 0, marginTop: 1 }} />
              <p style={{ font: 'var(--type-footnote)', color: 'var(--sys-yellow)', margin: 0 }}>
                FiO₂ tinggi — pertimbangkan lung recruitment maneuver dan titrasi ke SpO₂ target terendah yang aman.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Catatan klinis */}
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 6 }}>
          Penyesuaian Klinis
        </p>
        {[
          'Setting ini merupakan titik awal — selalu sesuaikan berdasarkan respons klinis, AGD, dan monitoring.',
          'PaO₂ target: 60–80 mmHg; SpO₂ target: 91–95% (RDS/prematur) atau ≥ 95% (kondisi lain).',
          'PaCO₂ target: 35–45 mmHg (normokarbik); untuk HIE hindari hiperventilasi.',
          'Titrasi PEEP menggunakan lung compliance curve (FiO₂/PEEP table ARDS Network).',
        ].map((note, i) => (
          <p key={i} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', margin: i === 0 ? 0 : '4px 0 0', lineHeight: 1.5 }}>
            • {note}
          </p>
        ))}
      </div>

      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px', marginBottom: 8 }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['pals2020', 'palicc2015', 'newth2009'] as const).map((key) => (
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
