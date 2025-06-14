import { beforeEach, describe, expect, it } from '@jest/globals';
import { CryptoAdapter, EcPublicKey } from '@road-labs/ocmf-crypto';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  CurveMismatchError,
  UnknownSignatureEncoding,
  UnknownSignatureMimeType,
  Verifier,
} from '../src';
import { hexToBytes } from 'test-commons';

const signedData = `OCMF|{"FV":"1.0","GI":"TEST","GS":"1234567","GV":"1.0.0","PG":"T1","MV":"MV","MM":"MM","MS":"1234567","MF":"1.0","IS":true,"IL":"VERIFIED","IF":["RFID_PLAIN","OCPP_RS_TLS"],"IT":"ISO14443","ID":"79A94A26862469","CI":"CSONE","CT":"CBIDC","RD":[{"TM":"2025-06-14T08:44:54,562+0100 S","TX":"B","RV":0.75727,"RI":"1-b","RU":"kWh","ST":"G"},{"TM":"2025-06-14T11:44:54,562+0100 S","TX":"E","RV":3.12961,"RI":"1-b","RU":"kWh","ST":"G"}]}|{"SA":"ECDSA-secp256r1-SHA256","SD":"0102030A"}`;
const hexPayloadData =
  '7b224656223a22312e30222c224749223a2254455354222c224753223a2231323334353637222c224756223a22312e302e30222c225047223a225431222c224d56223a224d56222c224d4d223a224d4d222c224d53223a2231323334353637222c224d46223a22312e30222c224953223a747275652c22494c223a225645524946494544222c224946223a5b22524649445f504c41494e222c224f4350505f52535f544c53225d2c224954223a2249534f3134343433222c224944223a223739413934413236383632343639222c224349223a2243534f4e45222c224354223a224342494443222c225244223a5b7b22544d223a22323032352d30362d31345430383a34343a35342c3536322b303130302053222c225458223a2242222c225256223a302e37353732372c225249223a22312d62222c225255223a226b5768222c225354223a2247227d2c7b22544d223a22323032352d30362d31345431313a34343a35342c3536322b303130302053222c225458223a2245222c225256223a332e31323936312c225249223a22312d62222c225255223a226b5768222c225354223a2247227d5d7d';

describe('Verifier', () => {
  let publicKey: MockProxy<EcPublicKey>;
  let crypto: MockProxy<CryptoAdapter>;
  let verifier: Verifier;

  beforeEach(() => {
    publicKey = mock<EcPublicKey>();
    crypto = mock<CryptoAdapter>();
    verifier = new Verifier(crypto);
  });

  it('throws if the private key curve does not align with the signature', async () => {
    publicKey.getCurve.mockReturnValue('secp192r1');
    await expect(() =>
      verifier.parseAndVerify(signedData, publicKey)
    ).rejects.toThrow(CurveMismatchError);
  });

  it('throws if the signature is encoded with an unknown type', async () => {
    publicKey.getCurve.mockReturnValue('secp256r1');
    const signedData = `OCMF|{"FV":"1.0"}|{"SE":"foo","SA":"ECDSA-secp256r1-SHA256","SD":"0102030A"}`;

    await expect(() =>
      verifier.parseAndVerify(signedData, publicKey)
    ).rejects.toThrow(UnknownSignatureEncoding);
  });

  it('throws if the signature is encoded with an unknown mime type', async () => {
    publicKey.getCurve.mockReturnValue('secp256r1');
    const signedData = `OCMF|{"FV":"1.0"}|{"SM":"foo","SA":"ECDSA-secp256r1-SHA256","SD":"0102030A"}`;

    await expect(() =>
      verifier.parseAndVerify(signedData, publicKey)
    ).rejects.toThrow(UnknownSignatureMimeType);
  });

  it('signs via the crypto adapter and returns a composed value', async () => {
    publicKey.getCurve.mockReturnValue('secp256r1');
    crypto.verify.mockReturnValue(true);
    const actual = await verifier.parseAndVerify(signedData, publicKey);
    const expected = {
      verified: true,
      value: {
        header: 'OCMF',
        payloadData: {
          FV: '1.0',
          GI: 'TEST',
          GS: '1234567',
          GV: '1.0.0',
          PG: 'T1',
          MV: 'MV',
          MM: 'MM',
          MS: '1234567',
          MF: '1.0',
          IS: true,
          IL: 'VERIFIED',
          IF: ['RFID_PLAIN', 'OCPP_RS_TLS'],
          IT: 'ISO14443',
          ID: '79A94A26862469',
          CI: 'CSONE',
          CT: 'CBIDC',
          RD: [
            {
              TM: '2025-06-14T08:44:54,562+0100 S',
              TX: 'B',
              RV: 0.75727,
              RI: '1-b',
              RU: 'kWh',
              ST: 'G',
            },
            {
              TM: '2025-06-14T11:44:54,562+0100 S',
              TX: 'E',
              RV: 3.12961,
              RI: '1-b',
              RU: 'kWh',
              ST: 'G',
            },
          ],
        },
        signature: {
          SA: 'ECDSA-secp256r1-SHA256',
          SD: '0102030A',
        },
      },
    };
    expect(actual).toEqual(expected);
    expect(crypto.verify).toHaveBeenCalledWith(
      hexToBytes('0102030A'),
      hexToBytes(hexPayloadData),
      publicKey,
      'SHA-256',
      'sigvalue-der'
    );
  });
});
