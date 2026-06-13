// ─────────────────────────────────────────────────────────────────────────
// Interpretasi elektrolit & rumus koreksi pediatri
// Sumber:
//   Greenbaum LA. Nelson Textbook of Pediatrics, 21st ed. 2020. ch 68.
//   Feld LG et al. Pediatrics. 2018;142(6):e20183083. (hiponatremia)
//   Topjian AA et al. (PALS 2020) — manajemen akut K & Ca
// ─────────────────────────────────────────────────────────────────────────

export type ElectStatus   = 'hypo' | 'normal' | 'hyper';
export type ElectSeverity = 'normal' | 'mild' | 'moderate' | 'severe';

export interface ElectClass {
  status:   ElectStatus;
  severity: ElectSeverity;
}

// ── Sodium ────────────────────────────────────────────────────────────────
// Normal: 135–145 mEq/L
export function classifyNa(na: number): ElectClass {
  if (na >= 135 && na <= 145) return { status: 'normal', severity: 'normal' };
  if (na < 135) {
    if (na >= 130) return { status: 'hypo', severity: 'mild' };
    if (na >= 125) return { status: 'hypo', severity: 'moderate' };
    return { status: 'hypo', severity: 'severe' };
  }
  if (na <= 150) return { status: 'hyper', severity: 'mild' };
  if (na <= 160) return { status: 'hyper', severity: 'moderate' };
  return { status: 'hyper', severity: 'severe' };
}

/**
 * Volume 3% NaCl (mL) untuk menaikkan Na sebesar targetRise mEq/L.
 * 3% NaCl = 0.514 mEq/mL.
 * TBW anak = BB × 0.6.
 * Rumus: Vol = ΔNa × TBW / 0.514
 */
export function calc3pctNaClVol(weightKg: number, targetRiseMeqL: number): number {
  const tbw = weightKg * 0.6;
  return Math.round((targetRiseMeqL * tbw / 0.514) * 10) / 10;
}

/**
 * Defisit air bebas (L) pada hipernatremia.
 * FWD = TBW × (Na_aktual / 145 − 1)
 * Target koreksi maks 0.5 mEq/L/jam atau 10–12 mEq/L/24 jam.
 */
export function calcFreeWaterDeficit(weightKg: number, na: number): number {
  const tbw = weightKg * 0.6;
  return Math.round(tbw * (na / 145 - 1) * 100) / 100;
}

// ── Potassium ─────────────────────────────────────────────────────────────
// Normal: 3.5–5.5 mEq/L
export function classifyK(k: number): ElectClass {
  if (k >= 3.5 && k <= 5.5) return { status: 'normal', severity: 'normal' };
  if (k < 3.5) {
    if (k >= 3.0) return { status: 'hypo', severity: 'mild' };
    if (k >= 2.5) return { status: 'hypo', severity: 'moderate' };
    return { status: 'hypo', severity: 'severe' };
  }
  if (k <= 6.0) return { status: 'hyper', severity: 'mild' };
  if (k <= 6.5) return { status: 'hyper', severity: 'moderate' };
  return { status: 'hyper', severity: 'severe' };
}

/**
 * Dosis KCl IV: 0.2–0.5 mEq/kg per dosis.
 * Kecepatan maksimal: 0.3 mEq/kg/jam (perifer), 0.5 mEq/kg/jam (sentral dengan monitor).
 */
export function calcKDose(weightKg: number): { lowMeq: number; highMeq: number } {
  return {
    lowMeq:  Math.round(0.2 * weightKg * 10) / 10,
    highMeq: Math.round(0.5 * weightKg * 10) / 10,
  };
}

// ── Calcium (total serum) ─────────────────────────────────────────────────
// Normal total Ca: 8.5–10.5 mg/dL (anak > 1 bulan)
// Catatan: neonatus ≤ 7 hari memiliki batas bawah lebih rendah (~7.0 mg/dL)
export function classifyCaTotal(ca: number): ElectClass {
  if (ca >= 8.5 && ca <= 10.5) return { status: 'normal', severity: 'normal' };
  if (ca < 8.5) {
    if (ca >= 7.5) return { status: 'hypo', severity: 'mild' };
    if (ca >= 7.0) return { status: 'hypo', severity: 'moderate' };
    return { status: 'hypo', severity: 'severe' };
  }
  if (ca <= 12.0) return { status: 'hyper', severity: 'mild' };
  if (ca <= 14.0) return { status: 'hyper', severity: 'moderate' };
  return { status: 'hyper', severity: 'severe' };
}

