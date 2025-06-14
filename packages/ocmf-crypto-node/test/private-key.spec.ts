import { describe, expect, it } from '@jest/globals';
import { Curve } from '@road-labs/ocmf-crypto';
import { buildPrivateKeyTestCases } from 'test-commons';
import { EcPrivateKey } from '../src';

const curves: Curve[] = [
  'brainpool256r1',
  'brainpool384r1',
  'secp192r1',
  'secp192k1',
  'secp256k1',
  'secp256r1',
  'secp384r1',
];

describe('EcPrivateKey', () => {
  describe('fromEncoded', () => {
    it.each(buildPrivateKeyTestCases(curves))(
      'supports $name',
      ({ curve, pkcs8 }) => {
        const privateKey = EcPrivateKey.fromEncoded(pkcs8, 'pkcs8-der');
        expect(privateKey.getCurve()).toEqual(curve);
      }
    );
  });

  describe('getPublicKey', () => {
    it.each(buildPrivateKeyTestCases(curves))(
      'can derive a public key for $name',
      ({ curve, pkcs8, spki }) => {
        const publicKey = EcPrivateKey.fromEncoded(
          pkcs8,
          'pkcs8-der'
        ).getPublicKey();
        expect(publicKey?.getCurve()).toEqual(curve);
        expect(publicKey?.encode('spki-der')).toEqual(spki);
      }
    );
  });
});
