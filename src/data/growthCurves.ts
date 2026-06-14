// Compute SD-line values from LMS for growth curve rendering
// Formula: X_at_Z = M * (1 + L*S*Z)^(1/L), or exp(Z*S) when L=0

import {
  WHO_WFA_BOYS, WHO_WFA_GIRLS,
  WHO_LHFA_BOYS_0_2, WHO_LHFA_BOYS_2_5,
  WHO_LHFA_GIRLS_0_2, WHO_LHFA_GIRLS_2_5,
  WHO_WFL_BOYS, WHO_WFL_GIRLS,
  WHO_WFH_BOYS, WHO_WFH_GIRLS,
  WHO_BMI_BOYS_0_2, WHO_BMI_BOYS_2_5,
  WHO_BMI_GIRLS_0_2, WHO_BMI_GIRLS_2_5,
  CDC_WTA_BOYS, CDC_WTA_GIRLS,
  CDC_HTA_BOYS, CDC_HTA_GIRLS,
  type LMSRow,
} from './growthData';

export interface CurvePoint {
  key: number;   // age in months OR length/height in cm
  sd3n: number;  // -3 SD
  sd2n: number;  // -2 SD
  sd1n: number;  // -1 SD
  sd0:  number;  // median
  sd1:  number;  // +1 SD
  sd2:  number;  // +2 SD
  sd3:  number;  // +3 SD
}

function xAtZ(L: number, M: number, S: number, z: number): number {
  if (L === 0) return M * Math.exp(S * z);
  const val = M * Math.pow(1 + L * S * z, 1 / L);
  return Math.round(val * 100) / 100;
}

function buildCurve(table: LMSRow[]): CurvePoint[] {
  return table.map(([key, L, M, S]) => ({
    key,
    sd3n: xAtZ(L, M, S, -3),
    sd2n: xAtZ(L, M, S, -2),
    sd1n: xAtZ(L, M, S, -1),
    sd0:  xAtZ(L, M, S,  0),
    sd1:  xAtZ(L, M, S,  1),
    sd2:  xAtZ(L, M, S,  2),
    sd3:  xAtZ(L, M, S,  3),
  }));
}

// Merge two lhfa tables (0-2 and 2-5), de-dup month 24
function mergeLHFA(t0: LMSRow[], t1: LMSRow[]): LMSRow[] {
  return [...t0, ...t1.filter(r => r[0] > t0[t0.length - 1][0])];
}

type Sex = 'L' | 'P';

// ── WHO 0–60 months ──────────────────────────────────────────────────────────

export function getWHO_WFA_Curve(sex: Sex): CurvePoint[] {
  return buildCurve(sex === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS);
}

export function getWHO_LHFA_Curve(sex: Sex): CurvePoint[] {
  const boys = mergeLHFA(WHO_LHFA_BOYS_0_2, WHO_LHFA_BOYS_2_5);
  const girls = mergeLHFA(WHO_LHFA_GIRLS_0_2, WHO_LHFA_GIRLS_2_5);
  return buildCurve(sex === 'L' ? boys : girls);
}

export function getWHO_WFH_Curve(sex: Sex, useLength: boolean): CurvePoint[] {
  if (useLength) return buildCurve(sex === 'L' ? WHO_WFL_BOYS : WHO_WFL_GIRLS);
  return buildCurve(sex === 'L' ? WHO_WFH_BOYS : WHO_WFH_GIRLS);
}

// ── CDC 24–240 months ─────────────────────────────────────────────────────────

export function getCDC_WFA_Curve(sex: Sex): CurvePoint[] {
  return buildCurve(sex === 'L' ? CDC_WTA_BOYS : CDC_WTA_GIRLS);
}

export function getCDC_HFA_Curve(sex: Sex): CurvePoint[] {
  return buildCurve(sex === 'L' ? CDC_HTA_BOYS : CDC_HTA_GIRLS);
}

/** WHO BMI-for-Age (0–60 months, merged) */
export function getWHO_BMIIA_Curve(sex: Sex): CurvePoint[] {
  const boys = mergeLHFA(WHO_BMI_BOYS_0_2, WHO_BMI_BOYS_2_5);
  const girls = mergeLHFA(WHO_BMI_GIRLS_0_2, WHO_BMI_GIRLS_2_5);
  return buildCurve(sex === 'L' ? boys : girls);
}
