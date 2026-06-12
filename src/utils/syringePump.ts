// ─────────────────────────────────────────────────────────────────────────
// Kalkulator syringe pump / infus kontinu — fungsi murni.
//
// Rumus (dikonfirmasi pengarah klinis):
//   kecepatan (mL/jam) = dosis (mcg/kg/mnt) × BB (kg) × 60 / konsentrasi (mcg/mL)
//
// Untuk obat dengan unit mcg/kg/jam:
//   kecepatan (mL/jam) = dosis (mcg/kg/jam) × BB (kg) / konsentrasi (mcg/mL)
// ─────────────────────────────────────────────────────────────────────────

export type DoseTimeUnit = 'per_minute' | 'per_hour';

export interface SyringePumpInput {
  /** Dosis dalam mcg/kg/mnt atau mcg/kg/jam */
  dosePerKgPerTime: number;
  timeUnit: DoseTimeUnit;
  /** Berat pasien dalam kg */
  weightKg: number;
  /** Konsentrasi larutan dalam mcg/mL */
  concentrationMcgPerMl: number;
}

export interface SyringePumpResult {
  /** Kecepatan infus dalam mL/jam */
  ratePerHour: number;
  /** Total dosis absolut (mcg/mnt atau mcg/jam) */
  absoluteDosePerTime: number;
  timeUnit: DoseTimeUnit;
}

/**
 * Hitung kecepatan infus syringe pump.
 */
export function calculateSyringePumpRate(input: SyringePumpInput): SyringePumpResult {
  const { dosePerKgPerTime, timeUnit, weightKg, concentrationMcgPerMl } = input;

  if (!Number.isFinite(dosePerKgPerTime) || dosePerKgPerTime <= 0)
    throw new Error('syringePump: dosis tidak valid');
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error('syringePump: berat tidak valid');
  if (!Number.isFinite(concentrationMcgPerMl) || concentrationMcgPerMl <= 0)
    throw new Error('syringePump: konsentrasi tidak valid');

  const absoluteDosePerTime = dosePerKgPerTime * weightKg;

  // Konversi ke mL/jam
  const ratePerHour =
    timeUnit === 'per_minute'
      ? (absoluteDosePerTime * 60) / concentrationMcgPerMl
      : absoluteDosePerTime / concentrationMcgPerMl;

  return { ratePerHour, absoluteDosePerTime, timeUnit };
}

// ── Panduan dosis referensi (untuk tampil di UI sebagai hints) ────────────
export interface DrugReferenceRange {
  name: string;
  unit: DoseTimeUnit;
  minDose: number;
  maxDose: number;
  commonConcentrations: number[]; // mcg/mL
}

export const SYRINGE_PUMP_DRUGS: DrugReferenceRange[] = [
  { name: 'Dopamin',      unit: 'per_minute', minDose: 2,    maxDose: 20,   commonConcentrations: [1600, 3200] },
  { name: 'Dobutamin',    unit: 'per_minute', minDose: 2,    maxDose: 20,   commonConcentrations: [1000, 2000] },
  { name: 'Epinefrin',    unit: 'per_minute', minDose: 0.01, maxDose: 1,    commonConcentrations: [20, 40]     },
  { name: 'Norepinefrin', unit: 'per_minute', minDose: 0.01, maxDose: 2,    commonConcentrations: [20, 40]     },
  { name: 'Milrinon',     unit: 'per_minute', minDose: 0.25, maxDose: 0.75, commonConcentrations: [200]        },
  { name: 'Morfin',       unit: 'per_hour',   minDose: 10,   maxDose: 40,   commonConcentrations: [1000]       },
  { name: 'Fentanil',     unit: 'per_hour',   minDose: 1,    maxDose: 5,    commonConcentrations: [10, 20]     },
  { name: 'Midazolam',    unit: 'per_hour',   minDose: 1,    maxDose: 5,    commonConcentrations: [500, 1000]  },
];
