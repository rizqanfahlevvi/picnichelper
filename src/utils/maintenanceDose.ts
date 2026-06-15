// Kalkulasi kecepatan infus obat maintenance trias anestesi
// Referensi: BNFc 2023 [41]

import type { TriasDrug } from '../data/triasDrugs';

export interface MaintenanceRate {
  mlPerHrMin: number;
  mlPerHrMax: number;
}

/**
 * Hitung kecepatan infus dalam mL/jam berdasarkan dosis maintenance dan berat.
 * Mengkonversi mcg/kg/jam atau mcg/kg/mnt ke mL/jam.
 */
export function calcMaintenanceRate(drug: TriasDrug, weightKg: number): MaintenanceRate | null {
  if (!drug.maintenanceDose || weightKg <= 0) return null;

  const md = drug.maintenanceDose;
  const isMcg  = md.unit === 'mcg/kg/jam' || md.unit === 'mcg/kg/mnt';
  const perMin = md.unit === 'mcg/kg/mnt';

  function toMlHr(dose: number): number {
    const dosePerHour = perMin ? dose * 60 : dose;
    const doseMgHr    = isMcg ? (dosePerHour * weightKg) / 1000 : dosePerHour * weightKg;
    return doseMgHr / drug.concentration;
  }

  return {
    mlPerHrMin: toMlHr(md.min),
    mlPerHrMax: toMlHr(md.max),
  };
}
