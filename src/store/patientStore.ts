import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────
// Single Source of Truth untuk data pasien (CLAUDE.md).
// Data disimpan sebagai STRING (apa adanya dari input).
// ageYears selalu dalam TAHUN (bisa desimal) — dipakai semua kalkulator.
// ─────────────────────────────────────────────────────────────────────────

export type PatientCategory = 'neonatus' | 'anak';
export type AgeUnit = 'tahun' | 'bulan' | 'tgl-lahir';
export type Gender = 'L' | 'P' | '';

interface PatientState {
  category: PatientCategory;

  // Age input
  ageUnit: AgeUnit;
  ageInput: string;   // raw: tahun/bulan as number string, or ISO date
  /** ageYears — selalu dalam tahun (dikonversi otomatis). Dipakai semua kalkulator. */
  ageYears: string;

  // Other fields
  nama: string;
  gender: Gender;
  weightKg: string;
  heightCm: string;

  setCategory: (c: PatientCategory) => void;
  setAgeUnit: (u: AgeUnit) => void;
  setAgeInput: (v: string) => void;
  setNama: (v: string) => void;
  setGender: (v: Gender) => void;
  setWeightKg: (v: string) => void;
  setHeightCm: (v: string) => void;
  reset: () => void;
}

function deriveAgeYears(unit: AgeUnit, input: string): string {
  if (!input) return '';
  if (unit === 'tahun') return input;
  if (unit === 'bulan') {
    const months = parseFloat(input);
    if (!Number.isFinite(months)) return '';
    return String(Math.round((months / 12) * 100) / 100);
  }
  if (unit === 'tgl-lahir') {
    const dob = new Date(input);
    if (isNaN(dob.getTime())) return '';
    const years = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return String(Math.round(years * 100) / 100);
  }
  return '';
}

export const usePatientStore = create<PatientState>((set) => ({
  category: 'anak',
  ageUnit: 'tahun',
  ageInput: '',
  ageYears: '',
  nama: '',
  gender: '',
  weightKg: '',
  heightCm: '',

  setCategory: (category) => set({ category }),

  setAgeUnit: (ageUnit) =>
    set({ ageUnit, ageInput: '', ageYears: '' }),

  setAgeInput: (ageInput) =>
    set((s) => ({ ageInput, ageYears: deriveAgeYears(s.ageUnit, ageInput) })),

  setNama: (nama) => set({ nama }),
  setGender: (gender) => set({ gender }),
  setWeightKg: (weightKg) => set({ weightKg }),
  setHeightCm: (heightCm) => set({ heightCm }),

  reset: () => set({
    ageInput: '', ageYears: '', nama: '', gender: '',
    weightKg: '', heightCm: '',
  }),
}));
