// Data dosis obat untuk trias anestesi — RSI dan induksi elektif
// Referensi: BNFc 2023–2024 [41], PALS 2020 [1]

export type TriasCategory = 'analgetik' | 'sedasi' | 'relaksan';

export interface DoseRange {
  min: number;
  max: number;
  unit: 'mcg/kg' | 'mg/kg';
}

export interface TriasDrug {
  id: string;
  name: string;
  category: TriasCategory;
  /** Dosis bolus RSI / induksi */
  rsiDose: DoseRange;
  /** Dosis infus maintenance (opsional) */
  maintenanceDose?: {
    min: number;
    max: number;
    unit: 'mcg/kg/jam' | 'mg/kg/jam' | 'mcg/kg/mnt';
  };
  /** Konsentrasi sediaan umum (mg/mL atau mcg/mL) untuk hitung volume */
  concentration: number;   // mg/mL
  concentrationUnit: 'mg/mL' | 'mcg/mL';
  onset: string;
  duration: string;
  notes?: string;
  warnings?: string[];
  references: string[];
}

export const TRIAS_DRUGS: TriasDrug[] = [

  // ── Analgetik ─────────────────────────────────────────────────────────────
  {
    id: 'fentanil',
    name: 'Fentanil',
    category: 'analgetik',
    rsiDose: { min: 2, max: 5, unit: 'mcg/kg' },
    maintenanceDose: { min: 0.5, max: 5, unit: 'mcg/kg/jam' },
    concentration: 0.05,   // 50 mcg/mL = 0.05 mg/mL
    concentrationUnit: 'mg/mL',
    onset: '1–2 menit',
    duration: '30–60 menit',
    notes: 'Pilihan utama analgetik untuk RSI. Dapat menyebabkan rigiditas dinding dada pada dosis besar — berikan pelan.',
    warnings: ['Rigiditas dada pada dosis > 5 mcg/kg IV cepat', 'Depresi napas — siapkan nalokson'],
    references: ['bnfc2023', 'pals2020'],
  },
  {
    id: 'morfin',
    name: 'Morfin',
    category: 'analgetik',
    rsiDose: { min: 0.05, max: 0.1, unit: 'mg/kg' },
    maintenanceDose: { min: 0.01, max: 0.04, unit: 'mg/kg/jam' },
    concentration: 1,      // 1 mg/mL (10 mg/10 mL)
    concentrationUnit: 'mg/mL',
    onset: '5–10 menit',
    duration: '2–4 jam',
    notes: 'Onset lebih lambat dari fentanil, kurang ideal untuk RSI. Lebih sering dipakai untuk maintenance analgesia.',
    warnings: ['Pelepasan histamin — hindari pada asma/reaksi alergi', 'Depresi napas — siapkan nalokson'],
    references: ['bnfc2023'],
  },
  {
    id: 'ketamin_analgetik',
    name: 'Ketamin (analgetik dosis rendah)',
    category: 'analgetik',
    rsiDose: { min: 0.5, max: 1, unit: 'mg/kg' },
    maintenanceDose: { min: 0.1, max: 0.5, unit: 'mg/kg/jam' },
    concentration: 50,     // 50 mg/mL (500 mg/10 mL)
    concentrationUnit: 'mg/mL',
    onset: '1–2 menit',
    duration: '10–20 menit',
    notes: 'Dosis sub-disosiatif untuk analgesia sambil mempertahankan airway reflex. Dapat dikombinasi dengan midazolam.',
    references: ['bnfc2023', 'pals2020'],
  },

  // ── Sedasi ────────────────────────────────────────────────────────────────
  {
    id: 'midazolam',
    name: 'Midazolam',
    category: 'sedasi',
    rsiDose: { min: 0.1, max: 0.3, unit: 'mg/kg' },
    maintenanceDose: { min: 0.05, max: 0.2, unit: 'mg/kg/jam' },
    concentration: 1,      // 1 mg/mL (5 mg/5 mL)
    concentrationUnit: 'mg/mL',
    onset: '2–3 menit',
    duration: '30–60 menit',
    notes: 'Benzodiazepin kerja singkat, pilihan umum untuk induksi. Dapat menyebabkan hipotensi bila pasien hipovolemik.',
    warnings: ['Hipotensi pada hipovolemia', 'Depresi napas — siapkan flumazenil'],
    references: ['bnfc2023', 'pals2020'],
  },
  {
    id: 'ketamin_sedasi',
    name: 'Ketamin (induksi)',
    category: 'sedasi',
    rsiDose: { min: 1, max: 2, unit: 'mg/kg' },
    maintenanceDose: { min: 0.5, max: 2, unit: 'mg/kg/jam' },
    concentration: 50,
    concentrationUnit: 'mg/mL',
    onset: '1–2 menit',
    duration: '10–20 menit',
    notes: 'Pilihan utama pada pasien hemodinamik tidak stabil dan asma (bronkodilator). Pertahankan airway reflex.',
    warnings: ['Dapat meningkatkan sekresi — tambahkan atropin 0.01 mg/kg', 'Peningkatan TIK pada cedera otak (relatif kontraindikasi)'],
    references: ['bnfc2023', 'pals2020'],
  },
  {
    id: 'propofol',
    name: 'Propofol',
    category: 'sedasi',
    rsiDose: { min: 1, max: 3, unit: 'mg/kg' },
    maintenanceDose: { min: 1, max: 4, unit: 'mg/kg/jam' },
    concentration: 10,     // 10 mg/mL
    concentrationUnit: 'mg/mL',
    onset: '< 1 menit',
    duration: '5–10 menit',
    notes: 'Onset sangat cepat, offset cepat. Tidak digunakan pada bayi < 1 bulan.',
    warnings: [
      'JANGAN pada bayi < 1 bulan atau pasien tidak stabil hemodinamik',
      'Propofol infusion syndrome (PIS) pada infus > 4 mg/kg/jam > 48 jam',
      'Hipotensi — berikan pelan',
    ],
    references: ['bnfc2023'],
  },

  // ── Muscle Relaxant ───────────────────────────────────────────────────────
  {
    id: 'suksinilkolin',
    name: 'Suksinilkolin (Suksametonium)',
    category: 'relaksan',
    rsiDose: { min: 1, max: 2, unit: 'mg/kg' },
    concentration: 20,     // 20 mg/mL
    concentrationUnit: 'mg/mL',
    onset: '45–60 detik',
    duration: '8–12 menit',
    notes: 'Depolarisasi — onset tercepat, pilihan RSI klasik. Tidak ada antidotum, harus menunggu efek habis.',
    warnings: [
      'Kontraindikasi: hiperkalemia (K > 5.5), luka bakar > 48 jam, cedera otot masif, miopati, riwayat hipertermi maligna',
      'Bradikardi pada dosis ulang atau anak kecil — premedikasi atropin',
    ],
    references: ['bnfc2023', 'pals2020'],
  },
  {
    id: 'atrakurium',
    name: 'Atrakurium',
    category: 'relaksan',
    rsiDose: { min: 0.4, max: 0.5, unit: 'mg/kg' },
    maintenanceDose: { min: 0.3, max: 0.6, unit: 'mg/kg/jam' },
    concentration: 10,     // 10 mg/mL
    concentrationUnit: 'mg/mL',
    onset: '2–3 menit',
    duration: '20–35 menit',
    notes: 'Non-depolarisasi. Metabolisme Hofmann (tidak tergantung hati/ginjal) — pilihan ideal pada gagal organ. Sering dipakai maintenance.',
    warnings: ['Pelepasan histamin — berikan pelan, pantau TD', 'Laudanosine accumulation pada gagal hati berat'],
    references: ['bnfc2023'],
  },
  {
    id: 'vekuronium',
    name: 'Vekuronium',
    category: 'relaksan',
    rsiDose: { min: 0.1, max: 0.3, unit: 'mg/kg' },
    maintenanceDose: { min: 0.05, max: 0.1, unit: 'mg/kg/jam' },
    concentration: 1,      // 1 mg/mL (setelah rekonstitusi 4 mg/4 mL)
    concentrationUnit: 'mg/mL',
    onset: '2–4 menit',
    duration: '25–40 menit',
    notes: 'Non-depolarisasi. Dosis RSI 0.3 mg/kg mempercepat onset. Reversibel dengan neostigmin + atropin.',
    references: ['bnfc2023'],
  },
  {
    id: 'rokuroni',
    name: 'Rokuroni',
    category: 'relaksan',
    rsiDose: { min: 0.6, max: 1.2, unit: 'mg/kg' },
    maintenanceDose: { min: 0.3, max: 0.6, unit: 'mg/kg/jam' },
    concentration: 10,     // 10 mg/mL
    concentrationUnit: 'mg/mL',
    onset: '1–2 menit',
    duration: '30–60 menit',
    notes: 'Non-depolarisasi dengan onset cepat. Dosis RSI 1.2 mg/kg onset mirip suksinilkolin. Reversibel dengan sugammadex.',
    warnings: ['Sugammadex (reversal) belum tersedia luas di Indonesia — konfirmasi ketersediaan'],
    references: ['bnfc2023', 'pals2020'],
  },
];

export const TRIAS_BY_CATEGORY = {
  analgetik: TRIAS_DRUGS.filter((d) => d.category === 'analgetik'),
  sedasi:    TRIAS_DRUGS.filter((d) => d.category === 'sedasi'),
  relaksan:  TRIAS_DRUGS.filter((d) => d.category === 'relaksan'),
};
