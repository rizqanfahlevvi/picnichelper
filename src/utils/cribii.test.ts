import { describe, it, expect } from 'vitest';
import { calculateCribII } from './cribii';

describe('calculateCribII', () => {
  it('30 minggu, 1400g, perempuan, suhu 36.5, BE 0 → risiko rendah-sedang', () => {
    const r = calculateCribII({
      gestationalAgeWeeks: 30,
      birthWeightGrams: 1400,
      sex: 'female',
      admissionTemperatureC: 36.5,
      baseExcess: 0,
    });
    // GA30→1, BB1400(F)→1, suhu→0, BE0→0, sex F→0 = 2
    expect(r.total).toBe(2);
    expect(r.riskCategory).toBe('rendah');
  });

  it('24 minggu, 600g, laki-laki, suhu 34.5, BE -12 → total sangat tinggi', () => {
    const r = calculateCribII({
      gestationalAgeWeeks: 24,
      birthWeightGrams: 600,
      sex: 'male',
      admissionTemperatureC: 34.5,
      baseExcess: -12,
    });
    // GA24→7, BB600(M)→6, suhu34.5→3, BE-12→4, sexM→1 = 21
    expect(r.total).toBe(21);
    expect(r.riskCategory).toBe('sangat tinggi');
    expect(r.estimatedMortalityPercent).toBeGreaterThan(35);
  });

  it('sex mempengaruhi skor (laki-laki +1)', () => {
    const base = {
      gestationalAgeWeeks: 28, birthWeightGrams: 1000,
      admissionTemperatureC: 36.5, baseExcess: 0,
    };
    const male   = calculateCribII({ ...base, sex: 'male' });
    const female = calculateCribII({ ...base, sex: 'female' });
    expect(male.total - female.total).toBe(1);
  });

  it('melempar error bila GA < 22 minggu', () => {
    expect(() => calculateCribII({
      gestationalAgeWeeks: 21, birthWeightGrams: 500,
      sex: 'male', admissionTemperatureC: 36, baseExcess: 0,
    })).toThrow();
  });
});
