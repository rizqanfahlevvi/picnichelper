import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Calculator, Droplets, Pill, BarChart2, BookOpen,
         Activity, BookMarked, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { usePatientStore } from '../store/patientStore';

// ── Akses Cepat ──────────────────────────────────────────────────────────
const QUICK_ACCESS = [
  { to: '/kalkulator', icon: Calculator, tint: 'tint-resp',  label: 'Kalkulator ETT',    sub: 'Ukuran & kedalaman tube' },
  { to: '/drugs-fluids', icon: Droplets, tint: 'tint-fluid', label: 'Cairan Rumatan',    sub: 'Holliday-Segar 4-2-1'    },
  { to: '/kalkulator', icon: Pill,       tint: 'tint-drug',  label: 'Obat Emergensi',    sub: 'PALS 2020 — per BB'       },
];

// ── Semua modul ──────────────────────────────────────────────────────────
const MODULES = [
  { to: '/teori',       icon: BookOpen,   tint: 'tint-theory', label: 'Teori & Klinis',       sub: 'Sepsis · Syok · Ventilasi' },
  { to: '/skoring',     icon: BarChart2,  tint: 'tint-score',  label: 'Skoring Klinis',        sub: 'Downes · PELOD-2 · pSOFA · CRIB-II' },
  { to: '/monitoring',  icon: Activity,   tint: 'tint-vital',  label: 'Monitoring & Weaning',  sub: 'Tanda vital · Checklist' },
  { to: '/referensi',   icon: BookMarked, tint: 'tint-theory', label: 'Referensi',             sub: 'Daftar pustaka & sitasi' },
];

export function Home() {
  const { category, ageYears, weightKg, setCategory, setAgeYears, setWeightKg, reset } = usePatientStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasPatient = ageYears !== '' || weightKg !== '';

  return (
    <div className="ios-screen pb-6">

      {/* Large title */}
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">PICNIC Helper</h1>
        <p className="ios-subhead" style={{ marginTop: 4 }}>Pediatric ER &amp; Intensive Care Companion</p>
      </div>

      {/* ── Pasien Aktif ─────────────────────────────────────────────── */}
      <div className="ios-section"><span className="label">Pasien Aktif</span>
        <button className="action" onClick={() => setSheetOpen(true)}>Ubah</button>
      </div>

      <button
        className="ios-list w-full text-left"
        style={{ display: 'block' }}
        onClick={() => setSheetOpen(true)}
      >
        {hasPatient ? (
          <div style={{ display: 'flex', padding: '12px 14px', gap: 0 }}>
            <StatCol label="Kategori" value={category === 'neonatus' ? 'Neonatus' : 'Anak'} unit="" />
            <div style={{ width: '0.5px', background: 'var(--separator)', margin: '0 4px' }} />
            <StatCol
              label={category === 'neonatus' ? 'Berat' : 'Usia'}
              value={category === 'neonatus' ? (weightKg || '—') : (ageYears || '—')}
              unit={category === 'neonatus' ? 'kg' : 'th'}
            />
            <div style={{ width: '0.5px', background: 'var(--separator)', margin: '0 4px' }} />
            <StatCol label="Berat" value={weightKg || '—'} unit="kg" />
          </div>
        ) : (
          <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span className="ios-footnote">Belum ada data pasien — ketuk untuk mengisi</span>
          </div>
        )}
      </button>

      {/* ── Akses Cepat ──────────────────────────────────────────────── */}
      <div className="ios-section"><span className="label">Akses Cepat</span></div>
      <div className="ios-list">
        {QUICK_ACCESS.map((item, i) => (
          <NavLink key={i} to={item.to} className={`ios-row ${item.tint}`}>
            <span className="ios-row-icon">
              <item.icon size={18} strokeWidth={1.75} color="#fff" />
            </span>
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
            <span className="ios-row-icon">
              <item.icon size={18} strokeWidth={1.75} color="#fff" />
            </span>
            <span className="ios-row-text">
              <span className="ios-row-label">{item.label}</span>
              <span className="ios-row-sub">{item.sub}</span>
            </span>
            <ChevronRight size={16} className="ios-chevron" />
          </NavLink>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="ios-disclaimer" style={{ marginTop: 24 }}>
        <AlertTriangle size={12} />
        <span>Untuk panduan klinis · bukan pengganti penilaian klinis profesional</span>
      </div>

      {/* ── Sheet editor pasien ──────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Data Pasien</SheetTitle>
          </SheetHeader>
          <div style={{ padding: '8px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Kategori */}
            <div>
              <label className="ios-footnote" style={{ display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Kategori</label>
              <div className="ios-segmented">
                <button aria-selected={category === 'anak'} onClick={() => setCategory('anak')}>Anak</button>
                <button aria-selected={category === 'neonatus'} onClick={() => setCategory('neonatus')}>Neonatus</button>
              </div>
            </div>

            {/* Usia */}
            {category === 'anak' && (
              <PatientField
                label="Usia"
                unit="tahun"
                value={ageYears}
                onChange={setAgeYears}
                placeholder="mis. 5"
                type="number"
              />
            )}

            {/* Berat */}
            <PatientField
              label="Berat Badan"
              unit="kg"
              value={weightKg}
              onChange={setWeightKg}
              placeholder={category === 'neonatus' ? 'mis. 1.5' : 'mis. 15'}
              type="number"
              step="0.1"
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { reset(); setSheetOpen(false); }}
                style={{
                  flex: 1, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
                  background: 'color-mix(in srgb, var(--danger) 12%, transparent)',
                  color: 'var(--danger)', border: 'none', cursor: 'pointer',
                  font: 'var(--type-body)', fontWeight: 600,
                }}
              >
                Reset
              </button>
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  flex: 2, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  font: 'var(--type-body)', fontWeight: 600,
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatCol({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div style={{ flex: 1, padding: '4px 10px', textAlign: 'center' }}>
      <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.01em', lineHeight: 1 }}>
        {value}
        {unit && value !== '—' && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--label-secondary)', marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  );
}

function PatientField({ label, unit, value, onChange, placeholder, type, step }: {
  label: string; unit: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; type?: string; step?: string;
}) {
  return (
    <div>
      <label className="ios-footnote" style={{ display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
        {label} <span style={{ color: 'var(--label-tertiary)', textTransform: 'none', letterSpacing: 0 }}>({unit})</span>
      </label>
      <input
        type={type ?? 'text'}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
          border: '0.5px solid var(--separator)',
          background: 'var(--fill-tertiary)',
          color: 'var(--label-primary)',
          padding: '0 14px', boxSizing: 'border-box',
          font: 'var(--type-body)',
          outline: 'none',
        }}
      />
    </div>
  );
}
