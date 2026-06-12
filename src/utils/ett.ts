// ─────────────────────────────────────────────────────────────────────────
// Rumus ukuran Endotracheal Tube (ETT) — FUNGSI MURNI. Tanpa kode React.
// Input number → output number. Tanpa efek samping. (CLAUDE.md: Clean Arch.)
//
// Sumber (lihat src/data/references.ts):
//   [1] AHA PALS 2020 — memilih cuffed atas uncuffed pada bayi & anak.
//   [2] Cole 1957     — uncuffed ID (mm) = usia/4 + 4.
//   [3] Duracher 2008 — cuffed   ID (mm) = usia/4 + 3.5.
//   [4] NRP 8th ed.   — tabel neonatus <1 th (berbasis berat). PERLU KONFIRMASI.
//
// CATATAN KESELAMATAN: rumus age-based usia/4 hanya valid untuk usia ≥ 1 th.
// Untuk bayi < 1 th gunakan ettSizeNeonate() (tabel berat), bukan rumus usia.
// ─────────────────────────────────────────────────────────────────────────

/** Batas usia rasional untuk rumus age-based (tahun). */
export const ETT_AGE_MIN_YEARS = 1;
export const ETT_AGE_MAX_YEARS = 12;

export interface EttSizeResult {
  /** ID (mm) tube cuffed — Duracher [3] */
  cuffed: number;
  /** ID (mm) tube uncuffed — Cole [2] */
  uncuffed: number;
}

/**
 * Ukuran ETT (internal diameter, mm) untuk anak ≥ 1 tahun berbasis usia.
 * cuffed   = usia/4 + 3.5  [3]
 * uncuffed = usia/4 + 4    [2]
 * Hasil dibulatkan ke 0.5 mm terdekat (kelipatan tube yang tersedia).
 *
 * @param ageYears usia dalam tahun (number, sudah dikonversi eksplisit)
 */
export function ettSizeByAge(ageYears: number): EttSizeResult {
  if (!Number.isFinite(ageYears)) {
    throw new Error('ettSizeByAge: ageYears harus berupa number yang valid');
  }
  return {
    cuffed: roundToHalf(ageYears / 4 + 3.5),
    uncuffed: roundToHalf(ageYears / 4 + 4),
  };
}

/** Pembulatan ke kelipatan 0.5 terdekat. */
export function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

// ─── Neonatus / bayi < 1 tahun (tabel berbasis berat) ──────────────────────
// SUMBER: NRP 8th ed. [4] — nilai di bawah MENGIKUTI tabel NRP standar namun
// MASIH MENUNGGU KONFIRMASI pengarah klinis terhadap edisi yang dipakai.
// Jangan anggap final sampai REFERENCES.nrp8.verified === true.

export interface NeonateEttRow {
  /** Batas bawah berat (gram), inklusif */
  minWeightG: number;
  /** Batas atas berat (gram), eksklusif; null = tak terbatas */
  maxWeightG: number | null;
  /** ID (mm) tube uncuffed yang disarankan */
  sizeMm: number;
  /** Deskripsi usia gestasi pendamping */
  gestation: string;
}

// TODO: konfirmasi sumber — verifikasi tiap baris terhadap NRP 8th ed. [4].
export const NEONATE_ETT_TABLE: readonly NeonateEttRow[] = [
  { minWeightG: 0,    maxWeightG: 1000, sizeMm: 2.5, gestation: '< 28 minggu' },
  { minWeightG: 1000, maxWeightG: 2000, sizeMm: 3.0, gestation: '28–34 minggu' },
  { minWeightG: 2000, maxWeightG: 3000, sizeMm: 3.5, gestation: '34–38 minggu' },
  { minWeightG: 3000, maxWeightG: null, sizeMm: 3.5, gestation: '> 38 minggu' },
];

/**
 * Ukuran ETT neonatus berbasis berat (gram). Mengembalikan baris tabel NRP
 * yang cocok, atau null bila berat tidak masuk akal.
 * @param weightGrams berat lahir/aktual dalam gram (number)
 */
export function ettSizeNeonate(weightGrams: number): NeonateEttRow | null {
  if (!Number.isFinite(weightGrams) || weightGrams <= 0) return null;
  return (
    NEONATE_ETT_TABLE.find(
      (row) =>
        weightGrams >= row.minWeightG &&
        (row.maxWeightG === null || weightGrams < row.maxWeightG),
    ) ?? null
  );
}
