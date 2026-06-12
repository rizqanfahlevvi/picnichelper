import { describe, it, expect } from 'vitest';
import {
  ettSizeByAge,
  ettSizeNeonate,
  roundToHalf,
  ETT_AGE_MIN_YEARS,
} from './ett';

describe('roundToHalf', () => {
  it('membulatkan ke kelipatan 0.5 terdekat', () => {
    expect(roundToHalf(4.1)).toBe(4.0);
    expect(roundToHalf(4.25)).toBe(4.5);
    expect(roundToHalf(4.74)).toBe(4.5);
    expect(roundToHalf(4.75)).toBe(5.0);
  });
});

describe('ettSizeByAge (age-based, ≥ 1 th)', () => {
  it('usia 4 th → uncuffed 5.0, cuffed 4.5', () => {
    // uncuffed = 4/4 + 4 = 5.0 ; cuffed = 4/4 + 3.5 = 4.5
    const r = ettSizeByAge(4);
    expect(r.uncuffed).toBe(5.0);
    expect(r.cuffed).toBe(4.5);
  });

  it('usia 8 th → uncuffed 6.0, cuffed 5.5', () => {
    const r = ettSizeByAge(8);
    expect(r.uncuffed).toBe(6.0);
    expect(r.cuffed).toBe(5.5);
  });

  it('usia 2 th → uncuffed 4.5, cuffed 4.0', () => {
    // uncuffed = 2/4 + 4 = 4.5 ; cuffed = 2/4 + 3.5 = 4.0
    const r = ettSizeByAge(2);
    expect(r.uncuffed).toBe(4.5);
    expect(r.cuffed).toBe(4.0);
  });

  it('usia batas minimum (1 th) tetap menghasilkan number valid', () => {
    const r = ettSizeByAge(ETT_AGE_MIN_YEARS);
    expect(Number.isFinite(r.uncuffed)).toBe(true);
    expect(Number.isFinite(r.cuffed)).toBe(true);
  });

  it('melempar error bila input bukan number valid', () => {
    expect(() => ettSizeByAge(NaN)).toThrow();
    expect(() => ettSizeByAge(Infinity)).toThrow();
  });
});

describe('ettSizeNeonate (tabel berat, < 1 th)', () => {
  it('500 g → 2.5 mm (< 28 minggu)', () => {
    expect(ettSizeNeonate(500)?.sizeMm).toBe(2.5);
  });
  it('1500 g → 3.0 mm', () => {
    expect(ettSizeNeonate(1500)?.sizeMm).toBe(3.0);
  });
  it('2500 g → 3.5 mm', () => {
    expect(ettSizeNeonate(2500)?.sizeMm).toBe(3.5);
  });
  it('3500 g → 3.5 mm (> 38 minggu)', () => {
    expect(ettSizeNeonate(3500)?.sizeMm).toBe(3.5);
  });
  it('batas 1000 g masuk ke baris 3.0 mm (inklusif bawah)', () => {
    expect(ettSizeNeonate(1000)?.sizeMm).toBe(3.0);
  });
  it('berat tidak masuk akal → null', () => {
    expect(ettSizeNeonate(0)).toBeNull();
    expect(ettSizeNeonate(-100)).toBeNull();
    expect(ettSizeNeonate(NaN)).toBeNull();
  });
});
