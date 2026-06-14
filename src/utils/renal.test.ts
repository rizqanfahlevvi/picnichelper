import { describe, it, expect } from 'vitest';
import {
  calculateSchwartzEgfr,
  interpretProteinCrRatio,
  classifyUrinOutput,
} from './renal';

// ── Schwartz eGFR ──────────────────────────────────────────────────────────
describe('calculateSchwartzEgfr', () => {
  it('melempar error bila tinggi tidak valid', () => {
    expect(() => calculateSchwartzEgfr(0, 0.5)).toThrow();
    expect(() => calculateSchwartzEgfr(-10, 0.5)).toThrow();
    expect(() => calculateSchwartzEgfr(NaN, 0.5)).toThrow();
  });
  it('melempar error bila kreatinin tidak valid', () => {
    expect(() => calculateSchwartzEgfr(120, 0)).toThrow();
    expect(() => calculateSchwartzEgfr(120, NaN)).toThrow();
  });

  it('tinggi 120 cm, Cr 0.5 → eGFR ≈ 99.1 (G1)', () => {
    // 0.413 × 120 / 0.5 = 99.12
    const r = calculateSchwartzEgfr(120, 0.5);
    expect(r.egfr).toBeCloseTo(99.1, 0);
    expect(r.stage).toBe('G1');
  });

  it('tinggi 100 cm, Cr 0.9 → eGFR ≈ 45.9 (G3a)', () => {
    // 0.413 × 100 / 0.9 = 45.89
    const r = calculateSchwartzEgfr(100, 0.9);
    expect(r.egfr).toBeCloseTo(45.9, 0);
    expect(r.stage).toBe('G3a');
  });

  it('tinggi 130 cm, Cr 3.0 → eGFR ≈ 17.9 (G4)', () => {
    // 0.413 × 130 / 3.0 = 17.9
    const r = calculateSchwartzEgfr(130, 3.0);
    expect(r.stage).toBe('G4');
  });

  it('tinggi 90 cm, Cr 5.0 → eGFR ≈ 7.4 (G5)', () => {
    // 0.413 × 90 / 5.0 = 7.43
    const r = calculateSchwartzEgfr(90, 5.0);
    expect(r.stage).toBe('G5');
  });

  it('eGFR 60–89 → G2', () => {
    // 0.413 × 110 / 0.75 = 60.6
    const r = calculateSchwartzEgfr(110, 0.75);
    expect(r.stage).toBe('G2');
  });

  it('eGFR 30–44 → G3b', () => {
    // 0.413 × 100 / 1.2 ≈ 34.4
    const r = calculateSchwartzEgfr(100, 1.2);
    expect(r.stage).toBe('G3b');
  });
});

// ── Protein:Creatinine Ratio ───────────────────────────────────────────────
describe('interpretProteinCrRatio', () => {
  it('melempar error bila input tidak valid', () => {
    expect(() => interpretProteinCrRatio(-1, 80)).toThrow();
    expect(() => interpretProteinCrRatio(15, 0)).toThrow();
    expect(() => interpretProteinCrRatio(NaN, 80)).toThrow();
  });

  it('protein 10, Cr 100 → rasio 0.10 → normal', () => {
    const r = interpretProteinCrRatio(10, 100);
    expect(r.ratio).toBe(0.10);
    expect(r.ratioClass).toBe('normal');
  });

  it('protein 30, Cr 100 → rasio 0.30 → mild', () => {
    const r = interpretProteinCrRatio(30, 100);
    expect(r.ratio).toBe(0.30);
    expect(r.ratioClass).toBe('mild');
  });

  it('protein 80, Cr 100 → rasio 0.80 → significant', () => {
    const r = interpretProteinCrRatio(80, 100);
    expect(r.ratio).toBe(0.80);
    expect(r.ratioClass).toBe('significant');
  });

  it('protein 250, Cr 100 → rasio 2.50 → nephrotic', () => {
    const r = interpretProteinCrRatio(250, 100);
    expect(r.ratio).toBe(2.50);
    expect(r.ratioClass).toBe('nephrotic');
  });

  it('batas tepat: protein 20, Cr 100 → 0.20 → mild (bukan normal)', () => {
    const r = interpretProteinCrRatio(20, 100);
    expect(r.ratioClass).toBe('mild');
  });

  it('batas tepat: protein 200, Cr 100 → 2.00 → nephrotic', () => {
    const r = interpretProteinCrRatio(200, 100);
    expect(r.ratioClass).toBe('nephrotic');
  });
});

// ── Urine Output ───────────────────────────────────────────────────────────
describe('classifyUrinOutput', () => {
  it('0.3 mL/jam pada 10 kg → rate 0.03 mL/kg/jam → oliguria', () => {
    const r = classifyUrinOutput(0.3, 10);
    expect(r.rate).toBe(0.03);
    expect(r.uoClass).toBe('oliguria');
  });

  it('tepat di batas oliguria: 0.5 mL/kg/jam → borderline (bukan oliguria)', () => {
    const r = classifyUrinOutput(5, 10); // 5 mL / 10 kg = 0.5 mL/kg/jam
    expect(r.uoClass).toBe('borderline');
  });

  it('10 mL/jam pada 5 kg → rate 2.0 mL/kg/jam → normal', () => {
    const r = classifyUrinOutput(10, 5);
    expect(r.rate).toBe(2.0);
    expect(r.uoClass).toBe('normal');
  });

  it('50 mL/jam pada 10 kg → rate 5.0 mL/kg/jam → polyuria', () => {
    const r = classifyUrinOutput(50, 10);
    expect(r.uoClass).toBe('polyuria');
  });

  it('rate di batas atas normal (4.0) → normal', () => {
    const r = classifyUrinOutput(40, 10); // 40 / 10 = 4.0
    expect(r.uoClass).toBe('normal');
  });
});
