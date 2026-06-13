import { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import {
  interpretAbg,
  type AbgResult, type PrimaryDisorder,
  DELTA_RATIO_LABELS, PF_RATIO_LABELS,
} from '../../utils/abg';
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

const PF_TINT: Record<string, string> = {
  normal:        'var(--sys-green)',
  mild_ards:     'var(--sys-yellow)',
  moderate_ards: 'var(--sys-orange)',
  severe_ards:   'var(--sys-red)',
};

export function AbgInterpreter() {
  const [pH, setPH]       = useState('');
  const [paCO2, setPaCO2] = useState('');
  const [hco3, setHco3]   = useState('');
  const [na, setNa]       = useState('');
  const [cl, setCl]       = useState('');
  const [pao2, setPao2]   = useState('');
  const [fio2, setFio2]   = useState('');

  const [result, setResult] = useState<AbgResult | null>(null);
  const [error, setError]   = useState<string | null>(null);

  function handleInterpret() {
    setError(null); setResult(null);
    try {
      setResult(interpretAbg({
        pH:    Number(pH),
        paCO2: Number(paCO2),
        hco3:  Number(hco3),
        na:    na.trim()   ? Number(na)   : undefined,
        cl:    cl.trim()   ? Number(cl)   : undefined,
        pao2:  pao2.trim() ? Number(pao2) : undefined,
        fio2:  fio2.trim() ? Number(fio2) / 100 : undefined, // input as %
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Input tidak valid');
    }
  }

  function handleReset() {
    setPH(''); setPaCO2(''); setHco3('');
    setNa(''); setCl(''); setPao2(''); setFio2('');
    setResult(null); setError(null);
  }

  const canInterpret = pH.trim() && paCO2.trim() && hco3.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Interpretasi AGD</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Boston Rules <Cite source="boston1980" /> · Anion Gap <Cite source="emmett1977" /> · P/F Ratio <Cite source="ards2012" />
        </p>
      </div>

      {/* ── Input Utama ── */}
      <div className="ios-card">
        <SectionLabel>Gas Darah (wajib)</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '4px 14px 12px', gap: 10 }}>
          <AbgField label="pH"    value={pH}    onChange={setPH}    placeholder="7.40" hint="6.5–7.9" />
          <AbgField label="PaCO₂" unit="mmHg" value={paCO2} onChange={setPaCO2} placeholder="40" hint="1–150" />
          <AbgField label="HCO₃⁻" unit="mEq/L" value={hco3} onChange={setHco3} placeholder="24" hint="1–60" />
        </div>

        {/* ── Elektrolit opsional ── */}
        <div style={{ borderTop: '0.5px solid var(--separator)' }}>
          <SectionLabel>Elektrolit <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 11 }}>(opsional — untuk Anion Gap)</span></SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '4px 14px 12px', gap: 10 }}>
            <AbgField label="Na⁺"  unit="mEq/L" value={na} onChange={setNa} placeholder="140" hint="mis. 135–145" />
            <AbgField label="Cl⁻"  unit="mEq/L" value={cl} onChange={setCl} placeholder="103" hint="mis. 98–108" />
          </div>
        </div>

        {/* ── Oksigenasi opsional ── */}
        <div style={{ borderTop: '0.5px solid var(--separator)' }}>
          <SectionLabel>Oksigenasi <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 11 }}>(opsional — untuk P/F Ratio)</span></SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '4px 14px 12px', gap: 10 }}>
            <AbgField label="PaO₂"  unit="mmHg" value={pao2} onChange={setPao2} placeholder="90" hint="mis. 60–500" />
            <AbgField label="FiO₂"  unit="%" value={fio2} onChange={setFio2} placeholder="21" hint="21–100" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px' }}>
          <button
            onClick={handleInterpret}
            disabled={!canInterpret}
            style={{
              flex: 1, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff',
              font: 'var(--type-body)', fontWeight: 600,
              opacity: canInterpret ? 1 : 0.4,
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

      {error && <div className="ios-warn ios-warn--danger"><span>{error}</span></div>}

      {result && <AbgResultCard result={result} />}

      <NormalRangeCard />
      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['boston1980', 'emmett1977', 'ards2012'] as const).map((key) => (
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '10px 14px 4px', font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>
      {children}
    </div>
  );
}

function AbgField({ label, unit, value, onChange, placeholder, hint }: {
  label: string; unit?: string; value: string;
  onChange: (v: string) => void; placeholder: string; hint: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)' }}>
        {label}{unit && <span style={{ color: 'var(--label-tertiary)', fontWeight: 400 }}> ({unit})</span>}
      </label>
      <input
        type="number" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 38, borderRadius: 'var(--r-sm)',
          border: '0.5px solid var(--separator)', outline: 'none',
          background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
          font: 'var(--type-body)', padding: '0 8px', boxSizing: 'border-box',
        }}
      />
      <span style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>{hint}</span>
    </div>
  );
}

