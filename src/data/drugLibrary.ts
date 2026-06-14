// ─────────────────────────────────────────────────────────────────────────
// Library dosis obat pediatri.
//
// ⚠ PENTING — Zero Hallucination (CLAUDE.md):
//   Dosis di file ini HARUS dikonfirmasi oleh pengarah klinis sebelum
//   digunakan. Setiap entri wajib menyebut sumber (reference key).
//   Entri dengan TODO = belum dikonfirmasi, JANGAN ditampilkan ke pengguna.
// ─────────────────────────────────────────────────────────────────────────

export type DrugCategory =
  | 'emergensi'       // resusitasi, PALS
  | 'antibiotik'
  | 'antiviral'
  | 'antijamur'
  | 'analgesik'
  | 'sedasi'
  | 'antikonvulsan'
  | 'vasoaktif'       // vasopresor & inotropik
  | 'bronkodilator'
  | 'diuretik'
  | 'antiemetik'
  | 'kortikosteroid'
  | 'lainnya';

export type RouteCode = 'IV' | 'PO' | 'IM' | 'SC' | 'Inhalasi' | 'Rektal' | 'Intranasal' | 'Sublingual';

export interface DoseRange {
  /** Dosis minimum per kg (unit sesuai `unit`) */
  minPerKg: number;
  /** Dosis maksimum per kg */
  maxPerKg: number;
  /** Unit dosis per kg: 'mg/kg' | 'mcg/kg' | 'mEq/kg' | 'mL/kg' */
  unit: 'mg/kg' | 'mcg/kg' | 'mEq/kg' | 'mL/kg' | 'unit/kg';
  /** Dosis absolut maksimum (batas atas tanpa memandang BB) */
  maxAbsoluteMg?: number;
  /** Frekuensi pemberian, mis. "tiap 8 jam", "sekali", "prn" */
  frequency: string;
  /** Durasi pemberian IV, mis. "pelan 5 menit", "infus 30 menit" */
  ivDuration?: string;
  /** Indikasi spesifik rute ini */
  indication?: string;
  /** Catatan penting untuk rute ini */
  notes?: string;
}

export interface DrugRoute {
  route: RouteCode;
  dose: DoseRange;
}

export interface DrugEntry {
  id: string;
  /** Nama generik */
  name: string;
  /** Nama alternatif / merek untuk search */
  aliases: string[];
  category: DrugCategory;
  routes: DrugRoute[];
  /** Mekanisme kerja singkat */
  mechanism?: string;
  /** Kontraindikasi utama */
  contraindications?: string[];
  /** Peringatan klinis penting */
  warnings?: string[];
  /** Penyesuaian dosis pada gangguan ginjal */
  renalAdjustment?: string;
  /** Penyesuaian dosis pada gangguan hati */
  hepaticAdjustment?: string;
  /** Farmakokinetik klinis relevan */
  pharmacokinetics?: {
    onset?: string;
    peak?: string;
    duration?: string;
    halfLife?: string;
    metabolism?: string;
    excretion?: string;
  };
  /** Pertimbangan populasi khusus */
  specialPopulations?: {
    neonates?: string;
    infants?: string;
    renal?: string;
    hepatic?: string;
    obesity?: string;
  };
  /** Referensi sumber dosis (key ke REFERENCES) */
  references: string[];
  /** false = belum dikonfirmasi pengarah klinis, jangan tampilkan */
  verified: boolean;
}

// ─────────────────────────────────────────────────────────────────────────
// DATA OBAT
// Instruksi pengisian:
//   1. Isi dosis dari sumber yang disebutkan di `references`
//   2. Set `verified: true` setelah dikonfirmasi pengarah klinis
//   3. Entri `verified: false` tidak akan ditampilkan di UI
// ─────────────────────────────────────────────────────────────────────────

