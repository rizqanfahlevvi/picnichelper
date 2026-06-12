import { Card, CardContent } from '../ui/card';
import { Cite } from '../Citation';
import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import { ettDepthByAge, ettDepthByTubeId, ettDepthByWeight, ETT_DEPTH_AGE_MIN_YEARS } from '../../utils/ettDepth';
import { REFERENCES } from '../../data/references';

export function EttDepthCalculator() {
  const { category, ageYears, weightKg } = usePatientStore();

  const ageNum = Number(ageYears);
  const weightNum = Number(weightKg);

  const byAge = ageYears.trim() && Number.isFinite(ageNum) && ageNum >= ETT_DEPTH_AGE_MIN_YEARS
    ? ettDepthByAge(ageNum) : null;
  const byWeight = weightKg.trim() && Number.isFinite(weightNum) && weightNum > 0 && category === 'neonatus'
    ? ettDepthByWeight(weightNum) : null;

  const noInput = !ageYears.trim() && !weightKg.trim();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Kedalaman Insersi ETT</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Jarak bibir ke ujung tube (cm).
        </p>
      </div>

      {noInput && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Masukkan usia atau berat pasien untuk menghitung.
            </p>
          </CardContent>
        </Card>
      )}

      {(byAge || byWeight) && (
        <div className="grid grid-cols-1 gap-3">
          {byAge && (
            <DepthTile
              label="Formula usia (bibir)"
              formula="usia/2 + 12"
              cite="pals2020"
              value={byAge}
              note={`${ageNum} tahun`}
            />
          )}
          {byWeight && (
            <DepthTile
              label="Formula berat (neonatus)"
              formula="berat(kg) + 6"
              cite="nrp8"
              value={byWeight}
              note={`${weightNum} kg`}
            />
          )}
        </div>
      )}

      {ageYears.trim() && Number.isFinite(ageNum) && ageNum < ETT_DEPTH_AGE_MIN_YEARS && category === 'anak' && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-yellow-500">
              Formula usia/2+12 berlaku mulai ≥{ETT_DEPTH_AGE_MIN_YEARS} tahun.
              Gunakan kategori Neonatus dan masukkan berat badan.
            </p>
          </CardContent>
        </Card>
      )}

      <TubeIdSection />
      <Disclaimer />
      <ReferenceFootnotes />
    </div>
  );
}

function TubeIdSection() {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <p className="text-sm font-medium">Formula ID tube (berlaku semua usia)</p>
        <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
          kedalaman (cm) = ID tube (mm) × 3
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[3.0, 3.5, 4.0, 4.5, 5.0, 5.5].map((id) => (
            <div
              key={id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-center"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID {id} mm</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {ettDepthByTubeId(id)}{' '}
                <span className="text-xs font-normal text-slate-400">cm</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <Cite source="pals2020" /> Berlaku untuk semua usia.
        </p>
      </CardContent>
    </Card>
  );
}

function DepthTile({
  label,
  formula,
  cite,
  value,
  note,
}: {
  label: string;
  formula: string;
  cite: keyof typeof REFERENCES;
  value: number;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
          {label} <Cite source={cite} />
        </div>
        <div className="font-mono text-xs text-slate-400 dark:text-slate-500">{formula} · {note}</div>
      </div>
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
        {value}
        <span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">cm</span>
      </div>
    </div>
  );
}

function ReferenceFootnotes() {
  const used = ['pals2020', 'nrp8'] as const;
  return (
    <Card>
      <CardContent className="pt-4">
        <ol className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          {used.map((key) => (
            <li key={key}>
              <span className="font-semibold text-foreground">[{REFERENCES[key].id}]</span>{' '}
              {REFERENCES[key].citation}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
