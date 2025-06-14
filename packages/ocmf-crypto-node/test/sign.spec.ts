import { describe, expect, it } from '@jest/globals';
import { buildSignTestCases, isValidSignature } from 'test-commons';
import { EcPrivateKey, sign } from '../src';
import { Curve } from '@road-labs/ocmf-crypto';

const format = 'sigvalue-der';
const curves: Curve[] = [
  'brainpool256r1',
  'brainpool384r1',
  'secp192r1',
  'secp192k1',
  'secp256k1',
  'secp256r1',
  'secp384r1',
];

describe('verify', () => {
  it.each(buildSignTestCases(curves))(
    '$name',
    async ({ curve, data, hash, pkcs8 }) => {
      const privateKey = EcPrivateKey.fromEncoded(pkcs8, 'pkcs8-der');
      const signature = sign(data, privateKey, hash, format);
      expect(isValidSignature(signature, curve)).toEqual(true);
    }
  );
});
