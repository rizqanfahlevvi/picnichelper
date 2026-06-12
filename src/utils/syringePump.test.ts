import { describe, it, expect } from 'vitest';
import { calculateSyringePumpRate } from './syringePump';

describe('calculateSyringePumpRate', () => {
  it('dopamin 5 mcg/kg/mnt, 10 kg, 1600 mcg/mL → 1.875 mL/jam', () => {
    // (5 × 10 × 60) / 1600 = 3000 / 1600 = 1.875
    const r = calculateSyringePumpRate({
      dosePerKgPerTime: 5,
      timeUnit: 'per_minute',
      weightKg: 10,
      concentrationMcgPerMl: 1600,
    });
    expect(r.ratePerHour).toBeCloseTo(1.875);
    expect(r.absoluteDosePerTime).toBe(50); // 5 × 10
  });

  it('fentanil 2 mcg/kg/jam, 15 kg, 10 mcg/mL → 3 mL/jam', () => {
    // (2 × 15) / 10 = 3
    const r = calculateSyringePumpRate({
      dosePerKgPerTime: 2,
      timeUnit: 'per_hour',
      weightKg: 15,
      concentrationMcgPerMl: 10,
    });
    expect(r.ratePerHour).toBeCloseTo(3);
  });

  it('melempar error bila konsentrasi 0', () => {
    expect(() => calculateSyringePumpRate({
      dosePerKgPerTime: 5,
      timeUnit: 'per_minute',
      weightKg: 10,
      concentrationMcgPerMl: 0,
    })).toThrow();
  });

  it('melempar error bila berat negatif', () => {
    expect(() => calculateSyringePumpRate({
      dosePerKgPerTime: 5,
      timeUnit: 'per_minute',
      weightKg: -5,
      concentrationMcgPerMl: 1000,
    })).toThrow();
  });
});
