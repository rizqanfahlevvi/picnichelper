import { Card } from './ui/Card';
import { Field } from './ui/Field';
import { cn } from './ui/cn';
import { usePatientStore, type PatientCategory } from '../store/patientStore';

const CATEGORIES: { id: PatientCategory; label: string }[] = [
  { id: 'neonatus', label: 'Neonatus (< 1 th)' },
  { id: 'anak', label: 'Anak (1–12 th)' },
];

/**
 * Form data pasien global. Satu-satunya tempat berat & usia diinput
 * (CLAUDE.md: single source of truth → /store). Komponen ini hanya mengelola
 * string mentah; konversi & validasi number terjadi di kalkulator.
 */
export function PatientInput() {
  const { category, ageYears, weightKg, setCategory, setAgeYears, setWeightKg } =
    usePatientStore();

  return (
    <Card>
      <div className="mb-3 flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              'min-h-[44px] flex-1 rounded-xl border px-3 text-sm font-medium transition-colors',
              category === c.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)]',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {category === 'anak' && (
          <Field
            id="patient-age"
            label="Usia"
            unit="tahun"
            value={ageYears}
            onChange={(e) => setAgeYears(e.target.value)}
            placeholder="mis. 4"
          />
        )}
        <Field
          id="patient-weight"
          label="Berat badan"
          unit="kg"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          placeholder="mis. 16"
        />
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        Data dipakai bersama oleh semua kalkulator.
      </p>
    </Card>
  );
}
