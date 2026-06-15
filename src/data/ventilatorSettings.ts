// Setting awal ventilator mekanik pediatri per kondisi klinis
// Referensi: PALICC-2 2023 [26], PALICC 2015 [47], PALS 2020 [1], Newth 2009 [48]

export type KondisiVentilator =
  | 'normal'
  | 'rds'
  | 'asma'
  | 'hie'
  | 'neonate_prematur'
  | 'neonate_aterm';

export interface VentilatorSetting {
  tvMin: number;          // mL/kg
  tvMax: number;          // mL/kg
  rrMin: number;          // ×/mnt
  rrMax: number;          // ×/mnt
  peepMin: number;        // cmH₂O
  peepMax: number;        // cmH₂O
  fio2Label: string;
  ie: string;             // I:E ratio string
  mode: string;
  notes: string;
}

export const KONDISI_OPTIONS: { id: KondisiVentilator; label: string; desc: string }[] = [
  { id: 'normal',           label: 'Normal / Post-op',       desc: 'Induksi elektif, paru sehat' },
  { id: 'rds',              label: 'RDS / ARDS',             desc: 'Sindrom distres napas akut (PALICC-2)' },
  { id: 'asma',             label: 'Asma / Bronkospasme',    desc: 'Obstruksi jalan napas bawah' },
  { id: 'hie',              label: 'HIE',                    desc: 'Hypoxic Ischemic Encephalopathy' },
  { id: 'neonate_prematur', label: 'Neonatus Prematur',      desc: 'Usia gestasi < 37 minggu' },
  { id: 'neonate_aterm',    label: 'Neonatus Aterm',         desc: 'Usia gestasi ≥ 37 minggu' },
];

export const VENTILATOR_SETTINGS: Record<KondisiVentilator, VentilatorSetting> = {
  normal:           { tvMin: 6, tvMax: 8, rrMin: 15, rrMax: 25, peepMin: 4, peepMax: 5,  fio2Label: '0.4–0.5',      ie: '1:2',     mode: 'VCV atau PCV',   notes: 'Titrasi FiO₂ untuk SpO₂ ≥ 95%' },
  rds:              { tvMin: 4, tvMax: 6, rrMin: 25, rrMax: 40, peepMin: 6, peepMax: 10, fio2Label: '0.6–1.0',      ie: '1:1.5–2', mode: 'PCV atau HFO',   notes: 'Lung protective: TV rendah, PEEP tinggi. Titrate FiO₂ untuk SpO₂ 91–95% [47]' },
  asma:             { tvMin: 6, tvMax: 8, rrMin: 10, rrMax: 16, peepMin: 3, peepMax: 5,  fio2Label: '0.4–0.6',      ie: '1:3–4',   mode: 'VCV',            notes: 'I:E panjang untuk ekspirasi penuh, hindari air-trapping. RR rendah.' },
  hie:              { tvMin: 5, tvMax: 7, rrMin: 30, rrMax: 50, peepMin: 4, peepMax: 5,  fio2Label: '0.21–0.4',     ie: '1:2',     mode: 'VCV atau PCV',   notes: 'Normokarbik (PaCO₂ 35–45). Hindari hiperventilasi. FiO₂ serendah mungkin.' },
  neonate_prematur: { tvMin: 4, tvMax: 5, rrMin: 40, rrMax: 60, peepMin: 4, peepMax: 6,  fio2Label: '0.21–titrate', ie: '1:1.5–2', mode: 'PCV atau HFO',   notes: 'Target SpO₂ 91–95%. Gunakan surfaktan sesuai indikasi [48].' },
  neonate_aterm:    { tvMin: 4, tvMax: 6, rrMin: 30, rrMax: 50, peepMin: 4, peepMax: 5,  fio2Label: '0.21–0.4',     ie: '1:1.5–2', mode: 'PCV',            notes: 'Normokarbik. FiO₂ terendah efektif.' },
};

/** Hitung inspiratory time (Ti) dari RR dan I:E ratio string, misal "1:2" atau "1:1.5–2". */
export function calcTi(rr: number, ie: string): string {
  const match = ie.match(/1:([\d.]+)/);
  if (!match || rr <= 0) return '—';
  const ratio = parseFloat(match[1]);
  const ti = 60 / rr / (1 + ratio);
  return ti.toFixed(2) + ' s';
}
