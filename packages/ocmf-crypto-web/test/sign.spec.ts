import { describe, expect, it } from '@jest/globals';
import { buildSignTestCases, isValidSignature } from 'test-commons';
import { EcPrivateKey, sign } from '../src';
import { Curve } from '@road-labs/ocmf-crypto';

const format = 'sigvalue-der';
const curves: Curve[] = ['secp256r1', 'secp384r1'];

describe('verify', () => {
  it.each(buildSignTestCases(curves))(
    '$name',
    async ({ curve, data, hash, pkcs8 }) => {
      const privateKey = await EcPrivateKey.fromEncoded(pkcs8, 'pkcs8-der');
      const signature = await sign(data, privateKey, hash, format);
      expect(isValidSignature(signature, curve)).toEqual(true);
    }
  );
});
