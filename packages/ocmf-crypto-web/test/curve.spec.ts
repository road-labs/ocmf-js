import { getGroupOrderSize, mapCurveToWebCryptoCurve } from '../src';
import { Curve } from '@road-labs/ocmf-crypto';
import { describe, expect, it } from '@jest/globals';

describe('mapCurveToWebCryptoCurve', () => {
  const testCases: { curve: Curve; expected: string }[] = [
    { curve: 'secp256r1', expected: 'P-256' },
    { curve: 'secp384r1', expected: 'P-384' },
  ];

  it.each(testCases)(
    'should return $expected for curve $curve',
    ({ curve, expected }) => {
      const actual = mapCurveToWebCryptoCurve(curve);
      expect(actual).toBe(expected);
    }
  );

  it('throws if the curve is not supported', () => {
    expect(() => mapCurveToWebCryptoCurve('brainpool384r1')).toThrow();
  });
});

describe('getGroupOrderSize', () => {
  const testCases: { curve: Curve; expected: number }[] = [
    { curve: 'secp256r1', expected: 32 },
    { curve: 'secp384r1', expected: 48 },
  ];

  it.each(testCases)(
    'should return $expected for curve $curve',
    ({ curve, expected }) => {
      const actual = getGroupOrderSize(curve);
      expect(actual).toBe(expected);
    }
  );

  it('throws if the curve is not supported', () => {
    expect(() => getGroupOrderSize('brainpool384r1')).toThrow();
  });
});
