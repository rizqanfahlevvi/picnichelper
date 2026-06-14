import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Calculator, Droplets, Pill, BarChart2, BookOpen,
         Activity, BookMarked, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { PatientInput } from '../components/PatientInput';
import { usePatientStore } from '../store/patientStore';

const QUICK_ACCESS = [
  { to: '/kalkulator',   icon: Calculator, tint: 'tint-resp',  label: 'Kalkulator ETT',  sub: 'Ukuran & kedalaman tube' },
  { to: '/drugs-fluids', icon: Droplets,   tint: 'tint-fluid', label: 'Cairan Rumatan',  sub: 'Holliday-Segar 4-2-1'    },
  { to: '/kalkulator',   icon: Pill,       tint: 'tint-drug',  label: 'Obat Emergensi',  sub: 'PALS 2020 — per BB'       },
];

const MODULES = [
  { to: '/teori',      icon: BookOpen,   tint: 'tint-theory', label: 'Teori & Klinis',      sub: 'Sepsis · Syok · Ventilasi' },
  { to: '/skoring',    icon: BarChart2,  tint: 'tint-score',  label: 'Skoring Klinis',       sub: 'Downes · PELOD-2 · pSOFA · CRIB-II' },
  { to: '/monitoring', icon: Activity,   tint: 'tint-vital',  label: 'Monitoring & Weaning', sub: 'Tanda vital · Checklist' },
  { to: '/referensi',  icon: BookMarked, tint: 'tint-theory', label: 'Referensi',            sub: 'Daftar pustaka & sitasi' },
];

export function Home() {
  const { ageYears, weightKg, heightCm } = usePatientStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasPatient = ageYears !== '' || weightKg !== '' || heightCm !== '';

  return (
    <div className="ios-screen pb-6">

      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">PICNIC Helper</h1>
        <p className="ios-subhead" style={{ marginTop: 4 }}>Pediatric ER &amp; Intensive Care Companion</p>
      </div>

      {/* ── Pasien Aktif ─────────────────────────────────────────────── */}
      <div className="ios-section">
        <span className="label">Pasien Aktif</span>
        <button className="action" onClick={() => setSheetOpen(true)}>{hasPatient ? 'Ubah' : 'Isi'}</button>
      </div>

      <button
        className="ios-list w-full text-left"
        style={{ display: 'block' }}
        onClick={() => setSheetOpen(true)}
      >
        {hasPatient ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            <DataCell val={ageYears} unit="th"  label="Usia"   borderRight />
            <DataCell val={weightKg} unit="kg"  label="Berat"  borderRight />
            <DataCell val={heightCm} unit="cm"  label="Tinggi" />
          </div>
        ) : (
          <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span className="ios-footnote">Belum ada data pasien — ketuk untuk mengisi</span>
          </div>
        )}
      </button>
      <p className="ios-caption" style={{ padding: '4px 20px 0', color: 'var(--label-tertiary)' }}>
        Data dipakai bersama oleh semua kalkulator.
      </p>

      {/* ── Akses Cepat ──────────────────────────────────────────────── */}
      <div className="ios-section"><span className="label">Akses Cepat</span></div>
      <div className="ios-list">
        {QUICK_ACCESS.map((item, i) => (
          <NavLink key={i} to={item.to} className={`ios-row ${item.tint}`}>
            <span className="ios-row-icon"><item.icon size={18} strokeWidth={1.75} color="#fff" /></span>
            <span className="ios-row-text">
              <span className="ios-row-label">{item.label}</span>
              <span className="ios-row-sub">{item.sub}</span>
            </span>
            <ChevronRight size={16} className="ios-chevron" />
          </NavLink>
        ))}
      </div>

      {/* ── Modul ────────────────────────────────────────────────────── */}
      <div className="ios-section"><span className="label">Modul</span></div>
      <div className="ios-list">
        {MODULES.map((item) => (
          <NavLink key={item.to} to={item.to} className={`ios-row ${item.tint}`}>
            <span className="ios-row-icon"><item.icon size={18} strokeWidth={1.75} color="#fff" /></span>
            <span className="ios-row-text">
              <span className="ios-row-label">{item.label}</span>
              <span className="ios-row-sub">{item.sub}</span>
            </span>
            <ChevronRight size={16} className="ios-chevron" />
          </NavLink>
        ))}
      </div>

      <div className="ios-disclaimer" style={{ marginTop: 24 }}>
        <AlertTriangle size={12} />
        <span>Untuk panduan klinis · bukan pengganti penilaian klinis profesional</span>
      </div>

      {/* ── Sheet input pasien ───────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom">
          <SheetHeader><SheetTitle>Data Pasien</SheetTitle></SheetHeader>
          <div style={{ padding: '8px 0 32px' }}>
            <PatientInput />
            <div style={{ padding: '12px 16px 0' }}>
              <button
                onClick={() => setSheetOpen(false)}
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
    </div>
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
