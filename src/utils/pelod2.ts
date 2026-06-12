// ─────────────────────────────────────────────────────────────────────────
// PELOD-2 — Pediatric Logistic Organ Dysfunction Score [7]
// Leteurtre S, et al. Lancet 2013;381(9862):176-183.
// Digunakan di PICU untuk menilai disfungsi organ & prediksi mortalitas.
// ─────────────────────────────────────────────────────────────────────────

// ── Tipe ─────────────────────────────────────────────────────────────────

export interface Pelod2Input {
  // Neurologi
  gcs: number;            // Glasgow Coma Scale total (3–15)
  pupils: 'both_react' | 'one_fixed' | 'both_fixed';

  // Kardiovaskular
  lactateMmolL: number;   // mmol/L
  mapMmHg: number;        // mean arterial pressure
  ageMonths: number;      // diperlukan untuk MAP threshold

  // Renal
  creatinineMgDl: number; // mg/dL

  // Respirasi
  pf: number;             // PaO₂/FiO₂ atau SpO₂/FiO₂ ratio
  onVentilator: boolean;
  paCO2MmHg: number;      // hanya relevan jika onVentilator

  // Hematologi
  wbcE3PerMcL: number;    // WBC ×10³/µL
  plateletsE3PerMcL: number; // platelets ×10³/µL

  // Hepatik
  bilirubinMgDl: number;
}

export interface Pelod2OrganScore {
  organ: string;
  score: number;
  detail: string;
}

export interface Pelod2Result {
  total: number;
  organScores: Pelod2OrganScore[];
  /** Estimasi mortalitas (logistic regression, Leteurtre 2013) */
  estimatedMortalityPercent: number;
}

// ── Scoring per organ ─────────────────────────────────────────────────────

function scoreNeurologic(gcs: number, pupils: Pelod2Input['pupils']): Pelod2OrganScore {
  let score = 0;

  // GCS contribution
  if (gcs <= 5) score += 5;
  else if (gcs <= 10) score += 3;
  else if (gcs <= 12) score += 1;

  // Pupil contribution
  if (pupils === 'both_fixed') score += 4;
  else if (pupils === 'one_fixed') score += 2;

  return {
    organ: 'Neurologi',
    score,
    detail: `GCS ${gcs}, Pupil: ${pupils === 'both_react' ? 'keduanya reaktif' : pupils === 'one_fixed' ? 'satu fixed' : 'keduanya fixed'}`,
  };
}

function scoreCardiovascular(
  lactateMmolL: number,
  mapMmHg: number,
  ageMonths: number,
): Pelod2OrganScore {
  let score = 0;

  // Laktat
  if (lactateMmolL > 11) score += 4;
  else if (lactateMmolL > 5) score += 2;
  else if (lactateMmolL > 2) score += 1;

  // MAP berdasarkan usia (threshold PELOD-2)
  const mapThreshold = mapThresholdByAge(ageMonths);
  if (mapMmHg < mapThreshold.critical) score += 3;
  else if (mapMmHg < mapThreshold.low) score += 1;

  return {
    organ: 'Kardiovaskular',
    score,
    detail: `Laktat ${lactateMmolL} mmol/L, MAP ${mapMmHg} mmHg`,
  };
}

function mapThresholdByAge(ageMonths: number): { low: number; critical: number } {
  if (ageMonths < 1)   return { low: 46, critical: 31 };
  if (ageMonths < 12)  return { low: 55, critical: 39 };
  if (ageMonths < 24)  return { low: 60, critical: 44 };
  if (ageMonths < 60)  return { low: 62, critical: 46 };
  if (ageMonths < 144) return { low: 65, critical: 49 };
  return                      { low: 67, critical: 52 };
}

function scoreRenal(creatinineMgDl: number, ageMonths: number): Pelod2OrganScore {
  const thresh = creatinineThresholdByAge(ageMonths);
  const score =
    creatinineMgDl >= thresh.severe ? 3 :
    creatinineMgDl >= thresh.moderate ? 1 : 0;

  return {
    organ: 'Renal',
    score,
    detail: `Kreatinin ${creatinineMgDl} mg/dL`,
  };
}

