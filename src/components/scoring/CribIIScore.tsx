import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { calculateCribII, type CribIIInput, type CribIISex } from '../../utils/cribii';
import { REFERENCES } from '../../data/references';

const DEFAULT: CribIIInput = {
  gestationalAgeWeeks: 28,
  birthWeightGrams: 1000,
  sex: 'male',
  admissionTemperatureC: 36.5,
  baseExcess: 0,
};

const RISK_STYLE = {
  rendah:        'bg-green-500/10 border-green-500/30 text-green-500',
  sedang:        'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
  tinggi:        'bg-orange-500/10 border-orange-500/30 text-orange-500',
  'sangat tinggi': 'bg-red-500/10 border-red-500/30 text-red-500',
};

export function CribIIScore() {
  const [v, setV] = useState<CribIIInput>(DEFAULT);
  const [error, setError] = useState<string | null>(null);

  function num(key: keyof CribIIInput, val: string) {
    setError(null);
    setV((p) => ({ ...p, [key]: Number(val) || 0 }));
  }
  function setSex(sex: CribIISex) {
    setError(null);
    setV((p) => ({ ...p, sex }));
  }

  let result: ReturnType<typeof calculateCribII> | null = null;
  try {
    result = calculateCribII(v);
    if (error) setError(null);
  } catch (e) {
    if (!error) setError(e instanceof Error ? e.message : 'Input tidak valid');
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">CRIB-II</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Clinical Risk Index for Babies II <Cite source="parry2003" />.
          Untuk neonatus prematur ≤ 32 minggu.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <NF label="Usia gestasi" unit="minggu" value={v.gestationalAgeWeeks}
              onChange={(x) => num('gestationalAgeWeeks', x)} min={22} max={32} />
            <NF label="Berat lahir" unit="gram" value={v.birthWeightGrams}
              onChange={(x) => num('birthWeightGrams', x)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Jenis Kelamin</label>
            <div className="grid grid-cols-2 gap-2">
              {(['male', 'female'] as CribIISex[]).map((sex) => (
                <button key={sex} onClick={() => setSex(sex)}
                  className={`min-h-[48px] rounded-xl border text-sm font-medium transition-colors ${
                    v.sex === sex
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  {sex === 'male' ? 'Laki-laki' : 'Perempuan'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NF label="Suhu masuk" unit="°C" value={v.admissionTemperatureC}
              onChange={(x) => num('admissionTemperatureC', x)} step="0.1" />
            <NF label="Base Excess" unit="mmol/L" value={v.baseExcess}
              onChange={(x) => num('baseExcess', x)} step="0.1" />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card><CardContent className="pt-4"><p className="text-sm text-destructive">{error}</p></CardContent></Card>
      )}

      {result && (
        <>
          <div className={`rounded-2xl border p-5 space-y-3 ${RISK_STYLE[result.riskCategory]}`}>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{result.total}</span>
              <span className="text-sm opacity-75">poin</span>
            </div>
            <p className="text-base font-semibold capitalize">Risiko {result.riskCategory}</p>
            <p className="text-sm">
              Estimasi mortalitas:{' '}
              <span className="font-bold">~{result.estimatedMortalityPercent}%</span>
              <span className="text-xs opacity-60 ml-1">(tabel Parry 2003)</span>
            </p>
          </div>

          <Card>
            <CardContent className="pt-4 space-y-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Subskor</p>
              {result.subscores.map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
                  <span className={`font-bold ${s.score > 0 ? 'text-red-500' : 'text-green-500'}`}>{s.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      <Disclaimer />
      <Card>
        <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-foreground">[{REFERENCES.parry2003.id}]</span>{' '}
          {REFERENCES.parry2003.citation}
        </CardContent>
      </Card>
    </div>
  );
}

function NF({ label, unit, value, onChange, step, min, max }: {
  label: string; unit: string; value: number;
  onChange: (v: string) => void; step?: string; min?: number; max?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}{unit && <span className="text-slate-400 ml-1">({unit})</span>}
      </label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        step={step ?? '1'} min={min} max={max}
        className="w-full min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}
