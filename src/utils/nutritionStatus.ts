// Nutrition status calculator using WHO Growth Standards 2006 and CDC Growth Charts 2000
// All functions are pure (same input → same output, no side effects)
// References: [35] WHO 2006, [36] CDC 2000, [37] WHO 2007, [38] IDAI 2011

import {
  WHO_WFA_BOYS, WHO_WFA_GIRLS,
  WHO_LHFA_BOYS_0_2, WHO_LHFA_BOYS_2_5, WHO_LHFA_GIRLS_0_2, WHO_LHFA_GIRLS_2_5,
  WHO_WFL_BOYS, WHO_WFL_GIRLS, WHO_WFH_BOYS, WHO_WFH_GIRLS,
  WHO_BMI_BOYS_0_2, WHO_BMI_BOYS_2_5, WHO_BMI_GIRLS_0_2, WHO_BMI_GIRLS_2_5,
  CDC_WTA_BOYS, CDC_WTA_GIRLS, CDC_HTA_BOYS, CDC_HTA_GIRLS,
  type LMSRow,
} from '../data/growthData';

// ── LMS interpolation ────────────────────────────────────────────────────────

/** Linear interpolation between two LMS rows by key */
function interpolateLMS(table: LMSRow[], key: number): { L: number; M: number; S: number } | null {
  if (table.length === 0) return null;
  if (key <= table[0][0]) return { L: table[0][1], M: table[0][2], S: table[0][3] };
  if (key >= table[table.length - 1][0]) {
    const last = table[table.length - 1];
    return { L: last[1], M: last[2], S: last[3] };
  }
  for (let i = 0; i < table.length - 1; i++) {
    const lo = table[i], hi = table[i + 1];
    if (key >= lo[0] && key <= hi[0]) {
      const t = (key - lo[0]) / (hi[0] - lo[0]);
      return {
        L: lo[1] + t * (hi[1] - lo[1]),
        M: lo[2] + t * (hi[2] - lo[2]),
        S: lo[3] + t * (hi[3] - lo[3]),
      };
    }
  }
  return null;
}

/** LMS method: Z = [(X/M)^L − 1] / (L × S) */
export function calcZScore(L: number, M: number, S: number, X: number): number {
  if (L === 0) return Math.log(X / M) / S;
  return (Math.pow(X / M, L) - 1) / (L * S);
}

// ── WHO lookup helpers ───────────────────────────────────────────────────────

type Sex = 'L' | 'P';

/** WHO Weight-for-Age (0–60 months) */
export function whoWFA(ageMonths: number, sex: Sex, weightKg: number): number | null {
  const table = sex === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS;
  const lms = interpolateLMS(table, ageMonths);
  if (!lms) return null;
  return calcZScore(lms.L, lms.M, lms.S, weightKg);
}

/** WHO Length/Height-for-Age (0–60 months) */
export function whoLHFA(ageMonths: number, sex: Sex, heightCm: number): number | null {
  let table: LMSRow[];
  if (sex === 'L') {
    table = ageMonths <= 24 ? WHO_LHFA_BOYS_0_2 : WHO_LHFA_BOYS_2_5;
  } else {
    table = ageMonths <= 24 ? WHO_LHFA_GIRLS_0_2 : WHO_LHFA_GIRLS_2_5;
  }
  const lms = interpolateLMS(table, ageMonths);
  if (!lms) return null;
  return calcZScore(lms.L, lms.M, lms.S, heightCm);
}

/** WHO Weight-for-Length/Height (0–60 months), key = cm */
export function whoWFLH(ageMonths: number, sex: Sex, weightKg: number, heightCm: number): number | null {
  // <2y use length (recumbent), ≥2y use height (standing)
  const useLength = ageMonths < 24;
  let table: LMSRow[];
  if (useLength) {
    table = sex === 'L' ? WHO_WFL_BOYS : WHO_WFL_GIRLS;
  } else {
    table = sex === 'L' ? WHO_WFH_BOYS : WHO_WFH_GIRLS;
  }
  const lms = interpolateLMS(table, heightCm);
  if (!lms) return null;
  return calcZScore(lms.L, lms.M, lms.S, weightKg);
}

/** WHO BMI-for-Age (0–60 months) */
export function whoBMIFA(ageMonths: number, sex: Sex, bmi: number): number | null {
  let table: LMSRow[];
  if (sex === 'L') {
    table = ageMonths <= 24 ? WHO_BMI_BOYS_0_2 : WHO_BMI_BOYS_2_5;
  } else {
    table = ageMonths <= 24 ? WHO_BMI_GIRLS_0_2 : WHO_BMI_GIRLS_2_5;
  }
  const lms = interpolateLMS(table, ageMonths);
  if (!lms) return null;
  return calcZScore(lms.L, lms.M, lms.S, bmi);
}

// ── CDC lookup helpers ───────────────────────────────────────────────────────

/** CDC Weight-for-Age (24–240 months) */
export function cdcWFA(ageMonths: number, sex: Sex, weightKg: number): number | null {
  const table = sex === 'L' ? CDC_WTA_BOYS : CDC_WTA_GIRLS;
  const lms = interpolateLMS(table, ageMonths);
  if (!lms) return null;
  return calcZScore(lms.L, lms.M, lms.S, weightKg);
}

/** CDC Height-for-Age (24–240 months) */
export function cdcHFA(ageMonths: number, sex: Sex, heightCm: number): number | null {
  const table = sex === 'L' ? CDC_HTA_BOYS : CDC_HTA_GIRLS;
  const lms = interpolateLMS(table, ageMonths);
  if (!lms) return null;
  return calcZScore(lms.L, lms.M, lms.S, heightCm);
}

