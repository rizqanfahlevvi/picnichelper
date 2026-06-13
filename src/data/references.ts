// ─────────────────────────────────────────────────────────────────────────
// Registry sitasi medis (Single Source of Truth untuk daftar pustaka).
// Setiap rumus/angka medis WAJIB menunjuk ke salah satu entri di sini.
// Halaman /referensi membaca registry yang sama → sitasi inline & daftar
// pustaka selalu sinkron. (CLAUDE.md: sitasi Vancouver, evidence-based)
// ─────────────────────────────────────────────────────────────────────────

export interface Reference {
  /** Nomor sitasi Vancouver, mis. [1] */
  id: number;
  /** Teks daftar pustaka gaya Vancouver */
  citation: string;
  /** Tautan opsional ke sumber */
  url?: string;
  /** Status verifikasi sumber oleh pengarah klinis */
  verified: boolean;
}

export const REFERENCES: Record<string, Reference> = {
  pals2020: {
    id: 1,
    citation:
      'Topjian AA, Raymond TT, Atkins D, et al. Part 4: Pediatric Basic and Advanced Life Support: 2020 American Heart Association Guidelines for CPR and ECC. Circulation. 2020;142(16_suppl_2):S469–S523.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901',
    verified: true,
  },
  cole1957: {
    id: 2,
    citation:
      'Cole F. Pediatric formulas for the anesthesiologist. AMA J Dis Child. 1957;94(6):672–673. (Rumus uncuffed: usia/4 + 4)',
    verified: true,
  },
  duracher2008: {
    id: 3,
    citation:
      'Duracher C, Schmautz E, Martinon C, et al. Evaluation of cuffed tracheal tube size predicted using the Khine formula in children. Paediatr Anaesth. 2008;18(2):113–118. (Rumus cuffed: usia/4 + 3.5)',
    verified: true,
  },
  nrp8: {
    id: 4,
    citation:
      'Weiner GM, Zaichkin J, eds. Textbook of Neonatal Resuscitation (NRP). 8th ed. American Academy of Pediatrics; 2021. Tabel ukuran ETT neonatus berbasis berat & usia gestasi.',
    verified: true,
  },
  boston1980: {
    id: 5,
    citation:
      'Narins RG, Emmett M. Simple and mixed acid-base disorders: a practical approach. Medicine (Baltimore). 1980;59(3):161–187. (Boston Rules untuk kompensasi gangguan asam-basa)',
    verified: true,
  },
  downes1970: {
    id: 6,
    citation:
      'Downes JJ, Vidyasagar D, Boggs TR Jr, Morrow GM 3rd. Respiratory distress syndrome of newborn infants. Clin Pediatr (Phila). 1970;9(6):325–331. (Downes Score untuk distres napas neonatus)',
    verified: true,
  },
  leteurtre2013: {
    id: 7,
    citation:
      'Leteurtre S, Duhamel A, Salleron J, et al. PELOD-2: an update of the Pediatric Logistic Organ Dysfunction Score. Crit Care Med. 2013;41(7):1761–1773.',
    url: 'https://doi.org/10.1097/CCM.0b013e31828a2984',
    verified: true,
  },
  matics2017: {
    id: 8,
    citation:
      'Matics TJ, Sanchez-Pinto LN. Adaptation and Validation of a Pediatric Sequential Organ Failure Assessment Score and Evaluation of the Sepsis-3 Definitions in Critically Ill Children. JAMA Pediatr. 2017;171(10):e172352.',
    url: 'https://doi.org/10.1001/jamapediatrics.2017.2352',
    verified: true,
  },
  parry2003: {
    id: 9,
    citation:
      'Parry G, Tucker J, Tarnow-Mordi W; UK Neonatal Staffing Study Collaborative Group. CRIB II: an update of the clinical risk index for babies score. Lancet. 2003;361(9371):1789–1791.',
    url: 'https://doi.org/10.1016/S0140-6736(03)13397-1',
    verified: true,
  },
  holliday1957: {
    id: 10,
    citation:
      'Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957;19(5):823–832. (Rumus 4-2-1 maintenance cairan pediatri)',
    verified: true,
  },
  ards2012: {
    id: 11,
    citation:
      'ARDS Definition Task Force; Ranieri VM, Rubenfeld GD, Thompson BT, et al. Acute respiratory distress syndrome: the Berlin Definition. JAMA. 2012;307(23):2526–2533. (Kriteria ARDS Berlin: P/F ratio untuk klasifikasi ringan/sedang/berat)',
    url: 'https://doi.org/10.1001/jama.2012.5669',
    verified: true,
  },
  emmett1977: {
    id: 12,
    citation:
      'Emmett M, Narins RG. Clinical use of the anion gap. Medicine (Baltimore). 1977;56(1):38–54. (Rumus anion gap dan interpretasi)',
    verified: true,
  },
};
