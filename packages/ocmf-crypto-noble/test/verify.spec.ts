import { describe, expect, it } from '@jest/globals';
import { buildVerifyTestCases } from 'test-commons';
import { EcPublicKey, verify } from '../src';
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
  it.each(buildVerifyTestCases(curves))(
    '$name',
    ({ signature, data, hash, spki, expected }) => {
      const publicKey = EcPublicKey.fromEncoded(spki, 'spki-der');
      const actual = verify(signature, data, publicKey, hash, format);
      expect(actual).toEqual(expected);
    }
  );
});
