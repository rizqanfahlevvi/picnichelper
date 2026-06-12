import { describe, it, expect } from 'vitest';
import { calculatePsofa } from './psofa';

const baseline: Parameters<typeof calculatePsofa>[0] = {
  pf: 450, onVentilator: false,
  plateletsE3PerMcL: 200,
  bilirubinMgDl: 0.8,
  dopamineDose: 0, epinephrineDose: 0, norepinephrineDose: 0, dobutamineDose: 0,
  gcs: 15,
  creatinineMgDl: 0.4, ageMonths: 24,
};

describe('calculatePsofa — baseline normal', () => {
  it('semua normal → total 0, ringan', () => {
    const r = calculatePsofa(baseline);
    expect(r.total).toBe(0);
    expect(r.severityLabel).toBe('ringan');
  });
});

describe('calculatePsofa — respirasi', () => {
  it('P/F 80 on ventilator → skor 4', () => {
    const resp = calculatePsofa({ ...baseline, pf: 80, onVentilator: true })
      .organScores.find(o => o.organ === 'Respirasi')!;
    expect(resp.score).toBe(4);
  });
  it('P/F 250 tanpa ventilator → skor 1', () => {
    const resp = calculatePsofa({ ...baseline, pf: 250, onVentilator: false })
      .organScores.find(o => o.organ === 'Respirasi')!;
    expect(resp.score).toBe(1);
  });
});

describe('calculatePsofa — koagulasi', () => {
  it('trombosit 15 → skor 4', () => {
    const co = calculatePsofa({ ...baseline, plateletsE3PerMcL: 15 })
      .organScores.find(o => o.organ === 'Koagulasi')!;
    expect(co.score).toBe(4);
  });
});

describe('calculatePsofa — kardiovaskular', () => {
  it('epinefrin 0.2 → skor 4', () => {
    const cv = calculatePsofa({ ...baseline, epinephrineDose: 0.2 })
      .organScores.find(o => o.organ === 'Kardiovaskular')!;
    expect(cv.score).toBe(4);
  });
  it('dopamin 3 → skor 1', () => {
    const cv = calculatePsofa({ ...baseline, dopamineDose: 3 })
      .organScores.find(o => o.organ === 'Kardiovaskular')!;
    expect(cv.score).toBe(1);
  });
});

describe('calculatePsofa — severity', () => {
  it('total 7 → berat', () => {
    const r = calculatePsofa({
      ...baseline,
      pf: 80, onVentilator: true,         // +4
      plateletsE3PerMcL: 15,              // +4 → total ≥ 7
    });
    expect(r.severityLabel).toBe('berat');
  });
});

describe('calculatePsofa — validasi', () => {
  it('GCS 2 → error', () => {
    expect(() => calculatePsofa({ ...baseline, gcs: 2 })).toThrow();
  });
});
