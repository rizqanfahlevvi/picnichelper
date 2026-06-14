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

function calcFromDate(isoDate: string): { years: string; months: string; precise: string } {
  if (!isoDate) return { years: '', months: '', precise: '' };
  const birth = new Date(isoDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  if (years < 0) return { years: '', months: '', precise: '' };
  const totalMonths = years * 12 + months;
  const precise = years > 0
    ? (months > 0 ? `${years} th ${months} bln` : `${years} th`)
    : `${totalMonths} bln`;
  return { years: String(years), months: String(totalMonths), precise };
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
      const { years, months, precise } = calcFromDate(val);
      store.setAgeYears(years);
      store.setAgeMonths(months);
      store.setAgePrecise(precise);
    } else if (store.ageUnit === 'tahun') {
      const n = parseFloat(val);
      store.setAgeYears(val);
      store.setAgeMonths(isNaN(n) ? '' : String(Math.round(n * 12)));
      store.setAgePrecise(val ? `${val} th` : '');
    } else {
      // bulan
      const n = parseFloat(val);
      const yrs = isNaN(n) ? '' : String(Math.floor(n / 12));
      store.setAgeYears(yrs);
      store.setAgeMonths(val);
      store.setAgePrecise(val ? `${val} bln` : '');
    }
  }

  return (
    <div>
      <div className="ios-segmented" style={{ margin: '0 16px 12px' }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} aria-selected={store.category === c.id} onClick={() => store.setCategory(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="ios-card" style={{ padding: '2px 0' }}>
        <Row label="Nama" noBorder>
          <input
            type="text" value={store.nama}
            onChange={e => store.setNama(e.target.value)}
            placeholder="opsional"
            style={inputStyle}
          />
        </Row>

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
            {store.agePrecise && store.ageUnit === 'tgl-lahir' && (
              <span style={{ fontSize: 12, color: 'var(--label-tertiary)' }}>
                Usia: {store.agePrecise}
              </span>
            )}
          </div>
        </Row>

        <Row label="Berat Badan (kg)">
          <input
            type="number" value={store.weightKg}
            onChange={e => store.setWeightKg(e.target.value)}
            placeholder={store.category === 'neonatus' ? 'mis. 1.5' : 'mis. 15'}
            min="0" step="0.1"
            style={inputStyle}
          />
        </Row>

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
