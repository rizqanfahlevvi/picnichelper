import { describe, it, expect } from 'vitest';
import { interpretAbg } from './abg';

describe('interpretAbg — gangguan primer', () => {
  it('asidosis metabolik: pH 7.20, PaCO₂ 30, HCO₃ 11', () => {
    const r = interpretAbg({ pH: 7.20, paCO2: 30, hco3: 11 });
    expect(r.primaryDisorder).toBe('metabolic_acidosis');
  });

  it('alkalosis metabolik: pH 7.50, PaCO₂ 48, HCO₃ 36', () => {
    const r = interpretAbg({ pH: 7.50, paCO2: 48, hco3: 36 });
    expect(r.primaryDisorder).toBe('metabolic_alkalosis');
  });

  it('asidosis respiratorik: pH 7.28, PaCO₂ 60, HCO₃ 28', () => {
    const r = interpretAbg({ pH: 7.28, paCO2: 60, hco3: 28 });
    expect(r.primaryDisorder).toBe('respiratory_acidosis');
  });

  it('alkalosis respiratorik: pH 7.52, PaCO₂ 28, HCO₃ 22', () => {
    const r = interpretAbg({ pH: 7.52, paCO2: 28, hco3: 22 });
    expect(r.primaryDisorder).toBe('respiratory_alkalosis');
  });

  it('normal: pH 7.40, PaCO₂ 40, HCO₃ 24', () => {
    const r = interpretAbg({ pH: 7.40, paCO2: 40, hco3: 24 });
    expect(r.primaryDisorder).toBe('normal');
    expect(r.compensationStatus).toBe('not_applicable');
  });
});

describe('interpretAbg — kompensasi Boston Rules', () => {
  it('asidosis metabolik HCO₃=11 → ekspektasi PaCO₂ ≈24.5±2 (Winter)', () => {
    // 1.5×11+8 = 24.5; rentang 22.5–26.5
    const r = interpretAbg({ pH: 7.20, paCO2: 24, hco3: 11 });
    expect(r.primaryDisorder).toBe('metabolic_acidosis');
    expect(r.expectedCompensation?.low).toBeCloseTo(22.5);
    expect(r.expectedCompensation?.high).toBeCloseTo(26.5);
    expect(r.compensationStatus).toBe('adequate');
  });

  it('asidosis metabolik dengan PaCO₂ terlalu tinggi → kompensasi kurang', () => {
    // HCO₃=11, ekspektasi PaCO₂ 22.5–26.5; PaCO₂=35 terlalu tinggi
    const r = interpretAbg({ pH: 7.25, paCO2: 35, hco3: 11 });
    expect(r.compensationStatus).toBe('under');
  });

  it('alkalosis metabolik HCO₃=36 → ekspektasi PaCO₂ ≈46.2±2', () => {
    // 0.7×36+21 = 46.2; rentang 44.2–48.2
    const r = interpretAbg({ pH: 7.50, paCO2: 46, hco3: 36 });
    expect(r.compensationStatus).toBe('adequate');
  });

  it('asidosis respiratorik akut: PaCO₂=60, HCO₃=26 → adequate (rentang lebar)', () => {
    // ΔCO₂=20; akut HCO₃ ~24+2=26; kronik ~24+7=31
    const r = interpretAbg({ pH: 7.28, paCO2: 60, hco3: 26 });
    expect(r.primaryDisorder).toBe('respiratory_acidosis');
    expect(r.compensationStatus).toBe('adequate');
  });

  it('alkalosis respiratorik akut: PaCO₂=28, HCO₃=22 → adequate', () => {
    // ΔCO₂=12; akut HCO₃ ~24-2.4=21.6; kronik ~24-6=18
    const r = interpretAbg({ pH: 7.52, paCO2: 28, hco3: 22 });
    expect(r.primaryDisorder).toBe('respiratory_alkalosis');
    expect(r.compensationStatus).toBe('adequate');
  });
});

describe('interpretAbg — validasi input', () => {
  it('melempar error bila pH < 6.5', () => {
    expect(() => interpretAbg({ pH: 6.0, paCO2: 40, hco3: 24 })).toThrow();
  });

  it('melempar error bila PaCO₂ = 0', () => {
    expect(() => interpretAbg({ pH: 7.40, paCO2: 0, hco3: 24 })).toThrow();
  });

  it('melempar error bila HCO₃ negatif', () => {
    expect(() => interpretAbg({ pH: 7.40, paCO2: 40, hco3: -1 })).toThrow();
  });
});
