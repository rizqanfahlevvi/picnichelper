// ─────────────────────────────────────────────────────────────────────────
// Kedalaman insersi ETT (cm di bibir) — fungsi murni.
//
// Tiga metode sesuai konfirmasi pengarah klinis:
//   [A] usia/2 + 12  → anak > 2 tahun [1]
//   [B] ID × 3       → semua usia, berbasis ukuran tube [1]
//   [C] berat + 6    → neonatus, berat dalam kg [4]
//
// Sumber: [1] AHA PALS 2020  [4] NRP 8th ed.
// ─────────────────────────────────────────────────────────────────────────

export const ETT_DEPTH_AGE_MIN_YEARS = 2;

export interface EttDepthResult {
  byAge: number | null;    // usia/2 + 12, null jika usia < 2 th
  byTubeId: number;        // ID × 3
  byWeight: number | null; // berat(kg) + 6, null jika berat tidak diberikan
}

/**
 * Kedalaman ETT berdasarkan usia (cm di bibir).
 * Rumus: usia/2 + 12. Valid untuk usia ≥ 2 tahun. [1]
 */
export function ettDepthByAge(ageYears: number): number {
  if (!Number.isFinite(ageYears)) throw new Error('ettDepthByAge: ageYears tidak valid');
  return ageYears / 2 + 12;
}

/**
 * Kedalaman ETT berdasarkan ukuran tube (ID × 3). [1]
 * Berlaku untuk semua usia.
 */
export function ettDepthByTubeId(idMm: number): number {
  if (!Number.isFinite(idMm) || idMm <= 0) throw new Error('ettDepthByTubeId: idMm tidak valid');
  return idMm * 3;
}

/**
 * Kedalaman ETT neonatus berdasarkan berat (berat_kg + 6 cm di bibir). [4]
 */
export function ettDepthByWeight(weightKg: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) throw new Error('ettDepthByWeight: weightKg tidak valid');
  return weightKg + 6;
}
