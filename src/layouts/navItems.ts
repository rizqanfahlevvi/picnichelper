import type { LucideIcon } from 'lucide-react';
import {
  Home, Calculator, Syringe, BookOpen,
  BarChart2, Activity, BookMarked, MoreHorizontal,
  Wind, Zap, Droplets, FlaskConical, Beaker, HeartPulse, TestTube2, Scale,
} from 'lucide-react';

export interface SubNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface NavItem {
  to: string;
  label: string;
  shortLabel?: string;
  tabLabel?: string;     // label untuk bottom tab bar (max ~10 chars)
  icon: LucideIcon;
  tint: string;           // CSS class: tint-resp / tint-fluid / dst
  primaryMobile?: boolean;
  subItems?: SubNavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/',             label: 'Home',           icon: Home,       tint: 'tint-fluid',  primaryMobile: true },
  {
    to: '/kalkulator',
    label: 'Kalkulator',
    icon: Calculator,
    tint: 'tint-resp',
    primaryMobile: true,
    subItems: [
      { id: 'ett',        label: 'ETT & Intubasi',     icon: Wind },
      { id: 'dosis',      label: 'Dosis Emergensi',    icon: Zap },
      { id: 'syringe',    label: 'Syringe Pump',       icon: Droplets },
      { id: 'agd',        label: 'Analisis Gas Darah', icon: FlaskConical },
      { id: 'elektrolit', label: 'Elektrolit',          icon: Beaker },
      { id: 'bp',         label: 'Tekanan Darah',       icon: HeartPulse },
      { id: 'renal',      label: 'Kalkulator Renal',    icon: TestTube2 },
      { id: 'gizi',       label: 'Status Gizi',         icon: Scale },
    ],
  },
  { to: '/drugs-fluids', label: 'Drugs & Fluids', shortLabel: 'Drugs & Fluids', tabLabel: 'D & F', icon: Syringe, tint: 'tint-drug', primaryMobile: true },
  { to: '/skoring',      label: 'Skoring',        icon: BarChart2,  tint: 'tint-score',  primaryMobile: true },
  { to: '/teori',        label: 'Teori',          icon: BookOpen,   tint: 'tint-theory' },
  { to: '/monitoring',   label: 'Ventilasi',      icon: Activity,   tint: 'tint-vital' },
  { to: '/referensi',    label: 'Referensi',      icon: BookMarked, tint: 'tint-theory' },
];

export const BOTTOM_PRIMARY = NAV_ITEMS.filter((n) => n.primaryMobile);
export const SHEET_ITEMS    = NAV_ITEMS.filter((n) => !n.primaryMobile);

export { MoreHorizontal as MenuIcon };
