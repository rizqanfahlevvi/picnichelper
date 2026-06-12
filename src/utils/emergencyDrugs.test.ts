import { describe, it, expect } from 'vitest';
import { calculateDose, EMERGENCY_DRUGS } from './emergencyDrugs';

const epiArrest     = EMERGENCY_DRUGS.find(d => d.id === 'epi_arrest')!;
const atropine      = EMERGENCY_DRUGS.find(d => d.id === 'atropine')!;
const adenosine1    = EMERGENCY_DRUGS.find(d => d.id === 'adenosine_1')!;
const amiodarone    = EMERGENCY_DRUGS.find(d => d.id === 'amiodarone')!;

describe('calculateDose — epinefrin arrest', () => {
  it('10 kg → 0.1 mg (dalam batas)', () => {
    const r = calculateDose(epiArrest, 10);
    expect(r.clampedDose).toBeCloseTo(0.1);
    expect(r.isClamped).toBe(false);
  });
  it('120 kg → clamp ke max 1 mg', () => {
    const r = calculateDose(epiArrest, 120);
    expect(r.clampedDose).toBe(1);
    expect(r.clampReason).toBe('max');
  });
  it('melempar error bila berat 0', () => {
    expect(() => calculateDose(epiArrest, 0)).toThrow();
  });
});

describe('calculateDose — atropin (min dose)', () => {
  it('3 kg → clamp ke min 0.1 mg (raw 0.06)', () => {
    const r = calculateDose(atropine, 3);
    expect(r.rawDose).toBeCloseTo(0.06);
    expect(r.clampedDose).toBe(0.1);
    expect(r.clampReason).toBe('min');
  });
  it('15 kg → 0.3 mg (dalam batas)', () => {
    const r = calculateDose(atropine, 15);
    expect(r.clampedDose).toBeCloseTo(0.3);
    expect(r.isClamped).toBe(false);
  });
  it('30 kg → clamp ke max 0.5 mg (raw 0.6)', () => {
    const r = calculateDose(atropine, 30);
    expect(r.clampedDose).toBe(0.5);
    expect(r.clampReason).toBe('max');
  });
});

describe('calculateDose — adenosin SVT dosis 1', () => {
  it('20 kg → 2 mg', () => {
    expect(calculateDose(adenosine1, 20).clampedDose).toBeCloseTo(2);
  });
  it('70 kg → clamp ke max 6 mg', () => {
    const r = calculateDose(adenosine1, 70);
    expect(r.clampedDose).toBe(6);
    expect(r.clampReason).toBe('max');
  });
});

describe('calculateDose — amiodaron', () => {
  it('10 kg → 50 mg', () => {
    expect(calculateDose(amiodarone, 10).clampedDose).toBe(50);
  });
  it('70 kg → clamp ke max 300 mg', () => {
    expect(calculateDose(amiodarone, 70).clampedDose).toBe(300);
  });
});
