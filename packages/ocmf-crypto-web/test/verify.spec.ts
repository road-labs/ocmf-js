import { describe, expect, it } from '@jest/globals';
import { buildVerifyTestCases } from 'test-commons';
import { EcPublicKey, verify } from '../src';
import { Curve } from '@road-labs/ocmf-crypto';

const format = 'sigvalue-der';
const curves: Curve[] = ['secp256r1', 'secp384r1'];

describe('verify', () => {
  it.each(buildVerifyTestCases(curves))(
    '$name',
    async ({ curve, signature, data, hash, spki, expected }) => {
      const publicKey = await EcPublicKey.fromEncoded(spki, 'spki-der');
      const actual = await verify(signature, data, publicKey, hash, format);
      expect(actual).toEqual(expected);
    }
  );
});
