import type { LucideIcon } from 'lucide-react';
import {
  Home, Calculator, Syringe, BookOpen,
  BarChart2, Activity, BookMarked, Layers,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Tampil di bottom tab bar mobile. Sisa masuk Sheet "Menu". */
  primaryMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/',              label: 'Home',               icon: Home,        primaryMobile: true  },
  { to: '/kalkulator',    label: 'Kalkulator',          icon: Calculator,  primaryMobile: true  },
  { to: '/drugs-fluids',  label: 'Drugs & Fluids',      icon: Syringe,     primaryMobile: true  },
  { to: '/teori',         label: 'Teori',               icon: BookOpen                          },
  { to: '/skoring',       label: 'Skoring',             icon: BarChart2                         },
  { to: '/monitoring',    label: 'Monitoring & Weaning', icon: Activity                         },
  { to: '/referensi',     label: 'Referensi',           icon: BookMarked                        },
];

export const BOTTOM_PRIMARY = NAV_ITEMS.filter((n) => n.primaryMobile);
export const SHEET_ITEMS    = NAV_ITEMS.filter((n) => !n.primaryMobile);

/** Ikon khusus tombol "Menu" di bottom bar */
export { Layers as MenuIcon };
