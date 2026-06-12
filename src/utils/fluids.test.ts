import { describe, it, expect } from 'vitest';
import { calculateMaintenance, calculateResuscitationBolus, calculateDehydrationCorrection } from './fluids';

describe('calculateMaintenance — Holliday-Segar', () => {
  it('10 kg → 40 mL/jam', () => {
    const r = calculateMaintenance(10);
    expect(r.mlPerHour).toBe(40);
    expect(r.mlPer24Hours).toBe(960);
  });

  it('5 kg → 20 mL/jam', () => {
    expect(calculateMaintenance(5).mlPerHour).toBe(20);
  });

  it('15 kg → 50 mL/jam', () => {
    // 40 + 2×5 = 50
    expect(calculateMaintenance(15).mlPerHour).toBe(50);
  });

  it('30 kg → 70 mL/jam', () => {
    // 60 + 1×10 = 70
    expect(calculateMaintenance(30).mlPerHour).toBe(70);
  });

  it('melempar error bila berat 0', () => {
    expect(() => calculateMaintenance(0)).toThrow();
  });

  it('melempar error bila berat > 100 kg', () => {
    expect(() => calculateMaintenance(110)).toThrow();
  });
});

describe('calculateResuscitationBolus', () => {
  it('20 mL/kg, 10 kg → 200 mL', () => {
    expect(calculateResuscitationBolus(10, 20).bolusMl).toBe(200);
  });

  it('10 mL/kg, 5 kg → 50 mL', () => {
    expect(calculateResuscitationBolus(5, 10).bolusMl).toBe(50);
  });

  it('twoBolusMl adalah 2x bolusMl', () => {
    const r = calculateResuscitationBolus(10, 20);
    expect(r.twoBolusMl).toBe(r.bolusMl * 2);
  });
});

describe('calculateDehydrationCorrection', () => {
  it('dehidrasi sedang 10 kg → defisit 1000 mL', () => {
    // 10% × 10 kg × 1000 = 1000 mL
    expect(calculateDehydrationCorrection(10, 'sedang').deficitMl).toBe(1000);
  });

  it('total = defisit + maintenance 24 jam', () => {
    const r = calculateDehydrationCorrection(10, 'sedang');
    const maint = calculateMaintenance(10).mlPer24Hours;
    expect(r.totalMl).toBe(Math.round(1000 + maint));
  });
});
