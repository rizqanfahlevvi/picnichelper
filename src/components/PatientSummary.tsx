import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { PatientInput } from './PatientInput';
import { usePatientStore } from '../store/patientStore';

export function PatientSummary() {
  const { nama, gender, ageUnit, ageInput, ageYears, weightKg, heightCm } = usePatientStore();
  const [open, setOpen] = useState(false);

  const hasPatient = weightKg !== '' || ageInput !== '' || ageYears !== '';
  const ageDisplay = ageUnit === 'bulan' ? ageInput : ageYears;
  const ageUnitDisplay = ageUnit === 'bulan' ? 'bln' : 'th';

  return (
    <>
      <div className="ios-section">
        <span className="label">Pasien Aktif</span>
        <button className="action" onClick={() => setOpen(true)}>{hasPatient ? 'Ubah' : 'Isi'}</button>
      </div>

      <button
        className="ios-list w-full text-left"
        style={{ display: 'block' }}
        onClick={() => setOpen(true)}
      >
        {hasPatient ? (
          <div>
            {(nama || gender) && (
              <div style={{ padding: '8px 14px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {nama && (
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--label-primary)' }}>{nama}</span>
                )}
                {gender && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-pill)',
                    background: gender === 'L' ? 'rgba(0,122,255,0.12)' : 'rgba(255,45,85,0.12)',
                    color: gender === 'L' ? 'var(--sys-blue)' : 'var(--sys-pink)',
                  }}>
                    {gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                )}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              <DataCell val={ageDisplay}  unit={ageUnitDisplay} label="Usia"   borderRight />
              <DataCell val={weightKg}    unit="kg"             label="Berat"  borderRight />
              <DataCell val={heightCm}    unit="cm"             label="Tinggi" />
            </div>
          </div>
        ) : (
          <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span className="ios-footnote">Belum ada data pasien — ketuk untuk mengisi</span>
          </div>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <SheetHeader><SheetTitle>Data Pasien</SheetTitle></SheetHeader>
          <div style={{ padding: '8px 0 32px' }}>
            <PatientInput />
            <div style={{ padding: '12px 16px 0' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: '100%', minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  font: 'var(--type-body)', fontWeight: 600,
                }}
              >Simpan</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function DataCell({ val, unit, label, borderRight }: {
  val: string; unit: string; label: string; borderRight?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '11px 8px 12px',
      borderRight: borderRight ? '0.5px solid var(--separator)' : 'none',
    }}>
      {val ? (
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--label-primary)', lineHeight: 1 }}>{val}</span>
      ) : (
        <span style={{ fontSize: 22, fontWeight: 300, color: 'var(--label-tertiary)', lineHeight: 1 }}>—</span>
      )}
      <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 3 }}>
        {label}{val ? ` · ${unit}` : ''}
      </span>
    </div>
  );
}
