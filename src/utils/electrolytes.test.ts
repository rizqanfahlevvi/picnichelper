import { describe, it, expect } from 'vitest';
import {
  classifyNa, calc3pctNaClVol, calcFreeWaterDeficit,
  classifyK, calcKDose,
  classifyCaTotal, classifyCaIonized, calcCaGluconateVol, correctCaForAlbumin,
  classifyMg, calcMgSO4Vol,
} from './electrolytes';

// ── Sodium ─────────────────────────────────────────────────────────────────
describe('classifyNa', () => {
  it('normal: 135–145', () => {
    expect(classifyNa(140).status).toBe('normal');
    expect(classifyNa(135).status).toBe('normal');
    expect(classifyNa(145).status).toBe('normal');
  });
  it('hypo ringan: 130–134', () => {
    const r = classifyNa(132);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('mild');
  });
  it('hypo sedang: 125–129', () => {
    const r = classifyNa(126);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('moderate');
  });
  it('hypo berat: < 125', () => {
    const r = classifyNa(120);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('severe');
  });
  it('hyper ringan: 146–150', () => {
    const r = classifyNa(148);
    expect(r.status).toBe('hyper');
    expect(r.severity).toBe('mild');
  });
  it('hyper sedang: 151–160', () => {
    const r = classifyNa(155);
    expect(r.status).toBe('hyper');
    expect(r.severity).toBe('moderate');
  });
  it('hyper berat: > 160', () => {
    const r = classifyNa(165);
    expect(r.status).toBe('hyper');
    expect(r.severity).toBe('severe');
  });
});

describe('calc3pctNaClVol', () => {
  it('anak 10 kg, target naik 5 mEq/L', () => {
    // TBW = 10 × 0.6 = 6 L; Vol = 5 × 6 / 0.514 ≈ 58.4 mL
    const vol = calc3pctNaClVol(10, 5);
    expect(vol).toBeCloseTo(58.4, 0);
  });
  it('target naik 1 mEq/L → lebih kecil dari 5 mEq/L', () => {
    expect(calc3pctNaClVol(10, 1)).toBeLessThan(calc3pctNaClVol(10, 5));
  });
  it('berat lebih besar → volume lebih besar', () => {
    expect(calc3pctNaClVol(20, 5)).toBeGreaterThan(calc3pctNaClVol(10, 5));
  });
});

describe('calcFreeWaterDeficit', () => {
  it('anak 20 kg, Na 155 → defisit positif', () => {
    // TBW = 12 L; FWD = 12 × (155/145 - 1) = 12 × 0.069 ≈ 0.83 L
    const fwd = calcFreeWaterDeficit(20, 155);
    expect(fwd).toBeGreaterThan(0);
    expect(fwd).toBeCloseTo(0.83, 1);
  });
  it('Na = 145 → defisit nol', () => {
    expect(calcFreeWaterDeficit(20, 145)).toBe(0);
  });
});

// ── Potassium ──────────────────────────────────────────────────────────────
describe('classifyK', () => {
  it('normal: 3.5–5.5', () => {
    expect(classifyK(4.0).status).toBe('normal');
    expect(classifyK(3.5).status).toBe('normal');
    expect(classifyK(5.5).status).toBe('normal');
  });
  it('hypo ringan: 3.0–3.4', () => {
    const r = classifyK(3.2);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('mild');
  });
  it('hypo sedang: 2.5–2.9', () => {
    const r = classifyK(2.7);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('moderate');
  });
  it('hypo berat: < 2.5', () => {
    const r = classifyK(2.0);
    expect(r.severity).toBe('severe');
  });
  it('hyper ringan: 5.6–6.0', () => {
    expect(classifyK(5.8).severity).toBe('mild');
  });
  it('hyper sedang: 6.1–6.5', () => {
    expect(classifyK(6.3).severity).toBe('moderate');
  });
  it('hyper berat: > 6.5', () => {
    expect(classifyK(7.0).severity).toBe('severe');
  });
});

