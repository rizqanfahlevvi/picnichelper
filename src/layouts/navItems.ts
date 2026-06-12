// Definisi 7 menu utama (CLAUDE.md). Dipakai sidebar desktop & nav mobile.
export interface NavItem {
  to: string;
  label: string;
  /** Tampil di bottom tab bar mobile (selain ini masuk ke Sheet "Menu") */
  primaryMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', primaryMobile: true },
  { to: '/teori', label: 'Teori' },
  { to: '/skoring', label: 'Skoring' },
  { to: '/kalkulator', label: 'Kalkulator', primaryMobile: true },
  { to: '/drugs-fluids', label: 'Drugs & Fluids', primaryMobile: true },
  { to: '/monitoring', label: 'Monitoring & Weaning' },
  { to: '/referensi', label: 'Referensi' },
];