// ── Derived indicators ───────────────────────────────────────────────────────

/**
 * BBI (Berat Badan Ideal) = median weight at patient's age (M from WFA).
 * For ≤5y: WHO; for >5y: CDC.
 */
export function calcBBI(ageMonths: number, sex: Sex): number | null {
  if (ageMonths <= 60) {
    const table = sex === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS;
    const lms = interpolateLMS(table, ageMonths);
    return lms ? Math.round(lms.M * 10) / 10 : null;
  }
  const table = sex === 'L' ? CDC_WTA_BOYS : CDC_WTA_GIRLS;
  const lms = interpolateLMS(table, ageMonths);
  return lms ? Math.round(lms.M * 10) / 10 : null;
}

/**
 * Height Age (HA) = age at which patient's height equals the median.
 * Binary search on LHFA median. Returns months.
 */
export function calcHA(sex: Sex, heightCm: number): number | null {
  // Combine WHO 0–60 + CDC 24–240, search full range
  const whoTable = sex === 'L'
    ? [...WHO_LHFA_BOYS_0_2, ...WHO_LHFA_BOYS_2_5]
    : [...WHO_LHFA_GIRLS_0_2, ...WHO_LHFA_GIRLS_2_5];
  const cdcTable = sex === 'L' ? CDC_HTA_BOYS : CDC_HTA_GIRLS;

  // search WHO 0–60 months
  for (let i = 0; i < whoTable.length - 1; i++) {
    const lo = whoTable[i], hi = whoTable[i + 1];
    if (heightCm >= lo[2] && heightCm <= hi[2]) {
      const t = (heightCm - lo[2]) / (hi[2] - lo[2]);
      return Math.round((lo[0] + t * (hi[0] - lo[0])) * 10) / 10;
    }
  }
  // search CDC 24–240 months
  for (let i = 0; i < cdcTable.length - 1; i++) {
    const lo = cdcTable[i], hi = cdcTable[i + 1];
    if (heightCm >= lo[2] && heightCm <= hi[2]) {
      const t = (heightCm - lo[2]) / (hi[2] - lo[2]);
      return Math.round((lo[0] + t * (hi[0] - lo[0])) * 10) / 10;
    }
  }
  return null;
}

/**
 * Weight Age (WA) = age at which patient's weight equals the median.
 * Binary search on WFA median. Returns months.
 */
export function calcWA(sex: Sex, weightKg: number): number | null {
  const whoTable = sex === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS;
  for (let i = 0; i < whoTable.length - 1; i++) {
    const lo = whoTable[i], hi = whoTable[i + 1];
    if (weightKg >= lo[2] && weightKg <= hi[2]) {
      const t = (weightKg - lo[2]) / (hi[2] - lo[2]);
      return Math.round((lo[0] + t * (hi[0] - lo[0])) * 10) / 10;
    }
  }
  const cdcTable = sex === 'L' ? CDC_WTA_BOYS : CDC_WTA_GIRLS;
  for (let i = 0; i < cdcTable.length - 1; i++) {
    const lo = cdcTable[i], hi = cdcTable[i + 1];
    if (weightKg >= lo[2] && weightKg <= hi[2]) {
      const t = (weightKg - lo[2]) / (hi[2] - lo[2]);
      return Math.round((lo[0] + t * (hi[0] - lo[0])) * 10) / 10;
    }
  }
  return null;
}

// ── Interpretation ───────────────────────────────────────────────────────────

export interface ZInterpretation {
  label: string;
  color: 'red' | 'orange' | 'green' | 'blue';
  severity: 'severe' | 'moderate' | 'normal' | 'overweight' | 'obese';
}

/** WHO Z-score interpretation for WFA/LHFA/WFH */
export function interpretZScore(z: number, indicator: 'wfa' | 'lhfa' | 'wflh' | 'bmi'): ZInterpretation {
  if (indicator === 'wfa') {
    if (z < -3) return { label: 'Berat badan sangat kurang (Severely underweight)', color: 'red', severity: 'severe' };
    if (z < -2) return { label: 'Berat badan kurang (Underweight)', color: 'orange', severity: 'moderate' };
    if (z <= 2) return { label: 'Berat badan normal', color: 'green', severity: 'normal' };
    return { label: 'Risiko berat badan lebih', color: 'blue', severity: 'overweight' };
  }
  if (indicator === 'lhfa') {
    if (z < -3) return { label: 'Sangat pendek (Severely stunted)', color: 'red', severity: 'severe' };
    if (z < -2) return { label: 'Pendek (Stunted)', color: 'orange', severity: 'moderate' };
    if (z <= 3) return { label: 'Tinggi badan normal', color: 'green', severity: 'normal' };
    return { label: 'Tinggi badan di atas normal', color: 'blue', severity: 'overweight' };
  }
  if (indicator === 'wflh' || indicator === 'bmi') {
    if (z < -3) return { label: 'Gizi buruk (Severely wasted)', color: 'red', severity: 'severe' };
    if (z < -2) return { label: 'Gizi kurang (Wasted)', color: 'orange', severity: 'moderate' };
    if (z <= 1) return { label: 'Gizi baik (Normal)', color: 'green', severity: 'normal' };
    if (z <= 2) return { label: 'Berisiko gizi lebih (Possible overweight)', color: 'blue', severity: 'overweight' };
    if (z <= 3) return { label: 'Gizi lebih (Overweight)', color: 'orange', severity: 'overweight' };
    return { label: 'Obesitas (Obese)', color: 'red', severity: 'obese' };
  }
  return { label: 'Normal', color: 'green', severity: 'normal' };
}
