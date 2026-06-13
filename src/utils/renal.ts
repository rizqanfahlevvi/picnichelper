// ─────────────────────────────────────────────────────────────────────────
// Kalkulator renal pediatri
// Sumber:
//   Schwartz GJ et al. J Am Soc Nephrol. 2009;20(3):629–637.
//     (Bedside Schwartz: eGFR = 0.413 × tinggi_cm / Cr_mg/dL)
//   KDIGO 2012: Kidney Int Suppl. 2013;3(1):1–150.
//     (Staging CKD berdasarkan eGFR)
// ─────────────────────────────────────────────────────────────────────────

export type CkdStage = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

export interface GfrResult {
  egfr: number;           // mL/min/1.73m²
  stage: CkdStage;
  stageLabel: string;
  color: string;
}

/**
 * Bedside Schwartz 2009 (menggunakan kreatinin IDMS-calibrated):
 * eGFR (mL/min/1.73m²) = 0.413 × tinggi (cm) / kreatinin serum (mg/dL)
 *
 * Catatan: k = 0.413 berlaku untuk semua anak jika kreatinin menggunakan
 * metode enzimatik/IDMS-traceable. Bila masih menggunakan Jaffe method lama,
 * hasil kreatinin lebih tinggi ± 20%.
 */
export function calculateSchwartzEgfr(heightCm: number, creatinineMgDl: number): GfrResult {
  if (!Number.isFinite(heightCm) || heightCm <= 0)
    throw new Error('Renal: tinggi badan tidak valid');
  if (!Number.isFinite(creatinineMgDl) || creatinineMgDl <= 0)
    throw new Error('Renal: kreatinin tidak valid');

  const egfr = Math.round((0.413 * heightCm / creatinineMgDl) * 10) / 10;
  const stage = classifyCkd(egfr);
  return { egfr, stage, stageLabel: CKD_LABELS[stage], color: CKD_COLOR[stage] };
}

function classifyCkd(egfr: number): CkdStage {
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
}

export const CKD_LABELS: Record<CkdStage, string> = {
  G1:  'G1 — Normal atau Tinggi (≥ 90)',
  G2:  'G2 — Penurunan Ringan (60–89)',
  G3a: 'G3a — Penurunan Ringan-Sedang (45–59)',
  G3b: 'G3b — Penurunan Sedang-Berat (30–44)',
  G4:  'G4 — Penurunan Berat (15–29)',
  G5:  'G5 — Gagal Ginjal (< 15)',
};

export const CKD_COLOR: Record<CkdStage, string> = {
  G1:  'var(--sys-green)',
  G2:  'var(--sys-yellow)',
  G3a: 'var(--sys-orange)',
  G3b: 'var(--sys-orange)',
  G4:  'var(--sys-red)',
  G5:  'var(--sys-red)',
};

// ── Rasio Protein:Kreatinin Urin ──────────────────────────────────────────
// Nilai pada urin sewaktu (spot urine), mg/mg atau mg/mmol bila dikonversi.
// Normal pada anak > 2 tahun: < 0.2 mg/mg.
// Neonatus & bayi < 2 tahun: dapat lebih tinggi, batas atas ~ 0.5.
export type ProteinCrRatioClass =
  | 'normal'
  | 'mild'           // 0.2–0.5: proteinuria ringan
  | 'significant'    // 0.5–2.0: proteinuria signifikan
  | 'nephrotic';     // ≥ 2.0: rentang nefrotik

export interface ProteinCrResult {
  ratio: number;
  ratioClass: ProteinCrRatioClass;
  label: string;
  color: string;
}

export function interpretProteinCrRatio(urineProteinMgDl: number, urineCrMgDl: number): ProteinCrResult {
  if (!Number.isFinite(urineProteinMgDl) || urineProteinMgDl < 0)
    throw new Error('Renal: protein urin tidak valid');
  if (!Number.isFinite(urineCrMgDl) || urineCrMgDl <= 0)
    throw new Error('Renal: kreatinin urin tidak valid');

  const ratio = Math.round((urineProteinMgDl / urineCrMgDl) * 100) / 100;
  let ratioClass: ProteinCrRatioClass;
  if (ratio < 0.2)       ratioClass = 'normal';
  else if (ratio < 0.5)  ratioClass = 'mild';
  else if (ratio < 2.0)  ratioClass = 'significant';
  else                   ratioClass = 'nephrotic';

  return { ratio, ratioClass, label: PCR_LABELS[ratioClass], color: PCR_COLOR[ratioClass] };
}

const PCR_LABELS: Record<ProteinCrRatioClass, string> = {
  normal:      'Normal (< 0.2)',
  mild:        'Proteinuria Ringan (0.2–0.5)',
  significant: 'Proteinuria Signifikan (0.5–2.0)',
  nephrotic:   'Rentang Nefrotik (≥ 2.0)',
};
const PCR_COLOR: Record<ProteinCrRatioClass, string> = {
  normal:      'var(--sys-green)',
  mild:        'var(--sys-yellow)',
  significant: 'var(--sys-orange)',
  nephrotic:   'var(--sys-red)',
};

// ── Urine Output ──────────────────────────────────────────────────────────
// Normal: 1–2 mL/kg/jam; oliguria: < 0.5 mL/kg/jam (anak); < 1 mL/kg/jam (neonatus)
export type UoClass = 'oliguria' | 'borderline' | 'normal' | 'polyuria';

export function classifyUrinOutput(uoMlPerHour: number, weightKg: number): { rate: number; uoClass: UoClass; label: string; color: string } {
  const rate = Math.round((uoMlPerHour / weightKg) * 100) / 100;
  let uoClass: UoClass;
  if (rate < 0.5)      uoClass = 'oliguria';
  else if (rate < 1.0) uoClass = 'borderline';
  else if (rate <= 4.0) uoClass = 'normal';
  else                 uoClass = 'polyuria';
  const LABELS: Record<UoClass, string> = {
    oliguria:   'Oliguria (< 0.5 mL/kg/jam)',
    borderline: 'Borderline (0.5–1.0 mL/kg/jam)',
    normal:     'Normal (1–4 mL/kg/jam)',
    polyuria:   'Poliuria (> 4 mL/kg/jam)',
  };
  const COLORS: Record<UoClass, string> = {
    oliguria:   'var(--sys-red)',
    borderline: 'var(--sys-orange)',
    normal:     'var(--sys-green)',
    polyuria:   'var(--sys-yellow)',
  };
  return { rate, uoClass, label: LABELS[uoClass], color: COLORS[uoClass] };
}
