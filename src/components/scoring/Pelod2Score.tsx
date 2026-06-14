import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { TheoryAccordion, type TheorySection } from '../TheoryAccordion';
import { Cite } from '../Citation';
import { calculatePelod2, type Pelod2Input } from '../../utils/pelod2';
import { REFERENCES } from '../../data/references';

const DEFAULT: Pelod2Input = {
  gcs: 15,
  pupils: 'both_react',
  lactateMmolL: 1,
  mapMmHg: 65,
  ageMonths: 24,
  creatinineMgDl: 0.4,
  pf: 400,
  onVentilator: false,
  paCO2MmHg: 40,
  wbcE3PerMcL: 8,
  plateletsE3PerMcL: 200,
  bilirubinMgDl: 1.0,
};

export function Pelod2Score() {
  const [v, setV] = useState<Pelod2Input>(DEFAULT);
  const [error, setError] = useState<string | null>(null);

  let result: ReturnType<typeof calculatePelod2> | null = null;
  try {
    result = calculatePelod2(v);
    if (error) setError(null);
  } catch (e) {
    if (!error) setError(e instanceof Error ? e.message : 'Input tidak valid');
  }

  function update(key: keyof Pelod2Input, val: string | boolean) {
    setError(null);
    setV((prev) => ({
      ...prev,
      [key]: typeof val === 'boolean' ? val : Number(val) || 0,
    }));
  }

  function updatePupils(val: Pelod2Input['pupils']) {
    setError(null);
    setV((prev) => ({ ...prev, pupils: val }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">PELOD-2</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Pediatric Logistic Organ Dysfunction Score <Cite source="leteurtre2013" />.
        </p>
      </div>

      <div className="ios-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Sec>Demografis</Sec>
        <NF label="Usia" unit="bulan" value={v.ageMonths} onChange={(x) => update('ageMonths', x)} />

        <Sec>Neurologi</Sec>
        <NF label="GCS Total" unit="" value={v.gcs} onChange={(x) => update('gcs', x)} min={3} max={15} />
        <div>
          <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)', display: 'block', marginBottom: 8 }}>
            Reaktivitas Pupil
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {([
              ['both_react', 'Keduanya reaktif'],
              ['one_fixed',  'Satu fixed'],
              ['both_fixed', 'Keduanya fixed'],
            ] as [Pelod2Input['pupils'], string][]).map(([val, label]) => (
              <button key={val} onClick={() => updatePupils(val)} style={optStyle(v.pupils === val)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <Sec>Kardiovaskular</Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="Laktat" unit="mmol/L" value={v.lactateMmolL} onChange={(x) => update('lactateMmolL', x)} step="0.1" />
          <NF label="MAP" unit="mmHg" value={v.mapMmHg} onChange={(x) => update('mapMmHg', x)} />
        </div>

        <Sec>Renal</Sec>
        <NF label="Kreatinin" unit="mg/dL" value={v.creatinineMgDl} onChange={(x) => update('creatinineMgDl', x)} step="0.1" />

        <Sec>Respirasi</Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="P/F ratio" unit="" value={v.pf} onChange={(x) => update('pf', x)} />
          <NF label="PaCO₂" unit="mmHg" value={v.paCO2MmHg} onChange={(x) => update('paCO2MmHg', x)} />
        </div>
        <button onClick={() => update('onVentilator', !v.onVentilator)} style={optStyle(v.onVentilator)}>
          {v.onVentilator ? '✓ Menggunakan ventilator' : 'Ventilator?'}
        </button>

        <Sec>Hematologi</Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="WBC" unit="×10³/µL" value={v.wbcE3PerMcL} onChange={(x) => update('wbcE3PerMcL', x)} step="0.1" />
          <NF label="Trombosit" unit="×10³/µL" value={v.plateletsE3PerMcL} onChange={(x) => update('plateletsE3PerMcL', x)} />
        </div>

        <Sec>Hepatik</Sec>
        <NF label="Bilirubin" unit="mg/dL" value={v.bilirubinMgDl} onChange={(x) => update('bilirubinMgDl', x)} step="0.1" />
        {v.ageMonths < 1 && (
          <div className="ios-warn">
            <AlertTriangle size={14} />
            <span>Hepatik tidak dinilai pada neonatus (&lt;1 bulan).</span>
          </div>
        )}
      </div>

      {error && (
        <div className="ios-warn ios-warn--danger">
          <AlertTriangle size={15} /><span>{error}</span>
        </div>
      )}

      {result && (
        <>
          <div className="ios-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--separator)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--tint-score)', lineHeight: 1 }}>
                  {result.total}
                </span>
              </div>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>
                Estimasi mortalitas:{' '}
                <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>{result.estimatedMortalityPercent}%</span>
                <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>
                  (model logistik, Leteurtre 2013)
                </span>
              </p>
            </div>
          </div>

          <div className="ios-list">
            {result.organScores.map((o, i) => (
              <div key={o.organ} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px',
                borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
                background: 'var(--bg-tertiary)',
              }}>
                <div>
                  <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{o.organ}</span>
                  <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 1 }}>{o.detail}</p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
                  color: o.score > 0 ? 'var(--sys-red)' : 'var(--sys-green)',
                }}>{o.score}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <TheoryAccordion sections={PELOD2_THEORY} />
      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES.leteurtre2013.id}]</span>{' '}
          {REFERENCES.leteurtre2013.citation}
        </p>
      </div>
    </div>
  );
}

const PELOD2_THEORY: TheorySection[] = [
  {
    title: 'PELOD-2 — Konsep & Tujuan',
    content: `PELOD-2 (Pediatric Logistic Organ Dysfunction-2) adalah skor disfungsi organ multi-sistem untuk memprediksi mortalitas di PICU.

Dikembangkan oleh Leteurtre et al. (2013) dari 7 negara, 35 PICU.

• Menilai 6 sistem organ: neurologis, kardiovaskular, renal, hepatik, hematologi, respirasi
• Skor 0–33 (tiap variabel: 0, 1, 3, atau 5 poin)
• Digunakan untuk: triase, komunikasi dengan keluarga, penelitian klinis, evaluasi beratnya penyakit

PELOD-2 bukan alat keputusan individual — mortalitas adalah probabilitas populasi, bukan kepastian.`,
  },
  {
    title: 'Interpretasi Skor & Mortalitas',
    content: `Hubungan skor dengan mortalitas PICU (estimasi dari studi Leteurtre 2013):

• Skor 0: mortalitas ~ 0.1%
• Skor 5: mortalitas ~ 1%
• Skor 10: mortalitas ~ 4%
• Skor 15: mortalitas ~ 10–15%
• Skor 20: mortalitas ~ 25–30%
• Skor ≥ 25: mortalitas > 50%

Skor dihitung dari nilai terburuk dalam 24 jam pertama masuk PICU (atau kapan pun selama rawatan untuk tren klinis).`,
  },
  {
    title: 'Variabel & Batasan Klinis',
    content: `GCS: nilai minimum aktual (bukan setelah sedasi bila tidak diperlukan klinis)
Pupil: kedua reaktif = 0; satu atau keduanya tidak reaktif = 5

MAP sesuai usia:
• < 1 bulan: normal ≥ 46; < 31 = skor 3; + dopamin/epinefrin = skor 5
• 1–11 bulan: normal ≥ 55; < 39 = skor 3
• 1–11 tahun: normal ≥ 62; < 44 = skor 3
• ≥ 12 tahun: normal ≥ 67; < 52 = skor 3

Kreatinin normal berbeda per usia — kalkulator ini sudah menyesuaikan threshold per usia.`,
  },
];

function Sec({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', paddingTop: 4 }}>
      {children}
    </p>
  );
}

function optStyle(active: boolean): React.CSSProperties {
  return {
    minHeight: 'var(--hit)', borderRadius: 10, border: 'none', cursor: 'pointer',
    padding: '8px 12px', font: 'var(--type-subheadline)', fontWeight: active ? 600 : 400,
    background: active ? 'color-mix(in srgb, var(--tint-score) 15%, var(--bg-tertiary))' : 'var(--fill-tertiary)',
    color: active ? 'var(--tint-score)' : 'var(--label-secondary)',
    outline: active ? '1.5px solid var(--tint-score)' : 'none',
    transition: 'all var(--dur-fast)',
    textAlign: 'center' as const,
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
