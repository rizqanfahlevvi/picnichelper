import React, { useState } from 'react';
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
  const { ageYears, ageInput, ageUnit, weightKg, heightCm, nama, gender, reset } = usePatientStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasPatient = ageYears !== '' || weightKg !== '' || heightCm !== '';

  return (
    <div className="ios-screen pb-6">

      {/* Large title */}
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">PICNIC Helper</h1>
        <p className="ios-subhead" style={{ marginTop: 4 }}>Pediatric ER &amp; Intensive Care Companion</p>
      </div>

      {/* ── Pasien Aktif ─────────────────────────────────────────────── */}
      <div className="ios-section"><span className="label">Pasien Aktif</span>
        <button className="action" onClick={() => setSheetOpen(true)}>{hasPatient ? 'Ubah' : 'Isi'}</button>
      </div>

      <button
        className="ios-list w-full text-left"
        style={{ display: 'block' }}
        onClick={() => setSheetOpen(true)}
      >
        {hasPatient ? (
          <div>
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
              <HomeDataCell val={ageUnit === 'bulan' ? ageInput : ageYears} unit={ageUnit === 'bulan' ? 'bln' : 'th'} label="Usia" borderRight />
              <HomeDataCell val={weightKg} unit="kg" label="Berat" borderRight />
              <HomeDataCell val={heightCm} unit="cm" label="Tinggi" />
            </div>
          </div>
        ) : (
          <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span className="ios-footnote">Belum ada data pasien — ketuk untuk mengisi</span>
          </div>
        )}
      </button>
      <p className="ios-caption" style={{ padding: '4px 20px 0', color: 'var(--label-tertiary)' }}>
        Single source of truth · dibaca seluruh modul
      </p>

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
          <SheetHeader><SheetTitle>Data Pasien</SheetTitle></SheetHeader>
          <div style={{ padding: '8px 16px 32px' }}>
            <PatientInputInSheet onClose={() => setSheetOpen(false)} onReset={() => { reset(); setSheetOpen(false); }} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function HomeDataCell({ val, unit, label, borderRight }: { val: string; unit: string; label: string; borderRight?: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '11px 8px 12px',
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

function PatientInputInSheet({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  const store = usePatientStore();
  const AGE_UNITS = [
    { id: 'tahun' as const, label: 'Tahun' },
    { id: 'bulan' as const, label: 'Bulan' },
    { id: 'tgl-lahir' as const, label: 'Tgl Lahir' },
  ];
  const inputStyle: React.CSSProperties = {
    width: 110, textAlign: 'right', borderRadius: 'var(--r-sm)',
    border: 'none', outline: 'none',
    background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
    font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
  };
  const pill = (active: boolean) => ({
    padding: '3px 12px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer' as const,
    fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' as const,
    background: active ? 'var(--accent)' : 'var(--fill-secondary)',
    color: active ? '#fff' : 'var(--label-secondary)',
    transition: 'background 180ms, color 180ms',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--r-card)', overflow: 'hidden', boxShadow: 'var(--shadow-1)', marginBottom: 12 }}>
        {[
          { label: 'Nama', node: <input type="text" value={store.nama} onChange={e => store.setNama(e.target.value)} placeholder="opsional" style={inputStyle} /> },
        ].map(({ label, node }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)', borderBottom: '0.5px solid var(--separator)' }}>
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{label}</span>
            {node}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)', borderBottom: '0.5px solid var(--separator)' }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>Jenis Kelamin</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['L', 'P'] as const).map(g => (
              <button key={g} style={pill(store.gender === g)} onClick={() => store.setGender(store.gender === g ? '' : g)}>
                {g === 'L' ? 'Laki-laki' : 'Perempuan'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)', borderBottom: '0.5px solid var(--separator)' }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>Usia</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {AGE_UNITS.map(u => <button key={u.id} style={{ ...pill(store.ageUnit === u.id), fontSize: 12 }} onClick={() => store.setAgeUnit(u.id)}>{u.label}</button>)}
            </div>
            {store.ageUnit === 'tgl-lahir'
              ? <input type="date" value={store.ageInput} onChange={e => store.setAgeInput(e.target.value)} max={new Date().toISOString().split('T')[0]} style={{ ...inputStyle, width: 140 }} />
              : <input type="number" value={store.ageInput} onChange={e => store.setAgeInput(e.target.value)} placeholder={store.ageUnit === 'tahun' ? 'mis. 5' : 'mis. 18'} min="0" style={inputStyle} />
            }
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)', borderBottom: '0.5px solid var(--separator)' }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>Kategori</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: 'anak' as const, label: 'Anak (≥ 1th)' }, { id: 'neonatus' as const, label: 'Neonatus' }].map(c => (
              <button key={c.id} style={{ ...pill(store.category === c.id), fontSize: 12 }} onClick={() => store.setCategory(c.id)}>{c.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)', borderBottom: '0.5px solid var(--separator)' }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>Berat Badan <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>(kg)</span></span>
          <input type="number" value={store.weightKg} onChange={e => store.setWeightKg(e.target.value)} placeholder={store.category === 'neonatus' ? 'mis. 1.5' : 'mis. 15'} min="0" step="0.1" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)' }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>Tinggi Badan <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>(cm)</span></span>
          <input type="number" value={store.heightCm} onChange={e => store.setHeightCm(e.target.value)} placeholder="mis. 110" min="0" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onReset} style={{ flex: 1, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)', background: 'color-mix(in srgb, var(--danger) 12%, transparent)', color: 'var(--danger)', border: 'none', cursor: 'pointer', font: 'var(--type-body)', fontWeight: 600 }}>Reset</button>
        <button onClick={onClose} style={{ flex: 2, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', font: 'var(--type-body)', fontWeight: 600 }}>Simpan</button>
      </div>
    </div>
  );
}
