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
  schwartz2009: {
    id: 11,
    citation:
      'Schwartz GJ, Muñoz A, Schneider MF, et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol. 2009;20(3):629–637. (Bedside Schwartz: eGFR = 0.413 × tinggi cm / Cr mg/dL)',
    url: 'https://doi.org/10.1681/ASN.2008030287',
    verified: true,
  },
  kdigo2012: {
    id: 12,
    citation:
      'Kidney Disease: Improving Global Outcomes (KDIGO) CKD Work Group. KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int Suppl. 2013;3(1):1–150.',
    url: 'https://doi.org/10.1038/kisup.2012.73',
    verified: true,
  },
  aap_bp2017: {
    id: 13,
    citation:
      'Flynn JT, Kaelber DC, Baker-Smith CM, et al. Clinical Practice Guideline for Screening and Management of High Blood Pressure in Children and Adolescents. Pediatrics. 2017;140(3):e20171904.',
    url: 'https://doi.org/10.1542/peds.2017-1904',
    verified: true,
  },
  greenbaum2020: {
    id: 14,
    citation:
      'Greenbaum LA. Electrolyte and Acid-Base Disorders. In: Kliegman RM, et al., eds. Nelson Textbook of Pediatrics. 21st ed. Philadelphia: Elsevier; 2020. Chapter 68.',
    verified: true,
  },
  feld2018: {
    id: 15,
    citation:
      'Feld LG, Neuspiel DR, Foster BA, et al. Clinical Practice Guideline: Maintenance Intravenous Fluids in Children. Pediatrics. 2018;142(6):e20183083.',
    url: 'https://doi.org/10.1542/peds.2018-3083',
    verified: true,
  },

  // ── Library Obat & Cairan ───────────────────────────────────────────────
  idai2012: {
    id: 16,
    citation:
      'Tambunan T, Rundjan L, Satari HI, dkk., penyunting. Formularium Spesialistik Ilmu Kesehatan Anak. Jakarta: Ikatan Dokter Anak Indonesia (IDAI); 2013. (Rujukan utama dosis obat pediatri)',
    verified: true,
  },
  lexicomp_ped: {
    id: 17,
    citation:
      'Taketomo CK, Hodding JH, Kraus DM. Pediatric & Neonatal Dosage Handbook. 18th ed. Hudson (OH): Lexi-Comp; 2011. (Sumber dosis primer yang dirujuk Formularium IDAI)',
    verified: true,
  },
  aes2016: {
    id: 18,
    citation:
      'Glauser T, Shinnar S, Gloss D, et al. Evidence-based guideline: treatment of convulsive status epilepticus in children and adults: report of the Guideline Committee of the American Epilepsy Society. Epilepsy Curr. 2016;16(1):48–61.',
    url: 'https://doi.org/10.5698/1535-7597-16.1.48',
    verified: true,
  },
  esett2019: {
    id: 19,
    citation:
      'Kapur J, Elm J, Chamberlain JM, et al. Randomized Trial of Three Anticonvulsant Medications for Status Epilepticus. N Engl J Med. 2019;381(22):2103–2113. (ESETT: levetirasetam, fosfenitoin, valproat setara sebagai lini kedua)',
    url: 'https://doi.org/10.1056/NEJMoa1905795',
    verified: true,
  },
  kochanek2019: {
    id: 20,
    citation:
      'Kochanek PM, Tasker RC, Carney N, et al. Guidelines for the Management of Pediatric Severe Traumatic Brain Injury, Third Edition. Pediatr Crit Care Med. 2019;20(3S Suppl 1):S1–S82. (Terapi hiperosmolar untuk hipertensi intrakranial)',
    url: 'https://doi.org/10.1097/PCC.0000000000001735',
    verified: true,
  },
};
