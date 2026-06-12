import type { LucideIcon } from 'lucide-react';
import {
  Home, Calculator, Syringe, BookOpen,
  BarChart2, Activity, BookMarked, MoreHorizontal,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  shortLabel?: string;
  tabLabel?: string;     // label untuk bottom tab bar (max ~10 chars)
  icon: LucideIcon;
  tint: string;           // CSS class: tint-resp / tint-fluid / dst
  primaryMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/',             label: 'Home',           icon: Home,       tint: 'tint-fluid',  primaryMobile: true },
  { to: '/kalkulator',   label: 'Kalkulator',     icon: Calculator, tint: 'tint-resp',   primaryMobile: true },
  { to: '/drugs-fluids', label: 'Drugs & Fluids', shortLabel: 'Drugs & Fluids', tabLabel: 'Drugs', icon: Syringe, tint: 'tint-drug', primaryMobile: true },
  { to: '/teori',        label: 'Teori',          icon: BookOpen,   tint: 'tint-theory' },
  { to: '/skoring',      label: 'Skoring',        icon: BarChart2,  tint: 'tint-score' },
  { to: '/monitoring',   label: 'Monitoring',     icon: Activity,   tint: 'tint-vital' },
  { to: '/referensi',    label: 'Referensi',      icon: BookMarked, tint: 'tint-theory' },
];

export const BOTTOM_PRIMARY = NAV_ITEMS.filter((n) => n.primaryMobile);
export const SHEET_ITEMS    = NAV_ITEMS.filter((n) => !n.primaryMobile);

export { MoreHorizontal as MenuIcon };
