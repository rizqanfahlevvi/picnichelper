import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Field } from './ui/field';
import { usePatientStore, type PatientCategory } from '../store/patientStore';

const CATEGORIES: { id: PatientCategory; label: string }[] = [
  { id: 'neonatus', label: 'Neonatus (< 1 th)' },
  { id: 'anak', label: 'Anak (1–12 th)' },
];

export function PatientInput() {
  const { category, ageYears, weightKg, setCategory, setAgeYears, setWeightKg } =
    usePatientStore();

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c.id}
              variant={category === c.id ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </Button>
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
        <p className="text-xs text-muted-foreground">
          Data dipakai bersama oleh semua kalkulator.
        </p>
      </CardContent>
    </Card>
  );
}
