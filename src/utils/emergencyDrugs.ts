// ─────────────────────────────────────────────────────────────────────────
// Dosis obat emergency pediatrik — data + fungsi murni.
// Sumber: AHA PALS 2020 [1], semua nilai telah dikonfirmasi pengarah klinis.
// ─────────────────────────────────────────────────────────────────────────

export type DoseUnit = 'mg' | 'mcg' | 'mEq' | 'mL';

export interface DrugDefinition {
  id: string;
  name: string;
  indication: string;
  dosePerKg: number;
  dosePerKgMax?: number;   // bila dosis range, mis. 1–2 mg/kg
  unit: DoseUnit;
  route: string;
  minDose?: number;        // batas bawah, mis. atropin min 0.1 mg
  maxDose?: number;        // batas atas
  notes?: string;
}

export interface CalculatedDose {
  drug: DrugDefinition;
  rawDose: number;         // dosePerKg × weightKg (tanpa clamp)
  clampedDose: number;     // setelah min/max diterapkan
  unit: DoseUnit;
  isClamped: boolean;
  clampReason: 'min' | 'max' | null;
}

// ── Tabel dosis PALS 2020 ────────────────────────────────────────────────
export const EMERGENCY_DRUGS: DrugDefinition[] = [
  {
    id: 'epi_arrest',
    name: 'Epinefrin',
    indication: 'Henti jantung (IV/IO)',
    dosePerKg: 0.01,
    unit: 'mg',
    route: 'IV/IO',
    maxDose: 1,
    notes: 'Ulangi tiap 3–5 mnt. Larutkan 1:10.000 (0.1 mg/mL).',
  },
  {
    id: 'epi_anaphylaxis',
    name: 'Epinefrin',
    indication: 'Anafilaksis (IM)',
    dosePerKg: 0.01,
    unit: 'mg',
    route: 'IM paha anterolateral',
    maxDose: 0.5,
    notes: 'Gunakan larutan 1:1.000 (1 mg/mL). Dapat diulang tiap 5–15 mnt.',
  },
  {
    id: 'atropine',
    name: 'Atropin',
    indication: 'Bradikardia simtomatik',
    dosePerKg: 0.02,
    unit: 'mg',
    route: 'IV/IO',
    minDose: 0.1,
    maxDose: 0.5,
    notes: 'Dosis minimum 0.1 mg untuk hindari bradikardia paradoksal.',
  },
  {
    id: 'adenosine_1',
    name: 'Adenosin',
    indication: 'SVT (dosis ke-1)',
    dosePerKg: 0.1,
    unit: 'mg',
    route: 'IV cepat + flush',
    maxDose: 6,
    notes: 'Push sangat cepat (< 1 dtk) di vena besar. Boleh ulangi dengan dosis ke-2.',
  },
  {
    id: 'adenosine_2',
    name: 'Adenosin',
    indication: 'SVT (dosis ke-2)',
    dosePerKg: 0.2,
    unit: 'mg',
    route: 'IV cepat + flush',
    maxDose: 12,
    notes: 'Bila dosis ke-1 tidak efektif setelah 1–2 mnt.',
  },
  {
    id: 'amiodarone',
    name: 'Amiodaron',
    indication: 'VF / pVT tanpa nadi',
    dosePerKg: 5,
    unit: 'mg',
    route: 'IV/IO bolus',
    maxDose: 300,
    notes: 'Untuk VT dengan nadi: infus lambat 20–60 mnt.',
  },
  {
    id: 'midazolam_iv',
    name: 'Midazolam',
    indication: 'Sedasi / kejang (IV)',
    dosePerKg: 0.1,
    unit: 'mg',
    route: 'IV pelan',
    maxDose: 5,
    notes: 'Awasi depresi napas.',
  },
  {
    id: 'midazolam_im',
    name: 'Midazolam',
    indication: 'Kejang (IM / intranasal)',
    dosePerKg: 0.2,
    unit: 'mg',
    route: 'IM / intranasal',
    maxDose: 10,
  },
  {
    id: 'ketamine',
    name: 'Ketamin',
    indication: 'Sedasi / induksi RSI',
    dosePerKg: 1,
    dosePerKgMax: 2,
    unit: 'mg',
    route: 'IV',
    notes: 'Range 1–2 mg/kg. Pertahankan jalan napas.',
  },
  {
    id: 'nahco3',
    name: 'Natrium Bikarbonat',
    indication: 'Asidosis metabolik berat',
    dosePerKg: 1,
    unit: 'mEq',
    route: 'IV lambat',
    notes: 'Push pelan. Jangan campur dengan kalsium.',
  },
];

/**
 * Hitung dosis obat berdasarkan berat pasien.
 * Menerapkan batas min/max sesuai definisi obat.
 *
 * @param drug    definisi obat dari EMERGENCY_DRUGS
 * @param weightKg berat pasien dalam kg (number, sudah dikonversi)
 */
export function calculateDose(drug: DrugDefinition, weightKg: number): CalculatedDose {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error('calculateDose: weightKg tidak valid');
  }

  const rawDose = drug.dosePerKg * weightKg;
  let clampedDose = rawDose;
  let clampReason: 'min' | 'max' | null = null;

  if (drug.minDose !== undefined && clampedDose < drug.minDose) {
    clampedDose = drug.minDose;
    clampReason = 'min';
  }
  if (drug.maxDose !== undefined && clampedDose > drug.maxDose) {
    clampedDose = drug.maxDose;
    clampReason = 'max';
  }

  return {
    drug,
    rawDose,
    clampedDose,
    unit: drug.unit,
    isClamped: clampReason !== null,
    clampReason,
  };
}
