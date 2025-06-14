import { describe, expect, it } from '@jest/globals';
import { Curve, UnsupportedCurveError } from '@road-labs/ocmf-crypto';
import { buildPublicKeyTestCases, isValidPublicKey } from 'test-commons';
import { EcPublicKey } from '../src';

const unsupported: Curve[] = [
  'brainpool256r1',
  'brainpool384r1',
  'secp192r1',
  'secp192k1',
  'secp256k1',
];
const curves: Curve[] = ['secp256r1', 'secp384r1'];

describe('EcPublicKey', () => {
  describe('fromEncoded', () => {
    it.each(buildPublicKeyTestCases(curves))(
      'supports $name',
      async ({ curve, spki }) => {
        const publicKey = await EcPublicKey.fromEncoded(spki, 'spki-der');
        expect(publicKey.getCurve()).toEqual(curve);
      }
    );

    it.each(buildPublicKeyTestCases(unsupported))(
      'does not support $name',
      async ({ curve, spki }) => {
        await expect(EcPublicKey.fromEncoded(spki, 'spki-der')).rejects.toThrow(
          UnsupportedCurveError
        );
      }
    );
  });

  describe('encode', () => {
    it.each(buildPublicKeyTestCases(curves))(
      'encodes $name',
      async ({ spki, curve }) => {
        const publicKey = await (
          await EcPublicKey.fromEncoded(spki, 'spki-der')
        ).encode('spki-der');
        expect(publicKey).toEqual(spki);
        expect(isValidPublicKey(publicKey, curve)).toEqual(true);
      }
    );
  });
});
