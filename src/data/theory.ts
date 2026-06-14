// ─────────────────────────────────────────────────────────────────────────
// Konten Teori & Klinis — ringkasan pendekatan di ICU/PICU/NICU.
// Setiap entry berbasis bukti (Zero Hallucination — CLAUDE.md).
// Sitasi merujuk ke ID di src/data/references.ts.
// ─────────────────────────────────────────────────────────────────────────

export type TheoryCategory =
  | 'ventilasi'
  | 'sepsis'
  | 'syok'
  | 'neonatus'
  | 'cairan'
  | 'neurologi'
  | 'renal'
  | 'respirasi'
  | 'infeksi'
  | 'metabolik'
  | 'farmakologi';

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

  // ══════════════════════════════════════════════════════════════════════
  // SEPSIS
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'sepsis_definition',
    title: 'Definisi & Kriteria Sepsis Pediatri',
    subtitle: 'Surviving Sepsis Campaign 2020',
    category: 'sepsis',
    points: [
      { text: 'Sepsis pediatri: disfungsi organ mengancam jiwa akibat infeksi (bukan sekadar SIRS + infeksi).' },
      { text: 'Syok septik: sepsis + disfungsi kardiovaskular yang membutuhkan vasopresor untuk mencapai MAP sesuai usia, meskipun telah mendapat resusitasi cairan adekuat.' },
      { text: 'Tanda disfungsi organ: perubahan status mental, takikardia/bradikardia, CRT memanjang (> 2 dtk), extremitas dingin/mottling, oliguria, hipoksia, peningkatan laktat.' },
      { text: 'Risiko tinggi: neonatus, imunokompromais, asplenia, kanker, malnutrisi berat.' },
      { text: 'Gunakan pSOFA atau PELOD-2 untuk kuantifikasi disfungsi organ (scoring tersedia di halaman Skoring).' },
    ],
    references: ['ssc2020', 'matics2017'],
  },
  {
    id: 'sepsis_bundle',
    title: 'Sepsis Bundle — 1 Jam Pertama',
    subtitle: 'SSC Pediatric Bundle 2020',
    category: 'sepsis',
    points: [
      { text: '0–15 menit: kenali, aktivasi tim, akses IV/IO, ambil kultur darah (2 set) + laktat + darah lengkap + fungsi ginjal/hati.' },
      { text: 'Antibiotik broad-spectrum dalam 1 jam sejak triage (jangan tunda untuk menunggu hasil kultur).' },
      { text: 'Resusitasi cairan: 10–20 mL/kg bolus NaCl 0,9% atau Ringer Laktat, titrasi per respons klinis. Ulangi hingga 40–60 mL/kg bila tidak ada tanda overload.' },
      { text: 'Hentikan bolus bila muncul tanda overload: ronki, gallop, hepatomegali, SpO₂ turun.' },
      { text: 'Bila syok menetap setelah 40 mL/kg cairan: mulai vasopresor (Norepinefrin atau Epinefrin) dalam 1 jam.' },
      { text: 'Target resusitasi: CRT ≤ 2 detik, MAP sesuai usia, laktat menurun, urin ≥ 1 mL/kg/jam, status mental membaik.' },
      { text: 'Re-evaluasi tiap 15–30 menit. Eskalasi terapi bila target tidak tercapai.' },
    ],
    references: ['ssc2020', 'pals2020'],
  },
  {
    id: 'sepsis_antibiotics',
    title: 'Antibiotik Empiris Sepsis Pediatri',
    subtitle: 'Pilihan berdasarkan sumber infeksi & usia',
    category: 'sepsis',
    points: [
      { text: 'Neonatus < 7 hari (community-onset): Ampisilin + Gentamisin (cakup GBS, Listeria, E. coli).' },
      { text: 'Neonatus 7–28 hari: Ampisilin + Sefotaksim (atau Seftriakson bila > 28 hari dan tidak ada hiperbilirubinemia).' },
      { text: 'Anak > 1 bulan (unknown source): Sefotaksim atau Seftriakson — cakup kuman Gram-positif dan Gram-negatif tersering.' },
      { text: 'Suspek meningitis: Seftriakson 100 mg/kg/hari (maks 4 g/hari) ± Deksametason 0,15 mg/kg/dosis tiap 6 jam × 4 hari.' },
      { text: 'Suspek MRSA (kolonisasi, infeksi kulit, post-influenza): tambah Vankomisin (target AUC/MIC 400–600).' },
      { text: 'Infeksi nosokomial/ICU / riwayat rawat inap: Meropenem atau Piperasilin-Tazobaktam.' },
      { text: 'Infeksi abdomen (peritonitis, perforasi): Meropenem atau Ampisilin-Sulbaktam + Metronidazol.' },
      { text: 'De-eskalasi dalam 48–72 jam berdasarkan hasil kultur & sensitivitas. Batasi durasi sesuai sumber infeksi.' },
    ],
    references: ['ssc2020', 'pals2020'],
  },
  {
    id: 'sepsis_source_control',
    title: 'Source Control & Monitoring Sepsis',
    subtitle: 'Kontrol sumber infeksi & target terapi',
    category: 'sepsis',
    points: [
      { text: 'Identifikasi dan kendalikan sumber infeksi sesegera mungkin: drainase abses, eksisi jaringan nekrotik, lepas kateter/CVC yang terinfeksi.' },
      { text: 'Kultur ulang bila demam persisten > 72 jam terapi antibiotik adekuat.' },
      { text: 'Procalcitonin (PCT) dapat membantu panduan durasi antibiotik: de-eskalasi bila PCT turun > 80% dari nilai puncak.' },
      { text: 'Laktat serial: target laktat < 2 mmol/L dalam 6 jam. Laktat ≥ 4 mmol/L = mortalitas tinggi.' },
      { text: 'Anemia: transfusi PRC bila Hb < 7 g/dL (target 7–9 g/dL) pada sepsis stabil; < 10 g/dL bila ada iskemia miokard.' },
      { text: 'Glukosa: target 140–180 mg/dL. Hindari hipoglikemia (< 70) dan hiperglikemia berat (> 180).' },
      { text: 'Kortikosteroid (hidrokortison): pertimbangkan bila syok refrakter vasopresor — 1–2 mg/kg/hari terbagi tiap 6–8 jam.' },
    ],
    references: ['ssc2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // SYOK
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'shock_classification',
    title: 'Klasifikasi & Pendekatan Syok',
    subtitle: 'Distributif · Hipovolemik · Obstruktif · Kardiogenik',
    category: 'syok',
    points: [
      { text: 'Syok = ketidaksesuaian antara suplai dan kebutuhan oksigen jaringan → disfungsi organ.' },
      { text: 'Distributif (septik, anafilaksis, neurogenik): vasodilatasi masif → afterload ↓, CO mungkin ↑ tapi perfusi tidak adekuat. Ciri: kulit hangat, CRT cepat (warm shock), atau dingin/mottled (cold shock).' },
      { text: 'Hipovolemik (perdarahan, dehidrasi, luka bakar): preload ↓. Ciri: takikardia, akral dingin, turgor buruk, nadi lemah.' },
      { text: 'Kardiogenik (disfungsi miokard, aritmia, tamponade): CO rendah. Ciri: JVP ↑, gallop, ronki, hepatomegali, edema.' },
      { text: 'Obstruktif (tension PTX, tamponade perikard, emboli paru masif): outflow tersumbat. Ciri: JVP ↑, suara napas asimetri (PTX), bunyi jantung lemah (tamponade).' },
      { text: 'Pendekatan awal SEMUA syok: O₂ aliran tinggi, akses IV/IO, monitor HR/SaO₂/TD/EKG.' },
      { text: 'End-point resusitasi universal: CRT ≤ 2 detik, HR sesuai usia, MAP ≥ persentil 5 usia, urin ≥ 1 mL/kg/jam, laktat membaik.' },
    ],
    references: ['pals2020'],
  },
  {
    id: 'shock_fluid',
    title: 'Resusitasi Cairan pada Syok',
    subtitle: 'Strategi, jenis cairan, dan monitoring',
    category: 'syok',
    points: [
      { text: 'Cairan pilihan: kristaloid isotonik (NaCl 0,9% atau Ringer Laktat). Koloid (albumin 5%) dapat dipertimbangkan pada syok septik refrakter.' },
      { text: 'Hipovolemik/distributif: bolus 10–20 mL/kg dalam 5–10 menit, ulangi tiap 15–30 menit bila respons inadequate.' },
      { text: 'Kardiogenik: bolus lebih kecil 5–10 mL/kg, dengan monitoring ketat tanda overload (gallop, ronki, SpO₂ ↓).' },
      { text: 'Fase resusitasi (0–6 jam): agresif sampai end-point tercapai.' },
      { text: 'Fase optimisasi (6–24 jam): cairan minimal, pertahankan keseimbangan.' },
      { text: 'Fase de-resusitasi (> 24–48 jam): negatif balance aktif — mobilisasi cairan dengan diuretik bila stabil.' },
      { text: 'Fluid overload ≥ 10% BB terkait peningkatan mortalitas PICU — pantau fluid balance ketat setiap shift.' },
    ],
    references: ['ssc2020', 'pals2020'],
  },
  {
    id: 'shock_vasopressors',
    title: 'Vasopresor & Inotropik',
    subtitle: 'Pemilihan agen berdasarkan profil hemodinamik',
    category: 'syok',
    points: [
      { text: 'Norepinefrin: lini PERTAMA syok distributif (septik, anafilaksis). Vasokonstriksi kuat (α₁) + inotropik ringan (β₁). Dosis: 0,05–2 mcg/kg/mnt.' },
      { text: 'Epinefrin: syok refrakter atau anafilaksis. Aktivasi α₁+β₁+β₂. Dosis: 0,05–1 mcg/kg/mnt. Pada anafilaksis: IM 0,01 mg/kg (maks 0,5 mg) paha lateral.' },
      { text: 'Dopamin: 2–5 mcg/kg/mnt (dopaminergik, proteksi renal—masih kontroversial); 5–10 (β₁, inotropik); > 10 (α₁, vasokonstriksi). Saat ini bukan lini 1 syok septik.' },
      { text: 'Dobutamin: syok kardiogenik — inotropik kuat (β₁) tanpa vasokonstriksi berat. Dosis: 2–20 mcg/kg/mnt. Dapat turunkan afterload (β₂).' },
      { text: 'Milrinon: inhibitor PDE-III → inotropik + vasodilator pulmoner. Cocok untuk disfungsi diastolik + PHTN pasca-operasi jantung. Dosis: 0,25–0,75 mcg/kg/mnt.' },
      { text: 'Vasopressin: syok vasodilatasi refrakter NE dosis tinggi. Dosis: 0,0003–0,002 unit/kg/mnt.' },
      { text: 'Kombinasi: NE + Dobutamin untuk syok septik dengan disfungsi miokard (cold & warm shock bersamaan).' },
    ],
    references: ['pals2020', 'ssc2020'],
  },
  {
    id: 'shock_anaphylaxis',
    title: 'Syok Anafilaksis',
    subtitle: 'Tatalaksana emergensi & trigger identifikasi',
    category: 'syok',
    points: [
      { text: 'Anafilaksis: reaksi hipersensitivitas sistemik berat, onset menit–2 jam pasca paparan alergen.' },
      { text: 'Kriteria: (1) kulit/mukosa + gangguan napas atau tekanan darah ↓; atau (2) ≥ 2 organ terlibat setelah paparan alergen; atau (3) TD ↓ terisolasi pasca paparan alergen.' },
      { text: 'EPINEFRIN IM SEGERA: 0,01 mg/kg (maks 0,5 mg) larutan 1:1000 di paha anterolateral. Ulangi tiap 5–15 mnt bila perlu. Jangan tunda untuk antihistamin.' },
      { text: 'Posisikan: berbaring, kaki ditinggikan (kecuali distres napas → semi-duduk). Jangan berdiri tiba-tiba.' },
      { text: 'O₂ aliran tinggi, akses IV, resusitasi cairan agresif bila hipotensi.' },
      { text: 'Bila refrakter: epinefrin infus kontinu 0,05–1 mcg/kg/mnt + NaCl IV.' },
      { text: 'Adjuvan (bukan pengganti epinefrin): difenhidramin IM/IV, ranitidin/famotidin, kortikosteroid (onset lambat 4–6 jam, untuk mencegah fase lanjut).' },
      { text: 'Observasi minimal 4–6 jam pasca episode. Risiko biphasic reaction: 1–20% kasus, terjadi 1–72 jam kemudian.' },
    ],
    references: ['pals2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // VENTILASI
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'vent_pards',
    title: 'PARDS — Pediatric ARDS',
    subtitle: 'Definisi PALICC-2 2023 & manajemen',
    category: 'ventilasi',
    points: [
      { text: 'Definisi PALICC-2 (2023): awitan dalam 7 hari dari pemicu, SpO₂/FiO₂ (SF ratio) ≤ 264 atau PaO₂/FiO₂ (PF ratio) ≤ 200 pada PEEP ≥ 5 cmH₂O, infiltrat bilateral pada imaging.' },
      { text: 'Derajat: Mild SF 200–264 (PF 200–300); Moderate SF 100–200 (PF 100–200); Severe SF < 100 (PF < 100).' },
      { text: 'Ventilasi protektif: Tidal volume 5–8 mL/kg IBW (turunkan ke 3–6 mL/kg bila Pplat > 28 cmH₂O).' },
      { text: 'Driving pressure: jaga < 15 cmH₂O. Driving pressure = Pplat − PEEP.' },
      { text: 'PEEP: titrasi untuk oksigenasi optimal. High PEEP trial pada PARDS sedang-berat bila respons adekuat.' },
      { text: 'Target SpO₂: 92–97% (hindari SpO₂ > 97% karena toksisitas oksigen).' },
      { text: 'Prone positioning: pertimbangkan pada PARDS berat (SF < 100) selama ≥ 16 jam/hari.' },
      { text: 'Neuromuscular blockade: pertimbangkan 24–48 jam pertama pada PARDS berat bila pasien tidak sinkron.' },
      { text: 'High-frequency oscillation (HFO): tidak rutin direkomendasikan sebagai terapi awal.' },
    ],
    references: ['palicc2023'],
  },
  {
    id: 'vent_lungprotective',
    title: 'Ventilasi Protektif Paru',
    subtitle: 'Prinsip umum ventilasi mekanik pediatri',
    category: 'ventilasi',
    points: [
      { text: 'Mode awal: Pressure Control (PC) atau Volume Control (VC) sesuai kondisi pasien dan preferensi klinisi.' },
      { text: 'Tidal volume target: 5–7 mL/kg IBW untuk paru normal; 4–6 mL/kg IBW pada ARDS/PARDS.' },
      { text: 'Plateau pressure (Pplat): jaga ≤ 28 cmH₂O (PARDS) atau ≤ 30 cmH₂O (non-ARDS).' },
      { text: 'RR sesuai usia: neonatus 40–60; bayi 30–40; anak kecil 24–30; anak besar 18–24/mnt.' },
      { text: 'FiO₂: turunkan bertahap ke nilai terendah yang mempertahankan SpO₂ target. Hindari FiO₂ > 0,6 berkepanjangan.' },
      { text: 'PEEP 5 cmH₂O sebagai standar minimum; naikkan bila FiO₂ tidak bisa diturunkan.' },
      { text: 'Permissive hypercapnia: PaCO₂ hingga 55–60 mmHg dapat diterima bila pH > 7,20 untuk menjaga TV rendah.' },
      { text: 'I:E ratio: biasanya 1:2; perpanjang ekspirasi (1:3–1:4) pada obstruksi jalan napas (asma, bronkiolitis).' },
    ],
    references: ['pals2020', 'palicc2023'],
  },
  {
    id: 'vent_weaning',
    title: 'Weaning & Ekstubasi',
    subtitle: 'Kriteria siap weaning dan SBT',
    category: 'ventilasi',
    points: [
      { text: 'Prasyarat weaning: penyebab utama membaik, FiO₂ ≤ 0,40, PEEP ≤ 5–8 cmH₂O, SpO₂ ≥ 95%, hemodinamik stabil tanpa/minimal vasopresor.' },
      { text: 'Kesadaran: pasien dapat mengikuti perintah sederhana (bila usia memungkinkan), SAT (Spontaneous Awakening Trial) harian dilakukan sebelum SBT.' },
      { text: 'SBT (Spontaneous Breathing Trial): CPAP 5 cmH₂O atau PS 5–8 cmH₂O selama 30–120 menit.' },
      { text: 'Gagal SBT: RR > batas atas usia, SpO₂ < 90%, retraksi berat, agitasi, diaforesis, HR atau TD berubah > 20%.' },
      { text: 'Penilaian kemampuan ekstubasi: refleks batuk kuat, sekret minimal, tidak ada stridor saat cuff dikempiskan.' },
      { text: 'Pasca-ekstubasi: high-flow nasal cannula (HFNC) atau CPAP mengurangi risiko reintubasi — terutama anak dengan penyakit kardiopulmoner.' },
      { text: 'Bila gagal ekstubasi (dalam 48 jam): evaluasi penyebab (obstruksi subglotis, sekresi, kelemahan otot), pertimbangkan deksametason pre-ekstubasi berikutnya.' },
    ],
    references: ['pals2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // RESPIRASI
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'resp_bronchiolitis',
    title: 'Bronkiolitis Berat',
    subtitle: 'Tatalaksana berbasis bukti — AAP 2014',
    category: 'respirasi',
    points: [
      { text: 'Definisi: infeksi saluran napas bawah viral (RSV tersering) pada anak < 2 tahun, ditandai rinore, batuk, wheeze/crackle, distres napas.' },
      { text: 'Derajat berat: SpO₂ < 90%, RR > 70/mnt, retraksi hebat, sianosis, apnea.' },
      { text: 'Terapi utama: suportif — oksigen bila SpO₂ < 90–92%, hidrasi (oral atau NGT atau IV bila tidak bisa minum).' },
      { text: 'HFNC (High-Flow Nasal Cannula): lini pertama untuk kasus berat sebelum CPAP/intubasi. Flow 1–2 L/kg/mnt, FiO₂ titrasi.' },
      { text: 'CPAP nasal: pertimbangkan bila HFNC gagal atau ada apnea berulang.' },
      { text: 'TIDAK direkomendasikan (tanpa bukti manfaat): nebulisasi salbutamol rutin, kortikosteroid sistemik rutin, antibiotik (kecuali ada ko-infeksi bakteri), ribavirin, fisioterapi dada.' },
      { text: 'Nebulisasi NaCl 3% (hipertonik): mungkin mengurangi lama rawat di bangsal biasa, tapi tidak dianjurkan rutin di ICU.' },
      { text: 'Indikasi intubasi: apnea berulang, kelelahan napas, hipoksia refrakter, hipercapnia berat (PaCO₂ > 55 + pH < 7,2).' },
    ],
    references: ['aap_bronchiolitis2014', 'pals2020'],
  },
  {
    id: 'resp_asthma',
    title: 'Status Asmatikus',
    subtitle: 'Tatalaksana esklaasi IGD hingga ICU',
    category: 'respirasi',
    points: [
      { text: 'Status asmatikus: serangan asma berat yang tidak respons terhadap bronkodilator inhalasi awal.' },
      { text: 'Penilaian keparahan: RR, retraksi, SpO₂, kemampuan bicara, sianosis, perubahan kesadaran, silent chest = tanda pra-henti.' },
      { text: 'Lini 1: Salbutamol MDI (8–10 semprot) atau nebulisasi (0,15 mg/kg, maks 5 mg) tiap 20 mnt × 3 dalam 1 jam pertama.' },
      { text: 'Ipratropium bromida: tambahkan pada serangan berat — 0,25–0,5 mg tiap 20 mnt × 3 (hanya 1 jam pertama).' },
      { text: 'Kortikosteroid sistemik: Prednisolon PO 1–2 mg/kg/hari (maks 40 mg) atau Deksametason IM/IV 0,6 mg/kg. Mulai dalam 1 jam, efek tampak 4–6 jam.' },
      { text: 'O₂: pertahankan SpO₂ ≥ 94%.' },
      { text: 'Magnesium Sulfat IV: 25–75 mg/kg (maks 2,5 g) dalam 20–30 mnt — untuk serangan berat/refrakter. Efek bronkodilatasi langsung.' },
      { text: 'Aminofilin IV: bolus 5 mg/kg dalam 30 mnt → infus 0,5–1 mg/kg/jam. Pantau kadar (target 10–20 mcg/mL). Alternatif bila MgSO₄ tidak tersedia.' },
      { text: 'Salbutamol infus IV: 0,1–2 mcg/kg/mnt — untuk serangan mengancam jiwa yang tidak respons nebulisasi.' },
      { text: 'Intubasi: hindari bila memungkinkan (risiko air trapping). Bila perlu: ketamin sebagai induksi (bronkodilatasi), I:E ratio 1:3–1:4, RR rendah.' },
    ],
    references: ['gina2024', 'idai_asma2016', 'pals2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // NEONATUS
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'neonate_resus',
    title: 'Resusitasi Neonatus (NRP)',
    subtitle: 'Algoritma NRP 8th Edition — AHA/AAP',
    category: 'neonatus',
    points: [
      { text: 'Langkah awal 30 detik pertama: hangatkan, posisikan, bersihkan jalan napas bila perlu, keringkan & stimulasi.' },
      { text: 'Evaluasi simultan: usaha napas (ada/tidak, adekuat/tidak), laju jantung (HR > 100?), tonus otot.' },
      { text: 'Apnea/gasping ATAU HR < 100: mulai VTP (Ventilasi Tekanan Positif) dengan FiO₂ 21% (aterm) atau 21–30% (prematur < 35 minggu).' },
      { text: 'VTP adekuat: dada mengembang, HR naik. Bila tidak adekuat: cek MR. SOPA (Mask, Reposition, Suction, Open mouth, Pressure increase, Airway alternative).' },
      { text: 'HR < 60 setelah 30 detik VTP adekuat: kompresi dada 3:1 dengan VTP. Naikkan FiO₂ ke 100%.' },
      { text: 'HR tetap < 60: Epinefrin IV/IO 0,01–0,03 mg/kg (1:10.000) atau via ET 0,05–0,1 mg/kg (sementara akses IV disiapkan). Ulangi tiap 3–5 mnt.' },
      { text: 'Target SpO₂ praductal: menit 1 = 60–65%; menit 2 = 65–70%; menit 3 = 70–75%; menit 4 = 75–80%; menit 5 = 80–85%; menit 10 = 85–95%.' },
      { text: 'Pertimbangkan volume expander (NaCl 0,9% 10 mL/kg IV) bila ada syok hemoragik atau tidak respons setelah epinefrin.' },
    ],
    references: ['nrp8', 'pals2020'],
  },
  {
    id: 'neonate_rds',
    title: 'RDS — Respiratory Distress Syndrome Neonatus',
    subtitle: 'Defisiensi surfaktan pada prematur',
    category: 'neonatus',
    points: [
      { text: 'Terutama pada prematur < 34 minggu gestasi. Makin kecil usia gestasi, makin berat.' },
      { text: 'Klinis: takipnea, retraksi interkostal/subkostal, grunting, sianosis, muncul dalam 4 jam pertama kehidupan.' },
      { text: 'Radiologi: ground glass diffuse, air bronchogram, volume paru kecil.' },
      { text: 'Pencegahan: kortikosteroid antenatal (betametason IM 2 × 12 mg, 24 jam terpisah) pada ibu risiko preterm 24–34 minggu.' },
      { text: 'Terapi awal: CPAP nasal 5–8 cmH₂O dengan FiO₂ sesuai kebutuhan. Target SpO₂ 90–95%.' },
      { text: 'Surfaktan eksogen: dosis 100–200 mg/kg intratrakeal. Pertimbangkan bila FiO₂ > 0,30 di CPAP atau pasca intubasi segera.' },
      { text: 'Strategi INSURE (Intubate-Surfactant-Extubate): beri surfaktan saat intubasi, segera ekstubasi ke CPAP untuk kurangi trauma ventilasi.' },
      { text: 'Strategi LISA/MIST (Less Invasive Surfactant Administration): surfaktan via kateter tipis saat bayi bernapas spontan di CPAP — efek morbiditas lebih rendah.' },
      { text: 'Hindari: FiO₂ berlebihan (risiko ROP dan lung injury), ventilasi dengan TV tinggi.' },
    ],
    references: ['nrp8'],
  },
  {
    id: 'neonate_hypothermia',
    title: 'HIE & Hipotermia Terapeutik',
    subtitle: 'Hypoxic-Ischemic Encephalopathy — neonatus aterm ≥ 36 minggu',
    category: 'neonatus',
    points: [
      { text: 'Indikasi hipotermia: ≥ 36 minggu gestasi, usia < 6 jam, DAN salah satu: pH ≤ 7,0 / BD ≥ 16; atau event sentinel (cord prolaps, perdarahan, bradikardi persisten) + Apgar ≤ 5 menit ke-10 / butuh VTP > 10 mnt.' },
      { text: 'Target suhu: 33–34°C selama 72 jam penuh menggunakan blanket/cap pendingin.' },
      { text: 'Rewarming: 0,2–0,5°C per jam setelah 72 jam hipotermia. Jangan terburu-buru.' },
      { text: 'Monitoring wajib: aEEG/EEG kontinu, glukosa (target 70–120 mg/dL), elektrolit, fungsi ginjal, koagulasi, hematokrit.' },
      { text: 'Kontraindikasi relatif: koagulopati berat tidak terkontrol, sepsis berat yang belum terkontrol.' },
      { text: 'Kejang (tersering pada HIE): fenobarbital lini 1 loading 20 mg/kg IV dalam 20 mnt; bila menetap tambah 10 mg/kg × 1–2; lini 2: levetirasetam 40–60 mg/kg IV atau fenitoin.' },
      { text: 'MRI otak: lakukan pada hari ke-3 sampai ke-5 (saat hipotermia atau pasca-rewarming) untuk penilaian prognosis.' },
      { text: 'Prognosis: terkait pola MRI dan respons EEG. Diskusikan dengan keluarga secara berkala.' },
    ],
    references: ['nrp8', 'pals2020'],
  },
  {
    id: 'neonate_nec',
    title: 'Necrotizing Enterocolitis (NEC)',
    subtitle: 'Emergensi GI pada neonatus — staging Bell',
    category: 'neonatus',
    points: [
      { text: 'NEC: nekrosis iskemik usus pada neonatus prematur; etiologi multifaktorial (imaturitas, hipoperfusi, kolonisasi bakteri patologis).' },
      { text: 'Trias klasik: kembung abdomen, darah dalam feses, intoleransi makan.' },
      { text: 'Staging Bell: I (suspek — kembung, intoleransi), II (definitif — pneumatosis intestinalis atau gas portal), III (berat — perforasi, peritonitis, syok).' },
      { text: 'Manajemen Bell I–II: puasakan 10–14 hari, dekompresi NGT, antibiotik IV (ampisilin + gentamisin + metronidazol), nutrisi parenteral total.' },
      { text: 'Bell III: konsul bedah SEGERA. Indikasi operasi: pneumoperitoneum, deteriorasi klinis meski terapi medis maksimal, massa abdomen fixed.' },
      { text: 'Tanda perburukan: asidosis metabolik, trombositopenia, koagulopati, hiponatremia — pertanda outcome buruk.' },
      { text: 'Pencegahan: ASI eksklusif, probiotik (bukti terbatas), hindari formula hiperosmolar, transfusi hati-hati (kaitkan dengan transfusion-associated NEC).' },
    ],
    references: ['nrp8'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // CAIRAN & ELEKTROLIT
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'fluid_maintenance',
    title: 'Cairan Maintenance Pediatri',
    subtitle: 'Rumus 4-2-1 & pemilihan cairan isotonik',
    category: 'cairan',
    points: [
      { text: 'Rumus Holliday-Segar (4-2-1) untuk kecepatan maintenance: 4 mL/kg/jam (10 kg pertama) + 2 mL/kg/jam (10 kg berikutnya) + 1 mL/kg/jam (selebihnya).' },
      { text: 'Cairan maintenance PILIHAN: NaCl 0,9% + D5% atau Ringer Laktat + D5%. Hindari cairan hipotonik (NaCl 0,225% / NaCl 0,45%) sebagai maintenance rutin → risiko hiponatremia iatrogenik.' },
      { text: 'AAP 2018 merekomendasikan larutan isotonik (NaCl ≥ 0,9%) sebagai cairan maintenance standar pada anak ≥ 28 hari–18 tahun yang dirawat.' },
      { text: 'Tambahkan KCl 10–20 mEq/L ke cairan maintenance bila fungsi ginjal adekuat (urin sudah keluar).' },
      { text: 'Kondisi yang membutuhkan pembatasan: SIADH, trauma kepala, meningitis, pasca-operasi jantung, pneumonia berat — restriksi 50–75% maintenance.' },
      { text: 'Kondisi yang membutuhkan penambahan: diare, muntah, ostomi, demam tinggi — sesuaikan dengan ongoing loss.' },
      { text: 'Re-evaluasi kebutuhan cairan setiap 4–8 jam; hindari pemberian maintenance berlebihan (fluid overload ↑ morbiditas).' },
    ],
    references: ['holliday1957', 'feld2018'],
  },
  {
    id: 'fluid_electrolyte',
    title: 'Gangguan Elektrolit Kritis',
    subtitle: 'Natrium · Kalium · Kalsium · Magnesium',
    category: 'cairan',
    points: [
      { text: 'Hiponatremia simtomatik (Na < 125 + kejang/koma): koreksi NaCl 3% 2–3 mL/kg dalam 15–30 mnt, ulangi sampai gejala hilang. Target kenaikan Na 4–6 mEq/L.' },
      { text: 'Hiponatremia kronis: koreksi lambat maksimum 8–10 mEq/L per 24 jam — mencegah osmotic demyelination syndrome (ODS).' },
      { text: 'Hipernatremia: koreksi cairan bertahap, Na tidak boleh turun > 10–12 mEq/L per 24 jam (risiko edema serebral).' },
      { text: 'Hiperkalemia EKG-signifikan (K > 6,5 + peak T, PR melebar, QRS lebar): Ca glukonat 10% 0,5–1 mL/kg IV pelan → Insulin-Dextrose → kayexalate/patiromer → dialisis bila refrakter.' },
      { text: 'Hipokalemia berat (K < 2,5): koreksi IV 0,3–0,5 mEq/kg dalam 1–2 jam via jalur sentral (monitor EKG kontinu).' },
      { text: 'Hipokalsemia (iCa < 1,1 mmol/L, atau gejala tetani/kejang): Ca glukonat 10% 0,5–1 mL/kg IV pelan dalam 5–10 mnt.' },
      { text: 'Hipomagnesemia (Mg < 0,7 mmol/L): MgSO₄ 25–50 mg/kg IV dalam 10–20 mnt (maks 2 g). Sering menyertai hipokalemia refrakter.' },
      { text: 'Hiperfosfatemia: batasi intake fosfat, binder fosfat oral, pertimbangkan dialisis bila berat.' },
    ],
    references: ['greenbaum2020', 'feld2018', 'pals2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // NEUROLOGI
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'neuro_status_epilepticus',
    title: 'Status Epileptikus',
    subtitle: 'Algoritma tatalaksana lini 1–3 (AES 2016 + ESETT)',
    category: 'neurologi',
    points: [
      { text: 'Definisi: kejang > 5 menit atau ≥ 2 kejang tanpa pulih kesadaran di antara episode.' },
      { text: 'Lini 1 (0–5 menit): Midazolam buccal/IM 0,2 mg/kg (maks 10 mg) — efektivitas tertinggi di luar RS. Atau Diazepam rektal 0,5 mg/kg (maks 20 mg). Atau Lorazepam IV 0,1 mg/kg (maks 4 mg).' },
      { text: 'Ulangi benzodiazepin SEKALI lagi (5–10 mnt) bila kejang berlanjut. Total maksimum 2 dosis benzodiazepin.' },
      { text: 'Lini 2 (20–40 mnt): Levetirasetam IV 60 mg/kg (maks 4,5 g) dalam 10 mnt. ATAU Asam valproat IV 40 mg/kg (maks 3 g) dalam 10 mnt. ATAU Fenitoín/Fosfenitoin IV 20 mg/kg dalam 20 mnt (maks 1,5 g). Ketiganya setara (ESETT 2019).' },
      { text: 'Lini 3 — RSE (Refractory Status Epilepticus, > 40 mnt): intubasi + anestesi IV: Midazolam 0,2 mg/kg bolus → infus 0,05–2 mg/kg/jam; atau Propofol (anak > 3 th); atau Pentobarbital.' },
      { text: 'Selalu periksa & koreksi: glukosa darah (bolus D10% 2–5 mL/kg bila hipoglikemia), Na, Ca, Mg.' },
      { text: 'Pyridoxine 100 mg IV: pertimbangkan pada bayi < 18 bulan dengan SE tanpa penyebab jelas.' },
      { text: 'EEG sesegera mungkin bila pasien tidak pulih dalam 30 menit — singkirkan status epileptikus non-konvulsif (NCSE).' },
    ],
    references: ['aes2016', 'esett2019', 'pals2020'],
  },
  {
    id: 'neuro_icp',
    title: 'Peningkatan Tekanan Intrakranial (TIK)',
    subtitle: 'Manajemen ICP pediatri — Kochanek 2019',
    category: 'neurologi',
    points: [
      { text: 'Tanda herniasi: pupil anisokor atau blown, postur deserebrasi/dekortikasi, Cushing triad (hipertensi + bradikardia + pola napas ireguler).' },
      { text: 'Intervensi segera: intubasi (bila GCS ≤ 8 atau tanda herniasi), posisi kepala 30° midline, hindari fleksi leher.' },
      { text: 'Hindari: hipotensi, hipoksia, hiperkarbia, demam, hipernatremia ekstrem, hipertensi berat mendadak.' },
      { text: 'Terapi hiperosmolar: Manitol 0,25–1 g/kg IV bolus, ulangi tiap 4–6 jam (jaga osmolalitas serum 300–320 mOsm/kg). ATAU NaCl 3% 2–5 mL/kg IV bolus — lebih disukai pada hipotensi atau gangguan ginjal.' },
      { text: 'Hiperventilasi (PaCO₂ 30–35 mmHg): HANYA sebagai jembatan darurat (< 30 mnt) menuju intervensi definitif — efek vasokonstriksi sementara.' },
      { text: 'Sedasi: Midazolam + Fentanyl untuk mencegah lonjakan TIK saat stimulus (suction, perawatan).' },
      { text: 'Target: CPP (Cerebral Perfusion Pressure) = MAP − ICP. Target CPP: > 40 mmHg (anak kecil), > 50 mmHg (anak besar).' },
      { text: 'Monitoring ICP invasif (EVD atau bolt): pertimbangkan bila GCS ≤ 8 pasca TBI berat dan CT kepala abnormal.' },
      { text: 'Konsul bedah saraf segera bila ada massa hematoma, hidrosefalus obstruktif, atau tidak respons terapi medis.' },
    ],
    references: ['kochanek2019', 'pals2020'],
  },
  {
    id: 'neuro_meningitis',
    title: 'Meningitis Bakteri Pediatri',
    subtitle: 'Tatalaksana empiris & komplikasi',
    category: 'neurologi',
    points: [
      { text: 'Trias klasik: demam, kaku kuduk, perubahan kesadaran — tidak selalu lengkap, terutama pada bayi.' },
      { text: 'Tanda Kernig (ekstensi lutut terbatas saat panggul fleksi 90°) dan Brudzinski (fleksi leher → fleksi lutut): sensitivitas rendah pada bayi.' },
      { text: 'Bayi < 3 bulan: demam + rewel + ubun-ubun cembung → curigai meningitis. Kejang, high-pitched cry, letargi.' },
      { text: 'LP (lumbal pungsi): lakukan bila tidak ada tanda herniasi. CT kepala dulu bila: papil edema, lateralisasi, penurunan kesadaran, riwayat TBI/massa.' },
      { text: 'Antibiotik SEGERA (jangan tunggu LP bila ada kontraindikasi): Seftriakson 100 mg/kg/hari terbagi tiap 12 jam (maks 4 g/hari). Tambah Ampisilin bila usia < 3 bulan (cakup Listeria).' },
      { text: 'Deksametason: 0,15 mg/kg/dosis IV tiap 6 jam × 4 hari, berikan 15–20 mnt SEBELUM dosis pertama antibiotik. Terbukti kurangi komplikasi neurologis pada meningitis Hib dan pneumokokus.' },
      { text: 'Komplikasi: SIADH (restriksi cairan), subdural empyema, abses serebral, hidrosefalus, tuli sensorineural (periksa pendengaran setelah sembuh).' },
      { text: 'Durasi antibiotik: Hib 7–10 hari, Pneumokokus 10–14 hari, Meningokokus 5–7 hari, GBS neonatus 14–21 hari.' },
    ],
    references: ['pals2020', 'ssc2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // RENAL
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'renal_aki_picu',
    title: 'AKI di PICU',
    subtitle: 'Staging KDIGO, pencegahan, & indikasi RRT',
    category: 'renal',
    points: [
      { text: 'Definisi AKI (KDIGO 2012): kenaikan Cr ≥ 0,3 mg/dL dalam 48 jam, atau ≥ 1,5× baseline dalam 7 hari, atau urin < 0,5 mL/kg/jam ≥ 6 jam.' },
      { text: 'Staging AKI: 1 (Cr ×1,5–1,9 atau UO < 0,5 ml/kg/jam ×6–12j), 2 (Cr ×2–2,9 atau UO < 0,5 ×12–24j), 3 (Cr ×3 atau ≥ 4 mg/dL atau UO < 0,3 ×24j atau anuria ×12j).' },
      { text: 'Hentikan nefrotoksin segera: AINS, aminoglikosida (beralih ke alternatif), kontras hiperosmolar iodinated, ACE inhibitor/ARB.' },
      { text: 'Optimalkan hemodinamik DULU sebelum diuretik: koreksi hipovolemia, MAP adekuat sesuai usia.' },
      { text: 'Furosemid: pertimbangkan bila fluid overload ≥ 10% BB, bukan untuk meningkatkan eGFR. Dosis 0,5–2 mg/kg/dosis. Uji responsivitas sebelum infus kontinu.' },
      { text: 'Sesuaikan dosis SEMUA obat yang terekskresi ginjal: antibiotik (vankomisin, aminoglikosida, karbapenem), heparin, morfin.' },
      { text: 'Nutrisi: tidak perlu restriksi protein pada AKI — kalori cukup 25–30 kkal/kg/hari, protein 1,2–2 g/kg/hari.' },
      { text: 'Indikasi RRT (dialisis/CRRT): hiperkalemia refrakter (K > 6,5 + EKG berubah), asidosis berat pH < 7,15, uremia simtomatik, fluid overload refrakter > 15–20% BB.' },
    ],
    references: ['kdigo2012', 'pals2020'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // INFEKSI
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'infeksi_dengue',
    title: 'Dengue / DBD — Manajemen Pediatri',
    subtitle: 'Klasifikasi WHO 2012 & strategi cairan',
    category: 'infeksi',
    points: [
      { text: 'Klasifikasi WHO 2012: (1) Dengue tanpa warning signs, (2) Dengue dengan warning signs, (3) Severe dengue (kebocoran plasma berat, perdarahan berat, disfungsi organ).' },
      { text: 'Warning signs: nyeri perut hebat, muntah persisten, perdarahan mukosa, letargi/gelisah, hepatomegali > 2 cm, kenaikan Ht ≥ 20% + penurunan trombosit cepat.' },
      { text: 'Fase demam (hari 1–3): hidrasi oral adekuat, parasetamol (hindari AINS/aspirin), pantau tanda-tanda kritis.' },
      { text: 'Fase kritis (hari 4–6): kebocoran plasma masif → syok. Monitor Ht tiap 4–6 jam, TD, nadi, UO.' },
      { text: 'Resusitasi syok dengue (DSS): kristaloid isotonik 10–20 mL/kg dalam 15–30 mnt. Ulangi bila perlu (total 40–60 mL/kg). Hati-hati overload.' },
      { text: 'Bila Ht naik > 20% atau tidak respons cairan: koloid (albumin 5% atau dekstran) 10–20 mL/kg.' },
      { text: 'Trombosit: transfusi profilaksis TIDAK direkomendasikan. Transfusi bila < 10.000 ATAU < 20.000 + perdarahan aktif signifikan.' },
      { text: 'Fase pemulihan (hari 7–8): reabsorpsi cairan → risiko hipervolemia. Kurangi cairan IV, awasi tanda overload (ronki, efusi pleura besar, edema).' },
      { text: 'Pantau EKG pada DSS berat (bradiaritmia mungkin terjadi selama pemulihan).' },
    ],
    references: ['who_dengue2012', 'who_dengue2009', 'idai_dengue2014'],
  },
  {
    id: 'infeksi_tb',
    title: 'TB Anak — Diagnosis & Tatalaksana',
    subtitle: 'WHO 2022 & IDAI 2016',
    category: 'infeksi',
    points: [
      { text: 'Diagnosis TB anak berbasis skor (bila tidak ada akses konfirmasi bakteriologis): skoring IDAI — kontak TB, uji tuberkulin, status gizi, gejala klinis, foto toraks.' },
      { text: 'Uji tuberkulin (TST): indurasi ≥ 10 mm (anak imunokompeten) atau ≥ 5 mm (imunokompromais) = positif.' },
      { text: 'IGRA (interferon-gamma release assay): alternatif TST, lebih spesifik, tidak dipengaruhi vaksin BCG.' },
      { text: 'Regimen OAT anak (WHO 2022): 2HRZ/4HR — Isoniazid (H) 10 mg/kg, Rifampisin (R) 15 mg/kg, Pirazinamid (Z) 35 mg/kg selama 2 bulan; lanjut H+R 4 bulan.' },
      { text: 'TB berat (meningitis TB, milier): tambah Etambutol (E) 20 mg/kg fase intensif → 2HRZE/4–10HR. Deksametason untuk meningitis TB.' },
      { text: 'Pemantauan efek samping: SGOT/SGPT setiap bulan (hepatotoksisitas H+R+Z); visus & warna (etambutol, hindari < 6 tahun bila tidak dapat dipantau).' },
      { text: 'TB-HIV: mulai ARV setelah 2–8 minggu OAT. Pilih regimen yang menghindari interaksi rifampisin–protease inhibitor.' },
      { text: 'Kontak serumah TB BTA positif tanpa bukti TB aktif (usia < 5 tahun atau imunokompromais): profilaksis INH 10 mg/kg/hari selama 6 bulan.' },
    ],
    references: ['who_tb2022', 'idai_tb2016'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // METABOLIK
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'metabolik_dka',
    title: 'DKA — Diabetic Ketoacidosis Pediatri',
    subtitle: 'Tatalaksana ISPAD 2022',
    category: 'metabolik',
    points: [
      { text: 'Definisi: glukosa darah > 200 mg/dL + pH < 7,30 atau bikarbonat < 15 mEq/L + ketonemia/ketonuria.' },
      { text: 'Derajat: ringan pH 7,20–7,30 / HCO₃ 10–15; sedang pH 7,10–7,20 / HCO₃ 5–10; berat pH < 7,10 / HCO₃ < 5.' },
      { text: 'Prioritas 1 — Sirkulasi: bila syok (CRT > 2 dtk, akral dingin) → NaCl 0,9% 10–20 mL/kg segera.' },
      { text: 'Rehidrasi: defisit cairan 5–10% BB. Ganti perlahan dalam 24–48 jam menggunakan NaCl 0,9% (awal) → tukar ke cairan dengan Na 130–154 mEq/L setelah 1–2 jam.' },
      { text: 'Insulin: JANGAN mulai insulin sampai cairan diberikan 1 jam. Dosis: 0,05–0,1 unit/kg/jam infus kontinu. Jangan bolus insulin pada anak.' },
      { text: 'Kalium: tambahkan KCl 40 mEq/L ke cairan setelah output urin terbukti, atau K < 5,5 mEq/L. DKA selalu ada deplesi K total meskipun K awal normal/tinggi.' },
      { text: 'Target: turunkan glukosa 50–100 mg/dL per jam. Saat glukosa < 250 mg/dL: tambah dextrose ke cairan infus, pertahankan insulin.' },
      { text: 'Bikarbonat: TIDAK direkomendasikan rutin. Hanya bila pH < 6,9 + gangguan kontraktilitas kardiovaskular mengancam jiwa.' },
      { text: 'Edema serebral: komplikasi paling berbahaya (1–3%), biasanya 4–12 jam setelah terapi. Gejala: nyeri kepala, bradikardi, perubahan kesadaran. Tatalaksana: manitol 0,5–1 g/kg IV atau NaCl 3% 2,5–5 mL/kg.' },
    ],
    references: ['ispad2022'],
  },

  // ══════════════════════════════════════════════════════════════════════
  // FARMAKOLOGI
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'pharm_sedanalgesia',
    title: 'Sedasi & Analgesia di PICU',
    subtitle: 'Pendekatan multimodal & strategi minimasi opioid',
    category: 'farmakologi',
    points: [
      { text: 'Prinsip ABCDEF bundle: Assess & manage pain, Both SAT & SBT, Choice of sedation, Delirium monitoring, Early mobility, Family engagement.' },
      { text: 'Skala penilaian nyeri: FLACC (bayi/anak < 3 th atau tidak bisa komunikasi), COMFORT-B (anak yang diventilasi), NRS 0–10 (anak > 7–8 tahun).' },
      { text: 'Analgesia-first approach: atasi nyeri dulu sebelum sedasi. Paracetamol ± Ibuprofen (bila tidak ada kontraindikasi) → opioid bila belum cukup.' },
      { text: 'Opioid: Morfin 0,05–0,1 mg/kg/dosis tiap 2–4 jam IV; Fentanyl infus 1–3 mcg/kg/jam (lebih stabil hemodinamik, berguna pada gangguan ginjal).' },
      { text: 'Sedatif: Midazolam infus 0,05–0,2 mg/kg/jam (awas akumulasi metabolit pada gagal ginjal/hati); Deksmedetomidin 0,2–1 mcg/kg/jam (sedasi kooperatif, tanpa depresi napas, ideal untuk weaning).' },
      { text: 'Target sedasi: RASS −1 hingga −2 (pasien terangsang tapi tidak agitasi) untuk kebanyakan pasien ICU. Sedasi dalam hanya bila indikasi spesifik (PARDS berat, TIK tinggi).' },
      { text: 'SAT (Spontaneous Awakening Trial) harian: hentikan sedatif sementara bila stabil. SBT dilakukan sesegera mungkin setelah SAT berhasil.' },
      { text: 'Delir ICU: gunakan CAPD (Cornell Assessment of Pediatric Delirium). Koreksi penyebab reversibel (nyeri, obat antikolinergik, deprivasi tidur, imobilisasi). Haloperidol dosis rendah sebagai terapi farmakologi bila perlu.' },
    ],
    references: ['pals2020', 'ssc2020'],
  },
  {
    id: 'pharm_antibiotics_pkpd',
    title: 'Antibiotik — Prinsip PK/PD',
    subtitle: 'Time-dependent vs Concentration-dependent & TDM',
    category: 'farmakologi',
    points: [
      { text: 'Antibiotik time-dependent: β-laktam (penisilin, sefalosporin, karbapenem), vankomisin, klindamisin. Efektivitas bergantung pada lama kadar di atas MIC (%T > MIC). Strategi: perpanjang infus atau dosis lebih sering.' },
      { text: 'Antibiotik concentration-dependent: aminoglikosida (gentamisin, amikasin), fluorokuinolon, metronidazol. Efektivitas bergantung pada Cmax/MIC atau AUC/MIC. Strategi: dosis besar sekali sehari (extended dosing).' },
      { text: 'β-laktam infus diperpanjang (extended infusion): mis. Meropenem 40 mg/kg dalam 3 jam tiap 8 jam — untuk kuman dengan MIC tinggi.' },
      { text: 'TDM Vankomisin: target AUC₂₄/MIC 400–600 mg·h/L (bukan trough semata). Trough target saja sudah ditinggalkan pada guideline terbaru.' },
      { text: 'TDM Aminoglikosida: kadar puncak (Cmax 1 jam pasca dosis): Gentamisin 5–10 mcg/mL; Amikasin 20–35 mcg/mL. Trough < 1 mcg/mL (Gentamisin) atau < 5 mcg/mL (Amikasin) — cegah nefrotoksisitas.' },
      { text: 'De-eskalasi: 48–72 jam setelah kultur tersedia. Turunkan spektrum ke antibiotik tersempit yang masih efektif.' },
      { text: 'Durasi antibiotik berbasis diagnosis: bakteremia tanpa komplikasi 7–14 hari; meningitis bakteri 5–21 hari (tergantung kuman); pneumonia 5–7 hari (sedang) atau 7–10 hari (berat/nekrotisasi).' },
      { text: 'Biomarker panduan durasi: PCT (procalcitonin) — de-eskalasi bila turun > 80% dari puncak atau < 0,5 ng/mL.' },
    ],
    references: ['ssc2020', 'pals2020'],
  },
  {
    id: 'pharm_nutrition',
    title: 'Nutrisi Pediatri Kritis',
    subtitle: 'Enteral & parenteral di PICU — ASPEN/SCCM 2017',
    category: 'farmakologi',
    points: [
      { text: 'Nutrisi enteral (EN) dini (dalam 24–48 jam) direkomendasikan bila hemodinamik stabil dan akses GI memungkinkan.' },
      { text: 'Mulai EN trofik (10–20 mL/jam atau 0,5–1 mL/kg/jam) lebih awal, eskalasi bertahap selama 48–72 jam.' },
      { text: 'Kontraindikasi EN absolut: obstruksi usus mekanik, iskemia usus aktif, fistula GI tanpa akses distal, NEC aktif.' },
      { text: 'Target kalori: 50–75 kkal/kg/hari (bayi), 25–50 (anak 1–8 th), 20–35 (anak > 8 th). Hindari overfeeding (hiperglikemia, hiperkapnia, perlemakan hati).' },
      { text: 'Target protein: 1,5–3 g/kg/hari (bayi prematur), 1,5–2 g/kg/hari (bayi-anak), 1,2–2 g/kg/hari (anak besar). Tingkatkan pada kondisi hiperkatabolis (sepsis, luka bakar).' },
      { text: 'Nutrisi parenteral (PN): mulai bila EN tidak dapat mencapai target dalam 5 hari (anak tanpa malnutrisi) atau lebih awal (malnutrisi berat, neonatus).' },
      { text: 'Suplemen: Zinc, selenium, dan vitamin D perlu dipertimbangkan pada sakit kritis berkepanjangan (defisiensi umum pada anak ICU).' },
      { text: 'Monitoring: glukosa setiap 4–6 jam (awal), trigliserida (bila PN dengan lipid), fungsi hati, fosfat (risiko refeeding syndrome pada malnutrisi berat).' },
    ],
    references: ['aspen2017'],
  },
];

export const CATEGORY_LABELS: Record<TheoryCategory, string> = {
  sepsis:       'Sepsis',
  syok:         'Syok',
  ventilasi:    'Ventilasi',
  respirasi:    'Respirasi',
  neonatus:     'Neonatus',
  cairan:       'Cairan & Elektrolit',
  neurologi:    'Neurologi',
  renal:        'Renal',
  infeksi:      'Infeksi',
  metabolik:    'Metabolik',
  farmakologi:  'Farmakologi',
};

export const CATEGORY_ORDER: TheoryCategory[] = [
  'sepsis', 'syok', 'ventilasi', 'respirasi',
  'neonatus', 'cairan', 'neurologi', 'renal',
  'infeksi', 'metabolik', 'farmakologi',
];
