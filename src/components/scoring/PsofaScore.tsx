import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { calculatePsofa, type PsofaInput } from '../../utils/psofa';
import { REFERENCES } from '../../data/references';

const DEFAULT: PsofaInput = {
  pf: 450, onVentilator: false,
  plateletsE3PerMcL: 200,
  bilirubinMgDl: 0.8,
  dopamineDose: 0, epinephrineDose: 0, norepinephrineDose: 0, dobutamineDose: 0,
  gcs: 15,
  creatinineMgDl: 0.4, ageMonths: 24,
};

const SEVERITY_TINT = {
  'ringan':       'var(--sys-green)',
  'sedang':       'var(--sys-orange)',
  'berat':        'var(--sys-red)',
  'sangat berat': 'var(--sys-red)',
};

export function PsofaScore() {
  const [v, setV] = useState<PsofaInput>(DEFAULT);

  function num(key: keyof PsofaInput, val: string) {
    setV((p) => ({ ...p, [key]: Number(val) || 0 }));
  }
  function bool(key: keyof PsofaInput, val: boolean) {
    setV((p) => ({ ...p, [key]: val }));
  }

  let result: ReturnType<typeof calculatePsofa> | null = null;
  let error: string | null = null;
  try {
    result = calculatePsofa(v);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Input tidak valid';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">pSOFA</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Pediatric Sequential Organ Failure Assessment <Cite source="matics2017" />.
        </p>
      </div>

      <div className="ios-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Sec>Demografis</Sec>
        <NF label="Usia" unit="bulan" value={v.ageMonths} onChange={(x) => num('ageMonths', x)} />

        <Sec>Respirasi</Sec>
        <NF label="P/F ratio" unit="" value={v.pf} onChange={(x) => num('pf', x)} />
        <Toggle active={v.onVentilator} onToggle={(b) => bool('onVentilator', b)}
          labelOn="✓ Menggunakan ventilator" labelOff="Ventilator?" />

        <Sec>Koagulasi & Hepatik</Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="Trombosit" unit="×10³/µL" value={v.plateletsE3PerMcL} onChange={(x) => num('plateletsE3PerMcL', x)} />
          <NF label="Bilirubin" unit="mg/dL" value={v.bilirubinMgDl} onChange={(x) => num('bilirubinMgDl', x)} step="0.1" />
        </div>

        <Sec>Kardiovaskular — vasopresor (mcg/kg/mnt, isi 0 bila tidak dipakai)</Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <NF label="Dopamin"      unit="" value={v.dopamineDose}       onChange={(x) => num('dopamineDose', x)}       step="0.1" />
          <NF label="Dobutamin"    unit="" value={v.dobutamineDose}     onChange={(x) => num('dobutamineDose', x)}     step="0.1" />
          <NF label="Epinefrin"    unit="" value={v.epinephrineDose}    onChange={(x) => num('epinephrineDose', x)}    step="0.01" />
          <NF label="Norepinefrin" unit="" value={v.norepinephrineDose} onChange={(x) => num('norepinephrineDose', x)} step="0.01" />
        </div>

        <Sec>Neurologi</Sec>
        <NF label="GCS Total" unit="" value={v.gcs} onChange={(x) => num('gcs', x)} min={3} max={15} />

        <Sec>Renal</Sec>
        <NF label="Kreatinin" unit="mg/dL" value={v.creatinineMgDl} onChange={(x) => num('creatinineMgDl', x)} step="0.1" />
      </div>

      {error && (
        <div className="ios-warn ios-warn--danger">
          <AlertTriangle size={15} /><span>{error}</span>
        </div>
      )}

      {result && (
        <>
          <div className="ios-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '14px 16px',
              background: `color-mix(in srgb, ${SEVERITY_TINT[result.severityLabel]} 10%, var(--bg-tertiary))`,
              borderBottom: '0.5px solid var(--separator)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: SEVERITY_TINT[result.severityLabel], lineHeight: 1 }}>
                  {result.total}
                </span>
              </div>
              <p style={{ font: 'var(--type-headline)', color: SEVERITY_TINT[result.severityLabel], fontWeight: 700, marginTop: 4, textTransform: 'capitalize' }}>
                {result.severityLabel}
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

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES.matics2017.id}]</span>{' '}
          {REFERENCES.matics2017.citation}
        </p>
      </div>
    </div>
  );
}

function Sec({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', paddingTop: 4 }}>
      {children}
    </p>
  );
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

function Toggle({ active, onToggle, labelOn, labelOff }: {
  active: boolean; onToggle: (b: boolean) => void; labelOn: string; labelOff: string;
}) {
  return (
    <button onClick={() => onToggle(!active)} style={{
      minHeight: 'var(--hit)', borderRadius: 10, border: 'none', cursor: 'pointer',
      padding: '8px 14px', font: 'var(--type-subheadline)', fontWeight: active ? 600 : 400,
      background: active ? 'color-mix(in srgb, var(--tint-score) 15%, var(--bg-tertiary))' : 'var(--fill-tertiary)',
      color: active ? 'var(--tint-score)' : 'var(--label-secondary)',
      outline: active ? '1.5px solid var(--tint-score)' : 'none',
      transition: 'all var(--dur-fast)',
    }}>
      {active ? labelOn : labelOff}
    </button>
  );
}
