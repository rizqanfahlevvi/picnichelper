import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Field } from '../ui/field';
import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import {
  calculateSyringePumpRate,
  SYRINGE_PUMP_DRUGS,
  type DoseTimeUnit,
} from '../../utils/syringePump';

export function SyringePumpCalculator() {
  const { weightKg } = usePatientStore();
  const [dose, setDose] = useState('');
  const [timeUnit, setTimeUnit] = useState<DoseTimeUnit>('per_minute');
  const [concentration, setConcentration] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('');

  const weightNum = Number(weightKg);
  const doseNum = Number(dose);
  const concNum = Number(concentration);

  const canCalculate =
    weightKg.trim() !== '' && Number.isFinite(weightNum) && weightNum > 0 &&
    dose.trim() !== '' && Number.isFinite(doseNum) && doseNum > 0 &&
    concentration.trim() !== '' && Number.isFinite(concNum) && concNum > 0;

  let result: ReturnType<typeof calculateSyringePumpRate> | null = null;
  let error: string | null = null;

  if (canCalculate) {
    try {
      result = calculateSyringePumpRate({
        dosePerKgPerTime: doseNum,
        timeUnit,
        weightKg: weightNum,
        concentrationMcgPerMl: concNum,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error';
    }
  }

  function applyDrugPreset(name: string) {
    const drug = SYRINGE_PUMP_DRUGS.find((d) => d.name === name);
    if (!drug) return;
    setSelectedDrug(name);
    setTimeUnit(drug.unit);
    setDose(String(drug.minDose));
    if (drug.commonConcentrations.length > 0) {
      setConcentration(String(drug.commonConcentrations[0]));
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Syringe Pump</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kecepatan infus kontinu (mL/jam).
        </p>
      </div>

      {/* Drug presets */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Preset obat</p>
          <div className="flex flex-wrap gap-2">
            {SYRINGE_PUMP_DRUGS.map((d) => (
              <button
                key={d.name}
                onClick={() => applyDrugPreset(d.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedDrug === d.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Berat pasien"
              unit="kg"
              id="sp-weight"
              value={weightKg}
              readOnly
              placeholder="dari input pasien"
            />
            <Field
              label="Konsentrasi"
              unit="mcg/mL"
              id="sp-conc"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value)}
              placeholder="mis. 1600"
              type="number"
              min="0"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Dosis
            </label>
            <div className="flex gap-2">
              <input
                id="sp-dose"
                type="number"
                min="0"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="mis. 5"
                className="flex-1 min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {(['per_minute', 'per_hour'] as DoseTimeUnit[]).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setTimeUnit(unit)}
                    className={`px-3 min-h-[48px] text-xs font-medium transition-colors ${
                      timeUnit === unit
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {unit === 'per_minute' ? 'mcg/kg/mnt' : 'mcg/kg/jam'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {error && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-5 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
              {result.ratePerHour.toFixed(2)}
            </span>
            <span className="text-lg text-slate-500 dark:text-slate-400">mL/jam</span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Dosis absolut:{' '}
            <span className="font-semibold">
              {result.absoluteDosePerTime.toFixed(2)} mcg/
              {result.timeUnit === 'per_minute' ? 'mnt' : 'jam'}
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
            {doseNum} × {weightNum} {timeUnit === 'per_minute' ? '× 60' : ''} ÷ {concNum}
          </div>
        </div>
      )}

      {/* Dose range hints */}
      {selectedDrug && (
        <DoseRangeHint drugName={selectedDrug} />
      )}

      <Disclaimer />
    </div>
  );
}

function DoseRangeHint({ drugName }: { drugName: string }) {
  const drug = SYRINGE_PUMP_DRUGS.find((d) => d.name === drugName);
  if (!drug) return null;
  return (
    <Card>
      <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-medium text-foreground">{drug.name} — rentang dosis referensi</p>
        <p>
          {drug.minDose}–{drug.maxDose} mcg/kg/{drug.unit === 'per_minute' ? 'mnt' : 'jam'}
        </p>
        <p>Konsentrasi umum: {drug.commonConcentrations.join(', ')} mcg/mL</p>
      </CardContent>
    </Card>
  );
}
