import { signatureMethodFromId, SignatureMethodId } from './signature';
import { Header, PayloadData, Signature } from './types';
import { CryptoAdapter, EcPrivateKey } from '@road-labs/ocmf-crypto';
import { CurveMismatchError } from './errors';

export default class Signer {
  constructor(private readonly crypto: CryptoAdapter) {}

  /**
   * @param payload - Meter data payload to be signed
   * @param privateKey - Private key to use for signing
   * @param signatureMethodId - Signing method. Note: the curve indicated by the id must match that of the private key
   */
  public async sign(
    payload: PayloadData,
    privateKey: EcPrivateKey,
    signatureMethodId: SignatureMethodId
  ): Promise<string> {
    const signatureMethod = signatureMethodFromId(signatureMethodId);
    if (signatureMethod.curve !== privateKey.getCurve()) {
      throw new CurveMismatchError(
        `Expected ${privateKey.getCurve()}, actual ${signatureMethod.curve}`
      );
    }

    const payloadDataSegment = JSON.stringify(payload);
    const textEncoder = new TextEncoder();
    const payloadDataSegmentBytes = textEncoder.encode(payloadDataSegment);

    const signature = await this.crypto.sign(
      payloadDataSegmentBytes,
      privateKey,
      signatureMethod.hash,
      'sigvalue-der'
    );

    const signatureSegment = JSON.stringify({
      SA: signatureMethod.id,
      SD: bytesToHex(signature).toUpperCase(),
    } as Signature);

    return [Header, payloadDataSegment, signatureSegment].join('|');
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}
