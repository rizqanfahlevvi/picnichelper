// ─────────────────────────────────────────────────────────────────────────
// Interpretasi AGD (Analisis Gas Darah)
// Sources:
//   Boston Rules: Narins RG, Emmett M. Medicine 1980;59(3):161-187.
//   Anion Gap:    Emmett M, Narins RG. Medicine 1977;56(1):38-54.
//   P/F Ratio:    ARDS Definition Task Force. JAMA 2012;307(23):2526-2533.
// ─────────────────────────────────────────────────────────────────────────

export type PrimaryDisorder =
  | 'metabolic_acidosis'
  | 'metabolic_alkalosis'
  | 'respiratory_acidosis'
  | 'respiratory_alkalosis'
  | 'normal';

export type CompensationStatus =
  | 'adequate'
  | 'over'
  | 'under'
  | 'not_applicable';

export type DeltaRatioClass =
  | 'pure_nagma'      // < 0.4
  | 'mixed'           // 0.4–1.0
  | 'pure_hagma'      // 1.0–2.0
  | 'hagma_met_alk';  // > 2.0

export type PFRatioClass =
  | 'normal'
  | 'mild_ards'
  | 'moderate_ards'
  | 'severe_ards';

export interface AbgInput {
  pH: number;
  paCO2: number;  // mmHg
  hco3: number;   // mEq/L (aktual, dari BGA)
  // Opsional — untuk Anion Gap:
  na?: number;    // mEq/L
  cl?: number;    // mEq/L
  // Opsional — untuk P/F ratio:
  pao2?: number;  // mmHg
  fio2?: number;  // fraction 0.21–1.0
}

export interface AbgResult {
  primaryDisorder: PrimaryDisorder;
  compensationStatus: CompensationStatus;
  expectedCompensation: { label: string; low: number; high: number } | null;
  // Anion Gap (Na - Cl - HCO3)
  anionGap: number | null;
  anionGapHigh: boolean | null;
  // Delta Ratio (hanya bila HAGMA)
  deltaRatio: number | null;
  deltaRatioClass: DeltaRatioClass | null;
  // P/F Ratio
  pfRatio: number | null;
  pfRatioClass: PFRatioClass | null;
  interpretation: string;
}

const NORMAL_PH_LOW  = 7.35;
const NORMAL_PH_HIGH = 7.45;
const NORMAL_PACO2_LOW  = 35;
const NORMAL_PACO2_HIGH = 45;
const NORMAL_HCO3_LOW  = 22;
const NORMAL_HCO3_HIGH = 26;
const NORMAL_AG_HIGH = 12;

