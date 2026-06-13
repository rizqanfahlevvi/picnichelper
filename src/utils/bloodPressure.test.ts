import { describe, it, expect } from 'vitest';
import { interpretBp } from './bloodPressure';

describe('interpretBp — validasi input', () => {
  it('melempar error bila SBP tidak valid', () => {
    expect(() => interpretBp(0, 70, 5)).toThrow();
    expect(() => interpretBp(NaN, 70, 5)).toThrow();
    expect(() => interpretBp(350, 70, 5)).toThrow();
  });
  it('melempar error bila DBP tidak valid', () => {
    expect(() => interpretBp(110, 0, 5)).toThrow();
    expect(() => interpretBp(110, NaN, 5)).toThrow();
  });
  it('melempar error bila usia tidak valid', () => {
    expect(() => interpretBp(110, 70, -1)).toThrow();
    expect(() => interpretBp(110, 70, NaN)).toThrow();
  });
});

describe('interpretBp — anak < 13 tahun', () => {
  it('anak 5 th, TD normal (90/60) → overall normal', () => {
    const r = interpretBp(90, 60, 5);
    expect(r.overallCategory).toBe('normal');
    expect(r.isAdult).toBe(false);
  });

  it('anak 5 th, SBP = p90 (106) → elevated', () => {
    // p90 SBP usia 5 = 106; nilai tepat di batas = elevated
    const r = interpretBp(106, 60, 5);
    expect(r.systolicCategory).toBe('elevated');
  });

  it('anak 5 th, SBP = p95 (110) → stage1', () => {
    const r = interpretBp(110, 60, 5);
    expect(r.systolicCategory).toBe('stage1');
  });

  it('anak 5 th, SBP = p99+6 (123) → stage2', () => {
    // p99 = 117; p99+5 = 122; 123 masuk stage2
    const r = interpretBp(123, 60, 5);
    expect(r.systolicCategory).toBe('stage2');
  });

  it('anak 5 th, SBP = p99+30+1 (148) → htn_crisis', () => {
    const r = interpretBp(148, 60, 5);
    expect(r.systolicCategory).toBe('htn_crisis');
  });

  it('overall mengambil kategori tertinggi antara SBP dan DBP', () => {
    // SBP normal, DBP hypertensive
    const r = interpretBp(90, 75, 5); // p95 DBP usia 5 = 67
    expect(r.diastolicCategory).toBe('stage1');
    expect(r.overallCategory).toBe('stage1');
  });

  it('mengembalikan threshold yang benar untuk usia 10 th', () => {
    const r = interpretBp(100, 60, 10);
    expect(r.p90SBP).toBe(113);
    expect(r.p95SBP).toBe(117);
    expect(r.p99SBP).toBe(124);
  });
});

describe('interpretBp — remaja ≥ 13 tahun (kriteria dewasa)', () => {
  it('13 th, 115/75 → normal', () => {
    const r = interpretBp(115, 75, 13);
    expect(r.overallCategory).toBe('normal');
    expect(r.isAdult).toBe(true);
  });

  it('13 th, 125/75 → elevated (SBP 120–129 + DBP < 80)', () => {
    const r = interpretBp(125, 75, 13);
    expect(r.systolicCategory).toBe('elevated');
    expect(r.diastolicCategory).toBe('normal');
    expect(r.overallCategory).toBe('elevated');
  });

  it('13 th, 135/85 → stage1', () => {
    const r = interpretBp(135, 85, 13);
    expect(r.systolicCategory).toBe('stage1');
    expect(r.diastolicCategory).toBe('stage1');
  });

  it('13 th, 145/92 → stage2', () => {
    const r = interpretBp(145, 92, 13);
    expect(r.systolicCategory).toBe('stage2');
  });

  it('13 th, 185/125 → htn_crisis', () => {
    const r = interpretBp(185, 125, 13);
    expect(r.overallCategory).toBe('htn_crisis');
  });
});