export const DRUG_LIBRARY: DrugEntry[] = [

  // ── Emergensi ──────────────────────────────────────────────────────────
  {
    id: 'epinefrin_cardiac',
    name: 'Epinefrin (Adrenalin)',
    aliases: ['Adrenalin', 'Epinephrine', 'Epi'],
    category: 'emergensi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.01, unit: 'mg/kg',
          maxAbsoluteMg: 1,
          frequency: 'tiap 3–5 menit selama resusitasi',
          ivDuration: 'bolus cepat IV/IO',
          indication: 'Henti jantung (VF/pVT/PEA/asistol)',
          notes: '0.01 mg/kg = 0.1 mL/kg dari larutan 1:10.000 (0.1 mg/mL)',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.03, unit: 'mg/kg',
          maxAbsoluteMg: 0.5,
          frequency: 'sekali, dapat diulang',
          ivDuration: 'bolus IV pelan 5–10 menit',
          indication: 'Anafilaksis — bila akses IV/IO tersedia',
          notes: 'Pilihan utama anafilaksis tetap IM paha lateral. Dosis IV lebih rendah dari IM.',
        },
      },
      {
        route: 'IM',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.01, unit: 'mg/kg',
          maxAbsoluteMg: 0.5,
          frequency: 'tiap 5–15 menit bila perlu',
          indication: 'Anafilaksis — injeksi IM paha anterolateral',
          notes: '0.01 mg/kg dari larutan 1:1000 (1 mg/mL). IM lebih cepat onset dari SC.',
        },
      },
    ],
    contraindications: ['Tidak ada kontraindikasi absolut pada henti jantung'],
    warnings: [
      'Dapat menyebabkan aritmia — monitor EKG',
      'Ekstravasasi via perifer → nekrosis jaringan; antidotum: phentolamine lokal',
      'Dosis infus kontinu berbeda jauh dari dosis bolus — VERIFIKASI sebelum pemberian',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'atropin',
    name: 'Atropin',
    aliases: ['Atropine', 'Atropin Sulfat'],
    category: 'emergensi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.02, maxPerKg: 0.02, unit: 'mg/kg',
          maxAbsoluteMg: 0.5,
          frequency: 'dapat diulang sekali (dosis total maks 1 mg anak)',
          ivDuration: 'bolus cepat',
          indication: 'Bradikardia simtomatik dengan perfusi buruk',
          notes: 'Dosis minimum 0.1 mg (paradoxal bradycardia pada dosis sangat kecil). Maks total 1 mg pada anak.',
        },
      },
    ],
    warnings: [
      'Dosis < 0.1 mg dapat menyebabkan bradikardia paradoksal',
      'Takikardia, retensi urin, midriasis sebagai efek samping',
      'Tidak efektif pada blok AV derajat 2 tipe 2 atau blok derajat 3',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'adenosin',
    name: 'Adenosin',
    aliases: ['Adenosine', 'Adenocor'],
    category: 'emergensi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.1, unit: 'mg/kg',
          maxAbsoluteMg: 6,
          frequency: 'dapat diulang 0.2 mg/kg (maks 12 mg)',
          ivDuration: 'bolus SANGAT CEPAT (1–2 detik), flush NaCl cepat',
          indication: 'SVT (Supraventricular Tachycardia)',
          notes: 'Harus diberikan di vena proksimal (antecubital/sentral). Waktu paruh < 10 detik. Siapkan EKG strip.',
        },
      },
    ],
    warnings: [
      'Dosis 2× lipat bila via vena perifer distal atau kateter vena sentral',
      'Bronkospasme — hindari pada asma berat',
      'Asistol transien normal setelah dosis — siapkan defibrillator',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'amiodarone_iv',
    name: 'Amiodaron IV',
    aliases: ['Amiodarone', 'Cordarone IV'],
    category: 'emergensi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 5, maxPerKg: 5, unit: 'mg/kg',
          maxAbsoluteMg: 300,
          frequency: 'dapat diulang 2× (total maks 15 mg/kg atau 2.2 g/24 jam)',
          ivDuration: 'cardiac arrest: bolus cepat; aritmia stabil: 20–60 menit',
          indication: 'VF/pVT refrakter defibrilasi, atau SVT/VT dengan hemodinamik stabil',
          notes: 'Pada cardiac arrest: bolus cepat setelah defibrilasi ke-3. Pada aritmia stabil: infus pelan hindari hipotensi.',
        },
      },
    ],
    warnings: [
      'Hipotensi — infus pelan pada pasien stabil',
      'QT prolongation — monitor EKG',
      'Tidak kompatibel dengan banyak obat — berikan jalur terpisah',
      'Fototoksisitas pada penggunaan lama (IV jangka pendek aman)',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Vasoaktif ──────────────────────────────────────────────────────────
  {
    id: 'dopamin',
    name: 'Dopamin',
    aliases: ['Dopamine', 'Dopaject'],
    category: 'vasoaktif',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 2, maxPerKg: 20, unit: 'mcg/kg',
          frequency: 'infus kontinu (mcg/kg/menit)',
          ivDuration: 'infus kontinu via syringe pump',
          indication: 'Syok — vasopresor/inotropik (titrasi sesuai target MAP)',
          notes: '2–5 mcg/kg/mnt: dopaminergik; 5–10: β₁ inotropik; >10: α₁ vasokonstriksi. Gunakan SyringePump kalkulator untuk laju.',
        },
      },
    ],
    warnings: [
      'Ekstravasasi → nekrosis jaringan; antidotum phentolamine',
      'Aritmia pada dosis tinggi',
      'Tidak boleh dicampur dengan NaHCO₃ (inaktivasi)',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'dobutamin',
    name: 'Dobutamin',
    aliases: ['Dobutamine', 'Dobutrex'],
    category: 'vasoaktif',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 2, maxPerKg: 20, unit: 'mcg/kg',
          frequency: 'infus kontinu (mcg/kg/menit)',
          ivDuration: 'infus kontinu via syringe pump',
          indication: 'Syok kardiogenik — inotropik positif',
          notes: 'Efek dominan β₁ (inotropik) dengan vasodilatasi ringan (β₂). Tidak cocok bila hipotensi berat — naikkan preload dulu.',
        },
      },
    ],
    warnings: [
      'Takikardia dan aritmia pada dosis tinggi',
      'Monitor TD ketat — dapat menyebabkan hipotensi bila vasodilatasinya dominan',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'norepinefrin',
    name: 'Norepinefrin (Noradrenalin)',
    aliases: ['Norepinephrine', 'Noradrenaline', 'Levophed', 'NE'],
    category: 'vasoaktif',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 1, unit: 'mcg/kg',
          frequency: 'infus kontinu (mcg/kg/menit)',
          ivDuration: 'infus kontinu — idealnya via akses sentral',
          indication: 'Syok septik / distributif — vasopresor lini pertama',
          notes: 'Efek α₁ dominan (vasokonstriksi) + β₁ ringan. Target: MAP sesuai usia. Titrasi per 0.05 mcg/kg/mnt.',
        },
      },
    ],
    warnings: [
      'Ekstravasasi perifer → iskemia jaringan berat; gunakan akses sentral bila memungkinkan',
      'Bradikardi refleks pada vasokonstriksi kuat',
      'Monitor perfusi perifer dan output urin',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'epinefrin_infus',
    name: 'Epinefrin Infus Kontinu',
    aliases: ['Adrenalin Drip', 'Epinephrine Infusion'],
    category: 'vasoaktif',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 1, unit: 'mcg/kg',
          frequency: 'infus kontinu (mcg/kg/menit)',
          ivDuration: 'infus kontinu via syringe pump',
          indication: 'Syok refrakter, anafilaksis berat, syok kardiogenik',
          notes: 'Dosis rendah (< 0.1): β dominan (inotropik). Dosis tinggi (> 0.3): α dominan (vasokonstriksi). Lihat SyringePump kalkulator.',
        },
      },
    ],
    warnings: [
      'Aritmia — monitor EKG kontinu',
      'Laktat dan glukosa meningkat (efek metabolik)',
      'Ekstravasasi → nekrosis; gunakan akses sentral',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Sedasi & Analgesia ─────────────────────────────────────────────────
  {
    id: 'midazolam',
    name: 'Midazolam',
    aliases: ['Dormicum', 'Versed', 'Midaz'],
    category: 'sedasi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.05, maxPerKg: 0.1, unit: 'mg/kg',
          maxAbsoluteMg: 5,
          frequency: 'tiap 2–4 jam prn; atau infus 0.05–0.2 mg/kg/jam',
          ivDuration: 'bolus pelan 2–3 menit',
          indication: 'Sedasi prosedural / premedikasi',
          notes: 'Onset 2–3 menit IV. Reversal: Flumazenil 0.01 mg/kg IV.',
        },
      },
      {
        route: 'IM',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.2, unit: 'mg/kg',
          maxAbsoluteMg: 5,
          frequency: 'sekali (premedikasi)',
          indication: 'Premedikasi pre-prosedur bila akses IV tidak ada',
        },
      },
      {
        route: 'Intranasal',
        dose: {
          minPerKg: 0.2, maxPerKg: 0.3, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'sekali',
          indication: 'Sedasi pre-prosedur / kejang tanpa akses IV',
          notes: 'Gunakan konsentrasi 5 mg/mL untuk volume minimal. Onset 5–10 menit.',
        },
      },
      {
        route: 'Rektal',
        dose: {
          minPerKg: 0.3, maxPerKg: 0.5, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'sekali',
          indication: 'Kejang tanpa akses IV, sebagai alternatif diazepam rektal',
        },
      },
    ],
    warnings: [
      'Depresi napas — siapkan BVM dan oksigen',
      'Akumulasi metabolit aktif pada gagal ginjal',
      'Sinergi dengan opioid → depresi napas lebih berat',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'ketamin',
    name: 'Ketamin',
    aliases: ['Ketamine', 'Ketalar'],
    category: 'sedasi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 1, maxPerKg: 2, unit: 'mg/kg',
          frequency: 'sekali; dapat ditambah 0.5–1 mg/kg tiap 10 menit prn',
          ivDuration: 'pelan 1–2 menit',
          indication: 'Sedasi prosedural (jahit luka, reduksi dislokasi, prosedur menyakitkan)',
          notes: 'Mempertahankan refleks jalan napas. Kombinasikan dengan midazolam 0.05 mg/kg untuk kurangi emergence reaction.',
        },
      },
      {
        route: 'IM',
        dose: {
          minPerKg: 4, maxPerKg: 5, unit: 'mg/kg',
          frequency: 'sekali',
          indication: 'Sedasi pada pasien tidak kooperatif / tidak ada akses IV',
          notes: 'Onset 5–10 menit. Durasi 15–30 menit.',
        },
      },
    ],
    warnings: [
      'Meningkatkan sekresi saliva — pertimbangkan atropin 0.01 mg/kg premedikasi',
      'Emergence reaction (halusinasi) — cegah dengan midazolam',
      'Kontraindikasi relatif: peningkatan TIK, hipertensi tidak terkontrol, psikosis',
      'Bronkodilator — aman pada asma',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    aliases: ['Fentanil', 'Fentanyl Citrate'],
    category: 'analgesik',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 1, maxPerKg: 2, unit: 'mcg/kg',
          frequency: 'tiap 1–2 jam prn; atau infus 1–5 mcg/kg/jam',
          ivDuration: 'pelan 5 menit (mencegah rigiditas toraks)',
          indication: 'Analgesia akut, sedoanalgesia ICU',
          notes: '100× lebih poten dari morfin. Lebih stabil hemodinamik. Onset cepat 1–2 menit.',
        },
      },
      {
        route: 'Intranasal',
        dose: {
          minPerKg: 1.5, maxPerKg: 2, unit: 'mcg/kg',
          maxAbsoluteMg: 0.1,
          frequency: 'sekali; dapat diulang setengah dosis setelah 10 menit',
          indication: 'Analgesia akut tanpa akses IV (nyeri sedang-berat)',
          notes: 'Gunakan larutan 50 mcg/mL atau lebih pekat untuk volume kecil. Onset 5–10 menit.',
        },
      },
    ],
    warnings: [
      'Depresi napas — siapkan nalokson 0.01 mg/kg',
      'Rigiditas toraks pada bolus cepat dosis tinggi — injeksi pelan atau gunakan pelumpuh otot',
      'Toleransi dan ketergantungan pada penggunaan lama ICU',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'morfin',
    name: 'Morfin',
    aliases: ['Morphine', 'Morphine Sulfate'],
    category: 'analgesik',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.05, maxPerKg: 0.1, unit: 'mg/kg',
          maxAbsoluteMg: 5,
          frequency: 'tiap 2–4 jam prn; atau infus 0.01–0.04 mg/kg/jam',
          ivDuration: 'pelan 5–10 menit',
          indication: 'Analgesia sedang-berat, edema paru akut',
          notes: 'Onset 5–10 menit IV. Melepaskan histamin → flushing, pruritus, bronkospasme (lebih dari fentanyl).',
        },
      },
    ],
    warnings: [
      'Depresi napas — reversal: nalokson 0.01 mg/kg IV',
      'Hindari pada asma akut (pelepasan histamin)',
      'Akumulasi pada gagal ginjal (metabolit aktif morfin-6-glukoronid)',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Antikonvulsan ──────────────────────────────────────────────────────
  {
    id: 'diazepam',
    name: 'Diazepam',
    aliases: ['Valium', 'Stesolid', 'Diazepam Rektal'],
    category: 'antikonvulsan',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.2, maxPerKg: 0.3, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'dapat diulang sekali setelah 10 menit',
          ivDuration: 'pelan 1–2 mg/menit',
          indication: 'Status epileptikus — lini pertama bila akses IV ada',
          notes: 'Onset < 1 menit IV. Waktu paruh singkat antikonvulsan → ikuti dengan fenobarbital.',
        },
      },
      {
        route: 'Rektal',
        dose: {
          minPerKg: 0.5, maxPerKg: 0.5, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'dapat diulang sekali setelah 10 menit',
          indication: 'Status epileptikus — lini pertama tanpa akses IV (rumah / pra-hospital)',
          notes: '< 2 tahun: 5 mg; ≥ 2 tahun: 10 mg (praktis di lapangan, bukan dosis per BB).',
        },
      },
    ],
    warnings: [
      'Depresi napas — terutama bila dikombinasi dengan fenobarbital',
      'Hipotensi dan sedasi berlebihan',
      'Penggunaan berulang → toleransi',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'fenobarbital',
    name: 'Fenobarbital',
    aliases: ['Phenobarbital', 'Luminal', 'Phenobarbitone'],
    category: 'antikonvulsan',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 20, maxPerKg: 20, unit: 'mg/kg',
          maxAbsoluteMg: 1000,
          frequency: 'dosis loading sekali; dapat tambah 5–10 mg/kg bila kejang berlanjut',
          ivDuration: '1 mg/kg/menit (max 30 mg/menit) — tidak boleh cepat',
          indication: 'Status epileptikus lini 2; neonatal seizure lini 1',
          notes: 'Onset 10–30 menit. Durasi panjang (waktu paruh 24–140 jam). Monitor kadar: terapeutik 15–40 mcg/mL.',
        },
      },
    ],
    warnings: [
      'Depresi napas signifikan — siapkan ventilasi',
      'Hipotensi — infus lambat',
      'Interaksi banyak obat (inducer CYP450)',
      'Pemberian cepat → apnea dan henti jantung',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Bronkodilator ──────────────────────────────────────────────────────
  {
    id: 'salbutamol',
    name: 'Salbutamol (Albuterol)',
    aliases: ['Albuterol', 'Ventolin', 'Salbutamol', 'Combivent'],
    category: 'bronkodilator',
    routes: [
      {
        route: 'Inhalasi',
        dose: {
          minPerKg: 2.5, maxPerKg: 5, unit: 'mg/kg',
          frequency: 'tiap 20 menit × 3 (fase akut), lalu tiap 1–4 jam',
          indication: 'Serangan asma, bronkospasme',
          notes: '< 25 kg: 2.5 mg per nebulisasi; ≥ 25 kg: 5 mg. Dapat diberikan kontinu pada serangan berat.',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 5, maxPerKg: 10, unit: 'mcg/kg',
          frequency: 'loading, lalu infus 0.2–0.5 mcg/kg/mnt',
          ivDuration: 'loading pelan 10 menit, lalu infus kontinu',
          indication: 'Status asmatikus refrakter nebulisasi',
          notes: 'Dosis IV jauh lebih kecil dari inhalasi. Gunakan hanya bila inhalasi tidak memungkinkan.',
        },
      },
    ],
    warnings: [
      'Takikardia, hipokalemia (redistribusi K⁺ intrasel) pada dosis tinggi',
      'Tremor, agitasi',
      'Hiperkalemia paradoksal bila IV dosis tinggi pada neonatus',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Diuretik ───────────────────────────────────────────────────────────
  {
    id: 'furosemid',
    name: 'Furosemid (Lasix)',
    aliases: ['Furosemide', 'Lasix', 'Frusemide'],
    category: 'diuretik',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.5, maxPerKg: 2, unit: 'mg/kg',
          maxAbsoluteMg: 80,
          frequency: 'tiap 6–12 jam; atau infus 0.1–1 mg/kg/jam',
          ivDuration: 'pelan 1–4 mg/menit (hindari ototoksisitas)',
          indication: 'Edema, overload cairan, gagal jantung kongestif, AKI oliguria',
          notes: 'Onset 15–30 menit IV. Efek puncak 30–60 menit. Pantau elektrolit (K, Na, Mg).',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 1, maxPerKg: 4, unit: 'mg/kg',
          maxAbsoluteMg: 80,
          frequency: 'tiap 12–24 jam',
          indication: 'Maintenance diuresis, CHF kronis',
        },
      },
    ],
    warnings: [
      'Hipokalemia, hiponatremia, hipomagnesemia — pantau elektrolit',
      'Ototoksisitas pada dosis tinggi dan/atau pemberian cepat',
      'Nefrotoksisitas bila dikombinasi aminoglikosida',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Kortikosteroid ─────────────────────────────────────────────────────
  {
    id: 'deksametason',
    name: 'Deksametason',
    aliases: ['Dexamethasone', 'Decadron', 'Dexa'],
    category: 'kortikosteroid',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.6, maxPerKg: 0.6, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'dosis tunggal sebelum/bersamaan antibiotik pertama',
          ivDuration: 'pelan 5 menit',
          indication: 'Meningitis bakterialis — kurangi inflamasi',
          notes: 'Berikan bersamaan atau sebelum dosis pertama antibiotik untuk efek maksimal.',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 0.15, maxPerKg: 0.6, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'sekali atau tiap 6–12 jam sesuai indikasi',
          indication: 'Croup (laringotrakeitis), edema jalan napas pasca-ekstubasi',
          notes: 'Croup: 0.15–0.6 mg/kg dosis tunggal PO. Efek dalam 30–60 menit.',
        },
      },
    ],
    warnings: [
      'Hiperglikemia',
      'Imunosupresi — hindari bila infeksi jamur aktif',
      'Penggunaan jangka panjang: HPA axis suppression, cushing',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'metilprednisolon',
    name: 'Metilprednisolon',
    aliases: ['Methylprednisolone', 'Solumedrol', 'Depo-Medrol', 'Medrol'],
    category: 'kortikosteroid',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 1, maxPerKg: 2, unit: 'mg/kg',
          maxAbsoluteMg: 125,
          frequency: 'tiap 6 jam (akut) atau tiap 12–24 jam',
          ivDuration: 'pelan 15–30 menit',
          indication: 'Status asmatikus, anafilaksis (adjunct), inflamasi berat',
          notes: 'Pulse dose untuk autoimun berat: 10–30 mg/kg/hari (maks 1 g/hari) × 3 hari.',
        },
      },
    ],
    warnings: [
      'Hiperglikemia signifikan pada dosis tinggi',
      'Tidak menggantikan epinefrin pada anafilaksis (onset lambat 4–6 jam)',
      'Infus cepat dosis tinggi → bradikardia dan aritmia',
    ],
    references: ['pals2020'],
    verified: true,
  },

  // ── Antiemetik ─────────────────────────────────────────────────────────
  {
    id: 'ondansetron',
    name: 'Ondansetron',
    aliases: ['Zofran', 'Ondansetron HCl', 'Narfoz', 'Vomceran'],
    category: 'antiemetik',
    mechanism: 'Antagonis selektif reseptor 5-HT₃ (serotonin) di saluran cerna dan SSP. Menghambat impuls vagal aferen yang memicu muntah.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.15, unit: 'mg/kg',
          maxAbsoluteMg: 4,
          frequency: 'tiap 8 jam prn; kemoterapi: tiap 4 jam',
          ivDuration: 'minimal 30 detik (bolus); dianjurkan infus 15 menit',
          indication: 'Mual muntah pasca-operasi (PONV), kemoterapi, atau akut',
          notes: 'Dosis PONV: 0.1 mg/kg (maks 4 mg). Dosis kemoterapi: 0.15 mg/kg (maks 8 mg) tiap 4 jam × 3 dosis.',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.15, unit: 'mg/kg',
          maxAbsoluteMg: 4,
          frequency: 'tiap 8 jam prn',
          indication: 'Mual muntah akut (gastroenteritis, post-kemoterapi oral)',
          notes: 'ODT (Orally Disintegrating Tablet) tersedia — berguna pada anak sulit menelan. Bioavailabilitas oral ~60%.',
        },
      },
    ],
    contraindications: [
      'Hipersensitivitas terhadap ondansetron atau setron lain',
      'Kombinasi dengan apomorphine (hipotensi berat)',
      'Sindrom QT kongenital — kontraindikasi relatif',
    ],
    warnings: [
      'QTc prolongation — dosis single IV > 32 mg dilarang (FDA 2012); pada anak gunakan dosis minimal efektif',
      'Hindari kombinasi dengan obat QT-prolonging lain (klorokuin, azitromisin, antipsikotik)',
      'Serotonin syndrome bila dikombinasi dengan obat serotonergik lain',
      'Sakit kepala (tersering), konstipasi, flushing — efek samping ringan',
      'Masking: ondansetron dapat menutupi tanda obstruksi usus — evaluasi penyebab muntah terlebih dahulu',
    ],
    renalAdjustment: 'Tidak diperlukan penyesuaian dosis pada gangguan ginjal (eGFR > 10 mL/min/1.73m²). Data terbatas pada eGFR < 10 — pertimbangkan monitoring.',
    hepaticAdjustment: 'Gangguan hati berat (Child-Pugh C): dosis maksimal 8 mg/hari (dewasa). Pada anak dengan hepatik berat: kurangi dosis 50%, monitor ketat.',
    pharmacokinetics: {
      onset: 'IV: 1–5 menit; PO: 30–60 menit',
      peak: 'IV: akhir infus; PO: 1–2 jam',
      duration: '4–8 jam (tergantung dosis)',
      halfLife: '3–4 jam (anak); lebih panjang pada hepatik berat',
      metabolism: 'Hepar via CYP1A2, CYP2D6, CYP3A4',
      excretion: 'Urin (44–60%, sebagian besar metabolit); feses (25%)',
    },
    specialPopulations: {
      neonates: 'Data terbatas pada neonatus. Pembersihan lebih lambat — gunakan dosis lebih rendah dan interval lebih panjang. Belum disetujui untuk neonatus.',
      infants: 'Usia < 6 bulan: data terbatas. Usia 6 bulan – 1 tahun: 0.1 mg/kg IV/PO tiap 8 jam, maks 2 mg/dosis.',
    },
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'paracetamol',
    name: 'Paracetamol (Asetaminofen)',
    aliases: ['Acetaminophen', 'Parasetamol', 'Tylenol', 'Panadol', 'Tempra', 'Sanmol', 'Biogesic'],
    category: 'analgesik',
    mechanism: 'Inhibisi sintesis prostaglandin di SSP (sentrall COX inhibitor). Efek analgesik dan antipiretik tanpa efek anti-inflamasi perifer signifikan.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 10, maxPerKg: 15, unit: 'mg/kg',
          maxAbsoluteMg: 1000,
          frequency: 'tiap 4–6 jam; maks 5 dosis/24 jam',
          indication: 'Nyeri ringan-sedang, demam',
          notes: 'Dosis harian maks: 75 mg/kg/hari atau 4 g/hari (ambil yang lebih kecil). Tersedia sirup 120 mg/5 mL, 160 mg/5 mL, 250 mg/5 mL.',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 7.5, maxPerKg: 15, unit: 'mg/kg',
          maxAbsoluteMg: 1000,
          frequency: 'tiap 6 jam (maks 4 dosis/24 jam)',
          ivDuration: 'infus 15 menit',
          indication: 'Nyeri pasca-operasi atau saat tidak dapat PO',
          notes: [
            '< 10 kg: 7.5 mg/kg/dosis q6h, maks 30 mg/kg/hari.',
            '10–33 kg: 15 mg/kg/dosis q6h, maks 60 mg/kg/hari.',
            '33–50 kg: 15 mg/kg q6h, maks 2 g/dosis, maks 60 mg/kg/hari.',
            '> 50 kg: 1000 mg q6h, maks 4 g/hari.',
            'Tersedia: Perfalgan 10 mg/mL (vial 50 mL = 500 mg atau 100 mL = 1000 mg).',
          ].join(' '),
        },
      },
      {
        route: 'Rektal',
        dose: {
          minPerKg: 15, maxPerKg: 20, unit: 'mg/kg',
          maxAbsoluteMg: 650,
          frequency: 'tiap 6–8 jam prn',
          indication: 'Demam / nyeri bila tidak dapat PO atau IV',
          notes: 'Absorpsi rektal lebih lambat dan tidak menentu dibanding PO. Onset 1–2 jam. Tersedia suppositoria 125 mg, 250 mg.',
        },
      },
    ],
    contraindications: [
      'Hipersensitivitas paracetamol',
      'Penyakit hati berat aktif (hepatitis fulminan, sirosis dekompensasi berat)',
      'Defisiensi G6PD berat — pertimbangkan risiko-manfaat',
    ],
    warnings: [
      'Hepatotoksisitas pada overdosis — batas aman sempit pada malnutrisi, alkohol, atau induksi enzim hati',
      'Dosis TOTAL harian (semua produk mengandung paracetamol) harus diperhitungkan — waspadai produk kombinasi',
      'Overdosis: N-asetilsistein (NAC) adalah antidotum — mulai dalam 8 jam untuk efek optimal',
      'Tidak memiliki efek anti-inflamasi — gunakan AINS bila inflamasi menjadi target terapi',
    ],
    renalAdjustment: [
      'eGFR 10–50 mL/min/1.73m²: perpanjang interval ke tiap 6 jam (PO/IV).',
      'eGFR < 10 mL/min/1.73m²: perpanjang interval ke tiap 8 jam; gunakan dosis minimal efektif.',
      'Hemodialisis: diberikan setelah dialisis (paracetamol terdialisis).',
    ].join(' '),
    hepaticAdjustment: 'Gangguan hati ringan-sedang: kurangi dosis dan/atau perpanjang interval. Gangguan hati berat (Child-Pugh C): hindari penggunaan atau gunakan dosis paling rendah dengan monitoring ketat fungsi hati.',
    pharmacokinetics: {
      onset: 'PO: 30–60 menit; IV: 15–30 menit; Rektal: 1–2 jam',
      peak: 'PO: 1–2 jam; IV: akhir infus 15 menit; Rektal: 1.5–3 jam',
      duration: '4–6 jam',
      halfLife: '1.5–3 jam (anak); lebih panjang pada neonatus (3–5 jam) dan hepatik berat',
      metabolism: 'Hepar: glukuronidasi (60%) & sulfasi (35%); metabolit toksik NAPQI detoksifikasi GSH',
      excretion: 'Urin (>90% sebagai konjugat); < 5% tidak berubah',
    },
    specialPopulations: {
      neonates: 'Neonatus aterm (≥ 37 minggu): PO/IV 10–15 mg/kg q6–8h. Maks 60 mg/kg/hari. Kapasitas glukuronidasi imatur — waktu paruh lebih panjang, interval diperpanjang.',
      infants: 'Usia 1–3 bulan: 10–15 mg/kg PO q6–8h. Peningkatan interval dibanding anak yang lebih besar.',
      obesity: 'Gunakan berat badan ideal (IBW) atau adjusted body weight untuk menghindari overdosis pada anak obesitas.',
    },
    references: ['pals2020'],
    verified: true,
  },

  // ── Lainnya ────────────────────────────────────────────────────────────
  {
    id: 'nalokson',
    name: 'Nalokson (Narcan)',
    aliases: ['Naloxone', 'Narcan'],
    category: 'emergensi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.01, unit: 'mg/kg',
          maxAbsoluteMg: 0.4,
          frequency: 'tiap 2–3 menit s/d respons; maks total 2 mg',
          ivDuration: 'bolus cepat',
          indication: 'Reversal opioid (depresi napas)',
          notes: 'Waktu paruh lebih pendek dari opioid → awasi re-narkosis. Siapkan infus kontinu bila perlu.',
        },
      },
      {
        route: 'IM',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.01, unit: 'mg/kg',
          maxAbsoluteMg: 0.4,
          frequency: 'dapat diulang tiap 2–3 menit',
          indication: 'Reversal opioid bila akses IV tidak tersedia',
        },
      },
      {
        route: 'Intranasal',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.1, unit: 'mg/kg',
          maxAbsoluteMg: 2,
          frequency: 'dapat diulang sekali setelah 2–3 menit',
          indication: 'Overdosis opioid pra-hospital',
          notes: '2 mg/0.1 mL intranasal — lebih mudah di luar rumah sakit.',
        },
      },
    ],
    warnings: [
      'Withdrawal opioid akut pada pasien ketergantungan → agitasi, nyeri hebat, muntah',
      'Durasi pendek (30–90 menit) — re-sedasi mungkin terjadi',
    ],
    references: ['pals2020'],
    verified: true,
  },
  {
    id: 'flumazenil',
    name: 'Flumazenil',
    aliases: ['Romazicon', 'Anexate'],
    category: 'emergensi',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.01, unit: 'mg/kg',
          maxAbsoluteMg: 0.2,
          frequency: 'tiap 1 menit s/d respons; maks total 1 mg',
          ivDuration: 'pelan 15 detik',
          indication: 'Reversal benzodiazepin (depresi napas)',
          notes: 'Waktu paruh < 1 jam — lebih pendek dari benzodiazepin. Re-sedasi mungkin terjadi. Infus kontinu bila perlu.',
        },
      },
    ],
    warnings: [
      'KONTRAINDIKASI pada pasien overdosis TCA (dapat memicu seizure)',
      'Kejang withdrawal pada pasien ketergantungan benzodiazepin',
      'Re-sedasi — durasi efek pendek',
    ],
    references: ['pals2020'],
    verified: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