describe('calcKDose', () => {
  it('anak 10 kg → 2–5 mEq', () => {
    const r = calcKDose(10);
    expect(r.lowMeq).toBe(2.0);
    expect(r.highMeq).toBe(5.0);
  });
  it('anak 5 kg → 1–2.5 mEq', () => {
    const r = calcKDose(5);
    expect(r.lowMeq).toBe(1.0);
    expect(r.highMeq).toBe(2.5);
  });
});

// ── Calcium ────────────────────────────────────────────────────────────────
describe('classifyCaTotal', () => {
  it('normal: 8.5–10.5', () => {
    expect(classifyCaTotal(9.0).status).toBe('normal');
    expect(classifyCaTotal(8.5).status).toBe('normal');
    expect(classifyCaTotal(10.5).status).toBe('normal');
  });
  it('hypo ringan: 7.5–8.4', () => {
    const r = classifyCaTotal(8.0);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('mild');
  });
  it('hypo sedang: 7.0–7.4', () => {
    expect(classifyCaTotal(7.2).severity).toBe('moderate');
  });
  it('hypo berat: < 7.0', () => {
    expect(classifyCaTotal(6.5).severity).toBe('severe');
  });
  it('hyper ringan: 10.6–12.0', () => {
    expect(classifyCaTotal(11.0).status).toBe('hyper');
    expect(classifyCaTotal(11.0).severity).toBe('mild');
  });
});

describe('classifyCaIonized', () => {
  it('normal: 1.12–1.32', () => {
    expect(classifyCaIonized(1.2).status).toBe('normal');
  });
  it('hypo berat: < 0.75', () => {
    expect(classifyCaIonized(0.6).severity).toBe('severe');
  });
  it('hyper sedang: 1.5–1.75', () => {
    const r = classifyCaIonized(1.6);
    expect(r.status).toBe('hyper');
    expect(r.severity).toBe('moderate');
  });
});

describe('calcCaGluconateVol', () => {
  it('anak 10 kg → 5–10 mL', () => {
    const r = calcCaGluconateVol(10);
    expect(r.lowMl).toBe(5);
    expect(r.highMl).toBe(10);
  });
  it('cap di 20 mL (anak 30 kg)', () => {
    const r = calcCaGluconateVol(30);
    expect(r.highMl).toBe(20);
  });
});

describe('correctCaForAlbumin', () => {
  it('Ca 7.0 + albumin 2.0 → terkoreksi 8.6', () => {
    // 7.0 + 0.8 × (4 - 2.0) = 7.0 + 1.6 = 8.6
    expect(correctCaForAlbumin(7.0, 2.0)).toBe(8.6);
  });
  it('albumin normal (4.0) → tidak ada koreksi', () => {
    expect(correctCaForAlbumin(8.0, 4.0)).toBe(8.0);
  });
});

// ── Magnesium ──────────────────────────────────────────────────────────────
describe('classifyMg', () => {
  it('normal: 1.7–2.4', () => {
    expect(classifyMg(2.0).status).toBe('normal');
  });
  it('hypo ringan: 1.2–1.6', () => {
    const r = classifyMg(1.5);
    expect(r.status).toBe('hypo');
    expect(r.severity).toBe('mild');
  });
  it('hypo sedang: 0.8–1.1', () => {
    expect(classifyMg(1.0).severity).toBe('moderate');
  });
  it('hypo berat: < 0.8', () => {
    expect(classifyMg(0.5).severity).toBe('severe');
  });
  it('hyper berat: > 7.0', () => {
    expect(classifyMg(8.0).severity).toBe('severe');
  });
});

describe('calcMgSO4Vol', () => {
  it('anak 10 kg → 250–500 mg, 0.5–1.0 mL', () => {
    const r = calcMgSO4Vol(10);
    expect(r.lowMg).toBe(250);
    expect(r.highMg).toBe(500);
    expect(r.lowMl).toBe(0.5);
    expect(r.highMl).toBe(1.0);
  });
  it('cap di 2000 mg (anak 50 kg)', () => {
    const r = calcMgSO4Vol(50);
    expect(r.highMg).toBe(2000);
    expect(r.highMl).toBe(4.0);
  });
  it('berat lebih besar → dosis lebih besar (sebelum cap)', () => {
    expect(calcMgSO4Vol(20).lowMg).toBeGreaterThan(calcMgSO4Vol(10).lowMg);
  });
});