// Normal ionized Ca (iCa): 1.12–1.32 mmol/L
export function classifyCaIonized(ica: number): ElectClass {
  if (ica >= 1.12 && ica <= 1.32) return { status: 'normal', severity: 'normal' };
  if (ica < 1.12) {
    if (ica >= 0.9)  return { status: 'hypo', severity: 'mild' };
    if (ica >= 0.75) return { status: 'hypo', severity: 'moderate' };
    return { status: 'hypo', severity: 'severe' };
  }
  if (ica <= 1.5)  return { status: 'hyper', severity: 'mild' };
  if (ica <= 1.75) return { status: 'hyper', severity: 'moderate' };
  return { status: 'hyper', severity: 'severe' };
}

/**
 * Kalsium glukonat 10% IV untuk hipokalsemia simtomatik.
 * Dosis: 0.5–1 mL/kg (maks 20 mL) infus lambat ≥ 10 menit.
 * CaGluc 10% = 93 mg Ca-elemen / 10 mL = 9.3 mg/mL.
 */
export function calcCaGluconateVol(weightKg: number): { lowMl: number; highMl: number } {
  const low  = Math.min(Math.round(0.5 * weightKg * 10) / 10, 20);
  const high = Math.min(Math.round(1.0 * weightKg * 10) / 10, 20);
  return { lowMl: low, highMl: high };
}

/**
 * Koreksi Ca terhadap albumin (bila albumin rendah):
 * Ca_terkoreksi = Ca_terukur + 0.8 × (4 − albumin g/dL)
 */
export function correctCaForAlbumin(ca: number, albumin: number): number {
  return Math.round((ca + 0.8 * (4 - albumin)) * 10) / 10;
}

// ── Magnesium ─────────────────────────────────────────────────────────────
// Normal: 1.7–2.4 mg/dL (0.70–0.99 mmol/L)
export function classifyMg(mg: number): ElectClass {
  if (mg >= 1.7 && mg <= 2.4) return { status: 'normal', severity: 'normal' };
  if (mg < 1.7) {
    if (mg >= 1.2) return { status: 'hypo', severity: 'mild' };
    if (mg >= 0.8) return { status: 'hypo', severity: 'moderate' };
    return { status: 'hypo', severity: 'severe' };
  }
  if (mg <= 4.0) return { status: 'hyper', severity: 'mild' };
  if (mg <= 7.0) return { status: 'hyper', severity: 'moderate' };
  return { status: 'hyper', severity: 'severe' };
}

/**
 * MgSO4 50% IV untuk hipomagnesemia: 25–50 mg/kg (maks 2000 mg = 4 mL).
 * MgSO4 50% = 500 mg/mL.
 */
export function calcMgSO4Vol(weightKg: number): { lowMl: number; highMl: number; lowMg: number; highMg: number } {
  const lowMg  = Math.min(25 * weightKg, 2000);
  const highMg = Math.min(50 * weightKg, 2000);
  return {
    lowMg:  Math.round(lowMg),
    highMg: Math.round(highMg),
    lowMl:  Math.round((lowMg  / 500) * 10) / 10,
    highMl: Math.round((highMg / 500) * 10) / 10,
  };
}

// ── Helper: severity color ────────────────────────────────────────────────
export function severityColor(s: ElectSeverity, _status: ElectStatus): string {
  if (s === 'normal') return 'var(--sys-green)';
  if (s === 'mild')   return 'var(--sys-yellow)';
  if (s === 'moderate') return 'var(--sys-orange)';
  return 'var(--sys-red)';
}

export const SEVERITY_LABEL: Record<ElectSeverity, string> = {
  normal: 'Normal',
  mild: 'Ringan',
  moderate: 'Sedang',
  severe: 'Berat',
};

export const STATUS_LABEL: Record<ElectStatus, string> = {
  hypo: 'Hipo',
  normal: 'Normal',
  hyper: 'Hiper',
};
