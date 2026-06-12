// ─────────────────────────────────────────────────────────────────────────
// Downes Score — penilaian distres napas neonatus [6]
// Downes JJ, et al. Clin Pediatr 1970;9(6):325-331.
// ─────────────────────────────────────────────────────────────────────────

export type DownesParam =
  | 'respiratoryRate'   // 0–2
  | 'retractions'       // 0–2
  | 'cyanosis'          // 0–2
  | 'airEntry'          // 0–2
  | 'grunting';         // 0–2

export interface DownesInput {
  respiratoryRate: 0 | 1 | 2;
  retractions:     0 | 1 | 2;
  cyanosis:        0 | 1 | 2;
  airEntry:        0 | 1 | 2;
  grunting:        0 | 1 | 2;
}

export interface DownesResult {
  total: number;
  severity: 'ringan' | 'sedang' | 'berat';
  interpretation: string;
}

export const DOWNES_OPTIONS: Record<DownesParam, { score: 0 | 1 | 2; label: string }[]> = {
  respiratoryRate: [
    { score: 0, label: '< 60 × /mnt' },
    { score: 1, label: '60–80 × /mnt' },
    { score: 2, label: '> 80 × /mnt' },
  ],
  retractions: [
    { score: 0, label: 'Tidak ada' },
    { score: 1, label: 'Ringan (subkostal / interkostal)' },
    { score: 2, label: 'Berat (retraksi dalam + sternum)' },
  ],
  cyanosis: [
    { score: 0, label: 'Tidak ada' },
    { score: 1, label: 'Membaik dengan O₂' },
    { score: 2, label: 'Persisten dengan O₂' },
  ],
  airEntry: [
    { score: 0, label: 'Bersih bilateral' },
    { score: 1, label: 'Berkurang / kanan-kiri beda' },
    { score: 2, label: 'Hampir tidak terdengar' },
  ],
  grunting: [
    { score: 0, label: 'Tidak ada' },
    { score: 1, label: 'Terdengar dengan stetoskop' },
    { score: 2, label: 'Terdengar tanpa stetoskop' },
  ],
};

export const DOWNES_PARAM_LABELS: Record<DownesParam, string> = {
  respiratoryRate: 'Laju Napas',
  retractions:     'Retraksi',
  cyanosis:        'Sianosis',
  airEntry:        'Suara Napas',
  grunting:        'Merintih',
};

export function calculateDownes(input: DownesInput): DownesResult {
  const values = Object.values(input) as number[];
  for (const v of values) {
    if (![0, 1, 2].includes(v)) throw new Error('Downes: skor tiap parameter harus 0, 1, atau 2');
  }

  const total =
    input.respiratoryRate +
    input.retractions +
    input.cyanosis +
    input.airEntry +
    input.grunting;

  if (total <= 2) {
    return { total, severity: 'ringan', interpretation: 'Distres napas ringan — observasi ketat' };
  }
  if (total <= 5) {
    return { total, severity: 'sedang', interpretation: 'Distres napas sedang — pertimbangkan CPAP / dukungan O₂' };
  }
  return { total, severity: 'berat', interpretation: 'Distres napas berat — pertimbangkan intubasi segera' };
}
