import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────
// Single Source of Truth untuk data pasien (CLAUDE.md).
// Data disimpan sebagai STRING supaya field bisa kosong.
// Konversi ke number dilakukan EKSPLISIT di lapisan UI sebelum
// memanggil fungsi di /utils — string tidak boleh lolos ke /utils.
// ─────────────────────────────────────────────────────────────────────────

export type PatientCategory = 'neonatus' | 'anak';
export type AgeUnit = 'tahun' | 'bulan' | 'tgl-lahir';
export type Gender = '' | 'L' | 'P';

interface PatientState {
  category: PatientCategory;
  nama: string;
  gender: Gender;
  ageUnit: AgeUnit;
  /** Input usia mentah: angka (tahun/bulan) atau ISO date (tgl-lahir) */
  ageInput: string;
  /** Usia dalam tahun — dihitung dari ageInput, dipakai kalkulator */
  ageYears: string;
  weightKg: string;
  heightCm: string;

  setCategory: (c: PatientCategory) => void;
  setNama: (v: string) => void;
  setGender: (v: Gender) => void;
  setAgeUnit: (v: AgeUnit) => void;
  setAgeInput: (v: string) => void;
  setAgeYears: (v: string) => void;
  setWeightKg: (v: string) => void;
  setHeightCm: (v: string) => void;
  reset: () => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
  category: 'anak',
  nama: '',
  gender: '',
  ageUnit: 'tahun',
  ageInput: '',
  ageYears: '',
  weightKg: '',
  heightCm: '',

  setCategory: (category) => set({ category }),
  setNama:     (nama)     => set({ nama }),
  setGender:   (gender)   => set({ gender }),
  setAgeUnit:  (ageUnit)  => set({ ageUnit, ageInput: '', ageYears: '' }),
  setAgeInput: (ageInput) => set({ ageInput }),
  setAgeYears: (ageYears) => set({ ageYears }),
  setWeightKg: (weightKg) => set({ weightKg }),
  setHeightCm: (heightCm) => set({ heightCm }),
  reset: () => set({
    nama: '', gender: '', ageUnit: 'tahun',
    ageInput: '', ageYears: '', weightKg: '', heightCm: '',
  }),
    }),
    { name: 'picnic-patient' },
  ),
);
