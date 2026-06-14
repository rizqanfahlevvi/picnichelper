import { NavLink } from 'react-router-dom';
import { ChevronRight, Calculator, Droplets, Pill, BarChart2, BookOpen,
         Activity, BookMarked, AlertTriangle } from 'lucide-react';
import { PatientSummary } from '../components/PatientSummary';

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
  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">PICNIC Helper</h1>
        <p className="ios-subhead" style={{ marginTop: 4 }}>Pediatric ER &amp; Intensive Care Companion</p>
      </div>

      <PatientSummary />

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
    </div>
  );
}
