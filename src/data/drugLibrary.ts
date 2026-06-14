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
  | 'antiparasit'      // antimalaria, antihelmintik
  | 'antiretroviral'   // ARV / HIV
  | 'antidotum'        // toksikologi & kelasi
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
  /**
   * Dosis tetap / tidak per-kg (mis. dosis berbasis usia atau satuan gram).
   * Bila diisi, UI menampilkan teks ini dan TIDAK melakukan perhitungan per-kg
   * (mencegah hasil menyesatkan). minPerKg/maxPerKg diabaikan untuk kalkulasi.
   */
  fixedDose?: string;
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

  {
    id: 'digoksin',
    name: 'Digoksin',
    aliases: ['Digoxin', 'Lanoxin', 'Fargoxin'],
    category: 'vasoaktif',
    mechanism: 'Glikosida jantung. Inhibisi pompa Na⁺/K⁺-ATPase → ↑ Ca²⁺ intrasel → inotropik positif; ↑ tonus vagal → memperlambat konduksi AV (kronotropik negatif).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 3, maxPerKg: 5, unit: 'mcg/kg',
          frequency: 'tiap 12 jam (dosis rumatan)',
          ivDuration: 'perlahan 5–10 menit; hindari IV cepat (vasokonstriksi koroner)',
          indication: 'Gagal jantung; rumatan',
          notes: 'Rumatan 3–5 mcg/kg/dosis tiap 12 jam [16]. Total dosis digitalisasi (loading) bersifat per-usia (mis. bayi 1 bln–2 th 30–50 mcg/kg IV; >10 th 8–12 mcg/kg) — lihat tabel sumber & konfirmasi sebelum loading. Pada aritmia: 10 mcg/kg lalu 5–10 mcg/kg/dosis tiap 8 jam × 2.',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 3, maxPerKg: 5, unit: 'mcg/kg',
          frequency: 'tiap 12 jam (dosis rumatan)',
          indication: 'Rumatan oral gagal jantung',
          notes: 'Rumatan 3–5 mcg/kg/dosis tiap 12 jam (anak < 10 th); sekali sehari pada > 10 th [16]. Berikan 1 jam sebelum / 2 jam sesudah makan; hindari serat tinggi/pektin.',
        },
      },
    ],
    contraindications: [
      'Kardiomiopati hipertrofik obstruktif (kecuali bila disertai gagal jantung berat)',
      'Sindrom Wolff-Parkinson-White / accessory pathway, terutama dengan fibrilasi atrium',
      'Blok jantung total intermiten; blok AV derajat 2',
    ],
    warnings: [
      'Hipokalemia meningkatkan toksisitas — pantau & koreksi kalium',
      'Indeks terapi sempit — pantau gejala toksisitas: anoreksia, mual, gangguan penglihatan, aritmia, blok jantung',
      'Hindari pemberian IV cepat (mual & risiko aritmia)',
      'Lakukan EKG untuk deteksi intoksikasi',
    ],
    renalAdjustment: 'Kurangi dosis rumatan pada gangguan ginjal; ESRD: kurangi total dosis digitalisasi 50%. ClCr 10–15 mL/min: 25–75% dosis normal; ClCr < 10: 10–25% dosis normal.',
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'nifedipin',
    name: 'Nifedipin',
    aliases: ['Nifedipine', 'Adalat', 'Farmalat'],
    category: 'vasoaktif',
    mechanism: 'Antagonis kanal kalsium golongan dihidropiridin → relaksasi otot polos arteriol → vasodilatasi & penurunan tekanan darah.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0.25, maxPerKg: 0.5, unit: 'mg/kg',
          maxAbsoluteMg: 10,
          frequency: 'tiap 4–6 jam prn (maks 1–2 mg/kg/hari)',
          indication: 'Krisis hipertensi',
          notes: 'Krisis hipertensi: 0,25–0,5 mg/kg/dosis, maks 10 mg/dosis [16]. Pantau ketat — penurunan TD mendadak dapat membahayakan; sediaan kerja cepat kontroversial pada emergensi hipertensi.',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 0.25, maxPerKg: 0.5, unit: 'mg/kg',
          maxAbsoluteMg: 180,
          frequency: '1–2 kali/hari (sustained release); titrasi',
          indication: 'Hipertensi kronik',
          notes: 'Dosis awal 0,25–0,5 mg/kg/hari (SR), dititrasi; maks 3 mg/kg/hari hingga 180 mg/hari [16].',
        },
      },
    ],
    contraindications: [
      'Syok kardiogenik',
      'Stenosis aorta berat',
      'Angina akut atau tidak stabil',
      'Porfiria',
    ],
    warnings: [
      'Hentikan bila timbul / bertambah nyeri iskemik setelah pengobatan',
      'Hati-hati pada gagal jantung / disfungsi ventrikel kiri',
      'Kurangi dosis pada gangguan fungsi hati',
      'Hindari konsumsi bersama jus anggur (menghambat metabolisme)',
      'Refleks takikardia, edema, sakit kepala, flushing',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'nitroprusid',
    name: 'Natrium Nitroprusid',
    aliases: ['Sodium Nitroprusside', 'Nipride', 'SNP'],
    category: 'vasoaktif',
    mechanism: 'Vasodilator langsung (donor nitric oxide) pada arteri & vena → menurunkan afterload & preload. Onset cepat, durasi sangat singkat.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.3, maxPerKg: 8, unit: 'mcg/kg',
          frequency: 'infus kontinu (mcg/kg/menit)',
          ivDuration: 'infus titrasi; lindungi dari cahaya',
          indication: 'Krisis hipertensi (bila terapi oral tidak memungkinkan)',
          notes: 'Awal 0,3–0,5 mcg/kg/menit, dititrasi; rumatan ~3 mcg/kg/menit; maks 8–10 mcg/kg/menit [16]. Jangan dihentikan tiba-tiba — turunkan dalam 15–30 menit (hindari rebound).',
        },
      },
    ],
    contraindications: [
      'Gangguan fungsi hati berat',
      'Hipertensi kompensatoar',
      'Defisiensi vitamin B12 berat',
      'Atrofi optik',
    ],
    warnings: [
      'Toksisitas sianida/tiosianat — pantau kadar bila infus > 3 hari atau dosis tinggi',
      'Hipotensi berat akibat penurunan TD cepat',
      'Asidosis metabolik / takikardia tak terjelaskan → hentikan infus, beri antidot',
      'Lindungi larutan & jalur infus dari cahaya',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'propranolol',
    name: 'Propranolol',
    aliases: ['Propranolol HCl', 'Inderal', 'Farmadral'],
    category: 'vasoaktif',
    mechanism: 'Penghambat reseptor β-adrenergik non-selektif. Menurunkan denyut & kontraktilitas jantung, memperlambat konduksi AV; menurunkan tekanan darah.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0.5, maxPerKg: 4, unit: 'mg/kg',
          maxAbsoluteMg: 60,
          frequency: 'terbagi tiap 6–8 jam (dosis/hari)',
          indication: 'Aritmia / hipertensi',
          notes: 'Aritmia: awal 0,5–1 mg/kg/hari, umum 2–4 mg/kg/hari; maks 16 mg/kg/hari atau 60 mg/hari [16]. Hipertensi: 1–5 mg/kg/hari (maks 8 mg/kg/hari).',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 0.01, maxPerKg: 0.1, unit: 'mg/kg',
          maxAbsoluteMg: 3,
          frequency: 'dapat diulang',
          ivDuration: 'injeksi lambat 10 menit (≤ 1 mg/menit)',
          indication: 'Aritmia akut',
          notes: 'Maks 1 mg (bayi) / 3 mg (anak) [16]. Tetralogy spell (sianotik ToF): 0,15–0,25 mg/kg IV pelan 10 menit, dapat diulang 1×; atau PO 1 mg/kg/hari.',
        },
      },
    ],
    contraindications: [
      'Gagal jantung kongestif dekompensasi, syok kardiogenik',
      'Sinus bradikardia, sick sinus syndrome, blok jantung > derajat 1 (tanpa pacemaker)',
      'Asma & penyakit jalan napas hiperaktif',
      'PPOK / penyakit paru obstruktif kronik',
    ],
    warnings: [
      'Bronkospasme — hindari pada penyakit bronkospastik',
      'Hipoglikemia, terutama pada bayi & anak (sering saat puasa) — dan menyamarkan tandanya',
      'Menyamarkan tanda klinis hipertiroidisme',
      'Hati-hati pada gangguan fungsi ginjal/hati, DM, penyakit vaskular perifer',
    ],
    references: ['idai2012'],
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
    references: ['idai2012', 'pals2020'],
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
    references: ['idai2012', 'aes2016', 'pals2020'],
    verified: true,
  },
  {
    id: 'fenitoin',
    name: 'Fenitoin',
    aliases: ['Phenytoin', 'Dilantin', 'Difenilhidantoin'],
    category: 'antikonvulsan',
    mechanism: 'Menstabilkan membran neuron dengan menghambat kanal natrium voltage-gated, membatasi penjalaran muatan listrik repetitif. Efektif pada kejang fokal dan tonik-klonik umum.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 20, unit: 'mg/kg',
          maxAbsoluteMg: 1500,
          frequency: 'dosis muat (loading) sekali',
          ivDuration: 'kecepatan ≤ 1 mg/kg/menit (maks 50 mg/menit); monitor EKG & tekanan darah',
          indication: 'Status epileptikus — lini kedua setelah benzodiazepin',
          notes: 'IDAI: bolus 15 mg/kg, kecepatan 1 mg/kg/mnt (maks 50 mg/mnt) [16]. AES 2016: dosis muat 20 mg/kg, maks 1500 mg/dosis [18]. Fosfenitoin (bila tersedia) lebih disukai — dapat IM & lebih sedikit iritasi vena. ESETT 2019: levetirasetam & valproat setara efektif sebagai lini kedua [19].',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 4, maxPerKg: 8, unit: 'mg/kg',
          maxAbsoluteMg: 300,
          frequency: 'dibagi 2 dosis/hari (dosis per hari)',
          indication: 'Rumatan epilepsi (kejang umum tonik-klonik / parsial)',
          notes: 'IDAI: dosis awal 5 mg/kg/hari (2 dosis), umum 4–8 mg/kg/hari, maks 300 mg [16]. Target kadar plasma 10–20 mg/L. Sebaiknya diminum saat/ setelah makan.',
        },
      },
    ],
    contraindications: [
      'Porfiria',
      'Sinus bradikardia, blok sinoatrial, blok jantung derajat 2 & 3, sindrom Stokes-Adams (untuk pemberian parenteral)',
      'Hipersensitivitas terhadap fenitoin / hidantoin',
    ],
    warnings: [
      'Pemberian IV terlalu cepat → depresi SSP & kardiovaskular: aritmia, hipotensi, kolaps. Sediakan fasilitas resusitasi',
      'Indeks terapi sempit — banyak interaksi obat; pantau kadar plasma',
      'Ruam kulit → hentikan; risiko sindrom Stevens-Johnson & nekrolisis epidermal toksik (jarang)',
      'Pemakaian lama: hiperplasia gingiva, hirsutisme, osteomalasia, anemia megaloblastik (terapi asam folat)',
      'Ekstravasasi → iritasi jaringan berat (purple glove syndrome)',
    ],
    hepaticAdjustment: 'Gangguan fungsi hati: turunkan dosis dan pantau kadar plasma ketat (metabolisme hepatik tergantung kapasitas, kinetik saturasi/non-linier).',
    pharmacokinetics: {
      onset: 'IV: efek antikejang dalam menit setelah loading',
      halfLife: '7–42 jam (non-linier / saturable — perubahan kecil dosis dapat melonjakkan kadar)',
      metabolism: 'Hepar (CYP2C9, CYP2C19); kinetik Michaelis-Menten',
      excretion: 'Urin (sebagian besar sebagai metabolit)',
    },
    specialPopulations: {
      neonates: 'Kejang yang tidak teratasi fenobarbital — dosis awal IV 15–20 mg/kg; status epileptikus neonatus: bolus 15–20 mg/kg kecepatan 1–3 mg/kg/mnt. Rumatan dimulai 12 jam setelah loading, dosis bergantung usia koreksi [16].',
    },
    references: ['idai2012', 'aes2016', 'esett2019'],
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

  {
    id: 'aminofilin',
    name: 'Aminofilin / Teofilin',
    aliases: ['Aminophylline', 'Theophylline', 'Teofilin'],
    category: 'bronkodilator',
    mechanism: 'Metilxantin. Inhibisi fosfodiesterase & antagonis reseptor adenosin → bronkodilatasi otot polos saluran napas; stimulasi pusat napas (berguna pada apnea prematur).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 5, maxPerKg: 5, unit: 'mg/kg',
          frequency: 'dosis muat (bolus)',
          ivDuration: 'IV perlahan minimal 20 menit',
          indication: 'Asma berat akut (yang belum pernah dapat teofilin)',
          notes: 'Bolus 5 mg/kg perlahan ≥ 20 menit [16]. Rumatan infus: 6 bln–9 th 1 mg/kg/jam. Target kadar plasma 10–20 mg/L (indeks terapi sempit). JANGAN beri IV bila pasien sudah memakai teofilin tanpa cek kadar plasma lebih dulu.',
        },
      },
    ],
    contraindications: [
      'Porfiria',
      'Hipersensitif terhadap etilendiamin (komponen aminofilin)',
    ],
    warnings: [
      'Indeks terapi sempit — toksisitas: mual, gelisah, tremor, takikardia, palpitasi, kejang',
      'Aritmia & hipotensi terutama bila IV diberikan terlalu cepat',
      'Hati-hati pada penyakit jantung, hipertensi, hipertiroid, epilepsi, gangguan hati, demam, tukak lambung',
    ],
    specialPopulations: {
      neonates: 'Apnea prematuritas: dosis awal 6 mg/kg. Rumatan IV per usia: ≤ 7 hari 2,5 mg/kg/kali tiap 12 jam; 8–14 hari 3 mg/kg/kali tiap 12 jam; > 14 hari 4 mg/kg/kali tiap 12 jam [16].',
    },
    references: ['idai2012'],
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
    references: ['idai2012', 'pals2020'],
    verified: true,
  },
  {
    id: 'manitol',
    name: 'Manitol',
    aliases: ['Mannitol', 'Osmitrol'],
    category: 'diuretik',
    mechanism: 'Diuretik osmotik. Meningkatkan osmolaritas plasma → menarik air dari jaringan (termasuk otak) ke intravaskular, menurunkan tekanan intrakranial & intraokular; meningkatkan diuresis osmotik.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 500, maxPerKg: 1000, unit: 'mg/kg',
          frequency: 'dosis awal (bolus)',
          ivDuration: 'infus, gunakan filter IV',
          indication: 'Edema serebral / hipertensi intrakranial, tekanan intraokular meningkat',
          notes: 'Dosis awal 0,5–1 g/kgBB (500–1000 mg/kg) [16]. Pertahankan osmolalitas serum 310–320 mOsm/kg. BTBF 2019: manitol tidak punya rekomendasi berbasis bukti pada cedera otak berat anak; salin hipertonik 3% (2–5 mL/kg bolus) menjadi pilihan terapi hiperosmolar [20].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 250, maxPerKg: 500, unit: 'mg/kg',
          frequency: 'tiap 4–6 jam',
          ivDuration: 'infus, gunakan filter IV',
          indication: 'Dosis pemeliharaan hipertensi intrakranial',
          notes: 'Dosis pemeliharaan 0,25–0,5 g/kgBB (250–500 mg/kg) tiap 4–6 jam [16]. Pantau keseimbangan cairan, elektrolit, dan fungsi ginjal.',
        },
      },
    ],
    contraindications: [
      'Edema paru dengan overload cairan intravaskular',
      'Perdarahan intrakranial (kecuali selama kraniotomi)',
      'Gagal jantung berat',
      'Dehidrasi berat',
      'Gagal ginjal anurik (kecuali dosis percobaan menghasilkan diuresis)',
    ],
    warnings: [
      'Pantau ketat keseimbangan cairan, elektrolit, dan fungsi ginjal',
      'Overload sirkulasi → edema paru, terutama pada gangguan jantung',
      'Gagal ginjal akut pada dosis tinggi',
      'Larutan > 15% dapat mengkristal — larutkan dengan pemanasan sebelum pakai; jangan beri larutan berkristal',
      'Jangan diberikan bersama darah atau melalui jalur transfusi',
    ],
    references: ['idai2012', 'kochanek2019'],
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

  {
    id: 'hidrokortison',
    name: 'Hidrokortison',
    aliases: ['Hydrocortisone', 'Kortisol', 'Solu-Cortef'],
    category: 'kortikosteroid',
    mechanism: 'Glukokortikoid (juga aktivitas mineralokortikoid). Efek anti-inflamasi & imunosupresif; terapi pengganti pada insufisiensi adrenal; menstabilkan respons vaskular pada syok.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 4, maxPerKg: 8, unit: 'mg/kg',
          maxAbsoluteMg: 250,
          frequency: 'loading; rumatan 2 mg/kg/dosis tiap 6 jam',
          ivDuration: 'IV lambat',
          indication: 'Asma berat / status asmatikus',
          notes: 'Loading 4–8 mg/kg (maks 250 mg), rumatan 2 mg/kg/dosis tiap 6 jam [16].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 1, maxPerKg: 2, unit: 'mg/kg',
          frequency: 'bolus, lalu dosis terbagi tiap 6–8 jam',
          ivDuration: 'IV bolus / IM',
          indication: 'Insufisiensi adrenal akut',
          notes: 'Bayi & anak: 1–2 mg/kg IV bolus, lalu 25–150 mg/hari dalam dosis terbagi tiap 6–8 jam [16].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 50, maxPerKg: 50, unit: 'mg/kg',
          frequency: 'ulang tiap 4 jam dan/atau 24 jam prn',
          ivDuration: 'IV (natrium suksinat)',
          indication: 'Syok (refrakter)',
          notes: 'Awal 50 mg/kg, dapat diulang tiap 4 jam dan/atau 24 jam jika perlu [16]. Anafilaksis (dosis tetap per usia): > 1 th 25 mg; 1–5 th 50 mg; 6–12 th 100 mg IV lambat.',
        },
      },
    ],
    contraindications: [
      'Infeksi sistemik tak terkendali (kecuali kondisi mengancam jiwa atau diberi antibiotik spesifik)',
      'Infeksi jamur atau lesi tuberkulosis aktif',
      'Hindari vaksin virus hidup pada dosis imunosupresif',
    ],
    warnings: [
      'Supresi adrenal pada pemakaian lama — jangan hentikan mendadak (tapering)',
      'Hiperglikemia, hipertensi, retensi cairan & elektrolit',
      'Meningkatkan kerentanan & memperberat infeksi (varisela, morbili)',
      'Ulkus peptikum, miopati steroid; pantau BB, TD, elektrolit, gula darah pada terapi panjang',
    ],
    references: ['idai2012'],
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

  // ── Antibiotik ─────────────────────────────────────────────────────────
  {
    id: 'amikasin',
    name: 'Amikasin',
    aliases: ['Amikacin', 'Amikin'],
    category: 'antibiotik',
    mechanism: 'Aminoglikosida — mengikat subunit ribosom 30S → menghambat sintesis protein bakteri. Bakterisidal terhadap Gram-negatif aerob.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 15, unit: 'mg/kg',
          maxAbsoluteMg: 1500,
          frequency: 'dibagi tiap 8–12 jam (dosis/hari)',
          ivDuration: 'infus 30–60 menit (anak); 1–2 jam (bayi)',
          indication: 'Infeksi Gram-negatif berat, sepsis, ISK',
          notes: '15 mg/kg/hari, maks 1,5 g/hari; hitung dari BB ideal [16]. 1 mgg–10 th: 25 mg/kg hari-1 lalu 18 mg/kg/hari; > 10 th: 20 mg/kg hari-1 lalu 15 mg/kg/hari.',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap aminoglikosida',
      'Insufisiensi ginjal',
    ],
    warnings: [
      'Ototoksik & nefrotoksik — tergantung besar dosis & durasi',
      'Pantau kadar: puncak (1 jam) & nadir/trough sebelum dosis berikut',
      'Bayi prematur/cukup bulan: klirens ginjal imatur → waktu paruh memanjang',
    ],
    renalAdjustment: 'Perpanjang interval pemberian pada gangguan ginjal; pantau kadar obat dan fungsi ginjal.',
    specialPopulations: {
      neonates: 'IV/IM 7,5 mg/kg/dosis; interval per usia koreksi: < 28 mgg tiap 36 jam; 28–29 mgg tiap 24 jam; 30–35 mgg tiap 18 jam; ≥ 36 mgg tiap 12 jam [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'gentamisin',
    name: 'Gentamisin',
    aliases: ['Gentamicin', 'Garamycin'],
    category: 'antibiotik',
    mechanism: 'Aminoglikosida — inhibisi sintesis protein (subunit 30S). Bakterisidal terhadap Gram-negatif aerob; sinergi dengan beta-laktam pada infeksi Gram-positif.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 2, maxPerKg: 3, unit: 'mg/kg',
          frequency: '< 2 mgg: 3 mg/kg tiap 12 jam; 2 mgg–12 th: 2 mg/kg tiap 8 jam',
          ivDuration: 'IV lambat ≥ 3 menit atau infus',
          indication: 'Sepsis, infeksi Gram-negatif, pielonefritis',
          notes: 'Hitung dari BB ideal (neonatus pakai BB sesungguhnya). Pantau kadar puncak (1 jam) < 10 mg/L & trough < 2 mg/L [16].',
        },
      },
    ],
    contraindications: [
      'Myasthenia gravis',
    ],
    warnings: [
      'Ototoksik & nefrotoksik — tergantung besar dosis',
      'Pantau kadar plasma, fungsi ginjal, pendengaran & keseimbangan',
      'Hindari penggunaan jangka panjang',
    ],
    renalAdjustment: 'ClCr 40–60 mL/menit: tiap 12 jam; 20–40: tiap 24 jam; < 20: dosis awal lalu pantau kadar.',
    specialPopulations: {
      neonates: 'IV/IM 5 mg/kg/dosis; interval per BB & usia postnatal (mis. BB ≥ 1200 g: ≤ 7 hari tiap 36 jam, > 7 hari tiap 24 jam; BB < 1200 g: lebih panjang) [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'amoksisilin',
    name: 'Amoksisilin',
    aliases: ['Amoxicillin', 'Amoxsan', 'Amoxil'],
    category: 'antibiotik',
    mechanism: 'Aminopenisilin — menghambat sintesis dinding sel bakteri (ikatan PBP). Bakterisidal.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 25, maxPerKg: 50, unit: 'mg/kg',
          frequency: 'dibagi tiap 8–12 jam (dosis/hari)',
          indication: 'ISPA, otitis media, ISK, pneumonia',
          notes: '> 3 bln & anak: 25–50 mg/kg/hari q8–12h; 1–3 bln: 20–30 mg/kg/hari q12h. Otitis media S. pneumoniae resisten: 80–90 mg/kg/hari q12h. Profilaksis endokarditis: 50 mg/kg 1 jam sebelum prosedur [16]. Dosis tetap: > 10 th 250 mg q8h, < 10 th 125 mg q8h.',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap golongan penisilin',
    ],
    warnings: [
      'Reaksi hipersensitivitas: urtikaria, angioedema, anafilaksis',
      'Ruam eritematosa pada mononukleosis, leukemia limfositik kronik, infeksi HIV',
      'Hati-hati pada gangguan ginjal (kejang pada dosis tinggi/gangguan ginjal)',
    ],
    specialPopulations: {
      neonates: 'IV/IM 25 mg/kg/dosis (infeksi biasa) atau 50 mg/kg/dosis (meningitis/septikemia); interval per usia gestasi [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'amoksiklav',
    name: 'Amoksisilin + Asam Klavulanat',
    aliases: ['Co-amoxiclav', 'Augmentin', 'Clavamox', 'Amoxiclav'],
    category: 'antibiotik',
    mechanism: 'Amoksisilin (aminopenisilin) + asam klavulanat (inhibitor beta-laktamase) → memperluas cakupan terhadap bakteri penghasil beta-laktamase.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 25, maxPerKg: 25, unit: 'mg/kg',
          frequency: 'tiap 6–8 jam (per dosis; dihitung sebagai amoksisilin)',
          ivDuration: 'injeksi IV perlahan',
          indication: 'Infeksi organisme penghasil beta-laktamase',
          notes: '3 bln–12 th: 25 mg/kg q6h; < 3 bln: 25 mg/kg q8h; neonatus/prematur: 25 mg/kg q12h; > 12 th: 1 g q8h [16]. Oral (sebagai amoksisilin): 1–6 th 125 mg q8h; 6–12 th 250 mg q8h.',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap penisilin',
      'Riwayat ikterus / gangguan fungsi hati akibat amoksisilin-klavulanat',
    ],
    warnings: [
      'Hepatotoksisitas / ikterus kolestatik',
      'Reaksi hipersensitivitas; ruam pada mononukleosis',
      'Hati-hati pada gangguan fungsi ginjal',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'ampisilin',
    name: 'Ampisilin',
    aliases: ['Ampicillin', 'Ampi'],
    category: 'antibiotik',
    mechanism: 'Aminopenisilin — menghambat sintesis dinding sel bakteri. Aktif terhadap Listeria, Enterococcus, beberapa Gram-negatif.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 10, maxPerKg: 50, unit: 'mg/kg',
          frequency: 'tiap 4–6 jam (per dosis)',
          ivDuration: 'IV lambat / infus',
          indication: 'Sepsis, meningitis, infeksi Listeria/Enterococcus',
          notes: 'Infeksi biasa 10–25 mg/kg/dosis q6h; berat 50 mg/kg/dosis q4h; meningitis 150–200 mg/kg/hari terbagi [16]. Oral 7,5–25 mg/kg/dosis q6h.',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap golongan penisilin',
    ],
    warnings: [
      'Reaksi hipersensitivitas / anafilaksis',
      'Ruam eritematosa pada mononukleosis, leukemia limfositik, HIV',
    ],
    specialPopulations: {
      neonates: 'IV 25–50 mg/kg/dosis; usia 1 mgg tiap 12 jam; usia 2–4 mgg tiap 6–8 jam [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'ampisilin_sulbaktam',
    name: 'Ampisilin + Sulbaktam',
    aliases: ['Ampicillin-Sulbactam', 'Sulbactam', 'Unasyn'],
    category: 'antibiotik',
    mechanism: 'Ampisilin (aminopenisilin) + sulbaktam (inhibitor beta-laktamase) → memperluas cakupan terhadap bakteri penghasil beta-laktamase.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 100, maxPerKg: 200, unit: 'mg/kg',
          maxAbsoluteMg: 8000,
          frequency: 'dibagi tiap 6 jam (mg ampisilin/hari)',
          ivDuration: 'IV perlahan 10–15 menit atau infus 15–30 menit',
          indication: 'Infeksi kulit, intra-abdomen, ginekologik',
          notes: 'Dosis sebagai ampisilin: bayi > 1 bln 100–150 mg/kg/hari; anak 100–200 mg/kg/hari; meningitis 200–400 mg/kg/hari; maks 8 g ampisilin/hari [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap ampisilin, sulbaktam, atau penisilin',
    ],
    warnings: [
      'Ruam makulopapular pada infeksi EBV, leukemia limfositik akut, atau CMV',
      'Pemberian pada anak < 12 tahun tidak disetujui FDA',
      'Hati-hati pada alergi sefalosporin; sesuaikan dosis pada gangguan ginjal',
    ],
    renalAdjustment: 'ClCr 15–29 mL/menit: tiap 12 jam; ClCr 5–14: tiap 24 jam.',
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'klindamisin',
    name: 'Klindamisin',
    aliases: ['Clindamycin', 'Dalacin'],
    category: 'antibiotik',
    mechanism: 'Linkosamid — mengikat subunit ribosom 50S → menghambat sintesis protein bakteri. Aktif terhadap Gram-positif & anaerob.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 3, maxPerKg: 6, unit: 'mg/kg',
          frequency: 'tiap 6 jam (per dosis)',
          indication: 'Osteomielitis, peritonitis, infeksi anaerob',
          notes: 'Oral 3–6 mg/kg q6h [16].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 40, unit: 'mg/kg',
          frequency: 'dibagi 3–4 dosis (mg/kg/hari)',
          ivDuration: 'hindari IV cepat; infus',
          indication: 'Infeksi berat tulang/sendi, anaerob',
          notes: 'Neonatus 15–20 mg/kg/hari; > 1 bln 15–40 mg/kg/hari terbagi 3–4 dosis; infeksi berat minimal 300 mg/hari [16].',
        },
      },
    ],
    contraindications: [
      'Diare aktif',
      'Injeksi mengandung benzilalkohol pada neonatus',
    ],
    warnings: [
      'Diare / kolitis terkait C. difficile — segera hentikan bila terjadi',
      'Pantau fungsi hati & ginjal pada terapi lama, neonatus, & bayi',
      'Hindari pemberian IV cepat',
    ],
    references: ['idai2012'],
    verified: true,
  },

  {
    id: 'sefotaksim',
    name: 'Sefotaksim',
    aliases: ['Cefotaxime', 'Claforan'],
    category: 'antibiotik',
    mechanism: 'Sefalosporin generasi III — menghambat sintesis dinding sel bakteri (PBP). Spektrum luas Gram-negatif; penetrasi SSP baik (meningitis).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 100, maxPerKg: 200, unit: 'mg/kg',
          maxAbsoluteMg: 12000,
          frequency: 'dibagi tiap 6–8 jam (dosis/hari)',
          ivDuration: 'IV / IM; hindari bolus cepat via vena sentral',
          indication: 'Sepsis, pneumonia, meningitis, infeksi Gram-negatif',
          notes: '1 bln–12 th (< 50 kg): 100–200 mg/kg/hari q6–8h; meningitis 200 mg/kg/hari q6h (hingga 225–300 mg/kg/hari pada pneumokokal invasif); maks 12 g/hari [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap sefotaksim / sefalosporin',
    ],
    warnings: [
      'Jangan pada reaksi hipersensitivitas tipe cepat terhadap penisilin',
      'Injeksi bolus cepat (< 1 menit via vena sentral) → aritmia mengancam jiwa',
      'Superinfeksi pada pemakaian lama; kolitis pseudomembranosa',
    ],
    renalAdjustment: 'ClCr < 20 mL/menit: kurangi dosis 50%.',
    specialPopulations: {
      neonates: '100–150 mg/kg/hari dibagi q8–12h (sesuai BB & usia postnatal); meningitis: gunakan batas atas dosis, interval terpendek, minimal 21 hari [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'seftriakson',
    name: 'Seftriakson',
    aliases: ['Ceftriaxone', 'Rocephin'],
    category: 'antibiotik',
    mechanism: 'Sefalosporin generasi III dengan waktu paruh panjang (umumnya sekali sehari). Spektrum luas; penetrasi SSP baik.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 20, maxPerKg: 80, unit: 'mg/kg',
          maxAbsoluteMg: 4000,
          frequency: 'sekali sehari (atau terbagi tiap 12 jam)',
          ivDuration: 'IV lambat 3–4 menit; infus 60 menit pada infeksi serius',
          indication: 'Sepsis, pneumonia, meningitis, gonore',
          notes: '20–50 mg/kg/hari, hingga 80 mg/kg/hari pada infeksi serius. Gonore: 25–50 mg/kg dosis tunggal (maks 125 mg) [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap sefalosporin, porfiria',
      'Neonatus dengan ikterus, hipoalbuminemia, asidosis, atau gangguan pengikatan bilirubin',
    ],
    warnings: [
      'NEONATUS: jangan diberikan bersamaan dengan larutan/produk mengandung kalsium IV (presipitasi fatal); gunakan sefotaksim sebagai pengganti pada hiperbilirubinemia',
      'Menggeser ikatan bilirubin dari albumin → risiko kernikterus pada neonatus',
      'Endapan kalsium-seftriakson di empedu/ginjal (terutama bayi sangat muda, dehidrasi)',
    ],
    specialPopulations: {
      neonates: 'Hindari pada hiperbilirubinemia — gunakan sefotaksim. Jangan diberikan bersamaan dengan kalsium IV [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'seftazidim',
    name: 'Seftazidim',
    aliases: ['Ceftazidime', 'Fortum'],
    category: 'antibiotik',
    mechanism: 'Sefalosporin generasi III dengan aktivitas kuat terhadap Pseudomonas aeruginosa. Penggunaan terbatas (restricted).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 50, maxPerKg: 100, unit: 'mg/kg',
          maxAbsoluteMg: 6000,
          frequency: 'dibagi 2–3 dosis (dosis/hari)',
          ivDuration: 'injeksi IV atau infus IV',
          indication: 'Infeksi Pseudomonas & Gram-negatif (terutama resisten aminoglikosida)',
          notes: 'Bayi < 2 bln: 25–50 mg/kg/hari (2 dosis); > 2 bln: 50–100 mg/kg/hari (2–3 dosis). Fibrosis sistik / meningitis imunokompromais: hingga 150 mg/kg/hari (maks 6 g/hari) [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap sefalosporin, porfiria',
    ],
    warnings: [
      'Sensitivitas silang dengan penisilin',
      'Sesuaikan dosis pada gangguan fungsi ginjal',
      'Positif palsu pada pemeriksaan glukosa urin & tes Coombs',
    ],
    specialPopulations: {
      neonates: 'IV 50 mg/kg/dosis; interval per usia gestasi (< 30 mgg: ≤ 28 hari q12h, > 28 hari q8h; ≥ 30 mgg: ≤ 14 hari q12h, > 14 hari q8h) [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'meropenem',
    name: 'Meropenem',
    aliases: ['Meropenem', 'Meronem'],
    category: 'antibiotik',
    mechanism: 'Karbapenem — menghambat sintesis dinding sel bakteri (PBP). Spektrum sangat luas, termasuk organisme penghasil ESBL.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 20, maxPerKg: 40, unit: 'mg/kg',
          frequency: 'tiap 8 jam',
          ivDuration: 'infus IV',
          indication: 'Infeksi Gram-negatif resisten / ESBL, meningitis',
          notes: 'Infeksi standar 20 mg/kg/dosis; infeksi berat / meningitis Pseudomonas 40 mg/kg/dosis [16]. Frekuensi tiap 8 jam (standar meropenem).',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap karbapenem / beta-laktam',
    ],
    warnings: [
      'Hati-hati pada gangguan fungsi ginjal & riwayat kejang',
      'Diare / kolitis terkait antibiotik; ruam',
      'Hipotensi',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'vankomisin',
    name: 'Vankomisin',
    aliases: ['Vancomycin', 'Vancocin'],
    category: 'antibiotik',
    mechanism: 'Glikopeptida — menghambat sintesis dinding sel bakteri (mengikat prekursor D-Ala-D-Ala). Aktif terhadap Gram-positif termasuk MRSA.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 10, maxPerKg: 20, unit: 'mg/kg',
          frequency: 'tiap 6–8 jam',
          ivDuration: 'infus ≥ 60 menit (cegah red man syndrome)',
          indication: 'MRSA, infeksi Gram-positif resisten beta-laktam, endokarditis',
          notes: 'Anak > 1 bln: 10 mg/kg/dosis q6h; infeksi serius / MRSA / MIC ≈ 1: 15–20 mg/kg/dosis q6–8h. Pantau kadar serum & hidrasi [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap vankomisin',
      'Hati-hati pada riwayat gangguan pendengaran',
    ],
    warnings: [
      'Red man / red neck syndrome bila infus terlalu cepat — infus ≥ 60 menit',
      'Nefrotoksik & ototoksik (berkaitan kadar serum tinggi) — pantau kadar & fungsi ginjal',
      'Neutropenia; jarang DRESS',
    ],
    renalAdjustment: 'Sesuaikan dosis & interval pada gangguan fungsi ginjal; pantau kadar serum.',
    specialPopulations: {
      neonates: 'Dosis & interval per BB & usia postnatal (mis. > 2000 g, > 7 hari: 10–15 mg/kg/dosis q6–8h; < 1200 g: 15 mg/kg/dosis q24h) [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'metronidazol',
    name: 'Metronidazol',
    aliases: ['Metronidazole', 'Flagyl'],
    category: 'antibiotik',
    mechanism: 'Nitroimidazol — radikal nitro reduktif merusak DNA mikroorganisme. Aktif terhadap bakteri anaerob & protozoa (amoeba, Giardia).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 7.5, maxPerKg: 7.5, unit: 'mg/kg',
          frequency: 'tiap 8 jam',
          ivDuration: 'infus IV selama 20 menit',
          indication: 'Infeksi anaerob (peritonitis, abses, tetanus), amoebiasis, giardiasis',
          notes: 'Infeksi anaerob 7,5 mg/kg q8h. Amoebiasis invasif: 30 mg/kg/hari (3 dosis) 8–10 hari. Giardiasis: 15 mg/kg/hari (2 dosis) [16].',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 7.5, maxPerKg: 7.5, unit: 'mg/kg',
          frequency: 'tiap 8 jam',
          indication: 'Infeksi anaerob, amoebiasis, giardiasis (oral)',
        },
      },
    ],
    contraindications: [
      'Ketergantungan alkohol kronis',
    ],
    warnings: [
      'Reaksi disulfiram-like dengan alkohol — hindari alkohol',
      'Gangguan hati / ensefalopati hepatik',
      'Neuropati perifer & kejang pada pemakaian lama / dosis tinggi; urin kehitaman',
    ],
    specialPopulations: {
      neonates: 'NEC: dosis awal IV/oral 15 mg/kg, rumatan 7,5 mg/kg/dosis; interval ≤ 28 hari q12h, > 28 hari q8h (dikombinasi penisilin + gentamisin) [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'siprofloksasin',
    name: 'Siprofloksasin',
    aliases: ['Ciprofloxacin', 'Ciproxin', 'Baquinor'],
    category: 'antibiotik',
    mechanism: 'Fluorokuinolon — menghambat DNA girase & topoisomerase IV → mengganggu replikasi DNA bakteri. Aktif Gram-negatif termasuk Pseudomonas.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 20, maxPerKg: 30, unit: 'mg/kg',
          maxAbsoluteMg: 1500,
          frequency: 'dibagi tiap 12 jam (dosis/hari)',
          indication: 'Infeksi Pseudomonas (fibrosis sistik), antraks, Gram-negatif berat',
          notes: 'Fibrosis sistik (5–12 th): maks 20 mg/kg 2×/hari (maks 1,5 g/hari). Antraks: 20–30 mg/kg/hari q12h × 60 hari (maks 1000 mg/hari) [16].',
        },
      },
    ],
    contraindications: [
      'Riwayat gangguan tendon pada penggunaan kuinolon',
    ],
    warnings: [
      'Artropati sendi penopang berat badan (data hewan) — tidak rutin untuk anak/remaja; pertimbangkan bila hanya siprofloksasin yang sensitif',
      'Ruptur tendon — hentikan bila timbul nyeri/inflamasi',
      'Fotosensitivitas; hati-hati epilepsi/predisposisi kejang, miastenia gravis, defisiensi G6PD',
      'Jaga hidrasi adekuat (risiko kristaluria)',
    ],
    references: ['idai2012'],
    verified: true,
  },

  // ── Antijamur ──────────────────────────────────────────────────────────
  {
    id: 'flukonazol',
    name: 'Flukonazol',
    aliases: ['Fluconazole', 'Diflucan'],
    category: 'antijamur',
    mechanism: 'Azol — menghambat 14α-demethylase (CYP51), mengganggu sintesis ergosterol membran jamur.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 6, maxPerKg: 12, unit: 'mg/kg',
          maxAbsoluteMg: 600,
          frequency: 'q24h (lihat catatan neonatus)',
          ivDuration: 'IV drip ±1 jam',
          indication: 'Candidiasis sistemik, meningitis kriptokokus, profilaksis pada imunokompromis',
          notes: 'IDAI: 3–12 mg/kg/hari; dosis >600 mg/hari tidak dianjurkan [16]. Sistemik/meningitis: loading 12 mg/kg hari-1, lanjut 6 mg/kg/hari. Neonatus — interval per usia pascalahir: ≤14 hari q72h; 15–28 hari q48h; >28 hari q24h [16]. Bayi <3 bln (kandida): 5–6 mg/kg/hari [16].',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 3, maxPerKg: 12, unit: 'mg/kg',
          maxAbsoluteMg: 600,
          frequency: 'q24h',
          indication: 'Candidiasis oral, esofagus, infeksi invasif ringan-sedang',
          notes: 'Kandidiasis orofaring/esofagus: loading 6 mg/kg hari-1, lanjut 3 mg/kg/hari (orofaring ≥2 mgg; esofagus ≥3 mgg & ≥2 mgg setelah gejala hilang) [16]. Kandidiasis sistemik: 6–12 mg/kg/hari, max 600 mg/hari [16].',
        },
      },
    ],
    warnings: [
      'Monitor fungsi hati (hepatotoksik pada dosis tinggi/lama)',
      'Perpanjang QTc — hindari bersama obat QT-prolonging',
      'Inhibitor CYP2C9 & CYP3A4 kuat — banyak interaksi obat penting',
    ],
    references: ['idsa_candida2016', 'idai2012'],
    verified: true,
  },
  {
    id: 'amfoterisin_b',
    name: 'Amfoterisin B',
    aliases: ['Amphotericin B', 'AmB', 'AmBisome'],
    category: 'antijamur',
    mechanism: 'Poliena — berikatan dengan ergosterol membran jamur → pori transmembran → kematian sel. Spektrum terluas di antara antijamur.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.25, maxPerKg: 1.5, unit: 'mg/kg',
          frequency: 'q24h (infus lambat)',
          ivDuration: 'Test dose 1 mg dalam 20–30 mnt; bila ditoleransi, infus dosis harian 2–6 jam. Observasi 30 mnt setelah test dose',
          indication: 'Infeksi jamur sistemik mengancam jiwa, leishmaniasis',
          notes: 'AmB konvensional (deoksikolat): mulai 0.25 mg/kg/hari, naik bertahap 0.25 mg/kg/hari hingga 1 mg/kg/hari; infeksi berat sampai 1.5 mg/kg/hari — TIDAK boleh >1.5 mg/kg/hari [16]. Bila terputus >7 hari, mulai lagi dari 0.25 mg/kg/hari [16]. AmB liposomal (AmBisome): 3–5 mg/kg/hari — nefrotoksik minimal [22]. WASPADA: kerancuan bentuk lipid vs konvensional dapat fatal.',
        },
      },
    ],
    warnings: [
      'Nefrotoksik — pantau kreatinin, BUN, elektrolit (K⁺, Mg²⁺) setiap hari',
      'Demam/menggigil/hipotensi saat infus — premedikasi parasetamol ± difenhidramin',
      'Test dose WAJIB sebelum infus pertama',
      'JANGAN larutkan dalam NaCl 0.9% (presipitasi) — gunakan D5W',
    ],
    references: ['idsa_candida2016', 'idai2012'],
    verified: true,
  },

  // ── Antiviral ──────────────────────────────────────────────────────────
  {
    id: 'asiklovir',
    name: 'Asiklovir',
    aliases: ['Acyclovir', 'Zovirax'],
    category: 'antiviral',
    mechanism: 'Analog nukleosida — dihambat oleh timidin kinase virus menjadi trifosfat aktif → menghambat DNA polimerase HSV/VZV.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 10, maxPerKg: 20, unit: 'mg/kg',
          frequency: 'q8h (lihat catatan)',
          ivDuration: 'Infus lambat ≥1 jam; hidrasi cukup untuk cegah nefrotoksisitas',
          indication: 'HSV neonatus, ensefalitis HSV, varisela berat/imunokompromis',
          notes: 'Neonatus HSV (IDAI): 20 mg/kg/kali, min 14 hari; interval per usia koreksi — <30 mgg q24h; 30–32 mgg q18h; >32 mgg q12h [16]. Bayi/anak HSV non-ensefalitis: 250 mg/m² atau 5 mg/kg/dosis q8h [16]. Ensefalitis HSV/varisela komplikasi: 500 mg/m² atau 10 mg/kg/dosis q8h x10–14 hari [16]. AAP merekomendasikan 20 mg/kg/dosis untuk ensefalitis HSV [23].',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 20, maxPerKg: 20, unit: 'mg/kg',
          maxAbsoluteMg: 800,
          frequency: 'q6h x5 hari',
          indication: 'Varisela ringan-sedang (imunokompeten, anak ≥2 tahun)',
          notes: 'Varisela oral: 20 mg/kg/dosis q6h x5 hari, max 800 mg/dosis [23][16]. Mulai dalam 24 jam sejak lesi muncul.',
        },
      },
    ],
    warnings: [
      'Nefrotoksik bila dehidrasi atau infus terlalu cepat — hidrasi cukup sebelum & selama terapi',
      'Sesuaikan dosis pada gangguan ginjal',
      'Konfirmasi diagnosis virologi (PCR/serologi) bila kondisi memungkinkan',
    ],
    references: ['aap_redbook2021', 'idai2012'],
    verified: true,
  },
  {
    id: 'gansiklovir',
    name: 'Gansiklovir',
    aliases: ['Ganciclovir', 'Cymevene'],
    category: 'antiviral',
    mechanism: 'Analog nukleosida — dihambat oleh UL97 kinase CMV → inhibisi DNA polimerase CMV.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 5, maxPerKg: 6, unit: 'mg/kg',
          frequency: 'q12h (induksi); q24h (maintenance)',
          ivDuration: 'Infus lambat 1 jam',
          indication: 'CMV kongenital (neonatus), retinitis/enteritis/pneumonitis CMV pada HIV',
          notes: 'Neonatus/bayi CMV kongenital (IDAI): dosis awal tinggi 15 mg/kg/hari dibagi q12h [16]. Retinitis >3 bln: induksi 10 mg/kg/hari dibagi q12h (infus 1–2 jam) x14–21 hari; pemeliharaan 5 mg/kg/hari q24h (7 hari/mgg) atau 6 mg/kg/hari (5 hari/mgg) [16]. AAP/CASG neonatus: 6 mg/kg/dosis q12h, alih valgansiklovir bila toleran [23].',
        },
      },
    ],
    warnings: [
      'IDAI: KONTRAINDIKASI bila neutrofil <500/µL atau trombosit <25.000/µL [16]',
      'Mielosupresi berat — pantau leukosit, trombosit, kreatinin, fungsi hati, mata [16]',
      'Karsinogenik & mutagenik pada penggunaan lama — kontrasepsi sampai ≥90 hari setelah terapi [16]',
      'Gunakan HANYA pada indikasi CMV terverifikasi (PCR/biakan)',
    ],
    references: ['aap_redbook2021', 'idai2012'],
    verified: true,
  },

  // ── Anti-Tuberkulosis ──────────────────────────────────────────────────
  {
    id: 'isoniazid',
    name: 'Isoniazid (INH)',
    aliases: ['Isoniazid', 'INH', 'H — regimen OAT'],
    category: 'antibiotik',
    mechanism: 'Menghambat sintesis asam mikolat dinding sel Mycobacterium tuberculosis (InhA/KatG).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 7, maxPerKg: 15, unit: 'mg/kg',
          maxAbsoluteMg: 300,
          frequency: 'q24h (sekali sehari)',
          indication: 'TB aktif (regimen HRZE/HR), profilaksis LTBI',
          notes: 'WHO 2022 & IDAI TB 2016: 10 mg/kg/hari (rentang 7–15), max 300 mg/hari [21][24]. IDAI Formularium: bila dikombinasi rifampisin, INH max 10 mg/kg/hari [16]. Intermiten 2–3×/mgg: 20–40 mg/kg/kali (max 900 mg) [16]. Profilaksis LTBI: 5–10 mg/kg/hari ≥6 bulan. Beri 1 jam sebelum/2 jam sesudah makan. Tambahkan piridoksin (B6) 10–50 mg/hari [16][21].',
        },
      },
    ],
    warnings: [
      'Hepatotoksik — pantau SGOT/SGPT sebelum mulai & bila ada gejala (mual, jaundice)',
      'Neuropati perifer — suplementasi piridoksin (B6) WAJIB',
      'Meningkatkan kadar fenitoin — monitor level fenitoin bila dipakai bersamaan',
    ],
    references: ['who_tb2022', 'idai_tb2016', 'idai2012'],
    verified: true,
  },
  {
    id: 'rifampisin',
    name: 'Rifampisin (RIF)',
    aliases: ['Rifampicin', 'Rifampin', 'R — regimen OAT'],
    category: 'antibiotik',
    mechanism: 'Menghambat RNA polimerase bakteri yang bergantung DNA (rpoB); bakterisidal terhadap M. tuberculosis.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 10, maxPerKg: 20, unit: 'mg/kg',
          maxAbsoluteMg: 600,
          frequency: 'q24h, 30 mnt sebelum makan',
          indication: 'TB aktif (semua fase), profilaksis meningitis H. influenzae/N. meningitidis',
          notes: 'WHO 2022 & IDAI: 15 mg/kg/hari (rentang 10–20), max 600 mg/hari [21][24][16]. Warna urin/air mata/keringat merah-oranye (normal, beri tahu orang tua) [21].',
        },
      },
    ],
    warnings: [
      'Hepatotoksik — pantau fungsi hati',
      'Induktor enzim kuat (CYP3A4, CYP2C9) — menurunkan kadar banyak obat penting',
      'Menurunkan efektivitas: kortikosteroid, kontrasepsi hormonal, ARV (hindari kombinasi), fenitoin, warfarin',
      'Jangan beri dalam 2 jam bersama antasida',
    ],
    references: ['who_tb2022', 'idai_tb2016', 'idai2012'],
    verified: true,
  },
  {
    id: 'pirazinamid',
    name: 'Pirazinamid (PZA)',
    aliases: ['Pyrazinamide', 'Z — regimen OAT'],
    category: 'antibiotik',
    mechanism: 'Pro-drug → asam pirazinoat → mengganggu metabolisme energi M. tuberculosis di lingkungan asam (sterilisasi kavitas).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 30, maxPerKg: 40, unit: 'mg/kg',
          maxAbsoluteMg: 2000,
          frequency: 'q24h',
          indication: 'TB aktif — fase intensif 2 bulan (regimen 2HRZE)',
          notes: 'WHO 2022 & IDAI: 35 mg/kg/hari (rentang 30–40), max 2000 mg/hari [21][24][16]. Diberikan hanya 2 bulan pertama pada regimen standar [21].',
        },
      },
    ],
    warnings: [
      'Hepatotoksik — pantau SGOT/SGPT',
      'Hiperurisemia — pantau asam urat bila ada keluhan gout/artralgia',
      'Artralgia sering; dapat diatasi dengan analgesik',
    ],
    references: ['who_tb2022', 'idai_tb2016', 'idai2012'],
    verified: true,
  },
  {
    id: 'etambutol',
    name: 'Etambutol (EMB)',
    aliases: ['Ethambutol', 'E — regimen OAT'],
    category: 'antibiotik',
    mechanism: 'Menghambat arabinosil transferase → gangguan sintesis arabinogalaktan dinding sel M. tuberculosis.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 15, maxPerKg: 25, unit: 'mg/kg',
          maxAbsoluteMg: 1000,
          frequency: 'q24h',
          indication: 'TB aktif — fase intensif (regimen 2HRZE), TB MDR',
          notes: 'WHO 2022 & IDAI: 20 mg/kg/hari (rentang 15–25), max 1000 mg/hari [21][24][16]. Pemantauan visus & persepsi warna WAJIB tiap bulan [21].',
        },
      },
    ],
    warnings: [
      'Neuritis optik — IDAI: KONTRAINDIKASI pada anak <6 tahun (tidak dapat melaporkan gangguan visus) [16]',
      'Pantau visus, lapang pandang & persepsi warna sebelum dan tiap bulan (terutama bila dosis >15 mg/kg/hari) [16]',
      'Sesuaikan dosis pada gangguan ginjal: Clcr 10–50 mL/mnt → tiap 24–36 jam; <10 → tiap 48 jam [16]',
    ],
    references: ['who_tb2022', 'idai_tb2016', 'idai2012'],
    verified: true,
  },
  {
    id: 'kotrimoksazol',
    name: 'Kotrimoksazol (TMP-SMX)',
    aliases: ['Co-trimoxazole', 'Trimethoprim-Sulfamethoxazole', 'TMP-SMX', 'Bactrim', 'Septrin'],
    category: 'antibiotik',
    mechanism: 'Kombinasi inhibisi ganda: TMP menghambat DHFR; SMX menghambat DHPS → blokir sintesis folat bakteri secara sinergis.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 8, maxPerKg: 10, unit: 'mg/kg',
          maxAbsoluteMg: 320,
          frequency: 'q12h',
          indication: 'ISK, Shigella, ISPA, profilaksis PCP',
          notes: 'Dosis berdasarkan komponen TMP. Infeksi standar: TMP 8–10 mg/kg/hari dibagi q12h [16][17]. Profilaksis PCP (HIV/imunokompromis): TMP 5 mg/kg/hari (max 160 mg TMP) sekali/hari, 3×/minggu [23][16]. Sediaan: tablet 80/400 mg; suspensi 40/200 mg per 5 mL.',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 20, unit: 'mg/kg',
          frequency: 'dibagi q6–8h x21 hari',
          indication: 'PCP (Pneumocystis jirovecii pneumonia) berat',
          notes: 'PCP berat: TMP 15–20 mg/kg/hari IV dibagi q6–8h x21 hari [23][16]. Beralih ke oral bila kondisi membaik.',
        },
      },
    ],
    warnings: [
      'IDAI: hindari pemberian pada bayi <6 minggu [16]',
      'Hindari pada defisiensi G6PD (hemolisis); KI pada hipersensitif sulfonamid & porfiria [16]',
      'Asupan cairan adekuat untuk cegah kristaluria; pantau fungsi ginjal & darah tepi [16]',
      'Hentikan segera bila muncul rash (risiko Steven-Johnson/TEN) [16]',
    ],
    references: ['aap_redbook2021', 'idai2012', 'lexicomp_ped'],
    verified: true,
  },
  {
    id: 'eritromisin',
    name: 'Eritromisin',
    aliases: ['Erythromycin'],
    category: 'antibiotik',
    mechanism: 'Makrolida — berikatan dengan 50S ribosom (23S rRNA) → menghambat translokasi peptida → bakteriostatik.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 30, maxPerKg: 50, unit: 'mg/kg',
          maxAbsoluteMg: 2000,
          frequency: 'dibagi q6–8h',
          indication: 'Infeksi Chlamydia, Bordetella pertussis, pneumonia atipikal, alergi penisilin',
          notes: 'Anak: 30–50 mg/kg/hari dibagi q6–8h, max 2000 mg/hari [16][17]. Pertussis: 40–50 mg/kg/hari dibagi q6h x14 hari [23]. Neonatus: 10 mg/kg/dosis q6h — waspadai HPS pada <2 minggu [23].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 50, unit: 'mg/kg',
          maxAbsoluteMg: 2000,
          frequency: 'dibagi q6h',
          ivDuration: 'Infus lambat 30–60 menit',
          indication: 'Bila tidak toleran oral',
          notes: 'IV: 15–50 mg/kg/hari dibagi q6h, infus lambat untuk mengurangi flebitis [16].',
        },
      },
    ],
    warnings: [
      'Hipertrofi pilorus infantil (HPS) — hindari pada neonatus <2 minggu bila ada alternatif',
      'Perpanjang QTc — hindari kombinasi dengan obat QT-prolonging lain',
      'Inhibitor CYP3A4 — interaksi dengan banyak obat (teofilin, warfarin, siklosporin)',
      'Mual/muntah sering; berikan bersama makanan',
    ],
    references: ['idai2012', 'lexicomp_ped', 'aap_redbook2021'],
    verified: true,
  },
  {
    id: 'doksisiklin',
    name: 'Doksisiklin',
    aliases: ['Doxycycline', 'Vibramycin'],
    category: 'antibiotik',
    mechanism: 'Tetrasiklin — berikatan dengan 30S ribosom → menghambat masuknya aminoasil-tRNA → bakteriostatik spektrum luas.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 2, maxPerKg: 4, unit: 'mg/kg',
          maxAbsoluteMg: 200,
          frequency: 'dibagi q12–24h',
          indication: 'Rickettsia, Chlamydia, Mycoplasma, Lyme disease, kolera (IDAI: anak >12 tahun)',
          notes: 'IDAI: untuk anak >12 tahun — 200 mg hari-1, lanjut 100 mg/hari (infeksi berat 200 mg/hari) [16]. Klamidia/uretritis: 2×100 mg/hari [16]. Kolera: 100 mg dosis tunggal [16]. Per-kg (Lexicomp): 2–4 mg/kg/hari dibagi q12–24h; Rickettsia/RMSF 4.4 mg/kg/hari q12h [17][23].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 2, maxPerKg: 4, unit: 'mg/kg',
          maxAbsoluteMg: 200,
          frequency: 'dibagi q12h',
          ivDuration: 'Infus lambat 1–4 jam',
          indication: 'Sama dengan oral, bila tidak toleran per oral',
          notes: 'IV: dosis sama dengan oral; infus lambat untuk mengurangi flebitis [17].',
        },
      },
    ],
    warnings: [
      'IDAI: KONTRAINDIKASI pada anak <12 tahun — pewarnaan & hipoplasia gigi permanen [16]',
      'Juga KI pada porfiria & lupus eritematosus sistemik [16]',
      'Pengecualian internasional: RMSF/Rickettsia mengancam jiwa — AAP mengizinkan kursus pendek pada anak <8 tahun [23]',
      'Fotosensitisasi — hindari paparan matahari langsung; jangan beri dengan antasida/susu/besi (1 jam sebelum / 2 jam sesudah) [16]',
    ],
    references: ['idai2012', 'lexicomp_ped', 'aap_redbook2021'],
    verified: true,
  },

  // ── Antiparasit / Antimalaria ──────────────────────────────────────────
  {
    id: 'klorokuin',
    name: 'Klorokuin',
    aliases: ['Chloroquine', 'Klorokuin Fosfat'],
    category: 'antiparasit',
    mechanism: 'Antimalaria 4-aminokuinolin — terakumulasi di vakuola makan parasit, menghambat polimerisasi heme menjadi hemozoin → toksik bagi Plasmodium.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 5, maxPerKg: 10, unit: 'mg/kg',
          maxAbsoluteMg: 600,
          frequency: 'lihat catatan (regimen 3 hari)',
          indication: 'Malaria akut (galur sensitif), profilaksis malaria, artritis reumatoid juvenil',
          notes: 'Dosis dalam klorokuin basa. Malaria akut: awal 10 mg/kg (max 600 mg), lalu 5 mg/kg (max 300 mg) 6 jam kemudian, dilanjut 5 mg/kg/hari sekali sehari x2 hari [16]. Profilaksis: 5 mg/kg/minggu (max 300 mg) [16]. Hitung dosis berdasarkan BB ideal pada obesitas. Beri bersama makanan.',
        },
      },
      {
        route: 'IM',
        dose: {
          minPerKg: 2.5, maxPerKg: 5, unit: 'mg/kg',
          maxAbsoluteMg: 200,
          frequency: 'dapat diulang tiap 6 jam (max 10 mg/kg/24 jam)',
          indication: 'Malaria berat bila terapi oral tidak memungkinkan',
          notes: 'Klorokuin basa 5 mg/kg (max 200 mg), dapat diulang dalam 6 jam; ATAU dosis kecil berulang 2.5 mg/kg tiap 4 jam — total TIDAK >10 mg/kg/24 jam [16]. HINDARI pemberian parenteral cepat (risiko kolaps kardiovaskular fatal).',
        },
      },
    ],
    contraindications: [
      'Hipersensitif; gangguan retina/lapang pandang; epilepsi (hindari)',
    ],
    warnings: [
      'Pemberian parenteral cepat → intoksikasi & kegagalan kardiovaskular fatal — beri lambat/dosis kecil berulang [16]',
      'Pantau ketajaman visus (retinopati pada penggunaan lama dosis tinggi) [16]',
      'Hati-hati pada defisiensi G6PD, psoriasis, porfiria, gangguan ginjal/hati [16]',
      'Sangat toksik pada overdosis (aritmia, konvulsi)',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'kuinin',
    name: 'Kuinin',
    aliases: ['Quinine', 'Kuinin Sulfat', 'Kuinin Dihidroklorida'],
    category: 'antiparasit',
    mechanism: 'Alkaloid sinkona — mengganggu detoksifikasi heme & metabolisme parasit; skizontosid darah untuk P. falciparum.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 10, maxPerKg: 10, unit: 'mg/kg',
          frequency: 'tiap 8 jam, 3–10 hari',
          indication: 'Malaria P. falciparum resisten obat kombinasi',
          notes: 'Kuinin sulfat 10 mg/kg tiap 8 jam selama 3, 7, atau 10 hari — lama terapi tergantung kerentanan lokal [16].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 10, maxPerKg: 20, unit: 'mg/kg',
          frequency: 'loading 20 mg/kg, lalu 10 mg/kg q12h',
          ivDuration: 'Infus lambat selama 4 jam',
          indication: 'Malaria P. falciparum berat (tidak dapat per oral)',
          notes: 'Kuinin dihidroklorida: loading 20 mg/kg infus 4 jam, lalu 10 mg/kg tiap 12 jam [16]. Dosis awal DIBAGI DUA bila pasien sudah menerima kuinin/kuinidin/meflokuin dalam 12–24 jam sebelumnya [16]. Pantau gula darah & EKG.',
        },
      },
    ],
    contraindications: [
      'Hemoglobinuria, neuritis optik, tinitus',
    ],
    warnings: [
      'Pantau gula darah (hipoglikemia, terutama parenteral) & tanda toksik jantung [16]',
      'Cinchonism: tinitus, sakit kepala, penglihatan kabur, gangguan dengar [16]',
      'Hati-hati pada gangguan konduksi/blok jantung, defisiensi G6PD, miastenia gravis [16]',
      'Sangat toksik pada overdosis — perlu pertolongan medis segera',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'albendazol',
    name: 'Albendazol',
    aliases: ['Albendazole'],
    category: 'antiparasit',
    mechanism: 'Benzimidazol — berikatan dengan β-tubulin cacing → menghambat polimerisasi mikrotubulus & ambilan glukosa.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 15, maxPerKg: 15, unit: 'mg/kg',
          maxAbsoluteMg: 800,
          frequency: 'lihat catatan (per indikasi)',
          indication: 'Ekinokokosis, neurosistiserkosis, askariasis, cacing tambang, strongyloidiasis, dll',
          notes: 'Ekinokokosis/neurosistiserkosis: 15 mg/kg/hari dibagi 2 (max 800 mg/hari) — siklus 28 hari (neurosistiserkosis 8–30 hari) [16]. Cacing umum (anak >2 th): 400 mg dosis tunggal; trikuriasis/strongyloidiasis berat: 400 mg/hari x3 hari; kapilariasis: 400 mg/hari x10 hari [16].',
        },
      },
    ],
    warnings: [
      'Tes fungsi hati & darah rutin sebelum & 2× tiap siklus pengobatan [16]',
      'Syok alergik bila terjadi kebocoran kista; konvulsi/meningisme pada penyakit serebral [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'mebendazol',
    name: 'Mebendazol',
    aliases: ['Mebendazole'],
    category: 'antiparasit',
    mechanism: 'Benzimidazol — menghambat pembentukan mikrotubulus & ambilan glukosa cacing.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: '100–500 mg (dosis tetap, bukan per kg)',
          frequency: 'dosis tetap per indikasi',
          indication: 'Askariasis, cacing tambang, enterobiasis, trichuriasis, capillariasis',
          notes: 'Dosis tetap (bukan per kg). Askariasis (>1 th): 500 mg dosis tunggal atau 2×100 mg/hari x3 hari [16]. Cacing tambang/trichuriasis (>1 th): 2×100 mg/hari x3 hari [16]. Enterobiasis (>2 th): 100 mg dosis tunggal, ulang 2–3 mgg; obati seluruh keluarga [16]. Capillariasis (>2 th): 200 mg/hari x20–30 hari [16].',
        },
      },
    ],
    contraindications: [
      'Kolestasis, gangguan hati',
    ],
    warnings: [
      'Diberikan di antara waktu makan [16]',
      'Dosis tinggi: reaksi alergi, peningkatan enzim hati, depresi sumsum tulang (infeksi cestoda) [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'pirantel',
    name: 'Pirantel',
    aliases: ['Pyrantel', 'Pirantel Pamoat'],
    category: 'antiparasit',
    mechanism: 'Penghambat depolarisasi neuromuskular cacing → paralisis spastik → cacing dikeluarkan.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 10, maxPerKg: 10, unit: 'mg/kg',
          frequency: 'dosis tunggal (lihat catatan)',
          indication: 'Askariasis, cacing tambang, enterobiasis, trichostrongyliasis',
          notes: 'Askariasis/trichostrongyliasis: 10 mg/kg dosis tunggal [16]. Cacing tambang: 10 mg/kg dosis tunggal; infeksi berat 10 mg/kg/hari x4 hari [16]. Enterobiasis: 10 mg/kg dosis tunggal, ulang setelah 2–4 mgg [16].',
        },
      },
    ],
    warnings: [
      'Kurangi dosis pada gangguan fungsi hati [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'praziquantel',
    name: 'Praziquantel',
    aliases: ['Praziquantel'],
    category: 'antiparasit',
    mechanism: 'Meningkatkan permeabilitas membran cacing terhadap kalsium → kontraktur & paralisis; merusak tegumen.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 5, maxPerKg: 50, unit: 'mg/kg',
          frequency: 'dosis tunggal atau terbagi (per indikasi)',
          indication: 'Taeniasis, infeksi Hymenolepis/Diphyllobothrium, trematoda, sistiserkosis',
          notes: 'Anak ≥4 th. Taenia saginata/solium: 5–10 mg/kg dosis tunggal [16]. Hymenolepis nana: 15–25 mg/kg dosis tunggal [16]. Diphyllobothrium: 10–25 mg/kg dosis tunggal [16]. Sistiserkosis: 50 mg/kg/hari dibagi 3 x14 hari + kortikosteroid (mulai 2–3 hari sebelum & selama terapi) [16].',
        },
      },
    ],
    contraindications: [
      'Sistiserkosis okuler',
    ],
    warnings: [
      'Neurosistiserkosis: beri kortikosteroid di bawah pengawasan (risiko hipertensi intrakranial) [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },

  // ── Antidotum / Toksikologi ────────────────────────────────────────────
  {
    id: 'karbon_aktif',
    name: 'Karbon Aktif',
    aliases: ['Activated Charcoal', 'Norit', 'Arang Aktif'],
    category: 'antidotum',
    mechanism: 'Mengadsorpsi toksin di lumen saluran cerna → mengurangi absorpsi sistemik & meningkatkan eliminasi (dosis berulang).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Bayi 1 g/kg · Anak 25–50 g',
          frequency: 'dosis tunggal atau tiap 4–6 jam',
          indication: 'Intoksikasi akut (pencegahan absorpsi & eliminasi aktif)',
          notes: 'Bayi: 1 g/kg dosis tunggal (pencegahan) atau 1 g/kg tiap 4–6 jam (eliminasi) [16]. Anak 1–12 th: 25 g dosis tunggal (50 g pada keracunan berat); >1 th eliminasi: awal 25–50 g lalu 25–50 g tiap 4–6 jam [16]. Beri dalam ±1 jam pasca-intoksikasi untuk efek terbaik.',
        },
      },
    ],
    contraindications: [
      'Intoksikasi hidrokarbon (risiko aspirasi); zat korosif (mengaburkan lesi)',
      'Jangan bersama antidot oral spesifik atau emetik oral',
    ],
    warnings: [
      'Pasien mengantuk/tidak sadar: intubasi dulu sebelum pemberian via NGT (risiko aspirasi) [16]',
      'Tidak efektif untuk: alkohol, DDT, sianida, malation, garam logam (Fe, litium) [16]',
      'Jangan dicampur susu/es krim; boleh dengan coklat/sirup buah untuk palatabilitas [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'methylene_blue',
    name: 'Metilen Biru',
    aliases: ['Methylene Blue', 'Methylthioninium chloride', 'Biru Metilen'],
    category: 'antidotum',
    mechanism: 'Pada dosis terapi: akseptor elektron yang mereduksi methemoglobin (Fe³⁺) kembali menjadi hemoglobin (Fe²⁺) via NADPH-methemoglobin reduktase.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 1, maxPerKg: 2, unit: 'mg/kg',
          frequency: 'dosis tunggal, dapat diulang setelah 1 jam',
          ivDuration: 'Injeksi IV lambat beberapa menit',
          indication: 'Methemoglobinemia akut',
          notes: 'Methemoglobinemia akut: 1–2 mg/kg ATAU 25–50 mg/m² dosis tunggal IV lambat, dapat diulang setelah 1 jam [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif; gangguan ginjal berat',
      'Methemoglobinemia akibat klorat, atau yang timbul saat terapi keracunan sianida dengan natrium nitrit',
    ],
    warnings: [
      'Defisiensi G6PD → anemia hemolitik [16]',
      'Pantau kadar methemoglobin selama terapi [16]',
      'Dosis tinggi justru menyebabkan methemoglobinemia & diskolorasi kebiruan kulit/urin/feses [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'deferoksamin',
    name: 'Deferoksamin',
    aliases: ['Desferrioxamine', 'Deferoxamine', 'Desferal'],
    category: 'antidotum',
    mechanism: 'Kelator besi & aluminium — membentuk kompleks ferrioksamin yang larut air & diekskresi via urin.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 15, unit: 'mg/kg',
          frequency: 'per jam (keracunan besi akut)',
          ivDuration: 'Infus IV lambat',
          indication: 'Keracunan besi akut, kelebihan besi/aluminium',
          notes: 'Keracunan besi akut: awal 15 mg/kg/jam, kurangi setelah 4–6 jam — total <80 mg/kg dalam 24 jam [16]. Kelebihan besi kronik (SC/IM): 20–60 mg/kg/hari x4–7 hari/minggu [16]. Kelebihan aluminium (gagal ginjal terminal, IV): 5 mg/kg 1×/minggu pada 1 jam terakhir dialisis [16].',
        },
      },
    ],
    warnings: [
      'Infus IV terlalu cepat → anafilaksis, hipotensi, syok, aritmia [16]',
      'Gagal ginjal; pemeriksaan mata & telinga sebelum & tiap 3 bulan (retinopati, tuli) [16]',
      'Anak <3 tahun: dapat menghambat pertumbuhan [16]',
      'Urin berwarna coklat kemerahan (normal); risiko infeksi Yersinia [16]',
    ],
    references: ['idai2012'],
    verified: true,
    // CATATAN: di IDAI Formularium 2013 monograf ini keliru berjudul "Pralidoksim Mesilat";
    // isi sebenarnya adalah Deferoksamin (kelasi besi). Pralidoksim TIDAK di-encode.
    // TODO: konfirmasi sumber dosis Pralidoksim (antidot organofosfat) dari pedoman lain.
  },
  {
    id: 'dimerkaprol',
    name: 'Dimerkaprol',
    aliases: ['Dimercaprol', 'BAL', 'British Anti-Lewisite'],
    category: 'antidotum',
    mechanism: 'Gugus sulfhidril (-SH) mengkelat logam berat membentuk kompleks stabil yang diekskresi via urin.',
    routes: [
      {
        route: 'IM',
        dose: {
          minPerKg: 2.5, maxPerKg: 5, unit: 'mg/kg',
          frequency: 'per indikasi (tapering)',
          ivDuration: 'IM dalam',
          indication: 'Intoksikasi akut arsen, emas, air raksa, timbal (penunjang)',
          notes: 'Arsen/emas ringan: 2.5 mg/kg q6h x2 hari, lalu q12h hari-3, lalu 1×/hari x10 hari [16]. Berat: 3 mg/kg q4h x2 hari, lalu q6h hari-3, lalu q12h x10 hari [16]. Air raksa: awal 5 mg/kg, lalu 2.5 mg/kg 1–2×/hari x10 hari [16]. Timbal (+ edetat Ca-disodium): ensefalopati berat 4 mg/kg q4h ≥72 jam [16].',
        },
      },
    ],
    contraindications: [
      'Keracunan besi, selenium, atau cadmium (tidak diindikasikan)',
      'Gangguan fungsi hati berat (kecuali keracunan arsen)',
    ],
    warnings: [
      'Hipertensi; awasi reaksi abnormal seperti hiperpireksia [16]',
      'Gangguan ginjal — hentikan/sangat hati-hati bila gagal ginjal selama terapi [16]',
      'Sediaan dalam minyak kacang — perhatikan riwayat alergi',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'penisilamin',
    name: 'Penisilamin',
    aliases: ['Penicillamine', 'Cuprimine'],
    category: 'antidotum',
    mechanism: 'Kelator tembaga, timbal & logam berat lain; juga menurunkan kompleks imun (efek pada artritis reumatoid).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 20, maxPerKg: 25, unit: 'mg/kg',
          frequency: 'dosis terbagi',
          indication: 'Keracunan logam berat (timah hitam, tembaga), penyakit Wilson',
          notes: 'Keracunan logam berat: 20–25 mg/kg/hari dibagi [16]. Penyakit Wilson: sampai 20 mg/kg/hari dibagi (min 500 mg/hari) [16]. Artritis reumatoid (8–12 th): awal 2.5 mg/kg/hari, naik bertahap tiap 4 mgg sampai 15–20 mg/kg/hari [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitivitas, lupus eritematosus',
    ],
    warnings: [
      'Monitor darah & urin rutin (risiko depresi sumsum tulang, proteinuria) [16]',
      'Laporkan segera: lebam, perdarahan, purpura, infeksi, nyeri tenggorok [16]',
      'Hindari terapi emas/klorokuin/imunosupresan bersamaan; besi oral terpisah ≥2 jam [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },

  // ── Antiretroviral (ARV / HIV) ─────────────────────────────────────────
  // Catatan: dosis ARV berbasis pita berat/luas permukaan tubuh (m²)/usia —
  // dikelola spesialis. Memakai fixedDose agar tidak salah hitung per-kg.
  {
    id: 'zidovudin',
    name: 'Zidovudin (AZT)',
    aliases: ['Zidovudine', 'AZT', 'ZDV', 'Retrovir'],
    category: 'antiretroviral',
    mechanism: 'NRTI — analog timidin, menghambat reverse transcriptase HIV.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Neonatus 2 mg/kg/dosis · Anak 180–240 mg/m²/dosis',
          frequency: 'q6–12h (lihat catatan)',
          indication: 'Infeksi HIV, pencegahan penularan ibu-anak (PMTCT)',
          notes: 'Neonatus <6 mgg: 2 mg/kg q6h. Prematur: 2 mg/kg q12h, naik ke q8h pada usia 2 mgg (≥30 mgg gestasi) atau 4 mgg (<30 mgg) [16]. Anak 6 mgg–<18 th: 180–240 mg/m²/dosis q12h [16]. Remaja/dewasa: 300 mg 2×/hari [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif zidovudin, anemia'],
    warnings: [
      'Supresi sumsum tulang (anemia makrositik/neutropenia) — pantau hematokrit, leukosit, fungsi hati [16]',
      'TIDAK boleh bersama stavudin (antagonistik) [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'lamivudin',
    name: 'Lamivudin (3TC)',
    aliases: ['Lamivudine', '3TC', 'Epivir'],
    category: 'antiretroviral',
    mechanism: 'NRTI — analog sitidin, menghambat reverse transcriptase HIV (juga aktif terhadap HBV).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Bayi 2–4 mg/kg · Anak 4 mg/kg (maks 300 mg/hari)',
          frequency: '2× sehari',
          indication: 'Infeksi HIV (kombinasi ≥2 ARV lain)',
          notes: '<1 bln: 2 mg/kg 2×/hari. 1–3 bln: 4 mg/kg 2×/hari (max 300 mg/hari). 3 bln–12 th: 4 mg/kg 2×/hari. >12 th: 150 mg 2×/hari [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif; pankreatitis; gangguan ginjal berat; sirosis hati berat'],
    warnings: [
      'Asidosis laktat & hepatomegali dengan steatosis (potensi mengancam jiwa) [16]',
      'Kekambuhan hepatitis B kronik saat terapi dihentikan — awasi koinfeksi HIV/HBV [16]',
      'Trimetoprim meningkatkan kadar lamivudin plasma [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'nevirapin',
    name: 'Nevirapin (NVP)',
    aliases: ['Nevirapine', 'NVP', 'Viramune'],
    category: 'antiretroviral',
    mechanism: 'NNRTI — berikatan langsung & menghambat reverse transcriptase HIV.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Neonatus PMTCT 2 mg/kg · Anak 120–200 mg/m²/dosis',
          frequency: 'lihat catatan (eskalasi bertahap)',
          indication: 'Infeksi HIV, profilaksis PMTCT',
          notes: 'Neonatus <14 hari (PMTCT): 2 mg/kg dosis tunggal [16]. Anak ≥15 hari: <8 th 200 mg/m²/dosis (max 200 mg) 2×/hari; ≥8 th 120–150 mg/m²/dosis (max 200 mg) 2×/hari [16]. WAJIB mulai dosis rendah 1×/hari x14 hari lalu eskalasi 2×/hari (cegah lesi kulit). Total tidak >400 mg/hari [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif nevirapin'],
    warnings: [
      'Reaksi hipersensitivitas termasuk Sindrom Stevens-Johnson [16]',
      'Hepatotoksisitas (mayoritas dalam 12 minggu pertama; sepertiga setelahnya — pantau fungsi hati berkelanjutan) [16]',
      'Bila terapi terputus >7 hari, ulangi induksi 1×/hari x14 hari [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'lopinavir_ritonavir',
    name: 'Lopinavir/Ritonavir (LPV/r)',
    aliases: ['Lopinavir', 'Ritonavir', 'LPV/r', 'Kaletra', 'Aluvia'],
    category: 'antiretroviral',
    mechanism: 'Penghambat protease HIV (lopinavir); ritonavir sebagai booster farmakokinetik (inhibitor CYP3A4).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Bayi 16/4 mg/kg · Anak 230/57.5 mg/m² atau per pita BB',
          frequency: '2× sehari',
          indication: 'Infeksi HIV',
          notes: 'Bayi 14 hari–6 bln: 300/75 mg/m² atau 16/4 mg/kg 2×/hari. Anak >6 bln: 230/57.5 mg/m²/dosis 2×/hari; atau per BB — <15 kg 12/3 mg/kg, 15–40 kg 10/2.5 mg/kg, >40 kg 400/100 mg 2×/hari [16]. Dosis 1×/hari TIDAK direkomendasikan. Solusio oral diberi bersama makanan [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif lopinavir/ritonavir'],
    warnings: [
      'Perpanjangan interval PR & QT, torsade de pointes [16]',
      'Hiperlipidemia, hiperglikemia, maldistribusi lemak [16]',
      'Jangan kombinasi dengan EFV/NVP/FPV/NFV pada bayi <6 bln; bila dengan ddI beri 1–2 jam terpisah [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'efavirenz',
    name: 'Efavirenz (EFV)',
    aliases: ['Efavirenz', 'EFV', 'Stocrin', 'Sustiva'],
    category: 'antiretroviral',
    mechanism: 'NNRTI — menghambat reverse transcriptase HIV.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Anak ≥3 th & ≥10 kg: 200–600 mg per pita BB',
          frequency: '1× sehari (saat akan tidur)',
          indication: 'Infeksi HIV (anak ≥3 tahun, ≥10 kg)',
          notes: 'Per pita BB 1×/hari: 10–<15 kg 200 mg; 15–<20 kg 250 mg; 20–<25 kg 300 mg; 25–<32.5 kg 350 mg; 32.5–<40 kg 400 mg; ≥40 kg 600 mg [16]. Beri saat perut kosong, sebelum tidur. Neonatus & anak <3 th: tidak diperbolehkan [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif efavirenz; gangguan hati berat; kehamilan (teratogenik)'],
    warnings: [
      'Teratogenik — JANGAN pada ibu hamil [16]',
      'Gejala SSP (pusing, mimpi abnormal) — beri sebelum tidur untuk tolerabilitas [16]',
      'Lesi kulit, peningkatan transaminase [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'abacavir',
    name: 'Abacavir (ABC)',
    aliases: ['Abacavir', 'ABC', 'Ziagen'],
    category: 'antiretroviral',
    mechanism: 'NRTI — analog guanosin, menghambat reverse transcriptase HIV.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Anak 8 mg/kg (maks 300 mg) 2× sehari',
          frequency: '2× sehari',
          indication: 'Infeksi HIV (anak ≥3 bulan)',
          notes: 'Anak: 8 mg/kg (max 300 mg) 2×/hari; atau per pita BB — 14–21 kg ½ tab pagi+½ malam, >21–<30 kg ½+1 tab, ≥30 kg 1+1 tab [16]. Bayi <3 bln: tidak diperbolehkan [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif abacavir'],
    warnings: [
      'Reaksi hipersensitivitas yang dapat MEMATIKAN (demam, lesi, gejala napas/GI) — edukasi pasien/orang tua [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'stavudin',
    name: 'Stavudin (d4T)',
    aliases: ['Stavudine', 'd4T', 'Zerit'],
    category: 'antiretroviral',
    mechanism: 'NRTI — analog timidin, menghambat reverse transcriptase HIV.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Neonatus 0.5 mg/kg · Anak 1 mg/kg 2× sehari',
          frequency: '2× sehari',
          indication: 'Infeksi HIV',
          notes: 'Neonatus/bayi (lahir–13 hari): 0.5 mg/kg 2×/hari. Anak (14 hari–BB >30 kg): 1 mg/kg 2×/hari. Remaja ≥30 kg/dewasa: 30 mg 2×/hari [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif stavudin'],
    warnings: [
      'TIDAK boleh bersama zidovudin (antagonistik) [16]',
      'Pankreatitis, asidosis laktat dengan steatosis hati, neuropati perifer [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'didanosin',
    name: 'Didanosin (ddI)',
    aliases: ['Didanosine', 'ddI', 'DDI', 'Videx'],
    category: 'antiretroviral',
    mechanism: 'NRTI — analog adenosin, menghambat reverse transcriptase HIV.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Bayi/anak 50–120 mg/m²/dosis · per pita BB pada anak besar',
          frequency: 'q12h atau 1× sehari (formulasi EC)',
          indication: 'Infeksi HIV (kombinasi 2 ARV lain)',
          notes: 'Neonatus/bayi 2 mgg–<3 bln: 50 mg/m² q12h; 3–8 bln: 100 mg/m² q12h; >8 bln: 120 mg/m² q12h [16]. Anak besar (Videx EC, ≥20 kg): 20–<25 kg 200 mg, 25–<60 kg 250 mg, ≥60 kg 400 mg 1×/hari [16]. Beri perut kosong (30 mnt sebelum / ≥1 jam sesudah makan).',
        },
      },
    ],
    contraindications: ['Hipersensitif didanosin'],
    warnings: [
      'Pankreatitis (terkait dosis), neuropati perifer, hiperurikemia [16]',
      'Asidosis laktat & hepatomegali dengan steatosis [16]',
      'Periksa retina tiap 6 bulan atau bila ada perubahan penglihatan [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'tenofovir',
    name: 'Tenofovir (TDF)',
    aliases: ['Tenofovir', 'TDF', 'Viread'],
    category: 'antiretroviral',
    mechanism: 'NtRTI — analog nukleotida, menghambat reverse transcriptase HIV (juga aktif terhadap HBV).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Remaja ≥12 th & >35 kg: 300 mg 1× sehari',
          frequency: '1× sehari',
          indication: 'Infeksi HIV (remaja ≥12 tahun, >35 kg)',
          notes: 'Remaja ≥12 th & >35 kg: 300 mg 1×/hari [16]. Anak <12 th: tidak diperbolehkan (sediaan hanya tablet 300 mg; dosis investigasi 8 mg/kg 1×/hari) [16]. Neonatus/bayi: tidak diperbolehkan [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif tenofovir'],
    warnings: [
      'Insufisiensi ginjal, sindrom Fanconi [16]',
      'Berkurangnya kepadatan mineral tulang [16]',
      'Cek HBV sebelum mulai; eksaserbasi akut HBV bila TDF dihentikan [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'emtricitabin',
    name: 'Emtricitabin (FTC)',
    aliases: ['Emtricitabine', 'FTC', 'Emtriva'],
    category: 'antiretroviral',
    mechanism: 'NRTI — analog sitidin, menghambat reverse transcriptase HIV (juga aktif terhadap HBV).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: 'Anak 6 mg/kg (maks 200 mg) 1× sehari',
          frequency: '1× sehari',
          indication: 'Infeksi HIV',
          notes: 'Bayi: 3 mg/kg 1×/hari. Anak 3 bln–17 th: 6 mg/kg (max 200 mg) 1×/hari. Remaja ≥18 th/dewasa: 200 mg 1×/hari [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif emtricitabin'],
    warnings: [
      'Hiperpigmentasi telapak tangan/kaki (terutama kulit gelap) [16]',
      'Cek HBV sebelum mulai; eksaserbasi hepatitis bila FTC dihentikan [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },

  // ── Anti-Lepra ─────────────────────────────────────────────────────────
  {
    id: 'dapson',
    name: 'Dapson',
    aliases: ['Dapsone', 'DDS'],
    category: 'antibiotik',
    mechanism: 'Sulfon — menghambat sintesis folat bakteri (analog PABA); bakteriostatik terhadap M. leprae.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: '<10 th: 25 mg/hari · 10–14 th: 50 mg/hari',
          frequency: '1× sehari',
          indication: 'Lepra pausibasiler (PB) & multibasiler (MB)',
          notes: 'Kombinasi dengan rifampisin (± klofazimin untuk MB). PB: <10 th 25 mg/hari, 10–14 th 50 mg/hari — selama 6 bulan. MB: dosis sama, selama 12 bulan [16].',
        },
      },
    ],
    contraindications: ['Hipersensitif sulfon, anemia berat'],
    warnings: [
      'Hemolisis & methemoglobinemia — obati anemia dulu & pantau darah [16]',
      'Defisiensi G6PD (termasuk bayi via ASI) [16]',
      '"Dapsone syndrome": ruam, demam, ikterus, eosinofilia [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'klofazimin',
    name: 'Klofazimin',
    aliases: ['Clofazimine', 'Lamprene'],
    category: 'antibiotik',
    mechanism: 'Pewarna riminofenazin — berikatan dengan DNA mikobakteri; antiinflamasi (untuk reaksi lepra).',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0, maxPerKg: 0, unit: 'mg/kg',
          fixedDose: '10–14 th: 50 mg selang sehari + 150 mg/bulan',
          frequency: 'lihat catatan',
          indication: 'Lepra multibasiler (MB), reaksi lepra tipe-II (ENL)',
          notes: 'MB (+ dapson & rifampisin): 10–14 th 50 mg selang sehari + 150 mg sekali/bulan; <10 th 50 mg 2×/minggu + 100 mg/bulan — selama 12 bulan [16]. Reaksi tipe-II/ENL: 100–300 mg/hari dibagi 2–3, sampai ≥3 bulan [16]. Beri bersama makanan/susu.',
        },
      },
    ],
    warnings: [
      'Perubahan warna kulit/kornea/cairan tubuh (reversibel); mewarnai lensa kontak [16]',
      'Gangguan GI terkait dosis; dosis besar jangka panjang → obstruksi usus subakut [16]',
    ],
    references: ['idai2012'],
    verified: true,
  },

  // ── Lainnya ────────────────────────────────────────────────────────────
  {
    id: 'kalsium_glukonat',
    name: 'Kalsium Glukonat',
    aliases: ['Calcium Gluconate', 'Ca Glukonas'],
    category: 'lainnya',
    mechanism: 'Suplemen kalsium. Koreksi hipokalsemia & tetani; menstabilkan membran miokardium (mis. pada hiperkalemia).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 200, maxPerKg: 1000, unit: 'mg/kg',
          frequency: 'infus kontinu atau terbagi 4 dosis (dosis/hari)',
          ivDuration: 'IV perlahan; hindari ekstravasasi',
          indication: 'Hipokalsemia / tetani hipokalsemik',
          notes: 'Bayi & anak: 200–1000 mg/kg/hari (= 2–10 mL larutan 10%), maks 15 g/hari [16]. Larutan 10% = 100 mg/mL (≈ 0,22 mmol Ca²⁺/mL). Neonatus hipokalsemia bergejala: bolus 0,5 mL/kg larutan 10%; rumatan 4,5 mL/kg/hari.',
        },
      },
    ],
    contraindications: [
      'Hiperkalsemia & hiperkalsiuria (mis. pada beberapa keganasan)',
    ],
    warnings: [
      'Pantau konsentrasi kalsium plasma',
      'Ekstravasasi → iritasi & nekrosis jaringan',
      'Bradikardia / aritmia bila diberikan IV terlalu cepat',
      'Jangan dicampur dengan natrium bikarbonat atau fosfat (presipitasi)',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'kcl',
    name: 'Kalium Klorida (KCl)',
    aliases: ['Potassium Chloride', 'Potasium Klorida', 'KCl'],
    category: 'lainnya',
    mechanism: 'Suplemen kalium untuk koreksi & pencegahan hipokalemia.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 2, maxPerKg: 3, unit: 'mEq/kg',
          frequency: 'infus rumatan (per hari)',
          ivDuration: 'HARUS diencerkan; jangan bolus; laju perifer maks ~0,2–0,3 mEq/kg/jam dengan monitor EKG',
          indication: 'Rumatan kalium / hipokalemia',
          notes: 'Rumatan 2–3 mEq(mmol)/kg/hari [16]. Deplesi akut: 0,6 mmol/kg dalam 3 jam, lalu 2–4 mmol/kg/hari. Oral: 2–3 mmol/kg/hari terbagi 3 dosis.',
        },
      },
    ],
    contraindications: [
      'Hiperkalemia',
      'Pemberian IV tanpa pengenceran',
    ],
    warnings: [
      'JANGAN diberikan bolus IV — risiko henti jantung',
      'Harus diencerkan, laju lambat, dengan monitor EKG pada koreksi cepat',
      'Pantau kalium serum; risiko aritmia',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'heparin',
    name: 'Heparin (Unfractionated)',
    aliases: ['Heparin Sodium', 'UFH', 'Heparin Natrium'],
    category: 'lainnya',
    mechanism: 'Antikoagulan. Mempotensiasi antitrombin III → menghambat trombin (faktor IIa) & faktor Xa.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 15, maxPerKg: 25, unit: 'unit/kg',
          frequency: 'infus kontinu (unit/kg/jam)',
          ivDuration: 'bolus rendah, lalu infus kontinu; titrasi sesuai APTT',
          indication: 'Trombosis vena dalam & emboli paru',
          notes: 'Infus kontinu 15–25 unit/kg/jam; alternatif 250 unit/kg tiap 12 jam [16]. Antidotum: protamin sulfat.',
        },
      },
    ],
    contraindications: [
      'Hemofilia & gangguan perdarahan lain, trombositopenia',
      'Ulkus peptikum, perdarahan otak baru, perdarahan tak terkontrol, DIC',
      'Hipertensi berat, penyakit hati/ginjal berat, endokarditis bakterial subakut',
    ],
    warnings: [
      'Pantau hitung trombosit — HIT (heparin-induced thrombocytopenia) timbul 6–10 hari',
      'Pantau APTT 6–8 jam setelah mulai/ubah dosis',
      'Perdarahan, nekrosis kulit, hiperkalemia',
      'Pemakaian lama: osteoporosis & alopesia',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'insulin',
    name: 'Insulin (Regular / Rapid-acting)',
    aliases: ['Insulin Reguler', 'Actrapid', 'Humulin R'],
    category: 'lainnya',
    mechanism: 'Hormon. Meningkatkan ambilan glukosa seluler & menekan glukoneogenesis; menggeser kalium ke intrasel (berguna pada hiperkalemia).',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.1, unit: 'unit/kg',
          frequency: 'infus kontinu (unit/kg/jam)',
          ivDuration: 'infus kontinu; pantau glukosa tiap jam',
          indication: 'Ketoasidosis diabetikum (KAD)',
          notes: 'Regimen dosis kecil: loading IV 0,1 unit/kg (opsional) lalu infus 0,1 unit/kg/jam [16]. Hiperkalemia: infus IV 0,02–1 unit/kg/jam bersama glukosa 25%.',
        },
      },
      {
        route: 'SC',
        dose: {
          minPerKg: 0.05, maxPerKg: 0.2, unit: 'unit/kg',
          frequency: 'tiap 4–6 jam',
          indication: 'Hiperglikemia neonatus',
          notes: 'Neonatus: SC 0,05–0,2 unit/kg/dosis tiap 4–6 jam, atau infus IV 0,01–0,1 unit/kg/jam; titrasi sesuai glukosa darah [16].',
        },
      },
    ],
    contraindications: [
      'Hipoglikemia',
    ],
    warnings: [
      'Hipoglikemia bila overdosis — pantau glukosa darah ketat',
      'Pantau kalium (hipokalemia saat koreksi KAD / hiperkalemia)',
      'Kurangi dosis pada gangguan ginjal',
    ],
    specialPopulations: {
      neonates: 'Hiperglikemia persisten: SC 0,05–0,2 unit/kg/dosis tiap 4–6 jam atau infus IV 0,01–0,1 unit/kg/jam, titrasi sesuai kadar glukosa darah [16].',
    },
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'kafein_sitrat',
    name: 'Kafein Sitrat',
    aliases: ['Caffeine Citrate', 'Caffeine'],
    category: 'lainnya',
    mechanism: 'Metilxantin. Stimulan pusat napas — meningkatkan sensitivitas terhadap CO₂ & menurunkan frekuensi apnea pada prematur.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 10, maxPerKg: 10, unit: 'mg/kg',
          frequency: 'dosis awal (loading)',
          ivDuration: 'dosis > 5 mg/kg perlahan 30 menit; ≤ 5 mg/kg selama 10 menit',
          indication: 'Apnea prematuritas; fasilitasi ekstubasi',
          notes: 'Dosis awal 10 mg/kg, rumatan 2,5 mg/kg/hari (dapat ditingkatkan hingga 5 mg/kg/hari), IV atau oral [16]. Konfirmasi sediaan (kafein sitrat vs kafein basa) sebelum menghitung.',
        },
      },
    ],
    contraindications: [
      'Takikardia (denyut jantung > 180×/menit)',
      'Perdarahan saluran cerna',
    ],
    warnings: [
      'Takikardia, iritabilitas, intoleransi minum, hipotensi, hiperglikemia',
      'Waspada pada gangguan fungsi ginjal & hati',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    aliases: ['Ibuprofen', 'Proris', 'Brufen', 'Bufect'],
    category: 'analgesik',
    mechanism: 'AINS — inhibisi siklooksigenase (COX-1 & COX-2) → menurunkan sintesis prostaglandin; efek analgesik, antipiretik, anti-inflamasi.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 20, maxPerKg: 40, unit: 'mg/kg',
          frequency: 'terbagi 3–4 dosis/hari; dengan/sesudah makan (dosis/hari)',
          indication: 'Nyeri, demam, artritis juvenil',
          notes: 'Tidak direkomendasikan untuk BB < 7 kg. Artritis juvenil 30–40 mg/kg/hari; nyeri < 1 th 20–30 mg/kg/hari [16]. Dosis tetap per usia: 1–2 th 50 mg, 3–7 th 100 mg, 8–12 th 200 mg — 3–4×/hari.',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap aspirin/AINS (asma, angioedema, urtikaria, rinitis)',
      'Ulkus peptikum',
    ],
    warnings: [
      'Gangguan saluran cerna & perdarahan GI',
      'Hati-hati pada gangguan fungsi hati/ginjal, penyakit jantung, gangguan koagulasi',
      'Retensi cairan & peningkatan tekanan darah',
    ],
    renalAdjustment: 'Hindari atau kurangi dosis pada gangguan ginjal (risiko nefrotoksik & retensi cairan).',
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'kodein',
    name: 'Kodein Fosfat',
    aliases: ['Codeine', 'Kodein'],
    category: 'analgesik',
    mechanism: 'Opioid lemah (prodrug — dimetabolisme menjadi morfin via CYP2D6). Analgesik nyeri ringan–sedang.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0.5, maxPerKg: 1, unit: 'mg/kg',
          frequency: 'tiap 4–6 jam prn',
          indication: 'Nyeri ringan–sedang',
          notes: '1–12 th: 0,5–1 mg/kg PO q4–6h prn. > 12 th: 10–20 mg/dosis q4–6h, maks 120 mg/hari [16]. Berikan bersama makanan/air.',
        },
      },
    ],
    contraindications: [
      'Depresi pernapasan, penyakit obstruksi saluran napas, serangan asma akut',
      'Risiko ileus paralitik',
    ],
    warnings: [
      'PERINGATAN REGULATOR (FDA/EMA 2017): hindari pada anak < 12 tahun dan pasca-tonsilektomi/adenoidektomi — risiko depresi napas fatal pada metabolisme ultra-cepat CYP2D6',
      'Ketergantungan pada penggunaan jangka panjang; konstipasi',
      'Depresi napas pada overdosis — antidot: nalokson',
    ],
    renalAdjustment: 'ClCr 10–50 mL/menit: berikan 75% dosis.',
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'klorfeniramin',
    name: 'Klorfeniramin Maleat (CTM)',
    aliases: ['Chlorpheniramine', 'CTM', 'Klorfeniramin'],
    category: 'lainnya',
    mechanism: 'Antihistamin H₁ generasi pertama (sedatif). Memblok reseptor histamin → meredakan gejala alergi.',
    routes: [
      {
        route: 'IM',
        dose: {
          minPerKg: 87.5, maxPerKg: 87.5, unit: 'mcg/kg',
          frequency: 'dapat diulang hingga 4×/hari',
          indication: 'Reaksi alergi (SC/IM)',
          notes: 'SC/IM 87,5 mcg/kg. Oral per usia: 1–2 th 1 mg 2×/hari; 2–5 th 1 mg q4–6h (maks 6 mg/hari); 6–12 th 2 mg q4–6h (maks 12 mg/hari). Anafilaksis (penunjang) IV: < 1 th 250 mcg/kg; 1–5 th 2,5–5 mg; 6–12 th 5–10 mg, selama 1 menit [16].',
        },
      },
    ],
    contraindications: [
      'Anak < 1 tahun',
      'Retensi urin, ileus, obstruksi piloroduodenal',
      'Glaukoma',
    ],
    warnings: [
      'Mengantuk; stimulasi paradoks pada anak / dosis tinggi',
      'Efek antikolinergik: mulut kering, retensi urin, pandangan kabur',
      'Hati-hati pada epilepsi, gangguan hati/ginjal',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'metoklopramid',
    name: 'Metoklopramid',
    aliases: ['Metoclopramide', 'Primperan', 'Metokloperamid'],
    category: 'antiemetik',
    mechanism: 'Antagonis reseptor dopamin D₂ (sentral & perifer) dengan efek prokinetik; pada dosis tinggi juga agonis 5-HT₄.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.15, unit: 'mg/kg',
          frequency: 'tiap 8 jam (maks 0,5 mg/kg/hari)',
          ivDuration: 'IV lambat 1–2 menit',
          indication: 'Mual & muntah, GERD, gastroparesis',
          notes: 'Dosis ditetapkan per pita BB (mis. BB 20–29 kg: 2,5 mg 3×/hari), maks 500 mcg/kg/hari [16]. Kemoterapi (dosis tinggi IV): awal 2–4 mg/kg lalu 3–5 mg/kg, maks 10 mg/kg/24 jam.',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 0.1, maxPerKg: 0.15, unit: 'mg/kg',
          frequency: 'tiap 8 jam (maks 0,5 mg/kg/hari)',
          indication: 'Mual & muntah, GERD',
        },
      },
    ],
    contraindications: [
      'Obstruksi gastrointestinal, perdarahan/perforasi 3–4 hari pasca-bedah',
      'Kejang',
      'Feokromositoma',
    ],
    warnings: [
      'Gejala ekstrapiramidal (terutama anak & remaja) — batasi durasi & dosis',
      'Tardive dyskinesia pada pengobatan lama; sindrom neuroleptik maligna',
      'Methemoglobinemia (lebih berat pada defisiensi G6PD)',
    ],
    renalAdjustment: 'ClCr 40–50 mL/menit: 75% dosis; 10–40: 50% dosis; < 10: 25–50% dosis.',
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'prometazin',
    name: 'Prometazin',
    aliases: ['Promethazine', 'Phenergan'],
    category: 'antiemetik',
    mechanism: 'Antihistamin H₁ golongan fenotiazin dengan efek antiemetik, sedatif, dan antikolinergik.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0.5, maxPerKg: 1, unit: 'mg/kg',
          frequency: 'tiap 6 jam prn',
          indication: 'Sedasi / antiemetik / premedikasi',
          notes: 'Sedasi (PO/IM/IV/rektal) 0,5–1 mg/kg/dosis q6h prn; antihistamin 0,1 mg/kg q6h; premedikasi 0,5–1 mg/kg [16].',
        },
      },
    ],
    contraindications: [
      'Umur < 1 tahun (depresi napas fatal)',
      'Gangguan kesadaran karena depresi serebral',
      'Porfiria',
    ],
    warnings: [
      'PERINGATAN: kontraindikasi pada anak < 2 tahun (FDA boxed warning) — risiko depresi napas fatal',
      'Sedasi; dapat terjadi stimulasi paradoks pada anak / dosis besar',
      'Jangan injeksi intra-arteri / ekstravasasi (nekrosis jaringan berat)',
      'Efek antikolinergik: retensi urin, mulut kering',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'omeprazol',
    name: 'Omeprazol',
    aliases: ['Omeprazole', 'OMZ', 'Losec'],
    category: 'lainnya',
    mechanism: 'Penghambat pompa proton (H⁺/K⁺-ATPase) sel parietal lambung → menekan produksi asam lambung secara kuat & lama.',
    routes: [
      {
        route: 'PO',
        dose: {
          minPerKg: 0.7, maxPerKg: 3.5, unit: 'mg/kg',
          frequency: '1–2×/hari (dosis/hari)',
          indication: 'GERD, esofagitis, ulkus, profilaksis stress ulcer',
          notes: 'GERD/esofagitis/ulkus: 0,7–3,5 mg/kg/hari selama 2–8 minggu. Infeksi H. pylori: 0,7–3,5 mg/kg/hari sekali sehari 1–2 minggu [16].',
        },
      },
      {
        route: 'IV',
        dose: {
          minPerKg: 0.7, maxPerKg: 3.5, unit: 'mg/kg',
          frequency: '1–2×/hari (dosis/hari)',
          indication: 'Bila tidak dapat per oral',
          notes: 'Tersedia serbuk injeksi 40 mg [16].',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap omeprazole atau golongan benzimidazol (albendazol, mebendazol)',
    ],
    warnings: [
      'Hipomagnesemia pada pemakaian lama — pantau kadar magnesium',
      'Hati-hati pada kelainan hati',
    ],
    references: ['idai2012'],
    verified: true,
  },
  {
    id: 'ranitidin',
    name: 'Ranitidin',
    aliases: ['Ranitidine', 'Zantac'],
    category: 'lainnya',
    mechanism: 'Antagonis reseptor H₂ histamin pada sel parietal → menurunkan sekresi asam lambung.',
    routes: [
      {
        route: 'IV',
        dose: {
          minPerKg: 1, maxPerKg: 1, unit: 'mg/kg',
          frequency: 'tiap 6–8 jam',
          indication: 'Ulkus, hipersekresi lambung, GERD',
          notes: 'Anak: 2–4 mg/kg/kali q8–12h. Neonatus IV 1 mg/kg q6–8h, oral 2–4 mg/kg q8–12h [16].',
        },
      },
      {
        route: 'PO',
        dose: {
          minPerKg: 2, maxPerKg: 4, unit: 'mg/kg',
          frequency: 'tiap 8–12 jam',
          indication: 'Ulkus, GERD (oral)',
        },
      },
    ],
    contraindications: [
      'Hipersensitif terhadap ranitidin',
    ],
    warnings: [
      'CATATAN: ranitidin ditarik dari peredaran di banyak negara (2020) karena kontaminasi NDMA — banyak pedoman beralih ke PPI atau famotidin',
      'Hati-hati pada gangguan fungsi hati & ginjal',
      'Jarang: bradikardia, trombositopenia',
    ],
    references: ['idai2012'],
    verified: true,
  },
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
  antiparasit:    'Antiparasit',
  antiretroviral: 'Antiretroviral',
  antidotum:      'Antidotum',
  lainnya:        'Lainnya',
};

export const DRUG_CATEGORY_ORDER: DrugCategory[] = [
  'emergensi', 'vasoaktif', 'antikonvulsan', 'sedasi', 'analgesik',
  'bronkodilator', 'kortikosteroid', 'diuretik', 'antiemetik',
  'antibiotik', 'antiviral', 'antijamur', 'antiparasit', 'antiretroviral',
  'antidotum', 'lainnya',
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
