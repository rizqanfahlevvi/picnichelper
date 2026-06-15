// RSBI = Rapid Shallow Breathing Index
// Referensi: Yang KL, Tobin MJ. NEJM 1991;324(21):1445–1450. [46]
// pRSBI (pediatric) = f / TV(mL/kg) — untuk konteks pediatri

export interface RSBIResult {
  rsbi: number;        // f / TV(L)
  prsbi: number;       // f / TV(mL/kg)
  interpretation: {
    label: string;
    color: string;     // CSS color token
    detail: string;
  };
}

/**
 * Hitung RSBI dan pRSBI.
 * @param f   - frekuensi napas spontan (napas/menit)
 * @param tvMl - volume tidal (mL)
 * @param weightKg - berat badan (kg), untuk pRSBI
 */
export function calcRSBI(f: number, tvMl: number, weightKg: number): RSBIResult {
  const tvL = tvMl / 1000;
  const rsbi = tvL > 0 ? f / tvL : Infinity;
  const tvMlKg = weightKg > 0 ? tvMl / weightKg : 0;
  const prsbi = tvMlKg > 0 ? f / tvMlKg : Infinity;

  return {
    rsbi: Math.round(rsbi * 10) / 10,
    prsbi: Math.round(prsbi * 10) / 10,
    interpretation: interpretRSBI(rsbi),
  };
}

function interpretRSBI(rsbi: number): RSBIResult['interpretation'] {
  if (rsbi < 80) {
    return {
      label: 'Sangat baik — kemungkinan sukses weaning tinggi',
      color: 'var(--sys-green)',
      detail: 'RSBI < 80: prediksi keberhasilan ekstubasi sangat baik [46]',
    };
  }
  if (rsbi <= 105) {
    return {
      label: 'Borderline — pertimbangkan SBT lebih lanjut',
      color: 'var(--sys-yellow)',
      detail: 'RSBI ≤ 105: zona kritis, cut-off klasik Yang & Tobin 1991 [46]',
    };
  }
  return {
    label: 'Tinggi — weaning kemungkinan gagal',
    color: 'var(--sys-red)',
    detail: 'RSBI > 105: prediksi kegagalan weaning; pertahankan bantuan ventilator [46]',
  };
}
