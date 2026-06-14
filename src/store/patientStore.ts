import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────
// Single Source of Truth untuk data pasien (CLAUDE.md).
// Data disimpan sebagai STRING (apa adanya dari input) supaya field bisa
// kosong. Konversi ke number dilakukan EKSPLISIT di lapisan UI sebelum
// memanggil fungsi di /utils — string tidak boleh lolos ke /utils.
// ─────────────────────────────────────────────────────────────────────────

export type PatientCategory = 'neonatus' | 'anak';
export type AgeUnit = 'tahun' | 'bulan' | 'tgl-lahir';
export type Gender = '' | 'L' | 'P';

interface PatientState {
  category: PatientCategory;
  nama: string;
  gender: Gender;
  /** Usia dalam tahun (string mentah dari input) — relevan untuk kategori anak */
  ageYears: string;
  /** Input usia mentah (angka atau tanggal lahir tergantung ageUnit) */
  ageInput: string;
  ageUnit: AgeUnit;
  /** Berat dalam kg (string mentah dari input) */
  weightKg: string;
  /** Tinggi badan dalam cm (string mentah dari input) — dipakai kalkulator renal */
  heightCm: string;

  setCategory: (c: PatientCategory) => void;
  setNama: (v: string) => void;
  setGender: (v: Gender) => void;
  setAgeYears: (v: string) => void;
  setAgeInput: (v: string) => void;
  setAgeUnit: (v: AgeUnit) => void;
  setWeightKg: (v: string) => void;
  setHeightCm: (v: string) => void;
  reset: () => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  category: 'anak',
  nama: '',
  gender: '',
  ageYears: '',
  ageInput: '',
  ageUnit: 'tahun',
  weightKg: '',
  heightCm: '',

  setCategory: (category) => set({ category }),
  setNama: (nama) => set({ nama }),
  setGender: (gender) => set({ gender }),
  setAgeYears: (ageYears) => set({ ageYears }),
  setAgeInput: (ageInput) => set({ ageInput }),
  setAgeUnit: (ageUnit) => set({ ageUnit }),
  setWeightKg: (weightKg) => set({ weightKg }),
  setHeightCm: (heightCm) => set({ heightCm }),
  reset: () => set({ nama: '', gender: '', ageYears: '', ageInput: '', ageUnit: 'tahun', weightKg: '', heightCm: '' }),
}));
