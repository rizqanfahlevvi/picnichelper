import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
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

const SEVERITY_STYLE = {
  'ringan':       'bg-green-500/10 border-green-500/30 text-green-500',
  'sedang':       'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
  'berat':        'bg-orange-500/10 border-orange-500/30 text-orange-500',
  'sangat berat': 'bg-red-500/10 border-red-500/30 text-red-500',
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
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">pSOFA</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pediatric Sequential Organ Failure Assessment <Cite source="matics2017" />.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <Sec>Demografis</Sec>
          <NF label="Usia" unit="bulan" value={v.ageMonths} onChange={(x) => num('ageMonths', x)} />

          <Sec>Respirasi</Sec>
          <div className="grid grid-cols-2 gap-3">
            <NF label="P/F ratio" unit="" value={v.pf} onChange={(x) => num('pf', x)} />
          </div>
          <Toggle active={v.onVentilator} onToggle={(b) => bool('onVentilator', b)}
            labelOn="✓ Menggunakan ventilator" labelOff="Ventilator?" />

          <Sec>Koagulasi & Hepatik</Sec>
          <div className="grid grid-cols-2 gap-3">
            <NF label="Trombosit" unit="×10³/µL" value={v.plateletsE3PerMcL} onChange={(x) => num('plateletsE3PerMcL', x)} />
            <NF label="Bilirubin" unit="mg/dL" value={v.bilirubinMgDl} onChange={(x) => num('bilirubinMgDl', x)} step="0.1" />
          </div>

          <Sec>Kardiovaskular — vasopresor (mcg/kg/mnt, isi 0 bila tidak dipakai)</Sec>
          <div className="grid grid-cols-2 gap-3">
            <NF label="Dopamin"      unit="" value={v.dopamineDose}      onChange={(x) => num('dopamineDose', x)}      step="0.1" />
            <NF label="Dobutamin"    unit="" value={v.dobutamineDose}    onChange={(x) => num('dobutamineDose', x)}    step="0.1" />
            <NF label="Epinefrin"    unit="" value={v.epinephrineDose}   onChange={(x) => num('epinephrineDose', x)}   step="0.01" />
            <NF label="Norepinefrin" unit="" value={v.norepinephrineDose} onChange={(x) => num('norepinephrineDose', x)} step="0.01" />
          </div>

          <Sec>Neurologi</Sec>
          <NF label="GCS Total" unit="" value={v.gcs} onChange={(x) => num('gcs', x)} min={3} max={15} />

          <Sec>Renal</Sec>
          <NF label="Kreatinin" unit="mg/dL" value={v.creatinineMgDl} onChange={(x) => num('creatinineMgDl', x)} step="0.1" />
        </CardContent>
      </Card>

      {error && (
        <Card><CardContent className="pt-4"><p className="text-sm text-destructive">{error}</p></CardContent></Card>
      )}

      {result && (
        <>
          <div className={`rounded-2xl border p-5 space-y-2 ${SEVERITY_STYLE[result.severityLabel]}`}>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{result.total}</span>
              <span className="text-sm opacity-75">poin</span>
            </div>
            <p className="text-base font-semibold capitalize">{result.severityLabel}</p>
          </div>

          <Card>
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rincian per organ</p>
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
          <span className="font-semibold text-foreground">[{REFERENCES.matics2017.id}]</span>{' '}
          {REFERENCES.matics2017.citation}
        </CardContent>
      </Card>
    </div>
  );
}

function Sec({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide pt-1">{children}</p>;
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

function Toggle({ active, onToggle, labelOn, labelOff }: {
  active: boolean; onToggle: (b: boolean) => void; labelOn: string; labelOff: string;
}) {
  return (
    <button onClick={() => onToggle(!active)}
      className={`min-h-[44px] px-4 rounded-xl border text-sm font-medium transition-colors ${
        active
          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
      }`}>
      {active ? labelOn : labelOff}
    </button>
  );
}
