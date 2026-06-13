// ─────────────────────────────────────────────────────────────────────────
// Konten Teori & Klinis — ringkasan pendekatan di ICU/PICU/NICU.
// Setiap entry memiliki tag kategori, referensi, dan poin-poin kunci.
// ─────────────────────────────────────────────────────────────────────────

export type TheoryCategory = 'ventilasi' | 'sepsis' | 'syok' | 'neonatus' | 'cairan' | 'neurologi' | 'renal' | 'farmakologi';

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

  // ── Neonatus (tambahan) ────────────────────────────────────────────────
  {
    id: 'neonate_resus',
    title: 'Resusitasi Neonatus (NRP)',
    subtitle: 'Algoritma NRP 8th Edition',
    category: 'neonatus',
    points: [
      { text: 'Langkah awal (30 detik): hangatkan, keringkan, stimulasi, posisikan jalan napas.' },
      { text: 'Evaluasi: usaha napas, HR, tonus otot.' },
      { text: 'HR < 100 atau apnea: VTP (Ventilasi Tekanan Positif) dengan O₂ 21% (aterm) / 21–30% (prematur).' },
      { text: 'HR < 60 setelah 30 detik VTP adekuat: kompresi dada 3:1 dengan VTP.' },
      { text: 'HR tetap < 60: Epinefrin 0.01–0.03 mg/kg IV (atau 0.05–0.1 mg/kg via ET sementara akses IV disiapkan).' },
      { text: 'Target SpO₂ praductal (menit ke-1 sampai ke-10): 60–65%, 65–70%, 70–75%, 75–80%, 80–85%, 85–95%.' },
    ],
    references: ['nrp8'],
  },
  {
    id: 'neonate_hypothermia',
    title: 'HIE & Hipotermia Terapeutik',
    subtitle: 'Hypoxic-Ischemic Encephalopathy — neonatus aterm',
    category: 'neonatus',
    points: [
      { text: 'Indikasi: ≥ 36 minggu, usia < 6 jam, pH ≤ 7.0 atau BD ≥ 16, atau event sentinel + Apgar ≤ 5 pada menit ke-10.' },
      { text: 'Target suhu: 33–34°C selama 72 jam, lalu rewarming 0.5°C/jam.' },
      { text: 'Monitor: EEG amplitudo (aEEG), gula darah (target 70–120 mg/dL), elektrolit, fungsi ginjal.' },
      { text: 'Hindari hiperglikemia dan hipotermia berlebihan (< 33°C).' },
      { text: 'Kejang: Fenobarbital lini 1 (20 mg/kg loading IV); levetiracetam alternatif.' },
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
  // ── Neurologi ──────────────────────────────────────────────────────────
  {
    id: 'neuro_status_epilepticus',
    title: 'Status Epileptikus',
    subtitle: 'Tatalaksana lini 1–3 pediatri',
    category: 'neurologi',
    points: [
      { text: 'Definisi: kejang > 5 menit atau ≥ 2 kejang tanpa pulih kesadaran.' },
      { text: 'Lini 1 (0–5 mnt): Diazepam rektal 0.5 mg/kg atau Midazolam buccal/IM 0.2 mg/kg (maks 10 mg).' },
      { text: 'Lini 2 (5–20 mnt): Fenobarbital IV 20 mg/kg dalam 20 menit ATAU Fenitoin 20 mg/kg dalam 20 menit.' },
      { text: 'Lini 3 (> 20 mnt — RSE): Midazolam infus 0.05–0.4 mg/kg/jam; atau Propofol (anak > 2 th); atau Pentobarbital.' },
      { text: 'Pastikan: gula darah, Na, Ca, Mg — koreksi bila ada kelainan elektrolit.' },
      { text: 'EEG sesegera mungkin bila tidak pulih dalam 30 menit pasca-terapi.' },
    ],
    references: ['pals2020'],
  },
  {
    id: 'neuro_icp',
    title: 'Peningkatan TIK',
    subtitle: 'Manajemen ICP pada anak',
    category: 'neurologi',
    points: [
      { text: 'Tanda herniasi: pupil anisokor/blown, postur deserebrasi, Cushing triad (HTN + bradikardia + pola napas ireguler).' },
      { text: 'Posisi kepala 30°, midline, hindari fleksi leher.' },
      { text: 'Manitol 0.25–1 g/kg IV bolus (target osmolalitas 300–320 mOsm/kg); alternatif NaCl 3% 2–5 mL/kg.' },
      { text: 'Hiperventilasi darurat (PaCO₂ 30–35) hanya sementara sebagai jembatan ke intervensi definitif.' },
      { text: 'Hindari: hipotermia berat, hiperkarbia, hipertermi, obstruksi drainase vena jugular.' },
      { text: 'Konsul bedah saraf segera bila ada massa atau hidrosefalus obstruktif.' },
    ],
    references: ['pals2020'],
  },

  // ── Renal ─────────────────────────────────────────────────────────────
  {
    id: 'renal_aki_picu',
    title: 'AKI di PICU',
    subtitle: 'Pendekatan & strategi konservatif',
    category: 'renal',
    points: [
      { text: 'Staging KDIGO: berdasarkan kenaikan Cr atau penurunan UO (< 0.5 mL/kg/jam × 6–12 jam).' },
      { text: 'Hentikan nefrotoksin: AINS, aminoglikosida (ganti ke alternatif), kontras IV.' },
      { text: 'Optimalkan hemodinamik: MAP sesuai usia, koreksi hipovolemia sebelum diuretik.' },
      { text: 'Fluid overload ≥ 10% BB → pertimbangkan diuretik furosemide; ≥ 15% → pertimbangkan RRT.' },
      { text: 'Sesuaikan dosis SEMUA obat yang terekskresi ginjal (termasuk antibiotik).' },
      { text: 'Indikasi RRT: hiperkalemia refrakter, asidosis berat pH < 7.15, uremia simtomatik, overload refrakter.' },
    ],
    references: ['kdigo2012'],
  },
  {
    id: 'renal_ckd_picu',
    title: 'Anak CKD di IGD/ICU',
    subtitle: 'Pertimbangan khusus pada CKD G3+',
    category: 'renal',
    points: [
      { text: 'Hindari nefrotoksin rutin: AINS, gentamicin, kontras hiperosmolar.' },
      { text: 'Anemia normositik normokromik: Hb target 11–12 g/dL; EPO jika tersedia.' },
      { text: 'Hiperkalemia lebih mudah terjadi → monitor EKG, batasi K intake.' },
      { text: 'Hiperfosfatemia: hindari fosfat IV; binder bila oral bisa diberikan.' },
      { text: 'Asidosis metabolik: NaHCO₃ bila bikarbonat < 18–20 mEq/L.' },
      { text: 'Dosis antibiotik: hitung eGFR dan sesuaikan interval (creatinine clearance).' },
    ],
    references: ['kdigo2012'],
  },

  // ── Farmakologi ───────────────────────────────────────────────────────
  {
    id: 'pharm_sedanalgesia',
    title: 'Sedasi & Analgesia di PICU',
    subtitle: 'Pendekatan multimodal & minimasi opioid',
    category: 'farmakologi',
    points: [
      { text: 'Gunakan skala penilaian: FLACC/COMFORT-B untuk anak; NRS untuk anak > 8 tahun.' },
      { text: 'Analgesia dulu (analgesia-first): Paracetamol ± Ibuprofen sebelum opioid.' },
      { text: 'Fentanyl: 1–5 mcg/kg/jam infus — lebih stabil hemodinamik dari morfin.' },
      { text: 'Midazolam: 0.05–0.2 mg/kg/jam infus; awas akumulasi metabolit pada gagal ginjal.' },
      { text: 'Dexmedetomidine: 0.2–0.7 mcg/kg/jam — sedasi ringan tanpa depresi napas, cocok untuk weaning.' },
      { text: 'SAT (Spontaneous Awakening Trial) harian + SBT mengurangi durasi MV dan lama rawat ICU.' },
    ],
    references: ['pals2020'],
  },
  {
    id: 'pharm_antibiotics_dose',
    title: 'Antibiotik — Prinsip PK/PD',
    subtitle: 'Time-dependent vs concentration-dependent',
    category: 'farmakologi',
    points: [
      { text: 'Time-dependent (β-laktam, vankomisin): efektivitas bergantung pada waktu kadar di atas MIC → perpanjang interval atau infus kontinu.' },
      { text: 'Concentration-dependent (aminoglikosida, fluorokuinolon): dosis besar sekali sehari lebih efektif (Cmax/MIC).' },
      { text: 'TDM (Therapeutic Drug Monitoring): vankomisin (target AUC/MIC 400–600), aminoglikosida (peak & trough).' },
      { text: 'De-eskalasi dalam 48–72 jam bila kultur tersedia dan klinis membaik.' },
      { text: 'Durasi antibiotik: bacteremia tanpa komplikasi 7–14 hari; meningitis bakteri 10–21 hari sesuai kuman.' },
    ],
    references: ['pals2020'],
  },
];

export const CATEGORY_LABELS: Record<TheoryCategory, string> = {
  ventilasi:    'Ventilasi',
  sepsis:       'Sepsis',
  syok:         'Syok',
  neonatus:     'Neonatus',
  cairan:       'Cairan & Elektrolit',
  neurologi:    'Neurologi',
  renal:        'Renal',
  farmakologi:  'Farmakologi',
};

export const CATEGORY_ORDER: TheoryCategory[] = ['sepsis', 'syok', 'ventilasi', 'neonatus', 'cairan', 'neurologi', 'renal', 'farmakologi'];
