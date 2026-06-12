import { Card } from '../ui/Card';
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

// Batas berat rasional neonatus (gram) untuk peringatan input.
const NEONATE_WEIGHT_MIN_G = 300;
const NEONATE_WEIGHT_MAX_G = 6000;

type Validation = { tone: 'warn' | 'danger'; text: string } | null;

export function EttCalculator() {
  const { category, ageYears, weightKg } = usePatientStore();

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-bold">Kalkulator Ukuran ETT</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Internal diameter (mm) berdasarkan {category === 'anak' ? 'usia' : 'berat'}.
        </p>
      </header>

      {category === 'anak' ? <ChildResult age={ageYears} /> : <NeonateResult weight={weightKg} />}

      <Disclaimer />
      <ReferenceFootnotes />
    </div>
  );
}

// ─── Anak ≥ 1 th: rumus age-based ──────────────────────────────────────────
function ChildResult({ age }: { age: string }) {
  if (age.trim() === '') {
    return <Hint text="Masukkan usia pasien untuk menghitung." />;
  }

  // Konversi eksplisit string → number sebelum masuk ke /utils.
  const ageNum = Number(age);
  const invalid: Validation = validateAge(ageNum);
  if (invalid?.tone === 'danger') {
    return <Hint text={invalid.text} tone="danger" />;
  }

  const { cuffed, uncuffed } = ettSizeByAge(ageNum);

  return (
    <Card>
      {invalid?.tone === 'warn' && (
        <p className="mb-3 rounded-lg bg-[var(--color-warn)]/15 px-3 py-2 text-sm text-[var(--color-warn)]">
          {invalid.text}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <ResultTile
          label={<>Cuffed <Cite source="duracher2008" /></>}
          value={cuffed}
          note="usia/4 + 3.5"
        />
        <ResultTile
          label={<>Uncuffed <Cite source="cole1957" /></>}
          value={uncuffed}
          note="usia/4 + 4"
        />
      </div>
      <p className="mt-3 text-xs text-[var(--color-text-muted)]">
        AHA PALS 2020 lebih menyukai cuffed pada bayi & anak <Cite source="pals2020" />.
        Selalu sediakan ukuran ± 0.5 mm.
      </p>
    </Card>
  );
}

// ─── Neonatus < 1 th: tabel berbasis berat ─────────────────────────────────
function NeonateResult({ weight }: { weight: string }) {
  if (weight.trim() === '') {
    return <Hint text="Masukkan berat badan untuk menghitung." />;
  }

  const grams = Number(weight) * 1000; // input kg → gram
  const v = validateNeonateWeight(grams);
  if (v?.tone === 'danger') {
    return <Hint text={v.text} tone="danger" />;
  }

  const row = ettSizeNeonate(grams);
  if (!row) {
    return <Hint text="Berat di luar rentang tabel." tone="danger" />;
  }

  return (
    <Card>
      <div className="rounded-xl border border-[var(--color-warn)]/40 bg-[var(--color-warn)]/10 px-3 py-2 text-xs text-[var(--color-warn)]">
        ⚠ Nilai tabel neonatus mengikuti NRP standar namun{' '}
        <strong>belum dikonfirmasi</strong> terhadap edisi yang dipakai institusi
        Anda. Verifikasi sebelum digunakan klinis.
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <ResultTile
          label={<>ETT uncuffed (NRP) <Cite source="nrp8" /></>}
          value={row.sizeMm}
          note={`${row.gestation} · uncuffed`}
        />
      </div>
    </Card>
  );
}

function ResultTile({
  label,
  value,
  note,
}: {
  label: React.ReactNode;
  value: number;
  note: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-2)] p-3 text-center">
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
      <div className="my-1 text-3xl font-bold text-[var(--color-primary)]">
        {value.toFixed(1)} <span className="text-base font-normal">mm</span>
      </div>
      <div className="font-mono text-xs text-[var(--color-text-muted)]">{note}</div>
    </div>
  );
}

function Hint({ text, tone }: { text: string; tone?: 'warn' | 'danger' }) {
  return (
    <Card>
      <p
        className={
          tone === 'danger'
            ? 'text-[var(--color-danger)]'
            : 'text-[var(--color-text-muted)]'
        }
      >
        {text}
      </p>
    </Card>
  );
}

function ReferenceFootnotes() {
  const used = ['cole1957', 'duracher2008', 'pals2020', 'nrp8'] as const;
  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold">Referensi</h3>
      <ol className="space-y-1 text-xs text-[var(--color-text-muted)]">
        {used.map((key) => (
          <li key={key}>
            [{REFERENCES[key].id}] {REFERENCES[key].citation}
            {!REFERENCES[key].verified && (
              <span className="text-[var(--color-warn)]"> (perlu konfirmasi)</span>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}

// ─── Validasi (boundaries rasional) ─────────────────────────────────────────
function validateAge(age: number): Validation {
  if (!Number.isFinite(age)) return { tone: 'danger', text: 'Usia harus berupa angka.' };
  if (age <= 0) return { tone: 'danger', text: 'Usia harus lebih dari 0.' };
  if (age < ETT_AGE_MIN_YEARS)
    return {
      tone: 'danger',
      text: `Rumus usia/4 tidak valid < ${ETT_AGE_MIN_YEARS} th. Pakai kategori Neonatus.`,
    };
  if (age > ETT_AGE_MAX_YEARS)
    return {
      tone: 'warn',
      text: `Usia > ${ETT_AGE_MAX_YEARS} th: pertimbangkan ukuran dewasa & penilaian klinis.`,
    };
  return null;
}

function validateNeonateWeight(grams: number): Validation {
  if (!Number.isFinite(grams)) return { tone: 'danger', text: 'Berat harus berupa angka.' };
  if (grams <= 0) return { tone: 'danger', text: 'Berat harus lebih dari 0.' };
  if (grams < NEONATE_WEIGHT_MIN_G || grams > NEONATE_WEIGHT_MAX_G)
    return {
      tone: 'danger',
      text: 'Berat di luar rentang neonatus wajar (0.3–6 kg). Periksa kembali.',
    };
  return null;
}
