import { EcPrivateKey } from './private-key';
import { sha256 } from '@noble/hashes/sha2';
import { resolveCurveFn } from './curve';
import {
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
export default function sign(
  data: Uint8Array,
  privateKey: EcPrivateKey,
  hash: Hash,
  format: SignatureFormat
): Uint8Array {
  if (hash !== 'SHA-256') {
    throw new UnsupportedHashError(`Invalid hash: ${hash}`);
  }
  if (format !== 'sigvalue-der') {
    throw new UnsupportedSignatureFormatError(
      `Invalid signature format: ${format}`
    );
  }

  return resolveCurveFn(privateKey.getCurve())
    .sign(sha256(data), privateKey.getValue())
    .toDERRawBytes();
}
