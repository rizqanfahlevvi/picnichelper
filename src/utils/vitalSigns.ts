// ─────────────────────────────────────────────────────────────────────────
// Tanda vital normal pediatri berdasarkan kelompok usia [1]
// PALS 2020 — AHA Guidelines
// ─────────────────────────────────────────────────────────────────────────

export type AgeGroup =
  | 'neonate'    // 0–28 hari
  | 'infant'     // 1–12 bulan
  | 'toddler'    // 1–2 tahun
  | 'preschool'  // 3–5 tahun
  | 'school'     // 6–12 tahun
  | 'adolescent';// 13–18 tahun

export interface VitalRange {
  ageGroup: AgeGroup;
  label: string;
  hrMin: number; hrMax: number;        // bpm
  rrMin: number; rrMax: number;        // × /mnt
  sbpMin: number; sbpMax: number;      // mmHg sistolik
  dbpMin: number; dbpMax: number;      // mmHg diastolik
  mapMin: number; mapMax: number;      // mmHg MAP
}

export const VITAL_RANGES: VitalRange[] = [
  { ageGroup: 'neonate',    label: 'Neonatus (0–28 hr)', hrMin: 100, hrMax: 160, rrMin: 30, rrMax: 60, sbpMin: 60,  sbpMax: 90,  dbpMin: 30, dbpMax: 60, mapMin: 40, mapMax: 60  },
  { ageGroup: 'infant',     label: 'Bayi (1–12 bln)',    hrMin: 100, hrMax: 160, rrMin: 25, rrMax: 50, sbpMin: 70,  sbpMax: 100, dbpMin: 40, dbpMax: 65, mapMin: 50, mapMax: 75  },
  { ageGroup: 'toddler',    label: 'Toddler (1–2 th)',   hrMin: 90,  hrMax: 150, rrMin: 20, rrMax: 40, sbpMin: 80,  sbpMax: 110, dbpMin: 50, dbpMax: 70, mapMin: 55, mapMax: 80  },
  { ageGroup: 'preschool',  label: 'Prasekolah (3–5 th)',hrMin: 80,  hrMax: 140, rrMin: 20, rrMax: 35, sbpMin: 85,  sbpMax: 115, dbpMin: 50, dbpMax: 75, mapMin: 60, mapMax: 85  },
  { ageGroup: 'school',     label: 'Anak (6–12 th)',     hrMin: 70,  hrMax: 120, rrMin: 15, rrMax: 30, sbpMin: 90,  sbpMax: 125, dbpMin: 55, dbpMax: 80, mapMin: 65, mapMax: 90  },
  { ageGroup: 'adolescent', label: 'Remaja (13–18 th)',  hrMin: 60,  hrMax: 100, rrMin: 12, rrMax: 20, sbpMin: 95,  sbpMax: 135, dbpMin: 60, dbpMax: 85, mapMin: 70, mapMax: 95  },
];

export type VitalStatus = 'normal' | 'low' | 'high';

export interface VitalCheckResult {
  hr:  VitalStatus | null;
  rr:  VitalStatus | null;
  sbp: VitalStatus | null;
  dbp: VitalStatus | null;
  spo2: VitalStatus | null;
  map: VitalStatus | null;
}

function check(val: number, min: number, max: number): VitalStatus {
  if (val < min) return 'low';
  if (val > max) return 'high';
  return 'normal';
}

export function checkVitals(
  range: VitalRange,
  input: { hr?: number; rr?: number; sbp?: number; dbp?: number; spo2?: number; map?: number },
): VitalCheckResult {
  return {
    hr:   input.hr   != null ? check(input.hr,   range.hrMin,  range.hrMax)  : null,
    rr:   input.rr   != null ? check(input.rr,   range.rrMin,  range.rrMax)  : null,
    sbp:  input.sbp  != null ? check(input.sbp,  range.sbpMin, range.sbpMax) : null,
    dbp:  input.dbp  != null ? check(input.dbp,  range.dbpMin, range.dbpMax) : null,
    map:  input.map  != null ? check(input.map,  range.mapMin, range.mapMax) : null,
    spo2: input.spo2 != null ? check(input.spo2, 95, 100)                    : null,
  };
}

// ── Kriteria weaning ventilator ───────────────────────────────────────────

export interface WeaningCriterion {
  id: string;
  category: 'klinis' | 'oksigenasi' | 'ventilasi' | 'neurologi';
  text: string;
  detail: string;
}

export const WEANING_CRITERIA: WeaningCriterion[] = [
  // Klinis
  { id: 'cause',      category: 'klinis',    text: 'Penyebab gagal napas teratasi',          detail: 'Kondisi primer yang membutuhkan ventilasi sudah membaik atau dalam perbaikan.' },
  { id: 'hemostable', category: 'klinis',    text: 'Hemodinamik stabil',                     detail: 'Tanpa vasopresor atau dosis minimal, HR dan TD dalam batas normal.' },
  { id: 'afebrile',   category: 'klinis',    text: 'Tidak demam / infeksi terkontrol',       detail: 'Suhu < 38.5°C atau antibiotik sudah berjalan dan kondisi membaik.' },
  { id: 'secretion',  category: 'klinis',    text: 'Sekret dapat dikelola',                  detail: 'Batuk adekuat, sekret tidak berlebihan, suctioning < tiap 2 jam.' },
  // Oksigenasi
  { id: 'fio2',       category: 'oksigenasi',text: 'FiO₂ ≤ 0.40',                           detail: 'FiO₂ sudah dapat diturunkan ke ≤ 40% dengan SpO₂ yang adekuat.' },
  { id: 'peep',       category: 'oksigenasi',text: 'PEEP ≤ 5–8 cmH₂O',                     detail: 'Tidak bergantung pada PEEP tinggi untuk mempertahankan oksigenasi.' },
  { id: 'spo2',       category: 'oksigenasi',text: 'SpO₂ ≥ 94% pada FiO₂ ≤ 0.40',          detail: 'Oksigenasi adekuat tanpa dukungan FiO₂ tinggi.' },
  // Ventilasi
  { id: 'drive',      category: 'ventilasi', text: 'Upaya napas spontan adekuat',            detail: 'Pasien mencetuskan napas, volume tidal spontan memadai (≥ 5 mL/kg).' },
  { id: 'rr',         category: 'ventilasi', text: 'RR spontan dalam batas normal usia',     detail: 'Tanpa takipnea yang signifikan saat dukungan diturunkan.' },
  { id: 'paco2',      category: 'ventilasi', text: 'PaCO₂ terkontrol, pH ≥ 7.30',           detail: 'Tidak ada asidosis respiratorik berat yang membutuhkan kontrol ventilator.' },
  // Neurologi
  { id: 'conscious',  category: 'neurologi', text: 'Kesadaran adekuat untuk proteksi jalan napas', detail: 'Pasien dapat mengikuti perintah sederhana, batuk dengan perintah.' },
  { id: 'sedation',   category: 'neurologi', text: 'Sedasi dihentikan atau minimal',         detail: 'Infus sedasi sudah dilepas atau RASS ≥ -1 hingga 0.' },
];
