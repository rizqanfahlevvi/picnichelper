import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Cite } from '../Citation';
import {
  VITAL_RANGES,
  checkVitals,
  type AgeGroup,
  type VitalStatus,
} from '../../utils/vitalSigns';

const STATUS_STYLE: Record<VitalStatus, string> = {
  normal: 'text-green-500',
  low:    'text-red-500',
  high:   'text-orange-500',
};

const STATUS_LABEL: Record<VitalStatus, string> = {
  normal: '✓',
  low:    '↓ Rendah',
  high:   '↑ Tinggi',
};

export function VitalSignsChecker() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('infant');
  const [hr,   setHr]   = useState('');
  const [rr,   setRr]   = useState('');
  const [sbp,  setSbp]  = useState('');
  const [dbp,  setDbp]  = useState('');
  const [spo2, setSpo2] = useState('');
  const [map,  setMap]  = useState('');

  const range = VITAL_RANGES.find(r => r.ageGroup === ageGroup)!;

  const inputMap = {
    hr:   hr   !== '' ? Number(hr)   : undefined,
    rr:   rr   !== '' ? Number(rr)   : undefined,
    sbp:  sbp  !== '' ? Number(sbp)  : undefined,
    dbp:  dbp  !== '' ? Number(dbp)  : undefined,
    spo2: spo2 !== '' ? Number(spo2) : undefined,
    map:  map  !== '' ? Number(map)  : undefined,
  };
  const result = checkVitals(range, inputMap);

  return (
    <div className="space-y-4">
      {/* Age group selector */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Kelompok Usia</p>
          <div className="flex flex-wrap gap-2">
            {VITAL_RANGES.map(r => (
              <button
                key={r.ageGroup}
                onClick={() => setAgeGroup(r.ageGroup)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  ageGroup === r.ageGroup
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Normal range reference */}
      <Card>
        <CardContent className="pt-4 space-y-1">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
            Rentang Normal — {range.label} <Cite source="pals2020" />
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>HR: {range.hrMin}–{range.hrMax} bpm</span>
            <span>RR: {range.rrMin}–{range.rrMax} ×/mnt</span>
            <span>Sistolik: {range.sbpMin}–{range.sbpMax} mmHg</span>
            <span>Diastolik: {range.dbpMin}–{range.dbpMax} mmHg</span>
            <span>MAP: {range.mapMin}–{range.mapMax} mmHg</span>
            <span>SpO₂: 95–100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Input vitals */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Input nilai — kosongkan bila tidak tersedia
          </p>
          <div className="grid grid-cols-2 gap-3">
            <VF label="HR" unit="bpm"  value={hr}   onChange={setHr}   status={result.hr} />
            <VF label="RR" unit="×/mnt" value={rr}  onChange={setRr}   status={result.rr} />
            <VF label="Sistolik" unit="mmHg" value={sbp} onChange={setSbp} status={result.sbp} />
            <VF label="Diastolik" unit="mmHg" value={dbp} onChange={setDbp} status={result.dbp} />
            <VF label="MAP" unit="mmHg" value={map}  onChange={setMap}  status={result.map} />
            <VF label="SpO₂" unit="%" value={spo2}   onChange={setSpo2} status={result.spo2} />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {Object.values(result).some(v => v !== null && v !== 'normal') && (
        <div className="rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-4 space-y-2">
          <p className="text-sm font-semibold text-orange-500">Perhatian — nilai di luar rentang normal:</p>
          {(Object.entries(result) as [keyof typeof result, VitalStatus | null][])
            .filter(([, v]) => v === 'low' || v === 'high')
            .map(([key, v]) => (
              <div key={key} className="text-sm text-orange-400">
                • {FIELD_LABELS[key]}: {v === 'low' ? 'Di bawah normal' : 'Di atas normal'}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const FIELD_LABELS: Record<string, string> = {
  hr: 'HR', rr: 'RR', sbp: 'Sistolik', dbp: 'Diastolik', map: 'MAP', spo2: 'SpO₂',
};

function VF({
  label, unit, value, onChange, status,
}: {
  label: string; unit: string; value: string;
  onChange: (v: string) => void; status: VitalStatus | null;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {label} <span className="text-slate-400">({unit})</span>
        </label>
        {status && (
          <span className={`text-xs font-semibold ${STATUS_STYLE[status]}`}>
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="—"
        className={`w-full min-h-[48px] rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 ${
          status === 'normal' ? 'border-green-400 dark:border-green-700' :
          status === 'low'    ? 'border-red-400 dark:border-red-700' :
          status === 'high'   ? 'border-orange-400 dark:border-orange-700' :
          'border-slate-200 dark:border-slate-700'
        }`}
      />
    </div>
  );
}
