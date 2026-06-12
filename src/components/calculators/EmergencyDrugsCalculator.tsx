import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import { calculateDose, EMERGENCY_DRUGS, type CalculatedDose } from '../../utils/emergencyDrugs';
import { REFERENCES } from '../../data/references';
import { Cite } from '../Citation';

export function EmergencyDrugsCalculator() {
  const { weightKg } = usePatientStore();
  const weightNum = Number(weightKg);
  const valid = weightKg.trim() !== '' && Number.isFinite(weightNum) && weightNum > 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Dosis Obat Emergensi</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          PALS 2020 <Cite source="pals2020" /> · Berdasarkan berat pasien.
        </p>
      </div>

      {!valid ? (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Masukkan berat badan pasien untuk menghitung dosis.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {EMERGENCY_DRUGS.map((drug) => {
            const result = calculateDose(drug, weightNum);
            return <DrugRow key={drug.id} result={result} />;
          })}
        </div>
      )}

      <Disclaimer />

      <Card>
        <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-foreground">[{REFERENCES.pals2020.id}]</span>{' '}
          {REFERENCES.pals2020.citation}
        </CardContent>
      </Card>
    </div>
  );
}

function DrugRow({ result }: { result: CalculatedDose }) {
  const { drug, rawDose, clampedDose, unit, isClamped, clampReason } = result;

  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold">{drug.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{drug.indication}</div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {clampedDose.toFixed(2).replace(/\.?0+$/, '')}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">{unit}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500">
            {drug.dosePerKg} {unit}/kg
            {drug.dosePerKgMax ? `–${drug.dosePerKgMax}` : ''} · via {drug.route}
          </span>
          {isClamped && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
              {clampReason === 'max' ? `max ${drug.maxDose} ${unit}` : `min ${drug.minDose} ${unit}`}
              {' '}(raw {rawDose.toFixed(2).replace(/\.?0+$/, '')} {unit})
            </Badge>
          )}
        </div>

        {drug.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
            {drug.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
