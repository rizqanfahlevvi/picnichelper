// ─────────────────────────────────────────────────────────────────────────
// Klasifikasi tekanan darah pediatri
// Sumber: Flynn JT et al. Pediatrics. 2017;140(3):e20171904.
//         AAP Clinical Practice Guideline — HTN pada anak & remaja.
//
// Implementasi: tabel 95th percentile dari AAP 2017 Table 3
// (50th height percentile, digunakan untuk simplified screening).
// Untuk penilaian penuh, gunakan tabel lengkap sesuai tinggi badan.
// ─────────────────────────────────────────────────────────────────────────

export type BpCategory =
  | 'normal'           // < 90th percentile
  | 'elevated'         // 90th – <95th percentile (atau ≥ 120/80 remaja)
  | 'stage1'           // 95th – 99th+5 mmHg
  | 'stage2'           // > 99th+5 mmHg
  | 'htn_crisis';      // ≥ 30 mmHg di atas 99th atau gejala urgensi

export interface BpResult {
  systolicCategory:  BpCategory;
  diastolicCategory: BpCategory;
  overallCategory:   BpCategory;
  p90SBP: number; p95SBP: number; p99SBP: number;
  p90DBP: number; p95DBP: number; p99DBP: number;
  isAdult: boolean;
}

// ── Tabel simplified AAP 2017 Table 3, 50th height percentile ─────────────
// Nilai untuk boys dan girls dirata-rata (screening).
// Sumber: Flynn JT et al. Pediatrics. 2017;140(3):e20171904. Table 3.
// TODO: pisahkan berdasarkan jenis kelamin & persentil tinggi untuk akurasi penuh.
const BP_TABLE: Record<number, { sbp90: number; sbp95: number; sbp99: number; dbp90: number; dbp95: number; dbp99: number }> = {
  1:  { sbp90: 100, sbp95: 104, sbp99: 111, dbp90: 54,  dbp95: 58,  dbp99: 66  },
  2:  { sbp90: 101, sbp95: 106, sbp99: 113, dbp90: 57,  dbp95: 62,  dbp99: 69  },
  3:  { sbp90: 103, sbp95: 107, sbp99: 114, dbp90: 60,  dbp95: 64,  dbp99: 71  },
  4:  { sbp90: 104, sbp95: 108, sbp99: 115, dbp90: 61,  dbp95: 66,  dbp99: 73  },
  5:  { sbp90: 106, sbp95: 110, sbp99: 117, dbp90: 62,  dbp95: 67,  dbp99: 74  },
  6:  { sbp90: 107, sbp95: 111, sbp99: 118, dbp90: 63,  dbp95: 67,  dbp99: 74  },
  7:  { sbp90: 108, sbp95: 113, sbp99: 120, dbp90: 64,  dbp95: 68,  dbp99: 75  },
  8:  { sbp90: 110, sbp95: 114, sbp99: 121, dbp90: 65,  dbp95: 69,  dbp99: 76  },
  9:  { sbp90: 111, sbp95: 115, sbp99: 122, dbp90: 66,  dbp95: 70,  dbp99: 77  },
  10: { sbp90: 113, sbp95: 117, sbp99: 124, dbp90: 67,  dbp95: 71,  dbp99: 78  },
  11: { sbp90: 115, sbp95: 119, sbp99: 126, dbp90: 68,  dbp95: 72,  dbp99: 79  },
  12: { sbp90: 117, sbp95: 120, sbp99: 128, dbp90: 70,  dbp95: 74,  dbp99: 81  },
};

function classifyVsThresholds(
  value: number,
  p90: number, p95: number, p99: number,
): BpCategory {
  if (value < p90) return 'normal';
  if (value < p95) return 'elevated';
  if (value <= p99 + 5) return 'stage1';
  if (value <= p99 + 30) return 'stage2';
  return 'htn_crisis';
}

export function interpretBp(sbp: number, dbp: number, ageYears: number): BpResult {
  const age = Math.floor(ageYears);

  if (!Number.isFinite(sbp) || sbp <= 0 || sbp > 300)
    throw new Error('BP: sistolik tidak valid');
  if (!Number.isFinite(dbp) || dbp <= 0 || dbp > 200)
    throw new Error('BP: diastolik tidak valid');
  if (!Number.isFinite(ageYears) || ageYears < 0)
    throw new Error('BP: usia tidak valid');

  // Remaja ≥ 13 tahun → kriteria dewasa (AAP 2017)
  if (ageYears >= 13) {
    const sbpCat: BpCategory =
      sbp < 120 ? 'normal' :
      sbp < 130 ? 'elevated' :
      sbp < 140 ? 'stage1' :
      sbp < 180 ? 'stage2' : 'htn_crisis';
    const dbpCat: BpCategory =
      dbp < 80  ? 'normal' :
      dbp < 90  ? 'stage1' :
      dbp < 120 ? 'stage2' : 'htn_crisis';
    const overall = maxCategory([sbpCat, dbpCat]);
    return { systolicCategory: sbpCat, diastolicCategory: dbpCat, overallCategory: overall,
      p90SBP: 120, p95SBP: 130, p99SBP: 150,
      p90DBP: 75,  p95DBP: 80,  p99DBP: 100, isAdult: true };
  }

  const tableAge = Math.max(1, Math.min(age, 12));
  const row = BP_TABLE[tableAge] ?? BP_TABLE[12];

  const sbpCat = classifyVsThresholds(sbp, row.sbp90, row.sbp95, row.sbp99);
  const dbpCat = classifyVsThresholds(dbp, row.dbp90, row.dbp95, row.dbp99);
  const overall = maxCategory([sbpCat, dbpCat]);

  return {
    systolicCategory: sbpCat, diastolicCategory: dbpCat, overallCategory: overall,
    p90SBP: row.sbp90, p95SBP: row.sbp95, p99SBP: row.sbp99,
    p90DBP: row.dbp90, p95DBP: row.dbp95, p99DBP: row.dbp99,
    isAdult: false,
  };
}

const ORDER: BpCategory[] = ['normal', 'elevated', 'stage1', 'stage2', 'htn_crisis'];
function maxCategory(cats: BpCategory[]): BpCategory {
  return cats.reduce((a, b) => ORDER.indexOf(a) >= ORDER.indexOf(b) ? a : b, 'normal');
}

export const BP_CATEGORY_LABEL: Record<BpCategory, string> = {
  normal:    'Normal',
  elevated:  'Meningkat',
  stage1:    'Hipertensi Stage 1',
  stage2:    'Hipertensi Stage 2',
  htn_crisis:'Krisis Hipertensi',
};

export const BP_CATEGORY_COLOR: Record<BpCategory, string> = {
  normal:    'var(--sys-green)',
  elevated:  'var(--sys-yellow)',
  stage1:    'var(--sys-orange)',
  stage2:    'var(--sys-red)',
  htn_crisis:'var(--sys-red)',
};
