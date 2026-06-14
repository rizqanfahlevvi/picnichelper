// ─────────────────────────────────────────────────────────────────────────
// Fungsi murni kalkulasi dosis obat pediatri.
// Input: DrugRoute + weightKg → output: dosis aktual + volume (bila konsentrasi diketahui)
// ─────────────────────────────────────────────────────────────────────────

import type { DoseRange } from '../data/drugLibrary';

export interface DoseResult {
  /** Dosis minimum (mg atau mcg sesuai unit) */
  minDose: number;
  /** Dosis maksimum (mg atau mcg sesuai unit) */
  maxDose: number;
  /** Unit dosis aktual, mis. 'mg' atau 'mcg' */
  doseUnit: 'mg' | 'mcg' | 'mEq' | 'mL' | 'unit';
  /** Apakah maxDose sudah dicap oleh maxAbsoluteMg */
  isCapped: boolean;
  /** Rumus yang digunakan (untuk ditampilkan di UI) */
  formula: string;
}

export interface VolumeResult extends DoseResult {
  /** Volume minimum (mL) */
  minVolumeMl: number;
  /** Volume maksimum (mL) */
  maxVolumeMl: number;
  /** Konsentrasi yang dipakai (mg/mL atau mcg/mL) */
  concentrationPerMl: number;
}

/**
 * Hitung dosis aktual dari berat pasien dan DoseRange.
 * Semua dosis per kg dikalikan berat, lalu dicap oleh maxAbsoluteMg bila ada.
 */
export function calculateDose(range: DoseRange, weightKg: number): DoseResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error('Dosis: berat badan tidak valid');
  if (!Number.isFinite(range.minPerKg) || range.minPerKg < 0)
    throw new Error('Dosis: minPerKg tidak valid');
  if (!Number.isFinite(range.maxPerKg) || range.maxPerKg < range.minPerKg)
    throw new Error('Dosis: maxPerKg tidak valid');

  const unit = range.unit; // 'mg/kg' | 'mcg/kg' | ...
  const doseUnit = unit.replace('/kg', '') as DoseResult['doseUnit'];

  let minDose = round2(range.minPerKg * weightKg);
  let maxDose = round2(range.maxPerKg * weightKg);
  let isCapped = false;

  if (range.maxAbsoluteMg !== undefined) {
    if (maxDose > range.maxAbsoluteMg) {
      maxDose = range.maxAbsoluteMg;
      isCapped = true;
    }
    if (minDose > range.maxAbsoluteMg) {
      minDose = range.maxAbsoluteMg;
    }
  }

  const formula =
    range.minPerKg === range.maxPerKg
      ? `${range.minPerKg} ${unit} × ${weightKg} kg = ${minDose} ${doseUnit}`
      : `${range.minPerKg}–${range.maxPerKg} ${unit} × ${weightKg} kg = ${minDose}–${maxDose} ${doseUnit}`;

  return { minDose, maxDose, doseUnit, isCapped, formula };
}

/**
 * Hitung volume dari dosis dan konsentrasi larutan yang tersedia.
 * Misal: dosis 5 mg, konsentrasi 10 mg/mL → 0.5 mL
 */
export function calculateVolume(
  range: DoseRange,
  weightKg: number,
  concentrationPerMl: number,
): VolumeResult {
  if (!Number.isFinite(concentrationPerMl) || concentrationPerMl <= 0)
    throw new Error('Volume: konsentrasi tidak valid');

  const dose = calculateDose(range, weightKg);
  const minVolumeMl = round2(dose.minDose / concentrationPerMl);
  const maxVolumeMl = round2(dose.maxDose / concentrationPerMl);

  return { ...dose, minVolumeMl, maxVolumeMl, concentrationPerMl };
}

/**
 * Hitung laju infus syringe pump (mL/jam) dari dosis mcg/kg/mnt.
 * Alias ringan — rumus lengkap ada di syringePump.ts.
 */
export function calcInfusionRate(
  dosePerKgPerMin: number,
  weightKg: number,
  concentrationMcgPerMl: number,
): number {
  if (dosePerKgPerMin <= 0 || weightKg <= 0 || concentrationMcgPerMl <= 0)
    throw new Error('Infus: parameter tidak valid');
  return round2((dosePerKgPerMin * weightKg * 60) / concentrationMcgPerMl);
}

/**
 * Format dosis untuk tampilan UI.
 * Contoh: 5.0 mg → "5 mg"; 0.25 mg → "0.25 mg"
 */
export function formatDose(value: number, unit: string): string {
  const str = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2).replace(/\.?0+$/, '');
  return `${str} ${unit}`;
}

/**
 * Tentukan apakah dosis range single (min === max) atau range.
 */
export function isSingleDose(range: DoseRange): boolean {
  return range.minPerKg === range.maxPerKg;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
