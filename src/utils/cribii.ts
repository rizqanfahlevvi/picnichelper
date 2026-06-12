// ─────────────────────────────────────────────────────────────────────────
// CRIB-II — Clinical Risk Index for Babies II [9]
// The CRIB-II Score: an update of the CRIB score.
// Parry G, et al. Lancet. 2003;361(9371):1789-1791.
// Digunakan pada neonatus prematur ≤ 32 minggu dan/atau BBLR.
// ─────────────────────────────────────────────────────────────────────────

export type CribIISex = 'male' | 'female';

export interface CribIIInput {
  gestationalAgeWeeks: number; // minggu gestasi
  birthWeightGrams: number;    // berat lahir gram
  sex: CribIISex;
  admissionTemperatureC: number; // suhu rektal/aksila masuk
  baseExcess: number;          // mmol/L (dari gas darah)
}

export interface CribIIResult {
  total: number;
  subscores: { label: string; score: number }[];
  /** Estimasi mortalitas (tabel Parry 2003) */
  estimatedMortalityPercent: number;
  riskCategory: 'rendah' | 'sedang' | 'tinggi' | 'sangat tinggi';
}

// ── Scoring per variabel ─────────────────────────────────────────────────

function scoreGestationalAge(ga: number): number {
  if (ga <= 24)  return 7;
  if (ga <= 25)  return 6;
  if (ga <= 26)  return 5;
  if (ga <= 27)  return 4;
  if (ga <= 28)  return 3;
  if (ga <= 29)  return 2;
  if (ga <= 30)  return 1;
  return 0; // ≥31 minggu
}

function scoreBirthWeight(weightG: number, sex: CribIISex): number {
  // Skor berdasarkan berat (berbeda untuk male/female per Parry 2003)
  if (sex === 'male') {
    if (weightG < 650)  return 6;
    if (weightG < 800)  return 5;
    if (weightG < 950)  return 4;
    if (weightG < 1100) return 3;
    if (weightG < 1300) return 2;
    if (weightG < 1500) return 1;
    return 0;
  } else {
    if (weightG < 650)  return 6;
    if (weightG < 800)  return 5;
    if (weightG < 950)  return 4;
    if (weightG < 1100) return 3;
    if (weightG < 1250) return 2;
    if (weightG < 1450) return 1;
    return 0;
  }
}

function scoreTemperature(tempC: number): number {
  if (tempC < 35.0) return 3;
  if (tempC < 35.5) return 2;
  if (tempC < 36.0) return 1;
  return 0;
}

function scoreBaseExcess(be: number): number {
  if (be < -10) return 4;
  if (be < -7)  return 3;
  if (be < -4)  return 2;
  if (be < -2)  return 1;
  return 0;
}

function estimateMortality(total: number): number {
  // Estimasi kasar dari tabel Parry 2003
  if (total <= 5)  return 0.4;
  if (total <= 8)  return 1.5;
  if (total <= 11) return 5.0;
  if (total <= 14) return 14.0;
  if (total <= 17) return 35.0;
  return 55.0;
}

function riskCategory(total: number): CribIIResult['riskCategory'] {
  if (total <= 5)  return 'rendah';
  if (total <= 11) return 'sedang';
  if (total <= 15) return 'tinggi';
  return 'sangat tinggi';
}

// ── Fungsi utama ──────────────────────────────────────────────────────────
export function calculateCribII(input: CribIIInput): CribIIResult {
  const { gestationalAgeWeeks, birthWeightGrams, sex, admissionTemperatureC, baseExcess } = input;

  if (gestationalAgeWeeks < 22 || gestationalAgeWeeks > 32)
    throw new Error('CRIB-II: usia gestasi harus 22–32 minggu');
  if (birthWeightGrams <= 0 || birthWeightGrams > 3000)
    throw new Error('CRIB-II: berat lahir tidak valid (0–3000 g)');
  if (admissionTemperatureC < 30 || admissionTemperatureC > 42)
    throw new Error('CRIB-II: suhu tidak valid');
  if (!Number.isFinite(baseExcess))
    throw new Error('CRIB-II: base excess tidak valid');

  const gaScore    = scoreGestationalAge(gestationalAgeWeeks);
  const wtScore    = scoreBirthWeight(birthWeightGrams, sex);
  const tempScore  = scoreTemperature(admissionTemperatureC);
  const beScore    = scoreBaseExcess(baseExcess);
  const sexScore   = sex === 'male' ? 1 : 0;

  const subscores = [
    { label: `Usia gestasi ${gestationalAgeWeeks} minggu`,          score: gaScore },
    { label: `Berat lahir ${birthWeightGrams} g (${sex === 'male' ? 'laki-laki' : 'perempuan'})`, score: wtScore },
    { label: `Suhu masuk ${admissionTemperatureC}°C`,               score: tempScore },
    { label: `Base excess ${baseExcess} mmol/L`,                    score: beScore },
    { label: `Jenis kelamin ${sex === 'male' ? 'laki-laki' : 'perempuan'}`, score: sexScore },
  ];

  const total = gaScore + wtScore + tempScore + beScore + sexScore;

  return {
    total,
    subscores,
    estimatedMortalityPercent: estimateMortality(total),
    riskCategory: riskCategory(total),
  };
}
