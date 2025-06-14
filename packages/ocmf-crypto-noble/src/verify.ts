import { EcPublicKey } from './public-key';
import { sha256 } from '@noble/hashes/sha2';
import { resolveCurveFn } from './curve';
import {
  Hash,
  SignatureFormat,
  UnsupportedHashError,
  UnsupportedSignatureFormatError,
} from '@road-labs/ocmf-crypto';

/**
 * @param signature - X.509 ECDSASigValue ASN.1 type DER encoded
 * @param data - Raw value
 * @param key - The public key to verify against
 * @param hash - Hash to apply
 * @param format - Signature format
 */
export default function verify(
  signature: Uint8Array,
  data: Uint8Array,
  key: EcPublicKey,
  hash: Hash,
  format: SignatureFormat
): boolean {
  if (hash !== 'SHA-256') {
    throw new UnsupportedHashError(`Invalid hash: ${hash}`);
  }
  if (format !== 'sigvalue-der') {
    throw new UnsupportedSignatureFormatError(
      `Invalid signature format: ${format}`
    );
  }

  return resolveCurveFn(key.getCurve()).verify(
    signature,
    sha256(data),
    key.getValue(),
    { format: 'der' }
  );
}
