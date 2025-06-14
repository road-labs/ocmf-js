import { describe, expect, it } from '@jest/globals';
import { Curve } from '@road-labs/ocmf-crypto';
import { buildPublicKeyTestCases, isValidPublicKey } from 'test-commons';
import { EcPublicKey } from '../src';

const curves: Curve[] = [
  'brainpool256r1',
  'brainpool384r1',
  'secp192r1',
  'secp192k1',
  'secp256k1',
  'secp256r1',
  'secp384r1',
];

describe('EcPublicKey', () => {
  describe('fromEncoded', () => {
    it.each(buildPublicKeyTestCases(curves))(
      'supports $name',
      ({ curve, spki }) => {
        const publicKey = EcPublicKey.fromEncoded(spki, 'spki-der');
        expect(publicKey.getCurve()).toEqual(curve);
      }
    );
  });

  describe('encode', () => {
    it.each(buildPublicKeyTestCases(curves))(
      'encodes $name',
      ({ spki, curve }) => {
        const publicKey = EcPublicKey.fromEncoded(spki, 'spki-der').encode(
          'spki-der'
        );
        expect(publicKey).toEqual(spki);
        expect(isValidPublicKey(publicKey, curve)).toEqual(true);
      }
    );
  });
});
