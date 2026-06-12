import { describe, it, expect } from 'vitest';
import { ettDepthByAge, ettDepthByTubeId, ettDepthByWeight } from './ettDepth';

describe('ettDepthByAge', () => {
  it('usia 4 th → 14 cm', () => expect(ettDepthByAge(4)).toBe(14));
  it('usia 8 th → 16 cm', () => expect(ettDepthByAge(8)).toBe(16));
  it('usia 2 th → 13 cm', () => expect(ettDepthByAge(2)).toBe(13));
  it('melempar error bila NaN', () => expect(() => ettDepthByAge(NaN)).toThrow());
});

describe('ettDepthByTubeId', () => {
  it('ID 4.0 mm → 12 cm', () => expect(ettDepthByTubeId(4.0)).toBe(12));
  it('ID 5.0 mm → 15 cm', () => expect(ettDepthByTubeId(5.0)).toBe(15));
  it('ID 3.5 mm → 10.5 cm', () => expect(ettDepthByTubeId(3.5)).toBe(10.5));
  it('melempar error bila 0', () => expect(() => ettDepthByTubeId(0)).toThrow());
});

describe('ettDepthByWeight', () => {
  it('1.5 kg → 7.5 cm', () => expect(ettDepthByWeight(1.5)).toBe(7.5));
  it('3.0 kg → 9 cm',   () => expect(ettDepthByWeight(3.0)).toBe(9));
  it('melempar error bila ≤ 0', () => expect(() => ettDepthByWeight(0)).toThrow());
});
