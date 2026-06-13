import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────
// Single Source of Truth untuk data pasien (CLAUDE.md).
// Data disimpan sebagai STRING (apa adanya dari input) supaya field bisa
// kosong. Konversi ke number dilakukan EKSPLISIT di lapisan UI sebelum
// memanggil fungsi di /utils — string tidak boleh lolos ke /utils.
// ─────────────────────────────────────────────────────────────────────────

export type PatientCategory = 'neonatus' | 'anak';

interface PatientState {
  category: PatientCategory;
  /** Usia dalam tahun (string mentah dari input) — relevan untuk kategori anak */
  ageYears: string;
  /** Berat dalam kg (string mentah dari input) */
  weightKg: string;
  /** Tinggi badan dalam cm (string mentah dari input) — dipakai kalkulator renal */
  heightCm: string;

  setCategory: (c: PatientCategory) => void;
  setAgeYears: (v: string) => void;
  setWeightKg: (v: string) => void;
  setHeightCm: (v: string) => void;
  reset: () => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  category: 'anak',
  ageYears: '',
  weightKg: '',
  heightCm: '',

  setCategory: (category) => set({ category }),
  setAgeYears: (ageYears) => set({ ageYears }),
  setWeightKg: (weightKg) => set({ weightKg }),
  setHeightCm: (heightCm) => set({ heightCm }),
  reset: () => set({ ageYears: '', weightKg: '', heightCm: '' }),
}));
