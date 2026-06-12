import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import {
  calculateDownes,
  DOWNES_OPTIONS,
  DOWNES_PARAM_LABELS,
  type DownesInput,
  type DownesParam,
} from '../../utils/downes';
import { REFERENCES } from '../../data/references';

const PARAMS = Object.keys(DOWNES_PARAM_LABELS) as DownesParam[];

const SEVERITY_STYLE = {
  ringan:  'bg-green-500/10 border-green-500/30 text-green-500',
  sedang:  'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
  berat:   'bg-red-500/10 border-red-500/30 text-red-500',
};

export function DownesScore() {
  const [values, setValues] = useState<DownesInput>({
    respiratoryRate: 0,
    retractions: 0,
    cyanosis: 0,
    airEntry: 0,
    grunting: 0,
  });

  const result = calculateDownes(values);

  function set(param: DownesParam, score: 0 | 1 | 2) {
    setValues((prev) => ({ ...prev, [param]: score }));
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Downes Score</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Penilaian distres napas neonatus <Cite source="downes1970" />.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-5">
          {PARAMS.map((param) => (
            <div key={param} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{DOWNES_PARAM_LABELS[param]}</span>
                <Badge variant="secondary">{values[param]}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DOWNES_OPTIONS[param].map((opt) => (
                  <button
                    key={opt.score}
                    onClick={() => set(param, opt.score)}
                    className={`min-h-[48px] rounded-xl border px-2 py-2 text-xs font-medium text-center transition-colors leading-snug ${
                      values[param] === opt.score
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="block font-bold mb-0.5">{opt.score}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Result */}
      <div className={`rounded-2xl border p-5 space-y-2 ${SEVERITY_STYLE[result.severity]}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-75">Total Skor</span>
          <span className="text-4xl font-bold">{result.total}</span>
        </div>
        <div className="text-base font-semibold capitalize">{result.severity}</div>
        <p className="text-sm">{result.interpretation}</p>
        <div className="text-xs opacity-60 font-mono">
          Skala: 0–2 ringan · 3–5 sedang · 6–10 berat
        </div>
      </div>

      <Disclaimer />
      <Card>
        <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-foreground">[{REFERENCES.downes1970.id}]</span>{' '}
          {REFERENCES.downes1970.citation}
        </CardContent>
      </Card>
    </div>
  );
}
