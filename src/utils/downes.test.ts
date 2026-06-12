import { describe, it, expect } from 'vitest';
import { calculateDownes } from './downes';

describe('calculateDownes', () => {
  it('semua 0 → total 0, ringan', () => {
    const r = calculateDownes({ respiratoryRate: 0, retractions: 0, cyanosis: 0, airEntry: 0, grunting: 0 });
    expect(r.total).toBe(0);
    expect(r.severity).toBe('ringan');
  });

  it('total 2 → batas atas ringan', () => {
    const r = calculateDownes({ respiratoryRate: 1, retractions: 1, cyanosis: 0, airEntry: 0, grunting: 0 });
    expect(r.total).toBe(2);
    expect(r.severity).toBe('ringan');
  });

  it('total 3 → sedang', () => {
    const r = calculateDownes({ respiratoryRate: 1, retractions: 1, cyanosis: 1, airEntry: 0, grunting: 0 });
    expect(r.total).toBe(3);
    expect(r.severity).toBe('sedang');
  });

  it('total 5 → batas atas sedang', () => {
    const r = calculateDownes({ respiratoryRate: 2, retractions: 1, cyanosis: 1, airEntry: 1, grunting: 0 });
    expect(r.total).toBe(5);
    expect(r.severity).toBe('sedang');
  });

  it('total 6 → berat', () => {
    const r = calculateDownes({ respiratoryRate: 2, retractions: 2, cyanosis: 1, airEntry: 1, grunting: 0 });
    expect(r.total).toBe(6);
    expect(r.severity).toBe('berat');
  });

  it('semua 2 → total 10, berat', () => {
    const r = calculateDownes({ respiratoryRate: 2, retractions: 2, cyanosis: 2, airEntry: 2, grunting: 2 });
    expect(r.total).toBe(10);
    expect(r.severity).toBe('berat');
  });
});
