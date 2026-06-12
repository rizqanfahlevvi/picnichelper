import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { interpretAbg, type AbgResult, type PrimaryDisorder } from '../../utils/abg';
import { REFERENCES } from '../../data/references';

const DISORDER_LABEL: Record<PrimaryDisorder, string> = {
  metabolic_acidosis: 'Asidosis Metabolik',
  metabolic_alkalosis: 'Alkalosis Metabolik',
  respiratory_acidosis: 'Asidosis Respiratorik',
  respiratory_alkalosis: 'Alkalosis Respiratorik',
  normal: 'AGD Normal',
};

const DISORDER_COLOR: Record<PrimaryDisorder, string> = {
  metabolic_acidosis: 'bg-red-500/10 border-red-500/30 text-red-400',
  metabolic_alkalosis: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  respiratory_acidosis: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  respiratory_alkalosis: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  normal: 'bg-green-500/10 border-green-500/30 text-green-400',
};

export function AbgInterpreter() {
  const [pH, setPH] = useState('');
  const [paCO2, setPaCO2] = useState('');
  const [hco3, setHco3] = useState('');
  const [result, setResult] = useState<AbgResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleInterpret() {
    setError(null);
    setResult(null);
    try {
      const r = interpretAbg({
        pH: Number(pH),
        paCO2: Number(paCO2),
        hco3: Number(hco3),
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Input tidak valid');
    }
  }

  function handleReset() {
    setPH(''); setPaCO2(''); setHco3('');
    setResult(null); setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Interpretasi AGD</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Boston Rules <Cite source="boston1980" /> — kompensasi asam-basa.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <AbgField
              label="pH"
              value={pH}
              onChange={setPH}
              placeholder="7.40"
              hint="6.5–7.9"
            />
            <AbgField
              label="PaCO₂"
              unit="mmHg"
              value={paCO2}
              onChange={setPaCO2}
              placeholder="40"
              hint="1–150"
            />
            <AbgField
              label="HCO₃⁻"
              unit="mEq/L"
              value={hco3}
              onChange={setHco3}
              placeholder="24"
              hint="1–60"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInterpret}
              disabled={!pH || !paCO2 || !hco3}
              className="flex-1 min-h-[48px] rounded-xl bg-blue-600 text-white font-semibold text-sm disabled:opacity-40 transition-opacity"
            >
              Interpretasi
            </button>
            <button
              onClick={handleReset}
              className="min-h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300"
            >
              Reset
            </button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && <AbgResultCard result={result} />}

      <NormalRangeCard />
      <Disclaimer />

      <Card>
        <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-foreground">[{REFERENCES.boston1980.id}]</span>{' '}
          {REFERENCES.boston1980.citation}
        </CardContent>
      </Card>
    </div>
  );
}

function AbgField({
  label, unit, value, onChange, placeholder, hint,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint: string;
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
        placeholder={placeholder}
        className="w-full min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="text-[10px] text-slate-400">{hint}</div>
    </div>
  );
}

function AbgResultCard({ result }: { result: AbgResult }) {
  const colorClass = DISORDER_COLOR[result.primaryDisorder];

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${colorClass}`}>
      <div className="text-lg font-bold">{DISORDER_LABEL[result.primaryDisorder]}</div>
      <p className="text-sm">{result.interpretation}</p>

      {result.expectedCompensation && (
        <div className="bg-white/10 dark:bg-black/20 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold opacity-75">{result.expectedCompensation.label}</p>
          <p className="text-xl font-bold">
            {result.expectedCompensation.low.toFixed(1)}
            {' – '}
            {result.expectedCompensation.high.toFixed(1)}
          </p>
          <CompBadge status={result.compensationStatus} />
        </div>
      )}
    </div>
  );
}

function CompBadge({ status }: { status: AbgResult['compensationStatus'] }) {
  if (status === 'not_applicable') return null;
  const map = {
    adequate: { label: 'Kompensasi adekuat', variant: 'default' as const },
    over: { label: 'Kompensasi berlebih', variant: 'destructive' as const },
    under: { label: 'Kompensasi kurang', variant: 'secondary' as const },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function NormalRangeCard() {
  const rows = [
    { param: 'pH', range: '7.35–7.45' },
    { param: 'PaCO₂', range: '35–45 mmHg' },
    { param: 'HCO₃⁻', range: '22–26 mEq/L' },
  ];
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs font-medium mb-2">Nilai Normal</p>
        <div className="space-y-1.5">
          {rows.map((r) => (
            <div key={r.param} className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">{r.param}</span>
              <span>{r.range}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