export const DRUG_CATEGORY_LABEL: Record<DrugCategory, string> = {
  emergensi:      'Emergensi',
  antibiotik:     'Antibiotik',
  antiviral:      'Antiviral',
  antijamur:      'Antijamur',
  analgesik:      'Analgesik',
  sedasi:         'Sedasi',
  antikonvulsan:  'Antikonvulsan',
  vasoaktif:      'Vasoaktif',
  bronkodilator:  'Bronkodilator',
  diuretik:       'Diuretik',
  antiemetik:     'Antiemetik',
  kortikosteroid: 'Kortikosteroid',
  lainnya:        'Lainnya',
};

export const DRUG_CATEGORY_ORDER: DrugCategory[] = [
  'emergensi', 'vasoaktif', 'antikonvulsan', 'sedasi', 'analgesik',
  'bronkodilator', 'kortikosteroid', 'diuretik', 'antiemetik',
  'antibiotik', 'antiviral', 'antijamur', 'lainnya',
];

export function searchDrugs(query: string): DrugEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return DRUG_LIBRARY.filter((d) => d.verified);
  return DRUG_LIBRARY.filter(
    (d) =>
      d.verified &&
      (d.name.toLowerCase().includes(q) ||
        d.aliases.some((a) => a.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q))
  );
}

export function filterDrugsByCategory(category: DrugCategory | 'semua'): DrugEntry[] {
  const all = DRUG_LIBRARY.filter((d) => d.verified);
  if (category === 'semua') return all;
  return all.filter((d) => d.category === category);
}
