// ─────────────────────────────────────────────────────────────────────────
// pSOFA — Pediatric Sequential Organ Failure Assessment [8]
// Matics TJ, Sanchez-Pinto LN. JAMA. 2017;318(1):23-36.
// Adaptasi SOFA dewasa untuk pasien pediatri.
// ─────────────────────────────────────────────────────────────────────────

export interface PsofaInput {
  // Respirasi
  pf: number;             // PaO₂/FiO₂ atau SpO₂/FiO₂
  onVentilator: boolean;

  // Koagulasi
  plateletsE3PerMcL: number; // ×10³/µL

  // Hepatik
  bilirubinMgDl: number;

  // Kardiovaskular — vasopresor (mcg/kg/mnt)
  dopamineDose: number;   // 0 bila tidak pakai
  epinephrineDose: number;
  norepinephrineDose: number;
  dobutamineDose: number;

  // Neurologi
  gcs: number;            // 3–15

  // Renal
  creatinineMgDl: number;
  ageMonths: number;      // untuk threshold kreatinin
}

export interface PsofaOrganScore {
  organ: string;
  score: 0 | 1 | 2 | 3 | 4;
  detail: string;
}

export interface PsofaResult {
  total: number;
  organScores: PsofaOrganScore[];
  /** Estimasi mortalitas kasar berdasarkan Matics & Sanchez-Pinto 2017 */
  severityLabel: 'ringan' | 'sedang' | 'berat' | 'sangat berat';
}

function scoreRespiration(pf: number, onVentilator: boolean): PsofaOrganScore {
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (onVentilator) {
    if (pf < 100)      score = 4;
    else if (pf < 200) score = 3;
    else if (pf < 300) score = 2;
    else if (pf < 400) score = 1;
  } else {
    if (pf < 300)      score = 1;
  }
  return { organ: 'Respirasi', score, detail: `P/F ${pf}${onVentilator ? ' (ventilasi)' : ''}` };
}

function scoreCoagulation(platelets: number): PsofaOrganScore {
  const score: 0 | 1 | 2 | 3 | 4 =
    platelets < 20  ? 4 :
    platelets < 50  ? 3 :
    platelets < 100 ? 2 :
    platelets < 150 ? 1 : 0;
  return { organ: 'Koagulasi', score, detail: `Trombosit ${platelets}×10³/µL` };
}

function scoreHepatic(bilirubin: number): PsofaOrganScore {
  const score: 0 | 1 | 2 | 3 | 4 =
    bilirubin >= 12.0 ? 4 :
    bilirubin >= 6.0  ? 3 :
    bilirubin >= 2.0  ? 2 :
    bilirubin >= 1.2  ? 1 : 0;
  return { organ: 'Hepatik', score, detail: `Bilirubin ${bilirubin} mg/dL` };
}

function scoreCardiovascular(
  dopamine: number,
  epinephrine: number,
  norepinephrine: number,
  dobutamine: number,
): PsofaOrganScore {
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (epinephrine > 0.1 || norepinephrine > 0.1)       score = 4;
  else if (epinephrine > 0 || norepinephrine > 0)       score = 3;
  else if (dopamine > 5 || dobutamine > 0)              score = 2;
  else if (dopamine > 0)                                score = 1;
  const drugs = [
    dopamine      > 0 && `Dopamin ${dopamine}`,
    dobutamine    > 0 && `Dobutamin ${dobutamine}`,
    epinephrine   > 0 && `Epinefrin ${epinephrine}`,
    norepinephrine > 0 && `Norepinefrin ${norepinephrine}`,
  ].filter(Boolean).join(', ');
  return { organ: 'Kardiovaskular', score, detail: drugs || 'Tanpa vasopresor' };
}

function scoreNeurologic(gcs: number): PsofaOrganScore {
  const score: 0 | 1 | 2 | 3 | 4 =
    gcs < 6  ? 4 :
    gcs < 10 ? 3 :
    gcs < 13 ? 2 :
    gcs < 15 ? 1 : 0;
  return { organ: 'Neurologi', score, detail: `GCS ${gcs}` };
}

function scoreRenal(creatinine: number, ageMonths: number): PsofaOrganScore {
  // Threshold berdasarkan usia (adaptasi pSOFA)
  const thresh = renalThreshold(ageMonths);
  const score: 0 | 1 | 2 | 3 | 4 =
    creatinine >= thresh[4] ? 4 :
    creatinine >= thresh[3] ? 3 :
    creatinine >= thresh[2] ? 2 :
    creatinine >= thresh[1] ? 1 : 0;
  return { organ: 'Renal', score, detail: `Kreatinin ${creatinine} mg/dL` };
}

function renalThreshold(ageMonths: number): Record<1 | 2 | 3 | 4, number> {
  if (ageMonths < 1)   return { 1: 0.8,  2: 1.0,  3: 1.2,  4: 1.6 };
  if (ageMonths < 12)  return { 1: 0.4,  2: 0.5,  3: 0.6,  4: 0.7 };
  if (ageMonths < 24)  return { 1: 0.5,  2: 0.6,  3: 0.7,  4: 0.9 };
  if (ageMonths < 60)  return { 1: 0.6,  2: 0.7,  3: 0.9,  4: 1.1 };
  if (ageMonths < 144) return { 1: 0.7,  2: 0.9,  3: 1.1,  4: 1.4 };
  return                      { 1: 1.0,  2: 1.2,  3: 1.4,  4: 1.7 };
}

function severityLabel(total: number): PsofaResult['severityLabel'] {
  if (total <= 2)  return 'ringan';
  if (total <= 6)  return 'sedang';
  if (total <= 11) return 'berat';
  return 'sangat berat';
}

export function calculatePsofa(input: PsofaInput): PsofaResult {
  const {
    pf, onVentilator,
    plateletsE3PerMcL,
    bilirubinMgDl,
    dopamineDose, epinephrineDose, norepinephrineDose, dobutamineDose,
    gcs,
    creatinineMgDl, ageMonths,
  } = input;

  if (gcs < 3 || gcs > 15)             throw new Error('pSOFA: GCS harus 3–15');
  if (ageMonths < 0)                    throw new Error('pSOFA: usia tidak valid');
  if (pf <= 0)                          throw new Error('pSOFA: P/F ratio tidak valid');
  if (plateletsE3PerMcL < 0)           throw new Error('pSOFA: trombosit tidak valid');
  if (bilirubinMgDl < 0)               throw new Error('pSOFA: bilirubin tidak valid');
  if (creatinineMgDl < 0)              throw new Error('pSOFA: kreatinin tidak valid');

  const organScores: PsofaOrganScore[] = [
    scoreRespiration(pf, onVentilator),
    scoreCoagulation(plateletsE3PerMcL),
    scoreHepatic(bilirubinMgDl),
    scoreCardiovascular(dopamineDose, epinephrineDose, norepinephrineDose, dobutamineDose),
    scoreNeurologic(gcs),
    scoreRenal(creatinineMgDl, ageMonths),
  ];

  const total = organScores.reduce((s, o) => s + o.score, 0);
  return { total, organScores, severityLabel: severityLabel(total) };
}
