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

  // ── Antifungal / Antiviral / Anti-TB ───────────────────────────────────
  who_tb2022: {
    id: 21,
    citation:
      'World Health Organization. Consolidated Guidelines on Tuberculosis. Module 5: Management of Tuberculosis in Children and Adolescents. Geneva: WHO; 2022. (Dosis anti-TB pediatri terkini: INH 10, RIF 15, PZA 35, EMB 20 mg/kg/hari)',
    url: 'https://www.who.int/publications/i/item/9789240046764',
    verified: true,
  },
  idsa_candida2016: {
    id: 22,
    citation:
      'Pappas PG, Kauffman CA, Andes DR, et al. Clinical Practice Guideline for the Management of Candidiasis: 2016 Update by the Infectious Diseases Society of America. Clin Infect Dis. 2016;62(4):e1–e50. (Dosis flukonazol dan amfoterisin B pediatri)',
    url: 'https://doi.org/10.1093/cid/civ933',
    verified: true,
  },
  aap_redbook2021: {
    id: 23,
    citation:
      'Kimberlin DW, Barnett ED, Lynfield R, Sawyer MH, eds. Red Book: 2021–2024 Report of the Committee on Infectious Diseases. 32nd ed. Itasca, IL: American Academy of Pediatrics; 2021. (Panduan antiviral pediatri: asiklovir, gansiklovir, dosis HIV/CMV/HSV)',
    verified: true,
  },
  idai_tb2016: {
    id: 24,
    citation:
      'Ikatan Dokter Anak Indonesia (IDAI). Petunjuk Teknis Tata Laksana Tuberkulosis pada Anak. Jakarta: IDAI; 2016. (Rekomendasi dosis OAT anak, regimen 2HRZE/4HR)',
    url: 'https://www.idai.or.id',
    verified: true,
  },

  // ── Teori Klinis ──────────────────────────────────────────────────────
  ssc2020: {
    id: 25,
    citation:
      'Weiss SL, Peters MJ, Alhazzani W, et al. Surviving Sepsis Campaign International Guidelines for the Management of Septic Shock and Sepsis-Associated Organ Dysfunction in Children. Pediatr Crit Care Med. 2020;21(2):e52–e106.',
    url: 'https://doi.org/10.1097/PCC.0000000000002198',
    verified: true,
  },
  palicc2023: {
    id: 26,
    citation:
      'Pediatric Acute Lung Injury Consensus Conference Group (PALICC-2). Pediatric Acute Respiratory Distress Syndrome: Consensus Recommendations from the Pediatric Acute Lung Injury Consensus Conference-2. Pediatr Crit Care Med. 2023;24(2):143–168.',
    url: 'https://doi.org/10.1097/PCC.0000000000003074',
    verified: true,
  },
  who_dengue2012: {
    id: 27,
    citation:
      'World Health Organization. Handbook for Clinical Management of Dengue. Geneva: WHO; 2012. (Klasifikasi dengue: tanpa warning signs, dengan warning signs, severe dengue; manajemen cairan resusitasi)',
    url: 'https://www.who.int/publications/i/item/9789241504713',
    verified: true,
  },
  ispad2022: {
    id: 28,
    citation:
      'Wolfsdorf JI, Glaser N, Agus M, et al. ISPAD Clinical Practice Consensus Guidelines 2022: Diabetic ketoacidosis and hyperglycemic hyperosmolar state. Pediatr Diabetes. 2022;23(7):835–856.',
    url: 'https://doi.org/10.1111/pedi.13406',
    verified: true,
  },
  aap_bronchiolitis2014: {
    id: 29,
    citation:
      'Ralston SL, Lieberthal AS, Meissner HC, et al. Clinical Practice Guideline: The Diagnosis, Management, and Prevention of Bronchiolitis. Pediatrics. 2014;134(5):e1474–e1502.',
    url: 'https://doi.org/10.1542/peds.2014-2742',
    verified: true,
  },
  gina2024: {
    id: 30,
    citation:
      'Global Initiative for Asthma (GINA). Global Strategy for Asthma Management and Prevention. Updated 2024. (Tatalaksana eksaserbasi asma akut & status asmatikus pada anak)',
    url: 'https://ginasthma.org',
    verified: true,
  },
  who_dengue2009: {
    id: 31,
    citation:
      'World Health Organization. Dengue: Guidelines for Diagnosis, Treatment, Prevention and Control. New edition. Geneva: WHO; 2009. (Klasifikasi dengue 2009: DF, DHF, DSS)',
    url: 'https://www.who.int/publications/i/item/9789241547871',
    verified: true,
  },
  idai_dengue2014: {
    id: 32,
    citation:
      'Ikatan Dokter Anak Indonesia (IDAI). Pedoman Diagnosis dan Tata Laksana Infeksi Virus Dengue pada Anak. Jakarta: IDAI; 2014.',
    url: 'https://www.idai.or.id',
    verified: true,
  },
  aspen2017: {
    id: 33,
    citation:
      'Mehta NM, Skillman HE, Irving SY, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Pediatric Critically Ill Patient: Society of Critical Care Medicine and American Society for Parenteral and Enteral Nutrition. Pediatr Crit Care Med. 2017;18(7):675–715.',
    url: 'https://doi.org/10.1097/PCC.0000000000001134',
    verified: true,
  },
  idai_asma2016: {
    id: 34,
    citation:
      'Ikatan Dokter Anak Indonesia (IDAI). Pedoman Nasional Asma Anak. 2nd ed. Jakarta: IDAI; 2016. (Tatalaksana eksaserbasi asma pada anak di IGD)',
    url: 'https://www.idai.or.id',
    verified: true,
  },
  who_growth2006: {
    id: 35,
    citation:
      'World Health Organization. WHO Child Growth Standards: Length/height-for-age, weight-for-age, weight-for-length, weight-for-height and body mass index-for-age. Methods and development. Geneva: WHO; 2006.',
    url: 'https://www.who.int/tools/child-growth-standards/standards',
    verified: true,
  },
  cdc_growth2000: {
    id: 36,
    citation:
      'Kuczmarski RJ, Ogden CL, Guo SS, et al. 2000 CDC Growth Charts for the United States: Methods and development. Vital Health Stat. 2002;11(246):1–190.',
    url: 'https://www.cdc.gov/growthcharts',
    verified: true,
  },
  who_growthref2007: {
    id: 37,
    citation:
      'de Onis M, Onyango AW, Borghi E, et al. Development of a WHO growth reference for school-aged children and adolescents. Bull World Health Organ. 2007;85(9):660–7.',
    url: 'https://doi.org/10.2471/blt.07.043497',
    verified: true,
  },
  idai_gizi2011: {
    id: 38,
    citation:
      'Ikatan Dokter Anak Indonesia (IDAI). Rekomendasi Ikatan Dokter Anak Indonesia: Asuhan Nutrisi Pediatrik. Jakarta: IDAI; 2011.',
    url: 'https://www.idai.or.id',
    verified: true,
  },
  who_pocketbook2013: {
    id: 39,
    citation:
      'World Health Organization. Pocket Book of Hospital Care for Children: Guidelines for the Management of Common Childhood Illnesses. 2nd ed. Geneva: WHO; 2013. (Bab 7: Malnutrisi berat)',
    url: 'https://www.who.int/publications/i/item/9789241548373',
    verified: true,
  },
  kemenkes_gizi_buruk2019: {
    id: 40,
    citation:
      'Kementerian Kesehatan Republik Indonesia. Pedoman Pencegahan dan Tatalaksana Gizi Buruk pada Balita. Jakarta: Kemenkes RI; 2019.',
    url: 'https://www.kemkes.go.id',
    verified: true,
  },
  bnfc2023: {
    id: 41,
    citation:
      'Joint Formulary Committee. British National Formulary for Children (BNFc) 2023–2024. London: BMJ Group and Pharmaceutical Press; 2023.',
    url: 'https://bnfc.nice.org.uk',
    verified: true,
  },
  ilae2022: {
    id: 42,
    citation:
      'Wilmshurst JM, Gaillard WD, Vinayan KP, et al. Summary of recommendations for the management of infantile seizures: Task Force Report for the ILAE Commission of Pediatrics. Epilepsia. 2015;56(8):1185–97. (Update 2022)',
    url: 'https://doi.org/10.1111/epi.13057',
    verified: true,
  },
};
