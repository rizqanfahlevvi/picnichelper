// ─────────────────────────────────────────────────────────────────────────
// Library cairan intravena — komposisi kimiawi standar.
// Sumber: Gomella TL. Neonatology. 8th ed. 2020; package inserts;
//         Morgan GE et al. Clinical Anesthesiology. 5th ed. 2013.
// ─────────────────────────────────────────────────────────────────────────

export type FluidCategory =
  | 'kristaloid_isotonik'
  | 'kristaloid_hipotonik'
  | 'kristaloid_hipertonik'
  | 'koloid'
  | 'darah'
  | 'nutrisi'
  | 'khusus';

export type Tonicity = 'hipotonik' | 'isotonik' | 'hipertonik';

export interface FluidComposition {
  /** Natrium (mEq/L) */
  na?: number;
  /** Kalium (mEq/L) */
  k?: number;
  /** Klorida (mEq/L) */
  cl?: number;
  /** Kalsium (mEq/L) */
  ca?: number;
  /** Magnesium (mEq/L) */
  mg?: number;
  /** Laktat (mEq/L) */
  lactate?: number;
  /** Asetat (mEq/L) */
  acetate?: number;
  /** Bikarbonat (mEq/L) */
  bicarb?: number;
  /** Glukosa (g/L) */
  glucose?: number;
  /** Osmolarity (mOsm/L) */
  osmolarity: number;
  tonicity: Tonicity;
  /** pH larutan */
  pH?: number;
  /** Kalori (kcal/L) */
  kcalPerL?: number;
}

export interface FluidEntry {
  id: string;
  name: string;
  /** Nama alternatif untuk search */
  aliases: string[];
  category: FluidCategory;
  composition: FluidComposition;
  indications: string[];
  cautions: string[];
  /** Catatan klinis tambahan */
  notes?: string;
  /** Kunci referensi dari src/data/references.ts */
  references?: string[];
}

