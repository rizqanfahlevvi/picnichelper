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
    // TODO: konfirmasi nilai tabel terhadap edisi NRP yang dipakai institusi.
    verified: false,
  },
};