export function interpretAbg(input: AbgInput): AbgResult {
  const { pH, paCO2, hco3, na, cl, pao2, fio2 } = input;

  if (!Number.isFinite(pH) || pH < 6.5 || pH > 7.9)
    throw new Error('ABG: nilai pH tidak valid (6.5–7.9)');
  if (!Number.isFinite(paCO2) || paCO2 <= 0 || paCO2 > 150)
    throw new Error('ABG: nilai PaCO₂ tidak valid');
  if (!Number.isFinite(hco3) || hco3 <= 0 || hco3 > 60)
    throw new Error('ABG: nilai HCO₃⁻ tidak valid');

  const isAcidemia  = pH < NORMAL_PH_LOW;
  const isAlkalemia = pH > NORMAL_PH_HIGH;
  const highCO2  = paCO2 > NORMAL_PACO2_HIGH;
  const lowCO2   = paCO2 < NORMAL_PACO2_LOW;
  const highHCO3 = hco3 > NORMAL_HCO3_HIGH;
  const lowHCO3  = hco3 < NORMAL_HCO3_LOW;

  // ── Gangguan primer ───────────────────────────────────────────────────────
  let primaryDisorder: PrimaryDisorder = 'normal';
  if (isAcidemia) {
    primaryDisorder = highCO2 ? 'respiratory_acidosis' : 'metabolic_acidosis';
  } else if (isAlkalemia) {
    primaryDisorder = lowCO2 ? 'respiratory_alkalosis' : 'metabolic_alkalosis';
  } else {
    if (highCO2 && highHCO3) primaryDisorder = 'respiratory_acidosis';
    else if (lowCO2 && lowHCO3) primaryDisorder = 'respiratory_alkalosis';
  }

  // ── Kompensasi (Boston Rules) ─────────────────────────────────────────────
  let expectedCompensation: AbgResult['expectedCompensation'] = null;
  let compensationStatus: CompensationStatus = 'not_applicable';

  switch (primaryDisorder) {
    case 'metabolic_acidosis': {
      const center = 1.5 * hco3 + 8; // Winter's formula
      expectedCompensation = { label: "PaCO₂ ekspektasi — Winter's (mmHg)", low: center - 2, high: center + 2 };
      compensationStatus = paCO2 < center - 2 ? 'over' : paCO2 > center + 2 ? 'under' : 'adequate';
      break;
    }
    case 'metabolic_alkalosis': {
      const center = 0.7 * hco3 + 21;
      expectedCompensation = { label: 'PaCO₂ ekspektasi (mmHg)', low: center - 2, high: center + 2 };
      compensationStatus = paCO2 < center - 2 ? 'over' : paCO2 > center + 2 ? 'under' : 'adequate';
      break;
    }
    case 'respiratory_acidosis': {
      const d = paCO2 - 40;
      expectedCompensation = {
        label: 'HCO₃⁻ ekspektasi akut/kronik (mEq/L)',
        low:  Math.round(24 + 0.1 * d - 3),
        high: Math.round(24 + 0.35 * d + 3),
      };
      compensationStatus = hco3 < expectedCompensation.low ? 'under' : hco3 > expectedCompensation.high ? 'over' : 'adequate';
      break;
    }
    case 'respiratory_alkalosis': {
      const d = 40 - paCO2;
      expectedCompensation = {
        label: 'HCO₃⁻ ekspektasi akut/kronik (mEq/L)',
        low:  Math.round(24 - 0.5 * d - 3),
        high: Math.round(24 - 0.2 * d + 3),
      };
      compensationStatus = hco3 < expectedCompensation.low ? 'over' : hco3 > expectedCompensation.high ? 'under' : 'adequate';
      break;
    }
  }

  // ── Anion Gap ─────────────────────────────────────────────────────────────
  let anionGap: number | null = null;
  let anionGapHigh: boolean | null = null;
  if (na != null && cl != null && Number.isFinite(na) && Number.isFinite(cl) && na > 0 && cl > 0) {
    anionGap = Math.round((na - cl - hco3) * 10) / 10;
    anionGapHigh = anionGap > NORMAL_AG_HIGH;
  }

  // ── Delta Ratio (hanya bila HAGMA: metabolic acidosis + AG tinggi) ────────
  let deltaRatio: number | null = null;
  let deltaRatioClass: DeltaRatioClass | null = null;
  if (primaryDisorder === 'metabolic_acidosis' && anionGap != null && anionGapHigh) {
    const excessAG = anionGap - 12;       // AG di atas normal
    const bicarbonateDrop = 24 - hco3;   // penurunan HCO3 dari normal
    if (bicarbonateDrop > 0) {
      deltaRatio = Math.round((excessAG / bicarbonateDrop) * 100) / 100;
      if (deltaRatio < 0.4)      deltaRatioClass = 'pure_nagma';
      else if (deltaRatio < 1.0) deltaRatioClass = 'mixed';
      else if (deltaRatio < 2.0) deltaRatioClass = 'pure_hagma';
      else                       deltaRatioClass = 'hagma_met_alk';
    }
  }

  // ── P/F Ratio ─────────────────────────────────────────────────────────────
  let pfRatio: number | null = null;
  let pfRatioClass: PFRatioClass | null = null;
  if (pao2 != null && fio2 != null && Number.isFinite(pao2) && Number.isFinite(fio2) && pao2 > 0 && fio2 >= 0.21 && fio2 <= 1) {
    pfRatio = Math.round(pao2 / fio2);
    if      (pfRatio >= 300) pfRatioClass = 'normal';
    else if (pfRatio >= 200) pfRatioClass = 'mild_ards';
    else if (pfRatio >= 100) pfRatioClass = 'moderate_ards';
    else                     pfRatioClass = 'severe_ards';
  }

  const interpretation = buildInterpretation(primaryDisorder, compensationStatus);

  return {
    primaryDisorder, compensationStatus, expectedCompensation,
    anionGap, anionGapHigh,
    deltaRatio, deltaRatioClass,
    pfRatio, pfRatioClass,
    interpretation,
  };
}

function buildInterpretation(disorder: PrimaryDisorder, comp: CompensationStatus): string {
  const labels: Record<PrimaryDisorder, string> = {
    metabolic_acidosis:    'Asidosis Metabolik',
    metabolic_alkalosis:   'Alkalosis Metabolik',
    respiratory_acidosis:  'Asidosis Respiratorik',
    respiratory_alkalosis: 'Alkalosis Respiratorik',
    normal:                'AGD Normal',
  };
  if (disorder === 'normal') return labels.normal;
  const compLabel =
    comp === 'adequate' ? 'kompensasi adekuat' :
    comp === 'over'     ? 'kompensasi berlebih → kemungkinan gangguan ganda' :
    comp === 'under'    ? 'kompensasi kurang → kemungkinan gangguan ganda' : '';
  return `${labels[disorder]}${compLabel ? ' · ' + compLabel : ''}`;
}

export const DELTA_RATIO_LABELS: Record<DeltaRatioClass, string> = {
  pure_nagma:    'NAGMA murni (non-anion gap)',
  mixed:         'Campuran NAGMA + HAGMA',
  pure_hagma:    'HAGMA murni',
  hagma_met_alk: 'HAGMA + Alkalosis Metabolik',
};

export const PF_RATIO_LABELS: Record<PFRatioClass, string> = {
  normal:        'Normal (≥ 300)',
  mild_ards:     'ARDS Ringan (200–299)',
  moderate_ards: 'ARDS Sedang (100–199)',
  severe_ards:   'ARDS Berat (< 100)',
};
