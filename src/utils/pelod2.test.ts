import { describe, it, expect } from 'vitest';
import { calculatePelod2 } from './pelod2';

const baseline: Parameters<typeof calculatePelod2>[0] = {
  gcs: 15, pupils: 'both_react',
  lactateMmolL: 1.0, mapMmHg: 70, ageMonths: 24,
  creatinineMgDl: 0.4,
  pf: 400, onVentilator: false, paCO2MmHg: 40,
  wbcE3PerMcL: 8, plateletsE3PerMcL: 200,
  bilirubinMgDl: 1.0,
};

describe('calculatePelod2 — baseline normal', () => {
  it('semua normal → total 0, mortalitas sangat rendah', () => {
    const r = calculatePelod2(baseline);
    expect(r.total).toBe(0);
    expect(r.estimatedMortalityPercent).toBeLessThan(2);
  });
});

describe('calculatePelod2 — neurologi', () => {
  it('GCS 4, kedua pupil fixed → skor tinggi', () => {
    const r = calculatePelod2({ ...baseline, gcs: 4, pupils: 'both_fixed' });
    const neuro = r.organScores.find(o => o.organ === 'Neurologi')!;
    // GCS≤5 → 5pts, both_fixed → 4pts = 9pts
    expect(neuro.score).toBe(9);
  });

  it('GCS 11, satu pupil fixed → skor 3', () => {
    const r = calculatePelod2({ ...baseline, gcs: 11, pupils: 'one_fixed' });
    const neuro = r.organScores.find(o => o.organ === 'Neurologi')!;
    // GCS 11 → 1pt, one_fixed → 2pts = 3pts
    expect(neuro.score).toBe(3);
  });
});

describe('calculatePelod2 — kardiovaskular', () => {
  it('laktat 6 mmol/L → 2 poin laktat', () => {
    const r = calculatePelod2({ ...baseline, lactateMmolL: 6 });
    const cardio = r.organScores.find(o => o.organ === 'Kardiovaskular')!;
    expect(cardio.score).toBeGreaterThanOrEqual(2);
  });
});

describe('calculatePelod2 — respirasi ventilasi', () => {
  it('P/F 80, on ventilator → skor 3', () => {
    const r = calculatePelod2({ ...baseline, pf: 80, onVentilator: true, paCO2MmHg: 40 });
    const resp = r.organScores.find(o => o.organ === 'Respirasi')!;
    expect(resp.score).toBe(3);
  });
});

describe('calculatePelod2 — validasi', () => {
  it('GCS > 15 → error', () => {
    expect(() => calculatePelod2({ ...baseline, gcs: 16 })).toThrow();
  });
  it('laktat negatif → error', () => {
    expect(() => calculatePelod2({ ...baseline, lactateMmolL: -1 })).toThrow();
  });
});
