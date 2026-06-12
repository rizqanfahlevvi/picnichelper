import { usePatientStore, type PatientCategory } from '../store/patientStore';

const CATEGORIES: { id: PatientCategory; label: string }[] = [
  { id: 'anak',     label: 'Anak (1–12 th)' },
  { id: 'neonatus', label: 'Neonatus (< 1 th)' },
];

export function PatientInput() {
  const { category, ageYears, weightKg, setCategory, setAgeYears, setWeightKg } =
    usePatientStore();

  return (
    <div>
      <div className="ios-segmented" style={{ margin: '0 16px 12px' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            aria-selected={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="ios-card" style={{ padding: '2px 0' }}>
        {category === 'anak' && (
          <PatientField
            label="Usia"
            unit="tahun"
            value={ageYears}
            onChange={setAgeYears}
            placeholder="mis. 5"
            type="number"
            separator
          />
        )}
        <PatientField
          label="Berat Badan"
          unit="kg"
          value={weightKg}
          onChange={setWeightKg}
          placeholder={category === 'neonatus' ? 'mis. 1.5' : 'mis. 15'}
          type="number"
          step="0.1"
        />
      </div>

      <p style={{ padding: '6px 20px 0', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
        Data dipakai bersama oleh semua kalkulator.
      </p>
    </div>
  );
}

function PatientField({
  label, unit, value, onChange, placeholder, type, step, separator,
}: {
  label: string; unit: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; type?: string; step?: string; separator?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', minHeight: 'var(--hit)',
      borderTop: separator ? '0.5px solid var(--separator)' : undefined,
    }}>
      <div style={{ flex: 1 }}>
        <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>
          {label}
        </span>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>
          ({unit})
        </span>
      </div>
      <input
        type={type ?? 'text'}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: 100, textAlign: 'right', borderRadius: 'var(--r-sm)',
          border: 'none', outline: 'none',
          background: 'var(--fill-tertiary)',
          color: 'var(--label-primary)',
          font: 'var(--type-body)',
          padding: '4px 10px', minHeight: 36,
        }}
      />
    </div>
  );
}
