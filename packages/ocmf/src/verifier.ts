import { SignedData } from './types';
import { signatureMethodFromId } from './signature';
import { decomposeValue, parseSections } from './parse';
import { CryptoAdapter, EcPublicKey } from '@road-labs/ocmf-crypto';
import {
  CurveMismatchError,
  UnknownSignatureEncoding,
  UnknownSignatureMimeType,
} from './errors';

export interface ParseAndVerifyResult {
  verified: boolean;
  value?: SignedData; // Only included if the payload was verified
}

export default class Verifier {
  constructor(private readonly crypto: CryptoAdapter) {}

  /**
   * @param rawSignedData - The full OCMF signed meter data payload as sent by the charging station
   * @param publicKey - The public key for verifying the OCMF signed meter data payload
   * @return Result of verification. Note: if the payload was not verified, the parsed value is not included.
   */
  async parseAndVerify(
    rawSignedData: string,
    publicKey: EcPublicKey
  ): Promise<ParseAndVerifyResult> {
    const sections = decomposeValue(rawSignedData);
    const signedData = parseSections(sections);
    const { signature } = signedData;

    const signatureMethod = signatureMethodFromId(signature.SA);
    if (signatureMethod.curve !== publicKey.getCurve()) {
      throw new CurveMismatchError(
        `Expected ${publicKey.getCurve()}, actual ${signatureMethod.curve}`
      );
    }

    if (signature.SE && signature.SE !== 'hex') {
      throw new UnknownSignatureEncoding(
        'Only hex encoded signatures are supported'
      );
    }

    if (signature.SM && signature.SM !== 'application/x-der') {
      throw new UnknownSignatureMimeType(
        'Only application/x-der encoded signatures are supported'
      );
    }

    const textEncoder = new TextEncoder();
    const payloadDataSegment = textEncoder.encode(sections.payloadData);
    const signatureBytes = hexToBytes(signature.SD);

    const verified = await this.crypto.verify(
      signatureBytes,
      payloadDataSegment,
      publicKey,
      signatureMethod.hash,
      'sigvalue-der'
    );

    return {
      verified,
      value: verified ? signedData : undefined,
    };
  }
}

function hexToBytes(hex: string): Uint8Array {
  if (
    hex.length === 0 ||
    hex.length % 2 !== 0 ||
    !hex.match(/^[A-Za-f0-9]+$/)
  ) {
    throw new Error('Invalid hex string');
  }
  const bytes = hex.match(/.{2}/g)?.map((byte) => parseInt(byte, 16));
  if (!bytes) {
    throw new Error('Failed to map hex string');
  }
  return new Uint8Array(bytes);
}
