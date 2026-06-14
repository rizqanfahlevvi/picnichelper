import { usePatientStore, type PatientCategory, type AgeUnit, type Gender } from '../store/patientStore';

const CATEGORIES: { id: PatientCategory; label: string }[] = [
  { id: 'anak',     label: 'Anak (≥ 1 th)' },
  { id: 'neonatus', label: 'Neonatus (< 1 th)' },
];

const AGE_UNITS: { id: AgeUnit; label: string }[] = [
  { id: 'tahun',     label: 'Tahun' },
  { id: 'bulan',     label: 'Bulan' },
  { id: 'tgl-lahir', label: 'Tgl Lahir' },
];

function calcAgeYearsFromDate(isoDate: string): string {
  if (!isoDate) return '';
  const birth = new Date(isoDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
  return years >= 0 ? String(years) : '';
}

const inputStyle: React.CSSProperties = {
  width: 120, textAlign: 'right', borderRadius: 'var(--r-sm)',
  border: 'none', outline: 'none',
  background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
  font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
};

function pill(active: boolean): React.CSSProperties {
  return {
    padding: '3px 12px', borderRadius: 'var(--r-pill)', border: 'none',
    cursor: 'pointer', fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap',
    background: active ? 'var(--accent)' : 'var(--fill-secondary)',
    color: active ? '#fff' : 'var(--label-secondary)',
    transition: 'background 180ms, color 180ms',
  };
}

function Row({ label, children, noBorder }: { label: string; children: React.ReactNode; noBorder?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '10px 14px', minHeight: 'var(--hit)',
      borderTop: noBorder ? 'none' : '0.5px solid var(--separator)',
    }}>
      <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  );
}

export function PatientInput() {
  const store = usePatientStore();

  function handleAgeInput(val: string) {
    store.setAgeInput(val);
    if (store.ageUnit === 'tgl-lahir') {
      store.setAgeYears(calcAgeYearsFromDate(val));
    } else if (store.ageUnit === 'tahun') {
      store.setAgeYears(val);
    } else {
      // bulan → konversi ke tahun untuk kalkulator
      const bulan = parseFloat(val);
      store.setAgeYears(isNaN(bulan) ? '' : String(Math.floor(bulan / 12)));
    }
  }

  return (
    <div>
      {/* Kategori */}
      <div className="ios-segmented" style={{ margin: '0 16px 12px' }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} aria-selected={store.category === c.id} onClick={() => store.setCategory(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="ios-card" style={{ padding: '2px 0' }}>
        {/* Nama */}
        <Row label="Nama" noBorder>
          <input
            type="text" value={store.nama}
            onChange={e => store.setNama(e.target.value)}
            placeholder="opsional"
            style={inputStyle}
          />
        </Row>

        {/* Jenis Kelamin */}
        <Row label="Jenis Kelamin">
          <div style={{ display: 'flex', gap: 6 }}>
            {(['L', 'P'] as Gender[]).filter(Boolean).map(g => (
              <button key={g} style={pill(store.gender === g)}
                onClick={() => store.setGender(store.gender === g ? '' : g)}>
                {g === 'L' ? 'Laki-laki' : 'Perempuan'}
              </button>
            ))}
          </div>
        </Row>

        {/* Usia */}
        <Row label="Usia">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {AGE_UNITS.map(u => (
                <button key={u.id} style={{ ...pill(store.ageUnit === u.id), fontSize: 12 }}
                  onClick={() => store.setAgeUnit(u.id)}>
                  {u.label}
                </button>
              ))}
            </div>
            {store.ageUnit === 'tgl-lahir' ? (
              <input
                type="date" value={store.ageInput}
                onChange={e => handleAgeInput(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{ ...inputStyle, width: 150 }}
              />
            ) : (
              <input
                type="number" value={store.ageInput}
                onChange={e => handleAgeInput(e.target.value)}
                placeholder={store.ageUnit === 'tahun' ? 'mis. 5' : 'mis. 18'}
                min="0"
                style={inputStyle}
              />
            )}
          </div>
        </Row>

        {/* Berat Badan */}
        <Row label="Berat Badan (kg)">
          <input
            type="number" value={store.weightKg}
            onChange={e => store.setWeightKg(e.target.value)}
            placeholder={store.category === 'neonatus' ? 'mis. 1.5' : 'mis. 15'}
            min="0" step="0.1"
            style={inputStyle}
          />
        </Row>

        {/* Tinggi Badan */}
        <Row label="Tinggi Badan (cm)">
          <input
            type="number" value={store.heightCm}
            onChange={e => store.setHeightCm(e.target.value)}
            placeholder="mis. 110"
            min="0"
            style={inputStyle}
          />
        </Row>
      </div>

      <p style={{ padding: '6px 20px 0', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
        Data dipakai bersama oleh semua kalkulator.
      </p>
    </div>
  );
}
