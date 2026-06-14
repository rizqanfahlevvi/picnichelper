import { describe, it, expect } from 'vitest';
import { calculateDose, calculateVolume, calcInfusionRate, formatDose, isSingleDose } from './drugDose';
import type { DoseRange } from '../data/drugLibrary';

const epinefrinRange: DoseRange = {
  minPerKg: 0.01, maxPerKg: 0.01, unit: 'mg/kg',
  maxAbsoluteMg: 1,
  frequency: 'tiap 3–5 menit',
};

const midazolamRange: DoseRange = {
  minPerKg: 0.05, maxPerKg: 0.1, unit: 'mg/kg',
  maxAbsoluteMg: 5,
  frequency: 'prn',
};

const fentanylRange: DoseRange = {
  minPerKg: 1, maxPerKg: 2, unit: 'mcg/kg',
  frequency: 'prn',
};

describe('calculateDose — validasi input', () => {
  it('melempar error bila berat tidak valid', () => {
    expect(() => calculateDose(epinefrinRange, 0)).toThrow();
    expect(() => calculateDose(epinefrinRange, NaN)).toThrow();
    expect(() => calculateDose(epinefrinRange, -5)).toThrow();
  });
});

describe('calculateDose — single dose (min === max)', () => {
  it('epinefrin 0.01 mg/kg, anak 10 kg → 0.1 mg', () => {
    const r = calculateDose(epinefrinRange, 10);
    expect(r.minDose).toBe(0.1);
    expect(r.maxDose).toBe(0.1);
    expect(r.doseUnit).toBe('mg');
    expect(r.isCapped).toBe(false);
  });

  it('dosis dicap oleh maxAbsoluteMg', () => {
    // 0.01 mg/kg × 150 kg = 1.5 mg, maks 1 mg
    const r = calculateDose(epinefrinRange, 150);
    expect(r.maxDose).toBe(1);
    expect(r.isCapped).toBe(true);
  });

  it('dosis tepat di batas maks → tidak dicap', () => {
    // 0.01 × 100 = 1.0 mg = maxAbsoluteMg
    const r = calculateDose(epinefrinRange, 100);
    expect(r.maxDose).toBe(1);
    expect(r.isCapped).toBe(false);
  });
});

describe('calculateDose — range dose (min ≠ max)', () => {
  it('midazolam 0.05–0.1 mg/kg, anak 20 kg → 1–2 mg', () => {
    const r = calculateDose(midazolamRange, 20);
    expect(r.minDose).toBe(1.0);
    expect(r.maxDose).toBe(2.0);
  });

  it('maxDose dicap saat anak besar', () => {
    // 0.1 mg/kg × 60 kg = 6 mg, maks 5 mg
    const r = calculateDose(midazolamRange, 60);
    expect(r.maxDose).toBe(5);
    expect(r.isCapped).toBe(true);
  });

  it('minDose juga dicap bila melebihi maks absolut', () => {
    // 0.05 × 110 = 5.5 > maxAbsoluteMg 5 → minDose = 5
    const r = calculateDose(midazolamRange, 110);
    expect(r.minDose).toBe(5);
  });
});

describe('calculateDose — unit mcg/kg', () => {
  it('fentanyl 1–2 mcg/kg, anak 15 kg → 15–30 mcg', () => {
    const r = calculateDose(fentanylRange, 15);
    expect(r.minDose).toBe(15);
    expect(r.maxDose).toBe(30);
    expect(r.doseUnit).toBe('mcg');
  });
});

describe('calculateVolume', () => {
  it('melempar error bila konsentrasi tidak valid', () => {
    expect(() => calculateVolume(epinefrinRange, 10, 0)).toThrow();
    expect(() => calculateVolume(epinefrinRange, 10, NaN)).toThrow();
  });

  it('epinefrin 0.1 mg, konsentrasi 0.1 mg/mL → 1.0 mL', () => {
    const r = calculateVolume(epinefrinRange, 10, 0.1);
    expect(r.minVolumeMl).toBe(1.0);
    expect(r.maxVolumeMl).toBe(1.0);
  });

  it('midazolam 1–2 mg, konsentrasi 5 mg/mL (20 kg) → 0.2–0.4 mL', () => {
    const r = calculateVolume(midazolamRange, 20, 5);
    expect(r.minVolumeMl).toBe(0.2);
    expect(r.maxVolumeMl).toBe(0.4);
  });

  it('fentanyl 15 mcg, konsentrasi 50 mcg/mL (15 kg) → 0.3–0.6 mL', () => {
    const r = calculateVolume(fentanylRange, 15, 50);
    expect(r.minVolumeMl).toBe(0.3);
    expect(r.maxVolumeMl).toBe(0.6);
  });
});

describe('calcInfusionRate', () => {
  it('melempar error bila parameter tidak valid', () => {
    expect(() => calcInfusionRate(0, 10, 1600)).toThrow();
    expect(() => calcInfusionRate(5, 0, 1600)).toThrow();
  });

  it('dopamin 5 mcg/kg/mnt, 10 kg, 1600 mcg/mL → 1.88 mL/jam', () => {
    // 5 × 10 × 60 / 1600 = 1.875 → 1.88
    const r = calcInfusionRate(5, 10, 1600);
    expect(r).toBeCloseTo(1.88, 1);
  });

  it('norepinefrin 0.1 mcg/kg/mnt, 20 kg, 64 mcg/mL → 1.88 mL/jam', () => {
    // 0.1 × 20 × 60 / 64 = 1.875 → 1.88
    const r = calcInfusionRate(0.1, 20, 64);
    expect(r).toBeCloseTo(1.88, 1);
  });

  it('dosis lebih besar → laju lebih besar', () => {
    expect(calcInfusionRate(10, 10, 1600)).toBeGreaterThan(calcInfusionRate(5, 10, 1600));
  });
});

describe('formatDose', () => {
  it('bilangan bulat → tanpa desimal', () => {
    expect(formatDose(5, 'mg')).toBe('5 mg');
    expect(formatDose(10, 'mcg')).toBe('10 mcg');
  });

  it('bilangan desimal → desimal signifikan', () => {
    expect(formatDose(0.25, 'mg')).toBe('0.25 mg');
    expect(formatDose(1.5, 'mg')).toBe('1.5 mg');
  });

  it('trailing zero dihapus', () => {
    expect(formatDose(2.0, 'mg')).toBe('2 mg');
  });
});

describe('isSingleDose', () => {
  it('mengembalikan true bila min === max', () => {
    expect(isSingleDose(epinefrinRange)).toBe(true);
  });

  it('mengembalikan false bila min ≠ max', () => {
    expect(isSingleDose(midazolamRange)).toBe(false);
    expect(isSingleDose(fentanylRange)).toBe(false);
  });
});
