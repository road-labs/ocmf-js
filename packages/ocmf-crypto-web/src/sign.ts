import { EcPrivateKey } from './private-key';
import {
  encodePkixEcdsaSigValue,
  Hash,
  SignatureFormat,
  UnsupportedHashError,
  UnsupportedSignatureFormatError,
} from '@road-labs/ocmf-crypto';

/**
 * @param data - Data to be signed
 * @param privateKey - Private key to use for signing
 * @param hash - Hash to apply
 * @param format - Signature format
 * @return X.509 ECDSASigValue ASN.1 type DER encoded
 */
export default async function sign(
  data: Uint8Array,
  privateKey: EcPrivateKey,
  hash: Hash,
  format: SignatureFormat
): Promise<Uint8Array> {
  if (hash !== 'SHA-256') {
    throw new UnsupportedHashError(`Invalid hash: ${hash}`);
  }
  if (format !== 'sigvalue-der') {
    throw new UnsupportedSignatureFormatError(
      `Invalid signature format: ${format}`
    );
  }

  const result = await crypto.subtle.sign(
    { name: 'ECDSA', hash },
    privateKey.getCryptoKey(),
    data
  );

  if (result.byteLength === 0 || result.byteLength % 2 !== 0) {
    throw new Error(`Unexpected signature length: ${result.byteLength}`);
  }

  const mid = result.byteLength / 2;
  const r = addSignByte(new Uint8Array(result.slice(0, mid)));
  const s = addSignByte(new Uint8Array(result.slice(mid, result.byteLength)));

  return encodePkixEcdsaSigValue({ r, s });
}

function addSignByte(bytes: Uint8Array): Uint8Array {
  if (bytes[0] < 0x80) {
    return bytes;
  }
  const signed = new Uint8Array(bytes.length + 1);
  signed.set(bytes, 1);
  return signed;
}
