// ─────────────────────────────────────────────────────────────────────────
// Kalkulasi cairan pediatri — resusitasi, maintenance, defisit [10][11]
// [10] Holliday MA, Segar WE. Pediatrics. 1957;19(5):823-832.
// [11] PALS 2020: resusitasi cairan 10-20 mL/kg bolus.
// ─────────────────────────────────────────────────────────────────────────

export interface MaintenanceResult {
  mlPerHour: number;
  mlPer24Hours: number;
  /** Rincian perhitungan Holliday-Segar */
  breakdown: string;
}

/**
 * Maintenance fluid — Holliday-Segar (4-2-1 rule) [10]
 * ≤10 kg : 4 mL/kg/jam
 * 10–20 kg: 40 + 2 mL/kg/jam tiap kg di atas 10
 * >20 kg : 60 + 1 mL/kg/jam tiap kg di atas 20
 */
export function calculateMaintenance(weightKg: number): MaintenanceResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error('Cairan: berat tidak valid');
  if (weightKg > 100)
    throw new Error('Cairan: berat > 100 kg, gunakan perhitungan dewasa');

  let mlPerHour: number;
  let breakdown: string;

  if (weightKg <= 10) {
    mlPerHour = 4 * weightKg;
    breakdown = `4 × ${weightKg} = ${mlPerHour} mL/jam`;
  } else if (weightKg <= 20) {
    mlPerHour = 40 + 2 * (weightKg - 10);
    breakdown = `40 + 2 × ${(weightKg - 10).toFixed(1)} = ${mlPerHour} mL/jam`;
  } else {
    mlPerHour = 60 + 1 * (weightKg - 20);
    breakdown = `60 + 1 × ${(weightKg - 20).toFixed(1)} = ${mlPerHour} mL/jam`;
  }

  return { mlPerHour, mlPer24Hours: mlPerHour * 24, breakdown };
}

export interface ResuscitationResult {
  bolusMl: number;
  /** Volume total bila diberikan 2 kali bolus */
  twoBolusMl: number;
  note: string;
}

/**
 * Bolus resusitasi cairan — PALS 2020 [11]
 * Standar: 10–20 mL/kg isotonis (NS atau RL) dalam 5–20 menit
 */
export function calculateResuscitationBolus(
  weightKg: number,
  mlPerKg: 10 | 20 = 20,
): ResuscitationResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error('Cairan: berat tidak valid');

  const bolusMl = mlPerKg * weightKg;
  return {
    bolusMl,
    twoBolusMl: bolusMl * 2,
    note: `${mlPerKg} mL/kg × ${weightKg} kg = ${bolusMl} mL. Berikan dalam 5–20 menit IV/IO.`,
  };
}

// ── Koreksi dehidrasi ─────────────────────────────────────────────────────
export type DehydrationDegree = 'ringan' | 'sedang' | 'berat';

export interface DehydrationResult {
  degree: DehydrationDegree;
  deficitMl: number;
  /** Rencana koreksi 24 jam: defisit + maintenance */
  phase1Ml: number;    // 8 jam pertama
  phase2Ml: number;    // 16 jam berikutnya
  totalMl: number;     // defisit + maintenance 24 jam
}

const DEFICIT_PERCENT: Record<DehydrationDegree, number> = {
  ringan: 0.05,   // 5%
  sedang: 0.10,   // 10%
  berat:  0.15,   // 15%
};

/**
 * Koreksi defisit dehidrasi — WHO/AAP guideline
 * Fase 1 (8 jam): ½ defisit + ½ maintenance
 * Fase 2 (16 jam): ½ defisit + ½ maintenance
 */
export function calculateDehydrationCorrection(
  weightKg: number,
  degree: DehydrationDegree,
): DehydrationResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error('Dehidrasi: berat tidak valid');

  const deficitMl = DEFICIT_PERCENT[degree] * weightKg * 1000;
  const { mlPer24Hours } = calculateMaintenance(weightKg);

  // Fase 1 (8 jam): ½ defisit + ⅓ maintenance
  const phase1Ml = deficitMl / 2 + mlPer24Hours / 3;
  // Fase 2 (16 jam): ½ defisit + ⅔ maintenance
  const phase2Ml = deficitMl / 2 + (mlPer24Hours * 2) / 3;

  return {
    degree,
    deficitMl: Math.round(deficitMl),
    phase1Ml: Math.round(phase1Ml),
    phase2Ml: Math.round(phase2Ml),
    totalMl: Math.round(deficitMl + mlPer24Hours),
  };
}