export const FLUID_LIBRARY: FluidEntry[] = [

  // ── Kristaloid Isotonik ─────────────────────────────────────────────────
  {
    id: 'nacl_09',
    name: 'NaCl 0.9% (Normal Saline)',
    aliases: ['NS', 'Normal Saline', 'Saline', 'NaCl', 'Garam Fisiologis'],
    category: 'kristaloid_isotonik',
    composition: {
      na: 154, cl: 154,
      osmolarity: 308, tonicity: 'isotonik', pH: 5.0,
    },
    indications: [
      'Resusitasi cairan lini pertama (syok hipovolemik)',
      'Koreksi dehidrasi isotonis',
      'Pelarut obat IV (kompatibel luas)',
      'Alkalosis metabolik hipokloremik (muntah)',
    ],
    cautions: [
      'Pemberian besar → asidosis hiperkloremik (Cl tinggi)',
      'Hindari pada pasien edema atau gagal jantung kongestif',
      'Hipernatremia bila diberikan berlebihan',
    ],
    notes: 'Cairan paling sering digunakan. Klorida 154 mEq/L (lebih tinggi dari plasma 103 mEq/L) → risiko asidosis hiperkloremik pada infus masif.',
    references: ['pals2020', 'morgan2013'],
  },
  {
    id: 'rl',
    name: 'Ringer Laktat (RL)',
    aliases: ['Ringer Lactate', 'Hartmann', 'LR', 'RL'],
    category: 'kristaloid_isotonik',
    composition: {
      na: 130, k: 4, ca: 3, cl: 109, lactate: 28,
      osmolarity: 273, tonicity: 'isotonik', pH: 6.5,
    },
    indications: [
      'Resusitasi cairan — lebih fisiologis dari NS pada volume besar',
      'Koreksi dehidrasi isotonis',
      'Luka bakar (Parkland formula)',
      'Cairan perioperatif pilihan',
    ],
    cautions: [
      'Mengandung laktat → metabolisme hati; hindari pada gagal hati berat',
      'Mengandung K 4 mEq/L → hati-hati pada hiperkalemia',
      'Tidak kompatibel dengan transfusi darah (Ca dapat menyebabkan koagulasi)',
      'Sedikit hipotonik (273 vs 308 mOsm/L) → tidak ideal pada edema serebral',
    ],
    notes: 'Komposisi paling menyerupai plasma. Laktat dikonversi ke bikarbonat di hati → efek buffer ringan. Pilihan lebih baik dari NS untuk resusitasi volume besar.',
    references: ['pals2020', 'morgan2013'],
  },
  {
    id: 'plas_lyte',
    name: 'Plasma-Lyte 148',
    aliases: ['PlasmaLyte', 'Plasma Lyte', 'Normosol', 'Physiolyte'],
    category: 'kristaloid_isotonik',
    composition: {
      na: 140, k: 5, cl: 98, mg: 3, acetate: 27, lactate: 23,
      osmolarity: 294, tonicity: 'isotonik', pH: 7.4,
    },
    indications: [
      'Resusitasi cairan — paling fisiologis',
      'Pasien dengan risiko asidosis hiperkloremik',
      'Keseimbangan asam-basa lebih baik dari NS/RL',
    ],
    cautions: [
      'Harga lebih mahal dari NS atau RL',
      'Ketersediaan terbatas di beberapa RS Indonesia',
      'Mengandung K 5 mEq/L — hati-hati hiperkalemia',
    ],
    notes: 'pH 7.4 dan komposisi elektrolit sangat mendekati plasma manusia. Pilihan ideal untuk resusitasi masif bila tersedia.',
    references: ['pals2020', 'morgan2013'],
  },

  // ── Kristaloid Hipotonik ────────────────────────────────────────────────
  {
    id: 'nacl_045',
    name: 'NaCl 0.45% (½ Normal Saline)',
    aliases: ['Half NS', '½NS', 'NaCl 0.45', 'Saline Hipotonik'],
    category: 'kristaloid_hipotonik',
    composition: {
      na: 77, cl: 77,
      osmolarity: 154, tonicity: 'hipotonik', pH: 5.0,
    },
    indications: [
      'Cairan maintenance pada anak (kombinasi dengan dextrose)',
      'Koreksi dehidrasi hipertonik (Na tinggi)',
    ],
    cautions: [
      'JANGAN sebagai cairan resusitasi — risiko hiponatremia dan edema serebral',
      'Hipotonik → air bebas masuk sel → bahaya pada cedera otak',
      'Hindari sebagai bolus pada syok',
    ],
    notes: 'Biasanya diberikan sebagai D5 + NaCl 0.45% untuk maintenance. Tidak boleh digunakan sebagai cairan resusitasi.',
    references: ['holliday1957', 'aap_maintenance2018', 'morgan2013'],
  },
  {
    id: 'd5w',
    name: 'Dextrose 5% (D5W)',
    aliases: ['D5', 'D5W', 'Dex 5%', 'Glukosa 5%'],
    category: 'kristaloid_hipotonik',
    composition: {
      glucose: 50,
      osmolarity: 252, tonicity: 'hipotonik', pH: 4.0, kcalPerL: 170,
    },
    indications: [
      'Sumber kalori pada pasien puasa singkat',
      'Pelarut obat yang tidak kompatibel dengan NS',
      'Koreksi hipoglikemia ringan (D10% lebih sering dipakai pada anak)',
      'Defisit air bebas pada hipernatremia (bersama NS)',
    ],
    cautions: [
      'Tidak mengandung elektrolit — jangan sebagai cairan maintenance tunggal',
      'JANGAN sebagai resusitasi — air bebas menyebabkan hiponatremia',
      'Hiperglikemia pada pemberian cepat — pantau GDS',
      'Pasien cedera otak: hindari (perburuk edema serebral)',
    ],
    notes: 'Setelah dimetabolisme glukosa, efeknya setara air bebas (hipotonik murni). D5% 1 L = 170 kkal.',
    references: ['morgan2013', 'holliday1957'],
  },
  {
    id: 'd10w',
    name: 'Dextrose 10% (D10W)',
    aliases: ['D10', 'D10W', 'Dex 10%', 'Glukosa 10%'],
    category: 'kristaloid_hipotonik',
    composition: {
      glucose: 100,
      osmolarity: 505, tonicity: 'hipertonik', pH: 4.0, kcalPerL: 340,
    },
    indications: [
      'Koreksi hipoglikemia neonatus dan bayi',
      'Cairan maintenance neonatus (GIR 4–6 mg/kg/mnt)',
      'Sumber kalori pada nutrisi parenteral parsial',
    ],
    cautions: [
      'Hiperglikemia bila infus terlalu cepat',
      'Osmolarity tinggi (505) → flebitis bila via perifer lama',
      'Pada neonatus: hitung GIR (Glucose Infusion Rate) tiap penyesuaian',
    ],
    notes: 'GIR (mg/kg/mnt) = konsentrasi glukosa (g/dL) × laju (mL/jam) ÷ (berat kg × 6). Neonatus aterm normal: GIR 4–6 mg/kg/mnt.',
    references: ['gomella2020', 'morgan2013'],
  },
  {
    id: 'd5_nacl045',
    name: 'D5 + NaCl 0.45%',
    aliases: ['D5½NS', 'D5 Half NS', 'Dex-Salin'],
    category: 'kristaloid_hipotonik',
    composition: {
      na: 77, cl: 77, glucose: 50,
      osmolarity: 406, tonicity: 'hipotonik', pH: 4.5, kcalPerL: 170,
    },
    indications: [
      'Cairan maintenance pediatri klasik (Holliday-Segar)',
      'Pasien tidak puasa yang membutuhkan maintenance + kalori',
    ],
    cautions: [
      'Panduan terbaru (AAP 2018) merekomendasikan cairan isotonik untuk maintenance rawat inap',
      'Risiko hiponatremia iatrogenik pada anak sakit (ADH meningkat)',
      'Jangan gunakan sebagai resusitasi',
    ],
    notes: 'AAP 2018 merekomendasikan NaCl 0.9% + D5% (isotonik) untuk maintenance rawat inap pediatri menggantikan ½NS, kecuali ada indikasi khusus hipernatremia.',
    references: ['aap_maintenance2018', 'holliday1957', 'morgan2013'],
  },
  {
    id: 'd5_nacl09',
    name: 'D5 + NaCl 0.9%',
    aliases: ['D5NS', 'D5 Normal Saline'],
    category: 'kristaloid_isotonik',
    composition: {
      na: 154, cl: 154, glucose: 50,
      osmolarity: 560, tonicity: 'hipertonik', pH: 4.5, kcalPerL: 170,
    },
    indications: [
      'Maintenance isotonik + kalori (rekomendasi AAP 2018)',
      'Pasien rawat inap pediatri sebagai cairan maintenance',
    ],
    cautions: [
      'Osmolarity tinggi (560) — tidak ideal untuk bolus cepat',
      'Hipernatremia bila diberikan berlebihan',
    ],
    notes: 'Pilihan maintenance yang lebih aman dari D5½NS pada anak sakit rawat inap (menurunkan risiko hiponatremia iatrogenik).',
    references: ['aap_maintenance2018', 'holliday1957'],
  },

  {
    id: 'd5_nacl0225',
    name: 'D5 + NaCl 0.225% (D5 ¼ NS)',
    aliases: ['D5¼NS', 'D5 Quarter NS', 'D5 1/4 NS', 'D5 ¼ NS'],
    category: 'kristaloid_hipotonik',
    composition: {
      na: 38.5, cl: 38.5, glucose: 50,
      osmolarity: 330, tonicity: 'hipotonik', pH: 4.5, kcalPerL: 170,
    },
    indications: [
      'Cairan maintenance neonatus dan bayi muda (kombinasi glukosa + elektrolit minimal)',
      'Koreksi dehidrasi hipertonik dengan kadar Na sangat tinggi',
    ],
    cautions: [
      'Kandungan Na sangat rendah (38.5 mEq/L) → risiko hiponatremia iatrogenik pada anak sakit',
      'Panduan AAP 2018 merekomendasikan cairan isotonik untuk maintenance rawat inap — gunakan hanya bila ada indikasi spesifik',
      'Jangan gunakan sebagai resusitasi',
    ],
    notes: 'Mengandung Na 38.5 mEq/L dan Cl 38.5 mEq/L (¼ dari NS). Glukosa 5% (50 g/L) menyediakan 170 kcal/L. Lebih hipotonik dari D5½NS — gunakan hanya bila ada indikasi klinis jelas.',
    references: ['aap_maintenance2018', 'holliday1957', 'gomella2020'],
  },
  {
    id: 'kaen_3a',
    name: 'KAEN 3A',
    aliases: ['KaEN 3A', 'Otsuka KAEN 3A', 'Maintenance Tanpa K'],
    category: 'kristaloid_hipotonik',
    composition: {
      na: 60, cl: 50, lactate: 10, glucose: 27,
      osmolarity: 230, tonicity: 'hipotonik', pH: 5.5, kcalPerL: 90,
    },
    indications: [
      'Cairan maintenance pediatri fase awal (tanpa kalium)',
      'Digunakan bila kadar K belum diketahui atau perlu dihindari (oliguria, hiperkalemia)',
      'Rawat inap anak dengan kebutuhan maintenance + kalori ringan',
    ],
    cautions: [
      'Tidak mengandung K — tambahkan KCl sesuai kebutuhan setelah diuresis adekuat dan K normal',
      'Hipotonik → risiko hiponatremia iatrogenik pada anak sakit (ADH meningkat)',
      'Jangan gunakan sebagai cairan resusitasi',
      'Monitor Na serum secara berkala selama infus',
    ],
    notes: 'Brand Otsuka Indonesia. Komponen per liter: Na 60 mEq, Cl 50 mEq, Laktat 10 mEq, Glukosa 27 g. Osmolarity 230 mOsm/L — lebih hipotonik dari plasma.',
    references: ['holliday1957', 'aap_maintenance2018'],
  },
  {
    id: 'kaen_3b',
    name: 'KAEN 3B',
    aliases: ['KaEN 3B', 'Otsuka KAEN 3B', 'Maintenance Dengan K'],
    category: 'kristaloid_hipotonik',
    composition: {
      na: 50, k: 20, cl: 50, lactate: 20, glucose: 27,
      osmolarity: 290, tonicity: 'hipotonik', pH: 5.5, kcalPerL: 90,
    },
    indications: [
      'Cairan maintenance pediatri dengan kebutuhan kalium (setelah diuresis adekuat)',
      'Rawat inap anak yang memerlukan maintenance + replacement kalium',
    ],
    cautions: [
      'Mengandung K 20 mEq/L → JANGAN berikan pada oliguria atau hiperkalemia',
      'Hipotonik → risiko hiponatremia iatrogenik pada anak sakit',
      'Jangan gunakan sebagai cairan resusitasi',
      'Pastikan output urin adekuat sebelum memulai',
    ],
    notes: 'Brand Otsuka Indonesia. Komponen per liter: Na 50 mEq, K 20 mEq, Cl 50 mEq, Laktat 20 mEq, Glukosa 27 g. Osmolarity 290 mOsm/L. Pilihan setelah fase awal bila K diperlukan.',
    references: ['holliday1957', 'aap_maintenance2018'],
  },
  {
    id: 'aminosteril_infant',
    name: 'Aminosteril Infant 6%',
    aliases: ['Aminosteril', 'Amino Infant', 'Asam Amino Infant', 'Fresenius Infant'],
    category: 'nutrisi',
    composition: {
      osmolarity: 500, tonicity: 'hipertonik',
    },
    indications: [
      'Sumber asam amino untuk nutrisi parenteral neonatus dan bayi (< 1 tahun)',
      'TPN (Total Parenteral Nutrition) pada prematur dan neonatus kritis yang tidak dapat enteral',
      'Suplementasi protein pada pasien PICU/NICU yang membutuhkan nutrisi parenteral',
    ],
    cautions: [
      'Osmolarity ~500 mOsm/L → sebaiknya via akses vena sentral (flebitis perifer)',
      'Tidak mengandung karbohidrat dan elektrolit — kombinasikan dengan dextrose dan elektrolit sesuai kebutuhan',
      'Hitung kebutuhan protein: neonatus 2.5–3.5 g/kg/hari, bayi 2–3 g/kg/hari',
      'Monitor fungsi ginjal dan hati selama pemberian',
      'Jangan campur langsung dengan Ca dan fosfat tanpa perhitungan kompatibilitas (risiko presipitasi)',
    ],
    notes: 'Larutan asam amino 6% khusus neonatus dan bayi (Fresenius Kabi). Mengandung profil asam amino esensial dan non-esensial yang disesuaikan untuk kebutuhan pediatri, termasuk taurin dan sistein. Osmolarity ±500 mOsm/L — gunakan via CVC bila memungkinkan.',
    references: ['gomella2020'],
  },

  // ── Kristaloid Hipertonik ───────────────────────────────────────────────
  {
    id: 'nacl_3pct',
    name: 'NaCl 3% (Saline Hipertonik)',
    aliases: ['NaCl 3%', 'Hypertonic Saline', '3% NaCl', 'Salin Hipertonik'],
    category: 'kristaloid_hipertonik',
    composition: {
      na: 513, cl: 513,
      osmolarity: 1026, tonicity: 'hipertonik', pH: 5.0,
    },
    indications: [
      'Hiponatremia simtomatik (kejang, kesadaran menurun) — bolus 2 mEq/kg',
      'Edema serebral / peningkatan TIK — 2–5 mL/kg IV',
      'SIADH dengan gejala berat',
    ],
    cautions: [
      'Koreksi Na terlalu cepat → Osmotic Demyelination Syndrome (ODS)',
      'Maksimum koreksi: 8–10 mEq/L per 24 jam (kronik); 1–2 mEq/L/jam (akut simtomatik)',
      'Pantau Na serum tiap 2–4 jam saat infus',
      'Harus via akses sentral untuk infus kontinu (flebitis perifer)',
      'Bolus singkat bisa via perifer',
    ],
    notes: '1 mL NaCl 3% mengandung 0.514 mEq Na. Rumus volume: ΔNa (mEq/L) × TBW (L) / 0.514. TBW anak = BB × 0.6.',
    references: ['pals2020', 'morgan2013'],
  },
  {
    id: 'nahco3_84',
    name: 'NaHCO₃ 8.4% (Bikarbonat)',
    aliases: ['Natrium Bikarbonat', 'Bicarb', 'NaHCO3', 'Soda Bikarbonat'],
    category: 'kristaloid_hipertonik',
    composition: {
      na: 1000, bicarb: 1000,
      osmolarity: 2000, tonicity: 'hipertonik', pH: 8.0,
    },
    indications: [
      'Asidosis metabolik berat (pH < 7.1, HCO₃⁻ < 10) — bila ventilasi adekuat',
      'Hiperkalemia refrakter (shift K⁺ intrasel)',
      'Overdosis TCA (sodium channel blockade)',
      'Neonatus: cardiac arrest dengan asidosis terdokumentasi',
    ],
    cautions: [
      'HARUS diencerkan 1:1 dengan D5W atau aquadest sebelum diberikan ke neonatus/bayi',
      'Tidak kompatibel dengan Ca (presipitat CaCO₃) — jangan campur dalam satu jalur IV',
      'Hiperosmolarity berat → perdarahan intraventrikuler pada prematur',
      'CO₂ meningkat sementara → perburuk asidosis respiratorik bila ventilasi buruk',
      'Hitung dosis: 1–2 mEq/kg IV pelan (> 30 menit)',
    ],
    notes: '1 mL NaHCO₃ 8.4% = 1 mEq. Osmolarity sangat tinggi (2000 mOsm/L) — selalu encerkan. Untuk neonatus, gunakan NaHCO₃ 4.2% atau encerkan 1:1.',
    references: ['pals2020', 'gomella2020', 'morgan2013'],
  },

  // ── Koloid ─────────────────────────────────────────────────────────────
  {
    id: 'albumin_5',
    name: 'Albumin 5%',
    aliases: ['Albumin', 'Human Albumin 5%'],
    category: 'koloid',
    composition: {
      na: 130, osmolarity: 290, tonicity: 'isotonik',
    },
    indications: [
      'Hipoalbuminemia simtomatik (albumin < 2.5 g/dL + edema)',
      'Sindrom nefrotik — terapi sementara sebelum steroid bekerja',
      'Syok septik refrakter cairan (adjunct)',
      'SBP (Spontaneous Bacterial Peritonitis) pada sirosis',
    ],
    cautions: [
      'Bukan cairan resusitasi lini pertama (lebih mahal, bukti lebih lemah dari kristaloid)',
      'Risiko overload cairan dan edema paru pada gagal jantung',
      'Pastikan tidak ada kontraindikasi (alergi protein hewani)',
    ],
    notes: 'Albumin 5% isotonik dan isosmotik. Waktu paruh intravaskular 16–24 jam. Pada sindrom nefrotik: kombinasikan dengan furosemid untuk cegah overload.',
    references: ['pals2020', 'morgan2013'],
  },
  {
    id: 'albumin_25',
    name: 'Albumin 25%',
    aliases: ['Albumin 25', 'Human Albumin 25%', 'Salt-poor albumin'],
    category: 'koloid',
    composition: {
      na: 130, osmolarity: 1500, tonicity: 'hipertonik',
    },
    indications: [
      'Hipoalbuminemia berat pada pasien yang dibatasi volume cairan',
      'Sindrom nefrotik — untuk menarik cairan dari interstitial ke intravaskular',
      'Dosis lebih kecil dari albumin 5% (efek onkotik lebih kuat)',
    ],
    cautions: [
      'Sangat hipertonik — menarik cairan interstisial; dapat menyebabkan overload bila ada cairan interstisial tidak cukup',
      'Monitor TD dan pernapasan selama pemberian',
      'Dosis albumin 25%: 1 g/kg (1 g/kg = 4 mL/kg)',
    ],
    notes: '1 g albumin = 4 mL albumin 25%. Untuk sindrom nefrotik pediatri: albumin 1 g/kg infus pelan + furosemid 1 mg/kg di pertengahan infus.',
    references: ['pals2020', 'morgan2013'],
  },

  // ── Produk Darah ────────────────────────────────────────────────────────
  {
    id: 'prc',
    name: 'PRC (Packed Red Cells)',
    aliases: ['PRC', 'Packed Red Blood Cells', 'PRBC', 'Darah Merah Pekat'],
    category: 'darah',
    composition: {
      osmolarity: 300, tonicity: 'isotonik',
    },
    indications: [
      'Anemia simtomatik (Hb < 7–8 g/dL pada stabil; < 10 pada kritis/jantung)',
      'Perdarahan akut dengan instabilitas hemodinamik',
      'Anemia hemolitik berat',
    ],
    cautions: [
      'Dosis: 10–15 mL/kg IV; naikan Hb ± 3 g/dL per 10 mL/kg',
      'Berikan pelan (2–4 jam) kecuali perdarahan aktif',
      'Premedikasi antipiretik + antihistamin bila riwayat reaksi transfusi',
      'Monitor tanda reaksi transfusi: demam, urtikaria, dispnea, hemolisis',
    ],
    notes: 'Target Hb: > 7 g/dL (stabil), > 8–10 g/dL (ICU/jantung). Formula kenaikan Hb: volume (mL) = (Hb target − Hb aktual) × BB × 3 (untuk PRC Ht ≈ 60%).',
    references: ['pals2020'],
  },
  {
    id: 'ffp',
    name: 'FFP (Fresh Frozen Plasma)',
    aliases: ['FFP', 'Fresh Frozen Plasma', 'Plasma Segar'],
    category: 'darah',
    composition: {
      osmolarity: 290, tonicity: 'isotonik',
    },
    indications: [
      'Koagulopati dengan perdarahan aktif (PT/APTT > 1.5× normal)',
      'Defisiensi faktor koagulasi (DIC, gagal hati)',
      'Reversal warfarin/antikoagulan darurat',
      'TTP (Thrombotic Thrombocytopenic Purpura) — plasma exchange',
    ],
    cautions: [
      'Dosis: 10–15 mL/kg; berikan dalam 4 jam setelah thaw',
      'Tidak efektif hanya untuk mengoreksi PT sedikit memanjang tanpa perdarahan',
      'Risiko TRALI (Transfusion-Related Acute Lung Injury)',
      'Volume load signifikan — hati-hati pada gagal jantung',
    ],
    notes: 'Mengandung semua faktor koagulasi. 1 unit FFP ≈ 250 mL. Tidak dapat dipakai sebagai sumber volume/albumin — ada risiko lebih besar dari albumin.',
    references: ['pals2020'],
  },
  {
    id: 'platelets',
    name: 'Trombosit (Platelet Concentrate)',
    aliases: ['TC', 'Platelet', 'Trombosit', 'Thrombocyte Concentrate'],
    category: 'darah',
    composition: {
      osmolarity: 290, tonicity: 'isotonik',
    },
    indications: [
      'Trombositopenia < 10.000/μL (profilaksis perdarahan)',
      'Trombositopenia < 50.000/μL + perdarahan aktif atau prosedur invasif',
      'Trombositopenia < 100.000/μL + operasi mayor atau neurosurgery',
    ],
    cautions: [
      'Dosis: 5–10 mL/kg (1 unit/10 kg) — naikan trombosit ± 30.000–50.000/μL',
      'Kontraindikasi pada TTP dan HIT (Heparin-Induced Thrombocytopenia)',
      'Berikan cepat (15–30 menit per unit)',
      'Tidak berguna pada trombositopenia destruktif (ITP) — trombosit langsung dihancurkan',
    ],
    notes: 'Cek trombosit 1 jam pasca-transfusi (post-transfusion count) untuk menilai respons. Increment < 5.000 → pertimbangkan refraktori trombosit.',
    references: ['pals2020'],
  },
  {
    id: 'cryoprecipitate',
    name: 'Kriopresipitat (Cryoprecipitate)',
    aliases: ['Cryo', 'Cryoprecipitate', 'Kriopresipitat'],
    category: 'darah',
    composition: {
      osmolarity: 290, tonicity: 'isotonik',
    },
    indications: [
      'Hipofibrinogenemia (fibrinogen < 100–150 mg/dL) + perdarahan',
      'Hemofilia A (faktor VIII) bila konsentrat tidak tersedia',
      'Von Willebrand disease tipe 1 (mengandung vWF)',
      'DIC dengan fibrinogen rendah',
    ],
    cautions: [
      'Dosis: 1 unit/5 kg (naikan fibrinogen ± 50–100 mg/dL)',
      'Volume kecil (± 15 mL/unit) — tidak menyebabkan volume overload',
      'Risiko infeksi lebih tinggi dari FFP (kurang diproses)',
    ],
    notes: 'Mengandung: fibrinogen, faktor VIII, faktor XIII, vWF, fibronektin. Simpan di suhu −18°C; setelah thaw harus diberikan dalam 4–6 jam.',
    references: ['pals2020'],
  },

  // ── Khusus ────────────────────────────────────────────────────────────
  {
    id: 'mgso4_50',
    name: 'MgSO₄ 50% (Magnesium Sulfat)',
    aliases: ['MgSO4', 'Magnesium Sulfat', 'Magnesium Sulphate'],
    category: 'khusus',
    composition: {
      osmolarity: 4060, tonicity: 'hipertonik', pH: 5.5,
    },
    indications: [
      'Hipomagnesemia (Mg < 1.7 mg/dL)',
      'Status asmatikus refrakter (IV bolus)',
      'Eklamsia / preeklamsia (obstetri)',
      'Torsades de Pointes',
      'Neuroproteksi neonatus prematur < 32 minggu (profilaksis)',
    ],
    cautions: [
      'SELALU encerkan sebelum diberikan IV: larutkan ke konsentrasi 20–50 mg/mL dalam D5W atau NaCl 0.9%',
      'Kecepatan infus: max 150 mg/menit (dewasa); pada anak 25–50 mg/kg dalam 15–30 menit',
      'Monitor: refleks patela (hilang = toksisitas awal), frekuensi napas, output urin',
      'Antidotum toksisitas: Ca glukonat 10% 10 mL IV pelan — siapkan di samping tempat tidur',
      'Kadar serum: terapeutik 4–7 mEq/L; toksik > 9 mEq/L',
    ],
    notes: '1 g MgSO₄ = 4 mEq Mg. MgSO₄ 50% = 500 mg/mL = 2 mEq/mL. Untuk hipomagnesemia anak: 25–50 mg/kg (maks 2 g) IV dalam 15–30 menit, encerkan dulu.',
    references: ['pals2020', 'morgan2013'],
  },
  {
    id: 'kcl_7pct',
    name: 'KCl 7.46% (Kalium Klorida)',
    aliases: ['KCl', 'Kalium Klorida', 'Potassium Chloride'],
    category: 'khusus',
    composition: {
      k: 1000, cl: 1000,
      osmolarity: 2000, tonicity: 'hipertonik',
    },
    indications: [
      'Koreksi hipokalemia (K < 3.5 mEq/L)',
      'Penambahan K ke cairan maintenance',
    ],
    cautions: [
      'TIDAK BOLEH diberikan langsung (undiluted) IV — fatal (cardiac arrest)',
      'Selalu encerkan: max 40 mEq/L via perifer; max 80 mEq/L via sentral',
      'Kecepatan max: 0.3 mEq/kg/jam (perifer); 0.5 mEq/kg/jam (sentral + monitor EKG)',
      'Monitor EKG kontinyu bila kecepatan > 0.3 mEq/kg/jam',
      'Cek Mg: hipokalemia refrakter sering karena hipomagnesemia bersamaan',
    ],
    notes: '1 mL KCl 7.46% = 1 mEq K. Konsentrasi standar di infus: 20–40 mEq/L. Untuk koreksi IV anak: 0.2–0.5 mEq/kg/dosis, encerkan, infus pelan 2–4 jam.',
    references: ['morgan2013', 'gomella2020'],
  },
  {
    id: 'nacl_3pct_bolus',
    name: 'NaCl 3% — Protokol Bolus Hiponatremia',
    aliases: ['3% Saline Bolus', 'Saline Hipertonik Bolus'],
    category: 'kristaloid_hipertonik',
    composition: {
      na: 513, cl: 513,
      osmolarity: 1026, tonicity: 'hipertonik',
    },
    indications: [
      'Hiponatremia simtomatik akut (kejang, stupor, koma)',
    ],
    cautions: [
      'Protokol ESPE 2018: 2 mL/kg NaCl 3% IV dalam 10–15 menit, dapat diulang s/d 3× (target Na naik 5 mEq/L untuk hentikan kejang)',
      'Setelah gejala teratasi: hentikan bolus, beralih ke koreksi lambat',
      'Target koreksi total: max 10 mEq/L per 24 jam (kronik); max 1–2 mEq/L/jam (akut)',
      'Monitor Na tiap 2 jam',
    ],
    notes: 'Duplikat dari NaCl 3% dengan catatan protokol khusus bolus hiponatremia simtomatik. Referensi: ESPE Clinical Practice Guidelines 2018.',
    references: ['pals2020', 'morgan2013'],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

export const FLUID_CATEGORY_LABEL: Record<FluidCategory, string> = {
  kristaloid_isotonik:   'Kristaloid Isotonik',
  kristaloid_hipotonik:  'Kristaloid Hipotonik',
  kristaloid_hipertonik: 'Kristaloid Hipertonik',
  koloid:                'Koloid',
  darah:                 'Produk Darah',
  nutrisi:               'Nutrisi Parenteral',
  khusus:                'Larutan Khusus',
};

export const FLUID_CATEGORY_ORDER: FluidCategory[] = [
  'kristaloid_isotonik',
  'kristaloid_hipotonik',
  'kristaloid_hipertonik',
  'koloid',
  'darah',
  'khusus',
  'nutrisi',
];

export function searchFluids(query: string): FluidEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return FLUID_LIBRARY;
  return FLUID_LIBRARY.filter((f) =>
    f.name.toLowerCase().includes(q) ||
    f.aliases.some((a) => a.toLowerCase().includes(q)) ||
    f.indications.some((i) => i.toLowerCase().includes(q))
  );
}

export function filterFluidsByCategory(category: FluidCategory | 'semua'): FluidEntry[] {
  if (category === 'semua') return FLUID_LIBRARY;
  return FLUID_LIBRARY.filter((f) => f.category === category);
}
