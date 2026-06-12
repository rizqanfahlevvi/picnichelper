import { describe, it, expect } from 'vitest';
import { checkVitals, VITAL_RANGES } from './vitalSigns';

const infant = VITAL_RANGES.find(r => r.ageGroup === 'infant')!;
const school  = VITAL_RANGES.find(r => r.ageGroup === 'school')!;

describe('checkVitals — bayi', () => {
  it('HR normal 130 → normal', () => {
    expect(checkVitals(infant, { hr: 130 }).hr).toBe('normal');
  });

  it('HR 70 pada bayi → low', () => {
    expect(checkVitals(infant, { hr: 70 }).hr).toBe('low');
  });

  it('HR 180 pada bayi → high', () => {
    expect(checkVitals(infant, { hr: 180 }).hr).toBe('high');
  });

  it('RR 35 → normal', () => {
    expect(checkVitals(infant, { rr: 35 }).rr).toBe('normal');
  });

  it('SpO2 94 → low', () => {
    expect(checkVitals(infant, { spo2: 94 }).spo2).toBe('low');
  });

  it('SpO2 98 → normal', () => {
    expect(checkVitals(infant, { spo2: 98 }).spo2).toBe('normal');
  });
});

describe('checkVitals — anak sekolah', () => {
  it('SBP 100 → normal', () => {
    expect(checkVitals(school, { sbp: 100 }).sbp).toBe('normal');
  });

  it('SBP 60 → low', () => {
    expect(checkVitals(school, { sbp: 60 }).sbp).toBe('low');
  });
});

describe('checkVitals — field kosong', () => {
  it('field tidak diisi → null', () => {
    const r = checkVitals(infant, {});
    expect(r.hr).toBeNull();
    expect(r.rr).toBeNull();
  });
});
