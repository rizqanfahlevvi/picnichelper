// ─────────────────────────────────────────────────────────────────────────
// Interpretasi AGD (Analisis Gas Darah) — Boston Rules [5]
// Narins RG, Emmett M. Medicine 1980;59(3):161-187.
// ─────────────────────────────────────────────────────────────────────────

export type PrimaryDisorder =
  | 'metabolic_acidosis'
  | 'metabolic_alkalosis'
  | 'respiratory_acidosis'
  | 'respiratory_alkalosis'
  | 'normal';

export type CompensationStatus =
  | 'adequate'      // kompensasi sesuai Boston Rules
  | 'over'          // kompensasi berlebih → kemungkinan gangguan ganda
  | 'under'         // kompensasi kurang → kemungkinan gangguan ganda
  | 'not_applicable'; // disorder normal, tidak perlu kompensasi

export interface AbgInput {
  pH: number;
  paCO2: number;  // mmHg
  hco3: number;   // mEq/L (aktual, dari BGA)
}

export interface AbgResult {
  primaryDisorder: PrimaryDisorder;
  compensationStatus: CompensationStatus;
  /** Expected compensation range sesuai Boston Rules */
  expectedCompensation: { label: string; low: number; high: number } | null;
  /** Anion gap (bila relevan, null bila tidak) */
  anionGap: number | null;
  /** Ringkasan interpretasi */
  interpretation: string;
}

const NORMAL_PH_LOW = 7.35;
const NORMAL_PH_HIGH = 7.45;
const NORMAL_PACO2_LOW = 35;
const NORMAL_PACO2_HIGH = 45;
const NORMAL_HCO3_LOW = 22;
const NORMAL_HCO3_HIGH = 26;

export function interpretAbg(input: AbgInput): AbgResult {
  const { pH, paCO2, hco3 } = input;

  if (!Number.isFinite(pH) || pH < 6.5 || pH > 7.9)
    throw new Error('ABG: nilai pH tidak valid (6.5–7.9)');
  if (!Number.isFinite(paCO2) || paCO2 <= 0 || paCO2 > 150)
    throw new Error('ABG: nilai PaCO₂ tidak valid');
  if (!Number.isFinite(hco3) || hco3 <= 0 || hco3 > 60)
    throw new Error('ABG: nilai HCO₃⁻ tidak valid');

  const isAcidemia = pH < NORMAL_PH_LOW;
  const isAlkalemia = pH > NORMAL_PH_HIGH;
  const highCO2 = paCO2 > NORMAL_PACO2_HIGH;
  const lowCO2 = paCO2 < NORMAL_PACO2_LOW;
  const highHCO3 = hco3 > NORMAL_HCO3_HIGH;
  const lowHCO3 = hco3 < NORMAL_HCO3_LOW;

  // Tentukan gangguan primer
  let primaryDisorder: PrimaryDisorder = 'normal';

  if (isAcidemia) {
    primaryDisorder = highCO2 ? 'respiratory_acidosis' : 'metabolic_acidosis';
  } else if (isAlkalemia) {
    primaryDisorder = lowCO2 ? 'respiratory_alkalosis' : 'metabolic_alkalosis';
  } else {
    // pH normal — cek apakah ada gangguan yang saling mengkompensasi
    if (highCO2 && highHCO3) primaryDisorder = 'respiratory_acidosis'; // resp dominan
    else if (lowCO2 && lowHCO3) primaryDisorder = 'respiratory_alkalosis';
    // else benar-benar normal
  }

  // Hitung kompensasi yang diharapkan (Boston Rules)
  let expectedCompensation: AbgResult['expectedCompensation'] = null;
  let compensationStatus: CompensationStatus = 'not_applicable';

  switch (primaryDisorder) {
    case 'metabolic_acidosis': {
      // Winter's formula (derivat Boston): PaCO₂ = 1.5 × HCO₃ + 8 ± 2
      const center = 1.5 * hco3 + 8;
      expectedCompensation = { label: 'PaCO₂ ekspektasi (mmHg)', low: center - 2, high: center + 2 };
      compensationStatus = paCO2 < center - 2 ? 'over' : paCO2 > center + 2 ? 'under' : 'adequate';
      break;
    }
    case 'metabolic_alkalosis': {
      // Boston: PaCO₂ = 0.7 × HCO₃ + 21 ± 2
      const center = 0.7 * hco3 + 21;
      expectedCompensation = { label: 'PaCO₂ ekspektasi (mmHg)', low: center - 2, high: center + 2 };
      compensationStatus = paCO2 < center - 2 ? 'over' : paCO2 > center + 2 ? 'under' : 'adequate';
      break;
    }
    case 'respiratory_acidosis': {
      // Akut: ΔHCO₃ = 0.1 × ΔPaCO₂; Kronik: ΔHCO₃ = 0.35 × ΔPaCO₂
      const deltaCO2 = paCO2 - 40;
      // Tampilkan rentang gabungan akut (batas bawah) sampai kronik (batas atas)
      const rangeLow = Math.round(24 + 0.1 * deltaCO2 - 3);
      const rangeHigh = Math.round(24 + 0.35 * deltaCO2 + 3);
      expectedCompensation = {
        label: 'HCO₃⁻ ekspektasi akut/kronik (mEq/L)',
        low: rangeLow,
        high: rangeHigh,
      };
      compensationStatus = hco3 < rangeLow ? 'under' : hco3 > rangeHigh ? 'over' : 'adequate';
      break;
    }
    case 'respiratory_alkalosis': {
      // Akut: ΔHCO₃ = 0.2 × ΔPaCO₂; Kronik: ΔHCO₃ = 0.5 × ΔPaCO₂
      const deltaCO2 = 40 - paCO2;
      // Kronik turun lebih jauh → batas bawah; akut batas atas
      const rangeLow = Math.round(24 - 0.5 * deltaCO2 - 3);
      const rangeHigh = Math.round(24 - 0.2 * deltaCO2 + 3);
      expectedCompensation = {
        label: 'HCO₃⁻ ekspektasi akut/kronik (mEq/L)',
        low: rangeLow,
        high: rangeHigh,
      };
      compensationStatus = hco3 < rangeLow ? 'over' : hco3 > rangeHigh ? 'under' : 'adequate';
      break;
    }
    case 'normal':
      compensationStatus = 'not_applicable';
      break;
  }

  const interpretation = buildInterpretation(primaryDisorder, compensationStatus);

  return {
    primaryDisorder,
    compensationStatus,
    expectedCompensation,
    anionGap: null, // AG butuh Na/Cl/HCO3 — tidak di-input sekarang
    interpretation,
  };
}

function buildInterpretation(disorder: PrimaryDisorder, comp: CompensationStatus): string {
  const labels: Record<PrimaryDisorder, string> = {
    metabolic_acidosis: 'Asidosis Metabolik',
    metabolic_alkalosis: 'Alkalosis Metabolik',
    respiratory_acidosis: 'Asidosis Respiratorik',
    respiratory_alkalosis: 'Alkalosis Respiratorik',
    normal: 'AGD Normal',
  };

  if (disorder === 'normal') return labels.normal;

  const compLabel =
    comp === 'adequate' ? 'dengan kompensasi adekuat' :
    comp === 'over'     ? '+ kemungkinan gangguan ganda (kompensasi berlebih)' :
    comp === 'under'    ? '+ kemungkinan gangguan ganda (kompensasi kurang)' : '';

  return `${labels[disorder]}${compLabel ? ' ' + compLabel : ''}`;
}