function creatinineThresholdByAge(ageMonths: number): { moderate: number; severe: number } {
  if (ageMonths < 1)   return { moderate: 0.85, severe: 1.70 };
  if (ageMonths < 12)  return { moderate: 0.45, severe: 0.90 };
  if (ageMonths < 24)  return { moderate: 0.55, severe: 1.10 };
  if (ageMonths < 60)  return { moderate: 0.65, severe: 1.30 };
  if (ageMonths < 144) return { moderate: 0.75, severe: 1.50 };
  return                      { moderate: 1.00, severe: 2.00 };
}

function scoreRespiratory(
  pf: number,
  onVentilator: boolean,
  paCO2MmHg: number,
): Pelod2OrganScore {
  let score = 0;

  if (onVentilator) {
    if (pf < 100) score += 3;
    else if (pf < 200) score += 2;
    else if (pf < 300) score += 1;

    if (paCO2MmHg > 58) score += 1;
  } else {
    if (pf < 100) score += 2;
    else if (pf < 200) score += 1;
  }

  return {
    organ: 'Respirasi',
    score,
    detail: `P/F ratio ${pf}${onVentilator ? `, PaCO₂ ${paCO2MmHg} mmHg` : ''}`,
  };
}

function scoreHematologic(
  wbc: number,
  platelets: number,
): Pelod2OrganScore {
  let score = 0;
  if (wbc < 2) score += 2;
  if (platelets < 50) score += 2;
  else if (platelets < 100) score += 1;

  return {
    organ: 'Hematologi',
    score,
    detail: `WBC ${wbc}×10³/µL, Trombosit ${platelets}×10³/µL`,
  };
}

function scoreHepatic(bilirubinMgDl: number, ageMonths: number): Pelod2OrganScore {
  // Bilirubin tidak dinilai pada neonatus (<1 bulan)
  const score = ageMonths >= 1 && bilirubinMgDl > 8.8 ? 2 : 0;
  return {
    organ: 'Hepatik',
    score,
    detail: ageMonths < 1 ? 'Tidak dinilai (neonatus)' : `Bilirubin ${bilirubinMgDl} mg/dL`,
  };
}

// ── Estimasi mortalitas (Leteurtre 2013) ──────────────────────────────────
// log-odds = -6.61 + 0.471 × PELOD-2 score
function estimateMortality(total: number): number {
  const logOdds = -6.61 + 0.471 * total;
  const prob = 1 / (1 + Math.exp(-logOdds));
  return Math.round(prob * 1000) / 10; // 1 desimal
}

// ── Fungsi utama ──────────────────────────────────────────────────────────
export function calculatePelod2(input: Pelod2Input): Pelod2Result {
  const {
    gcs, pupils,
    lactateMmolL, mapMmHg, ageMonths,
    creatinineMgDl,
    pf, onVentilator, paCO2MmHg,
    wbcE3PerMcL, plateletsE3PerMcL,
    bilirubinMgDl,
  } = input;

  if (gcs < 3 || gcs > 15)         throw new Error('PELOD-2: GCS harus 3–15');
  if (ageMonths < 0)                throw new Error('PELOD-2: usia tidak valid');
  if (lactateMmolL < 0)             throw new Error('PELOD-2: laktat tidak valid');
  if (mapMmHg <= 0)                 throw new Error('PELOD-2: MAP tidak valid');
  if (creatinineMgDl < 0)           throw new Error('PELOD-2: kreatinin tidak valid');
  if (pf <= 0)                      throw new Error('PELOD-2: P/F ratio tidak valid');
  if (wbcE3PerMcL < 0)             throw new Error('PELOD-2: WBC tidak valid');
  if (plateletsE3PerMcL < 0)       throw new Error('PELOD-2: trombosit tidak valid');
  if (bilirubinMgDl < 0)           throw new Error('PELOD-2: bilirubin tidak valid');

  const organScores: Pelod2OrganScore[] = [
    scoreNeurologic(gcs, pupils),
    scoreCardiovascular(lactateMmolL, mapMmHg, ageMonths),
    scoreRenal(creatinineMgDl, ageMonths),
    scoreRespiratory(pf, onVentilator, paCO2MmHg),
    scoreHematologic(wbcE3PerMcL, plateletsE3PerMcL),
    scoreHepatic(bilirubinMgDl, ageMonths),
  ];

  const total = organScores.reduce((sum, o) => sum + o.score, 0);

  return {
    total,
    organScores,
    estimatedMortalityPercent: estimateMortality(total),
  };
}