function AbgResultCard({ result }: { result: AbgResult }) {
  const tint = DISORDER_TINT[result.primaryDisorder];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* ── Gangguan Primer ── */}
      <div className="ios-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', background: `color-mix(in srgb, ${tint} 10%, var(--bg-tertiary))`, borderBottom: '0.5px solid var(--separator)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: tint, flexShrink: 0 }} />
            <span style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--label-primary)' }}>
              {DISORDER_LABEL[result.primaryDisorder]}
            </span>
          </div>
          <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', marginTop: 6, lineHeight: 1.4 }}>
            {result.interpretation}
          </p>
        </div>

        {/* Kompensasi */}
        {result.expectedCompensation && (
          <div style={{ padding: '12px 16px' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 6 }}>
              {result.expectedCompensation.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: tint }}>
                {result.expectedCompensation.low.toFixed(1)}–{result.expectedCompensation.high.toFixed(1)}
              </span>
            </div>
            <CompStatus status={result.compensationStatus} tint={tint} />
          </div>
        )}
      </div>

      {/* ── Anion Gap ── */}
      {result.anionGap != null && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: result.deltaRatio != null ? '0.5px solid var(--separator)' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>Anion Gap</p>
                <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 2 }}>Na⁺ − (Cl⁻ + HCO₃⁻) · normal 8–12</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                  color: result.anionGapHigh ? 'var(--sys-red)' : 'var(--sys-green)',
                }}>{result.anionGap}</span>
                <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginLeft: 4 }}>mEq/L</span>
              </div>
            </div>
            <span style={{
              display: 'inline-block', marginTop: 6,
              font: 'var(--type-caption-2)', fontWeight: 600,
              color: result.anionGapHigh ? 'var(--sys-red)' : 'var(--sys-green)',
              background: result.anionGapHigh ? 'rgba(255,59,48,0.12)' : 'rgba(52,199,89,0.12)',
              padding: '3px 9px', borderRadius: 'var(--r-pill)',
            }}>
              {result.anionGapHigh ? 'HAGMA (High AG)' : 'Normal AG'}
            </span>
          </div>

          {/* Delta Ratio */}
          {result.deltaRatio != null && result.deltaRatioClass != null && (
            <div style={{ padding: '12px 16px' }}>
              <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 4 }}>Delta Ratio <span style={{ fontWeight: 400, textTransform: 'none' }}>(AG − 12) / (24 − HCO₃⁻)</span></p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
                  {DELTA_RATIO_LABELS[result.deltaRatioClass]}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--label-primary)' }}>
                  {result.deltaRatio.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── P/F Ratio ── */}
      {result.pfRatio != null && result.pfRatioClass != null && (
        <div className="ios-card" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>P/F Ratio</p>
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 2 }}>PaO₂ / FiO₂ · ARDS Berlin 2012</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                color: PF_TINT[result.pfRatioClass],
              }}>{result.pfRatio}</span>
              <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginLeft: 4 }}>mmHg</span>
            </div>
          </div>
          <span style={{
            display: 'inline-block', marginTop: 8,
            font: 'var(--type-caption-2)', fontWeight: 600,
            color: PF_TINT[result.pfRatioClass],
            background: `color-mix(in srgb, ${PF_TINT[result.pfRatioClass]} 12%, transparent)`,
            padding: '3px 9px', borderRadius: 'var(--r-pill)',
          }}>
            {PF_RATIO_LABELS[result.pfRatioClass]}
          </span>
        </div>
      )}
    </div>
  );
}

function CompStatus({ status, tint }: { status: AbgResult['compensationStatus']; tint: string }) {
  if (status === 'not_applicable') return null;
  const labels = { adequate: 'Kompensasi adekuat', over: 'Kompensasi berlebih', under: 'Kompensasi kurang' };
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
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>
        Nilai Normal
      </p>
      {[
        { param: 'pH',      range: '7.35–7.45' },
        { param: 'PaCO₂',  range: '35–45 mmHg' },
        { param: 'HCO₃⁻',  range: '22–26 mEq/L' },
        { param: 'Na⁺',    range: '135–145 mEq/L' },
        { param: 'Cl⁻',    range: '98–108 mEq/L' },
        { param: 'Anion Gap', range: '8–12 mEq/L' },
        { param: 'P/F Ratio', range: '≥ 300 (normal)' },
      ].map((r) => (
        <div key={r.param} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-footnote)', color: 'var(--label-primary)' }}>{r.param}</span>
          <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>{r.range}</span>
        </div>
      ))}
    </div>
  );
}
