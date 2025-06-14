import { describe, expect, it } from '@jest/globals';
import { Curve, UnsupportedCurveError } from '@road-labs/ocmf-crypto';
import { buildPrivateKeyTestCases } from 'test-commons';
import { EcPrivateKey } from '../src';

const unsupported: Curve[] = [
  'brainpool256r1',
  'brainpool384r1',
  'secp192r1',
  'secp192k1',
  'secp256k1',
];
const curves: Curve[] = ['secp256r1', 'secp384r1'];

describe('EcPrivateKey', () => {
  describe('fromEncoded', () => {
    it.each(buildPrivateKeyTestCases(curves))(
      'supports $name',
      async ({ curve, pkcs8 }) => {
        const privateKey = await EcPrivateKey.fromEncoded(pkcs8, 'pkcs8-der');
        expect(privateKey.getCurve()).toEqual(curve);
      }
    );

    it.each(buildPrivateKeyTestCases(unsupported))(
      'does not support $name',
      async ({ curve, pkcs8 }) => {
        await expect(
          EcPrivateKey.fromEncoded(pkcs8, 'pkcs8-der')
        ).rejects.toThrow(UnsupportedCurveError);
      }
    );
  });

  describe('getPublicKey', () => {
    it.each(buildPrivateKeyTestCases(curves))(
      'can derive a public key for $name',
      async ({ curve, pkcs8, spki }) => {
        const publicKey = (
          await EcPrivateKey.fromEncoded(pkcs8, 'pkcs8-der')
        ).getPublicKey();
        expect(publicKey?.getCurve()).toEqual(curve);
        expect(await publicKey?.encode('spki-der')).toEqual(spki);
      }
    );
  });
});
