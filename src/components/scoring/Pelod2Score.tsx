import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Disclaimer } from '../Disclaimer';
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
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">PELOD-2</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pediatric Logistic Organ Dysfunction Score <Cite source="leteurtre2013" />.
        </p>
      </div>

      {/* Input usia — digunakan untuk threshold MAP & kreatinin */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <SectionTitle>Demografis</SectionTitle>
          <NumField label="Usia" unit="bulan" value={v.ageMonths} onChange={(val) => update('ageMonths', val)} />

          <SectionTitle>Neurologi</SectionTitle>
          <NumField label="GCS Total" unit="" value={v.gcs} onChange={(val) => update('gcs', val)} min={3} max={15} />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Reaktivitas Pupil</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['both_react', 'Keduanya reaktif'],
                  ['one_fixed', 'Satu fixed'],
                  ['both_fixed', 'Keduanya fixed'],
                ] as [Pelod2Input['pupils'], string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => updatePupils(val)}
                  className={`min-h-[48px] rounded-xl border px-2 py-2 text-xs font-medium text-center transition-colors leading-snug ${
                    v.pupils === val
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <SectionTitle>Kardiovaskular</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Laktat" unit="mmol/L" value={v.lactateMmolL} onChange={(val) => update('lactateMmolL', val)} step="0.1" />
            <NumField label="MAP" unit="mmHg" value={v.mapMmHg} onChange={(val) => update('mapMmHg', val)} />
          </div>

          <SectionTitle>Renal</SectionTitle>
          <NumField label="Kreatinin" unit="mg/dL" value={v.creatinineMgDl} onChange={(val) => update('creatinineMgDl', val)} step="0.1" />

          <SectionTitle>Respirasi</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="P/F ratio" unit="" value={v.pf} onChange={(val) => update('pf', val)} />
            <NumField label="PaCO₂" unit="mmHg" value={v.paCO2MmHg} onChange={(val) => update('paCO2MmHg', val)} />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update('onVentilator', !v.onVentilator)}
              className={`min-h-[44px] px-4 rounded-xl border text-sm font-medium transition-colors ${
                v.onVentilator
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {v.onVentilator ? '✓ Menggunakan ventilator' : 'Ventilator?'}
            </button>
          </div>

          <SectionTitle>Hematologi</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="WBC" unit="×10³/µL" value={v.wbcE3PerMcL} onChange={(val) => update('wbcE3PerMcL', val)} step="0.1" />
            <NumField label="Trombosit" unit="×10³/µL" value={v.plateletsE3PerMcL} onChange={(val) => update('plateletsE3PerMcL', val)} />
          </div>

          <SectionTitle>Hepatik</SectionTitle>
          <NumField label="Bilirubin" unit="mg/dL" value={v.bilirubinMgDl} onChange={(val) => update('bilirubinMgDl', val)} step="0.1" />
          {v.ageMonths < 1 && (
            <p className="text-xs text-yellow-500">Hepatik tidak dinilai pada neonatus (&lt;1 bulan).</p>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          {/* Total + mortalitas */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-5 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{result.total}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">poin</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Estimasi mortalitas:{' '}
              <span className="font-bold text-foreground">{result.estimatedMortalityPercent}%</span>
              <span className="text-xs text-slate-400 ml-1">(model logistik, Leteurtre 2013)</span>
            </div>
          </div>

          {/* Per-organ breakdown */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Rincian per organ
              </p>
              {result.organScores.map((o) => (
                <div key={o.organ} className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{o.organ}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{o.detail}</div>
                  </div>
                  <span className={`shrink-0 text-lg font-bold ${o.score > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {o.score}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      <Disclaimer />
      <Card>
        <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-foreground">[{REFERENCES.leteurtre2013.id}]</span>{' '}
          {REFERENCES.leteurtre2013.citation}
        </CardContent>
      </Card>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide pt-1">
      {children}
    </p>
  );
}

function NumField({
  label, unit, value, onChange, step, min, max,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: string) => void;
  step?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}{unit && <span className="text-slate-400 ml-1">({unit})</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step ?? '1'}
        min={min}
        max={max}
        className="w-full min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
