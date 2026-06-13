import { useState } from 'react';
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

export function PatientInput() {
  const store = usePatientStore();
  const [editing, setEditing] = useState(false);
  const hasData = store.weightKg !== '' || store.ageYears !== '' || store.heightCm !== '';

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '16px 20px 6px',
      }}>
        <span style={{
          font: 'var(--type-footnote)', textTransform: 'uppercase',
          letterSpacing: '0.04em', fontWeight: 600, color: 'var(--label-secondary)',
        }}>
          Data Pasien
        </span>
        <button
          onClick={() => setEditing((v) => !v)}
          style={{
            font: 'var(--type-footnote)', color: 'var(--accent)', fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px',
          }}
        >
          {editing ? 'Selesai' : (hasData ? 'Ubah' : 'Isi')}
        </button>
      </div>

      {editing ? (
        <EditForm onDone={() => setEditing(false)} />
      ) : (
        <CompactCard onEdit={() => setEditing(true)} />
      )}

      <p style={{ padding: '6px 20px 0', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
        Data dipakai bersama oleh semua kalkulator.
      </p>
    </div>
  );
}

/* ── Compact display card ─────────────────────────────────────────────── */
function CompactCard({ onEdit }: { onEdit: () => void }) {
  const { ageYears, ageUnit, ageInput, weightKg, heightCm, nama, gender } = usePatientStore();
  const hasData = weightKg !== '' || ageYears !== '' || heightCm !== '';

  const ageDisplay = ageYears !== ''
    ? { val: ageUnit === 'bulan' ? ageInput : ageYears, unit: ageUnit === 'bulan' ? 'bln' : 'th' }
    : null;

  if (!hasData) {
    return (
      <div
        onClick={onEdit}
        style={{
          margin: '0 16px', padding: '13px 16px', borderRadius: 'var(--r-card)',
          background: 'var(--bg-tertiary)', boxShadow: 'var(--shadow-1)',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }}
      >
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
          ⚠ Belum ada data pasien — ketuk untuk mengisi
        </span>
      </div>
    );
  }

  return (
    <div style={{ margin: '0 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--r-card)', overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
      {(nama || gender) && (
        <div style={{ padding: '8px 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          {nama && <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)' }}>{nama}</span>}
          {gender && (
            <span style={{
              font: 'var(--type-caption-2)', fontWeight: 600,
              padding: '2px 8px', borderRadius: 'var(--r-pill)',
              background: gender === 'L' ? 'rgba(0,122,255,0.12)' : 'rgba(255,45,85,0.12)',
              color: gender === 'L' ? 'var(--sys-blue)' : 'var(--sys-pink)',
            }}>
              {gender === 'L' ? 'Laki-laki' : 'Perempuan'}
            </span>
          )}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <DataCell val={ageDisplay?.val ?? ''} unit={ageDisplay?.unit ?? 'th'} label="Usia" borderRight />
        <DataCell val={weightKg} unit="kg" label="Berat" borderRight />
        <DataCell val={heightCm} unit="cm" label="Tinggi" />
      </div>
    </div>
  );
}

function DataCell({ val, unit, label, borderRight }: { val: string; unit: string; label: string; borderRight?: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '11px 8px 12px',
      borderRight: borderRight ? '0.5px solid var(--separator)' : 'none',
    }}>
      {val ? (
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--label-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {val}
        </span>
      ) : (
        <span style={{ fontSize: 22, fontWeight: 300, color: 'var(--label-tertiary)', lineHeight: 1 }}>—</span>
      )}
      <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 3 }}>
        {label}{val ? ` · ${unit}` : ''}
      </span>
    </div>
  );
}

/* ── Edit form ────────────────────────────────────────────────────────── */
function EditForm({ onDone: _onDone }: { onDone: () => void }) {
  const store = usePatientStore();

  return (
    <div style={{ margin: '0 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--r-card)', overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
      <FieldRow label="Nama">
        <input
          type="text"
          value={store.nama}
          onChange={e => store.setNama(e.target.value)}
          placeholder="opsional"
          style={inputStyle}
        />
      </FieldRow>

      <FieldRow label="Jenis Kelamin">
        <div style={{ display: 'flex', gap: 6 }}>
          {(['L', 'P'] as Gender[]).map((g) => (
            <PillBtn key={g} active={store.gender === g} onClick={() => store.setGender(store.gender === g ? '' : g)}>
              {g === 'L' ? 'Laki-laki' : 'Perempuan'}
            </PillBtn>
          ))}
        </div>
      </FieldRow>

      <FieldRow label="Usia">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {AGE_UNITS.map((u) => (
              <PillBtn key={u.id} active={store.ageUnit === u.id} onClick={() => store.setAgeUnit(u.id)} small>
                {u.label}
              </PillBtn>
            ))}
          </div>
          {store.ageUnit === 'tgl-lahir' ? (
            <input
              type="date"
              value={store.ageInput}
              onChange={e => store.setAgeInput(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{ ...inputStyle, width: 140 }}
            />
          ) : (
            <input
              type="number"
              value={store.ageInput}
              onChange={e => store.setAgeInput(e.target.value)}
              placeholder={store.ageUnit === 'tahun' ? 'mis. 5' : 'mis. 18'}
              min="0"
              style={inputStyle}
            />
          )}
        </div>
      </FieldRow>

      <FieldRow label="Kategori">
        <div style={{ display: 'flex', gap: 6 }}>
          {CATEGORIES.map((c) => (
            <PillBtn key={c.id} active={store.category === c.id} onClick={() => store.setCategory(c.id)} small>
              {c.label}
            </PillBtn>
          ))}
        </div>
      </FieldRow>

      <FieldRow label="Berat Badan" sublabel="kg">
        <input
          type="number"
          value={store.weightKg}
          onChange={e => store.setWeightKg(e.target.value)}
          placeholder={store.category === 'neonatus' ? 'mis. 1.5' : 'mis. 15'}
          min="0" step="0.1"
          style={inputStyle}
        />
      </FieldRow>

      <FieldRow label="Tinggi Badan" sublabel="cm" last>
        <input
          type="number"
          value={store.heightCm}
          onChange={e => store.setHeightCm(e.target.value)}
          placeholder="mis. 110"
          min="0"
          style={inputStyle}
        />
      </FieldRow>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: 100, textAlign: 'right', borderRadius: 'var(--r-sm)',
  border: 'none', outline: 'none',
  background: 'var(--fill-tertiary)',
  color: 'var(--label-primary)',
  font: 'var(--type-body)',
  padding: '4px 10px', minHeight: 36,
};

function FieldRow({ label, sublabel, children, last }: {
  label: string; sublabel?: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '10px 14px', minHeight: 'var(--hit)',
      borderBottom: last ? 'none' : '0.5px solid var(--separator)',
    }}>
      <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flexShrink: 0 }}>
        {label}
        {sublabel && <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>({sublabel})</span>}
      </span>
      {children}
    </div>
  );
}

function PillBtn({ active, onClick, children, small }: { active: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? '3px 10px' : '4px 14px',
        borderRadius: 'var(--r-pill)',
        border: 'none', cursor: 'pointer',
        fontWeight: 500, fontSize: small ? 12 : 13,
        background: active ? 'var(--accent)' : 'var(--fill-secondary)',
        color: active ? '#fff' : 'var(--label-secondary)',
        transition: 'background 180ms, color 180ms',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
