// ─────────────────────────────────────────────────────────────────────────
// Konten Teori & Klinis — ringkasan pendekatan di ICU/PICU/NICU.
// Setiap entry memiliki tag kategori, referensi, dan poin-poin kunci.
// ─────────────────────────────────────────────────────────────────────────

export type TheoryCategory = 'ventilasi' | 'sepsis' | 'syok' | 'neonatus' | 'cairan';

export interface TheoryPoint {
  text: string;
  cite?: string; // key ke REFERENCES
}

export interface TheoryEntry {
  id: string;
  title: string;
  subtitle: string;
  category: TheoryCategory;
  points: TheoryPoint[];
  references: string[]; // keys ke REFERENCES
}

export const THEORY_ENTRIES: TheoryEntry[] = [
  // ── Ventilasi ──────────────────────────────────────────────────────────
  {
    id: 'vent_lungprotective',
    title: 'Ventilasi Protektif Paru',
    subtitle: 'Strategi ARDS & ALI',
    category: 'ventilasi',
    points: [
      { text: 'Tidal volume: 4–6 mL/kg IBW (lung protective).' },
      { text: 'Plateau pressure: jaga ≤ 30 cmH₂O.' },
      { text: 'PEEP optimal: titrasi sesuai FiO₂ per tabel ARDSnet.' },
      { text: 'Target SpO₂ 88–95%, PaO₂ 55–80 mmHg.' },
      { text: 'Permissive hypercapnia dapat diterima bila pH > 7.20.' },
    ],
    references: ['pals2020'],
  },
  {
    id: 'vent_weaning',
    title: 'Weaning & Ekstubasi',
    subtitle: 'Kriteria dan langkah penyapihan',
    category: 'ventilasi',
    points: [
      { text: 'Kriteria siap weaning: penyebab teratasi, FiO₂ ≤ 0.40, PEEP ≤ 5, SpO₂ ≥ 95%.' },
      { text: 'Uji SBT (Spontaneous Breathing Trial): CPAP 5 cmH₂O atau T-piece 30–120 menit.' },
      { text: 'Ekstubasi gagal bila: RR > 30–35×/mnt, SpO₂ < 90%, retraksi berat, atau HR ↑ > 20%.' },
      { text: 'Pasca-ekstubasi: high-flow nasal cannula atau CPAP mengurangi reintubasi.' },
    ],
    references: ['pals2020'],
  },

  // ── Sepsis ─────────────────────────────────────────────────────────────
  {
    id: 'sepsis_bundle',
    title: 'Sepsis Bundle Pediatri',
    subtitle: 'Surviving Sepsis Campaign — 1 jam pertama',
    category: 'sepsis',
    points: [
      { text: 'Kenali dalam 15 menit: SIRS + sumber infeksi yang dicurigai.' },
      { text: 'Kultur darah (sebelum antibiotik), laktat, CBC, BMP.' },
      { text: 'Antibiotik broad-spectrum ≤ 1 jam (jangan tunda untuk kultur).' },
      { text: 'Resusitasi cairan: 10–20 mL/kg bolus isotonis, titrasi sesuai respons.' },
      { text: 'Vasopresor lini pertama: Norepinefrin untuk syok septik.' },
      { text: 'Target: MAP ≥ 65 mmHg (dewasa), laktat < 2 mmol/L.' },
    ],
    references: ['pals2020'],
  },
  {
    id: 'sepsis_antibiotics',
    title: 'Antibiotik Empiris Sepsis',
    subtitle: 'Pilihan berdasarkan sumber infeksi',
    category: 'sepsis',
    points: [
      { text: 'Unknown source: Cefotaxime/Ceftriaxone + Metronidazole.' },
      { text: 'Suspek MRSA: tambah Vancomycin.' },
      { text: 'Nosokomial/ICU: Meropenem atau Piperacillin-Tazobactam.' },
      { text: 'Neonatus < 7 hari: Ampicillin + Gentamicin.' },
      { text: 'De-eskalasi dalam 48–72 jam berdasarkan kultur.' },
    ],
    references: ['pals2020'],
  },

  // ── Syok ───────────────────────────────────────────────────────────────
  {
    id: 'shock_classification',
    title: 'Klasifikasi & Pendekatan Syok',
    subtitle: 'Distributif · Hipovolemik · Obstruktif · Kardiogenik',
    category: 'syok',
    points: [
      { text: 'Distributif (septik/anafilaksis): cairan + vasopresor (NE lini 1).' },
      { text: 'Hipovolemik: resusitasi cepat 20 mL/kg bolus, ulangi s/d 3× bila perlu.' },
      { text: 'Kardiogenik: cairan terbatas (5–10 mL/kg), inotropik (Dobutamin/Milrinon).' },
      { text: 'Obstruktif: tamponade → perikardiosentesis; tension PTX → dekompresi jarum.' },
      { text: 'End-points: CRT ≤ 2 detik, urin ≥ 1 mL/kg/jam, laktat membaik.' },
    ],
    references: ['pals2020'],
  },
  {
    id: 'shock_vasopressors',
    title: 'Vasopresor & Inotropik',
    subtitle: 'Pemilihan agen berdasarkan profil syok',
    category: 'syok',
    points: [
      { text: 'Norepinefrin: syok distributif — vasokonstriksi ± inotropik ringan.' },
      { text: 'Dopamin: 2–5 mcg/kg/mnt (dopaminergik), 5–10 (β₁), >10 (α₁).' },
      { text: 'Epinefrin: syok refrakter atau anafilaksis.' },
      { text: 'Dobutamin: syok kardiogenik — inotropik tanpa vasokonstriksi berat.' },
      { text: 'Milrinon: disfungsi diastol + resistensi pulmoner tinggi (pasca-operasi jantung).' },
    ],
    references: ['pals2020'],
  },

  // ── Neonatus ───────────────────────────────────────────────────────────
  {
    id: 'neonate_rds',
    title: 'RDS Neonatus',
    subtitle: 'Respiratory Distress Syndrome — defisiensi surfaktan',
    category: 'neonatus',
    points: [
      { text: 'Terutama pada prematur < 34 minggu.' },
      { text: 'CXR: ground glass, air bronchogram, volume paru kecil.' },
      { text: 'Surfaktan eksogen: dosis 100–200 mg/kg, ulang s/d 3× sesuai kebutuhan.' },
      { text: 'CPAP nasal 5–7 cmH₂O sebagai terapi awal bila tidak ada kontraindikasi.' },
      { text: 'INSURE: Intubate-Surfactant-Extubate bila CPAP gagal.' },
    ],
    references: ['nrp8'],
  },
  {
    id: 'neonate_nec',
    title: 'Necrotizing Enterocolitis (NEC)',
    subtitle: 'Emergensi GI pada neonatus prematur',
    category: 'neonatus',
    points: [
      { text: 'Trias: kembung, darah dalam feses, intoleransi makan.' },
      { text: 'Staging Bell: I (suspek), II (definitif), III (berat/perforasi).' },
      { text: 'Tatalaksana: puasakan, dekompresi NGT, antibiotik IV 7–10 hari.' },
      { text: 'Konsul bedah segera bila Bell III (pneumoperitoneum/deteriorasi).' },
      { text: 'Hindari formula hiperosmolar dan hindari penundaan enteral pada VLBW.' },
    ],
    references: ['nrp8'],
  },

  // ── Cairan & Elektrolit ────────────────────────────────────────────────
  {
    id: 'fluid_electrolyte',
    title: 'Gangguan Elektrolit Kritis',
    subtitle: 'Natrium · Kalium · Kalsium',
    category: 'cairan',
    points: [
      { text: 'Hiponatremia simtomatik (Na < 120): koreksi NaCl 3% 2–3 mL/kg bolus pelan.' },
      { text: 'Target koreksi Na: max 8–10 mEq/L per 24 jam (hindari osmotic demyelination).' },
      { text: 'Hiperkalemia (K > 6.5 + perubahan EKG): Ca glukonat IV + insulin-dextrose + kayexalate.' },
      { text: 'Hipokalsemia (iCa < 1.1 mmol/L): Ca glukonat 10% 0.5–1 mL/kg IV pelan.' },
      { text: 'Monitor EKG selama koreksi elektrolit IV.' },
    ],
    references: ['pals2020'],
  },
];

export const CATEGORY_LABELS: Record<TheoryCategory, string> = {
  ventilasi: 'Ventilasi',
  sepsis:    'Sepsis',
  syok:      'Syok',
  neonatus:  'Neonatus',
  cairan:    'Cairan & Elektrolit',
};

export const CATEGORY_ORDER: TheoryCategory[] = ['sepsis', 'syok', 'ventilasi', 'neonatus', 'cairan'];
