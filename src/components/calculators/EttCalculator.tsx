import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Cite } from '../Citation';
import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import {
  ettSizeByAge,
  ettSizeNeonate,
  ETT_AGE_MIN_YEARS,
  ETT_AGE_MAX_YEARS,
} from '../../utils/ett';
import { REFERENCES } from '../../data/references';

const NEONATE_WEIGHT_MIN_G = 300;
const NEONATE_WEIGHT_MAX_G = 6000;

type Validation = { tone: 'warn' | 'danger'; text: string } | null;

export function EttCalculator() {
  const { category, ageYears, weightKg } = usePatientStore();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Kalkulator Ukuran ETT</h2>
        <p className="text-sm text-muted-foreground">
          Internal diameter (mm) berdasarkan {category === 'anak' ? 'usia' : 'berat badan'}.
        </p>
      </div>

      {category === 'anak' ? <ChildResult age={ageYears} /> : <NeonateResult weight={weightKg} />}

      <Disclaimer />
      <ReferenceFootnotes />
    </div>
  );
}

function ChildResult({ age }: { age: string }) {
  if (age.trim() === '') {
    return <EmptyHint text="Masukkan usia pasien di atas untuk menghitung." />;
  }

  const ageNum = Number(age);
  const invalid = validateAge(ageNum);
  if (invalid?.tone === 'danger') {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-destructive">{invalid.text}</p>
        </CardContent>
      </Card>
    );
  }

  const { cuffed, uncuffed } = ettSizeByAge(ageNum);

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        {invalid?.tone === 'warn' && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-2 text-sm text-yellow-400">
            {invalid.text}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <ResultTile
            label="Cuffed"
            cite="duracher2008"
            value={cuffed}
            note="usia/4 + 3.5"
            preferred
          />
          <ResultTile
            label="Uncuffed"
            cite="cole1957"
            value={uncuffed}
            note="usia/4 + 4"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          AHA PALS 2020 lebih menyukai cuffed pada bayi &amp; anak{' '}
          <Cite source="pals2020" />. Selalu sediakan ukuran ± 0.5 mm.
        </p>
      </CardContent>
    </Card>
  );
}

function NeonateResult({ weight }: { weight: string }) {
  if (weight.trim() === '') {
    return <EmptyHint text="Masukkan berat badan pasien di atas untuk menghitung." />;
  }

  const grams = Number(weight) * 1000;
  const v = validateNeonateWeight(grams);
  if (v?.tone === 'danger') {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-destructive">{v.text}</p>
        </CardContent>
      </Card>
    );
  }

  const row = ettSizeNeonate(grams);
  if (!row) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-destructive">Berat di luar rentang tabel.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <ResultTile
            label="ETT uncuffed"
            cite="nrp8"
            value={row.sizeMm}
            note={row.gestation}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Berdasarkan tabel berat NRP 8th ed. <Cite source="nrp8" />
        </p>
      </CardContent>
    </Card>
  );
}

function ResultTile({
  label,
  cite,
  value,
  note,
  preferred,
}: {
  label: string;
  cite: keyof typeof REFERENCES;
  value: number;
  note: string;
  preferred?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-container dark:bg-surface-high p-4 text-center space-y-1.5 elevation-1 dark:shadow-none">
      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
        {label} <Cite source={cite} />
        {preferred && <Badge variant="default" className="text-[10px] h-4 px-1.5">PALS</Badge>}
      </div>
      <div className="text-3xl font-bold text-primary">
        {value.toFixed(1)}{' '}
        <span className="text-base font-normal text-muted-foreground">mm</span>
      </div>
      <div className="font-mono text-xs text-muted-foreground">{note}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}

function ReferenceFootnotes() {
  const used = ['cole1957', 'duracher2008', 'pals2020', 'nrp8'] as const;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Referensi</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2 text-xs text-muted-foreground">
          {used.map((key) => (
            <li key={key}>
              <span className="font-semibold text-foreground">[{REFERENCES[key].id}]</span>{' '}
              {REFERENCES[key].citation}
              {!REFERENCES[key].verified && (
                <span className="text-yellow-500"> (perlu konfirmasi)</span>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function validateAge(age: number): Validation {
  if (!Number.isFinite(age)) return { tone: 'danger', text: 'Usia harus berupa angka.' };
  if (age <= 0) return { tone: 'danger', text: 'Usia harus lebih dari 0.' };
  if (age < ETT_AGE_MIN_YEARS)
    return { tone: 'danger', text: `Rumus usia/4 tidak valid < ${ETT_AGE_MIN_YEARS} th. Pakai kategori Neonatus.` };
  if (age > ETT_AGE_MAX_YEARS)
    return { tone: 'warn', text: `Usia > ${ETT_AGE_MAX_YEARS} th: pertimbangkan ukuran dewasa & penilaian klinis.` };
  return null;
}

function validateNeonateWeight(grams: number): Validation {
  if (!Number.isFinite(grams)) return { tone: 'danger', text: 'Berat harus berupa angka.' };
  if (grams <= 0) return { tone: 'danger', text: 'Berat harus lebih dari 0.' };
  if (grams < NEONATE_WEIGHT_MIN_G || grams > NEONATE_WEIGHT_MAX_G)
    return { tone: 'danger', text: 'Berat di luar rentang neonatus wajar (0.3–6 kg). Periksa kembali.' };
  return null;
}
